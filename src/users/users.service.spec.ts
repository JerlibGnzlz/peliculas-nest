import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
// import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

jest.mock('bcrypt');

describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user with hashed password', async () => {
            // Arrange
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                role: Role.USER,
            };

            const hashedPassword = 'hashed_password';
            const createdUser = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                password: hashedPassword,
                role: Role.USER,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockPrismaService.user.create.mockResolvedValue(createdUser);

            const result = await service.create(createUserDto);

            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    name: 'Test User',
                    password: hashedPassword,
                    role: Role.USER,
                },
            });
            expect(result).toEqual(createdUser);
        });

        it('should use default role USER if role is not provided', async () => {

            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                // role is not provided
            };

            const hashedPassword = 'hashed_password';

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockPrismaService.user.create.mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                password: hashedPassword,
                role: Role.USER,
            });

            await service.create(createUserDto);

            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    name: 'Test User',
                    password: hashedPassword,
                    role: Role.USER,
                },
            });
        });

        it('should throw ConflictException if email already exists', async () => {

            const createUserDto: CreateUserDto = {
                email: 'existing@example.com',
                password: 'password123',
                name: 'Test User',
                role: Role.USER,
            };

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 1,
                email: 'existing@example.com',
            });

            await expect(service.create(createUserDto)).rejects.toThrow(
                ConflictException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'existing@example.com' },
            });
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(prismaService.user.create).not.toHaveBeenCalled();
        });
    });
});