import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../UserContext";

const AgentDashboard = () => {
  const { user, token, loading } = useUser();
  const [fileData, setFileData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!user || loading) return;

    const fetchAgentFiles = async () => {
      try {
        const response = await axios.get(
          `https://cs-tech-assignment.vercel.app/distribution/agent-files/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const assignedFiles = response.data.assignedFiles;

        const allRows = assignedFiles.flatMap((file) =>
          file.data.map((entry) => ({
            ...entry,
            filename: file.filename,
            assignedBy: file.uploadedBy,
            fileId: file.fileId,
          }))
        );

        setFileData(allRows);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchAgentFiles();
  }, [user, token, loading]);

  const handleProcess = async (fileId, indexId) => {
    try {
      await axios.put(
        `https://cs-tech-assignment.vercel.app/file/${fileId}/status`,
        {
          index: indexId,
          agentId: user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFileData((prev) => prev.filter((entry) => entry._id !== indexId));
      toast.success("File processed successfully!");
    } catch (err) {
      console.error("Processing failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not authorized</p>;

  // PAGINATION LOGIC
  const totalPages = Math.ceil(fileData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = fileData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container mt-5">
      <h2>Welcome, {user?.name}!</h2>
      <h3>Here are your tasks:</h3>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>File Name</th>
            <th>First Name</th>
            <th>Phone Number</th>
            <th>Notes</th>
            <th>Assigned By</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.filename}</td>
              <td>{entry.firstName}</td>
              <td>{entry.phone}</td>
              <td>{entry.notes}</td>
              <td>{entry.assignedBy}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleProcess(entry.fileId, entry._id)}
                >
                  Process
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION BUTTONS */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ⬅ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default AgentDashboard;
