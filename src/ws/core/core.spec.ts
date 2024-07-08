import { Test, TestingModule } from '@nestjs/testing';
import { Core } from './core';

describe('Core', () => {
  let provider: Core;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Core],
    }).compile();

    provider = module.get<Core>(Core);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
