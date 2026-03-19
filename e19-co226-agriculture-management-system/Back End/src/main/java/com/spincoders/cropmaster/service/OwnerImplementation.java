package com.spincoders.cropmaster.service;

import com.spincoders.cropmaster.auth.JwtService;
import com.spincoders.cropmaster.dto.LoginResponse;
import com.spincoders.cropmaster.model.Owner;
import com.spincoders.cropmaster.repositary.OwnerRepositary;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.spincoders.cropmaster.repositary.FarmerRepositary;
import com.spincoders.cropmaster.repositary.FarmLandRepositary;

@Service
public class OwnerImplementation implements OwnerService {

    @Autowired
    private OwnerRepositary ownerRepositary;

    @Autowired
    private FarmerRepositary farmerRepositary;

    @Autowired
    private FarmLandRepositary farmLandRepositary;

    @Autowired
    private JwtService jwtService;

    @Override
    public Owner saveOwner(Owner owner) {
        // Hash the password before saving
        String hashedPassword = BCrypt.hashpw(owner.getPassword(), BCrypt.gensalt());
        owner.setPassword(hashedPassword);
        return ownerRepositary.save(owner);
    }

    @Override
    public ResponseEntity<?> authenticateOwner(String nic, String password) {
        Owner owner = ownerRepositary.findByNic(nic);

        if (owner == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid NIC\"}");
        }

        if (BCrypt.checkpw(password, owner.getPassword())) {
            String token = jwtService.generateToken(nic, "owner");
            return ResponseEntity.ok(new LoginResponse("Login successful", token, nic, "owner"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Wrong password\"}");
        }
    }

    @Override
    public Owner findByNic(String nic) {
        return ownerRepositary.findByNic(nic);
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteOwner(String nic, String password) {
        Owner owner = ownerRepositary.findByNic(nic);
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid NIC\"}");
        }

        if (BCrypt.checkpw(password, owner.getPassword())) {
            // Delete all farmlands owned by this owner
            farmLandRepositary.deleteByOwnerNIC(nic);
            // Delete all farmers working for this owner
            farmerRepositary.deleteByOwnerNIC(nic);
            // Delete the owner
            ownerRepositary.deleteByNic(nic);
            return ResponseEntity.ok("{\"message\": \"Account deleted successfully\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Wrong password\"}");
        }
    }

    @Override
    public ResponseEntity<String> changePassword(String nic, String currentPassword, String newPassword) {
        Owner owner = ownerRepositary.findByNic(nic);
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid NIC\"}");
        }

        if (BCrypt.checkpw(currentPassword, owner.getPassword())) {
            String hashedNewPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            owner.setPassword(hashedNewPassword);
            ownerRepositary.save(owner);
            return ResponseEntity.ok("{\"message\": \"Password changed successfully\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Current password is incorrect\"}");
        }
    }

    @Override
    public ResponseEntity<Owner> updateProfile(String nic, Owner updatedFields) {
        try {
            Owner owner = ownerRepositary.findByNic(nic);
            if (owner == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Update name if provided and not empty
            if (updatedFields.getName() != null) {
                String name = updatedFields.getName().trim();
                if (!name.isEmpty()) {
                    owner.setName(name);
                }
            }
            
            // Update age - only if a valid positive age is provided
            int age = updatedFields.getAge();
            if (age > 0) {
                owner.setAge(age);
            }
            
            // Update mobile if provided and not empty
            if (updatedFields.getMobile() != null) {
                String mobile = updatedFields.getMobile().trim();
                if (!mobile.isEmpty()) {
                    owner.setMobile(mobile);
                }
            }

            Owner saved = ownerRepositary.save(owner);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
