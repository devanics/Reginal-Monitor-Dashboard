'use client';

import React from 'react';

export default function PipelineWidget() {
  const pipeline = {
    id: 'abu-dhabi-crude',
    name: 'Abu Dhabi Crude Oil Pipeline',
    type: 'oil',
    status: 'operating',
    capacity: '1.8 million bpd',
    length: '200 km',
    operator: 'ADNOC',
    countries: ['UAE'],
    description: 'Major oil pipeline infrastructure. Currently operational and transporting resources.'
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-900 h-40 overflow-scroll rounded-lg p-1">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
           <div className="w-1 h-3.5 bg-red-500 rounded-px"></div>
           <h2 className="text-[10px] font-bold tracking-tight text-white uppercase italic">Abu Dhabi Pipeline</h2>
        </div>
        <div className="flex items-center gap-1 bg-red-900/20 px-1 py-0.5 rounded border border-red-500/20">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[8px] font-bold text-red-500 tracking-wider uppercase">Oil</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-3 shadow-md">
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Status</span>
              <span className="text-green-400 font-bold text-xs uppercase tracking-tight">Operating</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Capacity</span>
              <span className="text-green-400 font-bold text-xs lowercase tracking-tight">1.8m bpd</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Length</span>
              <span className="text-green-400 font-bold text-xs">{pipeline.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Operator</span>
              <span className="text-green-400 font-bold text-xs">{pipeline.operator}</span>
            </div>
        </div>

        <p className="text-gray-500 text-[10px] leading-relaxed border-t border-border/50 pt-2 line-clamp-2">
          {pipeline.description}
        </p>
      </div>
    </div>
  );
}
