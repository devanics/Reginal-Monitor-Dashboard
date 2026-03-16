import CommoditiesWidget from "@/components/CommoditiesWidget";
import CryptoWidget from "@/components/CryptoWidget";
import ShippingWidget from "@/components/ShippingWidget";
import PipelineWidget from "@/components/PipelineWidget";
import StocksWidget from "@/components/StocksWidget";
import { LiveStreamPlayer } from '@/components/TVLiveStreamingg';
import ReginalNews from "@/components/ReginalNews/ReginalNews";
import ConflictStatus from "@/components/ReginalNews/KSA-ConflictStatus/ConflictStatus";


export default function Home() {



  return (
    <div className="h-screen p-4 font-sans">


      <main className=" grid grid-cols-6 gap-3  mx-auto mb-3">
        <ReginalNews />
        <CommoditiesWidget />
        <PipelineWidget />
        <StocksWidget />
        <CryptoWidget />
        <ShippingWidget />
      </main>
      <div className=" grid grid-cols-3 gap-3 mx-auto" >
        <div className=" bg-gray-900 h-full overflow-scroll rounded-lg p-1" >
          <ConflictStatus />
        </div>
        <div className=" bg-gray-900 h-full overflow-scroll rounded-lg p-1" >
          <LiveStreamPlayer mode="news" />
          <LiveStreamPlayer mode="webcams" />
        </div>
        <div className="bg-gray-900 h-full overflow-scroll rounded-lg p-1" ></div>
      </div>


    </div>
  );
}
