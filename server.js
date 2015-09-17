require('node-jsx').install({ extension: ".jsx" });

var express = require('express');
var React = require('react');
var fs = require('fs');

var app = express();

// api
app.get('/data/:user', function (req, res) {
	var client = require('octonode').client();
	var ghuser = client.user(req.params.user);

	ghuser.info(function (err, body, header) {
		var obj = {};
		obj.name = body.name;
		obj.avatar = body.avatar_url;
		obj.bio = body.bio;

		ghuser.followers(function (err, body, header) {
			obj.followers = [];
			body.forEach(function (element, index, array) {
				obj.followers.push({'name': element.login, 'url': element.html_url});
			});

			ghuser.repos(function (err, body, header) {
				obj.repos = [];
				body.forEach(function (element, index, array) {
					obj.repos.push({'name': element.name, 'url': element.html_url});
				});

				res.json(obj);
			});
		});
	});
});

// html
app.get('/', function (req, res) {
	fs.readFile('./views/index.html', function (err, html) {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.end(html);
	});
});

app.listen(8888);
