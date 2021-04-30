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

import { InjectCounterMetric, InjectHistogramMetric } from "../common";

@Injectable()
export class RequestMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectCounterMetric("http_requests_total")
    private readonly counter: Counter,
    @InjectHistogramMetric("http_request_duration_seconds")
    private readonly gauge: Gauge,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    if (ctx.getType() !== "http") {
      return next.handle();
    }

    const request: Request = ctx.switchToHttp().getRequest();
    const { path, method } = request;

    if (path === "/metrics") {
      return next.handle();
    }

    const stopTimer = this.gauge.labels(path, method).startTimer();

    return next.handle().pipe(
      tap(() => {
        const status = request.res!.statusCode.toString();
        this.counter.labels(path, method, status).inc(1, new Date());
      }),
      catchError((error) => {
        const status =
          error instanceof HttpException ? error.getStatus().toString() : "500";

        this.counter.labels(path, method, status).inc(1, new Date());

        throw error;
      }),
      finalize(stopTimer),
    );
  }
}
