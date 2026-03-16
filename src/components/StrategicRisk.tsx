"use client";

import React from 'react';

export default function StrategicRisk() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = () => {
      fetch('/api/strategic-risk')
        .then(res => res.json())
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget-card animate-pulse h-40 bg-white/5"></div>;

  const score = data?.global?.score ?? 55;
  const level = data?.global?.level ?? "ELEVATED";
  const trend = data?.global?.trend ?? "Stable";
  
  // Calculate stroke-dasharray/offset for the semi-circle gauge (180 degrees)
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'CRITICAL': return 'text-red-500';
      case 'ELEVATED': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <div className="flex items-center gap-2">
          <span className="widget-title">STRATEGIC RISK OVERVIEW</span>
          <span className="text-gray-500 cursor-help">ⓘ</span>
        </div>
        <span className="badge badge-live">LIVE</span>
      </div>
      <div className="widget-content flex items-center justify-around py-6">
        <div className="relative flex items-center justify-center w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              className={`${getLevelColor(level)} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className={`text-[10px] font-bold ${getLevelColor(level)} tracking-wider`}>{level}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Trend</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-white/10 p-1 rounded">
              {trend === 'Rising' ? '⬆️' : (trend === 'Falling' ? '⬇️' : '➡️')}
            </span>
            <span className="font-bold">{trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
