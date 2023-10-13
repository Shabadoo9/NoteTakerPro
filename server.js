const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express();

const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// POST - API call to post notes
app.post('/api/notes', async (req, res) => {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db/db.json'), 'utf8');
        const notes = JSON.parse(data);

        const userNote = req.body;
        userNote.id = Math.floor(Math.random() * 5000);

        notes.push(userNote);

        await fs.promises.writeFile(path.resolve(__dirname, './db/db.json'), JSON.stringify(notes));

        res.json(userNote);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET - API call for a note with a unique ID
app.get('/api/notes/:id', async (req, res) => {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db/db.json'), 'utf8');
        const notes = JSON.parse(data);
        const note = notes.find((note) => note.id === parseInt(req.params.id));
        if (note) {
            res.json(note);
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET - API call for a list of notes
app.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db/db.json'), 'utf8');
        const notes = JSON.parse(data);
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Listener function to handle server events
app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`);
});
