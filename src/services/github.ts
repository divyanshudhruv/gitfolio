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

export async function fetchCommitCount(): Promise<number> {
  return 50;
}


// Example usage
