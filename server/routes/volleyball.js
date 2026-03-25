const express = require("express");
const router = express.Router();
const { authorizeScoreUpdate } = require("../middleware/scoreAuth");
const {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
} = require("../controllers/volleyballController");

router.get("/", getAllMatches);
router.get("/:id", getMatch);
router.post("/", authorizeScoreUpdate, createMatch);
router.put("/:id/update", authorizeScoreUpdate, updateMatch);
router.delete("/:id", authorizeScoreUpdate, deleteMatch);

module.exports = router;
