import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma"; 

// Create a Prisma client instance


export const app = fastify();

app.post('/users', async (req, res) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  
  const { name, email, password } = registerBodySchema.parse(req.body);
  
  // Use the prisma instance to access the user model
  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    }
  });
  
  // Add a response to the client
  return res.status(201).send({
    message: 'User created successfully'
  });
});
