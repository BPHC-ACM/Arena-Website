const express = require("express");
const router = express.Router();
const {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
} = require("../controllers/volleyballController");

router.get("/", getAllMatches);
router.get("/:id", getMatch);
router.post("/", createMatch);
router.put("/:id/update", updateMatch);
router.delete("/:id", deleteMatch);

module.exports = router;
