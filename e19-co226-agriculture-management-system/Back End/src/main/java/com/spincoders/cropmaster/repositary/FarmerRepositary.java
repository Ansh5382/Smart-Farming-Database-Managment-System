package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmerRepositary extends JpaRepository<Farmer,Integer> {

    Farmer findByNic(String nic);

    @Query("SELECT f FROM Farmer f WHERE f.ownerNIC = :ownerNIC")
    List<Farmer> findByOwnerNIC(@Param("ownerNIC") String ownerNIC);

    void deleteByNic(String nic);

    void deleteByOwnerNIC(String ownerNIC);
}
