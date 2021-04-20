exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users_tickets")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users_tickets").insert([
        { userId: 1, ticketId: 1 },
        { userId: 1, ticketId: 2 },
        { ticketId: 3 }
      ]);
    });
};
