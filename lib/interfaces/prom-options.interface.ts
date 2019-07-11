export interface IPromModuleOptions {
  [key: string]: any;

  /**
   * Enable default metrics.
   *
   * @remarks
   * Under the hood, that call collectDefaultMetrics().
   */
  withDefaultsMetrics?: boolean;

  /**
   * Enable internal controller to expose /metrics.
   *
   * @remarks
   * If you have a global prefix, don't forget to prefix it in prom.
   */
  withDefaultController?: boolean;

  /**
   * Automatically create 'http_requests_total' counter.
   */
  useHttpCounterMiddleware?: boolean;

  /**
   * Automatically create 'http_requests_total' gauge.
   */
  useHttpMetricsInterceptor?: boolean;

  registryName?: string;
  timeout?: number;
  prefix?: string;
  defaultLabels?: {
    [key: string]: any;
  };
}
