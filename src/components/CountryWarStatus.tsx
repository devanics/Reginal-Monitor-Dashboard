"use client";
import { useEffect, useState } from "react";

interface WarStatus {
  usa: boolean;
  israel: boolean;
  iran: boolean;
}

const COUNTRIES: { key: keyof WarStatus; label: string }[] = [
  { key: "usa", label: "USA" },
  { key: "israel", label: "ISRAEL" },
  { key: "iran", label: "IRAN" },
];

export default function CountryWarStatus() {
  const [status, setStatus] = useState<WarStatus | null>(null);

  useEffect(() => {
    const POLL_MS = 10_000;
    let mounted = true;

    function extractStatus(payload: any): WarStatus | null {
      if (!payload) return null;
      if (payload.usa !== undefined) return { usa: !!payload.usa, israel: !!payload.israel, iran: !!payload.iran };
      if (payload.data) {
        if (payload.data.usa !== undefined) return { usa: !!payload.data.usa, israel: !!payload.data.israel, iran: !!payload.data.iran };
        if (payload.data.data && payload.data.data.usa !== undefined) return { usa: !!payload.data.data.usa, israel: !!payload.data.data.israel, iran: !!payload.data.data.iran };
      }
      if (payload.status && payload.status.data) {
        const d = payload.status.data;
        if (d.usa !== undefined) return { usa: !!d.usa, israel: !!d.israel, iran: !!d.iran };
        if (d.data && d.data.usa !== undefined) return { usa: !!d.data.usa, israel: !!d.data.israel, iran: !!d.data.iran };
      }
      return null;
    }

    async function load() {
      try {
        const res = await fetch('/api/country-war-status');
        const json = await res.json();
        const s = extractStatus(json) as WarStatus | null;
        if (!mounted) return;
        setStatus(s);
      } catch (err) {
        console.error('CountryWarStatus fetch failed', err);
        if (mounted) setStatus(null);
      }
    }

    load();
    const interval = setInterval(load, 300000);
    return () => clearInterval(interval);
  }, []);

  console.log(status , "statusstatusstatusstatusstatus");
  
  return (
    <div>
      <div className="flex items-center gap-3">
        {COUNTRIES.map(({ key, label }) => {
          const active = status?.[key];
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                {label}
              </span>
              <div
                className={`px-3 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors ${status === null
                    ? 'bg-gray-700/50 text-gray-600'
                    : active
                      ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]'
                      : 'bg-gray-700 text-gray-400'
                  }`}
              >
                {status === null ? '…' : active ? 'active' : 'inactive'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
