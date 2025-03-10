// movies.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('MoviesController', () => {
    let controller: MoviesController;
    let moviesService: MoviesService;

    const mockMovie = {
        id: '1',
        title: 'Star Wars: A New Hope',
        episodeId: 4,
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        releaseDate: new Date('1977-05-25'),
        externalId: 'https://swapi.dev/api/films/1/',
        openingCrawl: 'It is a period of civil war...',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockMoviesList = [mockMovie];

    const mockCreateMovieDto: CreateMovieDto = {
        title: 'Star Wars: A New Hope',
        episodeId: 4,
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        releaseDate: '1977-05-25',
        externalId: 'https://swapi.dev/api/films/1/',
        openingCrawl: 'It is a period of civil war...',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
    };

    const mockUpdateMovieDto: UpdateMovieDto = {
        title: 'Star Wars: Episode IV - A New Hope',
        releaseDate: undefined
    };

    const mockSwapiResponse = [
        {
            title: 'A New Hope',
            episode_id: 4,
            opening_crawl: 'It is a period of civil war...',
            director: 'George Lucas',
            producer: 'Gary Kurtz, Rick McCallum',
            release_date: '1977-05-25',
            characters: ['https://swapi.dev/api/people/1/'],
            planets: ['https://swapi.dev/api/planets/1/'],
            starships: ['https://swapi.dev/api/starships/2/'],
            vehicles: ['https://swapi.dev/api/vehicles/4/'],
            species: ['https://swapi.dev/api/species/1/'],
            url: 'https://swapi.dev/api/films/1/',
        },
    ];

    const mockSyncResponse = {
        message: 'Star Wars movies synchronized successfully',
        newItemsAdded: 1,
        totalItems: 6,
    };

    // Mock MoviesService
    const mockMoviesService = {
        findAll: jest.fn().mockResolvedValue(mockMoviesList),
        findOne: jest.fn().mockResolvedValue(mockMovie),
        create: jest.fn().mockResolvedValue(mockMovie),
        update: jest.fn().mockResolvedValue({ ...mockMovie, ...mockUpdateMovieDto }),
        remove: jest.fn().mockResolvedValue(mockMovie),
        fetchStarWarsMoviesFromApi: jest.fn().mockResolvedValue(mockSwapiResponse),
        syncStarWarsMovies: jest.fn().mockResolvedValue(mockSyncResponse),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                {
                    provide: MoviesService,
                    useValue: mockMoviesService,
                },
            ],
        })
            // Override guards for testing
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<MoviesController>(MoviesController);
        moviesService = module.get<MoviesService>(MoviesService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of movies', async () => {
            const result = await controller.findAll();

            expect(result).toEqual(mockMoviesList);
            expect(moviesService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a single movie by id', async () => {
            const result = await controller.findOne('1');

            expect(result).toEqual(mockMovie);
            expect(moviesService.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('create', () => {
        it('should create a new movie', async () => {
            const result = await controller.create(mockCreateMovieDto);

            expect(result).toEqual(mockMovie);
            expect(moviesService.create).toHaveBeenCalledWith(mockCreateMovieDto);
        });
    });

    describe('update', () => {
        it('should update a movie', async () => {
            const result = await controller.update('1', mockUpdateMovieDto);

            expect(result).toEqual({ ...mockMovie, ...mockUpdateMovieDto });
            expect(moviesService.update).toHaveBeenCalledWith('1', mockUpdateMovieDto);
        });
    });

    describe('remove', () => {
        it('should remove a movie', async () => {
            const result = await controller.remove('1');

            expect(result).toEqual(mockMovie);
            expect(moviesService.remove).toHaveBeenCalledWith('1');
        });
    });

    describe('fetchStarWarsMoviesFromApi', () => {
        it('should fetch Star Wars movies from SWAPI', async () => {
            const result = await controller.fetchStarWarsMoviesFromApi();

            expect(result).toEqual(mockSwapiResponse);
            expect(moviesService.fetchStarWarsMoviesFromApi).toHaveBeenCalled();
        });
    });

    describe('syncStarWarsMovies', () => {
        it('should sync Star Wars movies from API to database', async () => {
            const result = await controller.syncStarWarsMovies();

            expect(result).toEqual(mockSyncResponse);
            expect(moviesService.syncStarWarsMovies).toHaveBeenCalled();
        });
    });

    describe('route decorators', () => {
        it('should have Public decorator on findAll method', () => {
            const isPublic = Reflect.getMetadata('isPublic', controller.findAll);
            expect(isPublic).toBe(true);
        });

        it('should have Public decorator on fetchStarWarsMoviesFromApi method', () => {
            const isPublic = Reflect.getMetadata('isPublic', controller.fetchStarWarsMoviesFromApi);
            expect(isPublic).toBe(true);
        });

        it('should have Roles decorator with USER on findOne method', () => {
            const roles = Reflect.getMetadata('roles', controller.findOne);
            expect(roles).toEqual(['USER']);
        });

        it('should have Roles decorator with ADMIN on create method', () => {
            const roles = Reflect.getMetadata('roles', controller.create);
            expect(roles).toEqual(['ADMIN']);
        });

        it('should have Roles decorator with ADMIN on update method', () => {
            const roles = Reflect.getMetadata('roles', controller.update);
            expect(roles).toEqual(['ADMIN']);
        });

        it('should have Roles decorator with ADMIN on remove method', () => {
            const roles = Reflect.getMetadata('roles', controller.remove);
            expect(roles).toEqual(['ADMIN']);
        });

        it('should have Roles decorator with ADMIN on syncStarWarsMovies method', () => {
            const roles = Reflect.getMetadata('roles', controller.syncStarWarsMovies);
            expect(roles).toEqual(['ADMIN']);
        });
    });
});