package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiseaseRepositary extends JpaRepository<Disease, Integer> {
    List<Disease> findByFarmerNIC(String farmerNIC);
}
