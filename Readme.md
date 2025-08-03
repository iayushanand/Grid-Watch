# ⚡ Grid Watch

Grid Watch is a real-time power monitoring solution designed to track the stability of your local electricity grid. Using an ESP microcontroller, the system detects outages or irregularities in power supply and visualizes them through a web interface.

---

## 🛠️ How It Works

1. **ESP Device Monitoring**  
    The ESP device is plugged into your home power supply. Every minute, it sends a `ping` to the backend server, indicating that power is available. 🔌

2. **Backend Processing**  
    The backend records the timestamp of each ping. If the time difference between two consecutive pings exceeds 70 seconds, it is considered a power outage or disruption. This event is then logged into the database. 🐘

3. **Web Visualization**  
    The website fetches the logged data and displays it in a clear, bar-format chart. Each bar represents a detected outage, allowing you to easily visualize the frequency and duration of power interruptions. 📊

---

## ✨ Features

- **Real-Time Monitoring:** Immediate detection of power outages. ⏱️
- **Automatic Logging:** Outages are automatically recorded in the database. 📝
- **Intuitive Visualization:** Outages are displayed in a bar chart for easy analysis. 📈
- **Simple Setup:** Just plug in the ESP device and start monitoring. 🧩

---

## 🗂️ Project Structure

- **ESP Firmware:** Handles periodic pings to the backend. 🖥️
- **Backend Server:** Receives pings, detects outages, and stores events. 🗃️
- **Frontend Website:** Visualizes outage data in a user-friendly format. 🌐

---

## 🚀 Setup Instructions

1. **Flash the ESP:**  
    Upload the provided firmware to your ESP device. 🔥

2. **Connect to Power:**  
    Plug the ESP into your home power supply. ⚡

3. **Configure Backend:**  
    Set up the backend server to receive pings and connect to your database. 🛠️

4. **Launch the Website:**  
    Start the frontend to view outage data in real time. 🌍

---

## 🖼️ Screenshots

### ESP Device Setup
<!-- Add your ESP device photo here -->

### Website Visualization
<!-- Add your website screenshot here -->

---

## 📄 License

This project is licensed under the MIT License.

---

**Monitor your grid. Stay informed.** 🧐