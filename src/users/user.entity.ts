import { Column, Entity, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate} from "typeorm";

@Entity() // -> Table users
export class User {
    @PrimaryGeneratedColumn() //-> Primary key of the users table
    id:number;

    @Column() // -> Column to be added into the users table
    email:string;

    @Column()
    // @Exclude() // -> Exclude decorator excludes the property password of the outgoing response
    password:string;

    @AfterInsert() // -> to log after a record is inserted
    logInsert(){
        console.log('inserted user with id', this.id)
    }

    @AfterRemove() // -> to log after removing a record
    logDelete(){
        console.log('removed user with id', this.id)
    }

    @AfterUpdate() // -> to log after a record is updated
    logUpdate(){
        console.log('updated user with id', this.id)
    }
}