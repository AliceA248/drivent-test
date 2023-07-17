import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotels } from '@/errors/cannot-list-hotels-error';
import hotelsRepository from '@/repositories/hotels-repository';

export async function listHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotels();
  }
}
async function getHotels(userId: number) {
  await listHotels(userId);

  const hotels = await hotelsRepository.findHotels();
  if (!hotels || hotels.length === 0) {
    throw notFoundError();
  }
  return hotels;
}

async function getHotelsRooms(userId: number, hotelId: number) {
  await listHotels(userId);

  const hotel = await hotelsRepository.findRoomsByHotelId(hotelId);

  if (!hotel || hotel.Rooms.length === 0) {
    throw notFoundError();
  }
  return hotel;
}

export default {
  getHotels,
  getHotelsRooms,
  listHotels,
};
