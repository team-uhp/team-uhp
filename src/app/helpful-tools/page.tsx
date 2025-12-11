import { Container, Card, Button, Row, Col } from "react-bootstrap";

const tools = [
  { name: "When2Meet", desc: "Quickly find overlapping availability across your team.", href: "https://www.when2meet.com" },
  { name: "GitHub", desc: "The essential platform for hosting and collaborating on code.", href: "https://github.com" },
  { name: "Resend", desc: "Modern email service for automated and transactional emails.", href: "https://resend.com" },
  { name: "Vercel", desc: "Deploy front-end apps with ease using serverless functions.", href: "https://vercel.com" },
  { name: "VSCode", desc: "Powerful, free code editor with extensions for every language.", href: "https://code.visualstudio.com" },
  { name: "Slack", desc: "Channel-based chat, file sharing, and group calls.", href: "https://slack.com" },
  { name: "Discord", desc: "Voice, video, and text chat — ideal for quick collaboration.", href: "https://discord.com" },
  { name: "Notion", desc: "All-in-one workspace for notes, docs, and task tracking.", href: "https://www.notion.so" },
  { name: "Google Workspace", desc: "Docs, Sheets, Slides, Calendar, and Drive — essential productivity tools for teams.", href: "https://workspace.google.com" },
];

const HelpfulTools = () => (
  <main style={{ paddingTop: 0 }}>
    <Container
      fluid
      style={{
        backgroundImage: "url(/hero-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        paddingBottom: "120px", 
      }}
    >
      <Card
        className="h-100"
        style={{
          maxWidth: "1000px",
          width: "95%",
          margin: "0 auto",
          padding: "40px",
          borderRadius: "18px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          backdropFilter: "blur(6px)",
        }}
      >
        <h1
          className="text-center mb-4"
          style={{ color: "#024731", fontWeight: 700 }}
        >
          Helpful Tools
        </h1>

        <p className="text-center mb-5" style={{ fontSize: "1.1rem" }}>
          Tools we recommend for collaboration, communication, and productivity.
        </p>

        <Row xs={1} sm={2} md={3} className="g-4">
          {tools.map((tool) => (
            <Col key={tool.name}>
              <Card
                className="h-100"
                style={{
                  border: "1px solid #02473133",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <h5 style={{ color: "#024731", fontWeight: 600 }}>{tool.name}</h5>
                <p className="mt-2">{tool.desc}</p>

                <Button
                  href={tool.href}
                  target="_blank"
                  style={{
                    backgroundColor: "#068863ff",
                    borderColor: "#068863ff",
                    marginTop: "auto",
                  }}
                >
                  Visit
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
  </main>
);

export default HelpfulTools;
