import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            email: "test@example.com",
            name: "test",
            password: "123456"
        };

        await createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
        });

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate an nonexistent user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@gmail.com",
                password: "123456"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate an nonexistent password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "user@test.com",
                password: "1234",
                name: "User Test Error"
            };

            await createUserUseCase.execute({
                email: user.email,
                name: user.name,
                password: user.password
            });

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "654321"
            });
        }).rejects.toBeInstanceOf(AppError);
    });
})
