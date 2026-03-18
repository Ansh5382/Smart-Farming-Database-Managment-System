package com.spincoders.cropmaster.service;

import com.spincoders.cropmaster.model.Farmer;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface FarmerService {

    public Farmer saveFarmer(Farmer farmer);

    public List<Farmer> getAllFarmers();

    public ResponseEntity<String> authenticateFarmer(String nic, String password);

    public Farmer findByNic(String nic);

    public java.util.List<Farmer> getFarmersByOwner(String ownerNIC);

    public ResponseEntity<String> deleteFarmer(String nic, String password);

    public ResponseEntity<String> changePassword(String nic, String currentPassword, String newPassword);

    public ResponseEntity<Farmer> updateProfile(String nic, Farmer updatedFields);
}
