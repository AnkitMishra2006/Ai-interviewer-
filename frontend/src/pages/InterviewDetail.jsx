/**
 * Interview Detail Page - Full report view
 */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const InterviewDetail = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Implement interview detail logic
  // - Fetch interview data
  // - Display full report
  // - Handle actions (shortlist, reject, download PDF)

  // TODO: Replace with v0 generated interview detail UI
  // - Candidate info header
  // - Score breakdown (circular progress bars)
  // - AI evaluation section
  // - Cheating report
  // - Interview transcript
  // - Action buttons

  return (
    <div className="min-h-screen p-8">
      <h1>Interview Detail - {id}</h1>
      <p>TODO: Replace with v0 generated interview detail UI</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>Candidate Name</div>
          <div>Overall Score: --/100</div>
          <div>Recommendation: --</div>
        </div>
      )}
    </div>
  );
};

export default InterviewDetail;
