// ============================================================================
// Gauge Widget — Pure UI Renderer (Envelope.md compliant)
// ✅ Reads props.config (uiConfig) to render UI
// ✅ Reads props.data to populate gauge value
// ✅ Calls props.onEvent() on user interactions
// ✅ Shows loading skeleton when data === null
// ❌ No fetch, axios, HttpClient — DataLayer's job
// ❌ No authentication — DataLayer handles auth
// ❌ No API endpoints or credentials
// ============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import { Spinner } from '@faclon-labs/design-sdk';
import { WidgetProps, GaugeUIConfig, WidgetData, DEFAULT_UI_CONFIG } from '../../iosense-sdk/types';
import './Gauge.css';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const Gauge: React.FC<WidgetProps> = ({ config: configProp, data, onEvent }) => {
  console.log('[Gauge] render — props received', {
    config: configProp,
    data,
    hasOnEvent: !!onEvent,
  });

  // Sync config prop to state (required for Lens update() lifecycle)
  const [config, setConfig] = useState<GaugeUIConfig>(configProp ?? DEFAULT_UI_CONFIG);

  useEffect(() => {
    console.log('[Gauge] config prop synced to state', configProp);
    setConfig(configProp ?? DEFAULT_UI_CONFIG);
  }, [configProp]);

  // Sync data prop to state (required for Lens update() lifecycle)
  const [currentData, setCurrentData] = useState<WidgetData | null>(data);

  useEffect(() => {
    console.log('[Gauge] data prop synced to state', data);
    setCurrentData(data);
  }, [data]);

  const chart = config?.charts?.[0];
  const style = config?.style ?? DEFAULT_UI_CONFIG.style;

  // Extract gauge value from data keyed by _id
  const gaugeValue = useMemo(() => {
    if (!currentData || !chart) return null;
    const chartData = currentData[chart._id];
    console.log('[Gauge] extracting value from data', { chartId: chart._id, chartData });

    if (chartData === undefined || chartData === null) return null;
    if (typeof chartData === 'number') return chartData;
    if (Array.isArray(chartData) && chartData.length > 0) {
      return Number(chartData[0]?.value ?? chartData[0]) || 0;
    }
    return null;
  }, [currentData, chart]);

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const chartOptions: Highcharts.Options = useMemo(() => {
    const min = chart?.min ?? 0;
    const max = chart?.max ?? 100;
    const bands = chart?.bands ?? [];
    const unit = chart?.unit ?? '';
    const precision = chart?.dataPrecision ?? 2;

    return {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        height: '100%',
      },
      title: undefined,
      pane: {
        center: ['50%', '60%'],
        size: '100%',
        startAngle: -130,
        endAngle: 130,
        background: [{
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc' as any,
          borderWidth: 0,
        }],
      },
      tooltip: { enabled: false },
      credits: { enabled: false },
      yAxis: {
        min,
        max,
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: undefined,
        tickAmount: 2,
        labels: {
          y: 20,
          style: {
            fontSize: '12px',
            color: style.gauge.fontColor,
          },
        },
        plotBands: bands.map((band) => ({
          from: band.from,
          to: band.to,
          color: band.color,
          innerRadius: '60%',
          outerRadius: '100%',
        })),
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -25,
            borderWidth: 0,
            useHTML: true,
            format: `<div style="text-align:center">
              <span style="font-size:${style.gauge.fontSize};font-weight:${style.gauge.fontWeight};color:${style.gauge.fontColor}">
                {y:.${precision}f}
              </span>
              <br/>
              <span style="font-size:12px;color:${style.gauge.fontColor};opacity:0.7">
                ${unit}
              </span>
            </div>`,
          },
          dial: {
            backgroundColor: style.gauge.dialColor,
          },
          pivot: {
            backgroundColor: style.gauge.pivotColor,
          },
        },
      },
      series: [{
        type: 'solidgauge' as any,
        name: chart?.title ?? 'Value',
        data: [gaugeValue ?? 0],
      }],
    };
  }, [chart, style, gaugeValue]);

  console.log('[Gauge] pre-render state', {
    gaugeValue,
    dataIsNull: currentData === null,
    hasChart: !!chart,
    chartId: chart?._id,
  });

  // ✅ Loading skeleton when data === null (DataLayer still fetching)
  if (currentData === null) {
    console.log('[Gauge] rendering loading skeleton — data is null');
    return (
      <div className="gauge-widget gauge-widget--loading">
        <Spinner />
      </div>
    );
  }

  // No config state
  if (!config?.charts?.length) {
    return (
      <div className="gauge-widget gauge-widget--empty">
        <span className="BodyMediumRegular">No gauge configured</span>
      </div>
    );
  }

  const cardStyle: React.CSSProperties = style.card.wrapInCard
    ? {
        background: style.card.background,
        borderRadius: `${style.card.borderRadius}px`,
        border: `${style.card.borderWidth}px solid ${style.card.borderColor}`,
        padding: `${style.card.padding}px`,
      }
    : {};

  return (
    <div className="gauge-widget" style={cardStyle}>
      {chart?.title && (
        <div className="gauge-widget__header">
          <span
            className="gauge-widget__title HeadingSmallSemibold"
            style={{ color: style.gauge.fontColor }}
          >
            {chart.title}
          </span>
        </div>
      )}
      <div className="gauge-widget__chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={chartRef}
        />
      </div>
    </div>
  );
};

export default Gauge;
