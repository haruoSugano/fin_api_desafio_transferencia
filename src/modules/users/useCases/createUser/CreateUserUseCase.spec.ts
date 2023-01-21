import { AppError } from "../../../../shared/errors/AppError";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it ("should be able to create a new user", async () => {
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

        const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

        expect(userCreated).toHaveProperty("id");
    });

    it("should not be able to create a new user with email exists", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                email: "test@example.com",
                name: "test",
                password: "123456"
            });

            await createUserUseCase.execute({
                email: "test@example.com",
                name: "test",
                password: "123456"
            });
        }).rejects.toBeInstanceOf(AppError);
    })
});
