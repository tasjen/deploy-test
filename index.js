const express = require('express');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors());
app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === +id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end();
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  if (notes.find(note => note.id === id)) {
    notes = notes.filter(note => note.id !== id)
    res.statusMessage = `id ${id} is deleted`;
  } else {
    res.statusMessage = 'id not found';
  }
  res.status(204).end()
})

const generatedId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(e => e.id))
  : 0
  return maxId + 1;
}

app.post('/api/notes', (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const newNote = {
    id: generatedId(),
    content: req.body.content,
    important: Boolean(req.body.important) || false
  }

  notes = [...notes, newNote]
  
  res.json(newNote)
})

app.put('/api/notes/:id', (req, res) => {
  if (!notes.find(e => e.id === req.body.id)) {
    return res.status(400).json({
      error: 'id not found'
    });
  }
  const updatedNote = req.body;
  notes = notes.map(e => e.id !== updatedNote.id ? e : updatedNote);
  res.json(updatedNote);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
