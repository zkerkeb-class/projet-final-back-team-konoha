import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    series:{
      type:String,
      required:true,
    },
    editor:{
      type:String,
      required:true,
    },
    studio:{
      type:String,
      required:true,
    },
    genres: [
      {
        type: String,
        enum:["Action","Aventure","RPG", "Horreur", "Plateforme", "Narratif"],
        required:true,
      },
    ],
    platforms: [
      {
        type: String,
        enum:["PC", "PlayStation 3", "PlayStation 4", "PlayStation 5", "Xbox", "Xbox 360", "Xbox One", "Xbox Series X/S", "Nintendo Switch", "Mega Drive","Dreamcast", "GameCube"],
        required:true,
      },
    ],
    releaseDate: {
      america:{type: Date},
      europe:{type: Date},
      japon:{type: Date},
    },
    description: {
      type: [String],
      required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

export default mongoose.model("game", gameSchema);