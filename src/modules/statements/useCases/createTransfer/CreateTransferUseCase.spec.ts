import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { IAuthenticateUserResponseDTO } from "../../../users/useCases/authenticateUser/IAuthenticateUserResponseDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let iAuthenticateUserResponseDTO: IAuthenticateUserResponseDTO;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

describe("Create Transfer", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show the amount transfer", async () => {
    const userA = {
      email: "test_a@example.com",
      name: "test_A",
      password: "123456"
    };

    const userB = {
      email: "test_b@example.com",
      name: "test_B",
      password: "123456"
    };

    await createUserUseCase.execute({
      email: userA.email,
      name: userA.name,
      password: userA.password
    });

    const createUserB = await createUserUseCase.execute({
      email: userB.email,
      name: userB.name,
      password: userB.password
    });

    iAuthenticateUserResponseDTO = await authenticateUserUseCase.execute({
      email: userA.email,
      password: userA.password
    });

    const user_id = iAuthenticateUserResponseDTO.user.id as string;
    const userB_id = createUserB.id;

    await inMemoryStatementsRepository.create({
      user_id: user_id,
      type: "deposit" as OperationType,
      amount: 10000,
      description: "teste teste",
      sender_id: null,
      receive_id: null
    });

    await inMemoryStatementsRepository.create({
      user_id: userB_id as string,
      type: "deposit" as OperationType,
      amount: 1000,
      description: "teste teste",
      sender_id: null,
      receive_id: null
    });

    const transfer = await inMemoryStatementsRepository.create({
      user_id: user_id,
      type: "transfer" as OperationType,
      amount: 4000,
      description: "teste teste",
      sender_id: createUserB.id as string,
      receive_id: null
    });

    //received
    await inMemoryStatementsRepository.create({
      user_id: transfer.sender_id as string,
      type: "transfer" as OperationType,
      amount: transfer.amount,
      description: transfer.description,
      receive_id: transfer.user_id,
      sender_id: null
    });

    const balanceUserA = await inMemoryStatementsRepository.getUserBalance({ user_id });
    const balanceUserB = await inMemoryStatementsRepository.getUserBalance({ user_id: userB_id as string });

    expect(balanceUserA.balance).toEqual(6000);
    expect(balanceUserB.balance).toEqual(5000);
  });
})
