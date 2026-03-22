import mongoose from "mongoose";

const anecdoteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
  },
  content: {
    type:String,
    required:true,
  }
});

export default mongoose.model("Anecdote", anecdoteSchema);