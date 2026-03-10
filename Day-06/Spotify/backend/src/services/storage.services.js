import ImageKit, { toFile } from "@imagekit/nodejs";

// @imagekit/nodejs v7 — only privateKey is required in constructor
const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * Uploads a multer file (memoryStorage) to ImageKit.
 * @param {Express.Multer.File} file - file object from multer (has .buffer and .originalname)
 * @returns {Promise<{url: string, fileId: string, name: string}>}
 */
const uploadFile = async (file) => {
    // Convert multer Buffer → ImageKit-compatible file object using toFile() helper
    const uploadable = await toFile(file.buffer, file.originalname, {
        type: file.mimetype,
    });

    const result = await imagekit.files.upload({
        file: uploadable,
        fileName: file.originalname,
        folder: "/spotify",
    });

    return result;
};

export { uploadFile };