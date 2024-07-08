import { Test, TestingModule } from '@nestjs/testing';
import { JsonRpcService } from './json-rpc.service';

describe('JsonRpcService', () => {
  let service: JsonRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonRpcService],
    }).compile();

    service = module.get<JsonRpcService>(JsonRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
