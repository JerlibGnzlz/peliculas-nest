import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    const mockUsersService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user without password if credentials are valid', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                password: 'hashed_password',
                name: 'Test User',
                role: 'USER',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser('test@example.com', 'password123');

            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
            expect(result).toEqual({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
            });
            expect(result.password).toBeUndefined();
        });

        it('should return null if user is not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.validateUser('nonexistent@example.com', 'password123');

            expect(result).toBeNull();
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('should return null if password is invalid', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                password: 'hashed_password',
                name: 'Test User',
                role: 'USER',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validateUser('test@example.com', 'wrong_password');

            expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access token and user data if credentials are valid', async () => {
            // Arrange
            const user = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
            };

            jest.spyOn(service, 'validateUser').mockResolvedValue(user);
            mockJwtService.sign.mockReturnValue('jwt_token');

            const result = await service.login('test@example.com', 'password123');

            expect(service.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(jwtService.sign).toHaveBeenCalledWith({
                email: 'test@example.com',
                sub: 1,
            });
            expect(result).toEqual({
                access_token: 'jwt_token',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'USER',
                },
            });
        });

        it('should throw UnauthorizedException if credentials are invalid', async () => {

            jest.spyOn(service, 'validateUser').mockResolvedValue(null);


            await expect(service.login('test@example.com', 'wrong_password')).rejects.toThrow(
                UnauthorizedException,
            );
            expect(service.validateUser).toHaveBeenCalledWith('test@example.com', 'wrong_password');
        });
    });
});