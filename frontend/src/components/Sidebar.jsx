const Sidebar = ({
  roomId,
  copySuccess,
  copyRoomId,
  users,
  typing,
  language,
  handleLanguageChange,
  leaveRoom,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="brand">CodeForge</h2>
      </div>

      <div className="sidebar-section">
        <div className="section-title">WORKSPACE</div>
        <div className="room-info">
          <div className="room-id" title={roomId}>
            {roomId.length > 15 ? roomId.substring(0, 15) + '...' : roomId}
          </div>
          <button onClick={copyRoomId} className="btn-icon" title="Copy Workspace ID">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
        {copySuccess && <span className="copy-success fade-in">{copySuccess}</span>}
      </div>

      <div className="sidebar-section flex-grow">
        <div className="section-title">
          PEOPLE <span className="badge">{users.length}</span>
        </div>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={index} className="user-item">
              <div className="avatar">{user.charAt(0).toUpperCase()}</div>
              <span className="user-name" title={user}>
                {user.length > 15 ? user.substring(0, 15) + '...' : user}
              </span>
            </li>
          ))}
        </ul>
        <div className="typing-indicator">
          {typing ? (
            <span className="fade-in pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              {typing}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
      </div>

      <div className="sidebar-section sidebar-footer">
        <div className="input-group">
          <label htmlFor="language">Language</label>
          <div className="select-wrapper">
            <select
              id="language"
              className="language-selector"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
        <button className="btn-danger w-full mt-4" onClick={leaveRoom}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Leave Workspace
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
