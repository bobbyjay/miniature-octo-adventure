import { Link } from "react-router-dom";

export default function NavBar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="nav">
      <h2 className="logo">YourApp</h2>

      <div className="links">
        <Link to="/">Discover</Link>
        <Link to="/help">Help Centre</Link>
        <Link to="/communities">Communities</Link>

        {!token ? (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup" className="btn">Sign Up</Link>
          </>
        ) : (
          <Link to="/dashboard" className="btn">Dashboard</Link>
        )}
      </div>
    </nav>
  );
}