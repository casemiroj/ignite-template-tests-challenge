import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from 'uuid'
import { hash } from "bcryptjs";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("ShowUserProfileController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid()
    const password = await hash("1234", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'casemiro', 'casemiro123@finapi.com.br', '${password}', 'now()', 'now()')`
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show an user profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions/").send({
      email: 'casemiro123@finapi.com.br',
      password: '1234',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile/")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("casemiro");
      expect(response.body.email).toBe("casemiro123@finapi.com.br");
  });
});
