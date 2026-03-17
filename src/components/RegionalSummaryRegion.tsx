"use client";

import React, { useState, useEffect } from 'react';


export default function RegionalSummaryRegion() {
    const [summary, setSummary] = useState<string>("Syncing regional intelligence... 🟡");

    useEffect(() => {
        const fetchData = () => {
            fetch('/api/regionalNews')
                .then((res) => res.json())
                .then((data) => {
                    setSummary(data.summary || "Summary currently unavailable. 🟡");
                })
                .catch(() => {
                    setSummary("Intelligence link offline. 🔴");
                });
        };

        fetchData();
        const interval = setInterval(fetchData, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-6 ">
            <span className="text-[10px] text-gray-500 font-bold uppercase w-16 px-2 border-r border-white/10"></span>
            <div className="text-[11px] leading-tight text-white/90">
                {summary}
            </div>
        </div>
    );
}
