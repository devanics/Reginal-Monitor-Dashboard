import maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import type { LayersList } from '@deck.gl/core';
import { getLayersForVariant, bindLayerSearch } from '@/config/map-layer-definitions';
import type { MapLayers, MapVariant } from '@/types';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export class DeckGLMap {
  private container: HTMLElement;
  private map: maplibregl.Map;
  private overlay: MapboxOverlay;
  private layers: MapLayers;
  private variant: MapVariant;
  private tooltip: HTMLElement;

  constructor(container: HTMLElement, options: { variant: MapVariant; initialViewState: any }) {
    this.container = container;
    this.variant = options.variant;

    // Initial layers state - all off by default except military
    this.layers = {
      military: false,
      conflicts: false,
      bases: false,
      iranAttacks: false,
      // ... rest false
    } as any;

    // Create MapLibre instance
    this.map = new maplibregl.Map({
      container: this.container,
      style: MAP_STYLE,
      center: [options.initialViewState.longitude, options.initialViewState.latitude],
      zoom: options.initialViewState.zoom,
      pitch: options.initialViewState.pitch,
      bearing: options.initialViewState.bearing
    });

    // Create Deck.gl overlay
    this.overlay = new MapboxOverlay({
      interleaved: false,
      layers: this.getDeckLayers()
    });

    // Wait for map load before adding overlay
    this.map.on('load', () => {
      this.map.addControl(this.overlay as any);
      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
      this.update();
    });

    // Setup Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'deckgl-tooltip';
    this.tooltip.style.display = 'none';
    this.container.appendChild(this.tooltip);

    // Setup UI
    this.createLayerToggles();

    // Update layers when map moves (if needed for clustering)
    this.map.on('moveend', () => this.update());
  }

  private getLayerConfig(key: keyof MapLayers): any {
    const configs: Partial<Record<keyof MapLayers, any>> = {
      iranAttacks: { type: 'geojson', endpoint: '/api/iran-attacks', color: [239, 68, 68] },
      hotspots: { type: 'scatterplot', endpoint: '/api/hotspots', color: [249, 115, 22], radius: 3000 },
      conflicts: { type: 'geojson', endpoint: '/api/conflicts', color: [220, 38, 38, 150] },
      bases: { type: 'scatterplot', endpoint: '/api/military-bases', color: [255, 255, 255], radius: 4000, outline: true },
      nuclear: { type: 'scatterplot', endpoint: '/api/nuclear-sites', color: [255, 255, 0], radius: 5000 },
      spaceports: { type: 'scatterplot', endpoint: '/api/spaceports', color: [147, 197, 253], radius: 3000 },
      military: { type: 'geojson', endpoint: '/api/military-activity', color: [59, 130, 246] },
      ais: { type: 'geojson', endpoint: '/api/shipping', color: [30, 64, 175], params: 'format=geojson' },
      cyberThreats: { type: 'geojson', endpoint: '/api/cyber-threats', color: [168, 85, 247], params: 'format=geojson' },
      pipelines: { type: 'geojson', endpoint: '/api/pipelines', color: [34, 197, 94], params: 'format=geojson' },
      // Default configurations for other layers
      datacenters: { type: 'scatterplot', endpoint: '/api/datacenters', color: [20, 184, 166], radius: 2500 },
      cables: { type: 'geojson', endpoint: '/api/cables', color: [14, 165, 233], params: 'format=geojson' },
      tradeRoutes: { type: 'geojson', endpoint: '/api/trade-routes', color: [115, 115, 115, 100], params: 'format=geojson' },
      flights: { type: 'geojson', endpoint: '/api/aviation', color: [234, 179, 8], params: 'format=geojson' },
      protests: { type: 'scatterplot', endpoint: '/api/protests', color: [217, 70, 239], radius: 2000 },
      natural: { type: 'scatterplot', endpoint: '/api/natural-events', color: [16, 185, 129], radius: 6000 },
      fires: { type: 'scatterplot', endpoint: '/api/fires', color: [244, 63, 94], radius: 4000 },
      outages: { type: 'scatterplot', endpoint: '/api/outages', color: [107, 114, 128], radius: 3500 },
      gpsJamming: { type: 'geojson', endpoint: '/api/gps-jamming', color: [251, 191, 36, 120] },
      satellites: { type: 'scatterplot', endpoint: '/api/satellites', color: [192, 132, 252], radius: 2000 },
      irradiators: { type: 'scatterplot', endpoint: '/api/irradiators', color: [255, 0, 255], radius: 4500 },
      economic: { type: 'scatterplot', endpoint: '/api/economic', color: [34, 197, 94], radius: 3000 },
      minerals: { type: 'scatterplot', endpoint: '/api/minerals', color: [251, 146, 60], radius: 2500 },
      ucdpEvents: { type: 'geojson', endpoint: '/api/ucdp-events', color: [185, 28, 28, 150] },
      displacement: { type: 'geojson', endpoint: '/api/displacement', color: [245, 158, 11, 130] },
      climate: { type: 'scatterplot', endpoint: '/api/climate', color: [96, 165, 250], radius: 5000 },
      weather: { type: 'scatterplot', endpoint: '/api/weather', color: [255, 255, 255], radius: 6000 },
      waterways: { type: 'geojson', endpoint: '/api/waterways', color: [30, 58, 138, 180], params: 'format=geojson' },
      webcams: { type: 'scatterplot', endpoint: '/api/webcams', color: [34, 197, 94], radius: 1000 },
      ciiChoropleth: { type: 'scatterplot', endpoint: '/api/ciiChoropleth', color: [255, 100, 100], radius: 4000 },
      dayNight: { type: 'scatterplot', endpoint: '/api/dayNight', color: [255, 255, 100], radius: 5000 },
    };

    return configs[key] || { type: 'scatterplot', endpoint: `/api/${key}`, color: [150, 150, 150], radius: 3000 };
  }

  private getDeckLayers(): LayersList {
    const activeLayerKeys = (Object.keys(this.layers) as (keyof MapLayers)[]).filter(k => this.layers[k]);

    const deckLayers = activeLayerKeys.map(key => {
      const config = this.getLayerConfig(key);
      const url = config.params ? `${config.endpoint}?${config.params}` : config.endpoint;

      if (config.type === 'geojson') {
        return new GeoJsonLayer({
          id: `layer-${key}`,
          data: url,
          getFillColor: config.color,
          getLineColor: (config.color.length === 4) ? config.color.slice(0, 3) : [255, 255, 255],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
          pointRadiusMinPixels: 6, // Ensure visibility
          pickable: true,
          onHover: (info) => this.handleHover(info, key.toString())
        });
      }

      return new ScatterplotLayer({
        id: `layer-${key}`,
        data: url,
        getPosition: (d: any) => [d.lon || d.longitude, d.lat || d.latitude],
        getRadius: config.radius || 3000,
        radiusMinPixels: 6, // Ensure visibility
        getFillColor: config.color,
        getLineColor: config.outline ? [0, 0, 0] : config.color,
        getLineWidth: 2,
        pickable: true,
        onHover: (info) => this.handleHover(info, key.toString())
      });
    });



    return deckLayers;
  }

  private handleHover(info: any, title: string) {
    if (info.object) {
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = `${info.x + 10}px`;
      this.tooltip.style.top = `${info.y + 10}px`;

      const obj = info.object;
      const name = obj.name || obj.properties?.name || obj.callsign || 'Unidentified';
      const detail = obj.type || obj.properties?.type || '';

      this.tooltip.innerHTML = `<strong>${title.charAt(0).toUpperCase() + title.slice(1)}</strong><br/>${name} ${detail ? `<br/><small>${detail}</small>` : ''}`;
    } else {
      this.tooltip.style.display = 'none';
    }
  }

  private createLayerToggles() {
    const wrapper = document.createElement('div');
    wrapper.className = 'deckgl-layer-toggles';

    const header = document.createElement('div');
    header.className = 'toggle-header';
    header.innerHTML = '<span>Map Layers</span>';
    wrapper.appendChild(header);

    const search = document.createElement('input');
    search.className = 'layer-search';
    search.placeholder = 'Search layers...';
    wrapper.appendChild(search);

    const list = document.createElement('div');
    list.className = 'toggle-list';

    const availableLayers = getLayersForVariant(this.variant, 'flat');

    availableLayers.forEach(def => {
      const item = document.createElement('label');
      item.className = 'layer-toggle';
      item.setAttribute('data-layer', def.key);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!this.layers[def.key];
      checkbox.addEventListener('change', () => {
        this.layers[def.key] = checkbox.checked;
        this.update();
      });

      const label = document.createElement('span');
      label.className = 'toggle-label';
      label.innerHTML = `${def.icon} ${def.fallbackLabel}`;

      item.appendChild(checkbox);
      item.appendChild(label);
      list.appendChild(item);
    });

    wrapper.appendChild(list);
    this.container.appendChild(wrapper);

    bindLayerSearch(wrapper);
  }

  private update() {
    this.overlay.setProps({
      layers: this.getDeckLayers()
    });
  }

  public setView(view: any) {
    this.map.flyTo(view);
  }
}
