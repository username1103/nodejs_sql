const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const template = require("./lib/template");
const topic = require("./lib/topic");
const author = require("./lib/author");

const baseDir = __dirname;

const app = http.createServer(function (req, res) {
  let pathname = url.parse(req.url, true).pathname;

  if (pathname === "/") {
    topic.page(req, res);
  } else if (path.basename(req.url) === "style.css") {
    fs.readFile(path.join(baseDir, path.basename(pathname)), (err, file) => {
      res.writeHead(200);
      res.write(file);
      res.end();
    });
  } else if (pathname === "/create") {
    topic.create(req, res);
  } else if (pathname === "/create_process") {
    topic.create_process(req, res);
  } else if (pathname === "/update") {
    topic.update(req, res);
  } else if (pathname === "/update_process") {
    topic.update_process(req, res);
  } else if (pathname === "/delete_process") {
    topic.delete_process(req, res);
  } else if (pathname === "/author") {
    author.home(req, res);
  } else if (pathname === "/author/create_process") {
    author.create_process(req, res);
  } else if (pathname === "/author/update") {
    author.update(req, res);
  } else if (pathname === "/author/update_process") {
    author.update_process(req, res);
  } else if (pathname === "/author/delete_process") {
    author.delete_process(req, res);
  } else if (pathname === "/search_process") {
    topic.search_process(req, res);
  } else {
    res.writeHead(404);
    let html = template.getNotFound;
    res.end(html);
    return;
  }
});
app.listen(3000);
