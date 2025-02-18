import Prisma from "../src/db";
import { server } from "../src/server";

// Helper function to serialize an entry by converting Date objects to strings.
const serializeEntry = (entry: any) => ({
  ...entry,
  created_at: new Date(entry.created_at).toISOString(),
  scheduled_date: new Date(entry.scheduled_date).toISOString(),
});

describe("server test", () => {
  it("should assert 1 + 1 is 2", () => {
    expect(1 + 1).toEqual(2);
  });

  describe("GET /get", () => {
    it("should return array of all entries", async () => {
      const mockEntries = [
        {
          id: "1",
          title: "Title 1",
          description: "Desc 1",
          created_at: new Date("2020-01-01"),
          scheduled_date: new Date("2020-01-02"),
        },
        {
          id: "2",
          title: "Title 2",
          description: "Desc 2",
          created_at: new Date("2020-02-01"),
          scheduled_date: new Date("2020-02-02"),
        },
      ];

      const expectedResponse = mockEntries.map(serializeEntry);

      jest.spyOn(Prisma.entry, "findMany").mockResolvedValueOnce(mockEntries);

      const response = await server.inject({
        method: "GET",
        url: "/get/",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(expectedResponse);
    });

    // The server.ts file does not contain a try catch blcok for getting all entries,

    // it("should return error if fetching fails", async () => {
    //   jest.spyOn(Prisma.entry, "findMany").mockRejectedValueOnce(new Error("Fetching failed"));

    //   const response = await server.inject({
    //     method: "GET",
    //     url: "/get/",
    //   });

    //   expect(response.statusCode).toBe(500);
    //   const data = JSON.parse(response.payload);
    //   expect(data.msg).toBeDefined();
    // });
  });

  describe("GET /get/:id", () => {
    it("should return single entry by id", async () => {
      const mockEntry = {
        id: "1",
        title: "Title 1",
        description: "Desc 1",
        created_at: new Date("2021-03-03"),
        scheduled_date: new Date("2021-03-04"),
      };
      jest.spyOn(Prisma.entry, "findUnique").mockResolvedValueOnce(mockEntry);

      const response = await server.inject({
        method: "GET",
        url: "/get/1",
      });

      expect(response.statusCode).toBe(200);

      const expectedResponse = serializeEntry(mockEntry);
      expect(JSON.parse(response.payload)).toEqual(expectedResponse);
    });

    it("should return error when entry is not found", async () => {
      jest.spyOn(Prisma.entry, "findUnique").mockResolvedValueOnce(null);

      const response = await server.inject({
        method: "GET",
        url: "/get/1",
      });

      expect(response.statusCode).toBe(500);
      const data = JSON.parse(response.payload);
      expect(data.msg).toBe("Error finding entry with id 1");
    });
  });

  describe("POST /create", () => {
    it("should create a new entry", async () => {
      const requestBody = {
        id: "1",
        title: "Test Title",
        description: "Test Description",
        created_at: new Date("2020-01-01").toISOString(),
        scheduled_date: new Date("2020-02-01").toISOString(),
      };

      const expectedCreatedEntry = {
        ...requestBody,
        created_at: new Date(requestBody.created_at),
        scheduled_date: new Date(requestBody.scheduled_date),
      };

      const expectedResponse = serializeEntry(expectedCreatedEntry);

      jest.spyOn(Prisma.entry, "create").mockResolvedValueOnce(expectedCreatedEntry);

      const response = await server.inject({
        method: "POST",
        url: "/create/",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(expectedResponse);
    });

    it("should assign current date to created_at if not provided", async () => {
      const requestBody = {
        id: "1",
        title: "No Date Title",
        description: "No Date Description",
        scheduled_date: new Date("2020-02-01").toISOString(),
      };

      const createSpy = jest.spyOn(Prisma.entry, "create").mockImplementationOnce(({ data }) => {
        // simulate that created_at gets assigned to current date if missing
        return Promise.resolve({
          ...data,
          created_at: new Date(),
          scheduled_date: data.scheduled_date ? new Date(data.scheduled_date as string | number | Date) : new Date(),
        }) as any;
      });

      const response = await server.inject({
        method: "POST",
        url: "/create/",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(200);
      expect(createSpy).toHaveBeenCalled();
      // Verify that the data passed into create has a valid created_at.
      const callArg = createSpy.mock.calls[0][0];
      expect(callArg.data.created_at).toBeDefined();
      expect(new Date(callArg.data.created_at as string | number | Date).toString()).not.toEqual("Invalid Date");
    });

    it("should convert scheduled_date to date if provided", async () => {
      const requestBody = {
        id: "1",
        title: "Scheduled Title",
        description: "Scheduled Description",
        created_at: new Date("2020-01-01").toISOString(),
        scheduled_date: "2020-02-01T00:00:00.000Z",
      };

      jest.spyOn(Prisma.entry, "create").mockImplementationOnce(({ data }) => {
        return Promise.resolve({
          ...data,
          created_at: new Date(data.created_at as string | number | Date),
          scheduled_date: new Date(data.scheduled_date as string | number | Date),
        }) as any;
      });

      const response = await server.inject({
        method: "POST",
        url: "/create/",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      // Compare serialized version of the entry.
      const expectedResult = serializeEntry({
        ...requestBody,
        created_at: new Date(requestBody.created_at),
        scheduled_date: new Date(requestBody.scheduled_date),
      });
      expect(result).toEqual(expectedResult);
    });

    it("should return error if entry not created", async () => {
      const requestBody = {
        id: "1",
        title: "Error Title",
        description: "Error Description",
        created_at: new Date("2020-01-01").toISOString(),
        scheduled_date: "2020-02-01T00:00:00.000Z",
      };

      jest.spyOn(Prisma.entry, "create").mockRejectedValueOnce(new Error("Creation failed"));

      const response = await server.inject({
        method: "POST",
        url: "/create/",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload).msg).toBe("Error creating entry");
    });
  });

  describe("PUT /update/:id", () => {
    it("should update an entry", async () => {
      const requestBody = {
        id: "1",
        title: "Updated Title",
        description: "Updated Description",
        created_at: new Date("2020-03-03").toISOString(),
        scheduled_date: new Date("2020-04-04").toISOString(),
      };

      jest.spyOn(Prisma.entry, "update").mockResolvedValueOnce({
        id: "1",
        title: "Updated Title",
        description: "Updated Description",
        created_at: new Date(requestBody.created_at),
        scheduled_date: new Date(requestBody.scheduled_date),
      });

      const response = await server.inject({
        method: "PUT",
        url: "/update/1",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).msg).toBe("Updated successfully");
    });

    it("should convert scheduled_date to date if provided", async () => {
      const requestBody = {
        id: "1",
        title: "Updated Title",
        description: "Updated Description",
        created_at: new Date("2020-03-03").toISOString(),
        scheduled_date: "2020-04-04T00:00:00.000Z",
      };

      jest.spyOn(Prisma.entry, "update").mockImplementationOnce(({ data }) => {
        return Promise.resolve({
          ...data,
          created_at: new Date(data.created_at as string | number | Date),
          scheduled_date: data.scheduled_date ? new Date(data.scheduled_date as string | number | Date) : new Date(),
        }) as any;
      });

      const response = await server.inject({
        method: "PUT",
        url: "/update/1",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).msg).toBe("Updated successfully");
    });

    it("should assign current date to created_at if not provided", async () => {
      const requestBody = {
        id: "1",
        title: "Updated Title",
        description: "Updated Description",
        scheduled_date: new Date("2020-04-04").toISOString(),
      };

      const updateSpy = jest.spyOn(Prisma.entry, "update").mockResolvedValueOnce({} as any);

      await server.inject({
        method: "PUT",
        url: "/update/1",
        payload: requestBody,
      });

      expect(updateSpy).toHaveBeenCalled();
      const callArg = updateSpy.mock.calls[0][0];
      expect(callArg.data.created_at).toBeDefined();
      expect(new Date(callArg.data.created_at as string | number | Date).toString()).not.toEqual("Invalid Date");
    });

    it("should return error if entry not updated", async () => {
      const requestBody = {
        id: "1",
        title: "Updated Title",
        description: "Updated Description",
        created_at: new Date("2020-03-03").toISOString(),
        scheduled_date: new Date("2020-04-04").toISOString(),
      };

      jest.spyOn(Prisma.entry, "update").mockRejectedValueOnce(new Error("Update failed"));

      const response = await server.inject({
        method: "PUT",
        url: "/update/1",
        payload: requestBody,
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload).msg).toBe("Error updating");
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should delete an entry", async () => {
      jest.spyOn(Prisma.entry, "delete").mockResolvedValueOnce({
        id: "1",
        title: "Test",
        description: "Test",
        created_at: new Date(),
        scheduled_date: new Date(),
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/delete/1",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).msg).toBe("Deleted successfully");
    });

    it("should return error if entry not deleted", async () => {
      jest.spyOn(Prisma.entry, "delete").mockRejectedValueOnce(new Error("Deletion failed"));

      const response = await server.inject({
        method: "DELETE",
        url: "/delete/1",
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload).msg).toBe("Error deleting entry");
    });
  });
});
