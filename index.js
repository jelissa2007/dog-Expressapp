'use strict';

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);
const db = require('./db');

app.get('/', (req, res) => {
    res.render('home', {
        locals: {
            title: "Dog Project"
        },
        partials: {
            head: '/partials/head',
            image: '/partials/image'
        }
    });
});

app.get('/dog-list', (req, res) => {
    res.render('dog-list', {
        locals: {
            dogs: db,
            path: req.path,
            title: "List of Dogs"
        },
        partials: {
            head: '/partials/head'
        }
    });
});

app.get('/dog-list/:name', async (req, res) => {
    console.log(req.path);
    const { name } = req.params;
    console.log(name);
    const dog = db.find((thisDog) => thisDog.name === name);
    if (dog) {
        console.log(dog);
        res.render('dog.html', {
            locals: {
                dog,
                title: 'Dog Profile'
            },
            partials: {
                head: '/partials/head',
                images: '/partials/image'
            },
        });

    } else {
        res.status(404)
            .send(`No dog found with name '${name}'`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
