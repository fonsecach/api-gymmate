import type { User } from './../../generated/prisma/index.d';
import type { UsersRepository } from "@/repositories/prisma/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}
interface RegisterUseCaseResponse {
    user: User;
}
export class RegisterUseCase {

    constructor( private usersRepository: UsersRepository) {}

    async execute ({name, email, password,} : RegisterUseCaseRequest) : Promise<RegisterUseCaseResponse> {
    // passamos dois argumentos a senha e o número de rounds
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
        throw new UserAlreadyExistsError();
    }
    
    const user = await this.usersRepository.create({
        name,
        email,
        password_hash,
    });
        return {user}
    }
}

