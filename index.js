
const express = require("express");
const morgan = require("morgan");

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

//////////////////////////////////////////////////

const app = express();
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

//////////////////////////////////////////////////

app.get("/info", (req, res) => {
    const count = persons.length;
    const time = new Date();

    res.send(`Phonebook has info for ${count} people<br><br>${time}`);
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: "Missing property 'name'",
        });
    } else if (!body.number) {
        return res.status(400).json({
            error: "Missing property 'number'",
        });
    } else if (persons.find(p => p.name === body.name)) {
        return res.status(409).json({
            error: "Name already present",
        });
    }

    const person = {
        id: Math.floor(Math.random() * 2_147_483_648),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(person);
    res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
});

//////////////////////////////////////////////////

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
