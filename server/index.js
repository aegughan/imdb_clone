require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

app.use(cors());
app.use(express.json());

const movieRoutes = require("./routes/movies");
app.use("/api/movies", movieRoutes);

const producerRoutes = require("./routes/producers");
app.use("/api/producers", producerRoutes);

const genderRoutes = require("./routes/gender");
app.use("/api/gender", genderRoutes);

const actorsRoutes = require("./routes/actors");
app.use("/api/actors", actorsRoutes);

app.listen(PORT, () => {
  console.log(`Server started on the port ${PORT}`);
});
