const express = require('express'),
morgan = require('morgan');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Logging middleware (Morgan)
app.use(morgan('common'));

// For sending static files
app.use(express.static('public'));

// // Returning top ten movies
// app.get('/movies', (req, res) => {
//     res.json(topTenMovies);
// });

// // Returning welcome page
// app.get('/', (req, res) => {
//     res.send('Welcome to myFlix!');
// });

// -----------Movie Requests-----------
// Returning a list of ALL movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Returning data about a single movie
app.get('/movies/:title', (req, res) => {
    Movies.findOne({Title: req.params.title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// ----------Genre Requests----------
// Returning data about a genre by name
app.get('/genre/:name', (req, res) => {
    Movies.find({'Genre.Name': req.params.name})
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// ----------Directors Requests----------
// Returning data about directors by name
app.get('/directors/:name', (req, res) => {
    Movies.find({'Director.Name': req.params.name})
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// ----------User Requests----------
// Allowing new users to register
/* We'll except JSON in this format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}*/

app.post('/users', (req, res) => {
    Users.findOne({Username: req.body.Username})
        .then((user) => {
            if(user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Allowing users to update their info
/* We'll expect JSON in this format
{
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
}*/
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.username}, 
        {$set: 
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        {new: true}, //This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Allowing users to deregister
app.delete('/users/:username', (req, res) => {
    Users.findOneAndRemove({Username: req.params.username})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.username + ' was not found');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:username', (req, res) => {
    Users.findOne({Username: req.params.username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// ----------Favorites Requests----------
// Allowing users to add a movie to their favorites list
app.post('/users/:username/favorites/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.username},
    {$push: {FavoriteMovies: req.params.MovieID}},
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Allowing users to remove a movie from their favorite list
app.delete('/users/:username/favorites/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.username},
    {$pull: {FavoriteMovies: req.params.MovieID}},
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});