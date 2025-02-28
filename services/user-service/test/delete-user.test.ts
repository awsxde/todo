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

describe('/api', () => {
  describe('DELETE /user', () => {
    test('When deleting an existing user, Then it should NOT be retrievable', async () => {
      // Arrange
      const userToAdd = {
        email: 'test1@gmail.com',
        password: 'StrongPass123!',
      };

      // Act
      const receivedAPIResponse = await axiosAPIClient.post('/user', userToAdd);
      const user = receivedAPIResponse.data;

      // Act
      await axiosAPIClient.delete(`/user/${user.id}`);

      // Assert
      const aQueryForDeletedUser = await axiosAPIClient.get(`/user/${user.id}`);
      expect(aQueryForDeletedUser.status).toBe(404);
    });
  });
});

export {};
