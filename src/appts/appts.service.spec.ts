import { Test, TestingModule } from '@nestjs/testing';
import { ApptsService } from './appts.service';

describe('ApptsService', () => {
  let service: ApptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApptsService],
    }).compile();

    service = module.get<ApptsService>(ApptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
