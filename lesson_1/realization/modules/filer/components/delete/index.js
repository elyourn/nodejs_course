const fs = require('fs');
const path = require('path');
const SETTINGS = require('settings');

const remove = {
	filePath: '',
	contentLength: 0
}
let getFileName = () => {};

const fileLoad = {
	init: function init ({url, fileLength, end}) {
		getFileName = ((str) => {
			const name = str ? str.split('/') : '';
			return () => name[name.length - 1]
		})(url);

		remove.filePath = path.join(SETTINGS.PATH, `files/${getFileName()}`);
	    remove.contentLength = fileLength;

	    this.removeFile(end)

	    return this;
	},
	removeFile: function removeFile(end) {
		fs.unlink(remove.filePath, (err) => {
			if (err) {
				end(err.toString());
			}
			end(`${getFileName()} is removed`);
		});
	}
}


module.exports = fileLoad;