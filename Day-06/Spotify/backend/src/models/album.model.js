import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
    {
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
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Music",
            },
        ],
        coverImage: {
            type: String, // URL from ImageKit
            default: null,
        },
    },
    { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);

export default Album;