#!/usr/bin/env node

// this script is to remove stale documents from Elastic Search index.
// without this script, stale documents will remain in the index even they have
// been removed from database

// this script is to be run once in a while, not on every server start

// currently, this should scan through the whole index (all users data)
// could be changed to scan through a single user's data if needed 
// (doesnt make too much sense though)

const mongoose = require("mongoose");
const esClient = require("../elastic-search/elasticSearch");
const todoModel = require("../database/models/todoModel");

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        const mongoTodos = await todoModel.find({}, "_id");
        const mongoIds = new Set(mongoTodos.map(todo => todo._id.toString()));

        const esResults = await esClient.search({
            index: "todo-mern-auth-todos",
            size: 10000, //number os results, could change based on requirement
            query: {
                match_all: {}
            }
        });

        const esTodos = esResults.hits.hits;

        let deletedCount = 0;
        for (const todo of esTodos) {
            const esId = todo._id;

            if (!mongoIds.has(esId)) {
                await esClient.delete({
                    index: "todo-mern-auth-todos",
                    id: esId
                });
                console.log(`🗑️ Deleted stale ES todo with ID: ${esId}`);
                deletedCount++;
            }
        }

        console.log(`Cleanup done! Deleted ${deletedCount} stale todos.`);
    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await mongoose.disconnect();
    }
})();
