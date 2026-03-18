package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepositary extends JpaRepository<Crop, Integer> {

    List<Crop> findByFarmerNIC(String farmerNIC);

}
