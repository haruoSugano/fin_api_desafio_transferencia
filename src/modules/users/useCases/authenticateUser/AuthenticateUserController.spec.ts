import request from "supertest";

import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Authenticate User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate the user", async () => {
    await request(app).post("/api/v1/users").send({
      email: "testA@example.com",
      name: "UserB Teste",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testA@example.com",
      password: "123456"
    });

    expect(responseToken.body).toHaveProperty("token");
    expect(responseToken.body).toHaveProperty("user");
  });
})
