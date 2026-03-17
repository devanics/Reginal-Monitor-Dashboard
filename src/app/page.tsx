"use client";

import { useState, useEffect } from "react";
import CommoditiesWidget from "@/components/CommoditiesWidget";
import CryptoWidget from "@/components/CryptoWidget";
import ShippingWidget from "@/components/ShippingWidget";
import PipelineWidget from "@/components/PipelineWidget";
import MarketsWidget from "@/components/MarketsWidget";
import { LiveStreamPlayer } from '@/components/TVLiveStreamingg';
import RegionalSummary from "@/components/RegionalSummary";
import ConflictStatus from "@/components/ReginalNews/KSA-ConflictStatus/ConflictStatus";
import CountryWarStatus from "@/components/CountryWarStatus";
import KSANewsSummary from "@/components/KSANewsSummary";
import KSAMap from "@/components/KSAMap";
import KSANewsFeed from "@/components/KSANewsFeed";
import StrategicPosture from "@/components/StrategicPosture";
import StrategicRisk from "@/components/StrategicRisk";
import CountryInstability from "@/components/CountryInstability";
import EscalationProbability from "@/components/EscalationProbability";
import PizzaIndexModal from "@/components/PizzaIndexModal";
import StrikesMissilesGraph from "@/components/StrikesMissilesGraph";
import OilPrices from "@/components/OilPrices";


export default function Home() {
   const [isPizzaModalOpen, setIsPizzaModalOpen] = useState(false);
   const [pizzaData, setPizzaData] = useState<any>(null);
   const [currentTime, setCurrentTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
   }, []);

   useEffect(() => {
      fetch('/api/pizza-index')
         .then(res => res.json())
         .then(setPizzaData)
         .catch(console.error);
   }, []);

   return (
      <div className="dashboard-container">
         {/* Top Nav Row */}
         <nav className="top-nav text-[10px] font-bold">
            <div className="flex items-center gap-2 min-w-[200px]">
               <span className="text-lg tracking-[0.2em] whitespace-nowrap">OVERWATCH.LIVE</span>
            </div>
            <div
               className="flex items-center gap-2 bg-black px-3 py-1.5 border border-white/20 rounded-sm cursor-pointer hover:bg-white/10 transition-colors ml-8"
               onClick={() => setIsPizzaModalOpen(true)}
            >
               <span className="text-xl">🍕</span>
               <div className="flex flex-col leading-none">
                  <span className={`text-[10px] font-black ${pizzaData?.defcon === 1 ? 'text-red-500' : 'text-[#4ade80]'}`}>
                     DEFCON {pizzaData?.defcon || 5}
                  </span>
                  <span className="text-gray-500 text-[9px] font-bold">{pizzaData?.activity || 0}% activity</span>
               </div>
            </div>
            <EscalationProbability />
            <div className="flex items-center justify-end px-4 border-l border-white/10">
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="flex items-center gap-2 px-4 border-l border-white/10">
               <span className="text-gray-500">APIs:</span>
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
               </div>
            </div>
         </nav>


         {/* Secondary Meta Nav */}
         <div className="secondary-nav">
            <RegionalSummary />
            {/* <PipelineWidget /> */}
            <OilPrices />
            <CommoditiesWidget />
            <MarketsWidget />
            {/* <div className="widget-card p-2 flex flex-col justify-between">
               <span className="text-[9px] text-gray-500 font-bold uppercase">Economic Indicators</span>
               <div className="flex justify-between items-end">
                  <div>
                     <div className="text-[10px] text-white">FED TOTAL ASSETS</div>
                     <div className="text-sm font-bold">6646B$</div>
                  </div>
                  <div className="text-[9px] text-red-400">▼ 1.2%</div>
               </div>
            </div> */}
            <CryptoWidget />
            <ShippingWidget />
         </div>
         {/* Main Grid Content */}
         <main className="main-content">
            {/* Left Column: KSA Segment */}
            <div className="">
               {/* Row 1: AI News Summary */}
               <div className="grid grid-cols-2 gap-3">
                  <KSANewsSummary />
                  <StrategicRisk />

               </div>

               {/* Row 3: 3 Columns - Country Instability | Live News Feed | AI Strategic Posture */}
               <div className="grid grid-cols-2 gap-3">
                  <CountryInstability />
                  <div className="scale-90 origin-top flex flex-col gap-3">
                     <KSANewsFeed />
                     <StrikesMissilesGraph />
                     <StrategicPosture />
                  </div>
               </div>
            </div>

            {/* Middle Column: Live Feeds */}
            <div className="column">
               <KSAMap />
               <div className="bg-black flex gap-2">
                  <LiveStreamPlayer mode="news" />
                  <LiveStreamPlayer mode="webcams" />
               </div>
            </div>

            {/* Right Column: Regional Segment */}
            <div className="column">
               <div className="widget-header !bg-orange-900/40 border-orange-500/50">
                  <span className="widget-title">REGIONAL SEGMENT</span>
               </div>

               <div className="widget-card min-h-[250px] relative bg-gray-900 overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 bg-black/60 p-2 rounded text-[10px]">
                     REGIONAL THREAT MAP
                  </div>
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#2a2a2a_0%,_transparent_100%)] opacity-30 flex items-center justify-center">
                     <span className="text-gray-700 text-xs">THREAT CORRELATION MAP</span>
                  </div>
               </div>

               <StrategicPosture />

               <div className="widget-card p-3 bg-red-950/20 border-red-900/50">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-bold uppercase text-red-400">Strait of Hormuz Status</span>
                     <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded">CONGESTED</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Increased naval presence causing major shipping delays. Risk of closure: 15%</div>
               </div>

               <div className="widget-card p-3">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">Regional Major Airports</span>
                  <div className="flex flex-col gap-2">
                     <div className="flex justify-between text-[11px]">
                        <span>DXB (Dubai)</span>
                        <span className="text-green-500">OPERATIONAL</span>
                     </div>
                     <div className="flex justify-between text-[11px]">
                        <span>DOH (Doha)</span>
                        <span className="text-green-500">OPERATIONAL</span>
                     </div>
                     <div className="flex justify-between text-[11px]">
                        <span>TLV (Tel Aviv)</span>
                        <span className="text-yellow-500">DELAYS</span>
                     </div>
                  </div>
               </div>

               <ConflictStatus />

            </div>
         </main>

         <PizzaIndexModal
            isOpen={isPizzaModalOpen}
            onClose={() => setIsPizzaModalOpen(false)}
         />
      </div>
   );
}
