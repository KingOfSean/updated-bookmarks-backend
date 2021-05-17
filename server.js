require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { hash, jsonAuth, auth } = require('./controllers/authController');
const User = require('./models/User');
const SECRET = process.env.SECRET_KEY;
const app = express();
const PORT = process.env.PORT || 9000;
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.body)
    next();
});
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.connection.once('connected', () => console.log('What a time to be alive!'));
app.use('/bookmarks', require('./controllers/bookmarksController'));
app.use('/users', require('./controllers/usersController'));


//Login
app.post('/login', (req, res) => {
    const { username, password} = req.body;
    const hashedPassword = hash(password);

    User.findOne({ username }, (err, foundUser) => {
        if(err){
            res.status(400).json({ msg: err.message })
        } else {
            if(bcrypt.compareSync(hashedPassword, foundUser.password)){
                const token = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username
                }, SECRET)
                res.status(200).json({ token, username:foundUser.username })
            } else {
                res.status(500).json({
                    problem: 'The comparison did not work, did you change your hash algo?'
                })
            }
        }
    })
});


//Register
app.post('/register', (req, res) => {
    const passwordHash = hash(req.body.password)
    req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))
    console.log(req.body)
    User.create(req.body, (err, createdUser) => {
        if(err){
            console.log(err)
            res.status(400).json({
                msg: err.message
            })
        } else {
            const token = jwt.sign({
               id: createdUser._id,
               username: createdUser.username 
            }, SECRET)
            res.status(200).json({
                token
            })
        }
    })
})








app.listen(PORT, () => console.log("I need me some Jesus in my life Amen!: ", PORT))