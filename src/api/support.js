import api from "./axios";

export const getTickets = async () => {
  const res = await api.get("/support/tickets");
  return res.data;
};

export const createTicket = async (subject, message) => {
  const res = await api.post("/support/tickets", { subject, message });
  return res.data;
};