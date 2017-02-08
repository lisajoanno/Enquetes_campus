/**
 * Created by Lisa Joanno on 06/02/17.
 */

'use strict';
var app = require('./../app');
var chai = require('chai');
chai.use(require('chai-http'));

var expect = chai.expect;
var ObjectID = require('mongodb').ObjectID;

describe('TEAM', function () {

    it('POST of a new team on /team', function () {
        return chai.request(app)
            .post('/team')
            .send({teamName: "agagaga"})
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.not.be.null;
                var a = (ObjectID(res.body));
                expect(ObjectID.isValid(a)).to.be.true;
            });
    });

    it('GET of empty /team/all', function () {
        return chai.request(app)
            .get('/team/all')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.empty;
            });
    });

    it('GET of not empty /team/all', function () {

        return chai.request(app)
            .post('/team')
            .send({teamName: "agagaga"})
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.not.be.null;
                var a = (ObjectID(res.body));
                expect(ObjectID.isValid(a)).to.be.true;
            });
    });
});
