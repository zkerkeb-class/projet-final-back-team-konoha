import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  id: {
      type: Number,
      required: true,
      unique: true,
    },
  title: { 
    type: String, 
    required: true,
  },
  content: [
    {
      type: { 
        type: String, 
        enum: ["text", "image"], 
        required: true 
      },
      content: { type: String }, // contenu pour le texte
      src: { type: String },     // source pour l'image
      alt: { type: String }      // texte alternatif pour l'image
    }
  ]
});

export default mongoose.model("Guide", guideSchema);