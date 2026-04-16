// ============================================================================
// App.tsx — Dev Preview Harness
// Simulates the DataLayer behavior for local development:
//   1. Config panel produces the full three-key envelope
//   2. App reads apiConfig + timeConfig → resolves placeholders → fetches data
//   3. App passes uiConfig as `config` + fetched data as `data` to widget
//   4. Widget never sees apiConfig or authentication
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  WidgetConfigEnvelope,
  WidgetData,
  WidgetEvent,
  DEFAULT_ENVELOPE,
} from './iosense-sdk/types';
import { getWidgetData } from './iosense-sdk/api';
import './components/Gauge/index';
import './components/GaugeConfiguration/index';
import './App.css';

const App: React.FC = () => {
  const [envelope, setEnvelope]     = useState<WidgetConfigEnvelope>(DEFAULT_ENVELOPE);
  const [widgetData, setWidgetData] = useState<WidgetData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const widgetMounted = useRef(false);
  const configMounted = useRef(false);

  const authentication = localStorage.getItem('authentication') ?? '';

  console.log('[App] render', {
    authentication: authentication ? `${authentication.substring(0, 20)}...` : '(empty)',
    envelope,
    widgetData,
  });

  // ── DataLayer Simulation ──────────────────────────────────────────────
  // Reads apiConfig + timeConfig from envelope, resolves placeholders,
  // fires requests, injects result as data prop keyed by _id.
  const fetchDataLayer = useCallback(async (
    env: WidgetConfigEnvelope,
    auth: string,
    overrides?: { startTime?: string; endTime?: string; periodicity?: string }
  ) => {
    if (!auth) {
      console.log('[App/DataLayer] skipping fetch — no authentication');
      return;
    }

    const { apiConfig, timeConfig } = env;
    console.log('[App/DataLayer] starting fetch', { apiConfig, timeConfig });

    // Resolve time from timeConfig (or overrides from widget TIME_CHANGE event)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const resolvedStartTime = overrides?.startTime ?? timeConfig.startTime ?? oneHourAgo.toISOString();
    const resolvedEndTime = overrides?.endTime ?? timeConfig.endTime ?? now.toISOString();
    const resolvedPeriodicity = overrides?.periodicity ?? timeConfig.defaultPeriodicity;

    // Fetch all dataConfig entries in parallel
    const results: WidgetData = {};
    try {
      const fetches = apiConfig.dataConfig.map(async (dc) => {
        // Replace {{placeholders}} in body
        const resolvedBody: Record<string, any> = {};
        for (const [key, val] of Object.entries(dc.body)) {
          if (val === '{{startTime}}') resolvedBody[key] = resolvedStartTime;
          else if (val === '{{endTime}}') resolvedBody[key] = resolvedEndTime;
          else if (val === '{{periodicity}}') resolvedBody[key] = resolvedPeriodicity;
          else resolvedBody[key] = val;
        }

        console.log('[App/DataLayer] fetching for _id:', dc._id, resolvedBody);
        const result = await getWidgetData(auth, resolvedBody);
        console.log('[App/DataLayer] response for _id:', dc._id, result);
        results[dc._id] = result;
      });

      await Promise.all(fetches);
      console.log('[App/DataLayer] all fetches complete, injecting data', results);
      setFetchError(null);
      setWidgetData(results);
    } catch (err: any) {
      const msg = err?.message ?? 'Failed to load data';
      console.error('[App/DataLayer] fetch failed:', msg, err);
      setFetchError(msg);
      setWidgetData({});
    }
  }, []);

  // Widget event handler — simulates DataLayer listening for onEvent
  const handleWidgetEvent = useCallback((event: WidgetEvent) => {
    console.log('[App/DataLayer] widget event received', event);
    if (event.type === 'TIME_CHANGE') {
      // Re-fetch with new time params
      fetchDataLayer(envelope, authentication, {
        startTime: event.payload.startTime,
        endTime: event.payload.endTime,
        periodicity: event.payload.periodicity,
      });
    }
  }, [envelope, authentication, fetchDataLayer]);

  // ── Initial Mount ─────────────────────────────────────────────────────
  useEffect(() => {
    const rw = (window as any).ReactWidgets;
    console.log('[App] initial mount — ReactWidgets available:', Object.keys(rw ?? {}));
    if (!rw) {
      console.error('[App] window.ReactWidgets not found — self-registration failed');
      return;
    }

    // Mount config panel — receives full envelope + authentication
    if (!configMounted.current) {
      console.log('[App] mounting GaugeConfiguration with full envelope');
      rw.GaugeConfiguration?.mount('config-panel', {
        config: envelope,
        authentication,
        onChange: (updated: WidgetConfigEnvelope) => {
          console.log('[App] config onChange received from config panel', updated);
          setEnvelope(updated);
        },
      });
      configMounted.current = true;
    }

    // Mount widget — receives ONLY uiConfig + data + error + onEvent (never apiConfig/auth)
    if (!widgetMounted.current) {
      console.log('[App] mounting Gauge widget with uiConfig only');
      rw.Gauge?.mount('widget-preview', {
        config: envelope.uiConfig,
        data: widgetData,
        error: fetchError,
        onEvent: handleWidgetEvent,
      });
      widgetMounted.current = true;
    }

    // Trigger initial data fetch
    fetchDataLayer(envelope, authentication);
  }, []);

  // ── Update widget when config, data, or error changes ─────────────────
  useEffect(() => {
    if (!widgetMounted.current) return;
    console.log('[App] updating Gauge widget — uiConfig + data + error', {
      uiConfig: envelope.uiConfig,
      data: widgetData,
      error: fetchError,
    });
    const rw = (window as any).ReactWidgets;
    rw?.Gauge?.update('widget-preview', {
      config: envelope.uiConfig,
      data: widgetData,
      error: fetchError,
      onEvent: handleWidgetEvent,
    });
  }, [envelope.uiConfig, widgetData, fetchError, handleWidgetEvent]);

  // ── Update config panel (round-trip) ──────────────────────────────────
  useEffect(() => {
    if (!configMounted.current) return;
    console.log('[App] updating GaugeConfiguration (round-trip)');
    const rw = (window as any).ReactWidgets;
    rw?.GaugeConfiguration?.update('config-panel', {
      config: envelope,
      authentication,
      onChange: (updated: WidgetConfigEnvelope) => {
        console.log('[App] config onChange received from config panel (round-trip)', updated);
        setEnvelope(updated);
      },
    });
  }, [envelope, authentication]);

  // ── Re-fetch when apiConfig or timeConfig changes ─────────────────────
  const prevApiRef = useRef(JSON.stringify(envelope.apiConfig));
  const prevTimeRef = useRef(JSON.stringify(envelope.timeConfig));
  useEffect(() => {
    const apiStr = JSON.stringify(envelope.apiConfig);
    const timeStr = JSON.stringify(envelope.timeConfig);
    if (apiStr !== prevApiRef.current || timeStr !== prevTimeRef.current) {
      console.log('[App/DataLayer] apiConfig or timeConfig changed — re-fetching');
      prevApiRef.current = apiStr;
      prevTimeRef.current = timeStr;
      fetchDataLayer(envelope, authentication);
    }
  }, [envelope.apiConfig, envelope.timeConfig, authentication, fetchDataLayer]);

  return (
    <div className="app-harness">
      <div className="app-harness__config" id="config-panel" />
      <div className="app-harness__widget" id="widget-preview" />
    </div>
  );
};

export default App;
