var Slack = require("slack-node");
var webhookUri = `https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK_PATH}`;
 
var slack = new Slack();
slack.setWebhook(webhookUri);

// var geoip = require('geoip-lite');

// var ip = "156.190.216.3";
// var geo = geoip.lookup(ip);

// console.log(geo);

function formatGatewayResponse(statusCode, headers, body, isBase64Encoded) {
    return {
        statusCode,
        headers,
        "body": JSON.stringify(body),
        isBase64Encoded
    };
}

function getGenericResponse() {
    return formatGatewayResponse(200, {"my_header": "header_value"}, {"message": "hello from lambda"}, false);
}

function filterLogglyJson(logglyJson) {
    logglyJson = (logglyJson.recent_hits && logglyJson.recent_hits.length) ? logglyJson.recent_hits[0] : "{}";
    logglyJson = JSON.parse(logglyJson);
    return {
        errorMessage: logglyJson.errorMessage,
        sourceIPAddress: logglyJson.sourceIPAddress,
        eventSource: logglyJson.eventSource,
        userName: logglyJson.userIdentity && logglyJson.userIdentity.userName,
        eventTime: logglyJson.eventTime,
    };
}

function formatSlackMessage(body) {
    var errorMessage = body.errorMessage || "{Error Message}";
    var eventSource = body.eventSource || "{Event Source}";
    var userName = body.userName || "{User Name}";
    var sourceIPAddress = body.sourceIPAddress || "{IP Address}";
    var eventTime = body.eventTime || "{Event Time}";
    
    return `${errorMessage} on ${eventSource} by: ${userName} with IP Address ${sourceIPAddress} at ${eventTime}`;
}

function postToSlack(message) {
    try {
        slack.webhook({ channel: "#webhook-test", text: message}, function(err, response) {
            if (err) {
                console.log("SLACK ERROR:", err);
            }
            console.log("SLACK RESPONSE:", response);
        });
    }
    catch (e) {
        console.log("SLACK FAILED");
    }
}

exports.handler = (input, context, callback) => {
    // console.log("IN FROM GATEWAY:", input);
    var response = {};
    var requestType = input.requestContext && input.requestContext.httpMethod;
    
    if (!requestType || requestType === "GET") {
        response = getGenericResponse();
    }
    else {
        // parse the body that comes in as a string
        var logglyJson = JSON.parse(input.body || "{}");
        var filteredJson = filterLogglyJson(logglyJson);
        var slackMessage = formatSlackMessage(filteredJson);
        postToSlack(slackMessage);
        response = formatGatewayResponse(200, {}, {text: slackMessage}, false);
    }
    
    callback(null, response);
};