// Import the dependencies for testing
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
var expect  = require('chai').expect;
var request = require('request');

// Configure chai
chai.use(chaiHttp)
chai.should()

const TEST_TIMEOUT = 5000;

describe('Application Health Tests', () => {

    it('Test is up', function() {
        assert.notStrictEqual('-', null)
    })

    it('Application Is Responsive', function(done) {
        this.timeout(TEST_TIMEOUT);
        request('http://localhost:4201' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
})