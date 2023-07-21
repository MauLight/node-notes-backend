// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// //The third argument in the command-line
// const password = process.argv[2]

// const url = `mongodb+srv://maulight:${password}@cluster0.psf6eua.mongodb.net/noteApp?retryWrites=true&w=majority`

// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// //Define note schema
// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean
// })

// //Translates to 'notes' as collection's name
// const Note = mongoose.model('Note', noteSchema)

// //Based on Note model, inherits properties and methods
// const note1 = new Note({
//     content: 'HTML is easy',
//     important: true
// })
// const note2 = new Note({
//     content: "Browser can execute only JavaScript",
//     important: false
// })
// const note3 = new Note({
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
// })

// //Save to data base using .save() method from model
// // note3.save().then(result => {
// //     console.log('note saved!')
// //     mongoose.connection.close()
// // })

// //Fetch objects from the database
// Note.find({important: true}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })
