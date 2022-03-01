import { createTestServer } from "./fixtures";

test(`createPlugin`, async () => {
  const f = createTestServer();

  const spec = await f
    .inject({
      method: `get`,
      url: `/openapi/json`,
    })
    .then((res) => res.json());

  expect(spec).toEqual({
    openapi: `3.0.3`,
    info: {
      title: `Zod Fastify Test Server`,
      description: `API for Zod Fastify Test Server`,
      version: `0.0.0`,
    },
    components: {
      schemas: {
        "test-schema_TodoItemId_properties_id": {
          type: `string`,
          format: `uuid`,
        },
        "test-schema_TodoItemId": {
          type: `object`,
          properties: {
            id: {
              type: `string`,
              format: `uuid`,
            },
          },
          required: [`id`],
          additionalProperties: false,
        },
        "test-schema_TodoState": {
          type: `string`,
          enum: [`todo`, `in progress`, `done`],
        },
        "test-schema_TodoItem": {
          type: `object`,
          properties: {
            id: {
              type: `string`,
              format: `uuid`,
            },
            label: {
              type: `string`,
            },
            dueDate: {
              type: `string`,
              format: `date-time`,
            },
            state: {
              type: `string`,
              enum: [`todo`, `in progress`, `done`],
            },
          },
          required: [`id`, `label`, `state`],
          additionalProperties: false,
        },
        "test-schema_TodoItems": {
          type: `object`,
          properties: {
            todoItems: {
              type: `array`,
              items: {
                $ref: `#/components/schemas/test-schema_TodoItem`,
              },
            },
          },
          required: [`todoItems`],
          additionalProperties: false,
        },
        "test-schema_TodoItemsGroupedByStatus": {
          type: `object`,
          properties: {
            todo: {
              type: `array`,
              items: {
                $ref: `#/components/schemas/test-schema_TodoItem`,
              },
            },
            inProgress: {
              type: `array`,
              items: {
                $ref: `#/components/schemas/test-schema_TodoItem`,
              },
            },
            done: {
              type: `array`,
              items: {
                $ref: `#/components/schemas/test-schema_TodoItem`,
              },
            },
          },
          required: [`todo`, `inProgress`, `done`],
          additionalProperties: false,
        },
      },
    },
    paths: {
      "/item": {
        delete: {
          operationId: `getTodoItems`,
          responses: {
            "200": {
              description: `The list of Todo Items`,
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/test-schema_TodoItems`,
                    description: `The list of Todo Items`,
                  },
                },
              },
            },
          },
        },
        post: {
          operationId: `postTodoItem`,
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/test-schema_TodoItem`,
                },
              },
            },
          },
          responses: {
            "200": {
              description: `Default Response`,
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/test-schema_TodoItems`,
                  },
                },
              },
            },
          },
        },
      },
      "/item/grouped-by-status": {
        delete: {
          operationId: `getTodoItemsGroupedByStatus`,
          responses: {
            "200": {
              description: `Default Response`,
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/test-schema_TodoItemsGroupedByStatus`,
                  },
                },
              },
            },
          },
        },
      },
      "/item/{id}": {
        put: {
          operationId: `putTodoItem`,
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/test-schema_TodoItem`,
                },
              },
            },
          },
          parameters: [
            {
              in: `path`,
              name: `id`,
              required: true,
              schema: {
                type: `string`,
                format: `uuid`,
              },
            },
          ],
          responses: {
            "200": {
              description: `Default Response`,
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/test-schema_TodoItem`,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
});