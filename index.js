const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
//app.use(express.json()) takes the JSON data of a request, transforms it into a JavaScript object 
//and then attaches it to the body property of the request object 
//before the route handler is called.
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', request => {
    return JSON.stringify(request.body)
})

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('-----')
    next()
}

app.use(requestLogger)

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

//***routes***

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    //access id parameter in route
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        //respond to the request without sending data
        response.status(404).end()
    }
})

const generateId = () => {
    //if notes.length > 0 it maps the notes array for notes.id and retrieves the largest number.
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: 'content missing.' })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)
    response.json(note)
    app.use(morgan(':method :url :body'))
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


