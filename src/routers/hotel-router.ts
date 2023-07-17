import { Router } from 'express';
import { authenticationRouter } from './authentication-router';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelRooms } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticationRouter).get('/', getHotels).get('/:hotelId', getHotelRooms);

export { hotelsRouter };
