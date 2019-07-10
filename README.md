# @selinarnd/nest-prom

A Prometheus module for Nest.

## Installation

```bash
$ yarn add --save @selinarnd/nest-prom prom-client
```

## How to use

Import `PromModule` into the root `ApplicationModule`:

```typescript
import { Module } from "@nestjs/common";
import { PromModule } from "@selinarnd/nest-prom";

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'my_app',
      },
    }),
  ],
})
export class ApplicationModule {}
```

### Setup metric

In your module, use the `forMetrics()` method to define the metrics needed.

```typescript
import { Module } from "@nestjs/common";
import { PromModule, MetricType } from "@selinarnd/nest-prom";

@Module({
  imports: [
    PromModule.forMetrics([
      {
        type: MetricType.Counter,
        configuration: {
          name: 'my_counter',
          help: 'my_counter a simple counter',
        },
      },
      {
        type: MetricType.Gauge,
        configuration: {
          name: 'my_gauge',
          help: 'my_gauge a simple gauge',
        },
      },
      {
        type: MetricType.Histogram,
        configuration: {
          name: 'my_histogram',
          help: 'my_histogram a simple histogram',
        },
      },
      {
        type: MetricType.Summary,
        configuration: {
          name: 'my_summary',
          help: 'my_summary a simple summary',
        },
      },
    ]),
  ],
})
export class MyModule {}
```

And you can use `@InjectCounterMetric()` decorator to get the metrics:

```typescript
import { Injectable } from "@nestjs/common";
import {
  InjectCounterMetric,
  InjectGaugeMetric,
  InjectHistogramMetric,
  InjectSummaryMetric,
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  SummaryMetric,
} from "@selinarnd/nest-prom";

@Injectable()
export class MyService {
  constructor(
    @InjectCounterMetric('my_counter') private readonly counterMetric: CounterMetric,
    @InjectGaugeMetric('my_gauge') private readonly gaugeMetric: GaugeMetric,
    @InjectHistogramMetric('my_histogram') private readonly histogramMetric: HistogramMetric,
    @InjectSummaryMetric('my_summary') private readonly summaryMetric: SummaryMetric,
  ) {}

  doStuff() {
    this.counterMetric.inc();
  }

  resetCounter() {
    this.counterMetric.reset();
  }
}
```

### Metric endpoint

At the moment, no way to configure the `/metrics` endpoint path.

PS: If you have a global prefix, the path will be `{globalPrefix}/metrics`.

## API

### PromModule.forRoot() options

- `withDefaultsMetrics: boolean (default true)` enable defaultMetrics provided by prom-client
- `withDefaultController: boolean (default true)` add internal controller to expose a /metrics endpoint
- `useHttpCounterMiddleware: boolean (default false)` register http_requests_total counter

## Auth/security

We do not provide any auth/security for the `/metrics` endpoints.

This is not the aim of this module, but depending of the auth strategy, you can
apply a middleware on `/metrics` to secure it.

## TODO

- Update readme
  - Gauge
  - Histogram
  - Summary
- Manage registries
- Tests
- Give possibility to custom metric endpoint
- Adding example on how to secure `/metrics` endpoint
  - secret
  - jwt
  
