const express = require('express')
const session = require('express-session')
const massive = require('massive')
require('dotenv').config()
const PORT = 4000
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const app = express()

app.use(express.json())
app.use(
    session(
        {
            secret: SESSION_SECRET,
            resave: true,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 //1 hour
            }
        }
    )
)

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.delete('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})