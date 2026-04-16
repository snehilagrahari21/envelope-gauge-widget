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
  Spinner,
} from '@faclon-labs/design-sdk';
import {
  ConfigurationProps,
  GaugeWidgetConfig,
  GaugeBand,
  SourceType,
  DEFAULT_GAUGE_CONFIG,
} from '../../iosense-sdk/types';
import { findUserDevices, getDeviceMetadata } from '../../iosense-sdk/api';
import './GaugeConfiguration.css';

const OPERATORS = [
  { label: 'Sum', value: 'Sum' },
  { label: 'Min', value: 'Min' },
  { label: 'Max', value: 'Max' },
  { label: 'Last Data Point', value: 'LastDP' },
  { label: 'First Data Point', value: 'FirstDP' },
  { label: 'Consumption', value: 'Consumption' },
  { label: 'Run Hours', value: 'RunHours' },
];

const PERIODICITIES = [
  { label: 'Minute', value: 'minute' },
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

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

  const [activeTab, setActiveTab] = useState(0);
  const [config, setConfig] = useState<GaugeWidgetConfig>(configProp ?? DEFAULT_GAUGE_CONFIG);

  // Device search state
  const [deviceSearch, setDeviceSearch] = useState('');
  const [devices, setDevices] = useState<any[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);

  // Sensor state
  const [sensors, setSensors] = useState<any[]>([]);
  const [sensorsLoading, setSensorsLoading] = useState(false);
  const [sensorDropdownOpen, setSensorDropdownOpen] = useState(false);

  // Operator dropdown
  const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false);

  // Periodicity dropdown
  const [periodicityDropdownOpen, setPeriodicityDropdownOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync config prop to state
  useEffect(() => {
    console.log('[GaugeConfig] config prop synced to state', configProp);
    setConfig(configProp ?? DEFAULT_GAUGE_CONFIG);
  }, [configProp]);

  // Emit onChange
  const emitChange = useCallback(
    (updated: GaugeWidgetConfig) => {
      console.log('[GaugeConfig] emitChange — onChange fired', updated);
      setConfig(updated);
      onChange(updated);
    },
    [onChange]
  );

  // Device search with debounce
  useEffect(() => {
    if (!deviceSearch || deviceSearch.length < 2) {
      setDevices([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      console.log('[GaugeConfig] device search — querying', deviceSearch);
      setDevicesLoading(true);
      const results = await findUserDevices(authentication, deviceSearch);
      console.log('[GaugeConfig] device search — results', results);
      setDevices(results);
      setDevicesLoading(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [deviceSearch, authentication]);

  // Load sensors when device selected
  useEffect(() => {
    const devID = config.charts[0]?.dataConfig?.devID;
    if (!devID || !authentication) {
      setSensors([]);
      return;
    }
    const loadSensors = async () => {
      console.log('[GaugeConfig] loading sensors for devID', devID);
      setSensorsLoading(true);
      const result = await getDeviceMetadata(authentication, devID);
      console.log('[GaugeConfig] sensors loaded', result);
      setSensors(result);
      setSensorsLoading(false);
    };
    loadSensors();
  }, [config.charts[0]?.dataConfig?.devID, authentication]);

  const chart = config.charts[0] ?? DEFAULT_GAUGE_CONFIG.charts[0];
  const dc = chart.dataConfig;
  const style = config.style;

  const updateChart = (updates: Record<string, any>) => {
    const updated = {
      ...config,
      charts: [{ ...chart, ...updates }],
    };
    emitChange(updated);
  };

  const updateDataConfig = (updates: Record<string, any>) => {
    updateChart({ dataConfig: { ...dc, ...updates } });
  };

  const updateStyle = (section: 'card' | 'gauge', updates: Record<string, any>) => {
    emitChange({
      ...config,
      style: {
        ...style,
        [section]: { ...style[section], ...updates },
      },
    });
  };

  const updateBand = (index: number, updates: Partial<GaugeBand>) => {
    const bands = [...chart.bands];
    bands[index] = { ...bands[index], ...updates };
    updateChart({ bands });
  };

  const addBand = () => {
    const lastTo = chart.bands.length > 0 ? chart.bands[chart.bands.length - 1].to : 0;
    updateChart({
      bands: [...chart.bands, { from: lastTo, to: chart.max, color: '#999999' }],
    });
  };

  const removeBand = (index: number) => {
    updateChart({ bands: chart.bands.filter((_, i) => i !== index) });
  };

  // === DATA TAB ===
  const renderDataTab = () => (
    <div className="gauge-config__tab-content">
      <Accordion mode="multiple" defaultExpandedKeys={['data-source', 'gauge-range']}>
        {/* Data Source */}
        <AccordionItem value="data-source" title="Data Source">
          <div className="gauge-config__accordion-body">
            <TextInput
              label="Title"
              value={chart.title ?? ''}
              onChange={({ value }) => updateChart({ title: value })}
              placeholder="Gauge title"
            />

            <RadioGroup
              name="sourceType"
              value={dc.type}
              onChange={(val) => updateDataConfig({ type: val as SourceType })}
              label="Source Type"
              orientation="Horizontal"
            >
              <Radio label="Device" value="device" />
              <Radio label="Cluster" value="cluster" />
              <Radio label="Compute" value="compute" />
              <Radio label="Expression" value="customExpression" />
            </RadioGroup>

            {dc.type === 'device' && (
              <>
                <TextInput
                  label="Search Device"
                  value={deviceSearch}
                  onChange={({ value }) => {
                    setDeviceSearch(value);
                    setDeviceDropdownOpen(true);
                  }}
                  placeholder="Type to search devices..."
                  isLoading={devicesLoading}
                />
                {deviceDropdownOpen && devices.length > 0 && (
                  <DropdownMenu>
                    {devices.map((dev: any) => (
                      <ActionListItem
                        id={dev._id}
                        title={dev.d ?? dev._id}
                        onClick={() => {
                          updateDataConfig({
                            devID: dev._id,
                            devTypeID: dev.dvT?.dvTN ?? '',
                          });
                          setDeviceSearch(dev.d ?? dev._id);
                          setDeviceDropdownOpen(false);
                        }}
                      />
                    ))}
                  </DropdownMenu>
                )}

                <SelectInput
                  label="Sensor"
                  value={
                    sensors.find((s: any) => s.sensorId === dc.sensor)?.sensorName
                    ?? dc.sensor
                    ?? ''
                  }
                  placeholder={sensorsLoading ? 'Loading...' : 'Select sensor'}
                  isDisabled={!dc.devID || sensorsLoading}
                  isOpen={sensorDropdownOpen}
                  onClick={() => setSensorDropdownOpen(!sensorDropdownOpen)}
                >
                  <DropdownMenu>
                    {sensors.map((s: any) => (
                      <ActionListItem
                        id={s.sensorId}
                        title={s.sensorName ?? s.sensorId}
                        onClick={() => {
                          updateDataConfig({ sensor: s.sensorId });
                          setSensorDropdownOpen(false);
                        }}
                      />
                    ))}
                  </DropdownMenu>
                </SelectInput>

                <SelectInput
                  label="Operator"
                  value={OPERATORS.find((o) => o.value === dc.operator)?.label ?? dc.operator ?? ''}
                  isOpen={operatorDropdownOpen}
                  onClick={() => setOperatorDropdownOpen(!operatorDropdownOpen)}
                >
                  <DropdownMenu>
                    {OPERATORS.map((op) => (
                      <ActionListItem
                        id={op.value}
                        title={op.label}
                        onClick={() => {
                          updateDataConfig({ operator: op.value });
                          setOperatorDropdownOpen(false);
                        }}
                      />
                    ))}
                  </DropdownMenu>
                </SelectInput>
              </>
            )}

            {dc.type === 'cluster' && (
              <>
                <TextInput
                  label="Cluster ID"
                  value={dc.clusterID ?? ''}
                  onChange={({ value }) => updateDataConfig({ clusterID: value })}
                  placeholder="Enter cluster ID"
                />
                <SelectInput
                  label="Operator"
                  value={OPERATORS.find((o) => o.value === dc.operator)?.label ?? ''}
                  isOpen={operatorDropdownOpen}
                  onClick={() => setOperatorDropdownOpen(!operatorDropdownOpen)}
                >
                  <DropdownMenu>
                    {OPERATORS.map((op) => (
                      <ActionListItem
                        id={op.value}
                        title={op.label}
                        onClick={() => {
                          updateDataConfig({ operator: op.value });
                          setOperatorDropdownOpen(false);
                        }}
                      />
                    ))}
                  </DropdownMenu>
                </SelectInput>
              </>
            )}

            {dc.type === 'compute' && (
              <>
                <TextInput
                  label="Flow ID"
                  value={dc.flowID ?? ''}
                  onChange={({ value }) => updateDataConfig({ flowID: value })}
                  placeholder="Enter flow ID"
                />
                <TextInput
                  label="Flow Parameters"
                  value={dc.flowParams ?? ''}
                  onChange={({ value }) => updateDataConfig({ flowParams: value })}
                  placeholder="Enter flow parameters"
                />
              </>
            )}

            {dc.type === 'customExpression' && (
              <TextInput
                label="Bindings"
                value={dc.bindings ?? ''}
                onChange={({ value }) => updateDataConfig({ bindings: value })}
                placeholder="Enter expression bindings"
              />
            )}

            <TextInput
              label="Unit"
              value={dc.unit ?? ''}
              onChange={({ value }) => updateDataConfig({ unit: value })}
              placeholder="e.g. °C, kWh, %"
            />

            <TextInput
              label="Data Precision"
              type="number"
              value={String(dc.dataPrecision ?? 2)}
              onChange={({ value }) => updateDataConfig({ dataPrecision: parseInt(value) || 0 })}
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
                value={String(chart.min)}
                onChange={({ value }) => updateChart({ min: parseFloat(value) || 0 })}
              />
              <TextInput
                label="Max"
                type="number"
                value={String(chart.max)}
                onChange={({ value }) => updateChart({ max: parseFloat(value) || 100 })}
              />
            </div>

            <div className="gauge-config__bands-header">
              <span className="BodyMediumSemibold">Color Bands</span>
              <Button
                label="Add Band"
                variant="Secondary"
                size="Small"
                onClick={addBand}
              />
            </div>

            {chart.bands.map((band, idx) => (
              <div className="gauge-config__band" id={`band-${idx}`}>
                <div className="gauge-config__row">
                  <TextInput
                    label="From"
                    type="number"
                    value={String(band.from)}
                    onChange={({ value }) => updateBand(idx, { from: parseFloat(value) || 0 })}
                  />
                  <TextInput
                    label="To"
                    type="number"
                    value={String(band.to)}
                    onChange={({ value }) => updateBand(idx, { to: parseFloat(value) || 0 })}
                  />
                </div>
                <div className="gauge-config__row">
                  <TextInput
                    label="Color"
                    value={band.color}
                    onChange={({ value }) => updateBand(idx, { color: value })}
                    suffix={' '}
                  />
                  <div className="gauge-config__color-swatch" style={{ background: band.color }} />
                  <Button
                    label="Remove"
                    variant="Tertiary"
                    size="Small"
                    color="Negative"
                    onClick={() => removeBand(idx)}
                  />
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // === TIME TAB ===
  const renderTimeTab = () => {
    const time = config.time ?? {
      timezone: 'Asia/Kolkata',
      type: 'local',
      startTime: null,
      endTime: null,
      defaultDuration: 'today',
      defaultPeriodicity: 'hourly' as const,
      allDurations: [],
    };

    const updateTime = (updates: Record<string, any>) => {
      emitChange({
        ...config,
        time: { ...time, ...updates },
      });
    };

    return (
      <div className="gauge-config__tab-content">
        <div className="gauge-config__section">
          <TextInput
            label="Timezone"
            value={time.timezone}
            onChange={({ value }) => updateTime({ timezone: value })}
            placeholder="e.g. Asia/Kolkata"
          />

          <SelectInput
            label="Default Periodicity"
            value={PERIODICITIES.find((p) => p.value === time.defaultPeriodicity)?.label ?? ''}
            isOpen={periodicityDropdownOpen}
            onClick={() => setPeriodicityDropdownOpen(!periodicityDropdownOpen)}
          >
            <DropdownMenu>
              {PERIODICITIES.map((p) => (
                <ActionListItem
                  id={p.value}
                  title={p.label}
                  onClick={() => {
                    updateTime({ defaultPeriodicity: p.value });
                    setPeriodicityDropdownOpen(false);
                  }}
                />
              ))}
            </DropdownMenu>
          </SelectInput>
        </div>
      </div>
    );
  };

  // === STYLE TAB ===
  const renderStyleTab = () => (
    <div className="gauge-config__tab-content">
      <Accordion mode="multiple" defaultExpandedKeys={['card-style']}>
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
                {['400', '500', '600', '700'].map((w) => (
                  <ActionListItem
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
        <TabItem
          label="Data"
          isSelected={activeTab === 0}
          onClick={() => setActiveTab(0)}
        />
        <TabItem
          label="Time"
          isSelected={activeTab === 1}
          onClick={() => setActiveTab(1)}
        />
        <TabItem
          label="Style"
          isSelected={activeTab === 2}
          onClick={() => setActiveTab(2)}
        />
      </Tabs>

      {activeTab === 0 && renderDataTab()}
      {activeTab === 1 && renderTimeTab()}
      {activeTab === 2 && renderStyleTab()}
    </div>
  );
};

export default GaugeConfiguration;
