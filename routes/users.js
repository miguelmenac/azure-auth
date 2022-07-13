// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;


/* 

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();

var fetch = require('../fetch');

var { GRAPH_ME_ENDPOINT } = require('../authConfig');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    const session = JSON.parse(Buffer.from(req.query.session, 'base64').toString());
    if (!session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.get('/id',
    isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
    }
);

router.get('/profile',
    // isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        try {
            
            const session = JSON.parse(Buffer.from(req.query.session, 'base64').toString());
            
            const graphResponse = await fetch(GRAPH_ME_ENDPOINT, session.accessToken);
            // res.render('profile', { profile: graphResponse });
            res.json({ profile: graphResponse });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/prueba', function (req, res, next) {
    res.json({ json: 'poveda' })
})

module.exports = router;