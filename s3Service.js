var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

var Bucket = process.argv[2];
var Key = process.argv[3];
var action = process.argv[4];

var uploadParams = {
    Bucket,
    Key
}

if (action === "list") {
    // List Objects **************************
    s3.listObjects({Bucket}, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
    // **************************
}

if (action === "get") {
    // Get Object **************************
    s3.getObject({ Bucket, Key}, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
            console.log(data.Body.toString("utf-8"));
            console.log(JSON.parse(data.Body.toString("utf-8")));
        }
    });
    // **************************
}

if (action.indexOf("upload=file") > -1) {
    // Upload File **************************
    var file = action.split("=")[2];
    var fs = require("fs");
    var fileStream = fs.createReadStream(file);
    fileStream.on("error", function (err) {
        console.log("File Error", err);
    });
    uploadParams.Body = fileStream
    // **************************
}

if (action.indexOf("upload=json") > -1) {
    // Upload JSON **************************
    var json = action.split("=")[2];
    var buf = Buffer.from(JSON.stringify({
        test: "Hello from AWS SDK"
    }));
    uploadParams.Body = buf;
    // **************************
}

if (action.indexOf("upload") > -1) {
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}