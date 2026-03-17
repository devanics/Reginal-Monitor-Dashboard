"use client";

import { useEffect, useState } from "react";

interface WarStatus {
  usa: boolean;
  israel: boolean;
  iran: boolean;
}

const COUNTRIES: { key: keyof WarStatus; label: string }[] = [
  { key: "usa",    label: "USA"    },
  { key: "israel", label: "ISRAEL" },
  { key: "iran",   label: "IRAN"   },
];

export default function CountryWarStatus() {
  const [status, setStatus] = useState<WarStatus | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/country-war-status")
        .then((r) => r.json())
        .then(setStatus)
        .catch(console.error);

    load();
    const interval = setInterval(load, 600000);
    return () => clearInterval(interval);
  }, []);

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
                className={`px-3 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  status === null
                    ? "bg-gray-700/50 text-gray-600"
                    : active
                    ? "bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {status === null ? "…" : active ? "active" : "inactive"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
