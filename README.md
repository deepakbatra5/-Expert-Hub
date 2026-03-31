# Expert Hub

AI chat app with role-based assistants, deployed serverless on Vercel.

## Features

- **Role-based chat**: Doctor, Lawyer, Engineer, Teacher, Student
- **Themes**: Midnight, Ocean, Sunrise, Forest
- **Markdown formatting**: Code blocks, lists, headings in responses
- **Serverless deployment**: Fast, scalable, low cost

## Quick Start

### Local Testing

```bash
npm install
# Create .env from .env.example
# Add your OPENAI_API_KEY
```

To test the API function locally:
```bash
node api/chat.js
```

### Deploy to Vercel

1. **Push to GitHub** (if not already):
   ```bash
   git add -A
   git commit -m "Ready for Vercel"
   git push
   ```

2. **Link to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your GitHub repo
   - Vercel auto-detects configuration from `vercel.json`
   - Click "Deploy"

3. **Set Environment Variable**:
   - After deployment starts, go to Project Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = your OpenAI key
   - Redeploy

Your app is live! 🚀

## Project Structure

```
.
├── api/
│   └── chat.js          # Serverless function (Vercel)
├── public/
│   ├── index.html       # Frontend UI
│   ├── style.css        # Themes + styling
│   └── script.js        # Chat logic
├── vercel.json          # Vercel deployment config
├── package.json         # Dependencies
└── .env.example         # Environment template
```

## API Reference

**POST** `/api/chat`

Request:
```javascript
{
  "message": "Explain quantum computing",
  "role": "teacher"
}
```

Response:
```javascript
{
  "reply": "Quantum computing uses quantum bits..."
}
```

**Roles**: `doctor` | `lawyer` | `engineer` | `teacher` | `student`

## Environment Variables

Set in Vercel dashboard (Project Settings → Environment Variables):

- `OPENAI_API_KEY` (required) - Your OpenAI API key

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js serverless function
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Vercel (zero-config deployment)

## License

MIT
