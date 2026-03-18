# 🌾 CropMaster
### Smart Agriculture Management System

> Bridging the gap between traditional farming and digital innovation

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![React](https://img.shields.io/badge/React-Latest-61DAFB?logo=react)

---

## 🎯 Vision

CropMaster is revolutionizing agriculture by bringing **digital efficiency** to the farm. We're empowering farmers and landowners to manage their agricultural operations with precision, reducing manual work and maximizing productivity.

---

## ✨ What's Inside

### 👨‍🌾 For Farmers
- 🌱 Manage crops from planting to harvest
- 📊 Track soil & weather data in real-time
- 🦠 Report and monitor plant diseases
- 💧 Optimize irrigation schedules
- 🚜 Track machinery & chemical usage
- 📈 Generate detailed reports (PDF/CSV)

### 👔 For Farm Owners
- 👥 Manage farmers and team assignments
- 🏞️ Add and monitor multiple farmlands
- 📋 Track farm operations & land usage
- 📊 View comprehensive analytics
- 🎯 Monitor overall farm performance

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND                                               │
├─────────────────────────────────────────────────────────┤
│  ⚛️  React + Vite                                        │
│  🎨 Material UI (Modern Design)                          │
│  🎬 Framer Motion (Smooth Animations)                    │
│  📊 Chart.js (Data Visualization)                        │
│  📄 jsPDF & PapaParse (Report Generation)                │
│  🌐 Multi-Language Support                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BACKEND                                                │
├─────────────────────────────────────────────────────────┤
│  ☕ Java 17 + Spring Boot                               │
│  🔌 REST APIs                                           │
│  🔐 jBCrypt (Secure Authentication)                     │
│  📦 Spring Data JPA + Hibernate                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DATABASE                                               │
├─────────────────────────────────────────────────────────┤
│  🗄️  MySQL (Robust & Reliable)                          │
│  📋 Well-structured schema                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
smart-farming/
├── 📁 Front End/          # React + Vite application
├── 📁 Back End/           # Spring Boot REST APIs
├── 📁 docs/               # Technical documentation
└── 📄 README.md           # Project overview
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Node.js** (v14+)
- **MySQL** (5.7+)

### Setup & Run

#### 1️⃣ **Database Setup**
```bash
mysql -u root -p
CREATE DATABASE cropmaster;
```

#### 2️⃣ **Backend Configuration**
```bash
cd "Back End"
```
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cropmaster
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

#### 3️⃣ **Start Backend**
```bash
mvnw.cmd spring-boot:run
```
🟢 Backend running on `http://localhost:8080`

#### 4️⃣ **Start Frontend**
```bash
cd "Front End"
npm install
npm run dev
```
🟢 Frontend running on `http://localhost:5173`

---

## 📚 Core Features

| Feature | Description | User |
|---------|-------------|------|
| 🌱 Crop Management | Add, track, and manage crops | Farmer |
| 🏞️ Farmland Registration | Register and assign farmlands | Both |
| 🦠 Disease Tracking | Report and monitor plant diseases | Farmer |
| 💧 Irrigation Control | Plan and track irrigation | Farmer |
| 🚜 Machinery & Chemicals | Track usage and inventory | Farmer |
| 📊 Analytics Dashboard | View farm performance metrics | Owner |
| 📄 Report Generation | Export PDF/CSV reports | Both |
| 🌐 Multi-Language | Support for multiple languages | Both |
| 🎨 Theme Switching | Light/Dark mode support | Both |

---

## 🗄️ Database Schema

**Main Entities:**
- Owner • Farmer • Farmland • Crop
- Chemical • Machinery • Irrigation
- Harvest • Storage • Disease
- Soil • Weather

---

## 📡 API Endpoints

The backend provides comprehensive REST APIs for:
```
📌 Owner Management      - Create, read, update owner profiles
👨‍🌾 Farmer Management     - Manage farmer accounts & roles
🏞️ Farmland Management   - CRUD operations on farmlands
🌱 Crop Management       - Track crops across farmlands
🦠 Disease Management    - Report and track plant diseases
💧 Irrigation System     - Schedule and log irrigation
🚜 Machinery Tracking    - Monitor equipment usage
📊 Reports              - Generate agricultural reports
```

---

## 📖 Documentation

- **Full Technical Docs:** See `docs/PROJECT_DOCUMENTATION.md`
- **API Reference:** Available in backend documentation
- **Deployment Guide:** Coming soon!

---

## 🔮 Roadmap & Future Enhancements

- ✅ Token-based JWT Authentication
- ✅ Swagger/OpenAPI Documentation
- ✅ Environment Variables (.env configuration)
- ✅ Advanced Data Validation
- ✅ Automated Testing Suite
- 🚀 Mobile App (React Native)
- 🚀 IoT Sensor Integration
- 🚀 AI-powered Disease Detection
- 🚀 Real-time Notifications

---

## 👥 Development Team

| Name | ID |
|------|-----|
| Premawansha L M A H | E/19/300 |
| Premachandra K H J D | E/19/295 |
| Pushpakumara R M S P | E/19/304 |

---

## 💡 Why CropMaster?

✨ **Modern** - Built with latest technologies  
🔒 **Secure** - Encrypted passwords & secure authentication  
📊 **Data-Driven** - Make informed farming decisions  
🎨 **User-Friendly** - Intuitive design for all users  
🌍 **Scalable** - Designed to grow with your farm  
📱 **Responsive** - Works on all devices  

---

## 📝 License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 🤝 Contributing

We welcome contributions! Whether it's bug reports, feature suggestions, or code improvements:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Get in Touch

Have questions or suggestions? Reach out to the team!

---

## 🌟 Show Your Support

If CropMaster helped you, please give us a ⭐ on GitHub!

---

**Last Updated:** March 2026 | **Version:** 1.0.0

*Transforming Agriculture, One Farm at a Time* 🌾