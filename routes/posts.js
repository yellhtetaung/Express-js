const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.sendStatus(200);
});

router.get("/postTitle/:title", (req, res) => {
  res.json({ title: "Some Random Post" });
});

module.exports = router;
