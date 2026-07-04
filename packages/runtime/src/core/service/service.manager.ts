import { ServiceConfig }
  from './service-config.interface.js';

export class ServiceManager {

  private services = new Map<string, ServiceConfig>();

  readonly enabled: boolean;

  constructor(
    services: ServiceConfig[] = [],
    enabled = true
  ) {

    this.enabled = enabled;

    if (!this.enabled) return;

    services.forEach((service) => {
      this.register(service);
    });

  }

  register(service: ServiceConfig): void {
    if (!this.enabled) return;

    this.services.set(service.name, service);
  }


  get(name: string): ServiceConfig | undefined {
    if (!this.enabled) return;

    return this.services.get(name);
  }


  list(): string[] {
    if (!this.enabled) return [];

    return [...this.services.keys()];
  }
}
