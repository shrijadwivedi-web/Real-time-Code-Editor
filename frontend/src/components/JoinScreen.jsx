const JoinScreen = ({ roomId, userName, setRoomId, setUserName, joinRoom }) => {
  return (
    <div className="join-wrapper">
      <div className="project-info">
        <h1>CodeForge</h1>
        <p>Real-time collaborative code editor</p>
      </div>
      <div className="join-container">
        <div className="join-form">
          <h2>Join a Workspace</h2>
          <div className="input-group">
            <label htmlFor="roomId">Workspace ID</label>
            <input
              id="roomId"
              type="text"
              placeholder="e.g., project-alpha"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            />
          </div>
          <div className="input-group">
            <label htmlFor="userName">Your Name</label>
            <input
              id="userName"
              type="text"
              placeholder="e.g., Alex Developer"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            />
          </div>
          <button className="btn-primary" onClick={joinRoom} disabled={!roomId || !userName}>
            Join Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;
