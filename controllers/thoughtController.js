const { Thought, User } = require("../models");

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 })
        .then((thoughtData) => res.json(thoughtData)) 
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },
    getThoughtbyId({ params}, res) {
        Thought.findOne({_id: params.id })
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .then((thoughtData) => {
    if (!thoughtData) {
        return res.status(404).json({ message:"Error!"});  
    }
    res.json(thoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({_id }) => {
            return User.findOneAndUpdate(
                {_id: body.userId },
                { $push: { thoughts: _id }},
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res
                .status(404)
                .json({ message: "Error!" });

            }
            res.json({ message: "Success!"});
        })
        .catch((err) => res.json(err));
    },
    






}