import { z } from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";


export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  try {
    // Validate request body
    const { name, email, password } = registerBodySchema.parse(request.body);

    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    // Execute registration use case
    await registerUseCase.execute({
      name,
      email,
      password,
    });

    // Return success response
    return reply.status(201).send({
      message: 'User created successfully'
    });
  } catch (error) {
    // Handle known errors
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: error.format()
      });
    }

    if (error instanceof Error && error.message === 'E-mail already exists.') {
      return reply.status(409).send({
        message: 'E-mail already exists.'
      });
    }

    // Handle unexpected errors
    console.error('Registration error:', error);
    return reply.status(500).send({
      message: 'Internal server error'
    });
  }
}
