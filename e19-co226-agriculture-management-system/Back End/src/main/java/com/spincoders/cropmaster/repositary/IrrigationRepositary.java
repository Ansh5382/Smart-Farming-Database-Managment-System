package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Irrigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IrrigationRepositary extends JpaRepository<Irrigation,Integer> {
    List<Irrigation> findByFarmerNIC(String farmerNIC);
}
