const express = require("express");
const Ticket = require("./tickets-models");
const restricted = require("../restricted-middleware");

const router = express.Router();

router.get("/", restricted, async (req, res) => {
  try {
    const tickets = await Ticket.getTickets();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", restricted, async (req, res) => {
  const ticket = {
    title: req.body.title,
    description: req.body.description,
    attempted: req.body.attempted,
    category: req.body.category,
    userId: req.body.userId
  };

  try {
    const id = await Ticket.addTicket(ticket);
    await Ticket.usersTicketsAdd(id[0]);
    res.status(200).json({ message: "successfully added ticket" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/assign", restricted, verifyTicket, async (req, res) => {
  const { userId } = req.body;
  try {
    if (req.ticket.openStatus === 1 || req.ticket.openStatus === true) {
      await Ticket.assignTicket(userId, req.ticket.id);
      await Ticket.updateOpenStatus(req.ticket.id, req.ticket.openStatus);
      res
        .status(200)
        .json({ message: "successfully assigned ticket to yourself" });
    } else {
      res
        .status(409)
        .json({ message: "Ticket is currently not open to be taken" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/unassign", restricted, verifyTicket, async (req, res) => {
  try {
    if (req.ticket.openStatus === 0 || req.ticket.openStatus === false) {
      await Ticket.unassignTicket(req.ticket.id);
      await Ticket.updateOpenStatus(req.ticket.id, req.ticket.openStatus);
      res
        .status(200)
        .json({ message: "successfully unassigned ticket from yourself" });
    } else {
      res
        .status(409)
        .json({ message: "This ticket is not being assigned to this user" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/categories", restricted, async (req, res) => {
  try {
    const categories = Ticket.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/users-tickets/:id", restricted, async (req, res) => {
  try {
    const usersTickets = await Ticket.getUsersTickets(req.params.id);
    res.status(200).json(usersTickets);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/resolved", restricted, verifyTicket, async (req, res) => {
  try {
    await Ticket.resolveTicket(req.ticket.id, req.ticket.resolved);
    res.status(200).json({ message: "Ticket resolve status has been updated" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/", restricted, verifyTicket, async (req, res) => {
  /*when passing data to delete request
   * in axios call use axios.delete(url, {data:{foo: bar}})
   * because delete needs data to be there in the request body
   * probably should have written this route like this /:userId/:ticketId or /userId/:userId/ticketId/:ticketId
   */
  const { userId } = req.body;

  try {
    await Ticket.deleteTicket(userId, req.ticket.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", restricted, verifyTicket, async (req, res) => {
  let ticketBody = {};

  for (const property in req.body) {
    if (property !== "ticketId") {
      ticketBody[property] = req.body[property];
    }
  }

  try {
    await Ticket.editTicket(req.ticket.id, ticketBody, req.params.id);
    res.status(200).json({ message: "successfully edited ticket" });
  } catch (error) {
    res.status(500).json(error);
  }
});

async function verifyTicket(req, res, next) {
  const { ticketId } = req.body;

  try {
    const ticket = await Ticket.getTicket(ticketId);
    req.ticket = ticket[0];
    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = router;
