var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var libMookit = require('./lib/lib-mookit');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mookit = new libMookit.Mookit({});
var lastActiveUserlist = null;

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/users', function (req, res) {
    mookitSession.getActiveUsers(function (users) {
        if (users) {
            res.json(users);
        } else {
            res.json();
        }
    });
});

app.post('/api/auth', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        mookit.authenticate({username: username, password: password}, function (u) {
            if (u) {
                res.json({code: 0, msg: u});
            } else {
                res.json({code: -1, msg: 'Not authorized'});
            }
        });
    } else {
        res.json({code: -1, msg: "username and/or password not specified"});
    }
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});