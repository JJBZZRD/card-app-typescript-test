import { server } from "../src/server"
import Prisma from "../src/db";

describe("server test", () => {
  it("should assert 1 + 1 is 2", () => {
    expect(1 + 1).toEqual(2);
  });

  describe("GET /get", () => {
    it("should return array of all entries", () => {})
    it("should return error if fetching fails", () => {})
  });

  describe("GET /get/:id", () => {
    it("should return single entry by id", () => {})
    it("should return error when entry is not found", () => {})
  });

  describe("POST /create", () => {
    it("should create a new entry", () => {})
    it("should assign current date to created_at if not provided", () => {})
    it("should convert scheduled_date to date if provided", () => {})
    it("should return error if entry not created", () => {})
  });

  describe("PUT /update/:id", () => {
    it("should update an entry", () => {})
    it("should convert scheduled_date to date if provided", () => {})
    it("should assign current date to created_at if not provided", () => {})
    it("should return error if entry not updated", () => {})
  });
  
  describe("DELETE /delete/:id", () => {
    it("should delete an entry", () => {})
    it("should return error if entry not deleted", () => {})
  });
  
  
});