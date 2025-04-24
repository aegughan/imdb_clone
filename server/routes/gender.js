const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Get all gender
router.get("/", async (_, res) => {
  const { data, error } = await supabase.from("gender").select(`
        id,
        name
    `);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
