const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');
const uploadfile = require('./services/storage.service');
const postmodel = require('./models/post.model');

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

// ── Helmet CSP Configuration ──
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", "http://localhost:3000", "https://api.imagekit.io"],
                imgSrc: ["'self'", "https://ik.imagekit.io", "data:"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    })
);

// ── CORS — allow React frontend (Vite default port 5173) ──
app.use(cors({ origin: 'http://localhost:5173' }));

// ── Body Parsers ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── GET /create-post (helper message) ──
app.get('/create-post', (req, res) => {
    return res.status(405).json({
        message: "Method Not Allowed. Use POST method to create a post.",
        usage: {
            method: "POST",
            url: "http://localhost:3000/create-post",
            body: "form-data with keys: 'file' (File), 'title' (Text), 'caption' (Text)",
        },
    });
});

// ═══════════════════════════════════════════════════════════
//  POST /create-post — Create a new post with image upload
// ═══════════════════════════════════════════════════════════
app.post('/create-post', upload.any(), async (req, res) => {
    try {
        const file = req.files && req.files[0];

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded. Send a file using form-data.",
            });
        }

        // Upload image to ImageKit — returns { url, fileId }
        const uploadResult = await uploadfile.uploadImage(file);
        console.log("Uploaded:", uploadResult.url, "| fileId:", uploadResult.fileId);

        // Save post to MongoDB (including imagekitFileId for future deletion)
        const post = await postmodel.create({
            image: file.buffer.toString("base64"),
            title: req.body.title || '',
            caption: req.body.caption || req.body.description || '',
            imageUrl: uploadResult.url,
            imagekitFileId: uploadResult.fileId,
        });
        console.log("Post created:", post._id);

        return res.status(201).json({
            message: "Post created successfully",
            post: {
                id: post._id,
                title: post.title,
                caption: post.caption,
                imageUrl: post.imageUrl,
            },
        });
    } catch (error) {
        console.error("Error creating post:", error.message);
        return res.status(500).json({
            message: "Failed to create post",
            error: error.message,
        });
    }
});

// ═══════════════════════════════════════════════════════════
//  GET /posts — Retrieve all posts
// ═══════════════════════════════════════════════════════════
app.get('/posts', async (req, res) => {
    try {
        const posts = await postmodel.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Posts retrieved successfully",
            posts: posts.map(post => ({
                id: post._id,
                title: post.title,
                caption: post.caption,
                imageUrl: post.imageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(post.title || post.caption || 'image')}`,
            })),
        });
    } catch (error) {
        console.error("Error retrieving posts:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve posts",
            error: error.message,
        });
    }
});

// ═══════════════════════════════════════════════════════════
//  PUT /update-post/:id — Update a post (title, caption, and optionally image)
// ═══════════════════════════════════════════════════════════
app.put('/update-post/:id', upload.any(), async (req, res) => {
    try {
        const { id } = req.params;

        // Find the existing post
        const existingPost = await postmodel.findById(id);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Build the update object with text fields
        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.caption !== undefined) updateData.caption = req.body.caption;

        // If a new image was uploaded, replace the old one
        const file = req.files && req.files[0];
        if (file) {
            // Delete the old image from ImageKit (if it exists)
            if (existingPost.imagekitFileId) {
                await uploadfile.deleteImage(existingPost.imagekitFileId);
                console.log("Old image deleted from ImageKit");
            }

            // Upload new image
            const uploadResult = await uploadfile.uploadImage(file);
            updateData.image = file.buffer.toString("base64");
            updateData.imageUrl = uploadResult.url;
            updateData.imagekitFileId = uploadResult.fileId;

            console.log("New image uploaded:", uploadResult.url);
        }

        // Update the post in MongoDB
        const updatedPost = await postmodel.findByIdAndUpdate(id, updateData, { new: true });
        console.log("Post updated:", id);

        return res.status(200).json({
            message: "Post updated successfully",
            post: {
                id: updatedPost._id,
                title: updatedPost.title,
                caption: updatedPost.caption,
                imageUrl: updatedPost.imageUrl,
            },
        });
    } catch (error) {
        console.error("Error updating post:", error.message);
        return res.status(500).json({
            message: "Failed to update post",
            error: error.message,
        });
    }
});

// ═══════════════════════════════════════════════════════════
//  DELETE /delete-post/:id — Delete a post (from DB + ImageKit cloud)
// ═══════════════════════════════════════════════════════════
app.delete('/delete-post/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the post first (we need the imagekitFileId)
        const post = await postmodel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Step 1: Delete image from ImageKit cloud
        if (post.imagekitFileId) {
            await uploadfile.deleteImage(post.imagekitFileId);
        }

        // Step 2: Delete post from MongoDB
        await postmodel.findByIdAndDelete(id);

        console.log("Post deleted:", id);
        return res.status(200).json({
            message: "Post deleted successfully (removed from database and ImageKit cloud)",
            post: { id: post._id },
        });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        return res.status(500).json({
            message: "Failed to delete post",
            error: error.message,
        });
    }
});

module.exports = app;