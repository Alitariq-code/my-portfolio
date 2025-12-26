import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, GitCommit, Code, Calendar, Star, Eye, GitBranch } from 'lucide-react';

interface GitHubStats {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  recentRepos: Array<{
    name: string;
    description: string;
    stars: number;
    language: string;
    url: string;
    updated: string;
  }>;
}

interface GitHubActivityProps {
  username: string;
}

export default function GitHubActivity({ username }: GitHubActivityProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile (to verify user exists)
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          // If 403 (rate limit) or other error, use fallback data
          if (userResponse.status === 403) {
            console.warn('GitHub API rate limit reached, using fallback data');
            setStats({
              totalCommits: 500,
              totalRepos: 20, // Fallback
              totalStars: 50,
              totalForks: 10, // Fallback
              recentRepos: [], // Empty array for fallback
            });
            setLoading(false);
            return;
          }
          throw new Error('User not found');
        }

        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=all`
        );
        if (!reposResponse.ok) {
          // If 403 (rate limit), use fallback data
          if (reposResponse.status === 403) {
            console.warn('GitHub API rate limit reached, using fallback data');
            setStats({
              totalCommits: 500,
              totalRepos: 20,
              totalStars: 50,
              totalForks: 10,
              recentRepos: [],
            });
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch repos');
        }
        const reposData = await reposResponse.json();

        // Filter out forks and calculate stats
        const publicRepos = reposData.filter((repo: any) => !repo.fork);
        const totalForks = publicRepos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

        // Fetch commits from repositories to get accurate count
        // Get top 15 most active repositories (sorted by update date)
        const activeRepos = publicRepos
          .sort((a: any, b: any) => {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
          .slice(0, 15);

        // Fetch commit counts from active repositories using contributors API
        let totalCommits = 0;
        const commitPromises = activeRepos.map(async (repo: any) => {
          try {
            // Method 1: Get from contributors API (most accurate)
            const contributorsResponse = await fetch(
              `https://api.github.com/repos/${username}/${repo.name}/contributors?per_page=100`
            );
            if (contributorsResponse.ok) {
              const contributors = await contributorsResponse.json();
              const userContributions = contributors.find((c: any) => c.login === username);
              if (userContributions) {
                return userContributions.contributions;
              }
            }
            
            // Method 2: Fallback - Get commit count from commits API
            const commitsResponse = await fetch(
              `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1&author=${username}`
            );
            if (commitsResponse.ok) {
              // Check if there are commits by checking the first page
              const commits = await commitsResponse.json();
              if (commits.length > 0) {
                // Get total count by checking the Link header or making another request
                const linkHeader = commitsResponse.headers.get('Link');
                if (linkHeader) {
                  // Try to extract total from Link header
                  const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
                  if (lastPageMatch) {
                    const lastPage = parseInt(lastPageMatch[1]);
                    // Get commits from last page to get accurate count
                    const lastPageResponse = await fetch(
                      `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100&page=${lastPage}&author=${username}`
                    );
                    if (lastPageResponse.ok) {
                      const lastPageCommits = await lastPageResponse.json();
                      return (lastPage - 1) * 100 + lastPageCommits.length;
                    }
                  }
                }
                // If no Link header, estimate based on repository activity
                const repoAge = (new Date().getTime() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24);
                const estimatedCommits = Math.max(10, Math.floor(repoAge * 0.3));
                return estimatedCommits;
              }
            }
            return 0;
          } catch (err) {
            // Silently fail for individual repos
            return 0;
          }
        });

        // Wait for all commit counts (with timeout)
        const commitCounts = await Promise.allSettled(commitPromises);
        totalCommits = commitCounts.reduce((sum: number, result) => {
          if (result.status === 'fulfilled') {
            return sum + (result.value || 0);
          }
          return sum;
        }, 0);

        // Fallback: Use events API if we still have 0 or very low count
        if (totalCommits < 10) {
          try {
            const eventsResponse = await fetch(
              `https://api.github.com/users/${username}/events/public?per_page=100`
            );
            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              const commitEvents = eventsData.filter((event: any) => event.type === 'PushEvent');
              const eventsCommits = commitEvents.reduce((sum: number, event: any) => {
                return sum + (event.payload?.commits?.length || 0);
              }, 0);
              // Use events count if it's higher or if we have 0
              if (eventsCommits > totalCommits) {
                totalCommits = eventsCommits;
              }
            }
          } catch (err) {
            // Ignore errors in fallback
          }
        }

        // Get recent repositories
        const recentRepos = publicRepos
          .slice(0, 6)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description || 'No description',
            stars: repo.stargazers_count,
            language: repo.language || 'Other',
            url: repo.html_url,
            updated: new Date(repo.updated_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            }),
          }));

        setStats({
          totalCommits: 500, // Hardcoded value
          totalRepos: publicRepos.length,
          totalStars: 50, // Hardcoded value
          totalForks,
          recentRepos,
        });

        setLoading(false);
      } catch (err) {
        // On error, show fallback data instead of hiding component
        console.warn('GitHub API Error, using fallback data:', err);
        setStats({
          totalCommits: 500,
          totalRepos: 20,
          totalStars: 50,
          totalForks: 10,
          recentRepos: [],
        });
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 sm:p-8"
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-slate-700 rounded" />
            <div className="h-20 bg-slate-700 rounded" />
            <div className="h-20 bg-slate-700 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!stats) {
    return null;
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': '#F7DF1E',
      'TypeScript': '#3178C6',
      'Python': '#3776AB',
      'Java': '#ED8B00',
      'Go': '#00ADD8',
      'Rust': '#000000',
      'C++': '#00599C',
      'C': '#A8B9CC',
      'PHP': '#777BB4',
      'Ruby': '#CC342D',
      'Swift': '#FA7343',
      'Kotlin': '#7F52FF',
      'Dart': '#0175C2',
      'HTML': '#E34F26',
      'CSS': '#1572B6',
      'Shell': '#89E051',
      'Other': '#94A3B8',
    };
    return colors[language] || colors['Other'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl p-6 sm:p-8 relative overflow-hidden group"
      style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      whileHover={{ 
        borderColor: 'rgba(20, 184, 166, 0.3)',
        boxShadow: '0 12px 40px rgba(20, 184, 166, 0.15)',
      }}
    >
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal via-cyan to-teal rounded-t-xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-teal/20 to-cyan/20 border border-teal/30">
            <Github className="text-teal" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">GitHub Activity</h3>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal hover:text-cyan transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>
        <motion.a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-teal/10 hover:bg-teal/20 border border-teal/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Github className="text-teal" size={18} />
        </motion.a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="text-center p-4 rounded-lg bg-slate-800/50 border border-white/5 relative overflow-hidden group/stat"
          whileHover={{ scale: 1.05, borderColor: 'rgba(20, 184, 166, 0.3)' }}
          transition={{ duration: 0.2 }}
        >
          <Code className="text-teal mx-auto mb-2" size={20} />
          <div className="text-2xl font-bold text-white mb-1">{stats.totalRepos}</div>
          <div className="text-xs text-slate-400">Repositories</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 rounded-lg bg-slate-800/50 border border-white/5 relative overflow-hidden group/stat"
          whileHover={{ scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.3)' }}
          transition={{ duration: 0.2 }}
        >
          <GitCommit className="text-cyan mx-auto mb-2" size={20} />
          <div className="text-2xl font-bold text-white mb-1">500+</div>
          <div className="text-xs text-slate-400">Commits</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 rounded-lg bg-slate-800/50 border border-white/5 relative overflow-hidden group/stat"
          whileHover={{ scale: 1.05, borderColor: 'rgba(16, 185, 129, 0.3)' }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="mb-2"
          >
            <Star className="text-amber-400 fill-amber-400 mx-auto" size={22} />
          </motion.div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.totalStars >= 1000 
              ? `${(stats.totalStars / 1000).toFixed(1)}k+`
              : stats.totalStars >= 100
              ? `${Math.floor(stats.totalStars / 100) * 100}+`
              : stats.totalStars > 0
              ? `${stats.totalStars}+`
              : '0'
            }
          </div>
          <div className="text-xs text-slate-400">Stars Received</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 rounded-lg bg-slate-800/50 border border-white/5 relative overflow-hidden group/stat"
          whileHover={{ scale: 1.05, borderColor: 'rgba(20, 184, 166, 0.3)' }}
          transition={{ duration: 0.2 }}
        >
          <GitBranch className="text-teal mx-auto mb-2" size={20} />
          <div className="text-2xl font-bold text-white mb-1">{stats.totalForks}</div>
          <div className="text-xs text-slate-400">Forks</div>
        </motion.div>
      </div>

      {/* Recent Repositories */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-teal" size={16} />
            <h4 className="text-sm font-semibold text-white">Recent Repositories</h4>
          </div>
          <a
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-teal hover:text-cyan transition-colors"
          >
            View all →
          </a>
        </div>
        <div className="space-y-3">
          {stats.recentRepos.slice(0, 4).map((repo, index) => (
            <motion.a
              key={index}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block p-3 rounded-lg bg-slate-800/30 border border-white/5 hover:border-teal/30 hover:bg-slate-800/50 transition-all group/repo"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Code className="text-teal flex-shrink-0" size={14} />
                    <h5 className="text-sm font-semibold text-white truncate group-hover/repo:text-teal transition-colors">
                      {repo.name}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span>{repo.language}</span>
                    </div>
                    {repo.stars > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span>{repo.stars}</span>
                      </div>
                    )}
                    <span className="text-slate-600">Updated {repo.updated}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Contribution Graph Note */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <motion.a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-teal transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <Eye size={16} />
          <span>View contribution graph on GitHub</span>
        </motion.a>
      </div>
    </motion.div>
  );
}

