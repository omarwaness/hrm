const express = require('express');
const router = express.Router();
const ToDo = require('../models/ToDo');

// Add new todo item
router.post('/addToDo', async (req, res) => {
  try {
    const { user, task, favorite } = req.body;
    const newToDo = new ToDo({
      user,
      task,
      favorite
    });
    
    await newToDo.save();
    res.status(201).json({ message: 'Task created', todo: newToDo });
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Get all todos for a specific user
router.get('/:user', async (req, res) => {
  try {
    const user = req.params.user;
    
    const toDos = await ToDo.find({ user: user });
    res.status(200).json({ toDo: toDos });
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a todo item
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting todo with ID:', id);
    
    const deleted = await ToDo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Update favorite status of a todo item
router.patch('/favorite/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { favorite } = req.body;
    
    const updated = await ToDo.findByIdAndUpdate(
      id, 
      { favorite }, 
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(200).json({ message: 'Todo updated successfully', todo: updated });
  } catch (err) {
    console.error('Error updating favorite status:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

module.exports = router;