const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const Joi = require("joi");
const multer = require("multer");
const table_name = "movies";
const upload = multer();

const movieSchema = Joi.object({
    name: Joi.string().min(1).required(),
    year_of_release: Joi.date().iso().required(),
    plot: Joi.string().min(1).required(),
    producer_id: Joi.number().integer().min(1).max(3),
    actors_list: Joi.array()
        .items(Joi.number().integer().min(1).required())
        .required(),
});

const columnToSelect = `id,
        name, 
        year_of_release,
        plot, 
        poster, 
        actor_movies(
            actors (
                id, name
            )
        ),
        producers (
            id, name
        )`;
// Get all movies
router.get("/", async (_, res) => {
    const { data, error } = await supabase
        .from(table_name)
        .select(columnToSelect).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create movie
router.post("/", upload.single('poster'), async (req, res) => {
    const { name, year_of_release, plot, producer_id, actors_list } = req.body
    const reuqestData = { name, year_of_release, plot, producer_id, actors_list: actors_list?.split(",") }
    const { error, value } = movieSchema.validate(reuqestData);
    const file = req.file;
    if (error) {
        return res.status(500).json({ error: error.details[0].message });
    } else {
        if (!file) {
            return res.status(400).json({ error: 'Poster file is missing' });
        }
        const filePath = `images/${Date.now()}_${file.originalname}`;
        const { error: storageError } = await supabase.storage
            .from('imdb-poster')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
            });
        if (storageError) return res.status(500).json({ error: storageError.message });
        const { data: storageData } = supabase.storage
            .from('imdb-poster')
            .getPublicUrl(filePath);

        const { name, year_of_release, plot, producer_id, actors_list } =
            value;
        const movie_data = { name, year_of_release, plot, poster: storageData.publicUrl, producer_id };
        const { data: movieData, error: movieError } = await supabase
            .from(table_name)
            .insert([movie_data])
            .select();
        if (movieError) return res.status(500).json({ error: movieError.message });
        movie_id = movieData[0]?.id;
        const movie_actors = actors_list?.map((actor_id) => {
            return { actor_id, movie_id };
        });
        const { error } = await supabase.from("actor_movies").insert(movie_actors);
        if (error) return res.status(500).json({ error: error.message });
        res.json(movieData);
    }
});

// Update movie
router.put("/:id", upload.single('poster'), async (req, res) => {
    const { id } = req.params;
    const { name, year_of_release, plot, producer_id, actors_list } = req.body
    const reuqestData = { name, year_of_release, plot, producer_id, actors_list: actors_list?.split(",") }
    const { error, value } = movieSchema.validate(reuqestData);
    if (error) {
        return res.status(500).json({ error: error.details[0].message });
    } else {
        const file = req.file;
        const { name, year_of_release, plot, producer_id, actors_list } =
            value;
        const movie_data = { name, year_of_release, plot, producer_id };
        if (file) {
            const filePath = `images/${Date.now()}_${file.originalname}`;
            const { error: storageError } = await supabase.storage
                .from('imdb-poster')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                });
            if (storageError) return res.status(500).json({ error: storageError.message });
            const { data: storageData } = supabase.storage
                .from('imdb-poster')
                .getPublicUrl(filePath);
            movie_data.poster = storageData.publicUrl
            const { data: movieDataObj } = await supabase
                .from(table_name)
                .select("poster")
                .eq("id", id)
                .single();
            const posterUrlArr = movieDataObj.poster.split("/")
            const deleteFilePath = `images/${posterUrlArr[posterUrlArr.length - 1]}`
            // Delete file from Supabase storage
            const { error: deleteDataError } = await supabase.storage
                .from("imdb-poster") // Replace with your bucket name
                .remove([deleteFilePath]); // Array of file paths to delete

            if (deleteDataError) {
                return res.status(500).json({ error: deleteDataError.message });
            }
        }

        // update movie data
        const { data: movieData, error: movieError } = await supabase
            .from(table_name)
            .update([movie_data])
            .eq("id", id)
            .single()
            .select();
        if (movieError) return res.status(500).json({ error: movieError.message });
        // delete entries from many to many relationship table
        const { error: deleteError } = await supabase
            .from("actor_movies")
            .delete()
            .eq("movie_id", id);
        if (deleteError) {
            return res.status(500).json({ error: deleteError.message });
        }
        // update entries from many to many relationship table
        const movie_actors = actors_list?.map((actor_id) => {
            return { actor_id, movie_id: id };
        });
        const { error } = await supabase.from("actor_movies").insert(movie_actors);
        if (error) return res.status(500).json({ error: error.message });
        res.json(movieData);
    }
});

// get movie by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from(table_name)
        .select(columnToSelect)
        .eq("id", id)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ message: "Movie not found" });
    }

    res.json(data);
});

module.exports = router;
