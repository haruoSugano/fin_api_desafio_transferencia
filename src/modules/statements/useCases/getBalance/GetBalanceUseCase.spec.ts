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
}

describe("List balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to show the total account balance", async () => {
        const user = {
            email: "test@example.com",
            name: "test",
            password: "123456"
        };

        await createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
        });

        iAuthenticateUserResponseDTO = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        const user_id = iAuthenticateUserResponseDTO.user.id as string

        await inMemoryStatementsRepository.create({
            user_id: user_id,
            type: "deposit" as OperationType,
            amount: 10000,
            description: "teste teste"
        });

        await inMemoryStatementsRepository.create({
            user_id: user_id,
            type: "withdraw" as OperationType,
            amount: 5000,
            description: "teste teste"
        });

        const balance = await inMemoryStatementsRepository.getUserBalance({ user_id: user_id });

        expect(balance.balance).toEqual(5000);
    });

    it("should be able to list operations", async () => {
        const user = {
            email: "test@example.com",
            name: "test",
            password: "123456"
        };

        await createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
        });

        iAuthenticateUserResponseDTO = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        const user_id = iAuthenticateUserResponseDTO.user.id as string

        const createOperation01 = await inMemoryStatementsRepository.create({
            user_id: user_id,
            type: "deposit" as OperationType,
            amount: 10000,
            description: "teste teste"
        });

        const createOperation02 = await inMemoryStatementsRepository.create({
            user_id: user_id,
            type: "withdraw" as OperationType,
            amount: 5000,
            description: "teste teste"
        });

        const deposit = await inMemoryStatementsRepository.findStatementOperation({
            user_id: user_id,
            statement_id: createOperation01.id as string
        });

        const withdraw = await inMemoryStatementsRepository.findStatementOperation({
            user_id: user_id,
            statement_id: createOperation02.id as string
        });

        expect(createOperation01).toEqual(deposit);
        expect(createOperation02).toEqual(withdraw);
    })
})
