// import the model


const Todo = require("../models/todo");
// define route handler

exports.getTodo = async(req, res) => {
    try{
        // find all todos from database
        const todos = await Todo.find({});
        res.status(200)
        .json({
            success:true,
            data:todos,
            message:"All todos are fetched."
        });   
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"Internal server error",
            message:err.message
        })
    } 
};

exports.getTodoById = async(req, res) => {
    try{
        const id = req.params.id;
        const todo = await Todo.findById({_id: id});

        // if forgiven id is not found
        if(!todo){
            return res.status(404).json({
                success:false,
                message:"No data found with the given id"
            })
        }
        // if for given id is found
        res.status(200).json({
            success:true,
            data:todo,
            message:`Todo ${id} successfully fetched`
        })
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"Internal server error",
            message:err.message
        })
    } 
}