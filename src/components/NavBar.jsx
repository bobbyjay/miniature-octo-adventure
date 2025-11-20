import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, background: "#222", color: "#fff" }}>
      <Link to="/" style={{ marginRight: 20, color: "#fff" }}>Home</Link>
      <Link to="/wallet" style={{ marginRight: 20, color: "#fff" }}>Wallet</Link>
      <Link to="/profile" style={{ marginRight: 20, color: "#fff" }}>Profile</Link>
      <Link to="/support" style={{ color: "#fff" }}>Support</Link>
    </nav>
  );
}