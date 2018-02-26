const load = require('./components/load');
const upload = require('./components/upload');
const remove = require('./components/delete');
const ACTIONS = require('./constants').ACTIONS;

const actions = {
	[ACTIONS.LOAD]: load,
	[ACTIONS.UPLOAD]: upload,
	[ACTIONS.REMOVE]: remove,
}

const init = ({action, url, filename, fileLength, end}) => {
	return actions[action].init({
		action,
		url,
		filename,
		fileLength,
		end
	});
}

exports.ACTIONS = ACTIONS;
exports.init = init;