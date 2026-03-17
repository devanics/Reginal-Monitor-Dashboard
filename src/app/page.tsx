import CommoditiesWidget from "@/components/CommoditiesWidget";
import CryptoWidget from "@/components/CryptoWidget";
import ShippingWidget from "@/components/ShippingWidget";
import PipelineWidget from "@/components/PipelineWidget";
import StocksWidget from "@/components/StocksWidget";
import { LiveStreamPlayer } from '@/components/TVLiveStreamingg';
import RegionalSummary from "@/components/RegionalSummary";
import ConflictStatus from "@/components/ReginalNews/KSA-ConflictStatus/ConflictStatus";
import KSANewsSummary from "@/components/KSANewsSummary";
import KSAMap from "@/components/KSAMap";
import KSANewsFeed from "@/components/KSANewsFeed";
import StrategicPosture from "@/components/StrategicPosture";
import StrategicRisk from "@/components/StrategicRisk";
import CountryInstability from "@/components/CountryInstability";
import EscalationProbability from "@/components/EscalationProbability";

export default function Home() {
   const currentTime = new Date().toLocaleString();

  return (
    <div className="dashboard-container">
      {/* Top Nav Row */}
      <nav className="top-nav text-[10px] font-bold">
        <div className="flex items-center gap-2">
          <span className="text-lg tracking-[0.2em]">OVERWATCH.LIVE</span>
        </div>
        <div className="border border-white/20 px-3 py-1 bg-white/5 flex items-center justify-center">
          DEFCON 3
        </div>
        <EscalationProbability />
        <div className="flex items-center justify-end px-4 border-l border-white/10">
          {currentTime.split(',')[1]}
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
            <PipelineWidget />
            <CommoditiesWidget />
            <div className="widget-card p-2 flex flex-col justify-between">
               <span className="text-[9px] text-gray-500 font-bold uppercase">Economic Indicators</span>
               <div className="flex justify-between items-end">
                  <div>
                     <div className="text-[10px] text-white">FED TOTAL ASSETS</div>
                     <div className="text-sm font-bold">6646B$</div>
                  </div>
                  <div className="text-[9px] text-red-400">▼ 1.2%</div>
               </div>
            </div>
            <CryptoWidget />
            <ShippingWidget />
         </div>
         {/* Main Grid Content */}
         <main className="main-content">
            {/* Left Column: KSA Segment */}
            <div className="">
               {/* Row 1: AI News Summary */}
               <KSANewsSummary />

               {/* Row 2: 2 Columns - Strategic Risk | KSA 3D Map */}
               <div className="grid grid-cols-2 gap-3">
                  <StrategicRisk />
                  <KSAMap />
               </div>

               {/* Row 3: 3 Columns - Country Instability | Live News Feed | AI Strategic Posture */}
               <div className="grid grid-cols-3 gap-3">
                  <CountryInstability />
                  <KSANewsFeed />
                  <div className="scale-90 origin-top">
                     <StrategicPosture />
                  </div>
               </div>
            </div>

            {/* Middle Column: Live Feeds */}
            <div className="column">
               <div className="bg-black flex-1 flex flex-col">
                  <div className="relative aspect-video bg-gray-900">
                     <LiveStreamPlayer mode="news" />
                     <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-2 border-l-2 border-red-600">
                        <span className="text-xs font-bold">HONDA HIT BY HISTORIC EV WRITE-DOWN</span>
                     </div>
                  </div>

                  <div className="p-4 bg-white/5 flex-1 flex flex-col gap-4">
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live X feeds from alarabiya live</div>
                     <div className="flex-1 border border-white/10 rounded p-3 flex flex-col gap-3">
                        <div className="text-[11px] border-b border-white/5 pb-2">
                           <span className="text-blue-400 font-bold">@AlArabiya:</span> Military readiness increased in Red Sea following latest signals...
                        </div>
                        <div className="text-[11px] border-b border-white/5 pb-2">
                           <span className="text-blue-400 font-bold">@AlArabiya:</span> New drone sightings reported near coastal infrastructure.
                        </div>
                     </div>
                  </div>

                  <div className="p-2 border-t border-white/10">
                     <div className="flex items-center gap-2 text-[10px] mb-2 px-1">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span className="font-bold">LIVE WEBCAMS</span>
                     </div>
                     <LiveStreamPlayer mode="webcams" />
                  </div>
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
      </div>
   );
}
