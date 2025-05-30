const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
    }
});

module.exports = esClient;
