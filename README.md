CROP MASTER
Project Introduction
Our project is called CropMaster. It is a full-stack Agriculture Management System developed to help farmers and landowners manage agricultural activities in a more organized and digital way. The main goal of this system is to reduce manual record keeping and improve farm management through a centralized platform.
What the project does
This system has two user roles: Farmer and Owner.
The farmer can log into the system and perform activities such as adding crop details, assigning crops to farmland, updating soil and weather data, reporting plant diseases, and managing irrigation, storage, harvest, machinery, and chemical usage.
The owner can log into the system and manage farmers, add farmlands, assign farmers to farmland, and monitor the overall farming activities and land usage.
So overall, this project helps manage farming operations, resources, and records in one place.
Frontend Technologies
For the frontend, we used React with Vite.
We used Material UI to design the user interface.
We used React Router DOM for page navigation.
We also used Framer Motion for animations and a better user experience.
For reports, we used jsPDF and PapaParse to generate PDF and CSV files.
The frontend also supports multi-language translations and theme switching.
Backend Technologies
For the backend, we used Java 17 and Spring Boot.
We used Spring Web to create REST APIs.
We used Spring Data JPA to connect the backend with the database and manage data operations.
We also used jBCrypt for password encryption and secure login handling.
The backend provides APIs for owner, farmer, farmland, crop, disease, irrigation, harvest, storage, weather, soil, chemical, and machinery management.
Database
For the database, we used MySQL.
The database name is cropmaster.
It stores all the main data related to:
•	owners
•	farmers
•	farmlands
•	crops
•	diseases
•	irrigation
•	harvest
•	storage
•	chemicals
•	machinery
•	soil
•	weather
This database is connected to the backend using JPA and Hibernate.
How to run the project
To start the project:
1.	First, create the MySQL database named cropmaster.
2.	Then update the MySQL username and password in the backend application.properties file.
3.	Start the backend using : mvnw.cmd spring-boot:run
4.	Start the fronted using : npm install , npm run 
5.	Then open the frontend in the browser using: http://localhost:5173
6.	The backend runs on : 8080 
Conclusion 
In summary, CropMaster is a smart agriculture management system that helps farmers and landowners manage farm activities more efficiently. It combines a modern frontend, a Spring Boot backend, and a MySQL database to create a complete full-stack solution.
 
