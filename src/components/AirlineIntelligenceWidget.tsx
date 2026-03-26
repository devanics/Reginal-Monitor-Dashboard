"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Building, Activity, Radio, RefreshCw } from 'lucide-react';

const TABS = [
    { id: 'ops', label: 'Ops', icon: Activity },
    { id: 'flights', label: 'Flights', icon: Plane },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AirlineIntelligenceWidget() {
    const [activeTab, setActiveTab] = useState<TabId>('ops');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = (tab: TabId) => {
        setLoading(true);
        fetch(`/api/airline-intelligence?type=${tab}`)
            .then(res => res.json())
            .then(json => {
                setData(json.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData(activeTab);
        const interval = setInterval(() => fetchData(activeTab), 300000);
        return () => clearInterval(interval);
    }, [activeTab]);

    return (
        <div className="widget-card flex flex-col h-60 bg-[#0a0a0a]/90 border border-white/5 rounded-none overflow-y-auto font-sans">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Plane size={16} className="text-blue-400" />
                        <span className="text-[11px] font-bold text-gray-200 uppercase tracking-[0.2em]">Airline Intelligence</span>
                    </div>
                    <button onClick={() => fetchData(activeTab)} className="text-gray-500 hover:text-white transition-colors">
                        <RefreshCw size={14} className="opacity-60 hover:opacity-100" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-2 text-[11px] font-bold transition-all relative ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Icon size={12} className={active ? 'text-blue-400' : 'text-gray-600'} />
                                {tab.label}
                                {active && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-white/5 animate-pulse rounded w-full"></div>)}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {activeTab === 'ops' && data.map((item: any) => (
                            <div key={item.iata} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] group transition-colors overflow-hidden">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <span className="text-[13px] font-black text-white font-mono w-10 shrink-0">{item.iata}</span>
                                    <span className="text-[11px] text-gray-400 font-medium truncate shrink-1">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-3">
                                    <span className={`text-[10px] font-bold tracking-wider ${item.status === 'DELAYED' ? 'text-orange-500' : 'text-green-500'}`}>
                                        {item.status}
                                    </span>
                                    <span className="text-gray-700 text-xs">—</span>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'flights' && data.map((item: any) => (
                            <div key={item.num} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-[12px] font-bold text-blue-400 font-mono w-14">{item.num}</span>
                                    <span className="text-[11px] text-gray-300 font-medium">{item.route}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${item.status === 'boarding' ? 'text-blue-400' :
                                            item.status === 'departed' ? 'text-purple-400' :
                                                'text-gray-500'
                                        }`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] text-gray-600 font-mono uppercase tracking-tighter">
                <span>Data: AviationStack / Int. News</span>
                <span className="text-blue-900">Live Feed Active</span>
            </div>
        </div>
    );
}
