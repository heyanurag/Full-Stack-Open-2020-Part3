const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log("Enter password as argument: node mongo.js <password>")
    process.exit(1);
}

const password = process.argv[2]

const URL = `mongodb+srv://fullstack:password@cluster0.8fr94.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    console.log('Phonebook:')
    Person
        .find({})
        .then(persons => {
            persons.forEach(person => console.log(`${person.name} ${person.number}`))
            mongoose.connection.close()
        })
}

if(process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,  
        number: number  
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}




