import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
  },
  content: [
    {
      type: { type: String, enum: ["text", "image"], required: true },
      content: { type: String }, // texte
      src: { type: String },     // image
      alt: { type: String }      // texte alternatif pour image
    }
  ]
});

export default mongoose.model("Guide", guideSchema);