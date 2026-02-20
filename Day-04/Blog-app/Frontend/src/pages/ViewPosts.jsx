import { useState, useEffect } from 'react';
import { fetchPosts, deletePost, updatePost } from '../services/api';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';

const ViewPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit modal state
    const [editingPost, setEditingPost] = useState(null);

    // Fetch posts on component mount
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await fetchPosts();
            setPosts(data.posts || []);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to load posts.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Handle post deletion — removes from DB + ImageKit cloud
    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts((prev) => prev.filter((post) => post.id !== id));
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to delete post.';
            alert(msg);
            throw err;
        }
    };

    // Open edit modal
    const handleEdit = (post) => {
        setEditingPost(post);
    };

    // Save edited post — updates in DB (and replaces image on ImageKit if new image uploaded)
    const handleSave = async (id, data) => {
        const result = await updatePost(id, data);
        // Update the post in local state with the new data
        setPosts((prev) =>
            prev.map((post) =>
                post.id === id
                    ? { ...post, title: result.post.title, caption: result.post.caption, imageUrl: result.post.imageUrl }
                    : post
            )
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="page-state">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading posts...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="page-state">
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={() => { setError(''); loadPosts(); }}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (posts.length === 0) {
        return (
            <div className="page-state">
                <div className="empty-container">
                    <span className="empty-icon">📝</span>
                    <h2>No Posts Yet</h2>
                    <p>Be the first to create a post!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-posts-page">
            <div className="posts-header">
                <h1>All Posts</h1>
                <p className="post-count">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="posts-grid">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {/* Edit Modal — shown when a post is being edited */}
            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    onClose={() => setEditingPost(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default ViewPosts;
