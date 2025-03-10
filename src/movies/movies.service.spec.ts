import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { of } from 'rxjs';

const mockPrismaService = {
    movie: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

const mockHttpService = {
    get: jest.fn().mockReturnValue(of({ data: { results: [] } })),
};

describe('MoviesService', () => {
    let service: MoviesService;
    let prisma: typeof mockPrismaService;
    let httpService: typeof mockHttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviesService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: HttpService, useValue: mockHttpService },
            ],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
        prisma = module.get(PrismaService);
        httpService = module.get(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a movie', async () => {
        const movieDto = { title: 'Test Movie', externalId: '1', releaseDate: '2025-01-01' };
        prisma.movie.create.mockResolvedValue(movieDto);
        const result = await service.create(movieDto);
        expect(result).toEqual(movieDto);
        expect(prisma.movie.create).toHaveBeenCalledWith({
            data: { ...movieDto, releaseDate: new Date(movieDto.releaseDate) },
        });
    });

    it('should throw ConflictException when movie already exists', async () => {
        const movieDto = { title: 'Test Movie', externalId: '1' };
        prisma.movie.create.mockRejectedValue({ code: 'P2002' });
        await expect(service.create(movieDto)).rejects.toThrow(ConflictException);
    });

    it('should return all movies', async () => {
        prisma.movie.findMany.mockResolvedValue([{ title: 'Test Movie' }]);
        const result = await service.findAll();
        expect(result).toEqual([{ title: 'Test Movie' }]);
    });

    it('should return a movie by id', async () => {
        const movie = { id: '1', title: 'Test Movie' };
        prisma.movie.findUnique.mockResolvedValue(movie);
        const result = await service.findOne('1');
        expect(result).toEqual(movie);
    });

    it('should throw NotFoundException when movie is not found', async () => {
        prisma.movie.findUnique.mockResolvedValue(null);
        await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should update a movie', async () => {
        const updateDto = { title: 'Updated Movie' };
        prisma.movie.update.mockResolvedValue(updateDto);
        const result = await service.update('1', updateDto);
        expect(result).toEqual(updateDto);
    });

    it('should delete a movie', async () => {
        prisma.movie.delete.mockResolvedValue({ id: '1' });
        const result = await service.remove('1');
        expect(result).toEqual({ id: '1' });
    });

    it('should fetch Star Wars movies from API', async () => {
        const mockMovies = [{ title: 'A New Hope' }];
        httpService.get.mockReturnValue(of({ data: { results: mockMovies } }));
        const result = await service.fetchStarWarsMoviesFromApi();
        expect(result).toEqual(mockMovies);
    });

    it('should sync Star Wars movies', async () => {
        const mockFilms = [
            {
                title: 'A New Hope',
                episode_id: 4,
                opening_crawl: 'It is a period of civil war...',
                director: 'George Lucas',
                producer: 'Gary Kurtz, Rick McCallum',
                release_date: '1977-05-25',
                characters: [],
                planets: [],
                starships: [],
                vehicles: [],
                species: [],
                url: 'https://swapi.dev/api/films/1/',
            },
        ];

        httpService.get.mockReturnValue(of({ data: { results: mockFilms } }));
        prisma.movie.findUnique.mockResolvedValue(null);
        prisma.movie.create.mockResolvedValue(mockFilms[0]);

        const result = await service.syncStarWarsMovies();
        expect(result).toEqual({
            message: 'Star Wars movies synchronized successfully',
            newItemsAdded: 1,
            totalItems: 1,
        });
    });
});
