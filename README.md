# FastTrack Secure 🚀

A lightweight, serverless fasting tracker that runs entirely in the browser and uses **Google Sheets** as your personal, private cloud database.

## ✨ Features

* **Zero Server Costs:** Hosted for free on GitHub Pages; data stored in your personal Google Sheet.
* **Metabolic Roadmap:** Visualizes biological phases (Ketosis, Autophagy, HGH Surge) based on current fast duration.
* **Time Travel:** Forgot to start the timer? Easily adjust start and end times retroactively.
* **Weight Logging:** Track weight independent of fasting sessions.
* **Visual History:** Interactive charts showing fasting duration and weight trends over time.
* **Privacy Focused:** Passwords are hashed (SHA-256) on your device *before* being sent to the cloud. Your plain-text password never touches the internet.
* **Local-First:** Works offline using LocalStorage and syncs with the cloud when connection is restored.

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS (via CDN), Chart.js, Confetti.js.
* **Backend:** Google Apps Script (Serverless API).
* **Database:** Google Sheets.

## 🚀 Setup Guide

### Part 1: The Backend (Google Sheets)

1.  Create a new **Google Sheet**.
2.  Open **Extensions > Apps Script**.
3.  Paste the backend code (`Code.gs`) into the editor.
4.  **Important:** Ensure your Sheet has the following columns in order (Row 1 is headers):
    * `Col 1`: UserID
    * `Col 2`: Password (Hash)
    * `Col 3`: Status (ACTIVE/COMPLETED)
    * `Col 4`: Start Time
    * `Col 5`: End Time
    * `Col 6`: Goal Hours
    * `Col 7`: Weight
5.  Click **Deploy > New Deployment**.
    * Select type: **Web App**.
    * Execute as: **Me** (your email).
    * Who has access: **Anyone** (Required for the frontend to talk to Google).
6.  Copy the **Web App URL**.

### Part 2: The Frontend

1.  Open `index.html`.
2.  Find the configuration section at the bottom of the script:
    ```javascript
    const CLOUD_URL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE";
    ```
3.  Paste your Web App URL inside the quotes.
4.  Upload `index.html` to **GitHub Pages**, **Netlify**, or any static host.

## 🔐 Security Note

This app uses **Client-Side Hashing**. When you create a user or log in:
1.  You type your password (e.g., `mypassword`).
2.  The browser converts it to a SHA-256 hash (e.g., `5e884898da...`).
3.  Only the hash is sent to the Google Sheet.
4.  **Note:** To reset your password manually, you must generate a SHA-256 hash of your desired password online and paste it into the "Password" column of your Google Sheet.

## 📱 Usage Tips

* **Manual Start:** Click "Started earlier?" on the home screen to log a fast you began hours ago.
* **Edit Timer:** Tap the big timer numbers while fasting to adjust your start time.
* **Reset App:** If the app gets stuck, tap the "Authenticating..." text in the top left corner to log out. If that fails, wait 3 seconds and tap the red "⚠️ Tap to Reset" warning.

## 📄 License

MIT License. Feel free to fork and modify for your own health journey!
