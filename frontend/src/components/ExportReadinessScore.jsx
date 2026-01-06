import React from 'react';
import { useEffect, useState } from 'react';

const ExportReadinessScore = ({ sellerId }) => {
    const [score, setScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await fetch(`/api/seller/export-readiness/${sellerId}`);
                if (!response.ok) {
                    setScore(0);
                    setSuggestions([]);
                    return;
                }
                const data = await response.json();
                setScore(typeof data.score === 'number' ? data.score : 0);
                setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
            } catch (err) {
                console.error('Failed to fetch export readiness:', err);
                setScore(0);
                setSuggestions([]);
            }
        };
        if (sellerId) fetchScore();
    }, [sellerId]);

    const getColor = () => {
        if (score >= 75) return 'bg-green-500';
        if (score >= 45) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${getColor()}`}> 
                <span className="text-white text-2xl font-bold">{score}%</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">Suggestions for Improvement</h2>
            <ul className="mt-2">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{suggestion}</span>
                        <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">Action</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExportReadinessScore;