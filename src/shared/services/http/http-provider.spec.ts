import { Test, TestingModule } from '@nestjs/testing';
import { HttpProvider } from './http-provider';

describe('Http', () => {
  let provider: HttpProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpProvider],
    }).compile();

    provider = module.get<HttpProvider>(HttpProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
