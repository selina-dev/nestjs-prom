import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { MetricType, PromModule, RequestMetricsInterceptor } from "../../lib";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: "v1.0.0",
      },
      useHttpMetricsInterceptor: true,
    }),
    PromModule.forMetrics([
      {
        type: MetricType.Counter,
        configuration: {
          name: "index_counter",
          help: "index_counter a simple counter",
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestMetricsInterceptor,
    },
  ],
})
export class AppModule {}
