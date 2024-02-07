const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1 : Get all the notes using : GET "/api/auth/notes/getallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const allNotes = await Notes.find({ user: req.id })
        res.json(allNotes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "some error ouccured internally" });
    }

})

// ROUTE 2 : Add a new notes using : POST"/api/auth/addnotes". Login required
router.post('/addnotes', fetchuser, [
    body('title', "Enter a valid title at least 5 character").isLength({ min: 5 }),
    body('description', "Description must be atleast 5 character").isLength({ min: 5 })], async (req, res) => {
        try {
            const { title, description, tag } = req.body

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({ error: "Some error occured when storing a notes" });
            }

            const note = new Notes({
                title, description, tag, user: req.id
            })
            const savedNote = await note.save()

            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ error: "some error ouccured internally" });
        }


    })
module.exports = router