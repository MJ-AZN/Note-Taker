//Imports for the application
const express = require('express');
const path = require('path');
const fs = require('fs');
const { uuid } = require('uuidv4');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

//route for homepage
app.get('/', (req, res) => {
  res.send('Navigate to /notes');
});

//route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


//route for db.json
app.get('/api/notes', (req, res) => {
    try {
      const data = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  //Route to handle new note
  app.post('/api/notes', async (req, res) => {
    try {
      //sanity check
        console.info(`${req.method} request received to add a note`);

        const { title, text } = req.body;

        if (title && text) {
          //Craete a new note object
            const newNote = {
                title,
                text,
                id: uuid(),
            };

            //Reads existing notes
            const data = await fs.promises.readFile('./db/db.json', 'utf8');
            const dataArray = JSON.parse(data);

            //add new note to existing note
            dataArray.push(newNote);
            const noteString = JSON.stringify(dataArray, null, 2);

            await fs.promises.writeFile('./db/db.json', noteString);

            console.info(`Note for ${newNote.title} has been written to JSON file`)

            const response = {
                status: 'success',
                body: newNote,
            };

            return res.status(201).json(response);
        } else {
            return res.status(400).json('Both title and text are required');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json('Internal server error');
    }
});

  
//start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

