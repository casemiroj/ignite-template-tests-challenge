import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from 'uuid'
import { hash } from "bcryptjs";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("AuthenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid()
    const password = await hash("1234", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'casemiro', 'casemiro@finapi.com.br', '${password}', 'now()', 'now()')`
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions/").send({
      email: 'casemiro@finapi.com.br',
      password: '1234',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token')
  });
});
