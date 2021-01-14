const template = require("./template.js");
const db = require('./db.js');
const url = require('url');
const qs = require('querystring');

exports.home = function(req, res){
		
	db.query('SELECT * FROM topic', (err, topics)=>{
		if(err) throw err;
		
		db.query('SELECT * FROM author', (err2 ,authors) => {
			if(err2) throw err2;

			let list = template.getList(topics);
			let body = template.authorList(authors);
			let html = template.getHTML('authors', list, body, "");
			

			res.writeHead(200);
			res.end(html);
		});
	});
}


exports.create_process = function(req,res){
	if(req.method ==='POST'){
		let body = "";
		req.on("data", function (data) {
			body += data;

			if (body.length > 1e6) req.connection.destroy();
		});
		req.on("end", function () {
			let post = qs.parse(body);
			db.query('INSERT INTO author(name,profile) VALUES(?, ?)',
				[post.name, post.profile],
				(err,result) => {
					if(err) throw err;
					res.writeHead(302, { Location : `/author`});
					res.end();
				});
		});
	}
} 
exports.update = function(req,res){
	let queryData = url.parse(req.url,true).query;
	db.query('SELECT * FROM topic', (err, topics)=>{
		if(err) throw err;
		
		db.query('SELECT * FROM author', (err2 ,authors) => {
			if(err2) throw err2;

			let list = template.getList(topics);
			let body = template.authorList(authors, queryData.id);
			let html = template.getHTML('authors_update', list, body, "");
			

			res.writeHead(200);
			res.end(html);
		});
	});

}
exports.update_process = function(req,res){
 if (req.method === "POST") {
	let body = "";
	req.on("data", function (data) {
		body += data;

		if (body.length > 1e6) req.connection.destroy();
	});
	req.on("end", function () {
		let post = qs.parse(body);					
		db.query('UPDATE author SET name=?, profile=? WHERE id=?',
			[post.name, post.profile,post.id],
			(err, result)=>{
				if(err) throw err;
				res.writeHead(302, { Location : `/author` });
				res.end();
			});	
	});
 }
}

exports.delete_process = function(req, res){
	if (req.method === "POST") {
		let body = "";
		req.on("data", function (data) {
			body += data;

			if (body.length > 1e6) req.connection.destroy();
		});
		req.on("end", function () {
			let post = qs.parse(body);

			db.query('DELETE FROM author WHERE id=?', [post.id], (err, result)=>{
				if(err) throw err;
				res.writeHead(302, { Location: `/author` });
				res.end();
			});
		});
	}
}

