import { Test, TestingModule } from '@nestjs/testing';
import { GameDBService } from './gameDB.service';

describe('GameService', () => {
  let service: GameDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameDBService],
    }).compile();

    service = module.get<GameDBService>(GameDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
