const { Schema, model, Types } = require("mongoose");

const quizSchema = new Schema({
  quizTitle: {
    type: String,
    required: true
  },
  quiz: [
    {
      id: {
        type: Number,
        required: true
      },
      question: {
        type: String,
        required: true
      },
      rightAnswerId: {
        type: Number,
        required: true
      },
      answers: [
        {
          id: {
            type: Number,
            required: true
          },
          text: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  userId: {
    type: Types.ObjectId,
    ref: "users"
  }
});

module.exports = model("quizes", quizSchema);
