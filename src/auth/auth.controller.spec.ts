import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should call authService.login with correct credentials', async () => {
            // Arrange
            const loginDto: LoginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const expectedResult = {
                access_token: 'jwt-token',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'USER',
                },
            };

            mockAuthService.login.mockResolvedValue(expectedResult);

            const result = await controller.login(loginDto);

            expect(authService.login).toHaveBeenCalledWith(
                loginDto.email,
                loginDto.password,
            );
            expect(result).toEqual(expectedResult);
        });
    });
});