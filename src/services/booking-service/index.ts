import bookingRepository from "@/repositories/booking-repository";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { forbiddenError, requestError, notFoundError, paymentRequiredError } from "@/errors";

async function getBookingByUserId(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (ticket.length === 0 || ticket[0].TicketType.includesHotel === false) {
    throw forbiddenError;
  }

  const payment = await paymentRepository.findPaymentByTicketId(ticket[0].id);
  if (!payment) {
    throw forbiddenError;
  }

  const userBooking = await bookingRepository.findBookingByUserId(userId);
  if (!userBooking) {
    throw notFoundError;
  }

  return userBooking;
}

async function createBooking(userId: number, roomId: number) {
  if (roomId === undefined) {
    throw requestError;
  }

  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (ticket.length === 0 || ticket[0].TicketType.includesHotel === false) {
    throw forbiddenError;
  }
  
  const payment = await paymentRepository.findPaymentByTicketId(ticket[0].id);
  if (!payment) {
    throw paymentRequiredError;
  }
  
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError;
  }

  const roomBookings = await bookingRepository.findBookingsByRoomId(roomId);
  if (roomBookings.length === room.capacity) {
    throw forbiddenError;
  }

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking;
}

async function changeBooking(userId: number, roomId: number, bookingId: number) {
  if (roomId === undefined || bookingId === undefined) {
    throw requestError;
  }

  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (ticket.length === 0 || ticket[0].TicketType.includesHotel === false) {
    throw forbiddenError;
  }

  const payment = await paymentRepository.findPaymentByTicketId(ticket[0].id);
  if (!payment) {
    throw paymentRequiredError;
  }

  const room = await hotelRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError;
  }
  
  const roomBookings = await bookingRepository.findBookingsByRoomId(roomId);
  if (roomBookings.length === room.capacity) {
    throw forbiddenError;
  }

  const userBooking = await bookingRepository.findBookingsByUserId(userId);
  if(!userBooking) {
    throw forbiddenError;
  }

  return bookingRepository.updateBooking(userBooking.id, roomId);
}

const bookingService = {
  getBookingByUserId,
  createBooking,
  changeBooking
};

export default bookingService;
