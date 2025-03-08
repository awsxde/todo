import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';
import { startWebServer, stopWebServer } from '../entry-points/api/server';
import * as testHelpers from './test-helpers';

// Configuring file-level HTTP client with base URL will allow
// all the tests to approach with a shortened syntax
let axiosAPIClient;

beforeAll(async () => {
  process.env.JWT_TOKEN_SECRET = testHelpers.exampleSecret;
  // ️️️✅ Best Practice: Place the backend under test within the same process
  const apiConnection = await startWebServer();

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      // ️️️✅ Best Practice: Test like production, include real token to stretch the real authentication mechanism
      authorization: testHelpers.signValidTokenWithDefaultUser(),
    },
  };
  axiosAPIClient = axios.create(axiosConfig);

  // ️️️✅ Best Practice: Ensure that this component is isolated by preventing unknown calls
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(() => {
  // ️️️✅ Best Practice: Start each test with a clean slate
  nock.cleanAll();
  sinon.restore();
});

afterAll(async () => {
  nock.enableNetConnect();
  stopWebServer();
});

// ️️️✅ Best Practice: Structure tests by routes and stories
describe('/api', () => {
  describe('POST /todo', () => {
    // ️️️✅ Best Practice: Check the response
    test('When adding a new valid todo, Then should get back approval with 200 response', async () => {
      // Arrange
      const todoToAdd = {
        userId: 1,
        title: testHelpers.generateText(),
        status: 'pending',
      };

      // Act
      const { status } = await axiosAPIClient.post('/todo', todoToAdd);

      // Assert
      expect(status).toBe(200);
    });

    // ️️️✅ Best Practice: Check the new state
    // In a real-world project, this test can be combined with the previous test
    test('When adding a new valid todo, Then should be able to retrieve it', async () => {
      // Arrange
      const todoToAdd = {
        userId: 1,
        title: testHelpers.generateText(),
        status: 'pending',
      };

      // Act
      const {
        data: { id: addedTodoId },
      } = await axiosAPIClient.post('/todo', todoToAdd);

      // Assert
      const { data, status } = await axiosAPIClient.get(`/todo/${addedTodoId}`);

      expect({
        data,
        status,
      }).toMatchObject({
        status: 200,
        data: todoToAdd,
      });
    });

    test.todo('When todo exist, throw error on adding');
  });
});

export {};
