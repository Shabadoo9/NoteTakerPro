const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express();

const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

//Post api call to post notes
app.post('/api/notes', async (req, res) => {
    try{
        const data = await fs.readFile(path.resolve(__dirname, './db/db.json'), 'utf8');
        const notes = JSON.parse(data);

        const userNote = req.body;
        userNote.id = math.floor(math.random() * 5000);

        notes.push(userNote);

        await fs.writeFile(path.resolve(__dirname, './db/db.json'), JSON.stringify(notes));

        res.json(userNote);
    } catch (err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'})
    }
});