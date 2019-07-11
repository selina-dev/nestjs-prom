import { Controller, Get } from "@nestjs/common";

import { CounterMetric, InjectCounterMetric } from "../../lib";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectCounterMetric("index_counter")
    private readonly counterMetric: CounterMetric,
  ) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get("test")
  test(): string {
    this.counterMetric.inc(1, new Date());
    return "test";
  }
}
