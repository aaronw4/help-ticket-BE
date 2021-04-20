const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "aaron", password: bcrypt.hashSync("pass", 10) },
        { username: "jay", password: bcrypt.hashSync("pass", 10) },
        { username: "user3", password: bcrypt.hashSync("pass", 10) },
        { username: "user4", password: bcrypt.hashSync("pass", 10) },
        { username: "user5", password: bcrypt.hashSync("pass", 10) }
      ]);
    });
};
