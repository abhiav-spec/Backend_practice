const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    caption: String,
    imageUrl: String,
    imagekitFileId: String,
}, { timestamps: true });

const postmodel = mongoose.model('Post', postSchema);


module.exports = postmodel;