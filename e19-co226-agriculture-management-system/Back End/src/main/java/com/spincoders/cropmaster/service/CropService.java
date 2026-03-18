package com.spincoders.cropmaster.service;

import com.spincoders.cropmaster.model.Crop;

import java.util.List;
import java.util.Optional;

public interface CropService {

    public Crop saveCrop(Crop crop);

    public List<Crop> getAllCrop();

    public List<Crop> getCropsByFarmer(String farmerNIC);

    public Optional<Crop> getCropByID(int cropID);
}
