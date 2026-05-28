import { ServiceConfig } from './service-config.interface.js';

export class ServiceManager {
  private services = new Map<string, ServiceConfig>();

  constructor(services: ServiceConfig[] = []) {
    services.forEach((service) => {
      this.register(service);
    });
  }

  register(service: ServiceConfig) {
    this.services.set(service.name, service);
  }

  get(name: string) {
    return this.services.get(name);
  }

  list(): string[] {
    return [...this.services.keys()];
  }
}
