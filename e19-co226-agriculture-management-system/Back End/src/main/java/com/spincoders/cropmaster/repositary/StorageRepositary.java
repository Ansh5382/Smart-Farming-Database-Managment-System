package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StorageRepositary extends JpaRepository<Storage, Integer> {
    List<Storage> findByFarmerNIC(String farmerNIC);
}
