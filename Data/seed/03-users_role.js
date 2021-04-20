exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users_roles")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users_roles").insert([
        { userId: 1, roleId: 2 },
        { userId: 2, roleId: 2 },
        { userId: 3, roleId: 1 },
        { userId: 4, roleId: 1 },
        { userId: 5, roleId: 1 }
      ]);
    });
};
