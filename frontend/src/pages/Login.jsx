import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-wrapper">
      <div className="project-info">
        <h1>CodeForge</h1>
        <p>Sign in to your account</p>
      </div>
      <div className="join-container">
        <form className="join-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          {error && <div className="error-message fade-in" style={{color: "var(--danger)", marginBottom: "1rem", fontSize: "0.875rem"}}>{error}</div>}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading || !email || !password}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          <p style={{marginTop: "1.5rem", fontSize: "0.875rem", textAlign: "center", color: "var(--text-secondary)"}}>
            Don't have an account? <Link to="/signup" style={{color: "var(--accent)"}}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
