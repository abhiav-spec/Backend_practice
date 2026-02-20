import axios from 'axios';

// Create axios instance with base URL pointing to our backend
const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
});

/**
 * Create a new post with image upload
 * @param {Object} data - { title, description, file }
 * @returns {Promise} API response
 */
export const createPost = async ({ title, description, file }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('caption', description);

    const response = await api.post('/create-post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Fetch all posts
 * @returns {Promise} API response with posts array
 */
export const fetchPosts = async () => {
    const response = await api.get('/posts');
    return response.data;
};

/**
 * Update a post (title, caption, and optionally image)
 * @param {string} id - Post ID
 * @param {Object} data - { title, caption, file? }
 * @returns {Promise} API response
 */
export const updatePost = async (id, { title, caption, file }) => {
    const formData = new FormData();
    if (title !== undefined) formData.append('title', title);
    if (caption !== undefined) formData.append('caption', caption);
    if (file) formData.append('file', file);

    const response = await api.put(`/update-post/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Delete a post by ID (deletes from DB + ImageKit cloud)
 * @param {string} id - Post ID to delete
 * @returns {Promise} API response
 */
export const deletePost = async (id) => {
    const response = await api.delete(`/delete-post/${id}`);
    return response.data;
};

export default api;
