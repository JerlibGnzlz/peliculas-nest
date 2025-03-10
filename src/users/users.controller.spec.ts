import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let usersService: UsersService;

    const mockUsersService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call usersService.create with the provided dto', async () => {

            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                role: Role.USER,
            };

            const createdUser = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: Role.USER,
                password: 'hashed_password',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockUsersService.create.mockResolvedValue(createdUser);

            const result = await controller.create(createUserDto);

            expect(usersService.create).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(createdUser);
        });
    });

    describe('getProfile', () => {
        it('should return the user from the request', () => {
            const req = {
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                },
            };

            // Act
            const result = controller.getProfile(req);

            // Assert
            expect(result).toEqual(req.user);
        });
    });
});