import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";

const AdminTaskView = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const { user, token } = useUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/distribution/admin-files",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEntries(res.data.entries);
      } catch (err) {
        console.error("Error fetching entries:", err);
      }
    };

    fetchData();
  }, []);

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">All File Entries</h3>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Filename</th>
            <th>Uploaded By</th>
            <th>Uploaded At</th>
            <th>Agent Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry, i) => (
            <tr
              key={indexOfFirst + i}
              className={entry.status === "Completed" ? "table-success" : ""}
            >
              <td>{entry.index}</td>
              <td>{entry.filename}</td>
              <td>{entry.uploadedBy}</td>
              <td>{new Date(entry.uploadedAt).toLocaleString()}</td>
              <td>{entry.agentName}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 && "active"}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages && "disabled"}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminTaskView;
