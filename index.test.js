const mockGatewayRequest = {
    resource: '/',
    path: '/',
    httpMethod: 'GET',
    headers:
    {
        Accept: '*/*',
    },
    queryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext:
    {
        resourceId: 'y',
        resourcePath: '/',
        httpMethod: 'GET',
        extendedRequestId: 'I=',
        requestTime: '18/Jun/2018:13:43:50 +0000',
        path: '/Development',
        accountId: '5',
        protocol: 'HTTP/1.1',
        stage: 'Development',
        requestTimeEpoch: 1529329430181,
        requestId: 'a',
        identity:
        {
            cognitoIdentityPoolId: null,
            cognitoIdentityId: null,
            apiKey: 'Z',
            cognitoAuthenticationType: null,
            userArn: null,
            apiKeyId: '9',
            userAgent: 'PostmanRuntime/7.1.5',
            accountId: null,
            caller: null,
            sourceIp: '192.255.160.118',
            accessKey: null,
            cognitoAuthenticationProvider: null,
            user: null
        },
        apiId: 't'
    },
    body: null,
    isBase64Encoded: false
}

function mockSlack(handledError, unhandledError) {
    if (handledError) {
        jest.mock('slack-node', () => {
            const Slack = function () {
                this.setWebhook = jest.fn()
                this.webhook = jest.fn((body, cb) => {
                    cb(new Error('Handled Slack Error'), 'Handled Slack Error')
                })
            }
            return Slack
        })
    }
    else if (unhandledError) {
        jest.mock('slack-node', () => {
            const Slack = function () {
                this.setWebhook = jest.fn()
                this.webhook = jest.fn((body, cb) => {
                    throw new Error('Unhandled Slack error')
                })
            }
            return Slack
        })
    }
    else {
        jest.mock('slack-node', () => {
            const Slack = function () {
                this.setWebhook = jest.fn()
                this.webhook = jest.fn((body, cb) => {
                    cb(null, 'Hello from Slack Mock')
                })
            }
            return Slack
        })
    }
}

mockSlack()

const lambda = require('./index').handler

const getCb = jest.fn((err, response) => {
    expect(response).toEqual({
        statusCode: 200,
        headers: { my_header: 'header_value' },
        body: '{"message":"hello from lambda"}',
        isBase64Encoded: false
    })
})
const postCb = jest.fn((err, response) => {
    expect(response).toEqual({
        statusCode: 200,
        headers: {},
        body: '{\"text\":\"Failed authentication on signin.amazonaws.com by: doejon with IP Address 156.190.254.18 at 2018-06-13T13:21:16Z\"}',
        isBase64Encoded: false
    })
})
const emptyPostCb = jest.fn((err, response) => {
    expect(response).toEqual({"body": "{\"text\":\"{Error Message} on {Event Source} by: {User Name} with IP Address {IP Address} at {Event Time}\"}", "headers": {}, "isBase64Encoded": false, "statusCode": 200})
})

test('testing GET request', () => {
    lambda(mockGatewayRequest, {}, getCb)
})

test('testing POST request - Good', () => {
    mockGatewayRequest.requestContext.httpMethod = 'POST'
    mockGatewayRequest.httpMethod = 'POST'
    mockGatewayRequest.body = '{\n "alert_name" : "Console Log Failures",\n "alert_description" : "search for console Log Failures",\n "edit_alert_link" : "https://match.loggly.com/alerts/edit/40628",\n "source_group" : "N/A",\n "query" : "ConsoleLogin.failure ",\n "num_hits" : 2,\n "owner_username" : "logglyview",\n "owner_subdomain" : "match",\n "owner_email" : "a.b@mail.nih.gov",\n "alert_snoozed" : false,\n "recent_hits" : [ "{\\"eventID\\":\\"e\\",\\"awsRegion\\":\\"us-east-1\\",\\"eventVersion\\":\\"1.05\\",\\"responseElements\\":{\\"ConsoleLogin\\":\\"Failure\\"},\\"sourceIPAddress\\":\\"156.190.254.18\\",\\"eventSource\\":\\"signin.amazonaws.com\\",\\"errorMessage\\":\\"Failed authentication\\",\\"requestParameters\\":null,\\"userAgent\\":\\"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0\\",\\"userIdentity\\":{\\"accessKeyId\\":\\"\\",\\"accountId\\":\\"6\\",\\"principalId\\":\\"A\\",\\"type\\":\\"IAMUser\\",\\"userName\\":\\"doejon\\"},\\"eventType\\":\\"AwsConsoleSignIn\\",\\"additionalEventData\\":{\\"LoginTo\\":\\"https://console.aws.amazon.com/guardduty\\",\\"MobileVersion\\":\\"No\\",\\"MFAUsed\\":\\"Yes\\"},\\"eventTime\\":\\"2018-06-13T13:21:16Z\\",\\"eventName\\":\\"ConsoleLogin\\",\\"recipientAccountId\\":\\"8\\"}", "{\\"eventID\\":\\"2\\",\\"awsRegion\\":\\"us-east-1\\",\\"eventVersion\\":\\"1.05\\",\\"responseElements\\":{\\"ConsoleLogin\\":\\"Failure\\"},\\"sourceIPAddress\\":\\"156.190.254.18\\",\\"eventSource\\":\\"signin.amazonaws.com\\",\\"errorMessage\\":\\"Failed authentication\\",\\"requestParameters\\":null,\\"userAgent\\":\\"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0\\",\\"userIdentity\\":{\\"accessKeyId\\":\\"\\",\\"accountId\\":\\"8\\",\\"principalId\\":\\"A\\",\\"type\\":\\"IAMUser\\",\\"userName\\":\\"doejon\\"},\\"eventType\\":\\"AwsConsoleSignIn\\",\\"additionalEventData\\":{\\"LoginTo\\":\\"https://console.aws.amazon.com/guardduty/home\\",\\"MobileVersion\\":\\"No\\",\\"MFAUsed\\":\\"Yes\\"},\\"eventTime\\":\\"2018-06-13T13:21:04Z\\",\\"eventName\\":\\"ConsoleLogin\\",\\"recipientAccountId\\":\\"8\\"}" ],\n "start_time" : "Jun 13 13:20:49",\n "end_time" : "Jun 13 13:30:49",\n "search_link" : "https://match.loggly.com/search/?terms=ConsoleLogin.failure&source_group=&savedsearchid=371158&from=2018-06-13T13%3A20%3A49Z&until=2018-06-13T13%3A30%3A49Z",\n "snooze_link" : "https://match.loggly.com/alerts/snooze/40628/?from=2018-06-13T13%3A20%3A49Z&until=2018-06-13T13%3A30%3A49Z"\n}'
    lambda(mockGatewayRequest, {}, postCb)
})

test('testing POST request - Handled Error', () => {
    jest.resetModules()
    mockSlack(true, false)
    var lambda = require('./index').handler
    lambda(mockGatewayRequest, {}, postCb)
})

test('testing POST request - Unhandled Error', () => {
    jest.resetModules()
    mockSlack(false, true)
    var lambda = require('./index').handler
    lambda(mockGatewayRequest, {}, postCb)
})

test('testing request with empty httpMethod', () => {
    jest.resetModules()
    mockSlack()
    mockGatewayRequest.requestContext = {}
    lambda(mockGatewayRequest, {}, getCb)
    mockGatewayRequest.requestContext.httpMethod = 'POST'
})

test('testing request with empty events', () => {
    jest.resetModules()
    mockSlack()
    mockGatewayRequest.body = '{\n "alert_name" : "Console Log Failures",\n "alert_description" : "search for console Log Failures",\n "edit_alert_link" : "https://match.loggly.com/alerts/edit/40628",\n "source_group" : "N/A",\n "query" : "ConsoleLogin.failure ",\n "num_hits" : 2,\n "owner_username" : "logglyview",\n "owner_subdomain" : "match",\n "owner_email" : "a.b@mail.nih.gov",\n "alert_snoozed" : false,\n "recent_hits" : [ ],\n "start_time" : "Jun 13 13:20:49",\n "end_time" : "Jun 13 13:30:49",\n "search_link" : "https://match.loggly.com/search/?terms=ConsoleLogin.failure&source_group=&savedsearchid=371158&from=2018-06-13T13%3A20%3A49Z&until=2018-06-13T13%3A30%3A49Z",\n "snooze_link" : "https://match.loggly.com/alerts/snooze/40628/?from=2018-06-13T13%3A20%3A49Z&until=2018-06-13T13%3A30%3A49Z"\n}'
    lambda(mockGatewayRequest, {}, emptyPostCb)
})