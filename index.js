const express = require('express'),
morgan = require('morgan');

const app = express();

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

// Returning top ten movies
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

// Returning welcome page
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// Error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});