"use client";

import React, { useState, useEffect } from 'react';
import { Twitter, MessageSquare, Repeat2, Heart, Share } from 'lucide-react';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  user: {
    name: string;
    username: string;
  };
}

export default function XFeedWidget() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await fetch('/api/x-feed');
        const data = await res.json();
        if (data.tweets) {
          setTweets(data.tweets);
        }
      } catch (err) {
        console.error('Failed to fetch tweets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="widget-card bg-black/40 border border-white/5 rounded-lg p-4 h-[400px] animate-pulse">
        <div className="h-4 bg-white/5 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-white/5 rounded"></div>
          <div className="h-20 bg-white/5 rounded"></div>
          <div className="h-20 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-card bg-[#0a0a0a] border border-[#1d9bf0]/20 rounded-lg overflow-hidden flex flex-col h-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1d9bf0]/5 border-b border-[#1d9bf0]/10">
        <div className="flex items-center gap-2">
          <Twitter className="w-4 h-4 text-[#1d9bf0]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live Intel Feed</span>
        </div>
        <span className="text-[10px] font-mono text-[#1d9bf0] animate-pulse">CONNECTION_ACTIVE</span>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {tweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 text-[10px] uppercase">
            No live transmissions detected
          </div>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="p-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#1d9bf0]/20 flex items-center justify-center text-[10px] font-bold text-[#1d9bf0] border border-[#1d9bf0]/30">
                  AA
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white leading-none">{tweet.user.name}</span>
                  <span className="text-[9px] text-gray-500">@{tweet.user.username}</span>
                </div>
                <span className="ml-auto text-[9px] text-gray-600 font-mono">
                  {new Date(tweet.tweet_time || tweet.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-[11px] text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap dir-rtl text-right font-medium">
                {tweet.text}
              </p>

              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d9bf0] transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-[8px]">RAW</span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#00ba7c] transition-colors">
                  <Repeat2 className="w-3 h-3" />
                  <span className="text-[8px]">RELAY</span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#f91880] transition-colors">
                  <Heart className="w-3 h-3" />
                  <span className="text-[8px]">LOG</span>
                </div>
                <Share className="w-3 h-3 ml-auto cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 bg-black/60 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-green-500"></div>
          <span className="text-[8px] text-gray-500 uppercase tracking-tighter">Target: AlArabiya_Broadcasting</span>
        </div>
        <span className="text-[8px] text-[#1d9bf0] font-bold uppercase tracking-widest">Secure Link Layer</span>
      </div>
    </div>
  );
}
