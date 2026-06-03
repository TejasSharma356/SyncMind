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

> **🔐 Note on Authentication:** SyncMind now features full frontend authentication via Firebase (Email/Password & Google OAuth). However, the backend multi-tenant architecture is still in development, meaning meeting data is temporarily shared across the frontend for demonstration purposes until backend scoping is completed.

---

## 🏛️ Architecture & Ecosystem Workflow

SyncMInd operates on a seamless, zero-friction pipeline designed to eliminate the cognitive overhead of meetings. **It is critical that contributors understand this architecture to avoid accidentally breaking the pipeline or compromising the security model.**

### 1. Capture (Desktop App - Electron)
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

### 🔒 Security Model & Architecture Integrity
- **Decoupled Architecture:** The frontend dashboard should **never** connect directly to the database or require sensitive keys. It only reads from the secure API Gateway.
- **Authentication:** Any future authentication (e.g., OAuth) must happen on the frontend, but the verification and data access logic *must* be handled by the AWS Lambda backend.
- **No Hardcoded Secrets:** Contributors must use `.env` files for local development. Never commit API keys, AWS credentials, or sensitive data to the repository.

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

Because SyncMind is a multi-part ecosystem, the repository uses different branches for different components.

### 1. Web Dashboard (`main` branch)
```bash
# 1. Clone the repository
git clone https://github.com/TejasSharma356/SyncMInd.git
cd SyncMInd/syncmind

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env file and add your actual API endpoint:
# VITE_API_URL=https://your-api-gateway-url.amazonaws.com/dev/items

# 4. Start the development server
npm run dev
```

### 2. Desktop Client (`electron-recorder` branch)
```bash
# 1. Clone the repository (if you haven't already)
git clone https://github.com/TejasSharma356/SyncMInd.git
cd SyncMInd

# 2. Checkout the desktop client branch
git checkout electron-recorder

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file in the root with your AWS S3 bucket details & IAM keys:
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_REGION=your_aws_region
# S3_BUCKET_NAME=your_bucket_name

# 5. Run the Electron Desktop App
npm run dev

# 6. Build the packaged Windows installer (.exe)
npm run dist
```

---

## 🏗️ Setting Up Your Own Instance (Open Source)

Since SyncMind relies heavily on cloud infrastructure to process AI tasks, running your own version of this ecosystem requires provisioning your own AWS resources.

### 1. AWS Pipeline Setup
You must deploy the backend infrastructure in your own AWS account:
- **S3 Bucket:** To receive raw audio recordings.
- **AWS Lambda & AI Models:** To process the audio, run transcription, and extract insights/summaries.
- **DynamoDB:** To store the structured and processed meeting data.
- **API Gateway:** To securely serve the data to the web dashboard.

### 2. IAM Credentials & Configuration
You will need to generate an IAM User with the appropriate permissions for both upload and read operations:
- **Electron App (Desktop):** Requires your AWS `Access Key ID` and `Secret Access Key` (or equivalent temporary credentials) to securely upload audio recordings directly to your S3 bucket. You must configure these keys in the desktop app's environment.
- **Web Dashboard (This Repo):** Requires the endpoint URL from your API Gateway. Update the `.env` file in this web project with your custom `VITE_API_URL` to fetch and display the data.

---

## 🤝 Contributing

We welcome community contributions! To ensure a smooth process and maintain the integrity of the architecture, please read our [Contributing Guide](CONTRIBUTING.md) before opening a Pull Request.

In the guide, you will find:
- Local Development Setup
- Coding Standards & Branch Naming
- Issue Labels
- A curated list of **Open Tasks** (Easy, Medium, and Hard)

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
