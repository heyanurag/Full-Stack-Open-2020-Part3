/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

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

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(logger)

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

app.get('/info', (req, res, next) => {
    Person
        .find({})
        .then(persons => {
            res.send(`<div> <p>Phonebook has info of ${persons.length} people.</p><p>${(new Date).toString()}</p></div>`)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

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
        return true
    }
    return false
}

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    /*if(!body.name) {
        return res.status(400).json({          // "return" is important here!!!
            error: 'name is missing!!'
        })
    }

    if(!body.number) {
        return res.status(400).json({          // "return" is important here!!!
            error: 'number is missing!!'
        })
    }*/

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ errorMessage: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

