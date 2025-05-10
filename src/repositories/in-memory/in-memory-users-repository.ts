import type { UsersRepository } from '../prisma/users-repository'
import type { User, Prisma } from 'generated/prisma'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)
    return user || null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(), // Use proper UUID instead of hardcoded string
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.items.push(user)
    return user
  }
}