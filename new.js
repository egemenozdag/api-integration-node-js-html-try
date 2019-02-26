var express = require('express');
var gplay = require('google-play-scraper');
var searchitunes = require('searchitunes');
var http = require('http'), url = require('url');

var api = express();

var t = ["os", "app_id", "country"];


api.get('/', async function (req, res) {

    var query = url.parse(req.url, true).query;
    var sth = JSON.stringify(query, t);
    var som = JSON.parse(sth);

    var app_data = {};

    if (som.os == 'Android') {
        var temp = await gplay.app({ appId: som.app_id, countryCode: som.country }).catch(
            function(error) {
                res.write('Error: App not found.');
            }
        );

        app_data['title'] = temp['title']
        app_data['url'] = temp['url']
        app_data['score'] = temp['score']
    }

    if (som.os == 'iOS') {
        var temp = await searchitunes({ id: som.app_id, countryCode: som.country }).catch(
            function(error) {
                res.write('Error: App not found.');
            }
        );

        app_data['title'] = temp['trackCensoredName']
        app_data['url'] = temp['trackViewUrl']
        app_data['score'] = temp['averageUserRating']
    }

    res.send(app_data);
    res.end();
})
api.listen(3333, function () { console.log('Running at port 3333'); });

