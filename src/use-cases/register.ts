import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    constructor( private usersRepository: any) {}

    async execute ({name, email, password,} : RegisterUseCaseRequest) {
    // passamos dois argumentos a senha e o número de rounds
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
        throw new Error('E-mail already exists.');
    }
    
    await this.usersRepository.create({
        name,
        email,
        password_hash,
    });
    }
}

