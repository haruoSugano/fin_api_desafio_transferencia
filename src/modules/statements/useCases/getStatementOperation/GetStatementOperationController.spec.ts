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

  it("should be able to get statement operation DEPOSIT", async () => {
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

  it("should be able to get statement operation TRANSFER", async () => {
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

    const token = await responseToken.body.token;
    const user_id = await responseToken.body.user.id;

    const user_idB = await responseTokenB.body.user.id;

    await request(app).post("/api/v1/statements/deposit").send({
      id: user_id,
      amount: 500,
      description: "test de integracao deposito"
    }).set({
      Authorization: "Bearer " + token
    });

    const createTransfer = await request(app).post(`/api/v1/statements/transfer/${user_idB}`).send({
      id: user_id,
      amount: 100,
      description: "test de integracao transferencia"
    }).set({
      Authorization: "Bearer " + token
    });

    const getStatementTransfer = await request(app).get(`/api/v1/statements/${createTransfer.body.id}`).send({
      user_id: user_id as string,
    }).set({
      Authorization: "Bearer " + token
    });

    expect(getStatementTransfer.body.type).toEqual("transfer");
  });
})
