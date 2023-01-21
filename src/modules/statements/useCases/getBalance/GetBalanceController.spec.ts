import request from "supertest";

import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Get Balance Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get total balance", async () => {
    await request(app).post("/api/v1/users").send({
      email: "test@example.com",
      name: "User Teste",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "123456"
    });

    const token = await "Bearer " + responseToken.body.token;
    const user_id = await responseToken.body.user.id;

    await request(app).post("/api/v1/statements/deposit").send({
      id: user_id,
      amount: 100,
      description: "test de integracaoA"
    }).set({
      Authorization: token
    });

    await request(app).post("/api/v1/statements/withdraw").send({
      id: user_id,
      amount: 50,
      description: "test de integracaoC"
    }).set({
      Authorization: token
    });

    const getBalance = await request(app).get(`/api/v1/statements/balance`).send({
      user_id: user_id,
    }).set({
      Authorization: token
    });

    const balances = getBalance.body;

    expect(balances.statement.length).toEqual(2);
    expect(balances.balance).toEqual(50);
    expect(getBalance.status).toBe(200);
  });
})
