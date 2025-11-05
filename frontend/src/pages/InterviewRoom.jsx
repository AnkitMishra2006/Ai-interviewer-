/**
 * Interview Room Page - Live interview interface
 */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const [question, setQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // TODO: Implement interview room logic
  // - WebSocket connection
  // - Camera access
  // - Audio recording
  // - Real-time feedback

  // TODO: Replace with v0 generated interview room UI
  // - Webcam feed on left
  // - Question display on right
  // - Record button
  // - Timer
  // - Warning alerts

  return (
    <div className="min-h-screen">
      <h1>Interview Room - Session {sessionId}</h1>
      <p>TODO: Replace with v0 generated interview room UI</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2>Camera Feed</h2>
          {/* Video element will go here */}
        </div>
        <div>
          <h2>Question</h2>
          <p>{question || 'Loading question...'}</p>
          <button onClick={() => setIsRecording(!isRecording)}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
