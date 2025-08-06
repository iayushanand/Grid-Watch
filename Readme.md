# ⚡ Grid Watch

Grid Watch is a real-time power monitoring solution designed to track the stability of your local electricity grid. Using an ESP microcontroller, the system detects outages or irregularities in power supply and visualizes them through a web interface.

---

## 🛠️ How It Works

1. **ESP Device Monitoring**  
    The ESP device is plugged into your home power supply. Every 10 seconds, it sends a `ping` to the backend server, indicating that power is available. 🔌

2. **Backend Processing**  
    The backend records the timestamp of each ping. If the time difference between two consecutive pings exceeds 30 seconds, it is considered a power outage or disruption. This event is then logged into the database. 🐘

3. **Web Visualization**  
    The website fetches the logged data and displays it in a clear, bar-format chart. Each bar represents a detected outage, allowing you to easily visualize the frequency and duration of power interruptions. 📊

---

## ✨ Features

- **Real-Time Monitoring:** Immediate detection of power outages. ⏱️
- **Automatic Logging:** Outages are automatically recorded in the database. 📝
- **Simple Setup:** Just plug in the ESP device, config files and start monitoring. 🧩

---

## 🗂️ Project Structure

- [**ESP Firmware:**](GridWatchESP) Handles periodic pings to the backend. 🖥️
- [**Backend Server:**](backend) Receives pings, detects outages, and stores events. 🗃️
- [**Frontend Website:**](website) Visualizes outage data in a user-friendly format. 🌐



## 🚀 Setup Instructions

1. **Flash the ESP:**  
    Upload the provided firmware to your ESP device. (Make sure you add api key and wifi creds) 🔥

2. **Connect to Power:**  
    Plug the ESP into your home power supply. ⚡

3. **Configure Backend:**  
    Set up the backend server to receive pings and connect to your database. 🛠️

4. **Launch the Website:**  
    Start the frontend to view outage data in real time. 🌍

---

## 🖼️ Screenshots

### ESP Device

<img src = "https://gcdnb.pbrd.co/images/AaTvJDDFfJ1I.png" width=200 alt="esp">


### Website Visualization
![webpage](https://gcdnb.pbrd.co/images/llXGlTRtgZGb.png?o=1)

---

## 🧰 Tech Stack
- ESP32 (Arduino framework) (PlatformIO)
- Backend: ExpressJS
- Database: PostgreSQL
- Frontend: Svelte


---


## 📄 License

This project is licensed under the MIT License.

---