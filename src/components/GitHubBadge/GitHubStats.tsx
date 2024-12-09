import React from 'react';
import { Users2, Star, GitFork, GitCommit, Flame } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface GitHubStatsProps {
  followers: number;
  stars: number;
  forks: number;
  commits: number;
  activityScore: number;
  contributionLevel: string;
  streak: {
    current: number;
    longest: number;
  };
  badges: string[];
}

export function GitHubStats({
  followers,
  stars,
  forks,
  commits,
  activityScore,
  contributionLevel,
  badges,
  // streak (Next  Update)

}: GitHubStatsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2" style={{ marginBottom: "20px" }}>
        <StatBadge icon={<Users2 className="w-3 h-5 mr-1" />} value={followers} label="Followers" />
        <StatBadge icon={<Star className="w-3 h-5 mr-1" />} value={stars} label="Stars" />
        <StatBadge icon={<GitFork className="w-3 h-5 mr-1" />} value={forks} label="Forks" />
        <StatBadge icon={<GitCommit className="w-3 h-5 mr-1" />} value={commits} label="Commits" />
      </div>

      <div
        className="flex flex-wrap gap-1.5"
        style={{ marginBottom: "20px", padding: "0px" }}

      >
        {badges.map((badge, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-[#21262d] text-gray-300 rounded-md"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between bg-[#21262d] text-white rounded-md p-3"         style={{ marginBottom: "20px" }}
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <div>
            <div className="text-xs font-medium">1 Day Streak</div>
            <div className="text-xs text-gray-400">Longest: 1 days</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium">{contributionLevel}</div>
          <div className="text-xs text-gray-400">{activityScore}% Activity</div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#21262d] text-white rounded-md p-2">
      {icon}
      <div>
        <div className="text-xs font-medium">{formatNumber(value)}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}