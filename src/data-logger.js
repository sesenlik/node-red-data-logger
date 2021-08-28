module.exports = function(RED) {
    function DataLoggerNode(config) {
        RED.nodes.createNode(this,config);		
		this.columns = config.columns;
		this.enableBuffering = config.enableBuffering;
		this.bufferSize = config.bufferSize;
		this.bufferTimeout = config.bufferTimeout;
		this.enableDateColumn = config.enableDateColumn;
		this.seperator = config.seperator;
		
		var columns = this.columns;
		var enableBuffering = false;
		var enableDateColumn = false;
		if (this.enableBuffering == "1"){
			enableBuffering = true;
		}else{
			enableBuffering = false;
		}
		if (this.enableDateColumn == "1"){
			enableDateColumn = true;
		}else{
			enableDateColumn = false;
		}
		var bufferSize = parseInt(this.bufferSize);
		var bufferTimeout = parseFloat(this.bufferTimeout);
		
		var seperator = this.seperator;
		
        var node = this;
		
		const DataLogger = require('./DataLogger.js');
		var logger = new DataLogger(columns, enableBuffering, bufferSize, bufferTimeout, enableDateColumn, seperator);
		
        node.on('input', function(msg) {
            var data = msg.payload;
			var path = msg.path;
			var fileName = msg.fileName;
			logger.appendLine(data, path, fileName);
			
			node.send(msg);
        });
    }
    RED.nodes.registerType("data-logger",DataLoggerNode);
}