const express = require("express");
const restricted = require("../restricted-middleware");
const Admin = require("./admin-models");
const router = express.Router();

router.get("/", restricted, async (req, res) => {
  try {
    const users = await Admin.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/role", restricted, async (req, res) => {
  try {
    const roles = await Admin.getRole();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put(
  "/edit-role",
  restricted,
  validateUser,
  convertRoleToId,
  async (req, res) => {
    const { username } = req.user;
    const { id } = req.roleId;
    try {
      await Admin.editRole(username, id);
      res.status(200).json({
        message: `successfully updated ${username} role to ${req.body.role}`
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

async function validateUser(req, res, next) {
  const { username } = req.body;
  try {
    const user = await Admin.getUser(username);
    console.log("USER: ", user);
    req.user = user[0];
    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

async function convertRoleToId(req, res, next) {
  const { role } = req.body;
  try {
    const id = await Admin.getRoleId(role);
    req.roleId = id[0];
    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = router;
