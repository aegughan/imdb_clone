const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const Joi = require("joi");
const table_name = "actors";

const actorSchema = Joi.object({
  name: Joi.string().min(1).required(),
  gender: Joi.number().integer().min(1).max(3),
  dob: Joi.date().less("now").iso().required(),
  bio: Joi.string().min(1).required(),
});

// Get all actor
router.get("/", async (_, res) => {
  const { data, error } = await supabase.from(table_name).select(`
        id,
        name
    `);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create actor
router.post("/", async (req, res) => {
  const { error, value } = actorSchema.validate(req.body);
  if (error) {
    return res.status(500).json({ error: error.details[0].message });
  } else {
    const { data, error } = await supabase.from(table_name).insert([value]);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  }
});

module.exports = router;
