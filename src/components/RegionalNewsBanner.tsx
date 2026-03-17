"use client";

import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  status: 'critical' | 'elevated' | 'normal';
  time: string;
  source?: string;
}

export default function RegionalNewsBanner() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles list 
        const [feedRes, summaryRes] = await Promise.all([
          fetch('/api/regional-news-articles'),
          fetch('/api/regionalNews'),
        ]);
        const feedData = await feedRes.json();
        const summaryData = await summaryRes.json();
        if (feedData.articles?.length > 0) setArticles(feedData.articles);
        if (summaryData.summary) setSummary(summaryData.summary);
      } catch (e) {
        console.error('RegionalNewsBanner fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getDotColor = (status: string) => {
    if (status === 'critical') return 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]';
    if (status === 'elevated') return 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.7)]';
    return 'bg-green-500';
  };

  if (loading) return <div className="widget-card animate-pulse h-28 bg-white/5" />;

  return (
    <div className="widget-card bg-black/60 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_red]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Regional Intel Feed</span>
        </div>
        <span className="text-[9px] font-mono text-blue-400 uppercase">LIVE</span>
      </div>

      {/* AI Summary strip */}
      {summary && (
        <div className="px-3 py-1.5 bg-orange-500/5 border-b border-orange-500/10">
          <span className="text-[10px] text-orange-300 font-medium italic leading-snug">{summary}</span>
        </div>
      )}

      {/* News headlines scrollable list */}
      <div className="flex flex-col divide-y divide-white/5 max-h-[160px] overflow-y-auto custom-scrollbar">
        {articles.length === 0 ? (
          <div className="px-3 py-2 text-[10px] text-gray-500">Syncing regional intel...</div>
        ) : (
          articles.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className={`mt-[3px] shrink-0 w-2 h-2 rounded-full ${getDotColor(item.status)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] leading-tight text-gray-200 line-clamp-2">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] text-gray-600 font-mono">{item.time}</span>
                  {item.source && (
                    <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tight">{item.source}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
