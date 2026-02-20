const Imagekit = require("imagekit");

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;

let imagekit = null;
if (IMAGEKIT_PUBLIC_KEY && IMAGEKIT_PRIVATE_KEY && IMAGEKIT_URL_ENDPOINT) {
    imagekit = new Imagekit({
        publicKey: IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
} else {
    console.warn("ImageKit config missing (IMAGEKIT_PUBLIC_KEY/PRIVATE_KEY/URL_ENDPOINT). Using fallback uploader.");
}

/**
 * Upload an image to ImageKit
 * @param {Object} file - Multer file object
 * @returns {Object} { url, fileId } — url for display, fileId for future deletion
 */
async function uploadImage(file) {
    if (!imagekit) {
        // Fallback: return placeholder when ImageKit is not configured
        return {
            url: `https://placehold.co/600x400?text=${encodeURIComponent(file.originalname || 'image')}`,
            fileId: null,
        };
    }

    try {
        const response = await imagekit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
        });
        // Return both url and fileId (needed for deletion later)
        return {
            url: response.url,
            fileId: response.fileId,
        };
    } catch (error) {
        console.error("Image upload error:", error.message);
        throw error;
    }
}

/**
 * Delete an image from ImageKit by its fileId
 * @param {string} fileId - ImageKit file ID
 * @returns {boolean} true if deleted, false if skipped
 */
async function deleteImage(fileId) {
    if (!imagekit || !fileId) {
        console.log("Skipping ImageKit delete (no config or no fileId).");
        return false;
    }

    try {
        await imagekit.deleteFile(fileId);
        console.log("Image deleted from ImageKit:", fileId);
        return true;
    } catch (error) {
        console.error("ImageKit delete error:", error.message);
        // Don't throw — we still want to delete the DB record even if cloud delete fails
        return false;
    }
}

module.exports = { uploadImage, deleteImage };