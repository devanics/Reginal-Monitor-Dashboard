"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'critical': return 'bg-red-500 text-red-500 border-red-500';
        case 'high': return 'bg-orange-500 text-orange-500 border-orange-500';
        case 'elevated': return 'bg-yellow-500 text-yellow-500 border-yellow-500';
        case 'normal': return 'bg-green-500 text-green-500 border-green-500';
        case 'low': return 'bg-white/40 text-white/40 border-white/20';
        default: return 'bg-gray-500 text-gray-500 border-gray-500';
    }
};

const getLevelEmoji = (level: string) => {
    switch (level.toLowerCase()) {
        case 'critical': return '🔴';
        case 'high': return '🟠';
        case 'elevated': return '🟡';
        case 'normal': return '🟢';
        case 'low': return '⚪';
        default: return '❔';
    }
};

export default function RegionalCountryInstability() {
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = () => {
            fetch('/api/intelligence-brief?list=true')
                .then(res => res.json())
                .then(json => {
                    if (json.countries) setCountries(json.countries);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        };
        fetchList();
        const interval = setInterval(fetchList, 300000);
        return () => clearInterval(interval);
    }, []);

    if (selectedCountry) {
        return <DetailedView country={selectedCountry} onBack={() => setSelectedCountry(null)} />;
    }

    if (loading) return <div className="widget-card animate-pulse h-[600px] bg-white/5"></div>;

    return (
        <div className="widget-card flex flex-col bg-black/40 border-l-0 border-r-0 rounded-none h-60">
            <div className="widget-header border-b border-white/5 pb-2 sticky top-0 bg-[#0a0a0a] z-10 px-4 pt-3">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Regional Instability</span>
                        <div className="group relative">
                            <Info size={10} className="text-gray-500 cursor-help" />
                            <div className="absolute left-0 top-4 w-48 p-2 bg-black border border-white/10 text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none rounded">
                                Blended intelligence index based on ACLED, UCDP, and real-time news telemetry.
                            </div>
                        </div>
                    </div>
                    <span className="text-[9px] text-blue-500 font-mono font-bold">24H DYNAMIC</span>
                </div>
            </div>

            <div className="widget-content flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-3">
                {countries.map((c) => {
                    const colorClass = getLevelColor(c.level);
                    const barColor = colorClass.split(' ')[0];

                    return (
                        <div
                            key={c.code}
                            className="bg-white/5 border border-white/5 rounded-md p-4 cursor-pointer hover:bg-white/10 transition-colors group"
                            onClick={() => setSelectedCountry(c)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs">{getLevelEmoji(c.level)}</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-tight">{c.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white font-mono">{c.score} <span className="text-gray-600 text-[10px]">{c.change24h === 0 ? '→' : c.change24h > 0 ? '↑' : '↓'}</span></span>
                                </div>
                            </div>

                            <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
                                <div className={`h-full ${barColor} shadow-[0_0_8px_currentColor]`} style={{ width: `${c.score}%` }}></div>
                            </div>

                            <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono font-bold tracking-tighter">
                                <span className={c.components.unrest > 40 ? 'text-orange-400' : ''}>U:{c.components.unrest}</span>
                                <span className={c.components.conflict > 40 ? 'text-red-400' : ''}>C:{c.components.conflict}</span>
                                <span className={c.components.security > 40 ? 'text-blue-400' : ''}>S:{c.components.security}</span>
                                <span className={c.components.information > 40 ? 'text-orange-300' : ''}>I:{c.components.information}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] text-gray-600 font-mono">
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse"></span>
                    DATA: GEO-INTEL
                </span>
                <span className="text-blue-500/70">SYNC: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    );
}

function DetailedView({ country, onBack }: { country: any, onBack: () => void }) {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/intelligence-brief?country=${country.code}`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [country]);

    if (loading) return (
        <div className="widget-card flex flex-col h-full bg-black/40 border-l-0 border-r-0 rounded-none max-h-[800px] animate-pulse">
            <div className="flex-1 flex items-center justify-center">
                <span className="text-[10px] text-gray-500 font-mono">LOADING INTEL...</span>
            </div>
        </div>
    );

    const stats = data.stats;

    return (
        <div className="widget-card flex flex-col h-full bg-black/40 border-l-0 border-r-0 rounded-none max-h-[800px]">
            <div className="widget-header border-b border-white/5 pb-2 sticky top-0 bg-[#0a0a0a] z-10 px-4 pt-3">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded text-gray-400">
                            <ArrowLeft size={12} />
                        </button>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{country.name} Instability Index</span>
                    </div>
                    <span className="text-[10px] text-blue-500 font-mono font-bold">LIVE TELEMETRY</span>
                </div>
            </div>

            <div className="widget-content flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                {/* Section 1: Top Index & Main Bars */}
                <div className="flex flex-col gap-6 mb-8 mt-2">
                    <div className="flex items-center gap-4">
                        <div className={`text-4xl font-bold ${stats.index > 70 ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : stats.index > 40 ? 'text-orange-500' : 'text-green-500'} font-mono`}>
                            {stats.index}/100
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Security Regime</div>
                            <div className="flex items-center gap-2 text-xs text-white font-bold">
                                <span>{getLevelEmoji(stats.status)} {stats.status.toUpperCase()}</span>
                                <span className="text-gray-600">→</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {[
                            { label: 'Unrest', value: stats.unrest, icon: '📢', color: 'bg-orange-500' },
                            { label: 'Conflict', value: stats.conflict, icon: '⚔️', color: 'bg-red-500' },
                            { label: 'Security', value: stats.security, icon: '🛡️', color: 'bg-blue-500' },
                            { label: 'Information', value: stats.information, icon: '📡', color: 'bg-orange-300' },
                        ].map((bar) => (
                            <div key={bar.label} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">{bar.label}</span>
                                    <span className="text-[10px] font-mono text-gray-300 font-bold">{bar.value}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${bar.color} ${bar.value > 50 ? 'shadow-[0_0_5px_currentColor]' : ''}`} style={{ width: `${bar.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: AI Intelligence Brief */}
                <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Share size={40} />
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        AI Intelligence Brief
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed font-medium prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{data.brief}</ReactMarkdown>
                    </div>
                </div>

                {/* Section 3: Active Signals */}
                <div className="mb-8">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Signals</div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: `${stats.protests || 0} Protests`, icon: '📢', color: (stats.protests > 0) ? 'border-orange-500/50 text-orange-400 bg-orange-500/5' : 'border-white/10 text-gray-500 bg-transparent', show: true },
                            { label: `${stats.strikes || 0} Conflict Events`, icon: '💥', color: (stats.strikes > 0) ? 'border-red-500/50 text-red-400 bg-red-500/5' : 'border-white/10 text-gray-500 bg-transparent', show: true },
                            { label: 'Travel Advisory', icon: '⚠️', color: 'border-yellow-600/50 text-yellow-500 bg-yellow-600/5', show: stats.index > 50 },
                            { label: 'GPS Jamming', icon: '🛰️', color: 'border-blue-500/50 text-blue-400 bg-blue-500/5', show: stats.conflict > 60 },
                        ].filter(s => s.show).map((s) => (
                            <div key={s.label} className={`px-2 py-1 rounded-full border ${s.color} text-[9px] font-bold flex items-center gap-1`}>
                                <span>{s.icon}</span>
                                <span>{s.label.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: 7-Day Timeline (Simulated) */}
                <div className="mb-8">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">7-Day Intensity Timeline</div>
                    <div className="relative h-24 w-full border-l border-white/10 ml-12">
                        {[
                          { name: 'Unrest', score: stats.unrest, color: 'text-orange-400' },
                          { name: 'Conflict', score: stats.conflict, color: 'text-red-400' },
                          { name: 'Security', score: stats.security, color: 'text-blue-400' },
                        ].map((type, idx) => (
                            <div key={type.name} className="flex items-center h-8 relative">
                                <span className={`absolute -left-14 text-[9px] font-bold ${type.color} uppercase tracking-tighter`}>
                                    {type.name}
                                </span>
                                <div className="w-full h-px bg-white/5 absolute"></div>
                                {type.score > 20 && (
                                    <div className="absolute left-[30%] w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                                )}
                                {type.score > 40 && (
                                    <div className="absolute left-[60%] w-2 h-2 rounded-full bg-current opacity-60"></div>
                                )}
                                <div className="absolute right-0 w-3 h-3 rounded-full bg-current border-2 border-white/20 shadow-[0_0_8px_currentColor]"></div>
                            </div>
                        ))}
                        <div className="absolute -bottom-4 right-0 text-[10px] text-gray-600 font-mono">LIVE</div>
                    </div>
                </div>
            </div>

            <div className="p-3 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] text-gray-600 font-mono">
                <span className="text-gray-500">PROVIDER: GEO-INTEL V1.4</span>
                <span className="text-blue-500/70 uppercase">Aligned with Reference Model</span>
            </div>
        </div>
    );
}
