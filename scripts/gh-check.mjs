// Diagnose why the Hero contribution count differs from your GitHub profile.
//
//   node scripts/gh-check.mjs
//
// Reads GITHUB_TOKEN / GITHUB_LOGIN from .env.local (same as the app).

import { readFileSync } from "node:fs";

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local */
  }
}
loadEnv(".env.local");

const token = process.env.GITHUB_TOKEN;
const login = process.env.GITHUB_LOGIN ?? "rav-alt";

if (!token) {
  console.error("No GITHUB_TOKEN found in .env.local");
  process.exit(1);
}

const query = `
  query($login: String!) {
    viewer { login }
    user(login: $login) {
      login
      contributionsCollection {
        restrictedContributionsCount
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks { contributionDays { contributionCount } }
        }
      }
    }
  }
`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { login } }),
});

console.log("HTTP", res.status);
console.log("token scopes :", res.headers.get("x-oauth-scopes") ?? "(none reported — fine-grained or no-scope classic PAT)");

const json = await res.json();
if (json.errors) console.log("errors :", JSON.stringify(json.errors, null, 2));

const d = json.data;
if (!d) process.exit(1);

const sameAccount = d.viewer?.login?.toLowerCase() === login.toLowerCase();
const c = d.user?.contributionsCollection;
const cal = c?.contributionCalendar;
const sum = cal?.weeks?.reduce(
  (a, w) => a + w.contributionDays.reduce((s, x) => s + x.contributionCount, 0),
  0,
);

console.log("");
console.log("queried login     :", login);
console.log("token belongs to  :", d.viewer?.login, sameAccount ? "(same account OK)" : "(DIFFERENT ACCOUNT  <-- private contributions are hidden)");
console.log("user resolved      :", d.user?.login);
console.log("");
console.log("calendar.totalContributions          :", cal?.totalContributions);
console.log("sum of day counts (last ~year)       :", sum);
console.log("restrictedContributionsCount         :", c?.restrictedContributionsCount, "(private contribs not visible in detail)");
console.log("totalCommitContributions             :", c?.totalCommitContributions);
console.log("totalPullRequestContributions        :", c?.totalPullRequestContributions);
console.log("totalIssueContributions              :", c?.totalIssueContributions);
console.log("totalPullRequestReviewContributions  :", c?.totalPullRequestReviewContributions);
