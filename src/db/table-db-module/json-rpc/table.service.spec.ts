import { Test, TestingModule } from '@nestjs/testing';
import { TableJsonrpcService } from './table-rpc.service';

describe('TableJsonrpcService', () => {
  let service: TableJsonrpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableJsonrpcService],
    }).compile();

    service = module.get<TableJsonrpcService>(TableJsonrpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
