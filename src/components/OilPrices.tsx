'use client';

import { useEffect, useState } from 'react';
import Sparkline from './Sparkline';

interface OilGrade {
    code: string;
    name: string;
    gravity: number;
    price: number;
    change: number;
    sparkline: number[];
    currency: string;
}

export default function OilPrices() {
    const [grades, setGrades] = useState<OilGrade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/oil-prices')
            .then((r) => r.json())
            .then((json) => {
                if (json.grades) setGrades(json.grades);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading)
        return <div className="p-3 bg-card rounded-lg border border-border animate-pulse h-56" />;

    return (
        <div className="flex flex-col gap-2 bg-gray-900 h-60 overflow-scroll rounded-lg p-1">
            <div className="grid grid-cols-1 gap-2">
                {grades.map((grade) => {
                    const isPositive = grade.change >= 0;
                    const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
                    const strokeColor = isPositive ? '#4ade80' : '#f87171';

                    return (
                        <div
                            key={grade.code}
                            className="bg-card border border-border rounded-lg p-2.5 flex flex-col justify-between hover:bg-card-hover transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-gray-400">{grade.code}</span>
                                    <span className="text-[8px] text-gray-600 leading-none">
                                        {grade.gravity}° API
                                    </span>
                                </div>
                                <div className="w-14 h-5">
                                    {grade.sparkline.length > 0 && (
                                        <Sparkline data={grade.sparkline} color={strokeColor} />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold leading-tight">
                                    ${grade.price.toFixed(2)}
                                </span>
                                <span className={`text-[10px] font-bold ${colorClass}`}>
                                    {isPositive ? '+' : ''}
                                    {grade.change.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
