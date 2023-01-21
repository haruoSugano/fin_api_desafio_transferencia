import request from "supertest";

import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Get Statement Operation Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement operation", async () => {
    await request(app).post("/api/v1/users").send({
      email: "test@example.com",
      name: "User Teste",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "123456"
    });

    const token = await responseToken.body.token;
    const user_id = await responseToken.body.user.id;

    const createDepositA = await request(app).post("/api/v1/statements/deposit").send({
      id: user_id,
      amount: 100.00,
      description: "test de integracao"
    }).set({
      Authorization: "Bearer " + token
    });

    await request(app).post("/api/v1/statements/deposit").send({
      id: user_id,
      amount: 100.00,
      description: "test de integracao"
    }).set({
      Authorization: "Bearer " + token
    });

    await request(app).post("/api/v1/statements/withdraw").send({
      id: user_id,
      amount: 50.00,
      description: "test de integracao"
    }).set({
      Authorization: "Bearer " + token
    });

    const depositA = createDepositA.body;

    const getStatementDepositA = await request(app).get(`/api/v1/statements/${depositA.id}`).send({
      user_id: user_id as string,
    }).set({
      Authorization: "Bearer " + token
    });

    expect(getStatementDepositA.body.type).toEqual("deposit");
  });
})
