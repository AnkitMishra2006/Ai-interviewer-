/**
 * Resume Upload Page
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement resume upload logic
  };

  // TODO: Replace with v0 generated resume upload UI
  // - Drag and drop zone
  // - File validation
  // - Upload progress
  // - Job role selection

  return (
    <div className="min-h-screen p-8">
      <h1>Upload Resume</h1>
      <p>TODO: Replace with v0 generated resume upload UI</p>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <select value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
          <option>Software Engineer</option>
          <option>Data Scientist</option>
          <option>DevOps Engineer</option>
        </select>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ResumeUpload;
