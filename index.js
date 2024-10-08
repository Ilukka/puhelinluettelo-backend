const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
    {
        id: 5,
        name: "Ilkka Liikanen",
        number: "040-123456",
    },
]

app.use(express.static('dist'))

app.get("/api/persons", (request, response) => {
    response.json(persons);
})

app.get("/info", (request, response) => {
    let info = {
        "message": `Phonebook has info for ${persons.length} people`,
        "date": new Date()
    };
    response.json(info);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        });
    }

    const existingPerson = persons.find(person => person.name === body.name);
    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const newId = Math.floor(Math.random() * 1000);
    const newPerson = {
        id: newId,
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    response.json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})