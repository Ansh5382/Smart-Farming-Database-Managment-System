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
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String nic = loginData.get("nic");
        String password = loginData.get("password");

        ResponseEntity<?> response = ownerService.authenticateOwner(nic, password);
        return response;
    }

    @GetMapping("/profile")
    public ResponseEntity<Owner> getProfile(@RequestParam("nic") String nic) {
        Owner owner = ownerService.findByNic(nic);
        if (owner != null) {
            return ResponseEntity.ok(owner);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{nic}")
    public ResponseEntity<Owner> getOwnerByNic(@PathVariable String nic,
                                                @RequestAttribute(value = "authNic", required = false) String authNic,
                                                @RequestAttribute(value = "authRole", required = false) String authRole) {
        String resolvedNic = ("owner".equals(authRole) && authNic != null) ? authNic : nic;
        Owner owner = ownerService.findByNic(resolvedNic);

        if (owner != null) {
            return ResponseEntity.ok(owner);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody Map<String, String> deleteData,
                                         @RequestAttribute(value = "authNic", required = false) String authNic) {
        String nic = authNic != null ? authNic : deleteData.get("nic");
        String password = deleteData.get("password");
        return ownerService.deleteOwner(nic, password);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> data,
                                                 @RequestAttribute(value = "authNic", required = false) String authNic) {
        String nic = authNic != null ? authNic : data.get("nic");
        String currentPassword = data.get("currentPassword");
        String newPassword = data.get("newPassword");
        return ownerService.changePassword(nic, currentPassword, newPassword);
    }

    @PutMapping("/updateProfile/{nic}")
    public ResponseEntity<Owner> updateProfile(@PathVariable String nic,
                                               @RequestBody Owner updatedFields,
                                               @RequestAttribute(value = "authNic", required = false) String authNic,
                                               @RequestAttribute(value = "authRole", required = false) String authRole) {
        String resolvedNic = "owner".equals(authRole) && authNic != null ? authNic : nic;
        return ownerService.updateProfile(resolvedNic, updatedFields);
    }

}
