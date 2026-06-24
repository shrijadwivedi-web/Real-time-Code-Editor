import Sidebar from './Sidebar';
import CodeEditor from './CodeEditor';

const EditorScreen = ({
  roomId,
  copySuccess,
  copyRoomId,
  users,
  typing,
  language,
  handleLanguageChange,
  leaveRoom,
  code,
  handleCodeChange,
}) => {
  return (
    <div className="editor-container">
      <Sidebar
        roomId={roomId}
        copySuccess={copySuccess}
        copyRoomId={copyRoomId}
        users={users}
        typing={typing}
        language={language}
        handleLanguageChange={handleLanguageChange}
        leaveRoom={leaveRoom}
      />
      <div className="main-content">
        <div className="editor-header">
          <div className="file-tabs">
            <div className="tab active">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
              main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}
            </div>
          </div>
        </div>
        <CodeEditor
          language={language}
          code={code}
          handleCodeChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default EditorScreen;
