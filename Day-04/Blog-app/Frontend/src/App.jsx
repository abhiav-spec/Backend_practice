import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import CreatePost from './pages/CreatePost';
import ViewPosts from './pages/ViewPosts';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">📸</span>
          <span className="brand-text">BlogApp</span>
        </div>
        <div className="nav-links">
          <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Posts
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            + Create
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts" element={<ViewPosts />} />
          {/* Default route → redirect to /posts */}
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
