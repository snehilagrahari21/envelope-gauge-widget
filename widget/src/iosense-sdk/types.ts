// === Data Configuration Schema (standardized per iosense-sdk) ===

export type SourceType = 'device' | 'cluster' | 'compute' | 'customExpression';

export interface DataConfig {
  type: SourceType;
  // Device fields
  devID?: string;
  devTypeID?: string;
  sensor?: string;
  operator?: string;
  // Cluster fields
  clusterID?: string;
  clusterOperator?: string;
  // Compute fields
  flowID?: string;
  flowParams?: string;
  // Custom expression fields
  bindings?: string;
  // Shared fields
  unit?: string;
  dataPrecision?: number;
}

export interface ExternalApi {
  [key: string]: any;
}

// === Gauge-specific config ===

export interface GaugeBand {
  from: number;
  to: number;
  color: string;
}

export interface GaugeChartEntry {
  dataConfig: DataConfig;
  api?: ExternalApi;
  title?: string;
  description?: string;
  min: number;
  max: number;
  bands: GaugeBand[];
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

export interface GaugeTimeConfig {
  timezone: string;
  type: 'local' | 'fixed' | string;
  startTime: string | null;
  endTime: string | null;
  defaultDuration: string;
  defaultPeriodicity: 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  allDurations: DurationOption[];
}

export interface GaugeWidgetConfig {
  charts: GaugeChartEntry[];
  style: GaugeStyleConfig;
  time?: GaugeTimeConfig;
}

// === Widget Props (iosense-sdk-beta lifecycle) ===

export interface WidgetProps {
  config: GaugeWidgetConfig;
  data?: Record<string, any> | null;
  authentication: string;
  timeChange?: (payload: { startTime: number | string; endTime: number | string }) => void;
  chartChange?: (payload: { activeIndex: number }) => void;
}

export interface ConfigurationProps {
  config: GaugeWidgetConfig;
  authentication: string;
  onChange: (config: GaugeWidgetConfig) => void;
}

// === Default config ===

export const DEFAULT_GAUGE_CONFIG: GaugeWidgetConfig = {
  charts: [
    {
      dataConfig: {
        type: 'device',
        operator: 'LastDP',
        unit: '',
        dataPrecision: 2,
      },
      title: 'Gauge',
      min: 0,
      max: 100,
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
