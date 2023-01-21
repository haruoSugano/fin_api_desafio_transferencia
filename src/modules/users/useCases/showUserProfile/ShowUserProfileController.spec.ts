import request from "supertest";

import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Show User Profile Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app).post("/api/v1/users").send({
      email: "testB@example.com",
      name: "UserC Teste",
      password: "123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testB@example.com",
      password: "123456"
    });

    const token = await responseToken.body.token;
    const user = await responseToken.body.user;

    const profile = await request(app).get("/api/v1/profile").send({
      id: user.id as string
    }).set({
      Authorization: "Bearer " + token
    });

    expect(user.id).toEqual(profile.body.id);
  });
})
