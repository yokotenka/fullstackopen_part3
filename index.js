import { error } from 'console'
import express, { json } from 'express'
import morgan from 'morgan'

const app = express()

app.use(json())

morgan.token('post-body', (req) => {
    // Check if the method is POST and if the body exists
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :post-body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Display all data
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Display basic info
app.get('/info' , (request, response) => {
    const requestDate = new Date();
    response.send(`
        <p>Phonebook as info for ${persons.length} people</p>
        <p>${requestDate}`)
})

// Display one data entry
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Delete one entry
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// Post an entry
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    } 
    if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    if (persons.some(person => person.name === body.name)){
        return response.status(400).json({
            error: "name must be unique"   
        })
    }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
})

const MAX = 2e+5
const generateId = () => {
    let id = Math.floor(Math.random() * MAX)
    console.log(id)
    while (persons.some(person => person.id === id)) {
        id = Math.floor(Math.random() * MAX)
    }
    return String(id)
}

app.use((req, res) => {
    res.status(404).send('Not Found');
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})