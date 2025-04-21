import fastify from "fastify";
import { PrismaClient } from "@prisma/client";


export const app = fastify()

const prisma = new PrismaClient()

prisma.User.create({
    data: {
        id: "1",
        name: "John Doe",
        email: "exaple@example.com"
    }
})
