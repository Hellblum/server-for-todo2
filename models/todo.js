const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
	title: String,
	description: String,
	completed: Boolean,
});

// Налаштування для перетворення _id у id
todoSchema.set("toJSON", {
  virtuals: true, // Додати віртуальні поля
	transform: (doc, ret) => {
   	ret.id = ret._id.toString(); // Створити поле id
		delete ret._id; // Видалити поле _id
   	delete ret.__v; // Видалити службове поле __v
	},
});

module.exports = mongoose.model("Todos", todoSchema);