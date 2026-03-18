package com.spincoders.cropmaster.controller;

import com.spincoders.cropmaster.model.Farmland;
import com.spincoders.cropmaster.service.FarmLandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farmland")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmLandController {

    @Autowired
    private FarmLandService farmLandService;

    @PostMapping("/addNew")
    public String add(@RequestBody Farmland farmland) {
        farmLandService.saveFarmland(farmland);
        return "New FarmLand is added";
    }


    @GetMapping("/croped/{nic}/{ownerNIC}")
    public List<Farmland> getCropedFarmlands(@PathVariable String nic, @PathVariable String ownerNIC) {
        return farmLandService.getCropFarmland(nic, ownerNIC);
    }

    @GetMapping("/getAll/{nic}/{ownerNIC}")
    public List<Farmland> getFarmlandByNic(@PathVariable String nic, @PathVariable String ownerNIC) {
        return farmLandService.getFarmlandByNic(nic, ownerNIC);
    }

    @GetMapping("/byOwner/{ownerNIC}")
    public List<Farmland> getFarmlandsByOwner(@PathVariable String ownerNIC) {
        return farmLandService.getFarmlandsByOwner(ownerNIC);
    }

    @GetMapping("/uncroped/{nic}/{ownerNIC}")
    public List<Farmland> getUncropedFarmlands(@PathVariable String nic, @PathVariable String ownerNIC) {
        return farmLandService.getUncropFarmland(nic, ownerNIC);
    }

    @GetMapping("/noNicByOwner/{ownerNIC}")
    public List<Farmland> getFarmlandNoNicByOwner(@PathVariable String ownerNIC) {
        return farmLandService.getFarmlandNoNicByOwner(ownerNIC);
    }

    @GetMapping("/nicByOwner/{ownerNIC}")
    public List<Farmland> getFarmlandNicByOwner(@PathVariable String ownerNIC) {
        return farmLandService.getFarmlandNicByOwner(ownerNIC);
    }

    @PutMapping("/updateCrop/{farmlandId}/{cropId}")
    public Farmland updateAssignedCrop(@PathVariable int farmlandId, @PathVariable int cropId) {
        return farmLandService.updateAssignedCrop(farmlandId, cropId);
    }

    @PutMapping("/updateIrrigation/{farmlandId}/{irrigationId}")
    public Farmland updateAssignedIrrigation(@PathVariable int farmlandId, @PathVariable int irrigationId) {
        return farmLandService.updateAssignedIrrigation(farmlandId, irrigationId);
    }

    @PutMapping("/updateStorage/{farmlandId}/{storageId}")
    public Farmland updateAssignedStorage(@PathVariable int farmlandId, @PathVariable int storageId) {
        return farmLandService.updateAssignedStorage(farmlandId, storageId);
    }

    @PutMapping("/updateHarvest/{farmlandId}/{harvestId}")
    public Farmland updateAssignedHarvest(@PathVariable int farmlandId, @PathVariable int harvestId) {
        return farmLandService.updateAssignedHarvest(farmlandId, harvestId);
    }

    @PutMapping("/updateFarmer/{farmlandId}/{farmerNic}")
    public Farmland updateFarmerForFarmland(@PathVariable int farmlandId, @PathVariable String farmerNic) {
        return farmLandService.updateFarmer(farmlandId, farmerNic);
    }


    @GetMapping("getCrop/{farmlandId}")
    public int getFarmlandCropID(@PathVariable int farmlandId) {
        return farmLandService.getCropID(farmlandId);
    }

}
