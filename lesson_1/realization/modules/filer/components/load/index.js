const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const SETTINGS = require('settings');

const load = {
	filePath: '',
	stream: {},
	contentLength: 0,
	uploadedLength: 0,
	file: ''
}
let getFileName = () => {};

const fileLoad = {
	init: function init ({url, fileLength, end}) {
		getFileName = ((str) => {
			const name = str ? str.split('/') : '';
			return () => name[name.length - 1]
		})(url);

		load.filePath = path.join(SETTINGS.PATH, `files/${getFileName()}`);
	    load.stream = fs.createReadStream(load.filePath);
	    load.contentLength = fileLength;

	    this.readStream().closeHandler(end).errorHandler(end);

	    return this;
	},
	getContentTypeHeader: function getContentTypeHeader () {
		return mime.lookup(load.filePath);
	},
	readStream: function addFragment () {
		load.stream.on('readable', function() {
			let data = load.stream.read();
			if (data) {
				load.file += data;
				load.uploadedLength += data.length;
			}
		});

		return this;
	},
	close: function close () {
		load.stream.close();
	},
	closeHandler: function closeHandler(end) {
		load.stream.on('close', () => {
			end(load.file)
		});

		return this;
	},
	errorHandler: function errorHandler(end) {
		load.stream.on('error', (err) => {
			console.log(err)
      		end(err.toString());
    	});

    	return this;
	},
	getStream: function getStream() {
		return load.stream;
	}
}


module.exports = fileLoad;