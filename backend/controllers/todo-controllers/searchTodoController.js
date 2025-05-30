const esClient = require('../../elastic-search/elasticSearch');

module.exports.searchTodos = async (req, res) => {
    const {query} = req.query;
    const userId = req.userId;

    try {
        const result = await esClient.search({
            index: 'todo-mern-auth-todos',
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query,
                                fields: ['task', 'description'],
                            }
                        }
                    ],
                    filter: {
                        term: {
                            userId: userId.toString(),
                            // filter results to ONLY return todos where userId
                            // matches the logged-in user
                            // ** highlly important, avoid users from seeing other
                            // user's todos
                        }
                    }
                }
            }
        });

        const hits = result.hits.hits.map(hit => ({
            ...hit._source,
            _id: hit._id,
        }));
        
        res.status(200).json(hits);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error searching todos",
            error: error.message,
        });
    }
}
