import { Test, TestingModule } from '@nestjs/testing';
import { GameFlow } from './game-flow';

describe('GameFlow', () => {
  let provider: GameFlow;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameFlow],
    }).compile();

    provider = module.get<GameFlow>(GameFlow);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
