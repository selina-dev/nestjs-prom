import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Counter, Gauge } from "prom-client";
import { Observable } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";

import { InjectCounterMetric, InjectGaugeMetric } from "../common";

@Injectable()
export class RequestMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectCounterMetric("http_requests_total")
    private readonly counter: Counter,
    @InjectGaugeMetric("http_requests_duration")
    private readonly gauge: Gauge,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = ctx.switchToHttp().getRequest();

    const path = request.path;
    const method = request.method;

    if (path === "/metrics") {
      return next.handle();
    }

    const stopTimer = this.gauge.labels(path, method).startTimer();

    return next.handle().pipe(
      tap(() => {
        const status = request.res!.statusCode.toString();
        this.counter.labels(path, method, status).inc(1, new Date());
      }),
      catchError(error => {
        const status =
          error instanceof HttpException ? error.getStatus().toString() : "500";

        this.counter.labels(path, method, status).inc(1, new Date());

        throw error;
      }),
      finalize(stopTimer),
    );
  }
}
