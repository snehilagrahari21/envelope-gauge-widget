// ============================================================================
// Gauge Configurator — Produces the three-key envelope (Envelope.md)
// Output: { timeConfig, apiConfig, uiConfig }
//   - Data tab   → per-chart data source + gauge range/bands → apiConfig + uiConfig.charts
//   - Time tab   → full TimeConfig → timeConfig + uiConfig.time
//   - Style tab  → card + gauge styling → uiConfig.style
// Multi-chart: Add/remove charts, each with own _id linking apiConfig ↔ uiConfig
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Tabs,
  TabItem,
  Accordion,
  AccordionItem,
  TextInput,
  SelectInput,
  RadioGroup,
  Radio,
  Switch,
  Button,
  DropdownMenu,
  ActionListItem,
} from '@faclon-labs/design-sdk';
import {
  ConfigurationProps,
  WidgetConfigEnvelope,
  GaugeChartConfig,
  DataSourceConfig,
  TimeConfig,
  DurationOption,
  GaugeBand,
  SourceType,
  DEFAULT_ENVELOPE,
} from '../../iosense-sdk/types';
import { findUserDevices, getDeviceMetadata } from '../../iosense-sdk/api';
import './GaugeConfiguration.css';

const OPERATORS = [
  { label: 'Sum',              value: 'Sum'        },
  { label: 'Min',              value: 'Min'        },
  { label: 'Max',              value: 'Max'        },
  { label: 'Last Data Point',  value: 'LastDP'     },
  { label: 'First Data Point', value: 'FirstDP'    },
  { label: 'Consumption',      value: 'Consumption'},
  { label: 'Run Hours',        value: 'RunHours'   },
];

const PERIODICITIES = [
  { label: 'Minute',  value: 'minute'  },
  { label: 'Hourly',  value: 'hourly'  },
  { label: 'Daily',   value: 'daily'   },
  { label: 'Weekly',  value: 'weekly'  },
  { label: 'Monthly', value: 'monthly' },
];

const CYCLE_HOUR_OPTIONS   = Array.from({ length: 24  }, (_, i) => ({ label: `${i}h`,  value: String(i)  }));
const CYCLE_MINUTE_OPTIONS = Array.from({ length: 60  }, (_, i) => ({ label: `${i}m`,  value: String(i)  }));
const CYCLE_MONTH_OPTIONS  = Array.from({ length: 12  }, (_, i) => ({ label: `Month ${i + 1}`, value: String(i + 1) }));
const CYCLE_DAY_OPTIONS    = Array.from({ length: 31  }, (_, i) => ({ label: `Day ${i + 1}`,   value: String(i + 1) }));

/** Generate a short unique ID for chart _id */
const genId = () => `chart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const GaugeConfiguration: React.FC<ConfigurationProps> = ({
  config: configProp,
  authentication,
  onChange,
}) => {
  console.log('[GaugeConfig] render — props received', {
    config: configProp,
    authentication: authentication ? `${authentication.substring(0, 20)}...` : undefined,
    hasOnChange: !!onChange,
  });

  const [activeTab, setActiveTab]     = useState(0);
  const [activeChartIdx, setActiveChartIdx] = useState(0);
  const [envelope, setEnvelope]       = useState<WidgetConfigEnvelope>(configProp ?? DEFAULT_ENVELOPE);

  // ── Per-chart UI state (device search, sensors, dropdowns) ────────────
  // Keyed by chart index so each chart has independent state
  const [deviceSearches,   setDeviceSearches]   = useState<Record<number, string>>({});
  const [devices,          setDevices]           = useState<Record<number, any[]>>({});
  const [devicesLoading,   setDevicesLoading]    = useState<Record<number, boolean>>({});
  const [deviceDropdowns,  setDeviceDropdowns]   = useState<Record<number, boolean>>({});
  const [sensors,          setSensors]           = useState<Record<number, any[]>>({});
  const [sensorsLoading,   setSensorsLoading]    = useState<Record<number, boolean>>({});
  const [sensorDropdowns,  setSensorDropdowns]   = useState<Record<number, boolean>>({});
  const [operatorDropdowns,setOperatorDropdowns] = useState<Record<number, boolean>>({});

  // Time tab dropdown states
  const [periodicityOpen, setPeriodicityOpen] = useState(false);
  const [cycleHrOpen,    setCycleHrOpen]    = useState(false);
  const [cycleMinOpen,   setCycleMinOpen]   = useState(false);
  const [cycleDayOpen,   setCycleDayOpen]   = useState(false);
  const [cycleMonthOpen, setCycleMonthOpen] = useState(false);

  const debounceRefs = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Sync config prop to state
  useEffect(() => {
    console.log('[GaugeConfig] config prop synced to state', configProp);
    setEnvelope(configProp ?? DEFAULT_ENVELOPE);
  }, [configProp]);

  // Keep activeChartIdx in bounds
  useEffect(() => {
    const count = envelope.uiConfig.charts.length;
    if (activeChartIdx >= count && count > 0) setActiveChartIdx(count - 1);
  }, [envelope.uiConfig.charts.length]);

  // ── emitChange ────────────────────────────────────────────────────────
  const emitChange = useCallback(
    (updated: WidgetConfigEnvelope) => {
      console.group('[GaugeConfig] emitChange — envelope produced');
      console.log('timeConfig:', JSON.parse(JSON.stringify(updated.timeConfig)));
      console.log('apiConfig:', JSON.parse(JSON.stringify(updated.apiConfig)));
      console.log('uiConfig:', JSON.parse(JSON.stringify(updated.uiConfig)));
      console.log('_id match check:', {
        'apiConfig._ids': updated.apiConfig.dataConfig.map(d => d._id),
        'uiConfig._ids':  updated.uiConfig.charts.map(c => c._id),
        match: updated.apiConfig.dataConfig.every((d, i) => d._id === updated.uiConfig.charts[i]?._id),
      });
      console.groupEnd();
      setEnvelope(updated);
      onChange(updated);
    },
    [onChange]
  );

  // ── Accessors ──────────────────────────────────────────────────────────
  const uiConfig   = envelope.uiConfig;
  const apiConfig  = envelope.apiConfig;
  const timeConfig = envelope.timeConfig;
  const style      = uiConfig.style;

  const activeChart      = uiConfig.charts[activeChartIdx];
  const activeDataSource = apiConfig.dataConfig[activeChartIdx];

  // ── Multi-chart management ────────────────────────────────────────────
  const addChart = () => {
    const newId = genId();
    const newUiChart: GaugeChartConfig = {
      _id:          newId,
      chartType:    'gauge',
      title:        `Gauge ${uiConfig.charts.length + 1}`,
      min:          0,
      max:          100,
      unit:         '',
      dataPrecision: 2,
      bands: [
        { from: 0,  to: 33,  color: '#55BF3B' },
        { from: 33, to: 66,  color: '#DDDF0D' },
        { from: 66, to: 100, color: '#DF5353' },
      ],
    };
    const newApiDataSource: DataSourceConfig = {
      _id:          newId,
      label:        `Gauge ${uiConfig.charts.length + 1}`,
      body: {
        type:        'device',
        operator:    'LastDP',
        startTime:   '{{startTime}}',
        endTime:     '{{endTime}}',
        periodicity: '{{periodicity}}',
      },
      responsePath: 'data.data',
    };
    const updated: WidgetConfigEnvelope = {
      ...envelope,
      uiConfig:  { ...uiConfig,  charts:     [...uiConfig.charts,     newUiChart]      },
      apiConfig: { ...apiConfig, dataConfig: [...apiConfig.dataConfig, newApiDataSource] },
    };
    emitChange(updated);
    setActiveChartIdx(uiConfig.charts.length); // switch to new chart
    console.log('[GaugeConfig] chart added', newId);
  };

  const removeChart = (idx: number) => {
    if (uiConfig.charts.length <= 1) {
      // Remove the last chart — resets to empty state
      emitChange({
        ...envelope,
        uiConfig:  { ...uiConfig,  charts:     [] },
        apiConfig: { ...apiConfig, dataConfig: [] },
      });
      setActiveChartIdx(0);
      return;
    }
    const newCharts     = uiConfig.charts.filter((_, i) => i !== idx);
    const newDataConfig = apiConfig.dataConfig.filter((_, i) => i !== idx);
    emitChange({
      ...envelope,
      uiConfig:  { ...uiConfig,  charts:     newCharts     },
      apiConfig: { ...apiConfig, dataConfig: newDataConfig },
    });
    setActiveChartIdx(Math.min(idx, newCharts.length - 1));
    console.log('[GaugeConfig] chart removed at index', idx);
  };

  // ── Per-chart updaters ────────────────────────────────────────────────
  const updateActiveChart = (updates: Partial<GaugeChartConfig>) => {
    const newCharts = [...uiConfig.charts];
    newCharts[activeChartIdx] = { ...newCharts[activeChartIdx], ...updates };
    emitChange({ ...envelope, uiConfig: { ...uiConfig, charts: newCharts } });
  };

  const updateActiveDataBody = (updates: Record<string, any>) => {
    const newDataConfig = [...apiConfig.dataConfig];
    newDataConfig[activeChartIdx] = {
      ...newDataConfig[activeChartIdx],
      body: { ...newDataConfig[activeChartIdx].body, ...updates },
    };
    emitChange({ ...envelope, apiConfig: { ...apiConfig, dataConfig: newDataConfig } });
  };

  const updateActiveDataSource = (updates: Partial<DataSourceConfig>) => {
    const newDataConfig = [...apiConfig.dataConfig];
    newDataConfig[activeChartIdx] = { ...newDataConfig[activeChartIdx], ...updates };
    emitChange({ ...envelope, apiConfig: { ...apiConfig, dataConfig: newDataConfig } });
  };

  const updateStyle = (section: 'card' | 'gauge', updates: Record<string, any>) => {
    emitChange({
      ...envelope,
      uiConfig: {
        ...uiConfig,
        style: { ...style, [section]: { ...style[section], ...updates } },
      },
    });
  };

  // Update timeConfig — mirrors relevant fields into uiConfig.time for widget
  const updateTime = (updates: Partial<TimeConfig>) => {
    const tc = { ...timeConfig, ...updates };
    const fixedStart = tc.type === 'fixed' ? (tc.startTime ?? null) : undefined;
    const fixedEnd   = tc.type === 'fixed' ? (tc.endTime   ?? null) : undefined;
    emitChange({
      ...envelope,
      timeConfig: tc,
      uiConfig: {
        ...uiConfig,
        time: {
          type:                 tc.type === 'fixed' ? 'fixed' : 'local',
          defaultPeriodicity:   tc.defaultPeriodicity,
          allDurations:         tc.allDurations,
          defaultDurationLabel: tc.allDurations.find((d: DurationOption) => d.id === tc.defaultDuration)?.name ?? tc.defaultDuration,
          ...(fixedStart !== undefined && { fixedStartTime: fixedStart }),
          ...(fixedEnd   !== undefined && { fixedEndTime:   fixedEnd   }),
        },
      },
    });
  };

  // Band helpers for active chart
  const updateBand = (bandIdx: number, updates: Partial<GaugeBand>) => {
    const bands = [...(activeChart?.bands ?? [])];
    bands[bandIdx] = { ...bands[bandIdx], ...updates };
    updateActiveChart({ bands });
  };

  const addBand = () => {
    const bands = activeChart?.bands ?? [];
    const lastTo = bands.length > 0 ? bands[bands.length - 1].to : 0;
    updateActiveChart({ bands: [...bands, { from: lastTo, to: activeChart?.max ?? 100, color: '#999999' }] });
  };

  const removeBand = (bandIdx: number) => {
    updateActiveChart({ bands: (activeChart?.bands ?? []).filter((_, i) => i !== bandIdx) });
  };

  // Duration helpers
  const addDuration = () => {
    const newDuration: DurationOption = {
      id:          `dur-${Date.now()}`,
      name:        'New Duration',
      hideToggle:  false,
      duration:    { value: '1h', viewValue: 'Last 1 Hour' },
      xPeriod:     '',
      xEvent:      '',
      yPeriod:     '',
      yEvent:      '',
      event:       '',
      periodicities: ['hourly'],
      x:           1,
      y:           1,
    };
    updateTime({ allDurations: [...timeConfig.allDurations, newDuration] });
  };

  const removeDuration = (dIdx: number) => {
    updateTime({ allDurations: timeConfig.allDurations.filter((_, i) => i !== dIdx) });
  };

  const updateDuration = (dIdx: number, updates: Partial<DurationOption>) => {
    const durations = [...timeConfig.allDurations];
    durations[dIdx] = { ...durations[dIdx], ...updates };
    updateTime({ allDurations: durations });
  };

  // ── Device search with debounce (per chart index) ────────────────────
  const handleDeviceSearch = (idx: number, value: string) => {
    setDeviceSearches(prev => ({ ...prev, [idx]: value }));
    setDeviceDropdowns(prev => ({ ...prev, [idx]: true }));
    if (debounceRefs.current[idx]) clearTimeout(debounceRefs.current[idx]);
    if (!value || value.length < 2) {
      setDevices(prev => ({ ...prev, [idx]: [] }));
      return;
    }
    debounceRefs.current[idx] = setTimeout(async () => {
      setDevicesLoading(prev => ({ ...prev, [idx]: true }));
      const results = await findUserDevices(authentication, value);
      setDevices(prev => ({ ...prev, [idx]: results }));
      setDevicesLoading(prev => ({ ...prev, [idx]: false }));
    }, 300);
  };

  // Load sensors when device selected (for active chart)
  const activeDevId = activeDataSource?.body?.devID;
  useEffect(() => {
    if (!activeDevId || !authentication) {
      setSensors(prev => ({ ...prev, [activeChartIdx]: [] }));
      return;
    }
    setSensorsLoading(prev => ({ ...prev, [activeChartIdx]: true }));
    getDeviceMetadata(authentication, activeDevId).then(result => {
      setSensors(prev => ({ ...prev, [activeChartIdx]: result }));
      setSensorsLoading(prev => ({ ...prev, [activeChartIdx]: false }));
    });
  }, [activeDevId, authentication, activeChartIdx]);

  const sourceType: SourceType = activeDataSource?.body?.type ?? 'device';

  // ── TAB 1: DATA ────────────────────────────────────────────────────────
  const renderDataTab = () => {
    if (uiConfig.charts.length === 0) {
      return (
        <div className="gauge-config__tab-content">
          <div className="gauge-config__no-charts">
            <span className="BodyMediumRegular">No charts yet.</span>
            <Button label="Add Chart" variant="Primary" size="Medium" onClick={addChart} />
          </div>
        </div>
      );
    }

    return (
      <div className="gauge-config__tab-content">
        {/* Chart tabs + add button */}
        <div className="gauge-config__chart-nav">
          <div className="gauge-config__chart-tabs">
            {uiConfig.charts.map((c, idx) => (
              <button
                key={c._id}
                className={`gauge-config__chart-tab ${activeChartIdx === idx ? 'gauge-config__chart-tab--active' : ''}`}
                onClick={() => setActiveChartIdx(idx)}
              >
                {c.title ?? `Chart ${idx + 1}`}
              </button>
            ))}
          </div>
          <div className="gauge-config__chart-actions">
            <Button label="+ Add" variant="Secondary" size="Small" onClick={addChart} />
            {uiConfig.charts.length > 0 && (
              <Button
                label="Remove"
                variant="Tertiary"
                size="Small"
                color="Negative"
                onClick={() => removeChart(activeChartIdx)}
              />
            )}
          </div>
        </div>

        {activeChart && activeDataSource && (
          <Accordion mode="multiple" defaultExpandedKeys={['data-source', 'gauge-range']}>
            {/* Data Source — builds apiConfig.dataConfig[activeChartIdx] */}
            <AccordionItem value="data-source" title="Data Source">
              <div className="gauge-config__accordion-body">
                <TextInput
                  label="Title"
                  value={activeChart.title ?? ''}
                  onChange={({ value }) => {
                    updateActiveChart({ title: value });
                    updateActiveDataSource({ label: value || 'Gauge Value' });
                  }}
                  placeholder="Gauge title"
                />

                <RadioGroup
                  name="sourceType"
                  value={sourceType}
                  onChange={(val) => updateActiveDataBody({ type: val as SourceType })}
                  label="Source Type"
                  orientation="Horizontal"
                >
                  <Radio label="Device"     value="device"           />
                  <Radio label="Cluster"    value="cluster"          />
                  <Radio label="Compute"    value="compute"          />
                  <Radio label="Expression" value="customExpression" />
                </RadioGroup>

                {sourceType === 'device' && (
                  <>
                    <TextInput
                      label="Search Device"
                      value={deviceSearches[activeChartIdx] ?? ''}
                      onChange={({ value }) => handleDeviceSearch(activeChartIdx, value)}
                      placeholder="Type to search devices..."
                      isLoading={devicesLoading[activeChartIdx] ?? false}
                    />
                    {(deviceDropdowns[activeChartIdx] ?? false) && (devices[activeChartIdx] ?? []).length > 0 && (
                      <DropdownMenu>
                        {(devices[activeChartIdx] ?? []).map((dev: any) => (
                          <ActionListItem
                            key={dev._id}
                            id={dev._id}
                            title={dev.d ?? dev._id}
                            onClick={() => {
                              updateActiveDataBody({ devID: dev._id, devTypeID: dev.dvT?.dvTN ?? '' });
                              setDeviceSearches(prev => ({ ...prev, [activeChartIdx]: dev.d ?? dev._id }));
                              setDeviceDropdowns(prev => ({ ...prev, [activeChartIdx]: false }));
                            }}
                          />
                        ))}
                      </DropdownMenu>
                    )}

                    <SelectInput
                      label="Sensor"
                      value={
                        (sensors[activeChartIdx] ?? []).find((s: any) => s.sensorId === activeDataSource.body?.sensor)?.sensorName
                        ?? activeDataSource.body?.sensor ?? ''
                      }
                      placeholder={(sensorsLoading[activeChartIdx] ?? false) ? 'Loading...' : 'Select sensor'}
                      isDisabled={!activeDataSource.body?.devID || (sensorsLoading[activeChartIdx] ?? false)}
                      isOpen={sensorDropdowns[activeChartIdx] ?? false}
                      onClick={() => setSensorDropdowns(prev => ({ ...prev, [activeChartIdx]: !(prev[activeChartIdx] ?? false) }))}
                    >
                      <DropdownMenu>
                        {(sensors[activeChartIdx] ?? []).map((s: any) => (
                          <ActionListItem
                            key={s.sensorId}
                            id={s.sensorId}
                            title={s.sensorName ?? s.sensorId}
                            onClick={() => {
                              updateActiveDataBody({ sensor: s.sensorId });
                              setSensorDropdowns(prev => ({ ...prev, [activeChartIdx]: false }));
                            }}
                          />
                        ))}
                      </DropdownMenu>
                    </SelectInput>

                    <SelectInput
                      label="Operator"
                      value={OPERATORS.find(o => o.value === activeDataSource.body?.operator)?.label ?? activeDataSource.body?.operator ?? ''}
                      isOpen={operatorDropdowns[activeChartIdx] ?? false}
                      onClick={() => setOperatorDropdowns(prev => ({ ...prev, [activeChartIdx]: !(prev[activeChartIdx] ?? false) }))}
                    >
                      <DropdownMenu>
                        {OPERATORS.map(op => (
                          <ActionListItem
                            key={op.value}
                            id={op.value}
                            title={op.label}
                            onClick={() => {
                              updateActiveDataBody({ operator: op.value });
                              setOperatorDropdowns(prev => ({ ...prev, [activeChartIdx]: false }));
                            }}
                          />
                        ))}
                      </DropdownMenu>
                    </SelectInput>
                  </>
                )}

                {sourceType === 'cluster' && (
                  <>
                    <TextInput
                      label="Cluster ID"
                      value={activeDataSource.body?.clusterID ?? ''}
                      onChange={({ value }) => updateActiveDataBody({ clusterID: value })}
                      placeholder="Enter cluster ID"
                    />
                    <SelectInput
                      label="Operator"
                      value={OPERATORS.find(o => o.value === activeDataSource.body?.operator)?.label ?? ''}
                      isOpen={operatorDropdowns[activeChartIdx] ?? false}
                      onClick={() => setOperatorDropdowns(prev => ({ ...prev, [activeChartIdx]: !(prev[activeChartIdx] ?? false) }))}
                    >
                      <DropdownMenu>
                        {OPERATORS.map(op => (
                          <ActionListItem
                            key={op.value}
                            id={op.value}
                            title={op.label}
                            onClick={() => {
                              updateActiveDataBody({ operator: op.value });
                              setOperatorDropdowns(prev => ({ ...prev, [activeChartIdx]: false }));
                            }}
                          />
                        ))}
                      </DropdownMenu>
                    </SelectInput>
                  </>
                )}

                {sourceType === 'compute' && (
                  <>
                    <TextInput
                      label="Flow ID"
                      value={activeDataSource.body?.flowID ?? ''}
                      onChange={({ value }) => updateActiveDataBody({ flowID: value })}
                      placeholder="Enter flow ID"
                    />
                    <TextInput
                      label="Flow Parameters"
                      value={activeDataSource.body?.flowParams ?? ''}
                      onChange={({ value }) => updateActiveDataBody({ flowParams: value })}
                      placeholder="Enter flow parameters"
                    />
                  </>
                )}

                {sourceType === 'customExpression' && (
                  <TextInput
                    label="Bindings"
                    value={activeDataSource.body?.bindings ?? ''}
                    onChange={({ value }) => updateActiveDataBody({ bindings: value })}
                    placeholder="Enter expression bindings"
                  />
                )}

                <TextInput
                  label="Unit"
                  value={activeChart.unit ?? ''}
                  onChange={({ value }) => updateActiveChart({ unit: value })}
                  placeholder="e.g. °C, kWh, %"
                />
                <TextInput
                  label="Data Precision"
                  type="number"
                  value={String(activeChart.dataPrecision ?? 2)}
                  onChange={({ value }) => updateActiveChart({ dataPrecision: parseInt(value) || 0 })}
                />
              </div>
            </AccordionItem>

            {/* Gauge Range & Bands */}
            <AccordionItem value="gauge-range" title="Gauge Range & Bands">
              <div className="gauge-config__accordion-body">
                <div className="gauge-config__row">
                  <TextInput
                    label="Min"
                    type="number"
                    value={String(activeChart.min)}
                    onChange={({ value }) => updateActiveChart({ min: parseFloat(value) || 0 })}
                  />
                  <TextInput
                    label="Max"
                    type="number"
                    value={String(activeChart.max)}
                    onChange={({ value }) => updateActiveChart({ max: parseFloat(value) || 100 })}
                  />
                </div>

                <div className="gauge-config__bands-header">
                  <span className="BodyMediumSemibold">Color Bands</span>
                  <Button label="Add Band" variant="Secondary" size="Small" onClick={addBand} />
                </div>

                {(activeChart.bands ?? []).map((band, bIdx) => (
                  <div key={`band-${bIdx}`} className="gauge-config__band">
                    <div className="gauge-config__row">
                      <TextInput
                        label="From"
                        type="number"
                        value={String(band.from)}
                        onChange={({ value }) => updateBand(bIdx, { from: parseFloat(value) || 0 })}
                      />
                      <TextInput
                        label="To"
                        type="number"
                        value={String(band.to)}
                        onChange={({ value }) => updateBand(bIdx, { to: parseFloat(value) || 0 })}
                      />
                    </div>
                    <div className="gauge-config__row">
                      <TextInput
                        label="Color"
                        value={band.color}
                        onChange={({ value }) => updateBand(bIdx, { color: value })}
                        suffix={' '}
                      />
                      <div className="gauge-config__color-swatch" style={{ background: band.color }} />
                      <Button
                        label="Remove"
                        variant="Tertiary"
                        size="Small"
                        color="Negative"
                        onClick={() => removeBand(bIdx)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    );
  };

  // ── TAB 2: TIME — full TimeConfig ──────────────────────────────────────
  const renderTimeTab = () => (
    <div className="gauge-config__tab-content">
      <Accordion mode="multiple" defaultExpandedKeys={['time-basic', 'time-cycle']}>

        {/* Basic time settings */}
        <AccordionItem value="time-basic" title="Time Settings">
          <div className="gauge-config__accordion-body">
            <TextInput
              label="Timezone"
              value={timeConfig.timezone}
              onChange={({ value }) => updateTime({ timezone: value })}
              placeholder="e.g. Asia/Kolkata"
            />

            <RadioGroup
              name="timeType"
              value={timeConfig.type}
              onChange={(val) => updateTime({ type: val as 'local' | 'fixed' })}
              label="Time Type"
              orientation="Horizontal"
            >
              <Radio label="Local"  value="local"  />
              <Radio label="Fixed"  value="fixed"  />
            </RadioGroup>

            {timeConfig.type === 'fixed' && (
              <>
                <TextInput
                  label="Fixed Start Time (ISO)"
                  value={timeConfig.startTime ?? ''}
                  onChange={({ value }) => updateTime({ startTime: value || null })}
                  placeholder="e.g. 2024-01-01T00:00:00.000Z"
                />
                <TextInput
                  label="Fixed End Time (ISO)"
                  value={timeConfig.endTime ?? ''}
                  onChange={({ value }) => updateTime({ endTime: value || null })}
                  placeholder="e.g. 2024-01-02T00:00:00.000Z"
                />
              </>
            )}

            <SelectInput
              label="Default Periodicity"
              value={PERIODICITIES.find(p => p.value === timeConfig.defaultPeriodicity)?.label ?? ''}
              isOpen={periodicityOpen}
              onClick={() => setPeriodicityOpen(!periodicityOpen)}
            >
              <DropdownMenu>
                {PERIODICITIES.map(p => (
                  <ActionListItem
                    key={p.value}
                    id={p.value}
                    title={p.label}
                    onClick={() => {
                      updateTime({ defaultPeriodicity: p.value as any });
                      setPeriodicityOpen(false);
                    }}
                  />
                ))}
              </DropdownMenu>
            </SelectInput>
          </div>
        </AccordionItem>

        {/* Cycle Time */}
        <AccordionItem value="time-cycle" title="Cycle Time">
          <div className="gauge-config__accordion-body">
            <div className="gauge-config__row">
              <SelectInput
                label="Cycle Hours"
                value={timeConfig.cycleTimeHr !== undefined ? `${timeConfig.cycleTimeHr}h` : '0h'}
                isOpen={cycleHrOpen}
                onClick={() => setCycleHrOpen(!cycleHrOpen)}
              >
                <DropdownMenu>
                  {CYCLE_HOUR_OPTIONS.map(o => (
                    <ActionListItem
                      key={o.value}
                      id={o.value}
                      title={o.label}
                      onClick={() => {
                        updateTime({ cycleTimeHr: parseInt(o.value) });
                        setCycleHrOpen(false);
                      }}
                    />
                  ))}
                </DropdownMenu>
              </SelectInput>

              <SelectInput
                label="Cycle Minutes"
                value={timeConfig.cycleTimeMin !== undefined ? `${timeConfig.cycleTimeMin}m` : '0m'}
                isOpen={cycleMinOpen}
                onClick={() => setCycleMinOpen(!cycleMinOpen)}
              >
                <DropdownMenu>
                  {CYCLE_MINUTE_OPTIONS.map(o => (
                    <ActionListItem
                      key={o.value}
                      id={o.value}
                      title={o.label}
                      onClick={() => {
                        updateTime({ cycleTimeMin: parseInt(o.value) });
                        setCycleMinOpen(false);
                      }}
                    />
                  ))}
                </DropdownMenu>
              </SelectInput>
            </div>

            <div className="gauge-config__row">
              <TextInput
                label="Cycle Year"
                type="number"
                value={String(timeConfig.cycleYear ?? new Date().getFullYear())}
                onChange={({ value }) => updateTime({ cycleYear: parseInt(value) || new Date().getFullYear() })}
              />

              <SelectInput
                label="Selected Month"
                value={timeConfig.selectedMonth !== undefined ? `Month ${timeConfig.selectedMonth}` : 'Any'}
                isOpen={cycleMonthOpen}
                onClick={() => setCycleMonthOpen(!cycleMonthOpen)}
              >
                <DropdownMenu>
                  {CYCLE_MONTH_OPTIONS.map(o => (
                    <ActionListItem
                      key={o.value}
                      id={o.value}
                      title={o.label}
                      onClick={() => {
                        updateTime({ selectedMonth: parseInt(o.value) });
                        setCycleMonthOpen(false);
                      }}
                    />
                  ))}
                </DropdownMenu>
              </SelectInput>
            </div>

            <div className="gauge-config__row">
              <SelectInput
                label="Selected Day"
                value={timeConfig.selectedDay !== undefined ? `Day ${timeConfig.selectedDay}` : 'Any'}
                isOpen={cycleDayOpen}
                onClick={() => setCycleDayOpen(!cycleDayOpen)}
              >
                <DropdownMenu>
                  {CYCLE_DAY_OPTIONS.map(o => (
                    <ActionListItem
                      key={o.value}
                      id={o.value}
                      title={o.label}
                      onClick={() => {
                        updateTime({ selectedDay: parseInt(o.value) });
                        setCycleDayOpen(false);
                      }}
                    />
                  ))}
                </DropdownMenu>
              </SelectInput>

              <TextInput
                label="Selected Date"
                type="number"
                value={String(timeConfig.selectedDate ?? '')}
                onChange={({ value }) => updateTime({ selectedDate: parseInt(value) || undefined })}
                placeholder="Day of month"
              />
            </div>
          </div>
        </AccordionItem>

        {/* Durations */}
        <AccordionItem value="time-durations" title="Duration Presets">
          <div className="gauge-config__accordion-body">
            <div className="gauge-config__bands-header">
              <span className="BodyMediumSemibold">Durations ({timeConfig.allDurations.length})</span>
              <Button label="Add Duration" variant="Secondary" size="Small" onClick={addDuration} />
            </div>

            {timeConfig.allDurations.length === 0 && (
              <span className="BodySmallRegular gauge-config__hint">
                No duration presets. Add one to let users pick time ranges.
              </span>
            )}

            {timeConfig.allDurations.map((dur, dIdx) => (
              <div key={dur.id} className="gauge-config__duration-item">
                <div className="gauge-config__row">
                  <TextInput
                    label="Name"
                    value={dur.name}
                    onChange={({ value }) => updateDuration(dIdx, { name: value })}
                    placeholder="e.g. Last 1 Hour"
                  />
                  <TextInput
                    label="Value"
                    value={dur.duration?.value ?? ''}
                    onChange={({ value }) => updateDuration(dIdx, { duration: { ...dur.duration, value } })}
                    placeholder="e.g. 1h"
                  />
                </div>
                <div className="gauge-config__row">
                  <Switch
                    label="Hide Toggle"
                    name={`hideToggle-${dIdx}`}
                    isChecked={dur.hideToggle}
                    onChange={({ checked }) => updateDuration(dIdx, { hideToggle: checked })}
                  />
                  <Button
                    label="Remove"
                    variant="Tertiary"
                    size="Small"
                    color="Negative"
                    onClick={() => removeDuration(dIdx)}
                  />
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // ── TAB 3: STYLE ───────────────────────────────────────────────────────
  const renderStyleTab = () => (
    <div className="gauge-config__tab-content">
      <Accordion mode="multiple" defaultExpandedKeys={['card-style', 'gauge-style']}>
        <AccordionItem value="card-style" title="Card Styling">
          <div className="gauge-config__accordion-body">
            <Switch
              label="Wrap in Card"
              name="wrapInCard"
              isChecked={style.card.wrapInCard}
              onChange={({ checked }) => updateStyle('card', { wrapInCard: checked })}
            />
            <div className="gauge-config__row">
              <TextInput
                label="Background"
                value={style.card.background}
                onChange={({ value }) => updateStyle('card', { background: value })}
              />
              <div className="gauge-config__color-swatch" style={{ background: style.card.background }} />
            </div>
            <div className="gauge-config__row">
              <TextInput
                label="Border Color"
                value={style.card.borderColor}
                onChange={({ value }) => updateStyle('card', { borderColor: value })}
              />
              <div className="gauge-config__color-swatch" style={{ background: style.card.borderColor }} />
            </div>
            <TextInput
              label="Border Width"
              type="number"
              value={String(style.card.borderWidth)}
              onChange={({ value }) => updateStyle('card', { borderWidth: parseInt(value) || 0 })}
            />
            <TextInput
              label="Border Radius"
              type="number"
              value={String(style.card.borderRadius)}
              onChange={({ value }) => updateStyle('card', { borderRadius: parseInt(value) || 0 })}
            />
            <TextInput
              label="Padding"
              type="number"
              value={String(style.card.padding)}
              onChange={({ value }) => updateStyle('card', { padding: parseInt(value) || 0 })}
            />
          </div>
        </AccordionItem>

        <AccordionItem value="gauge-style" title="Gauge Styling">
          <div className="gauge-config__accordion-body">
            <TextInput
              label="Font Size"
              value={style.gauge.fontSize}
              onChange={({ value }) => updateStyle('gauge', { fontSize: value })}
              placeholder="e.g. 14px"
            />
            <div className="gauge-config__row">
              <TextInput
                label="Font Color"
                value={style.gauge.fontColor}
                onChange={({ value }) => updateStyle('gauge', { fontColor: value })}
              />
              <div className="gauge-config__color-swatch" style={{ background: style.gauge.fontColor }} />
            </div>
            <SelectInput
              label="Font Weight"
              value={style.gauge.fontWeight}
              onClick={() => {}}
            >
              <DropdownMenu>
                {['400', '500', '600', '700'].map(w => (
                  <ActionListItem
                    key={w}
                    id={w}
                    title={w}
                    onClick={() => updateStyle('gauge', { fontWeight: w })}
                  />
                ))}
              </DropdownMenu>
            </SelectInput>
            <div className="gauge-config__row">
              <TextInput
                label="Dial Color"
                value={style.gauge.dialColor}
                onChange={({ value }) => updateStyle('gauge', { dialColor: value })}
              />
              <div className="gauge-config__color-swatch" style={{ background: style.gauge.dialColor }} />
            </div>
            <div className="gauge-config__row">
              <TextInput
                label="Pivot Color"
                value={style.gauge.pivotColor}
                onChange={({ value }) => updateStyle('gauge', { pivotColor: value })}
              />
              <div className="gauge-config__color-swatch" style={{ background: style.gauge.pivotColor }} />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="gauge-config">
      <Tabs variant="Bordered" isFullWidth>
        <TabItem label="Data"  isSelected={activeTab === 0} onClick={() => setActiveTab(0)} />
        <TabItem label="Time"  isSelected={activeTab === 1} onClick={() => setActiveTab(1)} />
        <TabItem label="Style" isSelected={activeTab === 2} onClick={() => setActiveTab(2)} />
      </Tabs>

      {activeTab === 0 && renderDataTab()}
      {activeTab === 1 && renderTimeTab()}
      {activeTab === 2 && renderStyleTab()}
    </div>
  );
};

export default GaugeConfiguration;
