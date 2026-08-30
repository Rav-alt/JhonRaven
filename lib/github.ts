import { contributionGrid } from "@/lib/data";

// Real GitHub contribution calendar for the Hero graph.
//
// The green grid is only exposed through GitHub's GraphQL API, which needs a
// token — a classic PAT with no scopes works, but only sees PUBLIC
// contributions. To count private ones, enable "Include private contributions
// on my profile" in GitHub settings (and/or give the PAT `repo` scope). Set
// GITHUB_TOKEN (and optionally GITHUB_LOGIN) in .env.local; without it, or if
// the request fails, this falls back to the seeded placeholder grid so local
// dev and tokenless builds still render.
//
// Only the most recent WEEKS_SHOWN weeks are kept, and `total` is the sum over
// that window — so the number and the grid always describe the same period.

const WEEKS_SHOWN = 30;

export type ContributionGraph = {
  total: number; // contributions across the visible ~30-week window
  weeks: number[][]; // ramp step 0-4 per day, oldest week first
  months: string[]; // one label per month spanned by the window
};

const LOGIN = process.env.GITHUB_LOGIN ?? "rav-alt";

const LEVEL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }
`;

type ApiDay = { date: string; contributionCount: number; contributionLevel: string };
type ApiWeek = { contributionDays: ApiDay[] };
type ApiResponse = {
  data?: { user?: { contributionsCollection?: { contributionCalendar?: { weeks: ApiWeek[] } } } };
  errors?: { message: string }[];
};

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fallback(): ContributionGraph {
  const weeks = contributionGrid(WEEKS_SHOWN);
  const total = weeks.reduce((sum, w) => sum + w.reduce((s, level) => s + level, 0), 0);
  const now = new Date();
  const months = [2, 1, 0].map((back) => MONTH_ABBR[(now.getUTCMonth() - back + 12) % 12]);
  return { total, weeks, months };
}

/** One label per month change across the visible weeks (keyed off each week's first day). */
function monthLabels(weeks: ApiWeek[]): string[] {
  const labels: string[] = [];
  let last = -1;
  for (const week of weeks) {
    const first = week.contributionDays[0];
    if (!first) continue;
    const m = new Date(first.date).getUTCMonth();
    if (m !== last) {
      labels.push(MONTH_ABBR[m]);
      last = m;
    }
  }
  return labels;
}

export async function getContributions(): Promise<ContributionGraph> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return fallback();

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback();

    const json = (await res.json()) as ApiResponse;
    const allWeeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!allWeeks?.length) return fallback();

    const weeks = allWeeks.slice(-WEEKS_SHOWN);
    const grid = weeks.map((w) => w.contributionDays.map((d) => LEVEL[d.contributionLevel] ?? 0));
    const total = weeks.reduce(
      (sum, w) => sum + w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
      0,
    );

    return { total, weeks: grid, months: monthLabels(weeks) };
  } catch {
    return fallback();
  }
}
