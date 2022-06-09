// TO:DO -- Write functions for users.
const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

const thoughts = async (userId) => {
  let usersThoughts = await User.aggregate([
    {
      $match: { _id: ObjectId(userId) },
    },
    {
      $unwind: { path: "$thoughts" },
    },
    {
      $group: {
        _id: userId,
      },
    },
  ]);
  return usersThoughts;
};
const friends = async (userId) => {
  let usersFriends = await User.aggregate([
    {
      $match: { _id: ObjectId(userId) },
    },
    {
      $unwind: { path: "$friends" },
    },
    {
      $group: {
        _id: userId,
      },
    },
  ]);
  return usersFriends;
};
module.exports = {
  //get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  //get single user
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
              thoughts: await thoughts(req.params.userId),
              friends: await friends(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user matching this ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User does not exist." })
          : res.json({ message: "User deleted." })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Add a friend to a user
  addFriend(req, res) {
    console.log("Adding friend.");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user matching this ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove friend from user
  deleteFriend(req, res) {
    console.log("Delete friend.");
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { _id: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user matching this ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
