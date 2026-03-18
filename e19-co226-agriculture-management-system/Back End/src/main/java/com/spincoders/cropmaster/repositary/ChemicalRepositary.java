package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Chemical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChemicalRepositary extends JpaRepository<Chemical, Integer> {
    List<Chemical> findByFarmerNIC(String farmerNIC);
}
