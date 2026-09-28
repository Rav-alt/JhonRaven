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
// Each day keeps its date and raw count so the graph can show a GitHub-style
// "N contributions on <date>" tooltip on hover / keyboard focus.

const WEEKS_SHOWN = 30;

export type ContributionDay = {
  date: string; // YYYY-MM-DD (GitHub's calendar date, no time zone)
  count: number; // contributions that day
  level: number; // ramp step 0-4
};

export type ContributionGraph = {
  total: number; // contributions across the visible ~30-week window
  weeks: ContributionDay[][]; // Sun→Sat per week, oldest week first; last week may be partial
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

const DAY_MS = 86_400_000;
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Placeholder calendar: real dates ending today (Sun→Sat columns like
 *  GitHub's), seeded levels, and a plausible count per level. */
function fallback(): ContributionGraph {
  const levels = contributionGrid(WEEKS_SHOWN);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const firstSunday = today - new Date(today).getUTCDay() * DAY_MS - (WEEKS_SHOWN - 1) * 7 * DAY_MS;

  const weeks: ContributionDay[][] = levels.map((week, wi) =>
    week
      .map((level, di) => {
        const t = firstSunday + (wi * 7 + di) * DAY_MS;
        // Deterministic spread so level 2 isn't always exactly "4".
        const count = level === 0 ? 0 : level * 3 - ((wi + di) % 3);
        return { t, day: { date: isoDate(new Date(t)), count, level } };
      })
      .filter(({ t }) => t <= today)
      .map(({ day }) => day),
  );

  const total = weeks.reduce((sum, w) => sum + w.reduce((s, d) => s + d.count, 0), 0);
  return { total, weeks, months: monthLabels(weeks) };
}

/** One label per month change across the visible weeks (keyed off each week's first day). */
function monthLabels(weeks: ContributionDay[][]): string[] {
  const labels: string[] = [];
  let last = -1;
  for (const week of weeks) {
    const first = week[0];
    if (!first) continue;
    const m = Number(first.date.slice(5, 7)) - 1;
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

    const weeks: ContributionDay[][] = allWeeks.slice(-WEEKS_SHOWN).map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL[d.contributionLevel] ?? 0,
      })),
    );
    const total = weeks.reduce((sum, w) => sum + w.reduce((s, d) => s + d.count, 0), 0);

    return { total, weeks, months: monthLabels(weeks) };
  } catch {
    return fallback();
  }
}
