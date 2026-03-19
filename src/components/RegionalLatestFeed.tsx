"use client";

import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  status: 'critical' | 'elevated' | 'normal';
  time: string;
  source?: string;
}

export default function RegionalLatestFeed() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/regional-news-articles')
        .then(res => res.json())
        .then(data => {
          if (data.articles?.length > 0) setArticles(data.articles);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'elevated') return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (loading) return <div className="widget-card animate-pulse h-48 bg-white/5" />;

  return (
    <div className="widget-card border-l-0 border-r-0 rounded-none bg-transparent flex flex-col h-60">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-white/5 border-b border-white/5">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Latest Regional Feed</span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Status Summary */}
      <div className="p-2 bg-orange-500/5 border-b border-white/5">
        <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Region Summary</div>
        <div className="text-[10px] leading-tight text-white italic">
          "Elevated multi-theatre activity across the Gulf — monitoring ongoing."
        </div>
      </div>

      {/* Feed list */}
      <div className="widget-content !p-0 flex-1 overflow-y-auto">
        {articles.length === 0 ? (
          <div className="p-3 text-[10px] text-gray-500">Syncing regional feed...</div>
        ) : (
          <div className="flex flex-col">
            {articles.map((item) => (
              <div
                key={item.id}
                className="p-2 border-b border-white/5 flex gap-2 items-start hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${getStatusColor(item.status)} shadow-[0_0_5px_rgba(0,0,0,0.5)]`} />
                <div className="flex flex-col gap-0.5">
                  <div className="text-[10px] leading-tight text-gray-200">{item.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500">{item.time}</span>
                    {item.source && (
                      <span className="text-[8px] text-gray-600 font-bold uppercase">{item.source}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
