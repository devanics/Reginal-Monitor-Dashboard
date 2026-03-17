"use client";

import React, { useState, useEffect } from 'react';

interface PizzaLocation {
  place_id: string;
  name: string;
  address: string;
  current_popularity: number;
  is_closed_now: boolean;
}

interface PizzaData {
  defcon: number;
  label: string;
  statusText: string;
  activity: number;
  locations: PizzaLocation[];
}

interface PizzaIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PizzaIndexModal({ isOpen, onClose }: PizzaIndexModalProps) {
  const [data, setData] = useState<PizzaData | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/pizza-index')
        .then(res => res.json())
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed top-[52px] left-[260px] z-[100] w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-black/40">
          <h3 className="text-[11px] font-bold tracking-tight text-white uppercase opacity-80">Pentagon Pizza Index</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">&times;</button>
        </div>

        {/* Status Section */}
        <div className="p-4 bg-black/20 flex flex-col items-center gap-1">
          {loading ? (
            <div className="animate-pulse flex flex-col items-center gap-2 w-full">
              <div className="h-3 w-32 bg-white/5 rounded"></div>
            </div>
          ) : (
            <span className={`text-[10px] font-bold tracking-[0.1em] uppercase transition-colors
              ${data?.defcon === 1 ? 'text-red-500' : 'text-[#4ade80] opacity-60'}`}>
              {data?.statusText} — {data?.label}
            </span>
          )}
        </div>

        {/* Locations List */}
        <div className="max-h-[350px] overflow-y-auto bg-black/40 custom-scrollbar">
          {loading ? (
             <div className="p-4 space-y-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-white/5 rounded animate-pulse"></div>)}
             </div>
          ) : (
            <div className="flex flex-col">
              {data?.locations.map((loc, idx) => (
                <div key={loc.place_id} className={`px-4 py-3 flex justify-between items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0`}>
                  <div className="flex flex-col gap-0.5 max-w-[75%]">
                    <span className="text-[11px] font-bold text-gray-300 leading-none">{loc.name}</span>
                    <span className="text-[9px] text-gray-600 truncate">{loc.address}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider
                    ${loc.is_closed_now ? 'bg-black/40 text-gray-600 border border-white/5' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                    {loc.is_closed_now ? 'Closed' : 'Open'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/60 border-t border-white/5 flex flex-col gap-1 items-center">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">GEOPOLITICAL TENSIONS</span>
            <div className="flex justify-between w-full px-1 text-[8px] text-gray-700 font-bold">
                 <span>Source: PizzINT</span>
                 <span>Updated Just now</span>
            </div>
        </div>
      </div>
    </div>
  );
}