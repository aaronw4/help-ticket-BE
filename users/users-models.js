const db = require("../config/dbConfig");

module.exports = {
  addUser,
  usersRolesAdd,
  getUser,
  getRoles,
  getRole,
  addRole,
  removeRole,
  getUsers,
  getUsersRoles
};

function addUser(user) {
  if (process.env.NODE_ENV === undefined) {
    return db("users").insert(user);
  } else {
    return db("users")
      .insert(user)
      .returning("id"); //returning is necessary when needing to obtain column information from an update or insert in
  }
}

function usersRolesAdd(userId) {
  return db("users_roles").insert({ userId });
}

function getUser(username) {
  return db
    .select("*")
    .from("users")
    .join("users_roles", "users.id", "=", "users_roles.userId")
    .join("roles", "users_roles.roleId", "=", "roles.id")
    .where("username", username);
}

function getRoles() {
  return db("roles");
}

function getRole(roleId) {
  return db
    .select("role")
    .from("roles")
    .where("id", roleId);
}

function addRole(userId, roleId) {
  return db("users_roles").insert({ userId: userId, roleId: roleId });
}

function removeRole(userId, roleId) {
  return db("users_roles")
    .where({ userId: userId, roleId: roleId })
    .del();
}

function getUsers() {
  return db("users");
}

function getUsersRoles() {
  return db("users_roles");
}
