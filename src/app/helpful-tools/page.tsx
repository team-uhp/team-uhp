import { Container } from "react-bootstrap";


const HelpfulTools = () => (
  <main>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Container
        fluid
        className="py-5"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
          marginTop: '-40px',
          minHeight: '70vh',
          paddingTop: '100px',
        }}
      >
        <h1>Helpful Tools</h1>
        <p>
          <a href="https://www.when2meet.com">When2meet</a>
          : A convenient site for discovering what times team members are available for meetings or get togethers.
        </p>
        <p>
          <a href="https://github.com">GitHub</a>
          : The most popular repository site, particularly for open source code.
        </p>
        <p>
          <a href="https://resend.com">Resend</a>
          : A commonly recommended service for commercial automated emails.
        </p>
        <p>
          <a href="https://vercel.com">Vercel</a>
          : A webapp hosting site that offers limited free hosting.
        </p>
        <p>
          <a href="https://code.visualstudio.com">VSCode</a>
          : Free code editor with many plugins and convenient automated tools.
        </p>
      </Container>
    </div>
  </main>
)

export default HelpfulTools;
