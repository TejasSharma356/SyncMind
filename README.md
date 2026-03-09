<div align="center">
  <img src="https://ui-avatars.com/api/?name=SM&background=2563EB&color=fff&size=80&rounded=true" alt="SyncMInd Logo" />
  <h1>SyncMind</h1>
  <p><em>Your meetings, perfectly synced and recalled.</em></p>
  <p>An AI-powered meeting assistant that silently attends your calls, transcribes every word, and turns conversations into actionable insights — automatically.</p>
  
  [![Website](https://img.shields.io/badge/Website-Live-green?style=for-the-badge&logo=vercel)](https://sync-mind.vercel.app/)
  
  [▶️ Watch Demo](https://youtu.be/zi7x8bZbbuw) • [⬇️ Download Windows App](https://github.com/Boomerforlife/SyncMind_Electron)
</div>

---

## 🚀 Live Deployment

Check out the live web dashboard: **[https://sync-mind.vercel.app/](https://sync-mind.vercel.app/)**

> **⚠️ Note on Authentication:** SyncMInd is currently in an open-access format. There is **no authentication/login wall** implemented for the dashboard yet. Meeting data is shared globally across the frontend for demonstration purposes.

---

## ⚡ The Ecosystem Workflow

SyncMInd operates on a seamless, zero-friction pipeline designed to eliminate the cognitive overhead of meetings. 

### 1. Capture (Desktop App)
The workflow starts with the custom **SyncMInd Windows Electron App**.
- Built with Electron & React.
- Hooks into your system audio to silently capture any meeting (Zoom, Teams, Google Meet, or in-person).
- *You hit record, and forget it.*

### 2. Analyze (Cloud Pipeline)
Once the recording stops, the magic happens.
- Audio chunks are bundled and uploaded securely to **AWS Simple Storage Service (S3)**.
- **AWS Lambda** instantly triggers, sending the audio through AI transcription models.
- The AI generates:
  - 📝 Full speaker-diarized transcripts
  - 🎯 High-level summaries & Key Points
  - ✅ Actionable Tasks & Commitments
  - 🧠 Intelligent "Silent Teammate" Insights
- Processed data is stored rapidly in **AWS DynamoDB**.

### 3. Deliver (Web Dashboard)
You are here. 📍
- Built with **React** & **Vite**.
- Hosted seamlessly on **Vercel**.
- Polls the backend dynamically to fetch fresh meeting data.
- By the time you pour your post-meeting coffee, your full meeting brief is beautifully formatted, waiting in your web dashboard.

---

## ✨ Web Dashboard Features

Our web application acts as the nerve center for all your meeting data.

| Feature Area | Description |
|---|---|
| 🗂 **Meeting List** | A chronological feed of all processed meetings, clearly marking AI extraction status and action item counts. |
| 📖 **Transcripts** | Broken down by speaker. You always know *who* said *what*. |
| 🎯 **Key Points** | Concise, bulleted summaries highlighting the absolute most important decisions. |
| ⚡ **Action Items** | Extracted commitments with assigned speakers, preventing dropped balls. |
| 🤖 **SyncMInd Insights** | The AI acts as your "Silent Teammate", adding overarching business insights that connect the dots. |

---

## 💻 Tech Stack

### Web Dashboard (This Repository)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (`index.css`)
- **Icons:** `lucide-react`
- **Animations:** Custom WebGL elements (Aether & Hills)
- **Deployment:** Vercel

### Data / Backend
- AWS Lambda (Node.js/Python processing)
- AWS API Gateway
- AWS DynamoDB
- AWS S3

### Desktop Client
- Electron framework
- Hardware Audio APIs

---

## 🛠️ Local Development

Want to spin up the web dashboard locally?

```bash
# 1. Clone the repository
git clone https://github.com/TejasSharma356/SyncMInd.git

# 2. Navigate to the project directory
cd SyncMInd/syncmind

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file and add your actual API endpoint:
# VITE_API_URL=https://your-api-gateway-url.amazonaws.com/dev/items

# 5. Start the development server
npm run dev
```

---

## 🤝 Contributing

We welcome community contributions! Since this is an ecosystem project, please specify if your PR is aimed at the frontend UX, the backend Lambda architecture, or the Electron Desktop Client.

1. Fork the repo 
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Authors

**Made by Team SyncMInd**

- **Tejas Sharma** - [@TejasSharma356](https://github.com/TejasSharma356)
- **Vighnesh Singh Dhanai** - [@Boomerforlife](https://github.com/Boomerforlife)
- **Adwait Panigrahi** - [@confuseddude](https://github.com/confuseddude)
- **Naraparaju Pranav Adithya** - [@npranavadithya](https://github.com/npranavadithya)

---
<div align="center">
  <sub>Built to let humans focus on thinking, collaborating, and deciding — not capturing.</sub>
</div>
