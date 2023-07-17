import supertest from 'supertest';
import { cleanDb } from '../helpers';
import { init } from '@/app';
import httpStatus from 'http-status';
import app from '@/app';
import  * as jwt from "jsonwebtoken"
import faker from '@faker-js/faker';
import { createEnrollmentWithAddress, createPayment, createUser } from '../factories';
import { createTicket } from '@/controllers';
import { TicketStatus } from '@prisma/client';
import { generateValidToken } from '../helpers'
import { createTicketType } from '../factories'

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
    await cleanDb()
})

const server = supertest(app)


describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe("when the token is valid", () => {
        it('should respond with status 402 when the ticket is remote s', async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            const payment = await createPayment(ticket.id, ticketType.price)



            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
    })
        it ('should respond with status 404 when there is no enrolmmet',async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
            expect(response.status).toEqual(httpStatus.NOT_FOUND)


        })

})
})
