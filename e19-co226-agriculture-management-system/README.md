# CropMaster

CropMaster is a full-stack agriculture management system built to help farmers and landowners manage farmland, crops, resources, and daily farming operations in one place. The project combines a React frontend, a Spring Boot backend, and a MySQL database.

## Project Overview

The system supports two main user roles:

- Farmer
- Owner

Farmers can manage crop-related activities and field operations, while owners can monitor land usage, manage farmers, and track overall farm performance.

## Main Features

- User registration and login for farmers and owners
- Farmer and owner dashboards
- Farmland registration and farmer assignment
- Crop registration and crop-to-farmland assignment
- Disease reporting and crop disease tracking
- Chemical and machinery usage tracking
- Irrigation, harvest, and storage management
- Soil and weather updates for farmland
- PDF and CSV report generation
- Multi-language support
- Theme support with modern responsive UI

## Technologies Used

### Frontend

- React
- Vite
- Material UI
- React Router DOM
- Framer Motion
- Chart.js
- jsPDF
- PapaParse

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- Maven
- jBCrypt

### Database

- MySQL

## Project Structure

```text
e19-co226-agriculture-management-system/
|-- Front End/
|-- Back End/
|-- docs/
`-- README.md
```

## Database

The project uses a MySQL database named `cropmaster`.

Main data entities include:

- Owner
- Farmer
- Farmland
- Crop
- Chemical
- ChemicalUsage
- Machinery
- MachineryUsage
- Irrigation
- Harvest
- Storage
- Disease
- HostCrop
- Soil
- Weather

## How to Run the Project

### 1. Start the database

Create a MySQL database named:

```sql
CREATE DATABASE cropmaster;
```

Update database credentials in:

`Back End/src/main/resources/application.properties`

### 2. Run the backend

Go to the backend folder:

```bash
cd "Back End"
```

Run the Spring Boot application:

```bash
mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

### 3. Run the frontend

Go to the frontend folder:

```bash
cd "Front End"
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run start
```

The frontend will run on:

```text
http://localhost:5173
```

## API Summary

The backend provides REST APIs for:

- owner management
- farmer management
- farmland management
- crop management
- disease management
- chemical usage
- machinery usage
- irrigation
- harvest
- storage
- soil updates
- weather updates
- reporting-related data access

## Documentation

Detailed technical documentation is available in:

- `docs/PROJECT_DOCUMENTATION.md`

## Future Improvements

- Use environment variables for API URLs and secrets
- Add token-based authentication
- Add Swagger/OpenAPI documentation
- Add stronger database constraints and validation
- Add more automated tests

## Team

- E/19/300, Premawansha L M A H
- E/19/295, Premachandra K H J D
- E/19/304, Pushpakumara R M S P

## Conclusion

CropMaster is designed as a practical smart agriculture platform that helps improve farm management through digital record keeping, monitoring, and reporting. It brings together landowners and farmers in one connected system.
