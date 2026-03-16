"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface IntelligenceBriefProps {
  customBrief?: string;
}

export default function IntelligenceBrief({ customBrief }: IntelligenceBriefProps) {
  const defaultBrief = `## Saudi Arabia: Intelligence Brief — ${new Date().toISOString().split('T')[0]}

1. Current Situation: Saudi Arabia currently maintains a stable, albeit watchful, internal environment with a Country Instability Index (CII) of 50/100. While there are no critical news alerts, the nation is experiencing localized concerns affecting movement.

2. Military & Security Posture: Security posture is elevated due to ongoing regional tensions. The presence of naval activity across the Middle East underscores a heightened state of readiness.

3. Key Indicators & Forecast: The upcoming weeks may observe a slight increase in security measures around major urban centers. Strategic reserves remain at optimal levels to mitigate any sudden supply chain disruptions.`;

  const content = customBrief || defaultBrief;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Intelligence Summary</h3>
        <span className="text-[10px] text-blue-400 font-mono">PREMIUM INTEL</span>
      </div>
      
      <div className="prose prose-invert prose-xs max-w-none text-gray-300 leading-relaxed font-serif">
         <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button className="text-[10px] flex items-center gap-1 text-gray-500 hover:text-white transition-colors">
          <span>📄</span>
          <span>Full Report</span>
        </button>
        <button className="text-[10px] flex items-center gap-1 text-gray-500 hover:text-white transition-colors">
          <span>🔔</span>
          <span>Alert Settings</span>
        </button>
      </div>
    </div>
  );
}
