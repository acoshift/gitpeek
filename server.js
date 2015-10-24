var express = require('express');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var octonode = Promise.promisifyAll(require('octonode'));

var app = express();

// api
app.get('/data/:user', function(req, res) {
	var client = octonode.client();
	var ghuser = client.user(req.params.user);
	var obj = {};

	ghuser.infoAsync()
		.then(function(x) {
			obj.name = x[0].name;
			obj.avatar = x[0].avatar_url;
			obj.bio = x[0].bio;
			return ghuser.followersAsync();
		})
		.then(function(x) {
			obj.followers = [];
			x[0].forEach(function (element, index, array) {
				obj.followers.push({'name': element.login, 'url': element.html_url});
			});
			return ghuser.reposAsync();
		}).then(function(x) {
			obj.repos = [];
			x[0].forEach(function (element, index, array) {
				obj.repos.push({'name': element.name, 'url': element.html_url});
			});
			res.json(obj);
		});
});

// html
app.get('/', function (req, res) {
	fs.readFileAsync('./views/index.html')
		.then(function(html) {
			res.writeHeader(200, {'Content-Type': 'text/html'});
			res.end(html);
		});
});

console.log('Server start at http://localhost:8888');
app.listen(8888);
