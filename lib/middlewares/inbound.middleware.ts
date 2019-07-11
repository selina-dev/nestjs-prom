import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Counter } from "prom-client";

import { InjectCounterMetric } from "../common";

@Injectable()
export class InboundCounterMiddleware implements NestMiddleware {
  constructor(
    @InjectCounterMetric("http_requests_total")
    private readonly counter: Counter,
  ) {}

  async use(request: Request, _: Response, next: NextFunction) {
    const path = request.baseUrl;
    const method = request.method;

    // Ignore favicon
    if (path === "/favicon.ico") {
      next();
      return;
    }

    // Ignore metrics endpoint
    if (path.match(/\/metrics(\?.*?)?$/)) {
      next();
      return;
    }

    this.counter.labels(path, method).inc(1, new Date());

    next();
  }
}
