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

  nock('http://localhost/user/').get(`/1`).reply(200, {
    id: 1,
    name: 'John',
    terms: 45,
  });
});

afterAll(async () => {
  nock.enableNetConnect();
  stopWebServer();
});

// ️️️✅ Best Practice: Structure tests by routes and stories
describe('/api', () => {
  describe('GET /user', () => {
    test('When asked for an existing user, Then should retrieve it and receive 200 response', async () => {
      // Arrange
      const userToAdd = {
        email: 'test1@gmail.com',
        password: 'StrongPass123!',
      };

      const {
        data: { id: addedUserId },
      } = await axiosAPIClient.post(`/user`, userToAdd);

      // Act
      // ️️️✅ Best Practice: Use generic and reputable HTTP client like Axios or Fetch. Avoid libraries that are coupled to
      // the web framework or include custom assertion syntax (e.g. Supertest)
      const getResponse = await axiosAPIClient.get(`/user/${addedUserId}`);

      // Assert
      expect(getResponse).toMatchObject({
        status: 200,
        data: {
          ...userToAdd,
        },
      });
    });

    test('When asked for an non-existing user, Then should receive 404 response', async () => {
      // Arrange
      const nonExistingUserId = -1;

      // Act
      const getResponse = await axiosAPIClient.get(
        `/user/${nonExistingUserId}`
      );

      // Assert
      expect(getResponse.status).toBe(404);
    });
  });
});

export {};
