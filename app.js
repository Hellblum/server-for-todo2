require("dotenv").config();

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRouter")

const app = express();

// Middleware
app.use(cors({
	origin: 'http://127.0.0.1:5500',
	credentials: true,
}));
app.use(express.json())
app.use(cookieParser());
app.use("/auth", authRouter)

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URL);
		console.log("MongoDB connected successfully!");
	} catch (err) {
		console.err("Error connecting to MongoDB:", err.message);
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