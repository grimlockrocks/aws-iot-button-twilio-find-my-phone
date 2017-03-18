/*
 * AWS IoT Button Demo
 * Author: Sheng Bi
 */

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const https = require('https');
const queryString = require('querystring');

const doc = new AWS.DynamoDB.DocumentClient();

const TWILIO_ACCOUNT_SID = '<Your_Twilio_Account_Sid>';
const TWILIO_AUTH_TOKEN = '<Your_Twilio_Auth_Token>';

/*
 * The following JSON template shows what is sent as the payload:
{
    "serialNumber": "GXXXXXXXXXXXXXXXXX",
    "batteryVoltage": "xxmV",
    "clickType": "SINGLE" | "DOUBLE" | "LONG"
}
 *
 * A "LONG" clickType is sent if the first press lasts longer than 1.5 seconds.
 * "SINGLE" and "DOUBLE" clickType payloads are sent for short clicks.
 *
 * For more documentation, follow the link below.
 * http://docs.aws.amazon.com/iot/latest/developerguide/iot-lambda-rule.html
 */

exports.handler = (event, context, callback) => {
    console.log("Received event: ", event.clickType);

    var now = new Date();
    var ddbRequest = {
        TableName: "iot_button",
        Item: {
            "timestamp": now.toUTCString(),
            "click": event.clickType
        }
    };
    doc.put(ddbRequest, function(e1, d1) {
        if (e1) {
            console.log("Failed to save data to DynamoDB: " + e1, e1.stack);
            context.done();
        } else {
            console.log("Successfully saved data to DynamoDB");
            if ("LONG" === event.clickType) {
                // See: https://www.twilio.com/docs/api/rest/making-calls
                var message = {
                    To: "+12068903708", 
                    From: "+12065576155",
                    Url: "https://demo.twilio.com/welcome/voice/"
                };
                var messageString = queryString.stringify(message);
                var options = {
                    host: "api.twilio.com",
                    port: 443,
                    path: "/2010-04-01/Accounts/" + TWILIO_ACCOUNT_SID + "/Calls.json",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(messageString),
                        "Authorization": "Basic " + new Buffer(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN).toString("base64")
                    }
                };
                var request = https.request(options, (res) => {
                    var responseData = "";
                    res.on("data", (d) => {
                        responseData += d;
                    });
                    res.on("end", function () {
                        console.log("Twilio response data: " + responseData);
                        context.succeed();
                    });
                });
                request.on("error", (e2) => {
                    console.log("Failed to send request to Twilio: " + e2, e2.stack);
                    context.done();
                });
                request.write(messageString);
                request.end();
            }
        }
    });
};
