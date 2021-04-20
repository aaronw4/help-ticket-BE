exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("tickets")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("tickets").insert([
        {
          title: "A",
          category: "knex",
          description: "A",
          attempted: "A",
          openStatus: false,
          resolved: true,
          userId: 1
        },
        {
          title: "B",
          category: "javascript",
          description: "B",
          attempted: "B",
          openStatus: false,
          resolved: false,
          userId: 2
        },
        {
          title: "C",
          category: "css",
          description: "C",
          attempted: "C",
          openStatus: true,
          resolved: false,
          userId: 3
        }
      ]);
    });
};
