import { prisma } from "@/lib/prisma";
import type { Prisma } from "generated/prisma";


export class PrismaUsersRepository {
    async create(data: Prisma.UserCreateInput) {
        await prisma.user.create({
        data,
        });
    }
    
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
        where: {
            email,
        },
        });
    
        return user;
    }
}