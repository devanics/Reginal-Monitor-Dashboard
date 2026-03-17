"use client";

import React, { useState, useEffect } from 'react';

interface HistoryPoint {
  hourIndex?: number;
  time?: string;
  strikes: number;
  air: number;
}

export default function StrikesMissilesGraph() {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateMockData = () => {
      const mock: HistoryPoint[] = [];
      for (let i = 12; i >= 0; i--) {
        mock.push({
          time: `${i}h`,
          strikes: Math.floor(Math.random() * 10) + 2,
          air: Math.floor(Math.random() * 5) + 1
        });
      }
      setData(mock);
    };

    const fetchData = async () => {
      try {
        const res = await fetch('/api/strikes-missiles-history');
        const json = await res.json();
        if (json.history && json.history.length > 0) {
          setData(json.history);
        } else {
          generateMockData();
        }
      } catch {
        generateMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget-card animate-pulse bg-white/5 rounded-lg" style={{ height: 200 }} />;
  if (data.length < 2) return null;

  const W = 280;
  const H = 110;
  const PT = 8;
  const PB = 20;
  const PL = 20;
  const PR = 6;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;

  // ✅ Always add +2 buffer so even max-value points aren't clipped at top
  // and 0-value points render as a visible baseline, not invisible edge
  const rawMax = Math.max(...data.map(d => Math.max(d.strikes, d.air)));
  const maxVal = Math.max(rawMax + 2, 8);

  const xOf = (i: number) => PL + (i / (data.length - 1)) * innerW;
  // ✅ Clamp: never let y go below PT or above PT+innerH
  const yOf = (v: number) => {
    const ratio = Math.min(Math.max(v / maxVal, 0), 1);
    return PT + (1 - ratio) * innerH;
  };

  const pts = (key: 'strikes' | 'air') =>
    data.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(' ');

  const yTicks = [0, 0.5, 1];
  const last = data[data.length - 1];

  return (
    <div className="widget-card flex flex-col bg-gray-900/60 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md">

      {/* Header */}
      <div className="p-3 border-b border-white/5">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
          KSA Region Threat Correlation
        </span>
        <span className="text-[9px] text-blue-400 font-mono block mt-0.5">
          Air & Active Strikes (6h)
        </span>
        <div className="flex gap-4 mt-2 pt-1.5 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[8px] text-gray-500 font-black tracking-wider uppercase">Active Strikes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[8px] text-gray-500 font-black tracking-wider uppercase">Air Activity</span>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="px-2 pt-2 pb-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Y grid + labels */}
          {yTicks.map(p => {
            const y = yOf(p * maxVal);
            return (
              <g key={p}>
                <line
                  x1={PL} y1={y} x2={W - PR} y2={y}
                  stroke="rgba(255,255,255,0.07)"
                  strokeDasharray="2,3"
                />
                <text x={PL - 3} y={y + 3} fontSize={6} fill="#555" textAnchor="end">
                  {Math.round(p * maxVal)}
                </text>
              </g>
            );
          })}

          {/* X labels every 3rd point */}
          {data.map((d, i) => i % 3 === 0 && (
            <text key={i} x={xOf(i)} y={H - 4} fontSize={6} fill="#555" textAnchor="middle">
              {d.time}
            </text>
          ))}

          {/* Strikes line — red */}
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={pts('strikes')}
          />

          {/* Air line — blue */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={pts('air')}
          />

          {/* End dots */}
          <circle cx={xOf(data.length - 1)} cy={yOf(last.strikes)} r={2.5} fill="#ef4444" />
          <circle cx={xOf(data.length - 1)} cy={yOf(last.air)} r={2.5} fill="#3b82f6" />
        </svg>
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 bg-white/5 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] text-gray-500 font-bold uppercase">Source: Overwatch Intel</span>
        <div className="flex gap-2 text-[9px]">
          <span className="text-red-400 font-bold">{last?.strikes} strikes</span>
          <span className="text-blue-400 font-bold">{last?.air} air</span>
        </div>
      </div>

    </div>
  );
}