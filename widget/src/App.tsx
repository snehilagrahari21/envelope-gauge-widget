import React, { useState, useEffect, useRef } from 'react';
import { GaugeWidgetConfig, DEFAULT_GAUGE_CONFIG } from './iosense-sdk/types';
import './components/Gauge/index';
import './components/GaugeConfiguration/index';
import './App.css';

const App: React.FC = () => {
  const [config, setConfig] = useState<GaugeWidgetConfig>(DEFAULT_GAUGE_CONFIG);
  const widgetMounted = useRef(false);
  const configMounted = useRef(false);

  const authentication = localStorage.getItem('authentication') ?? '';

  console.log('[App] render', {
    authentication: authentication ? `${authentication.substring(0, 20)}...` : '(empty)',
    config,
  });

  // Mount widget via window.ReactWidgets (same as Lens prod)
  useEffect(() => {
    const rw = (window as any).ReactWidgets;
    console.log('[App] initial mount — ReactWidgets available:', Object.keys(rw ?? {}));
    if (!rw) {
      console.error('[App] window.ReactWidgets not found — self-registration failed');
      return;
    }

    if (!configMounted.current) {
      console.log('[App] mounting GaugeConfiguration');
      rw.GaugeConfiguration?.mount('config-panel', {
        config,
        authentication,
        onChange: (updated: GaugeWidgetConfig) => {
          console.log('[App] config onChange received from config panel', updated);
          setConfig(updated);
        },
      });
      configMounted.current = true;
    }

    if (!widgetMounted.current) {
      console.log('[App] mounting Gauge widget');
      rw.Gauge?.mount('widget-preview', {
        config,
        authentication,
      });
      widgetMounted.current = true;
    }
  }, []);

  // Update widget when config changes
  useEffect(() => {
    if (!widgetMounted.current) return;
    console.log('[App] config changed — updating Gauge widget', config);
    const rw = (window as any).ReactWidgets;
    rw?.Gauge?.update('widget-preview', { config, authentication });
  }, [config, authentication]);

  // Update config panel when config changes (round-trip)
  useEffect(() => {
    if (!configMounted.current) return;
    console.log('[App] config changed — updating GaugeConfiguration (round-trip)', config);
    const rw = (window as any).ReactWidgets;
    rw?.GaugeConfiguration?.update('config-panel', {
      config,
      authentication,
      onChange: (updated: GaugeWidgetConfig) => {
        console.log('[App] config onChange received from config panel (round-trip)', updated);
        setConfig(updated);
      },
    });
  }, [config, authentication]);

  return (
    <div className="app-harness">
      <div className="app-harness__config" id="config-panel" />
      <div className="app-harness__widget" id="widget-preview" />
    </div>
  );
};

export default App;
