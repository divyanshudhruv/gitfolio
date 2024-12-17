import React, { useState } from "react";
import { GitHubBadge } from "./components/GitHubBadge/GitHubBadge";
import {
  fetchCommitCount,
  fetchGitHubProfile,
  fetchUserRepos,
  fetchCurrentStreak,
  fetchHighestStreak, 
} from "./services/github";
import { analyzeProfile } from "./utils/profileAnalyzer";
import { Search } from "lucide-react";
import APIUsage from "./services/ApiUsage";

export default function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError("");

    try {
      // Fetch data for profile, repos, commits, current streak, and highest streak
      const profile = await fetchGitHubProfile(username);
      const repos = await fetchUserRepos(username);
      const commits = await fetchCommitCount(username);
      const streakData = await fetchCurrentStreak(username); 
      const highestStreakData = await fetchHighestStreak(username); 

      const metrics = analyzeProfile(repos, profile.followers, commits);

      setProfileData({
        ...profile,
        ...metrics,
        totalCommits: commits,
        streak: streakData,
        highestStreak: highestStreakData, 
      });
    } catch (err) {
      setError("User not found or API rate limit exceeded");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bgPattern flex flex-col" style={{ minHeight: "100vh" }}>
      <div
        className="badge pt-10 px-4 flex flex-col items-center text-gray-100 text-main"
        style={{
          color: "#ddd",
          fontSize: "80px",
          fontFamily: "monospace",
          fontWeight: "bold",
          zIndex: 99,
        }}
      >
        GitFolio
      </div>
      <div
        className="pt-10 px-4 flex flex-col items-center flex-1"
        style={{ flex: "1" }}
      >
        <div className="w-full max-w-md mb-8">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full px-4 py-3 rounded-md bg-[#161b22] border border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !username}
              className="px-4 py-2 bg-[#12161d] text-gray-400 rounded-md hover:bg-gray-800 disabled:opacity-80 disabled:cursor-not-allowed flex items-center gap-2 border border-gray-800 text-sm"
            >
              <Search className="w-4 h-4" style={{ marginRight: "5px" }} />
              Generate
            </button>
          </form>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>
        <br />
        {profileData && (
          <GitHubBadge
            username={profileData.login}
            name={profileData.name || profileData.login}
            avatar={profileData.avatar_url}
            bio={profileData.bio || ""}
            location={profileData.location ? `${profileData.location}` : "unknown"}
            blog={profileData.blog ? `${profileData.blog}` : "none"}
            followers={profileData.followers}
            stars={profileData.totalStars}
            forks={profileData.totalForks}
            commits={profileData.totalCommits}
            activityScore={profileData.activityScore}
            contributionLevel={profileData.contributionLevel}
            streak={profileData.streak} 
            longestStreak={profileData.highestStreak} 
            badges={profileData.badges}
          />
        )}
      </div>
      <br />
      <div className="footer">
        Made by{" "}
        <a href="https://github.com/divyanshudhruv" target="_black">
          divyanshudhruv
        </a>{" "}
        |{" "}
        <a href="https://github.com/divyanshudhruv/gitfolio" target="_blank">
          Github
        </a>
      </div>
      <APIUsage />
    </div>
  );
}
