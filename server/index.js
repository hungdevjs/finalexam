const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { authUser } = require("./middlewares/auth")

require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

const connection = mongoose.connection
connection.once("open", () =>
    console.log("MongoDB database connected successfully!")
)

app.use(authUser)

const logInRoute = require("./routes/logIn.route")
app.use("/login", logInRoute)

const userRoute = require("./routes/user.route")
app.use("/user", userRoute)

const informationRoute = require("./routes/information.route")
app.use("/information", informationRoute)

const gradeRoute = require("./routes/grade.route")
app.use("/grade", gradeRoute)

const highlightRoute = require("./routes/highlight.route")
app.use("/highlight", highlightRoute)
