const template = require("./template.js");
const db = require('./db.js');
const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

exports.page = function(req, res){
	let queryData = url.parse(req.url, true).query;	

	let sql = template.listSql(queryData);
	db.query(sql, (err, topics)=>{
		if(err) throw err;
	
		let list = template.getList(topics, queryData);
		let control = template.getControl(queryData.id, req);
		db.query('SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?',[queryData.id], (err2, result) => {
			if(err2) throw err2;

			let currentTopic = result[0];
      	
			let description = currentTopic === undefined ? "게시판입니다.": currentTopic.description;	
			let title = currentTopic === undefined ? "안녕하세요" : currentTopic.title;				
			let author = currentTopic === undefined ? "관리자" : currentTopic.name;
			let body = template.getBody(title, description, author);
			
			let html = template.getHTML(title, list, body, control, req);
			

			res.writeHead(200);
			res.end(html);

			});
		});
}
exports.create = function(req,res){
	let queryData = url.parse(req.url,true).query;		

	let sql = template.listSql(queryData);
	db.query(sql, (err,topics) =>{
		if(err) throw err;
		
		let list = template.getList(topics, queryData);

		db.query('SELECT * FROM author',(err2, authors) => {
			
			if(err2) throw err;

				 

				let body = `<h3>글쓰기</h3>
										<form action="create_process" method="POST">
										<p>제목 : <input type="text" name="title" placeholder="제목"></p>
										<p>
											작성자 : ${template.authorSelect(authors)}
										</p>
										<p>
											<textarea class="description" name="description" placeholder="내용"></textarea>
										</p>
										<p>
											<input type="submit">
										</p>
										</form>`;

				let html = template.getHTML('글쓰기',list, body, "");  
				res.writeHead(200);  
				res.end(html); 

		});
	});
}


exports.create_process = function(req,res){
	if (req.method === "POST") {
		let body = "";
		req.on("data", function (data) {
			body += data;

			if (body.length > 1e6) req.connection.destroy();
		});
		req.on("end", function () {
			let post = qs.parse(body);
			db.query('INSERT INTO topic(title,description,created,author_id) VALUES(?, ?,NOW(),?)',
				[post.title, post.description,post.author],
				(err,result) => {
					if(err) throw err;
					res.writeHead(302, { Location : `/?id=${result.insertId}`});
					res.end();
				});
			});
		}

}

exports.update = function(req,res){
	let queryData = url.parse(req.url, true).query;

	let sql = template.listSql(queryData);
	db.query(sql ,(err, topics) => {
			if(err) throw err;
			let list = template.getList(topics, queryData);


			db.query('SELECT * FROM topic WHERE id=?',[queryData.id],(err2, result)=>{
				
				if(err2) throw err2;
				db.query('SELECT * FROM author' , (err3 , authors) => {
					
					if(err3) throw err3;
					let currentTopic = result[0];
				
					let body = `<form action="update_process" method="POST">
												<input type="hidden" name="id" value="${currentTopic.id}">
												<p>제목 : <input type="text" name="title" value="${sanitizeHtml(currentTopic.title)}"></p>
												<p>
													작성자 : ${template.authorSelect(authors, currentTopic.author_id)}
												</p>
												<p>
													<textarea class="description" name="description">${sanitizeHtml(currentTopic.description)}</textarea>
												</p>
												<p>
													<input type="submit">
												</p>
												</form>`;
					let html = template.getHTML('수정하기', list, body, "");
					res.writeHead(200);
					res.end(html);
				});
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
					
			db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
				[post.title, post.description,post.author,post.id],
				(err, result)=>{
					if(err) throw err;
					res.writeHead(302, { Location : `/?id=${post.id}` });
					res.end();
				});	
		});
	}
}


exports.delete_process = function(req,res){
	if (req.method === "POST") {
		let body = "";
		req.on("data", function (data) {
			body += data;

			if (body.length > 1e6) req.connection.destroy();
		});
		req.on("end", function () {
			let post = qs.parse(body);

			db.query('DELETE FROM topic WHERE id=?', [post.id], (err, result)=>{
				if(err) throw err;
				res.writeHead(302, { Location: `/` });
				res.end();
			});
		});
	}
}


exports.search_process = function(req,res){
	if(req.method === "GET"){
		let queryData = url.parse(req.url,true).query;

		let type = queryData.type;
		let search = queryData.search;
		res.writeHead(302, { Location : `/?search=${encodeURI(search)}&type=${type}`});
		res.end();

	}
}

