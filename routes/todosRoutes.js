const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// GET
router.get('/', async (req, res) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// POST
router.post('/', async (req, res) => {
	const todo = new Todo(req.body);
	try {
		const newTodo = await todo.save();
		res.status(201).json(newTodo);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// PATCH
router.patch('/:id', getTodos, async (req, res) => {
	if (req.body.completed !== undefined) {
		res.todo.completed = req.body.completed;
	} 
	if (req.body.title !== undefined) {
		res.todo.title = req.body.title;
	}
	if (req.body.description !== undefined) {
		res.todo.description = req.body.description;
	}else {
		return res.status(400).json({ message: "Missing completed field" });
	}
	try {
		const updatedTodo = await res.todo.save();
		res.json(updatedTodo);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});
// DELETE
router.delete('/:id', getTodos, async (req, res) => {
	try {
		await res.todo.deleteOne();
		res.json({ message: "Deleted todo"})
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

async function getTodos(req, res, next) {
	let todo
	try{
		todo = await Todo.findById(req.params.id)
		if (todo == null) {
			return res.status(404).json({ message: "Can`t find todos"})
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
	res.todo = todo;
	next()
}

module.exports = router;