import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTickeyById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
    }
  });
}
async function findTickeWithTypeById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    }
  });
}
async function findTicketByUserId(userId: number) {
  const allTicketsWithEnrollment = prisma.ticket.findMany({
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });

  return (await allTicketsWithEnrollment).filter(t => t.Enrollment.userId === userId);
}
async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true, //inner join
    }
  });
}

async function createTicket(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      ...ticket,
    }
  });
}

async function ticketProcessPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    }
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

const ticketRepository = {
  findTicketTypes,
  findTicketByUserId,
  findTicketByEnrollmentId,
  createTicket,
  findTickeyById,
  findTickeWithTypeById,
  ticketProcessPayment,
};

export default ticketRepository;
