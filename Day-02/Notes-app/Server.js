const app = require('./src/app');
const express = require('express');

const notes = [];

app.use(express.json());

app.post('/notes', (req, res) => {
    notes.push(req.body);
    res.status(201).json({
        message:"Note created successfully",
        note:req.body
    });
});

app.get('/notes', (req, res) => {
    res.status(200).json({
        message:"Notes retrieved successfully",
        notes:notes
    });
});

app.delete('/notes/:id', (req, res) => {
    const index=req.params.id;
    console.log(notes[index]);
    delete notes[index];
    res.status(200).json({
        message:"Note deleted successfully",
        note:notes[index]
    });
});

app.patch('/notes/:id', (req, res) => {
    const index=req.params.id;
    console.log(notes[index]);
    notes[index].description=req.body.description;
    res.status(200).json({
        message:"Note updated successfully",
        note:notes[index]
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});