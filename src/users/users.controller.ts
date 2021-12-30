import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, HttpStatus, Session, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // -> custom interceptor
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) { }

    @Get('/whoami')
    @UseGuards(AuthGuard) // -> custom guard
    whoAmI(@CurrentUser() user: string) {
        return user
    }

    @Post('/signout')
    @HttpCode(HttpStatus.OK)
    signOut(@Session() session: any) {
        session.user_id = null;
    }

    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Session() session: any, @Body() body: CreateUserDto) { //@Body decorator extracts the body of the request
        const user = await this.authService.signUp(body.email, body.password);
        if(user) {
            session.user_id = user.id
        }
        return user 
    }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async signIn(@Session() session: any, @Body() body: CreateUserDto) { //@Body decorator extracts the body of the request
        const user = await this.authService.signIn(body.email, body.password);
        if(user) {
            session.user_id = user.id
        }
        return user 
    }

    @Get('/:id')
    findUser(@Param('id') id: number) {
        return this.userService.findOne(id)
    }

    @Get()
    async findAllUsers(@Query('email') email: string) {
        return await this.userService.find(email)
    }

    @Patch('/:id')
    updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return this.userService.update(id, body)
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    removeUser(@Param('id') id: number) {
        return this.userService.remove(id)
    }
}
