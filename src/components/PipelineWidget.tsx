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
  const [pipelines, setPipelines] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/pipelines')
      .then(res => res.json())
      .then(json => {
        setPipelines(json.pipelines || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-card animate-pulse h-40 bg-white/5"></div>;

  return (
    <div className="widget-card">
      <div className="widget-header">
        <div className="flex items-center gap-2">
          <span className="widget-title">CRITICAL PIPELINES</span>
          <span className="text-gray-500 cursor-help">ⓘ</span>
        </div>
        <span className="badge badge-normal">{pipelines.length} MONITORED</span>
      </div>
      <div className=" flex flex-col gap-3 bg-gray-900 h-40 overflow-scroll rounded-lg p-1">
        {pipelines.map(p => (
          <div key={p.id} className="p-3 bg-white/5 rounded flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">{p.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${p.status === 'operational' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {p.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase">Flow Rate</span>
                <span className="text-sm font-mono text-blue-400 font-bold">{p.flow}</span>
              </div>
              <div className="flex-1">
                <div className="w-full h-1 bg-gray-800 rounded-full mt-3">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase">Trend</span>
                <span className={`text-[10px] font-bold ${p.trend === 'rising' ? 'text-green-500' : 'text-gray-400'}`}>
                  {p.trend === 'rising' ? '▲' : '▬'} {p.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
