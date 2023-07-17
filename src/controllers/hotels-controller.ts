import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(Number(userId));
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.PAYMENT_REQUIRED);
  }
}

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const hotels = await hotelsService.getHotelsRooms(Number(userId), Number(hotelId));
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND);
    }
    if (err.name === 'CannotListHotelError') {
      return res.status(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.BAD_REQUEST);
  }
}
