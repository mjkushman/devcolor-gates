# Simple Rag - /dev/color

## Getting Started

Create a .env file and add your secret key from OpenAI.

```node
OPENAI_API_KEY=REPLACE-WITH-YOUR-SECRET-KEY
```

Install and start the application:

```bash
npm install
npm start
```

## Usage

```bash
Ask me anything:
```

Type your query into the command line:

User input:
> How can /dev/color help me develop my career?

Two steps are taken:

1. The app searchs a corpus for related Q&As.
2. The app constructs a prompt for ChatGPT to answer the user's query, including any relevant Q&A as context if any are found.

Bot output:
>/dev/color can help you develop your career by providing a supportive community focused on advancing Black technologists. It offers mentorship, career guidance, and professional development through workshops and events. Partnering with companies and organizations in the tech industry, /dev/color facilitates networking opportunities that can connect you with potential employers and mentors, potentially opening new career paths and opportunities.
