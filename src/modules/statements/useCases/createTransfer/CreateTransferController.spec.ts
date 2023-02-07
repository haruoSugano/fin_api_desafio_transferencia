import request from "supertest";

import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Create Transfer Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create statement transfer", async () => {
    await request(app).post("/api/v1/users").send({
      email: "test@example.com",
      name: "User Teste",
      password: "123456"
    });

    await request(app).post("/api/v1/users").send({
      email: "testB@example.com",
      name: "User B",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "123456"
    });

    const responseTokenB = await request(app).post("/api/v1/sessions").send({
      email: "testB@example.com",
      password: "123456"
    });

    const token = "Bearer " + responseToken.body.token;
    const user_id = await responseToken.body.user.id;

    const user_idB = await responseTokenB.body.user.id;

    await request(app).post(`/api/v1/statements/deposit`).send({
      id: user_id,
      amount: 500,
      description: "test de integracaoA deposit",
    }).set({
      Authorization: token
    });

    const createTransfer = await request(app).post(`/api/v1/statements/transfer/${user_idB}`).send({
      id: user_id,
      amount: 100,
      description: "test de integracaoA"
    }).set({
      Authorization: token
    });

    expect(createTransfer.status).toBe(201);
  });
})
