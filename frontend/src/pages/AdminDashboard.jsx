import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useUser } from "../UserContext";

function AdminDashboard() {
  const { user } = useUser();

  const cardData = [
    {
      title: "Add Agent",
      text: "Create and manage agents who will be assigned CSV tasks.",
      btnText: "Go to Agent Form",
      btnVariant: "primary",
      link: "/dashboard/add-agent",
      img: "https://cdn-icons-png.flaticon.com/512/10492/10492511.png",
    },
    {
      title: "Upload Data",
      text: "Upload a CSV or Excel file and split tasks among your agents.",
      btnText: "Upload Data",
      btnVariant: "primary",
      link: "/dashboard/upload",
      img: "https://cdn-icons-png.flaticon.com/512/4147/4147103.png",
    },
    {
      title: "View Assignments",
      text: "See what list each agent has received and track task distribution.",
      btnText: "View Lists",
      btnVariant: "primary",
      link: "/dashboard/view",
      img: "https://cdn-icons-png.flaticon.com/512/579/579702.png",
    },
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center text-black">
        Welcome back, {user?.username || "Admin"} 👋
      </h2>

      <Row className="g-4">
        {cardData.map((card, index) => (
          <Col md={6} lg={4} key={index}>
            <Card className="h-100 shadow-lg border-0 rounded-4">
              <Card.Img variant="top" src={card.img} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{card.title}</Card.Title>
                <Card.Text className="flex-grow-1">{card.text}</Card.Text>
                <div className="d-grid">
                  <Button
                    variant={card.btnVariant}
                    href={card.link}
                    className="mt-auto"
                  >
                    {card.btnText}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AdminDashboard;
