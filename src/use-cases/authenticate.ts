import { compare } from 'bcryptjs';
import type { UsersRepository } from '@/repositories/prisma/users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import type { User } from 'generated/prisma';

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
  }
  
  interface AuthenticateUseCaseResponse {
    user: User;
  }
  
  export class AuthenticateUseCase {
    constructor(
      private usersRepository: UsersRepository,
    ) {}
  
    async execute({
      email,
      password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
      const user = await this.usersRepository.findByEmail(email);
      
      if (!user) {
        throw new InvalidCredentialsError();
      }
      
      const doesPasswordMatch = await compare(
        password, 
        user.password_hash
      );
      
      if (!doesPasswordMatch) {
        throw new InvalidCredentialsError();
      }
      
      return {
        user
      };
    }
  }