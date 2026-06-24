import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import EditorScreen from "../components/EditorScreen";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const Workspace = () => {
  const { projectId } = useParams();
  const { user, api } = useContext(AuthContext);
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [project, setProject] = useState(null);
  const [code, setCode] = useState("// Loading...");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProject(res.data);
        setCode(res.data.code);
        setLanguage(res.data.language);
      } catch (error) {
        console.error("Failed to load project", error);
        navigate("/dashboard");
      }
    };
    fetchProject();
  }, [projectId, api, navigate]);

  // Setup Socket.IO connection
  useEffect(() => {
    if (!project || !user) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit("join", { roomId: projectId, userName: user.username });

    newSocket.on("userJoined", (usersList) => setUsers(usersList));
    
    // We only update code from socket if we didn't just type it. 
    // The backend in this simple version broadcasts to ALL including sender.
    // To prevent cursor jumping, we should ideally not update state if we are the sender.
    // Since backend was not changed for OT, we accept the existing behavior.
    newSocket.on("codeUpdate", (newCode) => setCode(newCode));
    
    newSocket.on("userTyping", (typingUser) => {
      setTyping(`${typingUser.slice(0, 8)}... is typing`);
      setTimeout(() => setTyping(""), 2000);
    });
    
    newSocket.on("languageUpdate", (newLang) => setLanguage(newLang));

    return () => {
      newSocket.emit("leaveRoom");
      newSocket.disconnect();
    };
  }, [project, user, projectId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket) {
      socket.emit("codeChange", { roomId: projectId, code: newCode });
      socket.emit("typing", { roomId: projectId, userName: user.username });
    }
  };

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (socket) {
      socket.emit("languageChange", { roomId: projectId, language: newLanguage });
    }
    // Auto-save language change
    try {
      await api.put(`/projects/${projectId}`, { language: newLanguage });
    } catch (error) {
      console.error("Failed to save language", error);
    }
  };

  const saveCode = useCallback(async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      await api.put(`/projects/${projectId}`, { code });
    } catch (error) {
      console.error("Failed to save code", error);
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  }, [api, projectId, code, project]);

  // Handle Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveCode]);

  const leaveRoom = () => {
    navigate("/dashboard");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(projectId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  if (!project) return <div className="join-wrapper"><p>Loading workspace...</p></div>;

  return (
    <div style={{position: 'relative', height: '100vh', width: '100vw'}}>
      <EditorScreen
        roomId={project.title}
        copySuccess={copySuccess}
        copyRoomId={copyRoomId}
        users={users}
        typing={typing}
        language={language}
        handleLanguageChange={handleLanguageChange}
        leaveRoom={leaveRoom}
        code={code}
        handleCodeChange={handleCodeChange}
      />
      <button 
        onClick={saveCode} 
        className="btn-primary" 
        style={{position: 'absolute', top: '6px', right: '16px', zIndex: 10, padding: '4px 12px'}}
        title="Save (Ctrl+S)"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default Workspace;
