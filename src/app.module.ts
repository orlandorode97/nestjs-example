import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [UsersModule, ReportsModule, TypeOrmModule.forRoot({
    // specify the database type
    type: 'sqlite',
    // name of the database
    database: 'db.sqlite',
    // entities refer to the tables or entity models
    entities: [User, Report],
    // to run migrations only for development mode
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
