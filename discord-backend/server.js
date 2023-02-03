const express = require('express');
const http  = require('http');
const cors  = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();
const authRoute = require('./routes/authRoutes')
const friendInvitationRoutes = require('./routes/friendInvitationRoutes')
const socketServer = require('./socketServer')

const PORT = process.env.PORT || process.env.API_PORT

const app = express()
app.use(express.json())
app.use(cors());

//register the  route
app.use("/api/auth",authRoute)
app.use("/api/friends-invitation", friendInvitationRoutes)

const server = http.createServer(app);
socketServer.registerSocketServer(server)


mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}.........`)
    })
})
.catch(err => {
    console.log("Database connection failed. Server not startd.")
    console.log(err)
})