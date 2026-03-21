export interface MapLayers {
  conflicts: boolean;
  bases: boolean;
  cables: boolean;
  pipelines: boolean;
  hotspots: boolean;
  ais: boolean;
  nuclear: boolean;
  irradiators: boolean;
  sanctions: boolean;
  weather: boolean;
  economic: boolean;
  waterways: boolean;
  outages: boolean;
  cyberThreats: boolean;
  datacenters: boolean;
  protests: boolean;
  flights: boolean;
  military: boolean;
  natural: boolean;
  spaceports: boolean;
  minerals: boolean;
  fires: boolean;
  // Data source layers
  ucdpEvents: boolean;
  displacement: boolean;
  climate: boolean;
  // Tech variant layers
  startupHubs: boolean;
  cloudRegions: boolean;
  accelerators: boolean;
  techHQs: boolean;
  techEvents: boolean;
  // Finance variant layers
  stockExchanges: boolean;
  financialCenters: boolean;
  centralBanks: boolean;
  commodityHubs: boolean;
  // Gulf FDI layers
  gulfInvestments: boolean;
  // Happy variant layers
  positiveEvents: boolean;
  kindness: boolean;
  happiness: boolean;
  speciesRecovery: boolean;
  renewableInstallations: boolean;
  // Trade route layers
  tradeRoutes: boolean;
  // Iran attacks layer
  iranAttacks: boolean;
  // GPS/GNSS interference layer
  gpsJamming: boolean;
  // Satellite orbital tracking + imagery footprints
  satellites: boolean;

  // CII choropleth layer
  ciiChoropleth: boolean;
  // Overlay layers
  dayNight: boolean;
  // Commodity variant layers
  miningSites: boolean;
  processingPlants: boolean;
  commodityPorts: boolean;
  webcams: boolean;
  airports: boolean;
  networkOutage: boolean;
  gpsOutage: boolean;
}

export type MapRenderer = 'flat' | 'globe';
export type MapVariant = 'full' | 'tech' | 'finance' | 'happy' | 'commodity';

export interface LayerDefinition {
  key: keyof MapLayers;
  icon: string;
  i18nSuffix: string;
  fallbackLabel: string;
  renderers: MapRenderer[];
  premium?: 'locked' | 'enhanced';
}
