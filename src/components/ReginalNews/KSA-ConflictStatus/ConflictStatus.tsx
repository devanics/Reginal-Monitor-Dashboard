'use client';
import React, { useState, useEffect } from 'react';


const ConflictStatus = () => {


    const [data, setData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/ksa-conflict-summary')
            .then((res) => res.json())
            .then((data: any) => {
                setData(data.summary);
                setIsLoading(false);
            });
    }, []);


    if (isLoading) return <div>Loading...</div>

    return (
        <div className=" bg-gray-900 h-40 overflow-scroll rounded-lg p-1">
            <p>{data}</p>
        </div>
    )
}

export default ConflictStatus;