"use client";

import { useState, useEffect } from "react";
import CommoditiesWidget from "@/components/CommoditiesWidget";
import CryptoWidget from "@/components/CryptoWidget";
import ShippingWidget from "@/components/ShippingWidget";
import MarketsWidget from "@/components/MarketsWidget";
import { LiveStreamPlayer } from '@/components/TVLiveStreamingg';
import RegionalSummary from "@/components/RegionalSummary";
import RegionalSummaryRegion from "@/components/RegionalSummaryRegion";

import KSANewsSummary from "@/components/KSANewsSummary";
import KSAMap from "@/components/KSAMap";
import KSANewsFeed from "@/components/KSANewsFeed";
import MapWrapper from "@/components/MapWrapper";
import StrategicPosture from "@/components/StrategicPosture";
import StrategicPostureKSA from "@/components/StrategicPostureKSA";
import StrategicRisk from "@/components/StrategicRisk";
import CountryInstability from "@/components/CountryInstability";
import EscalationProbability from "@/components/EscalationProbability";
import PizzaIndexModal from "@/components/PizzaIndexModal";
import StrikesMissilesGraph from "@/components/StrikesMissilesGraph";
import OilPrices from "@/components/OilPrices";
import RegionalLatestFeed from "@/components/RegionalLatestFeed";
import RegionalStrikesGraph from "@/components/RegionalStrikesGraph";
import HormuzStatusWidget from "@/components/HormuzStatusWidget";
import AirlineIntelligenceWidget from "@/components/AirlineIntelligenceWidget";
import RegionalCountryInstability from "@/components/RegionalCountryInstability";
import KSAMajorAirports from "@/components/KSAMajorAirports";
import InfraMonitor from "@/components/InfraMonitor";
import CyberThreats from "@/components/CyberThreats";


export default function Home() {
   const [isPizzaModalOpen, setIsPizzaModalOpen] = useState(false);
   const [pizzaData, setPizzaData] = useState<any>(null);
   // const [currentTime, setCurrentTime] = useState(new Date());

   // useEffect(() => {
   //    const timer = setInterval(() => {
   //       setCurrentTime(new Date());
   //    }, 1000);
   //    return () => clearInterval(timer);
   // }, []);

   useEffect(() => {
      fetch('/api/pizza-index')
         .then(res => res.json())
         .then(setPizzaData)
         .catch(console.error);
   }, []);

   console.log(pizzaData);
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
               {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
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
                  <div>
                     <CountryInstability />
                     <div className="mt-3">
                        <KSAMajorAirports />
                     </div>
                  </div>
                  <div>
                     <StrikesMissilesGraph />
                     <KSANewsFeed />
                     <StrategicPostureKSA />
                     <div className="mt-3">
                        <InfraMonitor />
                     </div>
                     <div className="mt-3">
                        <CyberThreats />


                     </div>
                  </div>
               </div>
            </div>

            {/* Middle Column: Live Feeds */}
            <div className="column">
               <MapWrapper />
               <div className="bg-black flex gap-2">
                  <LiveStreamPlayer mode="news" />
                  <LiveStreamPlayer mode="webcams" />
               </div>
            </div>

            {/* Right Column: Regional Segment */}
            <div className="column flex flex-col gap-3">
               <div className="grid grid-cols-2 gap-3" >
                  <RegionalSummaryRegion />
                  <StrategicRisk />

               </div>

               {/* Row 2: Strategic Risk | Latest Regional Feed */}
               <div className="grid grid-cols-2 gap-3">
                  <RegionalLatestFeed />
                  <RegionalCountryInstability />

               </div>

               {/* Row 3+4: Left col = Strikes Graph + AI Posture | Right col = Instability + Hormuz + Airports */}
               <div className="grid grid-cols-2 gap-3">
                  {/* Left: Strikes → AI Strategic Posture */}
                  <div className="flex flex-col gap-3">
                     <RegionalStrikesGraph />
                     <StrategicPosture />
                  </div>

                  {/* Right: Country Instability → Strait of Hormuz → Airports */}
                  <div className="flex flex-col gap-3">
                     <HormuzStatusWidget />
                     <AirlineIntelligenceWidget />
                  </div>
               </div>


            </div>
         </main>

         <PizzaIndexModal
            isOpen={isPizzaModalOpen}
            onClose={() => setIsPizzaModalOpen(false)}
         />
      </div>
   );
}
