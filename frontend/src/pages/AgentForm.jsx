import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../UserContext";

function AgentForm() {
  const { user, token } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        mobile: {
          countryCode: formData.countryCode,
          number: formData.number.trim(),
        },
        password: formData.password,
        adminId: user?._id, // sending adminId from user context
      };

      const res = await axios.post("http://localhost:5000/agent/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Agent created successfully 🎉");
      setFormData({
        name: "",
        countryCode: "+91",
        number: "",
        password: "",
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create agent 😢";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "50px" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-4 shadow-lg rounded-4">
              <h3 className="text-center mb-4">Add New Agent</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Agent Name (⚠ must be unique)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter unique agent name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col xs={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Add Agent"}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default AgentForm;
