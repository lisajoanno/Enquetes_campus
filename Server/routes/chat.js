/**
 * Created by Lisa Joanno on 02/02/17.
 */

var express = require('express');
var router = express.Router();

/**
 * Le chat.
 */
router.get('/', function(req, res, next) {
    res.render('chat', { title: 'Chat' });
});

module.exports = router;
