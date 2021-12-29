import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }

    async signUp(email: string, password: string) {
        const [user] = await this.userService.find(email)
        if (user) {
            // Conflict HTTP 409 when a resource already exists
            throw new ConflictException('email in use')
        }
        // Generate salt
        const salt = randomBytes(8).toString('hex'); // 16-long string
        // Hash the salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer; // 32-characters long
        // Join hash and salt
        const result = `${salt}.${hash.toString('hex')}`
        // create user
        const createdUser = await this.userService.create(email, result);
        // return user
        return createdUser
    }

    async signIn(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException('user with email ' + email + ' not found')
        }
        const [salt, hash] = user.password.split(".")
        const newHash = (await scrypt(password, salt, 32)) as Buffer
        if(newHash.toString('hex') !== hash) {
            throw new BadRequestException('email or password are invalid')
        }
        return user

    }
}
