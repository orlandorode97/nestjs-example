import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

// For a better test tracking names
describe('AuthService', () => {
    let service: AuthService
    let fakeUserService: Partial<UsersService>;
    const users: User[] = [];
    // before running each test define the following objects
    beforeEach(async () => {
        // Fake user service
        fakeUserService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {id: 1, email, password} as User 
                users.push(user)
                return Promise.resolve(user)
            }
        }

        const module = await Test.createTestingModule({
            providers: [AuthService, {
                provide: UsersService, // if anyone requires a copy of the UserService...
                useValue: fakeUserService, // then provide the fakeUserService
            }]
        }).compile()

        service = module.get(AuthService)
    })

    // it means to the subject 'it' and then the action of the subject
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined()
    })

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signUp('orlando.romo.97@hotmail.com', '1234567')

        expect(user.password).not.toEqual('1234567')

        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws a ConflictException if the user signs up with an existing email', async () => {
        // fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'no-reply@nest.com', password: '123456' } as User])
        await service.signUp('no-reply@nest.com', '123456')
        try {
            await service.signUp('no-reply@nest.com', '1234567')
        } catch (error) {
            expect(error).toEqual(new ConflictException('email in use'))
        }
    })

    it('throws a NotFoundException if the user signs in with non-existing email', async () => {
        let email = 'email@mail.com'
        try {
            await service.signIn(email, '12345')
        } catch (error) {
            expect(error).toEqual(new NotFoundException('user with email ' + email + ' not found'))
        }
    })

    it('throws a BadRequestException if the user signs in with invalid password', async () => {
        let wrongPassword = '654321'
        await service.signUp('email@domain.com', '123456')
        try {
            await service.signIn('email@domain.com', wrongPassword)
        } catch (error) {
            expect(error).toEqual(new BadRequestException('email or password are invalid'))
        }
    })

    it('returns the user if the email exists and the password matches', async () => {
        await service.signUp('random@email.com', '123456')
        const user = await service.signIn('random@email.com', '123456')
        expect(user).toBeDefined()
    })
})