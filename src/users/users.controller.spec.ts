import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { NotFoundException } from '@nestjs/common';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeAuthService = {
      signUp: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'email@mail.com', password: '1234567' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1234567' } as User])
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({ id, email: 'orlando@email.com', password: '1234567' } as User)
      },
      remove: (id: number) => {
        return Promise.resolve({id, email: 'random@email.com', password: 'yeah'} as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService, {
        provide: UsersService,
        useValue: fakeUserService
      }, {
          provide: AuthService,
          useValue: fakeAuthService
        }]
    }).compile();

    controller = module.get(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signOut removes session user_id', () => {
    const session = { user_id: 1 }
    controller.signOut(session)
    expect(session).toMatchObject({ user_id: null })
  })

  it('createUser returns a user and updates session', async () => {
    const session = {}
    const body = { email: 'orlando.romo.07@hotmail.com', password: '98232' } as CreateUserDto
    const user = await controller.createUser(session, body)
    expect(user).toBeDefined()
    expect(session).toMatchObject({ user_id: user.id })
  })
  it('signIn updates session and returns user', async () => {
    const session = {}
    const user = await controller.signIn(session, { email: 'orlando.romo.97@hotmail.com', password: '1234567' })
    expect(user.id).toEqual(1)
    expect(session).toMatchObject({ user_id: 1 })
  })

  it('findUser returns a user', async () => {
    let id = 1
    const user = await controller.findUser(id)
    expect(user).toBeDefined()
    expect(user.id).toEqual(id)
  })

  it('findAllUsers returns a list of users', async () => {
    let emailToSearch = 'orlando.romo.97@hotmail.com'
    const users = await controller.findAllUsers(emailToSearch)
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual(emailToSearch)
  })

  it('updateUser returns the updated user', async () => {
    let id = 1
    const result = { email: 'orlando@email.com', password: '1234567' }
    const body: UpdateUserDto = { email: result.email, password: result.password }
    const user = await controller.updateUser(id, body)
    expect(user).toBeDefined()
    expect(user.email).toEqual(result.email)
    expect(user.password).toEqual(result.password)
  })

  it('removeUser returns no user and cannot be found', async () => {
    fakeUserService.findOne = (id) => {
      return Promise.resolve({} as User)
    }

    let id = 1
    await controller.removeUser(id)
    try {
      await controller.findUser(id)
    } catch (error) {
      expect(error).toEqual(new NotFoundException)
    }
  })
});
