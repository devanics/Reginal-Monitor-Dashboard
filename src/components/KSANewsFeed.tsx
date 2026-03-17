"use client";

import React, { useState, useEffect } from 'react';

const KSANewsFeed = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/ksa-conflict-summary')
        .then((res) => res.json())
        .then((data: any) => {
          // Use real articles if available, otherwise fallback
          if (data.articles && data.articles.length > 0) {
            const formatted = data.articles.slice(0, 10).map((a: any, index: number) => ({
              id: index,
              title: a.title,
              status: index % 3 === 0 ? 'critical' : (index % 2 === 0 ? 'elevated' : 'normal'),
              time: new Date(a.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setData(formatted);
          } else {
            setData([
              { id: 1, title: "No recent articles found for KSA. 🟢", status: "normal", time: "now" }
            ]);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'elevated': return 'bg-orange-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="widget-card border-l-0 border-r-0 rounded-none bg-transparent flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
           <span className="text-[9px] font-bold text-gray-500 uppercase">Live KSA Feed</span>
           {/* <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <span className="text-[10px] font-bold text-yellow-500">SCORE: 68</span>
           </div> */}
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
      </div>
      
      <div className="p-2 bg-yellow-500/5 border-b border-white/5">
         <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Status Summary</div>
         <div className="text-[10px] leading-tight text-white italic">"Elevated activity near western borders; commercial hubs remain stable."</div>
      </div>

      <div className="widget-content !p-0 flex-1 overflow-y-auto">
        {isLoading ? (
           <div className="p-3 text-[10px] text-gray-500">Syncing feed...</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item) => (
              <div key={item.id} className="p-2 border-b border-white/5 flex gap-2 items-start hover:bg-white/5 transition-colors cursor-pointer">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${getStatusColor(item.status)} shadow-[0_0_5px_rgba(0,0,0,0.5)]`}></div>
                <div className="flex flex-col gap-0.5">
                   <div className="text-[10px] leading-tight text-gray-200">{item.title}</div>
                   <div className="text-[8px] text-gray-500">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KSANewsFeed;
