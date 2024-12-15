interface ProfileMetrics {
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  contributionLevel: string;
  activityScore: number;
  codeQuality: {
    reliability: number;
    security: number;
    maintainability: number;
  };
  percentileRank: number;
  streak: number;
  badges: string[];
}

export function analyzeProfile(
  repos: { stargazers_count: number; forks_count: number; }[],
  followers: number,
  totalCommits: number, // Using real commit count
  // streakData: { current: number; longest: number } // Added streak data
): ProfileMetrics {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  // Calculate activity score based on real commit count
  const activityScore = Math.min(
    Math.round(
      (totalStars * 2 + totalForks * 3 + followers + totalCommits / 100) / 7.2
    ),
    100
  );

  // Simulated code quality metrics
  const codeQuality = {
    reliability: Math.floor(Math.random() * 20) + 80,
    security: Math.floor(Math.random() * 20) + 80,
    maintainability: Math.floor(Math.random() * 20) + 80,
  };

  // Streak Data is Passed Here
  const streak =0;

  const percentileRank = Math.floor(Math.random() * 15) + 85; // Top percentage (only)

  const badges = getBadges(activityScore, totalStars, totalForks, totalCommits);

  return {
    totalStars,
    totalForks,
    totalCommits,
    contributionLevel: getContributionLevel(activityScore),
    activityScore,
    codeQuality,
    percentileRank,
    streak,
    badges,
  };
}

function getBadges(score: number, stars: number, forks: number, commits: number): string[] {
  const badges = [];
  if (score >= 90) badges.push('🏆 Elite');
  if (score >= 80 && score < 90) badges.push('🥇 High Achiever');
  if (score >= 70 && score < 60) badges.push('🎖️ Rising Star');
  if (score <= 60 && score >30) badges.push("🥉 Hard Working");
  if (score <= 30 && score >20) badges.push('🚶‍♂️ Slow Starter');
  if (score <= 20) badges.push("👀 Starter");

  if (stars >= 30 && stars < 80) badges.push('⭐ Star Collector');
  if (stars >= 80 && stars < 100) badges.push('☄️ Supernova');
  if (stars >= 100) badges.push("🛰️ Cosmic Starrer");
  if (stars <= 30 && stars >10) badges.push('🌃 Beginner Starrer');
  if (stars <= 10) badges.push('🌗 Starless');


  if (forks >= 50 && forks < 80) badges.push('🔱 Fork Master');
  if (forks >= 80 && forks < 100) badges.push('🍴 Fork King');
  if (forks >= 100) badges.push('👑 Fork Emperor');
  if (forks <= 50 &&  forks > 10) badges.push('🛌 Beginner Forker');
  if (forks <= 10) badges.push('😴 Forkless');

  if (commits < 10) badges.push("🌱 Non Commiter");
  if (commits > 10 && commits < 20) badges.push('⚡ Pro Committer');
  if (commits > 20 && commits <= 40) badges.push('🤖 Commit Machine');
  if (commits > 40 && commits < 100) badges.push('🚀 Commit Legend');
  if (commits > 100) badges.push('🔥 Code Beast');

  return badges;
}

function getContributionLevel(score: number): string {
  if (score >= 90) return 'Elite Developer';
  if (score >= 80) return 'Pro Contributor';
  if (score >= 70) return 'Active Maintainer';
  if (score >= 60) return 'Regular Contributor';
  if (score >= 40) return 'Rising Developer';
  return 'Open Source Enthusiast';
}
