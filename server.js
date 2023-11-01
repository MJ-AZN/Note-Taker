const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Navigate to /notes');
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = Date.now(); 

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

