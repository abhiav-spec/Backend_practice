import { useState } from 'react';

const EditPostModal = ({ post, onClose, onSave }) => {
    const [title, setTitle] = useState(post.title || '');
    const [caption, setCaption] = useState(post.caption || '');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle new image selection
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

        if (!title.trim()) {
            return setError('Title cannot be empty.');
        }

        setLoading(true);
        try {
            await onSave(post.id, { title, caption, file });
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Update failed.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Close modal when clicking the backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-card">
                <div className="modal-header">
                    <h2>✏️ Edit Post</h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Title */}
                    <div className="input-group">
                        <label htmlFor="edit-title">Title</label>
                        <input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Caption / Description */}
                    <div className="input-group">
                        <label htmlFor="edit-caption">Description</label>
                        <textarea
                            id="edit-caption"
                            rows="3"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Image — show current, option to replace */}
                    <div className="input-group">
                        <label>Image</label>
                        <div className="edit-image-section">
                            <img
                                src={preview || post.imageUrl}
                                alt="Current"
                                className="edit-current-image"
                            />
                            <label className="change-image-btn">
                                {file ? '✅ New image selected' : '🔄 Change Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Error */}
                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Buttons */}
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;
