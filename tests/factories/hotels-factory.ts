import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotels(ticketId: number, value: number) {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export function createRoom(hotelId: number) {

  return prisma.room.create( {
    data: {
        name: "1000",
        capacity: 10,
        hotelId: hotelId,
      },
  })
}
