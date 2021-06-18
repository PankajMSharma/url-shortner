// Import the dependencies for testing
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
var expect  = require('chai').expect;
var request = require('request');

const { convertIdToShortURL } = require('../utils/url-converter')

require('dotenv').config({ path: './.env' });


// Configure chai
chai.use(chaiHttp)
chai.should()

const TEST_TIMEOUT = 5000;

const BACKEND_URL = `http://${process.env.BACKEND_HOSTNAME}:${process.env.BACKEND_PORT}/`

describe('Application Health Tests', () => {

    it('Application Is Responsive', function() {
        this.timeout(TEST_TIMEOUT);
        request(BACKEND_URL , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
})

describe('Test request Endpoints', () => {
    it('Create URL Successful', function() {
        this.timeout(TEST_TIMEOUT);

        const randomNumber = Math.floor(Math.random() * (1000000 - 1000) + 1000);
        const requestBody = { longUrl: `https://${randomNumber}.com` }

        chai.request(BACKEND_URL)
            .post('url')
            .set('Content-type', 'application/json')
            .send(requestBody)
            //.expect(201)
            .end(function(error, response, body) {
                expect(response.statusCode).to.equal(201);
            });
    });

    it('Sending empty body to create', async function() {
        this.timeout(TEST_TIMEOUT);

        const requestBody = { longUrl: '' }

        let response = await chai.request(BACKEND_URL)
            .post('url')
            .set('Content-type', 'application/json')
            .send(requestBody);

        response.should.have.status(400)

        response = await chai.request(BACKEND_URL)
            .post('url')
            .set('Content-type', 'application/json')
            .send({});

        response.should.have.status(400)
    });
})

describe('Convert numeric id to shortUrl', () => {
    it('Non numeric value to create base64', async function() {
        
        this.timeout(10000);
        let error = null
        try {
            await convertIdToShortURL()
        }
        catch (err) {
            error = err
        }
        expect(error).to.be.an('Error')
    })

    it('Numeric value to create base64', async function() {
        this.timeout(10000);
        let url;
        url = await convertIdToShortURL(1)
        expect(url).to.equal('1')
    })
})