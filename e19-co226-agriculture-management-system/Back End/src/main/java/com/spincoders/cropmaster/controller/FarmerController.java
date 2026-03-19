package com.spincoders.cropmaster.controller;
import com.spincoders.cropmaster.model.Farmer;
import com.spincoders.cropmaster.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/farmer")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/addNew")
    public ResponseEntity<Farmer> add(@RequestBody Farmer farmer) {
        Farmer savedFarmer = farmerService.saveFarmer(farmer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFarmer);
    }


    @GetMapping("/byOwner/{ownerNIC}")
    public List<Farmer> getFarmersByOwner(@PathVariable String ownerNIC) {
        return farmerService.getFarmersByOwner(ownerNIC);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String nic = loginData.get("nic");
        String password = loginData.get("password");

        ResponseEntity<?> response = farmerService.authenticateFarmer(nic, password);
        return response;
    }

    @GetMapping("/profile")
    public ResponseEntity<Farmer> getProfile(@RequestAttribute(value = "authNic", required = true) String authNic) {
        Farmer farmer = farmerService.findByNic(authNic);
        if (farmer != null) {
            return ResponseEntity.ok(farmer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{nic}")
    public ResponseEntity<Farmer> getFarmerByNic(@PathVariable String nic,
                                                 @RequestAttribute(value = "authNic", required = false) String authNic,
                                                 @RequestAttribute(value = "authRole", required = false) String authRole) {
        String resolvedNic = ("farmer".equals(authRole) && authNic != null) ? authNic : nic;
        Farmer farmer = farmerService.findByNic(resolvedNic);

        if (farmer != null) {
            return ResponseEntity.ok(farmer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody Map<String, String> deleteData,
                                         @RequestAttribute(value = "authNic", required = false) String authNic) {
        String nic = authNic != null ? authNic : deleteData.get("nic");
        String password = deleteData.get("password");
        return farmerService.deleteFarmer(nic, password);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> data,
                                                 @RequestAttribute(value = "authNic", required = false) String authNic) {
        String nic = authNic != null ? authNic : data.get("nic");
        String currentPassword = data.get("currentPassword");
        String newPassword = data.get("newPassword");
        return farmerService.changePassword(nic, currentPassword, newPassword);
    }

    @PutMapping("/updateProfile/{nic}")
    public ResponseEntity<Farmer> updateProfile(@PathVariable String nic,
                                                @RequestBody Farmer updatedFields,
                                                @RequestAttribute(value = "authNic", required = false) String authNic,
                                                @RequestAttribute(value = "authRole", required = false) String authRole) {
        String resolvedNic = "farmer".equals(authRole) && authNic != null ? authNic : nic;
        return farmerService.updateProfile(resolvedNic, updatedFields);
    }

}
