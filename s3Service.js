var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// var bucketParams = {
//     Bucket: "loggly-ips"
// };

// s3.listObjects(bucketParams, function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Success", data);
//     }
// });

var params = {
    Bucket: "loggly-ips",
    Key: "jest.config.js"
};

s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else { 
        console.log(data.Body.toString('utf-8'));
        handleS3Object(JSON.parse(data.Body.toString('utf-8')))
    }
});

function handleS3Object (object) {
    console.log('here', object.collectCoverageFrom);
}

/** 
 * For uploading a file
*/
// var fs = require("fs");
// var fileStream = fs.createReadStream('./jest.config.js');
// fileStream.on("error", function (err) {
//     console.log("File Error", err);
// });
// bucketParams.Body = fileStream;
// bucketParams.Key = "jest.config.js";

/** 
 * For uploading an object from json
*/
// var uploadParams = {
//     Bucket: "loggly-ips",
//     Key: "jest.config.js",
//     Body: ""
// }

// var buf = Buffer.from(JSON.stringify({
//     verbose: true,
//     rootDir: './',
//     collectCoverage: true,
//     collectCoverageFrom: [
//         "*.{js,jsx}",
//         "!**/node_modules/**",
//         "!**/vendor/**",
//         "!index.test.js",
//         "!jest.config.js"
//     ],
//     coverageDirectory: "coverage",
//     coverageReporters: ["lcov"]
// }));

// uploadParams.Body = buf;

// s3.upload(uploadParams, function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } if (data) {
//         console.log("Upload Success", data.Location);
//     }
// });