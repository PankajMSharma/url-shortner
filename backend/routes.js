var express = require('express');
const routes = express.Router();
const UrlsController = require('./controller/urls.controller')

routes.get('/', UrlsController.getAll)

routes.post('/url', UrlsController.create);

routes.get('/:shortUrlCode', UrlsController.clickedLink);

module.exports = routes;