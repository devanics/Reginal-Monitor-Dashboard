'use client';
import React, { useState, useEffect } from 'react'

const ReginalNews = () => {

    const [regionalNews, setRegionalNews] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/regionalNews')
            .then((res) => res.json())
            .then((data) => {
                setRegionalNews(data);
                setIsLoading(false)
            });
    }, []);

    if (isLoading) return <div>Loading...</div>


    return (
        <div className=" bg-gray-900 h-40 overflow-scroll rounded-lg p-1">
            <p>{regionalNews.summary}</p>
        </div>
    )
}

export default ReginalNews