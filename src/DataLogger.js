var fs = require('fs');

class  DataLogger{
    #filePath = "";
    #fileName = "";
    #fileExtension = ".csv";
    #columns = [];
    #strColumns = "";
    #path = "";
    #triggerTime = 0;
    #enableBuffering = false;
    #bufferSize = 0;
    #bufferCounter = 0;
    #bufferedCSVStr = "";
    #bufferTimeout = 0;
    #timer = 0;
    #name = "[DataLogger]-";
    #addRecDate = false;
	#seperator = ",";
    constructor(columns, enableBuffering, bufferSize, bufferTimeout, addRecDate, seperator){
        this.#strColumns = columns;
        this.#enableBuffering = enableBuffering;
        this.#bufferSize = bufferSize;
        this.#bufferTimeout = bufferTimeout;
        this.#addRecDate = addRecDate;
		this.#seperator = seperator;       
    }

    timerTick(timer){
        var elapsedTime = (new Date() - this.#triggerTime) / 1000;
        if (elapsedTime >= this.#bufferTimeout){
            this.writeLineToCSV(this.#bufferedCSVStr);
            this.#bufferedCSVStr = "";
            this.#bufferCounter = 0;
            clearInterval(timer);
        }
    }
    appendLine(obj,folderName,fileName){
        var startTime = new Date();
        this.#triggerTime = startTime;
        var retVal;
        retVal = this.createLogDir(folderName);
        if (!retVal){
            return;
        }
        retVal = this.createLogFile(fileName,obj);
        if (!retVal){
            return;
        }
        var data = this.getDataFromJSON(obj,this.#columns);

        if (this.#enableBuffering){
            if (data.length > 0){
                this.#bufferedCSVStr += this.arrayToCSVString(data);
                this.#bufferCounter += 1;
            }
            if (this.#bufferCounter >= this.#bufferSize) {
                this.writeLineToCSV(this.#bufferedCSVStr);
                this.#bufferedCSVStr = "";
                this.#bufferCounter = 0;
            }
        }else {
            if (data.length > 0){
                var csvStr = this.arrayToCSVString(data);
                this.writeLineToCSV(csvStr);
            }
        }

        var endTime = new Date();
        var execTime = (endTime - startTime) /1000;
        if (this.#enableBuffering){
            var that = this;
            var timer = setInterval(function(){that.timerTick(timer);},10);          
        }
    }
    
    createLogDir(dirPath){
        this.#filePath = dirPath; 
        try {
            if (!fs.existsSync(this.#filePath)) {
                fs.mkdirSync(this.#filePath,{ recursive: true });
            }
            return true;
        } catch (error) {
            var msg = "[ERROR] Name: " + error.name + ", Message: " + error.message + ", Stack: " + error.stack + ".";           
            console.log(this.#name + "Error caught while creating directory.\n" + msg);
            return false;
        }
    }
    createLogFile(fileName,obj){
        this.#filePath = this.#filePath + "\\" + fileName + this.#fileExtension; 
        try {
            if (!fs.existsSync(this.#filePath)) {
                fs.writeFileSync(this.#filePath, "");
                var retVal = this.checkIfColumnsExist(obj);
                if (!retVal){
                    throw("Keys of the object does not match with the keys entered.");
                }else{
                    var cols = this.#strColumns.split(",").join(this.#seperator);

                    if (cols == "" || cols == undefined) {
                        cols = Object.keys(obj).join(this.#seperator);
                    }

                    if (this.#addRecDate) {                        
                        cols = cols + this.#seperator + "Date";
                    }

                    var retVal = this.writeLineToCSV(cols + "\n");

                    if (!retVal){
                        throw("Unable to write columns line to file.");
                    }
                }
            }
            this.checkIfColumnsExist(obj);
            return true;
        } catch (error) {
            var msg = "[ERROR] Name: " + error.name + ", Message: " + error.message + ", Stack: " + error.stack + ".";           
            console.log(this.#name + "Error caught while creating file.\n" + msg);
            return false;
        }
    }

    checkIfColumnsExist(obj){
        try {
            var keys = Object.keys(obj);
            if (this.#strColumns != "" && this.#strColumns != undefined) {
                var retVal = this.splitColumns(this.#strColumns);
                if (retVal && this.#columns != null && this.#columns.length > 0) {
                    var intersectArray = this.intersect(this.#columns,keys);
                    if (intersectArray.length == this.#columns.length) {
                        return true;
                    }else{
                        return false;
                    }
                    
                }else {
                    return false;
                }
            }else {
                this.#columns = keys;
                return true;
            }
            
        } catch (error) {
            
        }
        
    }

    intersect(a, b) {
        var t;
        if (b.length > a.length) t = b, b = a, a = t;
        return a.filter(function (e) {
            return b.indexOf(e) > -1;
        });
    }

    writeLineToCSV(line){
        try {
            fs.appendFileSync(this.#filePath,line);
            return true;
        } catch (error) {
            var msg = "[ERROR] Name: " + error.name + ", Message: " + error.message + ", Stack: " + error.stack + ".";           
            console.log(this.#name + "Error caught while writing to logfile.\n" + msg);
            return false;
        }
    }
    splitColumns(_str){
        try {
            this.#columns = _str.split(",");
            this.#strColumns = _str;
            return true;
        } catch (error) {
            var msg = "[ERROR] Name: " + error.name + ", Message: " + error.message + ", Stack: " + error.stack + ".";           
            console.log(this.#name + "Error caught while getting JSON columns.\n" + msg);
            return false;
        }     
    }
    
    getDataFromJSON(obj, columns){
        var _array = [];
        try {
            for (var i = 0, len = columns.length; i < len; i++) {
                _array.push(obj[columns[i]]);
            }
            if (this.#addRecDate) {
                _array.push(this.getDateTimeString(new Date()));
            }
            return _array;
        } catch (error) {
            var msg = "[ERROR] Name: " + error.name + ", Message: " + error.message + ", Stack: " + error.stack + ".";           
            console.log(this.#name + "Error caught while getting JSON data.\n" + msg);
            return [];
        }
    }

    arrayToCSVString(_array){
        try {
            var csvStr = _array.join(this.#seperator) + "\n";
            return csvStr;
        } catch (error) {
            var msg = "[ERROR] Name: " + error.name + ", Message: " + error.message + ", Stack: " + error.stack + ".";           
            console.log(this.#name + "Error caught while converting JSON data to CSV string.\n" + msg);
        }
        
    }

    pad (str, max) {
        str = str.toString();
        return str.length < max ? this.pad("0" + str, max) : str;
    }
    
    getDateTimeString(dt){   
        var day = this.pad(dt.getDate(),2);
        var month = this.pad(dt.getMonth()+1,2);
        var year = this.pad(dt.getFullYear(),4);
        var hours = this.pad(dt.getHours(),2);
        var minutes = this.pad(dt.getMinutes(),2);
        var seconds = this.pad(dt.getSeconds(),2);
        var mseconds = this.pad(dt.getMilliseconds(),3);
        
        var strDate = day + "-" + month + "-" + year;
        var strTime = hours + ":" + minutes + ":" + seconds + "." + mseconds;
        
        return strDate + " " + strTime;
    }

}

module.exports = DataLogger
