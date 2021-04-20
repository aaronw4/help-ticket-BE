const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./users-models");
const router = express.Router();
const restricted = require("../auth/restricted-middleware");

router.post("/register", registerMiddleware, async (req, res) => {
  try {
    //const id = await User.addUser({ username, password });
    //console.log("ID_USER: ", req.userId);
    //await User.usersRolesAdd(req.userId);
    await User.usersRolesAdd(req.userId); //This works because .insert() expects an object
    //something about my migrations for the users_roles table was breaking the code but the users_tickets table works.
    res.status(200).json({ message: "user successfully added to database" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/users-roles", async (req, res) => {
  try {
    const userRoles = await User.getUsersRoles();
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.getUser(username);
    if (user.length && bcrypt.compareSync(password, user[0].password)) {
      const token = getToken(user[0].username);
      req.headers.authorization = token;
      res.status(200).json({
        message: `you have logged in as ${user[0].username}`,
        token: token,
        data: user
      });
    } else {
      res.status(403).json({ message: "incorrect credentials" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/role", restricted, async (req, res) => {
  try {
    const roles = await User.getRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/role", restricted, verifyUser, async (req, res) => {
  const { roleId } = req.body;

  try {
    const role = await User.getRole(roleId);
    await User.addRole(req.user.id, roleId);
    res.status(200).json({
      message: `successfully changed ${req.user.username}'s role to ${role[0].role}`
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/role", restricted, verifyUser, async (req, res) => {
  const { roleId } = req.body;

  try {
    await User.removeRole(req.user.id, roleId);
    const role = await User.getRole(roleId);
    res.status(200).json({
      message: `successfully removed ${req.user.username}'s role of ${role[0].role}`
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

function getToken(username) {
  const payload = {
    sub: username
  };

  const options = {
    expiresIn: "12hr"
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "THIS WAS SUPPOSED TO BE RANDOM",
    options
  );
}

async function verifyUser(req, res, next) {
  const { username } = req.body;

  try {
    const user = await User.getUser(username);
    req.user = user[0];
    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

async function registerMiddleware(req, res, next) {
  let { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  password = hash;

  try {
    const id = await User.addUser({ username, password });
    req.userId = id[0];
    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = router;
