import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  })

  it('should be able to show an user by id', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'João Casemiro',
      email: 'joao@email.com',
      password: 'senha123'
    })

    if(user.id != undefined) {
      const userProfile = await showUserProfileUseCase.execute(user.id)

      expect(userProfile.name).toEqual(user.name)
      expect(userProfile.email).toEqual(user.email)
    }
  })

  it('should return an error when user does not exists', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('123456')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
