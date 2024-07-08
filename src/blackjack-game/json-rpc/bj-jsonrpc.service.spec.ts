import { Test, TestingModule } from '@nestjs/testing';
import { BjJsonrpcService } from './bj-jsonrpc.service';

describe('BjJsonrpcService', () => {
  let service: BjJsonrpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BjJsonrpcService],
    }).compile();

    service = module.get<BjJsonrpcService>(BjJsonrpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
