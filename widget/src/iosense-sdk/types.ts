// =============================================================================
// Envelope.md — Three-Key Config Envelope Architecture
// Widget = pure UI renderer. Never fetches data. Ever.
// Configurator produces { timeConfig, apiConfig, uiConfig }.
// DataLayer reads apiConfig + timeConfig, fetches, injects data prop.
// Widget reads uiConfig (as config) + data prop, renders.
// =============================================================================

// === Shared: Source Type ===

export type SourceType = 'device' | 'cluster' | 'compute' | 'customExpression';

// === timeConfig — used by BOTH widget UI and DataLayer ===

export interface DurationOption {
  id: string;
  name: string;
  hideToggle: boolean;
  duration: { value: string; viewValue: string };
  xPeriod: string;
  xEvent: string;
  yPeriod: string;
  yEvent: string;
  event: string;
  periodicities: string[];
  x: number;
  y: number;
}

export interface TimeConfig {
  timezone: string;
  type: 'local' | 'fixed' | string;
  startTime: string | null;
  endTime: string | null;
  defaultDuration: string;
  defaultPeriodicity: 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  allDurations: DurationOption[];
  cycleTimeHr?: number;
  cycleTimeMin?: number;
  cycleYear?: number;
  selectedDate?: number;
  selectedDay?: number;
  selectedMonth?: number;
}

// === apiConfig — used ONLY by DataLayer, widget never reads this ===

export interface DataSourceConfig {
  _id: string;                  // MUST match uiConfig.charts[n]._id
  label: string;
  body: Record<string, any>;    // {{startTime}}, {{endTime}}, {{periodicity}} placeholders
  responsePath: string;         // e.g. "data.data"
}

export interface ApiConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers: Record<string, string>;
  query?: Record<string, any>;
  dataConfig: DataSourceConfig[];
}

// === uiConfig — used ONLY by Widget, passed as `config` prop ===

export interface GaugeBand {
  from: number;
  to: number;
  color: string;
}

export interface GaugeChartConfig {
  _id: string;                  // MUST match apiConfig.dataConfig[n]._id
  chartType: 'gauge';
  title?: string;
  description?: string;
  min: number;
  max: number;
  bands: GaugeBand[];
  unit?: string;
  dataPrecision?: number;
}

export interface GaugeStyleConfig {
  card: {
    wrapInCard: boolean;
    background: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  gauge: {
    fontSize: string;
    fontColor: string;
    fontWeight: string;
    dialColor: string;
    pivotColor: string;
  };
}

export interface TimeDisplayConfig {
  allDurations: DurationOption[];
  defaultDurationLabel: string;
}

export interface GaugeUIConfig {
  charts: GaugeChartConfig[];
  style: GaugeStyleConfig;
  time?: TimeDisplayConfig;
}

// === The Config Envelope — Configurator output ===

export interface WidgetConfigEnvelope {
  timeConfig: TimeConfig;
  apiConfig: ApiConfig;
  uiConfig: GaugeUIConfig;
}

// === WidgetData — keyed by _id ===

export type WidgetData = {
  [chartId: string]: any[];
};

// === Widget Events — emitted via onEvent, never self-fetch ===

export type WidgetEvent =
  | { type: 'TIME_CHANGE'; payload: { startTime: string; endTime: string; periodicity: string } }
  | { type: 'DRILL_DOWN'; payload: { level: string; value: string } }
  | { type: 'CHART_TYPE_CHANGE'; payload: { chartId: string; newType: string } }
  | { type: 'FILTER_CHANGE'; payload: Record<string, any> };

// === Widget Props (pure renderer — Envelope.md contract) ===

export interface WidgetProps {
  config: GaugeUIConfig;                    // uiConfig only — widget never sees apiConfig
  data: WidgetData | null;                  // null = loading, DataLayer injects after fetch
  onEvent: (event: WidgetEvent) => void;    // emit interactions, never re-fetch
}

// === Configuration Props ===

export interface ConfigurationProps {
  config: WidgetConfigEnvelope;
  authentication: string;
  onChange: (config: WidgetConfigEnvelope) => void;
}

// === Defaults ===

const GAUGE_CHART_ID = 'gauge-value';

export const DEFAULT_TIME_CONFIG: TimeConfig = {
  timezone: 'Asia/Kolkata',
  type: 'local',
  startTime: null,
  endTime: null,
  defaultDuration: 'today',
  defaultPeriodicity: 'hourly',
  allDurations: [],
};

export const DEFAULT_API_CONFIG: ApiConfig = {
  endpoint: 'https://connector.iosense.io/api/v2/masterData/getWidgetData',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: '{{authentication}}',
  },
  dataConfig: [
    {
      _id: GAUGE_CHART_ID,
      label: 'Gauge Value',
      body: {
        type: 'device',
        operator: 'LastDP',
        startTime: '{{startTime}}',
        endTime: '{{endTime}}',
        periodicity: '{{periodicity}}',
      },
      responsePath: 'data.data',
    },
  ],
};

export const DEFAULT_UI_CONFIG: GaugeUIConfig = {
  charts: [
    {
      _id: GAUGE_CHART_ID,
      chartType: 'gauge',
      title: 'Gauge',
      min: 0,
      max: 100,
      unit: '',
      dataPrecision: 2,
      bands: [
        { from: 0, to: 33, color: '#55BF3B' },
        { from: 33, to: 66, color: '#DDDF0D' },
        { from: 66, to: 100, color: '#DF5353' },
      ],
    },
  ],
  style: {
    card: {
      wrapInCard: true,
      background: '#ffffff',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
    },
    gauge: {
      fontSize: '14px',
      fontColor: '#333333',
      fontWeight: '600',
      dialColor: '#333333',
      pivotColor: '#333333',
    },
  },
};

export const DEFAULT_ENVELOPE: WidgetConfigEnvelope = {
  timeConfig: DEFAULT_TIME_CONFIG,
  apiConfig: DEFAULT_API_CONFIG,
  uiConfig: DEFAULT_UI_CONFIG,
};
