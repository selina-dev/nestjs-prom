// tslint:disable:max-classes-per-file
import Prometheus from "prom-client";

export enum MetricType {
  Counter,
  Gauge,
  Histogram,
  Summary,
}

export interface IMetricTypeConfigurationInterface {
  type: MetricType;
  configuration?: any;
}

export class MetricTypeCounter implements IMetricTypeConfigurationInterface {
  type: MetricType = MetricType.Counter;
  configuration: Prometheus.CounterConfiguration;
}

export class MetricTypeGauge implements IMetricTypeConfigurationInterface {
  type: MetricType = MetricType.Gauge;
  configuration: Prometheus.GaugeConfiguration;
}

export class MetricTypeHistogram implements IMetricTypeConfigurationInterface {
  type: MetricType = MetricType.Histogram;
  configuration: Prometheus.HistogramConfiguration;
}

export class MetricTypeSummary implements IMetricTypeConfigurationInterface {
  type: MetricType = MetricType.Summary;
  configuration: Prometheus.SummaryConfiguration;
}
