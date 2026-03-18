package com.spincoders.cropmaster.repositary;

import com.spincoders.cropmaster.model.Farmland;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmLandRepositary extends JpaRepository<Farmland, Integer> {

    @Query("SELECT u FROM Farmland u WHERE u.nic = :nic AND u.ownerNIC = :ownerNIC AND u.cropID != 0 ")
    List<Farmland> findCropLand(@Param("nic") String nic, @Param("ownerNIC") String ownerNIC);

    @Query("SELECT u FROM Farmland u WHERE u.nic = :nic AND u.ownerNIC = :ownerNIC AND u.cropID = 0 ")
    List<Farmland> findUncropLand(@Param("nic") String nic, @Param("ownerNIC") String ownerNIC);

    @Query("SELECT u FROM Farmland u WHERE u.nic = :nic AND u.ownerNIC = :ownerNIC")
    List<Farmland> findFarmlandByFarmer(@Param("nic") String nic, @Param("ownerNIC") String ownerNIC);

    @Query("SELECT f FROM Farmland f WHERE f.ownerNIC = :ownerNIC")
    List<Farmland> findByOwnerNIC(@Param("ownerNIC") String ownerNIC);

    @Query("SELECT u FROM Farmland u WHERE u.ownerNIC = :ownerNIC AND (u.nic IS NULL OR u.nic = '')")
    List<Farmland> findFarmlandNoNicByOwner(@Param("ownerNIC") String ownerNIC);

    @Query("SELECT u FROM Farmland u WHERE u.ownerNIC = :ownerNIC AND (u.nic IS NOT NULL AND u.nic != '')")
    List<Farmland> findFarmlandNicByOwner(@Param("ownerNIC") String ownerNIC);

    void deleteByOwnerNIC(String ownerNIC);

    List<Farmland> findByNic(String nic);
}
