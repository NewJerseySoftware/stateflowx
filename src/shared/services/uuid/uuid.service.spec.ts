import { Test, TestingModule } from '@nestjs/testing';
import { UUIDService } from './uuid.service';

describe('UuidService', () => {
  let service: UUIDService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UUIDService],
    }).compile();

    service = module.get<UUIDService>(UUIDService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
