import bookingRepository from "@/repositories/booking-repository";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { forbiddenError, paymentRequiredError, notFoundError } from "@/errors";

async function getBookingByUserId(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (ticket.length === 0 || ticket[0].TicketType.includesHotel === false) {
    throw forbiddenError;
  }

  const payment = await paymentRepository.findPaymentByTicketId(ticket[0].id);
  if (!payment) {
    throw paymentRequiredError;
  }

  const userBooking = await bookingRepository.findBooking(userId);
  if (!userBooking) {
    throw notFoundError;
  }

  return userBooking;
}

const bookingService = {
  getBookingByUserId,
};

export default bookingService;
