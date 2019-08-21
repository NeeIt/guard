import {Role} from './role';

export class User {
    id:number;
    username:string;
    password:string;
    firstname:string;
    lastname:string;
    role:Role;
    token?:string;
}