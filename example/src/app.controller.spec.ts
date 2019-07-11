import { Test, TestingModule } from "@nestjs/testing";

import { MetricType, PromModule } from "../../lib";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        PromModule.forRoot({
          defaultLabels: {
            app: "v1.0.0",
          },
          useHttpCounterMiddleware: true,
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
      providers: [AppService],
    }).compile();
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.root()).toBe("Hello World!");
    });
  });
});
