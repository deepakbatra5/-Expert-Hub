# Expert Hub - AI Role-Based Chat Application

A full-stack AI chat application with role-based interactions powered by OpenAI. Deployable on Render with frontend and backend on the same server.

## Features
- Multiple expert roles (Doctor, Lawyer, Engineer, Teacher, Student)
- Dark/Light theme support (Midnight, Ocean, Sunrise, Forest)
- ChatGPT-like markdown formatting for responses
- Responsive UI/UX
- GitHub Pages + GitHub Actions CI/CD
- One-click Render deployment

## Local Development

1. Clone the repo:
```bash
git clone https://github.com/deepakbatra5/-Expert-Hub.git
cd expert-hub
```

2. Create `.env`:
```bash
cp .env.example .env
# Add your OpenAI API key
```

3. Install and run:
```bash
npm install
npm start
# Open http://localhost:3000
```

## Deploy to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign in
3. Click "New +" > "Web Service"
4. Connect your GitHub repo
5. Render will auto-detect `render.yaml` configuration
6. Add environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
7. Click Deploy

### Option 2: Manual Setup on Render

1. Create new Web Service on Render
2. Configure:
   - Name: `expert-hub`
   - Runtime: `Node`
   - Start Command: `npm start`
   - Add environment variable `OPENAI_API_KEY`
3. Deploy

Your app will be live at `https://your-app-name.onrender.com`

## Frontend on GitHub Pages (Optional)

To also host frontend on GitHub Pages:

1. Create GitHub secret `EXPERT_HUB_API_URL` with value: `https://your-render-domain.onrender.com/chat`
2. GitHub Actions will auto-inject it during Pages deploy

## Project Structure

```
expert-hub/
├── backend/
│   └── server.js (Express API + static file serving)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── package.json
├── render.yaml (Render deployment config)
└── .env.example
```

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4 Mini
- **Hosting**: Render (App), GitHub Pages (Optional UI mirror)
- **CI/CD**: GitHub Actions

## Environment Variables

Required:
- `OPENAI_API_KEY` - Your OpenAI API key

Optional:
- `PORT` - Default: 3000
- `NODE_ENV` - Default: production

## License
MIT
