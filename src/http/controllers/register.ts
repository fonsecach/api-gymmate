import { z } from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';


export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  try {
    const { name, email, password } = registerBodySchema.parse(request.body);

    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
    });

    return reply.status(201).send({
      message: 'User created successfully'
    });
    
  } catch (error) {

    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message});
    }

    throw error;
  }
}
