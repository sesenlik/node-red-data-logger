# node-red-contrib-data-logger

A <a href="http://nodered.org" target="_new">Node-RED</a> Node that logs data stored in JSON object into a CSV file with columns extracted from JSON object..

## Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-data-logger

## Usage

* Data to be logged should be passed in `msg.payload` as a JSON object. The header row will	be populated with the property names of the JSON object on log file creation. 
* The Columns property in node properties can be used as a filter if filled with JSON object's property names as comma separated string. If left empty, all properties of JSON object in `msg.payload` will be logged to file.
* `msg.path` should be passed in for setting the location where the file will be logged into.
* `msg.fileName` should be passed in to set the file name of the log file.

## Example Flow

[{"id":"88258a55.901628","type":"inject","z":"3c62c132.455f6e","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":440,"y":480,"wires":[["54f959e1.e9fc88"]]},{"id":"54f959e1.e9fc88","type":"function","z":"3c62c132.455f6e","name":"Log Data","func":"var logPath = \".\";\nvar folderName = \"DataLog\\\\TestData\";\nmsg.path = logPath + \"\\\\\" + folderName;\nmsg.fileName = \"testFile\";\n\nvar data = {};\n\nfor (var i = 0; i < 10; i++){\n    data[\"Data\"+i] = i*10;\n}\n\nmsg.payload = data;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":660,"y":480,"wires":[["dbb8420e.ee474"]]},{"id":"dbb8420e.ee474","type":"data-logger","z":"3c62c132.455f6e","name":"","columns":"","parentDir":"","enableBuffering":"0","bufferSize":10,"bufferTimeout":1,"enableDateColumn":"1","seperator":",","x":880,"y":480,"wires":[]}]