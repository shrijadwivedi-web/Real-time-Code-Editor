import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-wrapper">
      <div className="project-info">
        <h1>CodeForge</h1>
        <p>Create a new account</p>
      </div>
      <div className="join-container">
        <form className="join-form" onSubmit={handleSubmit}>
          <h2>Get Started</h2>
          {error && <div className="error-message fade-in" style={{color: "var(--danger)", marginBottom: "1rem", fontSize: "0.875rem"}}>{error}</div>}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading || !username || !email || !password}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
          <p style={{marginTop: "1.5rem", fontSize: "0.875rem", textAlign: "center", color: "var(--text-secondary)"}}>
            Already have an account? <Link to="/" style={{color: "var(--accent)"}}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
