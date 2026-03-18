package com.spincoders.cropmaster.service;

import com.spincoders.cropmaster.model.Farmland;
import java.util.List;

public interface FarmLandService {

    public Farmland saveFarmland(Farmland farmland);

    public List<Farmland> getAllFarmLand();

    public List<Farmland> getCropFarmland(String nic, String ownerNIC);

    public List<Farmland> getUncropFarmland(String nic, String ownerNIC);

    public Farmland updateAssignedCrop(int farmlandId, int cropId);

    public Farmland updateAssignedIrrigation(int farmlandId, int irrigationId);

    public Farmland updateAssignedStorage(int farmlandId, int storageId);

    public Farmland updateAssignedHarvest(int farmlandId, int harvestId);

    public List<Farmland> getFarmlandByNic(String nic, String ownerNIC);

    public Farmland updateFarmer(int farmlandId, String farmerNIC);

    public int getCropID(int farmlandId);

    public List<Farmland> getFarmlandsByOwner(String ownerNIC);

    public List<Farmland> getFarmlandNoNicByOwner(String ownerNIC);

    public List<Farmland> getFarmlandNicByOwner(String ownerNIC);
}
