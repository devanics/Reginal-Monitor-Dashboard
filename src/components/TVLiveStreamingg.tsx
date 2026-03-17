/**
 * LiveStreamPlayer — React Functional Component (Standalone)
 *
 * Self-contained live-streaming widget with:
 *  • YouTube iframe embeds (news channels + city webcams)
 *  • Channel/webcam switcher tabs with drag-to-reorder
 *  • Grid (2×2) and Single view modes
 *  • Region filter for webcams
 *  • Play / Mute / Fullscreen controls
 *  • Eco mode — auto-pause after idle inactivity
 *  • Settings persisted to localStorage
 *  • Zero dependencies beyond React itself
 *
 * Usage:
 *   import { LiveStreamPlayer } from './LiveStreamPlayer.react';
 *
 *   // News channels mode
 *   <LiveStreamPlayer mode="news" />
 *
 *   // Webcam mode
 *   <LiveStreamPlayer mode="webcams" />
 *
 *   // Bring your own channels
 *   <LiveStreamPlayer mode="news" channels={myChannels} />
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, type FC, type CSSProperties } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type StreamMode = 'news' | 'webcams';
export type ViewMode = 'single' | 'grid';
export type RegionKey = 'all' | 'middle-east' | 'europe' | 'americas' | 'asia' | 'space';

export interface LiveChannel {
    id: string;
    name: string;
    /** YouTube video ID used for the iframe embed */
    videoId: string;
    /** Webcam region (only used when mode="webcams") */
    region?: RegionKey;
    /** City label for webcams */
    city?: string;
    /** Country label for webcams */
    country?: string;
}

export interface StreamSettings {
    /** Always-on = no eco idle pause. Default: true */
    alwaysOn: boolean;
    /** Minutes of inactivity before stream pauses in eco mode. Default: 5 */
    ecoIdleMinutes: number;
}

export interface LiveStreamPlayerProps {
    mode?: StreamMode;
    /** Override the built-in channel list */
    channels?: LiveChannel[];
    /** Panel title. Defaults to "Live News" or "Live Webcams" */
    title?: string;
    /** Show the ✕ close button */
    closable?: boolean;
    onClose?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILT-IN CHANNEL DATA
// ─────────────────────────────────────────────────────────────────────────────

const NEWS_CHANNELS: LiveChannel[] = [
    { id: 'bloomberg', name: 'Bloomberg', videoId: 'iEpJwprxDdk' },
    { id: 'sky', name: 'Sky News', videoId: 'uvviIF4725I' },
    { id: 'dw', name: 'DW', videoId: 'LuKwFajn37U' },
    { id: 'euronews', name: 'Euronews', videoId: 'pykpO5kQJ98' },
    { id: 'cnbc', name: 'CNBC', videoId: '9NyxcX3rhQs' },
    { id: 'cnn', name: 'CNN', videoId: 'w_Ma8oQLmSM' },
    { id: 'france24', name: 'France 24', videoId: 'u9foWyMSETk' },
    { id: 'aljazeera', name: 'Al Jazeera', videoId: 'gCNeDWCI0vo' },
    { id: 'alarabiya', name: 'Al Arabiya', videoId: 'n7eQejkXbnM' },
    { id: 'bbc-news', name: 'BBC News', videoId: 'bjgQzJzCZKs' },
    { id: 'trt-world', name: 'TRT World', videoId: 'ABfFhWzWs0s' },
    { id: 'nhk-world', name: 'NHK World', videoId: 'f0lYfG_vY_U' },
    { id: 'wion', name: 'WION', videoId: 'sYZtOFzM78M' },
];

const WEBCAM_CHANNELS: LiveChannel[] = [
    // Middle East
    { id: 'jerusalem', name: 'Jerusalem', videoId: 'UyduhBUpO7Q', region: 'middle-east', city: 'Jerusalem', country: 'Israel' },
    { id: 'tehran', name: 'Tehran', videoId: '-zGuR1qVKrU', region: 'middle-east', city: 'Tehran', country: 'Iran' },
    { id: 'tel-aviv', name: 'Tel Aviv', videoId: 'gmtlJ_m2r5A', region: 'middle-east', city: 'Tel Aviv', country: 'Israel' },
    { id: 'mecca', name: 'Mecca', videoId: 'Cm1v4bteXbI', region: 'middle-east', city: 'Mecca', country: 'Saudi Arabia' },
    // Europe
    { id: 'kyiv', name: 'Kyiv', videoId: '-Q7FuPINDjA', region: 'europe', city: 'Kyiv', country: 'Ukraine' },
    { id: 'paris', name: 'Paris', videoId: 'OzYp4NRZlwQ', region: 'europe', city: 'Paris', country: 'France' },
    { id: 'london', name: 'London', videoId: 'Lxqcg1qt0XU', region: 'europe', city: 'London', country: 'UK' },
    { id: 'st-pete', name: 'St. Petersburg', videoId: 'CjtIYbmVfck', region: 'europe', city: 'St. Petersburg', country: 'Russia' },
    // Americas
    { id: 'washington', name: 'Washington', videoId: '1wV9lLe14aU', region: 'americas', city: 'Washington DC', country: 'USA' },
    { id: 'new-york', name: 'New York', videoId: '4qyZLflp-sI', region: 'americas', city: 'New York', country: 'USA' },
    { id: 'los-angeles', name: 'Los Angeles', videoId: 'EO_1LWqsCNE', region: 'americas', city: 'Los Angeles', country: 'USA' },
    // Asia
    { id: 'taipei', name: 'Taipei', videoId: 'z_fY1pj1VBw', region: 'asia', city: 'Taipei', country: 'Taiwan' },
    { id: 'tokyo', name: 'Tokyo', videoId: '4pu9sF5Qssw', region: 'asia', city: 'Tokyo', country: 'Japan' },
    { id: 'shanghai', name: 'Shanghai', videoId: '76EwqI5XZIc', region: 'asia', city: 'Shanghai', country: 'China' },
    { id: 'sydney', name: 'Sydney', videoId: '7pcL-0Wo77U', region: 'asia', city: 'Sydney', country: 'Australia' },
    // Space
    { id: 'iss', name: 'ISS Earth', videoId: 'vytmBNhc9ig', region: 'space', city: 'ISS', country: 'Space' },
    { id: 'nasa-tv', name: 'NASA TV', videoId: 'zPH5KtjJFaQ', region: 'space', city: 'NASA TV', country: 'Space' },
];

const REGIONS: { key: RegionKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'middle-east', label: 'Middle East' },
    { key: 'europe', label: 'Europe' },
    { key: 'americas', label: 'Americas' },
    { key: 'asia', label: 'Asia' },
    { key: 'space', label: 'Space' },
];

// Grid: default 4 webcams shown in 2×2 when region = "all"
const DEFAULT_GRID_IDS = ['tehran'];

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS HELPERS  (localStorage, no external deps)
// ─────────────────────────────────────────────────────────────────────────────

const LS_SETTINGS_KEY = 'lsp-stream-settings';
const LS_ACTIVE_KEY = 'lsp-active-channel';
const LS_REGION_KEY = 'lsp-webcam-region';
const LS_VIEW_KEY = 'lsp-view-mode';
const IDLE_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'] as const;

function readLS<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? (JSON.parse(raw) as T) : fallback;
    } catch { return fallback; }
}

function writeLS(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

function loadSettings(): StreamSettings {
    return readLS<StreamSettings>(LS_SETTINGS_KEY, { alwaysOn: true, ecoIdleMinutes: 5 });
}

function saveSettings(s: StreamSettings): void {
    writeLS(LS_SETTINGS_KEY, s);
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS INJECTION  (once per page, scoped to .lsp-* classes)
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_ID = 'lsp-react-styles';

function useInjectStyles(): void {
    useEffect(() => {
        if (document.getElementById(STYLE_ID)) return;
        const css = `
      /* ── LiveStreamPlayer React styles ── */
      *, *::before, *::after { box-sizing: border-box; }
  
      .lsp-panel {
        display: flex; flex-direction: column;
        background: var(--panel-bg, #0f0f1a);
        border: 1px solid var(--border, #2d2d44);
        border-radius: 8px; overflow: hidden;
        font-family: inherit; font-size: 13px;
        color: var(--text, #e2e8f0);
        min-width: 280px; min-height: 400px;
      }
      .lsp-panel.lsp-fullscreen {
        position: fixed; inset: 0; z-index: 9999;
        border-radius: 0; border: none;
        min-height: 100dvh;
      }
  
      /* ─ Header ─ */
      .lsp-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px; gap: 8px; flex-shrink: 0;
        background: var(--panel-header-bg, #16213e);
        border-bottom: 1px solid var(--border, #2d2d44);
      }
      .lsp-header-left { display: flex; align-items: center; gap: 8px; }
      .lsp-title { font-weight: 600; font-size: 13px; }
      .lsp-live-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #ef4444; animation: lsp-pulse 1.6s infinite;
        display: inline-block; flex-shrink: 0;
      }
      @keyframes lsp-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: .35; }
      }
      .lsp-count-badge {
        font-size: 10px; padding: 1px 6px; border-radius: 10px;
        background: rgba(239,68,68,.15); color: #ef4444; font-weight: 600;
      }
      .lsp-header-controls { display: flex; align-items: center; gap: 4px; }
      .lsp-icon-btn {
        background: none; border: none; cursor: pointer; padding: 4px 6px;
        color: var(--text-dim, #9ca3af); border-radius: 4px; line-height: 1;
        transition: color .15s, background .15s;
      }
      .lsp-icon-btn:hover { color: var(--text, #e2e8f0); background: rgba(255,255,255,.06); }
      .lsp-icon-btn.lsp-active { color: #22c55e; }
      .lsp-icon-btn.lsp-unmuted { color: #6366f1; }
  
      /* ─ Region / View toolbar ─ */
      .lsp-toolbar {
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; padding: 6px 10px; flex-shrink: 0;
        border-bottom: 1px solid var(--border, #2d2d44);
        background: var(--panel-header-bg, #16213e);
        overflow-x: auto; scrollbar-width: none;
      }
      .lsp-toolbar::-webkit-scrollbar { display: none; }
      .lsp-toolbar-group { display: flex; gap: 4px; }
      .lsp-region-btn, .lsp-view-btn {
        background: none; border: 1px solid transparent; cursor: pointer;
        padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;
        color: var(--text-dim, #9ca3af); white-space: nowrap; transition: all .15s;
      }
      .lsp-region-btn.lsp-active, .lsp-view-btn.lsp-active {
        background: rgba(99,102,241,.15); border-color: rgba(99,102,241,.4); color: #a5b4fc;
      }
      .lsp-region-btn:hover:not(.lsp-active), .lsp-view-btn:hover:not(.lsp-active) {
        color: var(--text, #e2e8f0); background: rgba(255,255,255,.04);
      }
  
      /* ─ Channel switcher ─ */
      .lsp-switcher {
        display: flex; gap: 4px; padding: 6px 10px; flex-shrink: 0;
        border-bottom: 1px solid var(--border, #2d2d44);
        overflow-x: auto; scrollbar-width: none;
        background: var(--panel-header-bg, #16213e);
      }
      .lsp-switcher::-webkit-scrollbar { display: none; }
      .lsp-channel-btn {
        background: none; border: 1px solid transparent; cursor: pointer;
        padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 500;
        color: var(--text-dim, #9ca3af); white-space: nowrap; transition: all .15s;
        user-select: none;
      }
      .lsp-channel-btn.lsp-active {
        background: rgba(239,68,68,.12); border-color: rgba(239,68,68,.4); color: #fca5a5;
      }
      .lsp-channel-btn:hover:not(.lsp-active) {
        color: var(--text, #e2e8f0); background: rgba(255,255,255,.04);
      }
      .lsp-channel-btn.lsp-dragging { opacity: .5; cursor: grabbing; }
  
      /* ─ Player area ─ */
      .lsp-content {
        flex: 1; position: relative; background: #000; overflow: hidden; min-height: 0;
      }
      .lsp-embed {
        width: 100%; height: 100%; border: 0; display: block;
      }
      .lsp-grid {
        display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;
        width: 100%; height: 100%; gap: 2px; background: #111;
      }
      .lsp-grid-cell {
        position: relative; overflow: hidden; background: #000; cursor: pointer;
      }
      .lsp-grid-cell:hover .lsp-cell-overlay { opacity: 1; }
      .lsp-grid-iframe { width: 100%; height: 100%; border: 0; pointer-events: none; }
      .lsp-cell-overlay {
        position: absolute; inset: 0; opacity: 0;
        background: rgba(0,0,0,.4); transition: opacity .2s;
        display: flex; align-items: flex-start; justify-content: space-between;
        padding: 6px 8px;
      }
      .lsp-cell-label {
        display: flex; align-items: center; gap: 5px; font-size: 10px;
        font-weight: 700; letter-spacing: .05em; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.8);
      }
      .lsp-cell-live { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; }
      .lsp-expand-btn {
        background: rgba(0,0,0,.5); border: none; cursor: pointer;
        color: #fff; padding: 3px 5px; border-radius: 3px; font-size: 10px;
      }
  
      /* ─ Idle / Paused overlay ─ */
      .lsp-paused {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 12px; background: var(--panel-bg, #0f0f1a);
        color: var(--text-dim, #9ca3af); font-size: 13px; text-align: center; padding: 24px;
      }
      .lsp-paused-icon { font-size: 36px; }
      .lsp-resume-btn {
        padding: 8px 20px; border: none; border-radius: 6px;
        background: #6366f1; color: #fff; font-size: 13px; cursor: pointer; transition: opacity .15s;
      }
      .lsp-resume-btn:hover { opacity: .85; }
  
      /* ─ Offline / Error ─ */
      .lsp-offline {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 12px; padding: 24px; text-align: center; background: var(--panel-bg, #0f0f1a);
      }
      .lsp-offline-icon { font-size: 32px; }
      .lsp-offline-msg { font-size: 13px; color: var(--text-dim, #9ca3af); }
      .lsp-offline-link {
        padding: 6px 16px; border-radius: 6px; border: 1px solid var(--border, #2d2d44);
        color: #6366f1; font-size: 12px; text-decoration: none; cursor: pointer;
      }
      .lsp-offline-link:hover { background: rgba(99,102,241,.1); }
  
      /* ─ Settings panel ─ */
      .lsp-settings-overlay {
        position: absolute; inset: 0; z-index: 10;
        background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center;
      }
      .lsp-settings-box {
        background: var(--panel-bg, #1a1a2e);
        border: 1px solid var(--border, #2d2d44); border-radius: 10px;
        padding: 20px; min-width: 260px; display: flex; flex-direction: column; gap: 16px;
      }
      .lsp-settings-title { font-weight: 600; font-size: 14px; }
      .lsp-settings-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .lsp-settings-label { font-size: 12px; color: var(--text-dim, #9ca3af); }
      .lsp-toggle {
        position: relative; width: 36px; height: 20px; cursor: pointer;
      }
      .lsp-toggle input { opacity: 0; width: 0; height: 0; }
      .lsp-toggle-track {
        position: absolute; inset: 0; border-radius: 10px;
        background: var(--border, #2d2d44); transition: background .2s;
      }
      .lsp-toggle input:checked + .lsp-toggle-track { background: #6366f1; }
      .lsp-toggle-thumb {
        position: absolute; top: 3px; left: 3px;
        width: 14px; height: 14px; border-radius: 50%;
        background: #fff; transition: transform .2s;
      }
      .lsp-toggle input:checked ~ .lsp-toggle-thumb { transform: translateX(16px); }
      .lsp-settings-close {
        align-self: flex-end; background: none; border: 1px solid var(--border, #2d2d44);
        cursor: pointer; color: var(--text-dim, #9ca3af); font-size: 12px;
        padding: 5px 14px; border-radius: 5px;
      }
      .lsp-settings-close:hover { color: var(--text, #e2e8f0); }
      `;
        const el = document.createElement('style');
        el.id = STYLE_ID;
        el.textContent = css;
        document.head.appendChild(el);
    }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// YOUTUBE EMBED URL BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildEmbedUrl(videoId: string, muted: boolean, playing: boolean): string {
    const params = new URLSearchParams({
        autoplay: playing ? '1' : '0',
        mute: muted ? '1' : '0',
        controls: '1',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IconPlay: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const IconPause: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const IconMuted: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
);

const IconUnmuted: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
);

const IconFullscreen: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
);

const IconExitFullscreen: FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 14h6v6" />
        <path d="M20 10h-6V4" />
        <path d="M14 10l7-7" />
        <path d="M3 21l7-7" />
    </svg>
);

const IconGrid: FC = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
);

const IconSingle: FC = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <rect x="3" y="19" width="18" height="2" rx="1" />
    </svg>
);

const IconSettings: FC = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle: FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
    <label className="lsp-toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="lsp-toggle-track" />
        <span className="lsp-toggle-thumb" />
    </label>
);

// ── Settings overlay ──────────────────────────────────────────────────────────
const SettingsOverlay: FC<{
    settings: StreamSettings;
    onUpdate: (s: StreamSettings) => void;
    onClose: () => void;
}> = ({ settings, onUpdate, onClose }) => (
    <div className="lsp-settings-overlay" onClick={onClose}>
        <div className="lsp-settings-box" onClick={e => e.stopPropagation()}>
            <div className="lsp-settings-title">⚙ Stream Settings</div>

            <div className="lsp-settings-row">
                <span className="lsp-settings-label">Always On (no auto-pause)</span>
                <Toggle
                    checked={settings.alwaysOn}
                    onChange={v => onUpdate({ ...settings, alwaysOn: v })}
                />
            </div>

            <div className="lsp-settings-row">
                <span className="lsp-settings-label">
                    Eco idle pause: {settings.ecoIdleMinutes} min
                </span>
                <input
                    type="range" min={1} max={30} value={settings.ecoIdleMinutes}
                    style={{ width: 80 }}
                    onChange={e => onUpdate({ ...settings, ecoIdleMinutes: Number(e.target.value) })}
                    disabled={settings.alwaysOn}
                />
            </div>

            <button className="lsp-settings-close" onClick={onClose}>Close</button>
        </div>
    </div>
);

// ── Single-channel player ─────────────────────────────────────────────────────
const SinglePlayer: FC<{
    channel: LiveChannel;
    isPlaying: boolean;
    isMuted: boolean;
}> = ({ channel, isPlaying, isMuted }) => {
    const src = buildEmbedUrl(channel.videoId, isMuted, isPlaying);
    return (
        <iframe
            key={src}
            className="lsp-embed"
            src={src}
            title={`${channel.name} live`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
        />
    );
};

// ── Grid player (2×2) ─────────────────────────────────────────────────────────
const GridPlayer: FC<{
    feeds: LiveChannel[];
    onExpand: (ch: LiveChannel) => void;
}> = ({ feeds, onExpand }) => (
    <div className="lsp-grid">
        {feeds.slice(0, 4).map(ch => (
            <div
                key={ch.id}
                className="lsp-grid-cell"
                onClick={() => onExpand(ch)}
            >
                <iframe
                    className="lsp-grid-iframe"
                    src={buildEmbedUrl(ch.videoId, true, true)}
                    title={ch.name}
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
                <div className="lsp-cell-overlay">
                    <div className="lsp-cell-label">
                        <span className="lsp-cell-live" />
                        {(ch.city ?? ch.name).toUpperCase()}
                    </div>
                    <button className="lsp-expand-btn" onClick={e => { e.stopPropagation(); onExpand(ch); }}>
                        ⤢
                    </button>
                </div>
            </div>
        ))}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// IDLE DETECTION HOOK
// ─────────────────────────────────────────────────────────────────────────────

function useIdleDetection(
    settings: StreamSettings,
    onIdle: () => void,
    onActive: () => void,
) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reset = useCallback(() => {
        if (settings.alwaysOn) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        onActive();
        timerRef.current = setTimeout(onIdle, settings.ecoIdleMinutes * 60_000);
    }, [settings, onIdle, onActive]);

    useEffect(() => {
        if (settings.alwaysOn) {
            if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
            onActive();
            return;
        }
        IDLE_EVENTS.forEach(ev => document.addEventListener(ev, reset, { passive: true }));
        reset();
        return () => {
            IDLE_EVENTS.forEach(ev => document.removeEventListener(ev, reset));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [settings.alwaysOn, reset, onActive]);

    useEffect(() => {
        const handler = () => {
            if (document.hidden) {
                if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
            } else {
                reset();
            }
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, [reset]);
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const LiveStreamPlayer: FC<LiveStreamPlayerProps> = ({
    mode = 'news',
    channels: channelsProp,
    title,
    closable = true,
    onClose,
}) => {
    useInjectStyles();

    // ── Base channel list ──────────────────────────────────────────────────────
    const baseChannels = useMemo(
        () => channelsProp ?? (mode === 'webcams' ? WEBCAM_CHANNELS : NEWS_CHANNELS),
        [channelsProp, mode],
    );

    // ── Persistent state ───────────────────────────────────────────────────────
    const [settings, setSettings] = useState<StreamSettings>(loadSettings);
    const [activeId, setActiveId] = useState<string>(() => readLS(LS_ACTIVE_KEY, baseChannels[0]?.id ?? ''));
    const [region, setRegion] = useState<RegionKey>(() => readLS(LS_REGION_KEY, 'all') as RegionKey);
    const [viewMode, setViewMode] = useState<ViewMode>(() => readLS(LS_VIEW_KEY, 'single') as ViewMode);

    // ── Transient state ────────────────────────────────────────────────────────
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // ── Derived lists ──────────────────────────────────────────────────────────
    const filteredChannels = useMemo(() => {
        if (mode !== 'webcams' || region === 'all') return baseChannels;
        return baseChannels.filter(c => c.region === region);
    }, [baseChannels, mode, region]);

    const activeChannel = useMemo(
        () => filteredChannels.find(c => c.id === activeId) ?? filteredChannels[0] ?? baseChannels[0]!,
        [filteredChannels, activeId, baseChannels],
    );

    const gridFeeds = useMemo(() => {
        if (mode !== 'webcams') return [];
        if (region === 'all') {
            return DEFAULT_GRID_IDS
                .map(id => baseChannels.find(c => c.id === id))
                .filter((c): c is LiveChannel => c != null);
        }
        return filteredChannels.slice(0, 4);
    }, [mode, region, baseChannels, filteredChannels]);

    // ── Persistence callbacks ──────────────────────────────────────────────────
    const handleSettingsUpdate = useCallback((s: StreamSettings) => {
        setSettings(s);
        saveSettings(s);
    }, []);

    const selectChannel = useCallback((ch: LiveChannel) => {
        setActiveId(ch.id);
        writeLS(LS_ACTIVE_KEY, ch.id);
        if (viewMode === 'grid') setViewMode('single');
        writeLS(LS_VIEW_KEY, 'single');
    }, [viewMode]);

    const selectRegion = useCallback((r: RegionKey) => {
        setRegion(r);
        writeLS(LS_REGION_KEY, r);
    }, []);

    const selectView = useCallback((v: ViewMode) => {
        setViewMode(v);
        writeLS(LS_VIEW_KEY, v);
    }, []);

    // ── Play / Mute ────────────────────────────────────────────────────────────
    const togglePlay = useCallback(() => setIsPlaying(p => !p), []);
    const toggleMute = useCallback(() => setIsMuted(m => !m), []);

    // ── Fullscreen ─────────────────────────────────────────────────────────────
    const toggleFullscreen = useCallback(() => setIsFullscreen(f => !f), []);
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isFullscreen]);

    // ── Idle detection ─────────────────────────────────────────────────────────
    const handleIdle = useCallback(() => { setIsIdle(true); setIsPlaying(false); }, []);
    const handleActive = useCallback(() => { setIsIdle(false); setIsPlaying(true); }, []);
    useIdleDetection(settings, handleIdle, handleActive);

    // ── Drag-to-reorder channel switcher ──────────────────────────────────────
    const [channels, setChannels] = useState(baseChannels);
    useEffect(() => { setChannels(baseChannels); }, [baseChannels]);

    const dragRef = useRef<{ id: string | null; startX: number; moved: boolean }>({ id: null, startX: 0, moved: false });

    const onDragStart = useCallback((e: React.MouseEvent, id: string) => {
        dragRef.current = { id, startX: e.clientX, moved: false };
    }, []);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragRef.current.id) return;
            if (!dragRef.current.moved && Math.abs(e.clientX - dragRef.current.startX) > 6) {
                dragRef.current.moved = true;
            }
        };
        const onUp = () => { dragRef.current = { id: null, startX: 0, moved: false }; };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, []);

    const onDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>, targetId: string) => {
        if (!dragRef.current.id || dragRef.current.id === targetId) return;
        e.preventDefault();
        setChannels(prev => {
            const from = prev.findIndex(c => c.id === dragRef.current.id);
            const to = prev.findIndex(c => c.id === targetId);
            if (from === -1 || to === -1) return prev;
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved!);
            return next;
        });
    }, []);

    // ── Render content area ────────────────────────────────────────────────────
    const renderContent = () => {
        if (isIdle || !isPlaying) {
            return (
                <div className="lsp-paused">
                    <div className="lsp-paused-icon">⏸</div>
                    <div>{isIdle ? 'Paused — eco idle mode' : 'Stream paused'}</div>
                    <button className="lsp-resume-btn" onClick={() => { setIsIdle(false); setIsPlaying(true); }}>
                        ▶ Resume
                    </button>
                </div>
            );
        }

        if (viewMode === 'grid' && mode === 'webcams' && gridFeeds.length > 0) {
            return (
                <GridPlayer
                    feeds={gridFeeds}
                    onExpand={ch => { selectChannel(ch); selectView('single'); }}
                />
            );
        }

        if (!activeChannel) {
            return (
                <div className="lsp-offline">
                    <div className="lsp-offline-icon">📺</div>
                    <div className="lsp-offline-msg">No channel selected</div>
                </div>
            );
        }

        return (
            <SinglePlayer
                channel={activeChannel}
                isPlaying={isPlaying}
                isMuted={isMuted}
            />
        );
    };

    // ── Panel title ────────────────────────────────────────────────────────────
    const panelTitle = title ?? (mode === 'webcams' ? 'Live Webcams' : 'Live News');

    // ── Channels shown in the switcher ────────────────────────────────────────
    const switcherChannels = mode === 'webcams' ? filteredChannels : channels;

    return (
        <div className={`lsp-panel${isFullscreen ? ' lsp-fullscreen' : ''}`}>

            {/* ── Header ── */}
            <div className="lsp-header">
                <div className="lsp-header-left">
                    <span className="lsp-live-dot" />
                    <span className="lsp-title">{panelTitle}</span>
                    <span className="lsp-count-badge">{baseChannels.length}</span>
                </div>

                <div className="lsp-header-controls">
                    {/* Play / Pause */}
                    <button
                        className={`lsp-icon-btn${isPlaying ? ' lsp-active' : ''}`}
                        title={isPlaying ? 'Pause' : 'Play'}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <IconPause /> : <IconPlay />}
                    </button>

                    {/* Mute */}
                    <button
                        className={`lsp-icon-btn${!isMuted ? ' lsp-unmuted' : ''}`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                        onClick={toggleMute}
                    >
                        {isMuted ? <IconMuted /> : <IconUnmuted />}
                    </button>

                    {/* Fullscreen */}
                    <button
                        className="lsp-icon-btn"
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
                    </button>

                    {/* Settings */}
                    <button
                        className="lsp-icon-btn"
                        title="Stream settings"
                        onClick={() => setShowSettings(s => !s)}
                    >
                        <IconSettings />
                    </button>

                    {/* Close */}
                    {closable && (
                        <button className="lsp-icon-btn" title="Close" onClick={onClose}>
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* ── Webcam-only: region filter + view toggle ── */}
            {mode === 'webcams' && (
                <div className="lsp-toolbar">
                    <div className="lsp-toolbar-group">
                        {REGIONS.map(r => (
                            <button
                                key={r.key}
                                className={`lsp-region-btn${region === r.key ? ' lsp-active' : ''}`}
                                onClick={() => selectRegion(r.key)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <div className="lsp-toolbar-group">
                        <button
                            className={`lsp-view-btn${viewMode === 'grid' ? ' lsp-active' : ''}`}
                            title="Grid view"
                            onClick={() => selectView('grid')}
                        >
                            <IconGrid />
                        </button>
                        <button
                            className={`lsp-view-btn${viewMode === 'single' ? ' lsp-active' : ''}`}
                            title="Single view"
                            onClick={() => selectView('single')}
                        >
                            <IconSingle />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Channel switcher tabs ── */}
            <div className="lsp-switcher">
                {switcherChannels.map(ch => (
                    <button
                        key={ch.id}
                        className={`lsp-channel-btn${ch.id === activeChannel?.id ? ' lsp-active' : ''}`}
                        onClick={() => selectChannel(ch)}
                        onMouseDown={e => onDragStart(e, ch.id)}
                        onDragOver={e => onDragOver(e, ch.id)}
                        draggable
                    >
                        {ch.name}
                    </button>
                ))}
            </div>

            {/* ── Player area ── */}
            <div className="lsp-content">
                {renderContent()}
                {showSettings && (
                    <SettingsOverlay
                        settings={settings}
                        onUpdate={handleSettingsUpdate}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default LiveStreamPlayer;
