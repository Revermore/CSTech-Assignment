import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      style={{
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
      }}
    >
      <Container>
        <Navbar.Brand href="/dashboard">Splitify™</Navbar.Brand>
        <Navbar.Toggle aria-controls="splitify-navbar" />
        <Navbar.Collapse id="splitify-navbar">
          <Nav className="me-auto">
            {user?.role === "admin" && (
              <>
                <Nav.Link href="/dashboard/add-agent">Add Agent</Nav.Link>
                <Nav.Link href="/dashboard/upload">Upload Data</Nav.Link>
                <Nav.Link href="/dashboard/view">View Lists</Nav.Link>
              </>
            )}
          </Nav>
          <div className="d-flex align-items-center text-white gap-3">
            {user && <span>👤</span>}
            <Button
              size="sm"
              variant="light"
              className="border border-dark"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
