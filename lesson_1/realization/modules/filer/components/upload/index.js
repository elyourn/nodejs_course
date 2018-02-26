const fs = require('fs');
const path = require('path');
const SETTINGS = require('settings');

const upload = {
	filePath: '',
	stream: {},
	contentLength: 0,
	uploadedLength: 0
}
let getFileName = () => {};

const fileUpload = {
	init: function init ({url, fileLength, end}) {
		getFileName = ((str) => {
			const name = str ? str.split('/') : '';
			return () => name[name.length - 1]
		})(url);

		upload.filePath = path.join(SETTINGS.PATH, `files/${getFileName()}`);
	    upload.stream = new fs.createWriteStream(upload.filePath);
	    upload.contentLength = fileLength;

	    this.closeHandler(end).errorHandler(end);

	    return this;
	},
	addFragment: function addFragment (data) {
		upload.uploadedLength += data.length;
		upload.stream.write(data);
	},
	close: function close () {
		upload.stream.close();
	},
	closeHandler: function closeHandler(end) {
		upload.stream.on('close', () => {
			if (upload.contentLength === upload.uploadedLength) {
				end(`${getFileName()} is uploaded`)
			} else {
   				end(`${getFileName()} not fully loaded. Please try again.`)
			}
		});

		return this;
	},
	errorHandler: function errorHandler(end) {
		upload.stream.on('error', (err) => {
			console.log(err)
      		end(err.toString());
    	});

    	return this;
	}
}


module.exports = fileUpload;