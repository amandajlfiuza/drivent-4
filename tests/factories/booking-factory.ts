import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { createUser } from "./users-factory";

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

export async function createBookingsForMaximumRoomCapacity(roomCapacity: number, roomId: number) {
  for (let i=0; i<roomCapacity; i++) {
    const user = await createUser();
    await prisma.booking.create({
      data: {
        userId: user.id,
        roomId,
      }
    });
  }

  return;
}
