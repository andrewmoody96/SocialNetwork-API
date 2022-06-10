// TO:DO -- Create Thought model.
const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCounter").get(function () {
  return `${this.reactions.length}`;
});
thoughtSchema.virtual("dateFormat").get(function () {
  // TODO -- Error is here. "getFullYear" is undefined.
  let formattedDate = `${this.createdAt.getFullYear()}-`;
  formattedDate += `${`0${this.createdAt.getMonth() + 1}`.slice(-2)}-`;
  formattedDate += `${`0${this.createdAt.getDate()}`.slice(-2)}`;
  return formattedDate;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;