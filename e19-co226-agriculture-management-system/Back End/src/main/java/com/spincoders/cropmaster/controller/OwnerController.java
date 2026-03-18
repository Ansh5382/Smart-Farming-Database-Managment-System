package com.spincoders.cropmaster.controller;

import com.spincoders.cropmaster.model.Disease;
import com.spincoders.cropmaster.model.Farmer;
import com.spincoders.cropmaster.model.Owner;
import com.spincoders.cropmaster.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/owner")
@CrossOrigin(origins = "http://localhost:5173")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/addNew")
    public ResponseEntity<Owner> add(@RequestBody Owner owner) {
        Owner savedOwner = ownerService.saveOwner(owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOwner);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginData) {
        String nic = loginData.get("nic");
        String password = loginData.get("password");

        ResponseEntity<String> response = ownerService.authenticateOwner(nic, password);
        return response;
    }

    @GetMapping("/{nic}")
    public ResponseEntity<Owner> getFarmerByNic(@PathVariable String nic) {
        Owner owner = ownerService.findByNic(nic);

        if (owner != null) {
            return ResponseEntity.ok(owner);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody Map<String, String> deleteData) {
        String nic = deleteData.get("nic");
        String password = deleteData.get("password");
        return ownerService.deleteOwner(nic, password);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> data) {
        String nic = data.get("nic");
        String currentPassword = data.get("currentPassword");
        String newPassword = data.get("newPassword");
        return ownerService.changePassword(nic, currentPassword, newPassword);
    }

    @PutMapping("/updateProfile/{nic}")
    public ResponseEntity<Owner> updateProfile(@PathVariable String nic, @RequestBody Owner updatedFields) {
        return ownerService.updateProfile(nic, updatedFields);
    }

}
