import { User } from './../../generated/prisma/index.d';
import type { UsersRepository } from "@/repositories/prisma/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {

    constructor( private usersRepository: UsersRepository) {}

    async execute ({name, email, password,} : RegisterUseCaseRequest) {
    // passamos dois argumentos a senha e o número de rounds
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
        throw new UserAlreadyExistsError();
    }
    
    await this.usersRepository.create({
        name,
        email,
        password_hash,
    });
    }
}

