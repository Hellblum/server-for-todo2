require("dotenv").config();

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authRouter = require("./routes/authRouter")

const app = express();

// Middleware
app.use(cors())
app.use(express.json())
app.use("/auth", authRouter)

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URL);
		console.log("MongoDB connected successfully!");
	} catch (e) {
		console.error("Error connecting to MongoDB:", e.message);
		process.exit(1);
	}
};

connectDB();

const todosRoutes = require("./routes/todosRoutes");
app.use("/todos", todosRoutes);

app.get("/", (req, res) => {
	res.send("API is working!");
});

app.listen(3000, () => {
	console.log("Server is running!");
});