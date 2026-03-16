"use client";

import React, { useEffect, useRef } from 'react';
import Map, { NavigationControl, ScaleControl, Layer, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const KSA_CENTER = { latitude: 23.8859, longitude: 45.0792 };

export default function KSAMap() {
  const mapRef = useRef<any>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const [viewState, setViewState] = React.useState({
    latitude: KSA_CENTER.latitude,
    longitude: KSA_CENTER.longitude,
    zoom: 4.5,
    pitch: 45,
    bearing: 0
  });

  const geojsonUrl = `/api/military-activity?v=${refreshKey}`;

  return (
    <div className="widget-card flex flex-col min-h-[300px] bg-gray-900 overflow-hidden relative border-blue-500/20 h-full">
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <div className="bg-black/70 px-2 py-1 rounded text-[9px] font-bold text-blue-300 border border-blue-500/30 backdrop-blur-md">
          KSA TACTICAL OVERLAY [3D]
        </div>
      </div>

      <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-1 text-[8px] text-gray-500 font-mono bg-black/50 p-1.5 rounded border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> MILITARY ASSETS</div>
      </div>

      <div className="flex-1 w-full h-full min-h-[250px]">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          <ScaleControl />

          <Source
            id="military-activity"
            type="geojson"
            data={geojsonUrl}
          >
            <Layer
              id="military-points"
              type="circle"
              paint={{
                'circle-radius': 4,
                'circle-color': '#f87171',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.8
              }}
            />
          </Source>

          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-black/80 backdrop-blur p-2 rounded border border-white/10 text-[10px] text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span>MILITARY ASSETS</span>
              </div>
            </div>
          </div>
        </Map>
      </div>

      <div className="p-2 border-t border-white/5 bg-black/30 flex justify-between items-center text-[8px] text-gray-500">
        <span>RENDER: MAPLIBRE-GL</span>
        <span className="text-blue-400">● LIVE INTEL FEED</span>
      </div>
    </div>
  );
}
