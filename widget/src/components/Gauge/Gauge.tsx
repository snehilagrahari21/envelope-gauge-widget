import React, { useState, useEffect, useRef, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import { Spinner } from '@faclon-labs/design-sdk';
import { WidgetProps, GaugeWidgetConfig, DEFAULT_GAUGE_CONFIG } from '../../iosense-sdk/types';
import { getWidgetData } from '../../iosense-sdk/api';
import './Gauge.css';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const Gauge: React.FC<WidgetProps> = ({
  config: configProp,
  data: dataProp,
  authentication,
  timeChange,
}) => {
  console.log('[Gauge] render — props received', {
    config: configProp,
    data: dataProp,
    authentication: authentication ? `${authentication.substring(0, 20)}...` : undefined,
    hasTimeChange: !!timeChange,
  });

  const [config, setConfig] = useState<GaugeWidgetConfig>(configProp ?? DEFAULT_GAUGE_CONFIG);
  const [gaugeValue, setGaugeValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Sync config prop to state (required for Lens update() lifecycle)
  useEffect(() => {
    console.log('[Gauge] config prop synced to state', configProp);
    setConfig(configProp ?? DEFAULT_GAUGE_CONFIG);
  }, [configProp]);

  // Sync data prop (passive render path)
  useEffect(() => {
    if (dataProp !== undefined && dataProp !== null) {
      console.log('[Gauge] data prop received (passive path)', dataProp);
      const chart = config.charts[0];
      const chartId = chart?.title ?? 'gauge-0';
      const val = (dataProp as any)[chartId];
      console.log('[Gauge] extracted value from data prop', { chartId, val });
      if (typeof val === 'number') {
        setGaugeValue(val);
      } else if (Array.isArray(val) && val.length > 0) {
        setGaugeValue(Number(val[0]?.value ?? val[0]) || 0);
      }
    } else {
      console.log('[Gauge] data prop is undefined/null — will self-fetch if configured');
    }
  }, [dataProp, config]);

  // Self-fetch path: when data prop is undefined, fetch using dataConfig
  useEffect(() => {
    if (dataProp !== undefined) {
      console.log('[Gauge] self-fetch skipped — data prop provided');
      return;
    }
    if (!authentication) {
      console.log('[Gauge] self-fetch skipped — no authentication');
      return;
    }
    if (!config?.charts?.[0]?.dataConfig?.devID) {
      console.log('[Gauge] self-fetch skipped — no devID configured');
      return;
    }

    const chart = config.charts[0];
    const dc = chart.dataConfig;

    const fetchData = async () => {
      setLoading(true);
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const requestBody = {
        devID: dc.devID,
        devTypeID: dc.devTypeID,
        sensor: dc.sensor,
        operator: dc.operator ?? 'LastDP',
        startTime: oneHourAgo.toISOString(),
        endTime: now.toISOString(),
        periodicity: config.time?.defaultPeriodicity ?? 'hourly',
      };
      console.log('[Gauge] self-fetch — calling getWidgetData', requestBody);

      try {
        const result = await getWidgetData(authentication, requestBody);
        console.log('[Gauge] self-fetch — raw API response', result);

        if (result !== null) {
          const value = typeof result === 'number'
            ? result
            : Array.isArray(result) && result.length > 0
              ? Number(result[0]?.value ?? result[0]) || 0
              : 0;
          console.log('[Gauge] self-fetch — resolved gauge value', value);
          setGaugeValue(value);
        } else {
          console.warn('[Gauge] self-fetch — API returned null');
        }
      } catch (err) {
        console.error('[Gauge] self-fetch — error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataProp, authentication, config]);

  const chart = config?.charts?.[0];
  const style = config?.style ?? DEFAULT_GAUGE_CONFIG.style;

  const chartOptions: Highcharts.Options = useMemo(() => {
    const min = chart?.min ?? 0;
    const max = chart?.max ?? 100;
    const bands = chart?.bands ?? [];
    const unit = chart?.dataConfig?.unit ?? '';
    const precision = chart?.dataConfig?.dataPrecision ?? 2;

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

  console.log('[Gauge] pre-render state', { gaugeValue, loading, hasChart: !!chart, configCharts: config?.charts?.length });

  // Loading state
  if (loading && gaugeValue === null) {
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
