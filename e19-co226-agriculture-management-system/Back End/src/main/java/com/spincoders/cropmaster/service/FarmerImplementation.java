package com.spincoders.cropmaster.service;

import com.spincoders.cropmaster.auth.JwtService;
import com.spincoders.cropmaster.dto.LoginResponse;
import com.spincoders.cropmaster.model.Farmer;
import com.spincoders.cropmaster.repositary.FarmerRepositary;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.spincoders.cropmaster.repositary.FarmLandRepositary;
import com.spincoders.cropmaster.model.Farmland;

import java.util.List;

@Service
public class FarmerImplementation implements FarmerService{

    @Autowired
    private FarmerRepositary farmerRepositary;

    @Autowired
    private FarmLandRepositary farmLandRepositary;

    @Autowired
    private JwtService jwtService;

    @Override
    public Farmer saveFarmer(Farmer farmer) {
        String hashedPassword = BCrypt.hashpw(farmer.getPassword(), BCrypt.gensalt());
        farmer.setPassword(hashedPassword);
        return farmerRepositary.save(farmer);
    }

    @Override
    public List<Farmer> getAllFarmers() {
        return farmerRepositary.findAll();
    }

    @Override
    public ResponseEntity<?> authenticateFarmer(String nic, String password) {
        Farmer farmer = farmerRepositary.findByNic(nic);

        if (farmer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid NIC\"}");
        }

        if (BCrypt.checkpw(password, farmer.getPassword())) {
            String token = jwtService.generateToken(nic, "farmer");
            return ResponseEntity.ok(new LoginResponse("Login successful", token, nic, "farmer"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Wrong password\"}");
        }
    }

    @Override
    public List<Farmer> getFarmersByOwner(String ownerNIC) {
        return farmerRepositary.findByOwnerNIC(ownerNIC);
    }

    @Override
    public Farmer findByNic(String nic) {
        return farmerRepositary.findByNic(nic);
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteFarmer(String nic, String password) {
        Farmer farmer = farmerRepositary.findByNic(nic);
        if (farmer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid NIC\"}");
        }

        if (BCrypt.checkpw(password, farmer.getPassword())) {
            // Unassign from all farmlands
            List<Farmland> lands = farmLandRepositary.findByNic(nic);
            for (Farmland land : lands) {
                land.setNic(null);
                farmLandRepositary.save(land);
            }
            // Delete the farmer
            farmerRepositary.deleteByNic(nic);
            return ResponseEntity.ok("{\"message\": \"Account deleted successfully\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Wrong password\"}");
        }
    }

    @Override
    public ResponseEntity<String> changePassword(String nic, String currentPassword, String newPassword) {
        Farmer farmer = farmerRepositary.findByNic(nic);
        if (farmer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid NIC\"}");
        }

        if (BCrypt.checkpw(currentPassword, farmer.getPassword())) {
            String hashedNewPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            farmer.setPassword(hashedNewPassword);
            farmerRepositary.save(farmer);
            return ResponseEntity.ok("{\"message\": \"Password changed successfully\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Current password is incorrect\"}");
        }
    }

    @Override
    public ResponseEntity<Farmer> updateProfile(String nic, Farmer updatedFields) {
        try {
            Farmer farmer = farmerRepositary.findByNic(nic);
            if (farmer == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Update name if provided and not empty
            if (updatedFields.getName() != null) {
                String name = updatedFields.getName().trim();
                if (!name.isEmpty()) {
                    farmer.setName(name);
                }
            }
            
            // Update age - only if a valid positive age is provided
            int age = updatedFields.getAge();
            if (age > 0) {
                farmer.setAge(age);
            }
            
            // Update mobile if provided and not empty
            if (updatedFields.getMobile() != null) {
                String mobile = updatedFields.getMobile().trim();
                if (!mobile.isEmpty()) {
                    farmer.setMobile(mobile);
                }
            }
            
            // Update experience if provided
            if (updatedFields.getExperince() != null) {
                farmer.setExperince(updatedFields.getExperince());
            }

            Farmer saved = farmerRepositary.save(farmer);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
