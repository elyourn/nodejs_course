/**
 ЗАДАЧА - научиться работать с потоками (streams)
 Написать HTTP-сервер для загрузки и получения файлов
 - Все файлы находятся в директории files
 - Структура файлов НЕ вложенная.

 - Виды запросов к серверу
   GET /file.ext
   - выдаёт файл file.ext из директории files,

   POST /file.ext
   - пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   - если файл уже есть, то выдаёт ошибку 409
   - при превышении файлом размера 1MB выдаёт ошибку 413

   DELETE /file
   - удаляет файл
   - выводит 200 OK
   - если файла нет, то ошибка 404

 Вместо file может быть любое имя файла.
 Так как поддиректорий нет, то при наличии / или .. в пути сервер должен выдавать ошибку 400.

- Сервер должен корректно обрабатывать ошибки "файл не найден" и другие (ошибка чтения файла)
- index.html или curl для тестирования

 */

// Пример простого сервера в качестве основы

'use strict';

let url = require('url');
let fs = require('fs');
let path = require('path');

const Filer = require('./modules/filer');

const SERVER_PORT = 8080;

require('http').createServer(function(req, res) {

  let pathname = decodeURI(url.parse(req.url).pathname);
  console.log(req)
  switch(req.method) {
  case 'GET':
    if (pathname == '/') {
      // отдачу файлов следует переделать "правильно", через потоки, с нормальной обработкой ошибок
      fs.readFile(__dirname + '/public/index.html', (err, content) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(content);
      });
      return;
    }
  case 'POST':
    const uploader = Filer.init({
      action: Filer.ACTIONS.UPLOAD,
      url: req.url,
      fileLength: parseInt(req.headers['content-length'], 10),
      end: res.end.bind(res)
    })
  
    /**
      Начитка данных
    */
    req.on('data', (data) => {
      uploader.addFragment(data);
    });

    /**
      Окончание загрузки файла или щакрытие соединения
    */
    req.on('close', () => {
      uploader.close()
    });

    req.on('end', () => {
      uploader.close()
    });
    break;

  default:
    res.statusCode = 502;
    res.end("Not implemented");
  }

}).listen(SERVER_PORT);

console.log(`Server run on port ${SERVER_PORT}`)