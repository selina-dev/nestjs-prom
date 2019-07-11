import { DynamicModule, Global, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { IPromModuleOptions } from "./interfaces";
import {
  DEFAULT_PROM_OPTIONS,
  DEFAULT_PROM_REGISTRY,
  PROM_REGISTRY_NAME,
} from "./prom.constants";

import client, {
  collectDefaultMetrics,
  DefaultMetricsCollectorConfiguration,
  Registry,
} from "prom-client";
import { getRegistryName } from "./common/prom.utils";

@Global()
@Module({})
export class PromCoreModule {
  static forRoot(options: IPromModuleOptions = {}): DynamicModule {
    const { withDefaultsMetrics, registryName, timeout, prefix } = options;

    const promRegistryName = registryName
      ? getRegistryName(registryName)
      : DEFAULT_PROM_REGISTRY;

    const promRegistryNameProvider = {
      provide: PROM_REGISTRY_NAME,
      useValue: promRegistryName,
    };

    const promRegistryOptionsProvider = {
      provide: DEFAULT_PROM_OPTIONS,
      useValue: options,
    };

    const registryProvider = {
      provide: promRegistryName,
      useFactory: (): Registry => {
        let registry = client.register;
        if (promRegistryName !== DEFAULT_PROM_REGISTRY) {
          registry = new Registry();
        }

        if (withDefaultsMetrics !== false) {
          const defaultMetricsOptions: DefaultMetricsCollectorConfiguration = {
            register: registry,
          };
          if (timeout) {
            defaultMetricsOptions.timeout = timeout;
          }
          if (prefix) {
            defaultMetricsOptions.prefix = prefix;
          }
          collectDefaultMetrics(defaultMetricsOptions);
        }

        return registry;
      },
    };

    return {
      module: PromCoreModule,
      providers: [
        promRegistryNameProvider,
        promRegistryOptionsProvider,
        registryProvider,
      ],
      exports: [registryProvider],
    };
  }
  constructor(
    // @ts-ignore
    private readonly moduleRef: ModuleRef,
  ) {}
}
