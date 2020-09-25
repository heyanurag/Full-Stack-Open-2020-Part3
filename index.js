const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req) => JSON.stringify(req.body))

const logger = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['body'](req, res)
      ].join(' ')
})

app.use(cors())
app.use(express.json())
app.use(logger)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    res.send(`<div> <p>Phonebook has info of ${persons.length} people.</p><p>${(new Date).toString()}</p></div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateID = () => {
    const maxID = persons.length > 0 
        ? Math.floor(Math.random()*(persons.length*500))
        : 0
    return maxID + 1
}

const checkName = (name) => {
    const names = persons.map(p => p.name)
    if(names.includes(name)) {
        return true;
    }
    return false;
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(!body.name) {
        return res.status(400).json({          // "return" is important here!!!
            error: 'name is missing!!'
        })  
    } 

    if(!body.number) {
        return res.status(400).json({          // "return" is important here!!!
            error: 'number is missing!!'
        })  
    }

    if(checkName(body.name)) {
        return res.status(400).json({         // "return" is important here!!!
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

