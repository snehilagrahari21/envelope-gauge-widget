name: widget-datalayer-architecture description: > Use this skill whenever a user asks to create, build, scaffold, update, or refactor a React widget in the IoSense / IIoT platform. This includes requests like "create a column chart widget", "build a gauge widget", "add a new widget", "refactor this widget to follow datalayer", "update widget configuration", or any task that touches a widget component or its configurator. This skill is MANDATORY for all widget work — never create a widget without consulting it first. It enforces the strict DataLayer + UILayer separation architecture where widgets are pure UI components that receive data and config as props, and all API calls, MQTT subscriptions, and

data fetching live exclusively in the DataLayer.
Widget DataLayer Architecture Skill
Core Principle — Read This First
Widgets are pure UI renderers. They never fetch data. Ever.

Every widget in this platform follows a strict separation of concerns:

Layer	Responsibility	Who owns it
Widget (UI Layer)	Render charts, cards, titles, axes. Emit user interaction events.	Widget component
Widget Configurator	Produce the full config envelope (apiConfig + uiConfig + timeConfig)	Configurator component
DataLayer	Fetch data, resolve variables, manage MQTT, inject data as props	Platform DataLayer engine
If you find yourself writing fetch(), axios, HttpClient, or any API call inside a widget component — stop. That belongs in the DataLayer.

1. Widget Component Contract
Every widget must accept exactly these props and nothing else for data/time:

interface WidgetProps {
  config: WidgetUIConfig;   // All UI rendering config (from uiConfig envelope)
  data: WidgetData | null;  // Data injected by DataLayer (null while loading)
  onEvent: (event: WidgetEvent) => void; // Emit interaction events to DataLayer
}
1a. config Prop (UIConfig)
Contains everything the widget needs to render its UI. The widget reads this and renders — it asks no questions about where the data came from.

interface WidgetUIConfig {
  charts: ChartConfig[];       // Chart type, series definitions, axes, stacks, plotlines
  style: StyleConfig;          // Card, chart, axis, legend, grid styling
  title?: TitleConfig;         // Widget title display
  time?: TimeDisplayConfig;    // Which time options to show, default duration label
}
1b. data Prop
Raw data passed by DataLayer after it has fetched and (optionally) AI-mapped the response. The widget renders this — it never transforms or enriches it by hitting an API.

// DataLayer resolves the responsePath and passes the extracted payload
type WidgetData = {
  [chartId: string]: any[];   // keyed by dataConfig[n]._id
}
1c. onEvent Prop — Emitting Events
When something happens inside the widget that affects data (time change, drill-down, filter), the widget emits an event and lets the DataLayer re-fetch. The widget never re-fetches itself.

type WidgetEvent =
  | { type: "TIME_CHANGE"; payload: { startTime: string; endTime: string; periodicity: string } }
  | { type: "DRILL_DOWN"; payload: { level: string; value: string } }
  | { type: "CHART_TYPE_CHANGE"; payload: { chartId: string; newType: string } }
  | { type: "FILTER_CHANGE"; payload: Record<string, any> };

// Usage inside widget:
props.onEvent({ type: "TIME_CHANGE", payload: { startTime, endTime, periodicity } });
✅ Widget DO / ❌ Widget DON'T
✅ DO	❌ DON'T
Read props.config to render UI	Call fetch() / axios / HttpClient
Read props.data to populate charts	Subscribe to MQTT topics
Call props.onEvent() on user interactions	Manage loading/error state for API calls
Show loading skeleton when data === null	Store API endpoints or credentials
Render time selectors using config.time	Decide what data to fetch based on time
Apply styles from config.style	Import data services or connectors
2. The Config Envelope
The Widget Configurator produces a single config object that is the contract between the widget, the DataLayer, and storage. It has three top-level keys:

widgetConfig = {
  timeConfig:  { ... }   // Time settings — used by BOTH widget UI and DataLayer
  apiConfig:   { ... }   // API settings — used ONLY by DataLayer
  uiConfig:    { ... }   // Render settings — used ONLY by Widget
}
2a. timeConfig
Used by the DataLayer to know the default time window for the first data fetch (before the user interacts), and by the widget to display available duration options.

interface TimeConfig {
  timezone: string;                    // IANA e.g. "Asia/Kolkata"
  type: "local" | "fixed" | string;   // "local" = widget owns its time; string = global variable reference like "{{gtpID}}"
  startTime: string | null;            // ISO string, used when type = "fixed"
  endTime: string | null;
  defaultDuration: string;             // ID reference → allDurations[n].id
  allDurations: DurationOption[];      // All available quick-select durations
  defaultPeriodicity: "minute" | "hourly" | "daily" | "weekly" | "monthly";
  cycleTimeHr?: number;
  cycleTimeMin?: number;
  cycleYear?: number;
  selectedDate?: number;
  selectedDay?: number;
  selectedMonth?: number;
}

interface DurationOption {
  id: string;
  name: string;                        // Display label e.g. "Today", "Last 7 Days"
  hideToggle: boolean;
  duration: { value: string; viewValue: string };
  xPeriod: string; xEvent: string;
  yPeriod: string; yEvent: string;
  event: string;
  periodicities: string[];             // Allowed periodicities for this duration
  x: number; y: number;
}
2b. apiConfig
DataLayer only. The widget never reads this. It tells the DataLayer which endpoint to call, how to call it, and what the request body looks like per chart entry.

interface ApiConfig {
  endpoint: string;          // e.g. "https://connector.iosense.io/api/.../getWidgetData"
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;  // May contain {{authentication}} placeholder
  query?: Record<string, any>;      // Optional query params, may have {{}} placeholders

  dataConfig: DataSourceConfig[];   // One entry per chart/series
}

interface DataSourceConfig {
  _id: string;               // Unique ID — MUST match a chart._id in uiConfig.charts
  label: string;             // Human-readable e.g. "Line A — kWh"
  body: Record<string, any>; // Full request body. Use {{startTime}}, {{endTime}}, {{periodicity}} as placeholders
  responsePath: string;      // Dot-path to extract from response e.g. "data.data"
}
Placeholder conventions in body:

Placeholder	Replaced with
{{startTime}}	Resolved start time from timeConfig
{{endTime}}	Resolved end time from timeConfig
{{periodicity}}	Resolved periodicity
{{authentication}}	Auth token from platform
{{variableName}}	Any DataLayer variable
2c. uiConfig
Widget only. The DataLayer never reads this. Passed directly as config prop to the widget.

interface UIConfig {
  charts: ChartConfig[];
  style: StyleConfig;
}

interface ChartConfig {
  _id: string;                  // MUST match a dataConfig[n]._id in apiConfig
  chartType: "bar" | "line" | "column" | "pie" | "gauge" | "scatter" | "area";
  series: SeriesConfig[];
  axes: AxisConfig[];
  stacks?: StackConfig[];
  plotlines?: PlotlineConfig[];
  plotbands?: PlotbandConfig[];
}

interface StyleConfig {
  card: {
    wrapInCard: boolean;
    background: string;
    borderRadius: number;
    padding: number;
  };
  chart: { fontSize: string; fontColor: string; fontWeight: string };
  xAxis: { labelColor: string; lineColor: string };
  yAxis: { labelColor: string; lineColor: string };
  legend: { color: string; fontSize: string };
  others: { gridLineColor: string };
}
3. The _id Link Between apiConfig and uiConfig
This is critical. Each dataConfig entry has an _id. Each charts entry has an _id. They must match.

The DataLayer uses this link to know: "I fetched data for chart-1, now inject it into data["chart-1"] for the widget."

apiConfig.dataConfig[0]._id = "chart-1"
                                    ↕  must be identical
uiConfig.charts[0]._id       = "chart-1"
Always generate matching _id values when scaffolding a new widget config. Use descriptive IDs like "energy-line", "temp-bar", not just "chart-1".

4. File Structure for a Widget
When creating a new widget, always scaffold these files:

widgets/
└── <widget-name>/
    ├── <WidgetName>.tsx              # Widget UI component (pure renderer)
    ├── <WidgetName>Configurator.tsx  # Config builder UI (produces the envelope)
    ├── types.ts                      # TypeScript interfaces for this widget's config
    └── index.ts                      # Barrel export
Widget Component Template
// ColumnChartWidget.tsx
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ColumnChartWidgetProps {
  config: WidgetUIConfig;
  data: WidgetData | null;
  onEvent: (event: WidgetEvent) => void;
}

const ColumnChartWidget: React.FC<ColumnChartWidgetProps> = ({ config, data, onEvent }) => {
  // ✅ Build chart options from config + data
  const chartOptions = buildHighchartsOptions(config, data);

  // ✅ Handle time change — emit event, never re-fetch
  const handleDurationChange = (duration: DurationOption) => {
    const { startTime, endTime } = resolveDuration(duration);
    onEvent({
      type: "TIME_CHANGE",
      payload: { startTime, endTime, periodicity: duration.periodicities[0] }
    });
  };

  // ✅ Show loading state while DataLayer fetches
  if (data === null) {
    return <WidgetSkeleton config={config} />;
  }

  return (
    <div style={cardStyle(config.style.card)}>
      {config.title && <WidgetTitle config={config.title} />}
      {config.time && (
        <TimeSelector
          durations={config.time.allDurations}
          onSelect={handleDurationChange}
        />
      )}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default ColumnChartWidget;
5. Configurator Output Contract
The configurator's job is to let users set up a widget and produce a valid config envelope. When saving, it must emit:

interface WidgetConfigEnvelope {
  timeConfig: TimeConfig;
  apiConfig: ApiConfig;
  uiConfig: UIConfig;
}
The configurator should have three logical sections in its UI: 1. Data Source → builds apiConfig (endpoint, method, headers, body per series) 2. Time Settings → builds timeConfig (timezone, durations, default periodicity) 3. Appearance → builds uiConfig (chart types, axes, series labels, styling)

6. What the DataLayer Does (for context — don't implement in widget)
Understanding the DataLayer helps write better widgets. The DataLayer:

Reads timeConfig → resolves startTime, endTime, periodicity
Reads apiConfig → replaces all {{placeholders}} in headers/body/query
Fires all dataConfig requests in parallel (does not wait for widget render)
Extracts payload using responsePath dot-path
Optionally runs AI mapping to transform response to widget-specific format
Injects result as data prop keyed by _id
Listens for onEvent emissions from widget → re-fetches with new time params
7. Common Mistakes to Avoid
❌ API call inside widget
// WRONG
useEffect(() => {
  axios.get(config.endpoint).then(res => setData(res.data)); // ← DataLayer's job
}, []);
✅ Correct: wait for data prop
// RIGHT
if (props.data === null) return <Skeleton />;
const series = props.data["chart-1"]; // ← DataLayer already fetched and injected this
❌ Hard-coded endpoint in widget
// WRONG
const API = "https://connector.iosense.io/api/getWidgetData"; // ← belongs in apiConfig only
❌ Time state managed inside widget
// WRONG
const [startTime, setStartTime] = useState(dayjs().subtract(1, "day"));
useEffect(() => { fetchData(startTime, endTime); }, [startTime]); // ← DataLayer's job
✅ Correct: emit event and let DataLayer handle it
// RIGHT
const onDurationSelect = (d: DurationOption) => {
  props.onEvent({ type: "TIME_CHANGE", payload: resolvedTimes(d) });
};
8. Checklist Before Submitting Any Widget Code
Before finalising widget code, verify every item:

[ ] Widget has no fetch, axios, http.get, HttpClient calls
[ ] Widget has no MQTT subscribe/publish calls
[ ] Widget accepts config, data, onEvent props
[ ] All user interactions that affect data emit via onEvent
[ ] Widget renders a loading state when data === null
[ ] _id values in apiConfig.dataConfig match uiConfig.charts exactly
[ ] timeConfig is present and has a valid defaultDuration reference
[ ] All API endpoints and credentials are in apiConfig only, not in widget
[ ] {{placeholders}} are used in apiConfig.body for dynamic values
[ ] Configurator produces the full three-key envelope: timeConfig, apiConfig, uiConfig