import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const CreatePost = () => {
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [preview, setPreview] = useState(null);

    // Handle file selection & generate preview
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        if (selected) {
            setPreview(URL.createObjectURL(selected));
        } else {
            setPreview(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!title.trim()) return setError('Please enter a title.');
        if (!file) return setError('Please select an image.');

        setLoading(true);
        try {
            const data = await createPost({ title, description, file });
            setSuccess(data.message || 'Post created successfully!');

            // Reset form
            setTitle('');
            setDescription('');
            setFile(null);
            setPreview(null);

            // Redirect to posts page after 1.5 seconds
            setTimeout(() => navigate('/posts'), 1500);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Something went wrong.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-page">
            <div className="form-card">
                <div className="form-header">
                    <span className="form-icon">✍️</span>
                    <h1>Create New Post</h1>
                    <p>Share your thoughts with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="post-form">
                    {/* Title Input */}
                    <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Give your post a catchy title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows="4"
                            placeholder="Tell us more about your post..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="input-group">
                        <label htmlFor="file">Image</label>
                        <div className="file-upload-area">
                            {preview ? (
                                <div className="image-preview">
                                    <img src={preview} alt="Preview" />
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => { setFile(null); setPreview(null); }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="file" className="upload-label">
                                    <span className="upload-icon">📷</span>
                                    <span>Click to upload an image</span>
                                    <span className="upload-hint">PNG, JPG, WEBP up to 10MB</span>
                                </label>
                            )}
                            <input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={loading}
                                className="file-input-hidden"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Success Message */}
                    {success && <div className="alert alert-success">{success}</div>}

                    {/* Submit Button */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner"></span>
                                Uploading...
                            </span>
                        ) : (
                            'Create Post'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
