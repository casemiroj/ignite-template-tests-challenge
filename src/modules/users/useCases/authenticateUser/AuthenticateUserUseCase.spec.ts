import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository


describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to authenticate an user', async () => {
    const user = {
      name: 'João Casemiro',
      email: 'joao@email.com',
      password: 'senha123'
    }

    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticatedUser).toHaveProperty('token')
  })

  it('should not be able to authenticate an user when user not exists', () => {
    expect(async () => {
      const user = {
        name: 'João Casemiro',
        email: 'joao@email.com',
        password: 'senha123'
      }

      const authenticatedUser = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
