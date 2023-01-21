import request from "supertest";

import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Create Statement Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create statement deposit", async () => {
    await request(app).post("/api/v1/users").send({
      email: "test@example.com",
      name: "User Teste",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "123456"
    });

    const token = "Bearer " + responseToken.body.token;
    const user_id = await responseToken.body.user.id;

    const createDoposit = await request(app).post("/api/v1/statements/deposit").send({
      id: user_id,
      amount: 100,
      description: "test de integracaoA"
    }).set({
      Authorization: token
    });

    expect(createDoposit.status).toBe(201);
  });

  it("should be able to create statement withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      email: "test@example.com",
      name: "User Teste",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "123456"
    });

    const token = "Bearer " + responseToken.body.token;
    const user_id = await responseToken.body.user.id;

    const createDoposit = await request(app).post("/api/v1/statements/deposit").send({
      id: user_id,
      amount: 100,
      description: "test de integracaoA"
    }).set({
      Authorization: token
    });

    const createWithdraw = await request(app).post("/api/v1/statements/withdraw").send({
      id: user_id,
      amount: 50,
      description: "test de integracaoA"
    }).set({
      Authorization: token
    });

    expect(createDoposit.status).toBe(201);
  });
})
