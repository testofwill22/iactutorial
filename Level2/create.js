import * as uuidgen from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {

    console.log("event");
    console.log(event);

    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    console.log("data:");
    console.log(data);
    console.log("data.content");
    console.log(data.content);

    const params = {
        TableName: process.env.demoTableName,
        Item: {
            pk: uuidgen.v4(),
            content: data.content
        }
    };

    console.log("params");
    console.log(params);

    dynamoDb.put(params, (error, data) => {
        // Set response headers to enable CORS (Cross-Origin Resource Sharing)
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        // Return status code 500 on error
        if (error)
        {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false, errormsg: error })
            };
            callback(null, response);
            return;
        }

        // Return status code 200 and the newly created item
        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    });
}