const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
    }
});

module.exports = esClient;
