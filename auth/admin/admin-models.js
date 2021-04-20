const db = require("../../config/dbConfig");

module.exports = {
  getUser,
  getUsers,
  getRoleId,
  getRole,
  editRole
};

function getUser(username) {
  return db("users").where("username", username);
}

function getUsers() {
  return db
    .select("users.username", "roles.role")
    .from("users_roles")
    .join("users", "users.id", "=", "users_roles.userId")
    .join("roles", "roles.id", "=", "users_roles.rolesId");
}

function getRoleId(role) {
  return db
    .select("id")
    .from("roles")
    .where("role", role);
}

function getRole() {
  return db("roles");
}

function editRole(username, id) {
  return db("users")
    .where("username", username)
    .update("roleId", id);
}
