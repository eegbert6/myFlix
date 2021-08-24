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

// An array of my top ten movies
let topTenMovies = [
    {
        title: 'Coach Carter',
        year: '2005'
    },
    {
        title: 'Hunt for the Wilderpeople',
        year: '2016'
    },
    {
        title: 'How to Lose a Guy in 10 Days',
        year: '2003'
    },
    {
        title: 'You\'ve Got Mail',
        year: '1998'
    },
    {
        title: 'What Lies Beneath',
        year: '2000'
    },
    {
        title: 'Peanut Butter Falcon',
        year: '2019'
    },
    {
        title: 'Harry Potter: The Prisoner of Azkaban',
        year: '2004'
    },
    {
        title: 'Cinderella Story',
        year: '2004'
    },
    {
        title: 'Remember the Titans',
        year: '2000'
    },
    {
        title: 'Inception',
        year: '2010'
    }
]

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
    res.json(topTenMovies);
});

// Returning data about a single movie
app.get('/movies/:title', (req, res) => {
    res.json(topTenMovies.find((movie) => {
        return movie.title === req.params.title
    }));
});

// ----------Genre Requests----------
// Returning data about a genre by name
app.get('/genre/:name', (req, res) => {
    res.json(genres);
});

// ----------Directors Requests----------
// Returning data about directors by name
app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) => {
        return directors.name === req.params.name
    }));
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
app.put('/users/:username', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });

    let userUpdated = req.body;

    if (user) {
        user = userUpdated;
        res.status(201).send('The info for ' + req.params.username + ' has been updated.');
    } else {
        res.status(404).send(req.params.username + ' was not found.');
    }
});

// Allowing users to deregister
app.delete('users/:username', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });

    if (user) {
        users = users.filter((obj) => {
            return obj.username !== req.params.username
        });
        res.status(201).send(req.params.username + ' was successfully deregistered.');
    } else {
        res.status(404).send(req.params.username + ' was not found.');
    }
});

// ----------Favorites Requests----------
// Allowing users to add a movie to their favorites list
app.post('/users/:username/favorites/:title', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });

    user.push(req.params.title);
    res.status(201).send(req.params.title + ' was successfully added to ' + req.params.username + "'s favoite list.");
});

// Allowing users to remove a movie from their favorite list
app.delete('/users/:username/favorites/:title', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });

    user.pull(req.params.title);
    res.status(201).send(req.params.title + ' was successfully removed from ' + req.params.userame + "'s favorite list.");
});

// Error handler
// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     res.status(500).send('Something broke!');
// });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});