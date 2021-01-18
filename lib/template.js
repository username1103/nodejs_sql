const sanitizeHtml = require('sanitize-html');
const url = require('url');

module.exports = {
	getControl: function(id,req){
		let queryData = '';
		if(req !== ""){
			queryData = url.parse(req.url).query === null ? '' : `?${url.parse(req.url).query}`;
		}
		if (id === undefined) {
			return `<a href="/create">추가</a>`;
		} else {
			return `<a href="/create${queryData}">추가</a>
							<a href="/update${queryData}">수정</a>
							<form action="delete_process" method="post"class="deleteContainer">
							<input type="hidden" name="id" value="${id}">
							<input type="submit" value="삭제" class="deleteBtn">
							</form>`;
		}
	},
	getBody: function (title, description, author) {
			    return `<h2>${sanitizeHtml(title)}</h2>
									<p>${sanitizeHtml(description)}</p>
									by ${sanitizeHtml(author)}`;
	},
	getList: function (topics, queryData) {
		let _sort = queryData.sort === undefined ? '' : `&sort=${queryData.sort}`;
		let _search = queryData.search === undefined ? '' : `&search=${qureyData.search}`;
		let _page = queryData.page === undefined ? 0 : queryData.page;
		let _id = queryData.id  === undefined ? '' : `&id=${queryData.id}`;
		let href = '';
		let list = "<ul>";
		for (var i = _page*5; (i < ((_page * 5)+5)) && (i < topics.length); i++) {

			href = `"/?id=${topics[i].id}${_sort}${_search}${`&page=${_page}`}"`
			list += `<li><a href=${href}>${sanitizeHtml(topics[i].title)}</a></li>`;
		}
		list += "</ul><div>";
		for(var i = 0 ; i < Math.ceil(topics.length/5); i++){
			list += `<a href='/?page=${i}${_sort}${_search}${_id}'>${i+1}</a> `
		}
		list+="</div>"
		return list;
	},
	listSql : function(queryData){

		let sort = queryData.sort === undefined  ? '' : `ORDER BY ${sanitizeHtml(queryData.sort)}`;
		let search = queryData.search === undefined ? '' : `WHERE description like '%${sanitizeHtml(queryData.search)}%'`;	

		let sql = '';
		if(queryData.type === 'author'){
			sql = `SELECT * FROM author RIGHT JOIN topic ON topic.author_id = author.id WHERE name like '%${sanitizeHtml(queryData.search)}%' ${sort}`;
		} else {
			sql = `SELECT * FROM topic ${search} ${sort}`;
		}
		return sql;
	},
	authorSelect : function(authors, author=1){
		let list = "<select name='author'>";
		for(var i = 0 ; i < authors.length; i++){
			if(author === authors[i].id){
				list += `<option value='${authors[i].id}' selected>${sanitizeHtml(authors[i].name)}</option>`;
			} else {
				list += `<option value='${authors[i].id}'>${sanitizeHtml(authors[i].name)}</option>`;
			}
		}
		list += '</select>';
		return list;

	},
	authorList : function(authors, author=0){
		let tag = `<table class='author_table'>
								<tr>
									<td>이름</td>
									<td>직업</td>
									<td></td>
									<td></td>
								</tr>`;
		for(var i = 0; i < authors.length; i++){
			if(authors[i].id == author){
				tag += `<tr>
									<form action="update_process" method="post">
									<input type="hidden" name="id" value="${authors[i].id}">
									<td><input type="text" name="name" value="${authors[i].name}"></td>
									<td><textarea name="profile">${authors[i].profile}</textarea></td>
									<td colspan="2"><input type="submit"></td>
									</form>
								</tr>`;
			}	else {
				tag += `<tr>
								<td>${sanitizeHtml(authors[i].name)}</td>
								<td>${sanitizeHtml(authors[i].profile)}</td>
								<td><a href="/author/update?id=${authors[i].id}">수정</a></td>
								<td><form action="/author/delete_process" method="post">
											<input type="hidden" name="id" value="${authors[i].id}">
											<input type="submit" value="삭제" class="deleteBtn">
								</form></td>
							</tr>`;
			}
		}
		if(author === 0 ){
			tag += `<tr>
							<form action="author/create_process" method="post">
								<td><input type="text" name="name" placeholder="이름"></td>
								<td><textarea name="profile" placeholder="소개"></textarea></td>
								<td colspan="2"><input type="submit"></td>
							</form>
						</tr>`;
		}

		tag += "</table>";
		return tag;
	},
	getHTML: function (title, list, body, control, req="") {
		let queryData = '';
		if(req !== ""){
			queryData = url.parse(req.url).query === null ? '' : `&${url.parse(req.url).query}`;
		}
		return `<!doctype html>
					  <html>
						<head>
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>${title}</title>
							<meta charset="utf-8">
							<link rel="stylesheet" href="style.css">
						</head>
							<body>
								<h1 class="title"><a href="/">게시판</a></h1>
								<a href="/author">저자</a> <a href="/?sort=created${queryData}">시간순정렬</a> <a href="/?sort=title${queryData}">제목순정렬</a>
								<form action="search_process" method="get">
									<select name="type"><option value="title">제목</option><option value="author">저자</option></select>
									<input type="text" name="search">
									<input type="submit" value="검색">
								</form>
								${list}
								${control}
								${body}
							</body>
						</html>`;
	},
	getAuthorHTML: function (title, list, body, control) {
		return `<!doctype html>
					  <html>
						<head>
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>${title}</title>
							<meta charset="utf-8">
							<link rel="stylesheet" href="style.css">
						</head>
							<body>
								<h1 class="title"><a href="/">게시판</a></h1>
								<p><a href="/author">저자</a></p>
								${list}
								${control}
								${body}
							</body>
						</html>`;
	},
	getNotFound: `
		<!doctype html>
		<html>
			<head>
				<title>WEB1 - Error</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">메인으로 돌아가기</a></h1>
				<p>요청하신 페이지를 찾을 수 없습니다.</p>
			</body>
		</html>`,
};

