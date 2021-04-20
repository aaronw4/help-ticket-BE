const db = require("../../config/dbConfig");

module.exports = {
  getTickets,
  getTicket,
  assignTicket,
  updateOpenStatus,
  updateResolvedStatus,
  unassignTicket,
  addTicket,
  usersTicketsAdd,
  getCategories,
  getUsersTickets,
  resolveTicket,
  deleteTicket,
  editTicket
};

function getTickets() {
  // return db
  //   .select("tickets.*", "users.username", "categories.category")
  //   .from("tickets")
  //   .join("users", "users.id", "=", "tickets.userId")
  //   .join("categories", "categories.id", "=", "tickets.categoryId");
  return db
    .select("tickets.*", "users.username")
    .from("tickets")
    .join("users", "users.id", "=", "tickets.userId");
}

function getTicket(ticketId) {
  return db("tickets").where("id", ticketId);
}

function assignTicket(userId, ticketId) {
  return db("users_tickets")
    .where("ticketId", ticketId)
    .update("userId", userId);
}

function updateOpenStatus(ticketId, ticketStatus) {
  return db("tickets")
    .where("id", ticketId)
    .update("openStatus", !ticketStatus);
}

function updateResolvedStatus(ticketId, resolvedStatus) {
  return db("tickets")
    .where("id", ticketId)
    .update("resolved", !resolvedStatus);
}

function unassignTicket(ticketId) {
  return db("users_tickets")
    .where("ticketId", ticketId)
    .update("userId", null);
}

function addTicket(ticket) {
  if (process.env.NODE_ENV === "development") {
    return db("tickets").insert(ticket);
  } else {
    return db("tickets")
      .insert(ticket)
      .returning("id");
  }
}

function usersTicketsAdd(ticketId) {
  return db("users_tickets").insert({ ticketId });
}

function getCategories() {
  return db("categories");
}

function getUsersTickets(userId) {
  // return db.raw(
  //   `select * from users_tickets join
  //   (select tickets.id, users.username, tickets.userId as ticketUserId from tickets join users on users.id = tickets.userId) as query
  //   on users_tickets.ticketId = query.id where users_tickets.userId = ${userId}`
  // );
  return db("users_tickets")
    .join("tickets", "users_tickets.ticketId", "=", "tickets.id")
    .join("users", "users.id", "=", "tickets.userId")
    .select(
      "tickets.*",
      "users_tickets.ticketId",
      "users.username",
      "users_tickets.userId as helperId"
    )
    .where("users_tickets.userId", userId);
}

function resolveTicket(ticketId, resolvedStatus) {
  return db("tickets")
    .where("id", ticketId)
    .update("resolved", !resolvedStatus);
}

function deleteTicket(userId, ticketId) {
  return db("tickets")
    .where({ id: ticketId, userId: userId })
    .del();
}

function editTicket(ticketId, editBody, userId) {
  return db("tickets")
    .where({ id: ticketId, userId: userId })
    .update(editBody);
}
