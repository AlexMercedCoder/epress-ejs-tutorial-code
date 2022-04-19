/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") //import morgan
const methodOverride = require("method-override")
const mongoose = require("mongoose")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const {Schema, model} = mongoose

// make fruits schema
const todoSchema = new Schema({
    text: String
})

// make fruit model
const Todo = model("Todo", todoSchema)

/////////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use("/static", express.static("static")) // serve files from public statically


////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", async (req, res) => {

    // get todos
    const todos = await Todo.find({})

    // render index.ejs
    res.render("index.ejs", {todos})
})

app.get("/seed", async (req, res) => {
    // delete all existing todos
    await Todo.remove({})

    // add sample todos
    await Todo.create([{text: "Eat Breakfast"}, {text: "Eat Lunch"}, {text: "Eat Dinner"}])

    // redirect back to main page
    res.redirect("/")
})

app.post("/todo", async (req, res) => {
    //create the new todo from the request body (the form data)
    await Todo.create(req.body)
    // redirect to main page
    res.redirect("/")
})

app.delete("/todo/:id", async (req, res) => {
    // get the id from params
    const id = req.params.id
    // delete the todo
    await Todo.findByIdAndDelete(id)
    // redirect to main page
    res.redirect("/")
})

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))