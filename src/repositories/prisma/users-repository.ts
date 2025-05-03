import type { Prisma, User } from 'generated/prisma';

export interface UsersRepository {
    create(data: Prisma.UserCreateInput) : Promise<User>;
    findByEmail(email: string): Promise<Prisma.UserCreateInput | null>;
}
