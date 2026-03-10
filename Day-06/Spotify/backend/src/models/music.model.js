import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
    {
        uri: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        playCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

const Music = mongoose.model("Music", musicSchema);

export default Music;
