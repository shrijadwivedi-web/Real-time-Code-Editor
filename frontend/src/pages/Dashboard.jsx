import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, Code, Clock } from "lucide-react";

const Dashboard = () => {
  const { user, api, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      const res = await api.post("/projects", { title: newTitle });
      setProjects([res.data, ...projects]);
      setNewTitle("");
      setIsCreating(false);
      navigate(`/project/${res.data._id}`);
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleRename = async (id, currentTitle) => {
    const newName = window.prompt("Enter new project name:", currentTitle);
    if (!newName || newName === currentTitle) return;
    try {
      const res = await api.put(`/projects/${id}`, { title: newName });
      setProjects(projects.map((p) => (p._id === id ? res.data : p)));
    } catch (error) {
      console.error("Failed to rename project", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <div className="join-wrapper"><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="dashboard-container header-content">
          <div className="brand">CodeForge</div>
          <div className="user-controls">
            <span className="user-greeting">Welcome, {user?.username}</span>
            <button className="btn-danger btn-small" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-container main-content">
        <div className="section-header">
          <h2>Your Projects</h2>
          <button className="btn-primary" onClick={() => setIsCreating(!isCreating)}>
            <Plus size={16} /> New Project
          </button>
        </div>

        {isCreating && (
          <form className="create-project-form fade-in" onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project Name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" className="btn-danger" onClick={() => setIsCreating(false)}>Cancel</button>
          </form>
        )}

        <div className="projects-grid">
          {projects.length === 0 && !isCreating ? (
            <div className="empty-state">
              <Code size={48} className="empty-icon" />
              <h3>No projects yet</h3>
              <p>Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="project-card fade-in">
                <div className="project-card-header" onClick={() => navigate(`/project/${project._id}`)}>
                  <h3 className="project-title">{project.title}</h3>
                  <span className="language-badge">{project.language}</span>
                </div>
                <div className="project-card-footer">
                  <div className="last-modified">
                    <Clock size={12} />
                    {formatDate(project.updatedAt)}
                  </div>
                  <div className="project-actions">
                    <button className="btn-icon" onClick={() => handleRename(project._id, project.title)} title="Rename">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(project._id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
