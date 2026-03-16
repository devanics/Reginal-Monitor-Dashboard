'use client';
import React, { useState, useEffect } from 'react';

const KSANewsSummary = () => {
    const [data, setData] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            fetch('/api/ksa-conflict-summary')
                .then((res) => res.json())
                .then((data: any) => {
                    setData(data.summary);
                    setIsLoading(false);
                })
                .catch(() => {
                    setData("Summary currently unavailable. 🟡");
                    setIsLoading(false);
                });
        };

        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget-card !bg-blue-900/20 border-blue-500/30">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-blue-900/40">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">AI Summary of News for KSA</span>
                <span className="text-[9px] text-blue-300 opacity-70">refreshed 1m</span>
            </div>
            <div className="p-3 text-[12px] leading-relaxed">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span>Analyzing latest intelligence...</span>
                    </div>
                ) : (
                    <p className="text-white font-medium">{data}</p>
                )}
            </div>
        </div>
    );
};

export default KSANewsSummary;
