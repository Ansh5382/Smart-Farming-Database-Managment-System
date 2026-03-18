# CropMaster Project Documentation

## 1. Project Summary

CropMaster is a full-stack agriculture management system for two user roles:

- Farmers, who manage day-to-day cultivation activities
- Owners, who manage farmland allocation, farmer records, and overall farm monitoring

The project is split into:

- A React + Vite frontend in `Front End/`
- A Spring Boot backend in `Back End/`
- A MySQL database named `cropmaster`

The system focuses on operational farm management: crop assignment, irrigation, storage, harvesting, disease logging, soil and weather updates, machinery and chemical usage tracking, and downloadable reports.

---

## 2. Technology Stack

### Frontend

- React 18
- Vite 4
- Material UI (MUI)
- React Router DOM
- Framer Motion
- React Pro Sidebar
- Chart.js and `react-chartjs-2`
- jsPDF and `jspdf-autotable`
- PapaParse
- Three.js
- `@fontsource/inter`, `@fontsource/outfit`, `@fontsource/roboto`

### Backend

- Java 17
- Spring Boot 3.1.2
- Spring Web
- Spring Data JPA
- MySQL Connector/J
- jBCrypt
- Maven

### Database

- MySQL
- Database name configured in the backend: `cropmaster`
- Hibernate schema mode: `update`

---

## 3. High-Level Architecture

### Frontend

The frontend is a single-page application built with React. It uses:

- `BrowserRouter` for page navigation
- Context providers for theme, language, and logged-in NIC
- Direct `fetch()` calls to backend REST endpoints on `http://localhost:8080`

### Backend

The backend follows a standard Spring Boot layered structure:

- `controller/` exposes REST endpoints
- `service/` contains business logic
- `repositary/` handles JPA data access
- `model/` defines database entities

### Data flow

1. The user signs in from the React frontend.
2. The frontend stores the NIC in local storage through `NicContext`.
3. Screens call backend endpoints using `fetch()`.
4. Spring Boot services read and write MySQL records through JPA repositories.
5. The frontend renders live operational data and can export reports as PDF or CSV.

---

## 4. Project Structure

```text
e19-co226-agriculture-management-system/
|-- Back End/
|   |-- pom.xml
|   `-- src/main/
|       |-- java/com/spincoders/cropmaster/
|       |   |-- controller/
|       |   |-- model/
|       |   |-- repositary/
|       |   |-- service/
|       |   `-- CropmasterApplication.java
|       `-- resources/
|           `-- application.properties
|-- Front End/
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|       |-- assets/
|       |-- components/
|       |-- config/
|       |-- containers/
|       |-- i18n/
|       `-- router/
`-- docs/
    |-- README.md
    `-- PROJECT_DOCUMENTATION.md
```

---

## 5. Frontend Modules and Features

### 5.1 Core frontend features

- Role-based login for farmer and owner
- Separate dashboards for farmer and owner
- Light/dark theme support
- Language switching through translation dictionaries
- Voice assistant for basic navigation commands
- PDF and CSV report export
- Responsive UI built with MUI

### 5.2 Frontend routing

The main routes are:

- `/` - login page
- `/signupfarmer` - farmer registration
- `/signupowner` - owner registration
- `/farmerhome` - farmer dashboard
- `/reportdisease`
- `/usechemical`
- `/usemachine`
- `/irrigation`
- `/harvest`
- `/storage`
- `/updatesoil`
- `/updateweather`
- `/soilhealth`
- `/settings`
- `/profile`
- `/reports`
- `/ownerhome` - owner dashboard
- `/addfarmer`
- `/addfarmland`
- `/owner/settings`
- `/owner/profile`
- `/owner/reports`

### 5.3 Shared frontend infrastructure

- `ThemeContext.jsx`
  - Stores dark mode preference in local storage
  - Builds the MUI theme from `src/config/theme.js`

- `LanguageContext.jsx`
  - Stores selected language in local storage
  - Uses translation dictionaries from `src/i18n/translations.js`

- `NicContext.jsx`
  - Stores the active user's NIC in local storage
  - Used across screens to fetch role-specific data

### 5.4 Multi-language support

Translation keys are provided for:

- English (`en`)
- Tamil (`ta`)
- Hindi (`hi`)
- Sinhala (`si`)

### 5.5 Voice assistant

`VoiceAssistant.jsx` uses the browser speech APIs:

- `SpeechRecognition` / `webkitSpeechRecognition`
- `speechSynthesis`

Supported navigation-style commands include:

- home
- profile
- settings
- reports
- farmland
- harvest
- irrigation
- storage
- disease
- weather
- soil
- logout

### 5.6 Farmer-side features

The farmer portal supports:

- Viewing assigned cultivated and uncultivated farmlands
- Registering crop varieties
- Assigning a crop to an available farmland
- Reporting crop diseases
- Logging chemical usage
- Logging machinery usage
- Adding irrigation methods and linking them to farmland
- Adding harvest methods and linking them to farmland
- Adding storage entries and linking them to farmland
- Updating soil metrics per farmland
- Updating weather metrics per farmland
- Viewing soil health information
- Accessing reports filtered to the current farmer

### 5.7 Owner-side features

The owner portal supports:

- Viewing all farmlands registered under the owner
- Viewing all farmers registered under the owner
- Adding new farmlands
- Assigning or reassigning farmers to farmlands
- Adding farmers under a specific owner
- Monitoring plot-level insights:
  - weather
  - soil
  - disease history
  - chemical usage
  - machinery usage
- Viewing global crop distribution
- Accessing reports across all records

### 5.8 Reporting features

The reports module can generate:

- Harvest reports
- Crop disease-hosting reports
- Disease reports
- Storage reports
- Irrigation reports

Exports supported:

- PDF via `jsPDF` and `jspdf-autotable`
- CSV via `PapaParse`

---

## 6. Backend Modules and Features

### 6.1 Implemented backend domains

The backend contains controllers, services, and repositories for:

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

### 6.2 Authentication and profile management

Both farmer and owner modules support:

- registration
- login
- profile fetch by NIC
- profile update
- password change
- account deletion

Passwords are handled with `jBCrypt`.

### 6.3 REST API overview

#### Owner

- `POST /owner/addNew`
- `POST /owner/login`
- `GET /owner/{nic}`
- `DELETE /owner/delete`
- `PUT /owner/changePassword`
- `PUT /owner/updateProfile/{nic}`

#### Farmer

- `POST /farmer/addNew`
- `GET /farmer/byOwner/{ownerNIC}`
- `POST /farmer/login`
- `GET /farmer/{nic}`
- `DELETE /farmer/delete`
- `PUT /farmer/changePassword`
- `PUT /farmer/updateProfile/{nic}`

#### Farmland

- `POST /farmland/addNew`
- `GET /farmland/croped/{nic}/{ownerNIC}`
- `GET /farmland/getAll/{nic}/{ownerNIC}`
- `GET /farmland/byOwner/{ownerNIC}`
- `GET /farmland/uncroped/{nic}/{ownerNIC}`
- `GET /farmland/noNicByOwner/{ownerNIC}`
- `GET /farmland/nicByOwner/{ownerNIC}`
- `PUT /farmland/updateCrop/{farmlandId}/{cropId}`
- `PUT /farmland/updateIrrigation/{farmlandId}/{irrigationId}`
- `PUT /farmland/updateStorage/{farmlandId}/{storageId}`
- `PUT /farmland/updateHarvest/{farmlandId}/{harvestId}`
- `PUT /farmland/updateFarmer/{farmlandId}/{farmerNic}`
- `GET /farmland/getCrop/{farmlandId}`

#### Crop

- `POST /crop/addNew`
- `GET /crop/getAll`
- `GET /crop/byFarmer/{farmerNIC}`
- `GET /crop/getbyID/{cropID}`

#### Chemical

- `POST /chemical/addNew`
- `GET /chemical/getAll`
- `GET /chemical/byFarmer/{farmerNIC}`

#### Chemical usage

- `POST /chemicalusage/addNew`
- `GET /chemicalusage/getAll`
- `GET /chemicalusage/getDetails/{farmlandID}`
- `GET /chemicalusage/getChemical/{farmlandID}`

#### Machinery

- `POST /machinery/addNew`
- `GET /machinery/getAll`
- `GET /machinery/byFarmer/{farmerNIC}`

#### Machinery usage

- `POST /machineryusage/addNew`
- `GET /machineryusage/getAll`
- `GET /machineryusage/getDetails/{farmlandID}`
- `GET /machineryusage/getMachinery/{farmlandID}`

#### Irrigation

- `POST /irrigation/addNew`
- `GET /irrigation/getAll`
- `GET /irrigation/byFarmer/{farmerNIC}`

#### Harvest

- `POST /harvest/addNew`
- `GET /harvest/getAll`
- `GET /harvest/byFarmer/{farmerNIC}`

#### Storage

- `POST /storage/addNew`
- `GET /storage/getAll`
- `GET /storage/byFarmer/{farmerNIC}`

#### Disease

- `POST /disease/addNew`
- `GET /disease/getAll`
- `GET /disease/byFarmer/{farmerNIC}`

#### HostCrop

- `POST /hostcrop/addNew`
- `GET /hostcrop/getAll`
- `GET /hostcrop/getDisease/{farmlandID}`

#### Soil

- `POST /soil/addNew`
- `GET /soil/getDetails/{farmlandID}`

#### Weather

- `POST /weather/addNew`
- `GET /weather/getDetails/{farmlandID}`

---

## 7. Database Design

The backend uses entity classes in `Back End/src/main/java/com/spincoders/cropmaster/model/`.

Important note:

- Most relationships are represented with plain ID or NIC fields instead of JPA relational mappings.
- This means the data model is relational in practice, but the application manages those links manually.

### 7.1 Database configuration

From `application.properties`:

- URL: `jdbc:mysql://localhost:3306/cropmaster`
- Username: `root`
- Driver: `com.mysql.cj.jdbc.Driver`
- Hibernate DDL mode: `update`

### 7.2 Entity and table summary

#### `Owner`

- `ownerID` - primary key
- `nic`
- `password`
- `name`
- `age`
- `mobile`

#### `Farmer`

- `farmerid` - primary key
- `nic`
- `password`
- `name`
- `age`
- `mobile`
- `experince`
- `ownerNIC`

#### `Farmland`

- `farmlandID` - primary key
- `name`
- `size`
- `location`
- `nic` - assigned farmer NIC
- `cropID`
- `irrigationID`
- `harvestID`
- `storageID`
- `ownerNIC`

#### `Crop`

- `cropId` - primary key
- `name`
- `variety`
- `farmerNIC`

#### `Chemical`

- `chemicalID` - primary key
- `name`
- `handling`
- `usage`
- `manufacturer`
- `safety`
- `envir_impact`
- `farmerNIC`

#### `ChemicalUsage`

- `chemicalUsageID` - primary key
- `nic`
- `farmlandID`
- `chemicalID`
- `chemicalName`
- `date`

#### `Machinery`

- `machineID` - primary key
- `name`
- `type`
- `cost`
- `envir_impact`
- `safely`
- `farmerNIC`

#### `MachineryUsage`

- `machineryusageID` - primary key
- `nic`
- `farmlandID`
- `machineryID`
- `machineryName`
- `date`

#### `Irrigation`

- `systemID` - primary key
- `delivery`
- `source`
- `method`
- `maintainerNIC`
- `farmerNIC`

#### `Harvest`

- `methodID` - primary key
- `method`
- `time`
- `cost`
- `farmerNIC`

#### `Storage`

- `storageID` - primary key
- `name`
- `location`
- `capacity`
- `humidity`
- `temperature`
- `farmerNIC`

#### `Disease`

- `diseaseID` - primary key
- `name`
- `type`
- `transmission`
- `symptom`
- `farmerNIC`

#### `HostCrop`

- `hostcropID` - primary key
- `farmlandID`
- `diseaseID`
- `diseaseName`
- `nic`
- `date`

#### `Soil`

- `farmlandID` - primary key
- `temperature`
- `ph`
- `structure`
- `waterholding`
- `nutrition`

#### `Weather`

- `farmlandID` - primary key
- `temperature`
- `rainfall`
- `humidity`
- `windspeed`
- `radiation`

### 7.3 Logical relationships

Even though they are mostly not modeled with JPA relations, the intended links are:

- One owner -> many farmers through `Farmer.ownerNIC`
- One owner -> many farmlands through `Farmland.ownerNIC`
- One farmer -> many crops through `Crop.farmerNIC`
- One farmer -> many chemical records through `Chemical.farmerNIC`
- One farmer -> many machinery records through `Machinery.farmerNIC`
- One farmer -> many irrigation records through `Irrigation.farmerNIC`
- One farmer -> many harvest records through `Harvest.farmerNIC`
- One farmer -> many storage records through `Storage.farmerNIC`
- One farmer -> many disease records through `Disease.farmerNIC`
- One farmland -> zero or one active crop through `Farmland.cropID`
- One farmland -> zero or one irrigation record through `Farmland.irrigationID`
- One farmland -> zero or one storage record through `Farmland.storageID`
- One farmland -> zero or one harvest record through `Farmland.harvestID`
- One farmland -> zero or one soil record through `Soil.farmlandID`
- One farmland -> zero or one weather record through `Weather.farmlandID`
- One farmland -> many chemical usage logs through `ChemicalUsage.farmlandID`
- One farmland -> many machinery usage logs through `MachineryUsage.farmlandID`
- One farmland -> many disease-host logs through `HostCrop.farmlandID`

### 7.4 Simplified ER-style view

```text
Owner (nic)
  -> Farmer.ownerNIC
  -> Farmland.ownerNIC

Farmer (nic)
  -> Crop.farmerNIC
  -> Chemical.farmerNIC
  -> Machinery.farmerNIC
  -> Irrigation.farmerNIC
  -> Harvest.farmerNIC
  -> Storage.farmerNIC
  -> Disease.farmerNIC
  -> Farmland.nic

Farmland (farmlandID)
  -> Soil.farmlandID
  -> Weather.farmlandID
  -> ChemicalUsage.farmlandID
  -> MachineryUsage.farmlandID
  -> HostCrop.farmlandID
  -> cropID / irrigationID / harvestID / storageID
```

---

## 8. Screen-to-API Mapping

### Farmer screens

- `FarmerHome.jsx`
  - fetches farmer profile
  - fetches cropped and uncropped farmlands
  - creates crop records
  - links a crop to a farmland

- `ReportDisease.jsx`
  - creates disease records
  - creates host-crop disease logs

- `UseChemical.jsx`
  - creates chemical master records
  - creates chemical usage records

- `UseMachine.jsx`
  - creates machinery master records
  - creates machinery usage records

- `Irrigation.jsx`
  - creates irrigation records
  - links irrigation to farmland

- `Harvest.jsx`
  - creates harvest records
  - links harvest method to farmland

- `Storage.jsx`
  - creates storage records
  - links storage to farmland

- `UpdateSoil.jsx`
  - writes soil data per farmland

- `UpdateWeather.jsx`
  - writes weather data per farmland

- `Reports.jsx`
  - reads report data
  - exports PDF and CSV

### Owner screens

- `OwnerHome.jsx`
  - fetches all farmers under the owner
  - fetches all farmlands under the owner
  - fetches crop list
  - fetches weather, soil, disease, chemical, and machinery details for selected land

- `FarmerDetails.jsx`
  - adds and lists farmers under an owner

- `AddFarmland.jsx`
  - creates farmlands
  - assigns farmers to farmlands

---

## 9. Local Setup and Run Guide

### Prerequisites

- Node.js and npm
- Java 17
- Maven wrapper or Maven installed
- MySQL server running locally

### Step 1: Create the database

Create a MySQL database named:

```sql
CREATE DATABASE cropmaster;
```

### Step 2: Configure backend database credentials

Edit:

`Back End/src/main/resources/application.properties`

Current configuration expects:

```properties
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:mysql://localhost:3306/cropmaster
spring.datasource.username=root
spring.datasource.password=7720
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

Change the username and password to match the local MySQL setup if needed.

### Step 3: Run the backend

From `Back End/`:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### Step 4: Run the frontend

From `Front End/`:

```bash
npm install
npm run start
```

The frontend runs on:

```text
http://localhost:5173
```

### Step 5: Open the application

Open:

```text
http://localhost:5173
```

---

## 10. Important Implementation Notes

- The frontend uses hard-coded backend URLs pointing to `http://localhost:8080`.
- CORS in several controllers is configured for `http://localhost:5173`.
- User session state is lightweight and NIC-based, stored in browser local storage.
- Entity relationships are mostly handled manually through foreign key-like fields instead of JPA object associations.
- With `ddl-auto=update`, the schema may evolve automatically from entity classes at startup.

---

## 11. Current Strengths of the Project

- Clear separation between owner and farmer workflows
- Full-stack implementation with UI, backend API, and database persistence
- Broad farm-operation coverage instead of only crop registration
- Report export support for administrative use
- Multi-language support already started in the frontend
- Theme support and richer UI interactions with MUI and Framer Motion

---

## 12. Possible Improvements

- Replace hard-coded API URLs with environment variables
- Introduce proper authentication with tokens or sessions
- Add DTOs and validation for request payloads
- Add explicit foreign keys and stronger relational constraints in MySQL
- Normalize naming inconsistencies like `experince`, `croped`, and `uncroped`
- Add backend API documentation with Swagger/OpenAPI
- Add unit and integration tests for major workflows
- Store secrets like database passwords outside source control

---

## 13. Conclusion

CropMaster is a practical agriculture management platform with a modern frontend, a Spring Boot backend, and a MySQL persistence layer. It supports both farm owners and farmers, and the current implementation already covers core agricultural workflows including land assignment, crop deployment, disease logging, irrigation, storage, harvesting, machinery, chemicals, soil, weather, and downloadable reports.

This document is based on the current repository structure and the code that is present in the frontend routes, backend controllers, and backend entity models.
