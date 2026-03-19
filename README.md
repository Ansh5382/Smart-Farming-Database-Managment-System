# 🌾 CropMaster
### Smart Agriculture Management System

> *Bridging the gap between traditional farming and digital innovation*

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![React](https://img.shields.io/badge/React-Latest-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?logo=mysql&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white)

---

## 🎯 Vision

**CropMaster** is revolutionizing agriculture by bringing **digital efficiency** to the farm. We empower farmers and landowners to manage their agricultural operations with precision — reducing manual record-keeping and maximizing productivity through a centralized, modern platform.

---

## ✨ What's Inside

### 👨‍🌾 For Farmers
- 🌱 Add crop details and assign crops to farmland
- 📊 Update soil & weather data in real-time
- 🦠 Report and monitor plant diseases
- 💧 Plan and track irrigation schedules
- 🚜 Manage machinery & chemical usage
- 🌾 Record harvest and manage storage
- 🌿 View soil health insights per farmland
- 👤 View and edit personal profile details
- ⚙️ Manage settings (theme, language, password, account)
- 🎤 Use hands-free voice assistant for navigation
- 📈 Generate detailed reports (PDF/CSV)

### 👔 For Farm Owners
- 👥 Add and manage farmers, assign them to farmlands
- 🏞️ Register and monitor multiple farmlands
- 📋 Track overall farm operations & land usage
- 📊 View comprehensive analytics and activity logs
- 🎯 Monitor overall farm performance at a glance
- 👤 View and edit personal profile details
- ⚙️ Manage settings (theme, language, password, account)
- 🎤 Use hands-free voice assistant for navigation
- 📈 Generate reports across all farm records (PDF/CSV)

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND                                               │
├─────────────────────────────────────────────────────────┤
│  ⚛️  React 18 + Vite 4    (Fast, modern SPA)             │
│  🎨 Material UI (MUI 5)   (Polished UI components)       │
│  🎬 Framer Motion         (Smooth animations)            │
│  📊 Chart.js              (Data visualization)           │
│  📄 jsPDF & PapaParse     (PDF & CSV report generation)  │
│  🌐 4-language i18n       (EN / TA / HI / SI)            │
│  🌙 Theme Switching       (Light / Dark mode)            │
│  🎤 Voice Assistant       (Browser speech recognition)   │
│  🌀 Three.js              (3D visual elements)           │
│  📋 react-pro-sidebar     (Sidebar navigation)           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BACKEND                                                │
├─────────────────────────────────────────────────────────┤
│  ☕ Java 17 + Spring Boot 3.1.2 (REST API server)        │
│  🔌 Spring Web            (RESTful API endpoints)        │
│  🔐 jBCrypt               (Secure password encryption)   │
│  📦 Spring Data JPA       (ORM & database operations)    │
│  🐘 Hibernate             (Entity mapping & queries)     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DATABASE                                               │
├─────────────────────────────────────────────────────────┤
│  🗄️  MySQL 5.7+            (Reliable relational storage) │
│  📋 Well-structured schema with 15 entities             │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
Smart-Farming-Database-Management-System/
├── 📁 e19-co226-agriculture-management-system/
│   ├── 📁 Front End/      # React + Vite application
│   ├── 📁 Back End/       # Spring Boot REST API server
│   └── 📁 docs/           # Technical documentation
└── 📄 README.md           # Project overview
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Node.js** v14+
- **MySQL** 5.7+

### Step-by-Step Setup

#### 1️⃣ Database Setup
```bash
mysql -u root -p
CREATE DATABASE cropmaster;
```

#### 2️⃣ Configure Backend
Navigate to the backend directory and edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cropmaster
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

#### 3️⃣ Start the Backend
```bash
cd "Back End"
mvnw.cmd spring-boot:run
```
🟢 Backend running at `http://localhost:8080`

#### 4️⃣ Start the Frontend
```bash
cd "Front End"
npm install
npm run start
```
🟢 Frontend running at `http://localhost:5173`

---

## 📚 Feature Comparison

| Feature | Description | 👨‍🌾 Farmer | 👔 Owner |
|---------|-------------|:---------:|:-------:|
| 🌱 Crop Management | Add, assign & track crops | ✅ | — |
| 🏞️ Farmland Registration | Register and assign farmlands | — | ✅ |
| 🦠 Disease Tracking | Report & monitor plant diseases | ✅ | — |
| 💧 Irrigation Control | Plan & log irrigation schedules | ✅ | — |
| 🌾 Harvest & Storage | Record yield and storage data | ✅ | — |
| 🚜 Machinery & Chemicals | Track usage & inventory | ✅ | — |
| 🌤️ Soil & Weather Data | Log environmental conditions | ✅ | — |
| 🌿 Soil Health View | Soil health insights per farmland | ✅ | — |
| 👥 Farmer Management | Add farmers & assign to farmland | — | ✅ |
| 📊 Analytics Dashboard | View farm performance metrics | — | ✅ |
| 📄 Report Generation | Export PDF & CSV reports | ✅ | ✅ |
| 👤 Profile Management | View & edit personal profile | ✅ | ✅ |
| ⚙️ Settings | Password, theme & language | ✅ | ✅ |
| 🌐 Multi-Language Support | EN / Tamil / Hindi / Sinhala | ✅ | ✅ |
| 🎨 Theme Switching | Light / Dark mode | ✅ | ✅ |
| 🎤 Voice Assistant | Hands-free navigation commands | ✅ | ✅ |

---

## 🗄️ Database Schema Overview

The `cropmaster` MySQL database contains the following core entities:

```
👤 Owner          — Farm owner accounts & profiles
👨‍🌾 Farmer         — Farmer accounts linked to owners
🏞️ Farmland       — Land parcels managed by owners
🌱 Crop           — Crop records assigned to farmlands
🦠 Disease        — Plant disease reports & tracking
🔗 HostCrop       — Disease-to-farmland event logs
💧 Irrigation     — Irrigation schedules & logs
🌾 Harvest        — Harvest records per crop
📦 Storage        — Post-harvest storage details
🧪 Chemical       — Chemical master records
📋 ChemicalUsage  — Chemical usage logs per farmland
🚜 Machinery      — Machinery master records
🔧 MachineryUsage — Machinery usage logs per farmland
🌍 Soil           — Soil data per farmland
🌤️ Weather        — Weather records per farmland
```

All entities are connected via JPA/Hibernate and mapped to the MySQL database.

---

## 📡 API Endpoints Summary

The Spring Boot backend exposes a comprehensive set of REST APIs:

```
📌 /owner              — Create, read, update, delete owner profiles
👨‍🌾 /farmer             — Manage farmer accounts, login & assignments
🏞️ /farmland           — CRUD operations on farmland records
🌱 /crop               — Track crops across farmlands
🦠 /disease            — Report and manage plant diseases
🔗 /hostcrop           — Log disease events per farmland
💧 /irrigation         — Schedule and log irrigation events
🌾 /harvest            — Record and query harvest data
📦 /storage            — Manage storage entries
🧪 /chemical           — Manage chemical master records
📋 /chemicalusage      — Log and query chemical usage per farmland
🚜 /machinery          — Manage machinery master records
🔧 /machineryusage     — Log and query machinery usage per farmland
🌍 /soil               — Log soil conditions per farmland
🌤️ /weather            — Record weather data per farmland
```

---

## 🔮 Roadmap & Future Enhancements

- [ ] 🔑 Token-based JWT Authentication
- [ ] 📖 Swagger / OpenAPI Documentation
- [ ] 🔧 Environment Variables (`.env` configuration)
- [ ] ✅ Advanced Data Validation & Error Handling
- [ ] 🧪 Automated Testing Suite (Unit + Integration)
- [ ] 📱 Mobile App (React Native)
- [ ] 🌐 IoT Sensor Integration
- [ ] 🤖 AI-powered Crop Disease Detection
- [ ] 🔔 Real-time Notifications & Alerts
- [ ] ☁️ Cloud Deployment (AWS / Azure)

---

## 👥 Development Team

| Name | Student ID |
|------|-----------|
| Premawansha L M A H | E/19/300 |
| Premachandra K H J D | E/19/295 |
| Pushpakumara R M S P | E/19/304 |

---

## 💡 Why CropMaster?

| | |
|---|---|
| ✨ **Modern** | Built with the latest technologies (React, Java 17, Spring Boot) |
| 🔒 **Secure** | Passwords encrypted with jBCrypt |
| 📊 **Data-Driven** | Make informed decisions with real-time analytics |
| 🎨 **User-Friendly** | Intuitive Material UI design for all users |
| 🌍 **Scalable** | Designed to grow alongside your farm operations |
| 📱 **Responsive** | Works seamlessly on all screen sizes and devices |

---

## 🤝 Contributing

We welcome contributions! Whether it's bug reports, feature suggestions, or code improvements:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request 🎉

---

## 📝 License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.

---

## 🌟 Show Your Support

If CropMaster helped you or inspired you, please give us a ⭐ on GitHub — it means a lot to the team!

---

**Last Updated:** March 2026 &nbsp;|&nbsp; **Version:** 1.0.0

*Transforming Agriculture, One Farm at a Time* 🌾
 
