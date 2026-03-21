"use client";

import React, { useEffect, useRef } from 'react';
import { DeckGLMap } from './DeckGLMap';
import '../styles/map-ui.css';

export default function MapWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<DeckGLMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the advanced map
    const map = new DeckGLMap(containerRef.current, {
      variant: 'full',
      initialViewState: {
        latitude: 23.8859,
        longitude: 45.0792,
        zoom: 4.5,
        pitch: 45,
        bearing: 0
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.destroy();
    };
  }, []);

  return (
    <div className="widget-card h-full flex flex-col relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="flex-1 w-full h-full min-h-[400px] relative deckgl-mode"
      />
      <div className="p-2 border-t border-white/5 bg-black/30 flex justify-between items-center text-[8px] text-gray-500">
        <span>RENDER: DECK.GL + MAPLIBRE-GL</span>
        <span className="text-blue-400">● LIVE ADVANCED INTEL FEED</span>
      </div>
    </div>
  );
}
