import { Test, TestingModule } from '@nestjs/testing';
import { GameProvider } from './game.provider';

describe('GameProvider', () => {
  let provider: GameProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameProvider],
    }).compile();

    provider = module.get<GameProvider>(GameProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
