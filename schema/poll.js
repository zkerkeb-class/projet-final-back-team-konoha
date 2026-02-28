import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

export default mongoose.model("Poll", pollSchema);