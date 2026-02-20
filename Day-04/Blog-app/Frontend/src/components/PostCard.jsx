import { useState } from 'react';

const PostCard = ({ post, onDelete, onEdit }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This will also remove the image from ImageKit cloud.')) return;

        setDeleting(true);
        try {
            await onDelete(post.id);
        } catch {
            setDeleting(false);
        }
    };

    return (
        <div className={`post-card ${deleting ? 'post-card-deleting' : ''}`}>
            <div className="post-card-image">
                <img
                    src={post.imageUrl}
                    alt={post.title || post.caption || 'Post image'}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = `https://placehold.co/600x400/1a1a2e/e0e0e0?text=${encodeURIComponent(post.title || 'Image')}`;
                    }}
                />
                {/* Action buttons overlay */}
                <div className="card-actions">
                    <button
                        className="edit-btn"
                        onClick={() => onEdit(post)}
                        title="Edit post"
                    >
                        ✏️
                    </button>
                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                        title="Delete post"
                    >
                        {deleting ? '⏳' : '🗑️'}
                    </button>
                </div>
            </div>
            <div className="post-card-content">
                {post.title && <h3 className="post-card-title">{post.title}</h3>}
                {post.caption && <p className="post-card-caption">{post.caption}</p>}
            </div>
        </div>
    );
};

export default PostCard;
