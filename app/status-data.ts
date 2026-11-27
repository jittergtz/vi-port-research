export const statusRefreshMinutes = 5;
export const githubPollInterval = statusRefreshMinutes * 60_000;
export const statusCheckInterval = 60_000;

type Activity = {
  title: string;
  url: string;
  date: string;
};

export type Discussion = Activity & { number: number };

export type RepositoryStatus = {
  checkedAt: string;
  openIssues: number;
  openPullRequests: number;
  commits: (Activity & { sha: string })[];
  issues: Discussion[];
  pullRequests: Discussion[];
  release: Activity | null;
};

export type StatusResponse = {
  data: RepositoryStatus | null;
  stale: boolean;
};
