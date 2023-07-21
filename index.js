require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')
const app = express()
//app.use(express.json()) takes the JSON data of a request, transforms it into a JavaScript object 
//and then attaches it to the body property of the request object 
//before the route handler is called.

//Morgan Token
morgan.token('body', request => {
    return JSON.stringify(request.body)
})

//MIDDLEWARES
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :body'))

// const requestLogger = (request, response, next) => {
//     console.log('Method: ', request.method)
//     console.log('Path: ', request.path)
//     console.log('Body: ', request.body)
//     console.log('-----')
//     next()
// }

// app.use(requestLogger)

//***routes***

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {

    Note.findById(request.params.id).then(note => {

        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))

})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: 'content missing.' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        }).catch(error => next(error))

})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))