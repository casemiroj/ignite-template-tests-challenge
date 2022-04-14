import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to create a new user', async () => {
    const user = {
      name: 'João Casemiro',
      email: 'joao@email.com',
      password: 'senha123'
    }

    const userCreated = await createUserUseCase.execute(user)

    expect(userCreated).toHaveProperty('id')
  })

  it('should not be able to create a new user if email already exists', () => {
    expect(async () => {
      const user = {
        name: 'João Casemiro',
        email: 'joao@email.com',
        password: 'senha123'
      }

      const user2 = {
        name: 'João Casemiro',
        email: 'joao@email.com',
        password: 'senha123'
      }

      await createUserUseCase.execute(user)
      await createUserUseCase.execute(user2)
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
