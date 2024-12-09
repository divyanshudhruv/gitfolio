import React, { useState } from 'react';
import { GitHubBadge } from './components/GitHubBadge/GitHubBadge';
import { fetchGitHubProfile, fetchUserRepos, fetchCommitCount } from './services/github';
import { analyzeProfile } from './utils/profileAnalyzer';
import { Search } from 'lucide-react';
import APIUsage from './services/ApiUsage';

export default function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError('');

    try {
      const profile = await fetchGitHubProfile(username);
      const repos = await fetchUserRepos(username);
      const commits = await fetchCommitCount(username); // Fetch total commits

      // Fetch streak data from GitHub
      const streakData = await fetchStreakData(username);

      const metrics = analyzeProfile(repos, profile.followers, commits, streakData); // Pass streak data

      setProfileData({
        ...profile,
        ...metrics,
        streak: streakData,  // Add streak data to the profile data
      });
    } catch (err) {
      setError('User not found or API rate limit exceeded');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="bgPattern flex flex-col"
    style={{ minHeight: "100vh" }}
  >
    <div
      className="badge pt-10 px-4 flex flex-col items-center text-gray-100"
      style={{
        color: "#ddd",
        fontSize: "80px",
        fontFamily: "monospace",
        fontWeight: "bold",
      }}
    >
      GitFolio
    </div>
    <div
      className="pt-10 px-4 flex flex-col items-center flex-1"
      style={{ flex: "1" }} // Ensures this section grows and shrinks
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
        {error && (
          <p className="mt-2 text-red-400 text-sm">{error}</p>
        )}
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
          badges={profileData.badges}
        />
      )}
    </div>
    <br />
    <div
      className="footer"

    >
      Made by <a href='https://github.com/divyanshudhruv' target='_black'>divyanshudhruv</a> | <a href="https://github.com/divyanshudhruv/gitfolio" target='_blank'>Github</a>
    </div>
    <APIUsage />
  </div>
  
  );
}

async function fetchStreakData(username: string) {
  try {
    // Use the username variable to dynamically fetch the user's events
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const events = await response.json();

    // Extract dates from events (filtering push events as commits)
    const commitDates = events
      .filter((event: any) => event.type === 'PushEvent')  // Only look for PushEvent (commits)
      .map((event: any) => new Date(event.created_at).toISOString().split('T')[0]);

    if (commitDates.length === 0) {
      return {
        current: 0,
        longest: 0,
      };
    }

    // Calculate streaks
    const sortedDates = commitDates.sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
    const streaks = calculateStreaks(sortedDates);

    return streaks;

  } catch (error) {
    console.error(error);
    return {
      current: 0,
      longest: 0,
    };
  }
}

function calculateStreaks(dates: string[]) {
  let currentStreak = 1;
  let longestStreak = 1;
  let currentMax = 1;

  // Compare consecutive commit dates to calculate streaks
  for (let i = 1; i < dates.length; i++) {
    const previousDate = new Date(dates[i - 1]);
    const currentDate = new Date(dates[i]);

    const differenceInDays = (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24);

    if (differenceInDays === 1) {
      // Consecutive day, increase streak
      currentStreak++;
    } else {
      // Break in streak, check if longest streak needs updating
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1; // Reset current streak
    }

    currentMax = Math.max(currentMax, currentStreak);
  }

  longestStreak = Math.max(longestStreak, currentStreak); // Check the final streak

  return {
    // current: currentMax,
    // longest: longestStreak,
    current: 0,
    longest: 0,
  };
}
