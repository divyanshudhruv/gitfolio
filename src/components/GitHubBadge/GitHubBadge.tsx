import { Github, MapPin, Link as LinkIcon } from 'lucide-react';
import { GitHubStats } from './GitHubStats';
import { ProfileInfo } from './ProfileInfo';

export interface GitHubBadgeProps {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  blog?: string;
  followers: number;
  stars: number;
  forks: number;
  commits: number;
  activityScore: number;
  contributionLevel: string;
  streak: number;
  badges: string[];
}

export function GitHubBadge({
  username,
  name,
  avatar,
 bio,
  location,
  blog,
  followers,
  stars,
  forks,
  commits,
  activityScore,
  contributionLevel,
  streak,
  badges,
}: GitHubBadgeProps) {
  return (
    <div className="w-full max-w-sm bg-[#161b22] rounded-md shadow-xl overflow-hidden border border-gray-800 badge" style={{maxWidth:'375px'}}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="w-12 h-12 rounded-full border border-gray-800"
          />
          <div className="flex-1 min-w-0" style={{paddingTop:'5px'}}>
            <ProfileInfo name={name} username={username} bio={bio} />
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          {location && (
            <div className="flex items-center text-gray-400" >
              <MapPin className="w-3 h-3 mr-1" />
              <span className="text-xs">{location}</span>
            </div>
          )}
          
          {blog && (
            <div
              className="flex items-center text-gray-400"
              style={{ marginBottom: "20px" }}
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              <a
                href={blog.startsWith('http') ? blog : `https://${blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 hover:underline truncate"
              >
                {blog}
              </a>
            </div>
          )}
          <GitHubStats
            followers={followers}
            stars={stars}
            forks={forks}
            commits={commits}
            activityScore={activityScore}
            contributionLevel={contributionLevel}
            streak={streak}
            badges={badges}
          />
        </div>
        
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full bg-[#21262d] text-gray-100 py-1.5 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm"
        >
          <Github className="w-4 h-4" />
          <span>View Profile</span>
        </a>
      </div>
    </div>
  );
}