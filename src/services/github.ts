import axios from 'axios';

const BASE_URL = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
    };
  };
}

// Removed the PAT from the headers
const headers = {};

export async function fetchGitHubProfile(username: string) {
  try {
    const { data } = await axios.get<GitHubUser>(`${BASE_URL}/users/${username}`, { headers });
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function fetchUserRepos(username: string) {
  try {
    const { data } = await axios.get<GitHubRepo[]>(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`, { headers });
    return data;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
}


const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

// GraphQL response type
interface GraphQLResponse {
  data: {
    user: {
      repositories: {
        edges: Array<{
          node: {
            defaultBranchRef: {
              target: {
                history: {
                  totalCount: number;
                };
              };
            };
          };
        }>;
      };
    };
  };
}

export async function fetchCommitCount(username: string): Promise<number> {
  const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT; // Use env variable for server-side

  if (!GITHUB_PAT) {
    throw new Error("GitHub PAT is missing. Ensure it's set in environment variables.");
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        repositories(first: 100, isFork: false) {
          edges {
            node {
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { username };

  try {
    const response = await axios.post<GraphQLResponse>(
      GITHUB_GRAPHQL_API,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
          Accept: "application/json",
        },
      }
    );

    // Explicitly typing the result of the reduce function
    const repositories = response.data.data.user.repositories.edges;

    const totalCommits = repositories.reduce((sum: number, repo) => {
      const commits =
        repo.node.defaultBranchRef?.target?.history?.totalCount || 0;
      return sum + commits;
    }, 0);

    return totalCommits;
  } catch (error) {
    console.error("Error fetching commits:", error);
    throw error;
  }
}

export async function fetchCurrentStreak(username: string): Promise<number> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const variables = { username };

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_PAT}`, // use environment variable
          "Content-Type": "application/json",
        },
      }
    );

    const weeks = response.data.data.user.contributionsCollection.contributionCalendar.weeks;
    const days = weeks.flatMap((week: any) => week.contributionDays);

    // Calculate streak
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak; 
  } catch (error) {
    console.error("Error fetching streak:", error);
    throw error;
  }
}


export async function fetchHighestStreak(username: string): Promise<number> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const variables = { username };

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_PAT}`, // use environment variable
          "Content-Type": "application/json",
        },
      }
    );

    const weeks = response.data.data.user.contributionsCollection.contributionCalendar.weeks;
    const days = weeks.flatMap((week: any) => week.contributionDays);

    // Calculate highest streak
    let maxStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].contributionCount > 0) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
      }
    }

    // Final comparison in case the longest streak is at the end of the data
    maxStreak = Math.max(maxStreak, currentStreak);

    return maxStreak; 
  } catch (error) {
    console.error("Error fetching highest streak:", error);
    throw error;
  }
}