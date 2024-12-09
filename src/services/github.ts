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

export async function fetchCommitCount(username: string): Promise<number> {
  // Calculate the "last 7 days" range
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const since = sevenDaysAgo.toISOString();
  const until = today.toISOString();

  let totalCommits = 0;

  try {
    let page = 1;
    let hasMoreRepos = true;

    while (hasMoreRepos) {
      // Fetch repositories page by page
      const reposResponse = await axios.get(`${BASE_URL}/users/${username}/repos?per_page=100&page=${page}`, { headers });
      const repos = reposResponse.data;

      if (repos.length === 0) {
        hasMoreRepos = false;
        break;
      }

       for (const repo of repos) {
         try {
           // Fetch commits for each repository within the past week
           const commitsResponse = await axios.get(
             `${BASE_URL}/repos/${username}/${repo.name}/commits?since=${since}&until=${until}`,
             { headers }
           );
           totalCommits += commitsResponse.data.length;
         } catch (commitError) {
           // Handle individual repo errors gracefully
           console.warn(`Error fetching commits for repo. Skipping...`);
           continue;
         }
       }

      page++;
    }

    return totalCommits;
  } catch (error) {
    console.error('Error fetching repositories.');
    return 0; // Return 0 on failure
  }
}

// Example usage
fetchCommitCount('username-here').then((count) => console.log(count));
