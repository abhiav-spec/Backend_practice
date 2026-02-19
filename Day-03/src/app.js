const express = require('express');
const notemodel = require('./db/models/note.model');


const app = express();

app.use(express.json());

app.post('/notes', async (req, res) => {
    try {
        const note = await notemodel.create(req.body);
        res.status(201).json({
            message:"Note created successfully",
            note:note
        });
    } catch (error) {
        res.status(500).json({
            message:"Error creating note",
            error:error.message
        });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await notemodel.find();
        res.status(200).json({
            message:"Notes retrieved successfully",
            notes:notes
        });
    } catch (error) {
        res.status(500).json({
            message:"Error retrieving notes",
            error:error.message
        });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const note = await notemodel.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({
                message:"Note not found"
            });
        }
        res.status(200).json({
            message:"Note deleted successfully",
            note:note
        });
    } catch (error) {
        res.status(500).json({
            message:"Error deleting note",
            error:error.message
        });
    }
});

app.patch('/notes/:id', async (req, res) => {
    try {
        const note = await notemodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!note) {
            return res.status(404).json({
                message:"Note not found"
            });
        }
        res.status(200).json({
            message:"Note updated successfully",
            note:note
        });
    } catch (error) {
        res.status(500).json({
            message:"Error updating note",
            error:error.message
        });
    }
});     




module.exports = app;