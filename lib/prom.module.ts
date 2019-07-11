import { DynamicModule, Module } from "@nestjs/common";
import * as client from "prom-client";

import {
  IMetricTypeConfigurationInterface,
  IPromModuleOptions,
  MetricType,
} from "./interfaces";
import { PromCoreModule } from "./prom-core.module";
import { PromController } from "./prom.controller";
import {
  createPromCounterProvider,
  createPromGaugeProvider,
  createPromHistogramProvider,
  createPromSummaryProvider,
} from "./prom.providers";

@Module({})
export class PromModule {
  static forRoot(options: IPromModuleOptions = {}): DynamicModule {
    const {
      withDefaultController,
      useHttpCounterMiddleware,
      useHttpMetricsInterceptor,
    } = options;

    const moduleForRoot: DynamicModule = {
      module: PromModule,
      imports: [PromCoreModule.forRoot(options)],
      controllers: [],
      exports: [],
      providers: [],
    };

    // default push default controller
    if (withDefaultController !== false) {
      moduleForRoot.controllers = [
        ...moduleForRoot.controllers!,
        PromController,
      ];
    }

    // if want to use the http counter
    if (useHttpCounterMiddleware || useHttpMetricsInterceptor) {
      const inboundCounterProvider = createPromCounterProvider({
        name: "http_requests_total",
        help: "http_requests_total Number of inbound request",
        labelNames: ["path", "method", "status"],
      });

      moduleForRoot.providers = [
        ...moduleForRoot.providers!,
        inboundCounterProvider,
      ];
      moduleForRoot.exports = [
        ...moduleForRoot.exports!,
        inboundCounterProvider,
      ];
    }

    if (useHttpMetricsInterceptor) {
      const requestDurationGaugeProvider = createPromGaugeProvider({
        name: "http_requests_duration",
        help:
          "http_requests_duration The time(in milliseconds) to process API requests",
        labelNames: ["path", "method"],
      });

      moduleForRoot.providers = [
        ...moduleForRoot.providers!,
        requestDurationGaugeProvider,
      ];
      moduleForRoot.exports = [
        ...moduleForRoot.exports!,
        requestDurationGaugeProvider,
      ];
    }

    return moduleForRoot;
  }

  static forMetrics(
    metrics: IMetricTypeConfigurationInterface[],
  ): DynamicModule {
    const providers = metrics.map(entry => {
      switch (entry.type) {
        case MetricType.Counter:
          return createPromCounterProvider(entry.configuration);
        case MetricType.Gauge:
          return createPromGaugeProvider(entry.configuration);
        case MetricType.Histogram:
          return createPromHistogramProvider(entry.configuration);
        case MetricType.Summary:
          return createPromSummaryProvider(entry.configuration);
        default:
          throw new ReferenceError(`The type ${entry.type} is not supported`);
      }
    });

    return {
      module: PromModule,
      providers,
      exports: providers,
    };
  }

  static forCounter(configuration: client.CounterConfiguration): DynamicModule {
    const provider = createPromCounterProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forGauge(configuration: client.GaugeConfiguration): DynamicModule {
    const provider = createPromGaugeProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forHistogram(
    configuration: client.HistogramConfiguration,
  ): DynamicModule {
    const provider = createPromHistogramProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forSummary(configuration: client.SummaryConfiguration): DynamicModule {
    const provider = createPromSummaryProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
