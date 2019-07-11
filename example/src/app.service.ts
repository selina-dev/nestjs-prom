import { Injectable } from "@nestjs/common";
import { CounterMetric, InjectCounterMetric } from "../../lib";

@Injectable()
export class AppService {
  constructor(
    @InjectCounterMetric("index_counter")
    private readonly counterMetric: CounterMetric,
  ) {}

  root(): string {
    this.counterMetric.inc(1, new Date());
    return "Hello World!";
  }
}
