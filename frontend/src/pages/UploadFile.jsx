import axios from "axios";
import Papa from "papaparse";
import { useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useUser } from "../UserContext";
import DistributionModal from "../components/DistributionModal";

function UploadFilePage() {
  const { user, token } = useUser();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [distributionSummary, setDistributionSummary] = useState([]);

  const getNormalizedFileType = (file) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) return "csv";
    if (file.type.includes("spreadsheetml") || file.name.endsWith(".xlsx"))
      return "xlsx";
    if (file.type.includes("excel") || file.name.endsWith(".xls")) return "xls";
    return "unknown";
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      setFile(null);
      return;
    }

    // Validate file type by both MIME and extension
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExtensions = [".csv", ".xls", ".xlsx"];
    const fileExtension = selected.name
      .slice(((selected.name.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();

    if (
      !validTypes.includes(selected.type) &&
      !validExtensions.includes(`.${fileExtension}`)
    ) {
      toast.error("Please upload a CSV, XLSX, or XLS file");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(new Error("Error reading file"));

      if (file.name.endsWith(".csv") || file.type === "text/csv") {
        reader.onload = (e) => {
          try {
            const result = Papa.parse(e.target.result, {
              header: true,
              skipEmptyLines: true,
            });
            resolve(result.data);
          } catch (error) {
            reject(new Error("Failed to parse CSV file"));
          }
        };
        reader.readAsText(file);
      } else {
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target.result, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);
            resolve(json);
          } catch (error) {
            reject(new Error("Failed to parse Excel file"));
          }
        };
        reader.readAsBinaryString(file);
      }
    });
  };

  const validateDataStructure = (data) => {
    if (!Array.isArray(data)) return false;

    // Check if required fields exist in the first item
    if (data.length > 0) {
      const firstItem = data[0];
      return (
        "firstName" in firstItem && "phone" in firstItem && "notes" in firstItem
      );
    }
    return true; // empty array is acceptable
  };

  const cleanData = (data) => {
    return data.map((item) => {
      const cleaned = {};
      // Only keep the fields we want
      if (item.firstName) cleaned.firstName = String(item.firstName);
      if (item.phone) cleaned.phone = String(item.phone);
      if (item.notes) cleaned.notes = String(item.notes);
      return cleaned;
    });
  };
  const distributeDocuments = async (fileID, totalDocs, token) => {
    try {
      console.log(user._id);
      // Step 1: Fetch agents
      const agentRes = await axios.get("http://localhost:5000/agent/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const agents = agentRes.data;
      console.log(agents);
      const numAgents = agents.agents.length;
      console.log(numAgents, " is the number of agents");

      if (numAgents === 0) {
        toast.error("No agents available for distribution.");
        return [];
      }

      // Step 2: Calculate distribution
      const baseCount = Math.floor(totalDocs / numAgents);
      let remainder = totalDocs % numAgents;
      let startIndex = 0;
      const distributionResults = [];
      console.log(baseCount, " is the baseCount");
      console.log(remainder, " is the remainder");
      for (let i = 0; i < numAgents; i++) {
        const count = remainder == 0 ? baseCount : baseCount + 1;
        if (remainder > 0) {
          remainder -= 1;
        }
        const endIndex = startIndex + count - 1;

        // Step 3: Assign documents
        console.log("File ID: ", fileID);
        console.log("startIndex: ", startIndex);
        console.log("endIndex: ", endIndex);
        console.log("AgentID: ", agents.agents[i]._id);
        const res = await axios.post(
          "http://localhost:5000/distribution/",
          {
            fileID,
            startIndex,
            endIndex,
            agentID: agents.agents[i]._id,
            adminID: user._id, // Replace with actual admin ID
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        distributionResults.push({
          agentName: res.data.agentName,
          startIndex,
          endIndex,
        });

        startIndex = endIndex + 1;
      }

      return distributionResults;
    } catch (error) {
      console.error("Error during distribution:", error);
      toast.error("Failed to distribute documents among agents.");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose a file!");

    setIsLoading(true);

    try {
      const data = await parseFile(file);

      if (!validateDataStructure(data)) {
        throw new Error(
          "File must contain firstName, phone, and notes columns"
        );
      }

      const cleanedData = cleanData(data);

      const payload = {
        originalName: file.name,
        fileType: getNormalizedFileType(file), // Use normalized file type
        data: cleanedData,
      };

      const res = await axios.post("http://localhost:5000/file/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        const fileID = res.data._id;
        const distributionResults = await distributeDocuments(
          fileID,
          cleanedData.length,
          token
        );

        // Show modal with distribution summary
        setDistributionSummary(distributionResults);
        setShowModal(true);

        toast.success("File uploaded and documents distributed successfully.");
        e.target.reset();
        setFile(null);
      } else {
        throw new Error(res.data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong during upload");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <DistributionModal
        showModal={showModal}
        setShowModal={setShowModal}
        distributionSummary={distributionSummary}
      />

      <Card className="p-4 shadow-lg w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-3">Upload File and Distribute tasks</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="mb-2">
              Choose a file (.csv, .xlsx, .xls)
            </Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileChange}
                required
              />
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading || !file}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              "Upload and Distribute"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default UploadFilePage;
