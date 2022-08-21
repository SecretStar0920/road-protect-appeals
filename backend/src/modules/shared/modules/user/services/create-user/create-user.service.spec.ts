import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';

describe('CreateUserService', () => {
    let service: CreateUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CreateUserService],
        }).compile();

        service = module.get<CreateUserService>(CreateUserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
