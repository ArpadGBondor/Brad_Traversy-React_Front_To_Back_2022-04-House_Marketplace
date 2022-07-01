require('dotenv').config();
const axios = require('axios');

exports.handler = async (event, context, callback) => {
    const notSupportedMethod = {
        statusCode: 405,
        body: 'ERROR-405: Method Not Allowed.',
    };

    if (event.httpMethod === 'GET') {
        return await handleGetRequest(event, context, callback);
    } else if (event.httpMethod === 'POST') {
        return notSupportedMethod;
    } else if (event.httpMethod === 'PUT') {
        return notSupportedMethod;
    } else if (event.httpMethod === 'DELETE') {
        return notSupportedMethod;
    } else {
        return notSupportedMethod;
    }
};

async function handleGetRequest(event, context, callback) {
    const { POSITIONSTACK_API_KEY, POSITIONSTACK_BASE_URL } = process.env;

    const { location } = event.queryStringParameters;
    if (!location) {
        return {
            statusCode: 400,
            body: 'ERROR-400: Bad Request.',
        };
    }
    try {
        const { data } = await axios(
            `${POSITIONSTACK_BASE_URL}forward?access_key=${POSITIONSTACK_API_KEY}&query=${location}`
        );
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: 'ERROR-500: Server Error.',
        };
    }

    //Just in case I forgot to return something somewhere, I send back server error
    return {
        statusCode: 500,
        body: 'ERROR-500: Server Error.',
    };
}
