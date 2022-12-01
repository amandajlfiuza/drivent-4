import { prisma } from "@/config";

function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId: roomId,
    },
    include: {
      Room: true,
    }
  });
}

function findBookingsByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    }
  });
}

function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: id,
    },
    data: {
      roomId: roomId,
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingsByRoomId,
  findBookingsByUserId,
  createBooking,
  updateBooking,
};
  
export default bookingRepository;
