import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { createAdoptionRouter } from "../src/routes/adoption.router.js";

const createMockService = (overrides = {}) => ({
  getAll: async () => [
    { id: "1", petId: "pet-1", adopterId: "user-1", status: "pending" }
  ],
  getById: async (id) =>
    id === "1" ? { id: "1", petId: "pet-1", adopterId: "user-1", status: "pending" } : null,
  create: async (payload) => ({ id: "2", status: "pending", ...payload }),
  updateStatus: async (id, status) =>
    id === "1" ? { id: "1", petId: "pet-1", adopterId: "user-1", status } : null,
  delete: async (id) =>
    id === "1" ? { id: "1", petId: "pet-1", adopterId: "user-1", status: "pending" } : null,
  ...overrides
});

const createTestServer = (service = createMockService()) => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/adoptions", createAdoptionRouter({ service }));
  app.use((err, req, res, next) => {
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  });

  return app.listen(0);
};

const request = async (server, path, options = {}) => {
  const url = `http://127.0.0.1:${server.address().port}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  return {
    status: response.status,
    body: await response.json()
  };
};

test("GET /api/v1/adoptions devuelve todas las adopciones", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions");
    assert.equal(response.status, 200);
    assert.equal(response.body.status, "success");
    assert.equal(response.body.payload.length, 1);
  } finally {
    server.close();
  }
});

test("GET /api/v1/adoptions/:aid devuelve una adopción existente", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/1");
    assert.equal(response.status, 200);
    assert.equal(response.body.payload.id, "1");
  } finally {
    server.close();
  }
});

test("GET /api/v1/adoptions/:aid devuelve 404 si no existe", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/999");
    assert.equal(response.status, 404);
    assert.equal(response.body.status, "error");
  } finally {
    server.close();
  }
});

test("POST /api/v1/adoptions crea una adopción válida", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions", {
      method: "POST",
      body: { petId: "pet-2", adopterId: "user-2", notes: "Adopción responsable" }
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.payload.petId, "pet-2");
    assert.equal(response.body.payload.status, "pending");
  } finally {
    server.close();
  }
});

test("POST /api/v1/adoptions valida campos obligatorios", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions", {
      method: "POST",
      body: { adopterId: "user-2" }
    });

    assert.equal(response.status, 400);
    assert.match(response.body.error, /petId/);
  } finally {
    server.close();
  }
});

test("POST /api/v1/adoptions rechaza status inválido", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions", {
      method: "POST",
      body: { petId: "pet-2", adopterId: "user-2", status: "invalid" }
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "status inválido");
  } finally {
    server.close();
  }
});

test("PUT /api/v1/adoptions/:aid/status actualiza estado", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/1/status", {
      method: "PUT",
      body: { status: "approved" }
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.payload.status, "approved");
  } finally {
    server.close();
  }
});

test("PUT /api/v1/adoptions/:aid/status valida status", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/1/status", {
      method: "PUT",
      body: { status: "done" }
    });

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});

test("PUT /api/v1/adoptions/:aid/status devuelve 404 si no existe", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/999/status", {
      method: "PUT",
      body: { status: "approved" }
    });

    assert.equal(response.status, 404);
  } finally {
    server.close();
  }
});

test("DELETE /api/v1/adoptions/:aid elimina una adopción", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/1", { method: "DELETE" });
    assert.equal(response.status, 200);
    assert.equal(response.body.payload.id, "1");
  } finally {
    server.close();
  }
});

test("DELETE /api/v1/adoptions/:aid devuelve 404 si no existe", async () => {
  const server = createTestServer();
  try {
    const response = await request(server, "/api/v1/adoptions/999", { method: "DELETE" });
    assert.equal(response.status, 404);
  } finally {
    server.close();
  }
});

test("router maneja errores internos del service fake", async () => {
  const server = createTestServer(createMockService({ getAll: async () => { throw new Error("DB down"); } }));
  try {
    const response = await request(server, "/api/v1/adoptions");
    assert.equal(response.status, 500);
    assert.equal(response.body.status, "error");
  } finally {
    server.close();
  }
});
