import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be able to show user profile", async () => {
        const user: ICreateUserDTO = {
            email: "test@example.com",
            name: "test",
            password: "123456"
        };

        const createUser = await createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
        });

        const userAuthenticated = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        const userProfile = await showUserProfileUseCase.execute(userAuthenticated.user.id as string);

        expect(userProfile).toEqual(createUser);
    });

    it("should be able to show user profile", async () => {
        expect(async () => {
            const user_id = "123456"
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

            await authenticateUserUseCase.execute({
                email: user.email,
                password: user.password
            });

            await showUserProfileUseCase.execute(user_id);
        }).rejects.toBeInstanceOf(AppError);
    });
})
