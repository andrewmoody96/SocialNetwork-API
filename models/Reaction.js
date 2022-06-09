// TO:DO -- Create Reaction model.
const {
  Schema,
  Types,
  model,
  Mongoose,
  default: mongoose,
} = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionId: {
      objectId: new mongoose.Schema.Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

reactionSchema.get(function () {
  let formattedDate = `${this.createdAt.getFullYear()}-`;
  formattedDate += `${`0${this.createdAt.getMonth() + 1}`.slice(-2)}-`;
  formattedDate += `${`0${this.createdAt.getDate()}`.slice(-2)}`;
  return formattedDate;
});

module.exports = reactionSchema;