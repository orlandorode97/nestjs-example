import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    // InjectRepository uses the repository to a generic type, User in this case
    // repo is a type of Repository to handle just users
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        // create function creates a new instance of the UserEntity
        const user = this.repo.create({ email, password })
        // save function takes the UserEntity and store it in a DB
        return this.repo.save(user);
    }

    async findOne(id: number) {
        if(!id) {
            throw new NotFoundException
        }
        const user = await this.repo.findOne(id);
        if (!user) {
            throw new NotFoundException
        }
        return user;
    }

    find(email: string) {
        return this.repo.find({email})
    }

    // attrs can be any object that has at least or none some of the User type properties
    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            // NotFoundException returns an error with http status 404 code
            throw new NotFoundException
        }
        Object.assign(user, attrs)
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException
        }
        return this.repo.remove(user)
    }
}
