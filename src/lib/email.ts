const sendAutoEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject,
        html: htmlContent,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendAutoEmail;
