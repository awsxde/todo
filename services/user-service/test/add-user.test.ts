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
  describe('POST /user', () => {
    // ️️️✅ Best Practice: Check the response
    test('When adding a new valid user, Then should get back approval with 200 response', async () => {
      // Arrange
      const userToAdd = {
        email: testHelpers.generateValidEmail(),
        password: 'StrongPass123!',
      };

      // Act
      const receivedAPIResponse = await axiosAPIClient.post('/user', userToAdd);

      // Assert
      expect(receivedAPIResponse).toMatchObject({
        data: {
          id: expect.any(Number),
        },
      });
    });

    // ️️️✅ Best Practice: Check the new state
    // In a real-world project, this test can be combined with the previous test
    test('When adding a new valid user, Then should be able to retrieve it', async () => {
      // Arrange
      const userToAdd = {
        email: testHelpers.generateValidEmail(),
        password: 'StrongPass123!',
      };

      // Act
      const {
        data: { id: addedUserId },
      } = await axiosAPIClient.post('/user', userToAdd);

      // Assert
      const { data, status } = await axiosAPIClient.get(`/user/${addedUserId}`);

      expect({
        data: { email: data.email }, // Only check email, not password
        status,
      }).toMatchObject({
        status: 200,
        data: {
          email: userToAdd.email, // Compare only the email
        },
      });
    });

    test('When user exist, throw error on sign up', async () => {
      // Arrange
      const userToAdd = {
        email: testHelpers.generateValidEmail(),
        password: 'StrongPass123!',
      };

      // Act
      await axiosAPIClient.post('/user', userToAdd);
      const receivedAPIResponse = await axiosAPIClient.post('/user', userToAdd);

      // Assert
      expect(receivedAPIResponse.status).toBe(400);
    });

    describe('Password Validation', () => {
      test('should return 200 when user password meets strong password requirements', async () => {
        // Arrange
        const userToAdd = {
          email: testHelpers.generateValidEmail(),
          password: 'StrongPass123!',
        };

        // Act
        const receivedAPIResponse = await axiosAPIClient.post(
          '/user',
          userToAdd
        );

        // Assert
        expect(receivedAPIResponse.status).toBe(200);
      });

      test('should return 400 when user password does not meet strong password requirements', async () => {
        // Arrange
        const userToAdd = {
          email: testHelpers.generateValidEmail(),
          password: 'weak',
        };

        // Act
        const receivedAPIResponse = await axiosAPIClient.post(
          '/user',
          userToAdd
        );

        // Assert
        expect(receivedAPIResponse.status).toBe(400);
      });
    });

    describe('Email Validation', () => {
      test('should return 200 when user email meets a valid email requirements', async () => {
        // Arrange
        const userToAdd = {
          email: testHelpers.generateValidEmail(),
          password: 'StrongPass123!',
        };

        // Act
        const receivedAPIResponse = await axiosAPIClient.post(
          '/user',
          userToAdd
        );

        // Assert
        expect(receivedAPIResponse.status).toBe(200);
      });

      test('should return 400 when user email does not meet a valid email email requirements', async () => {
        // Arrange
        const userToAdd = {
          email: 'test',
          password: 'StrongPass123!',
        };

        // Act
        const receivedAPIResponse = await axiosAPIClient.post(
          '/user',
          userToAdd
        );

        // Assert
        expect(receivedAPIResponse.status).toBe(400);
      });
    });
  });
});

export {};
