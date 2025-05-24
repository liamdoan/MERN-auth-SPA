const todoModel = require('../../database/models/todoModel');

module.exports.getTodos = async (req, res) => {
    try {
        const toDos = await todoModel.find({ userId: req.userId});
        res.status(200).json(toDos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports.createTodos = async (req, res) => {
    const {task, description} = req.body;

    try {
        const newTodo = await todoModel.create({
            userId: req.userId,
            task,
            description,
        });

        res.status(201).json({
            message: "new task created!",
            newTodo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating task!",
            error: error.message
        })
    }
};

module.exports.updateToDo = async (req, res) => {
    const {id} = req.params;
    const {task, description} = req.body;

    try {
        // one more check step to make sure task really belongs to correct user
        const todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found!"
            })
        };

        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({
                message: "Not authorized!"
            })
        };

        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {task, description},
            {new: true}
        );

        res.status(200).json({
            message: "Todo updated!",
            updatedTodo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Todo updates failed",
            error: error.message
        });
    }
};

module.exports.toggleCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found!"
            })
        };

        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({
                message: "Not authorized!"
            })
        };

        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            [{ $set: { isCompleted: { $not: "$isCompleted" } } }], // Toggle isCompleted using aggregation pipeline
            { new: true },
        );

        res.status(200).json({
            message: "Todo toggled!",
            updatedTodo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Todo toggles failed",
            error: error.message
        });
    }
};

module.exports.deleteToDo = async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found!"
            })
        };

        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({
                message: "Not authorized!"
            })
        };

        await todoModel.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Task deleted!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Todo deletes failed",
            error: error.message
        });
    }
};
