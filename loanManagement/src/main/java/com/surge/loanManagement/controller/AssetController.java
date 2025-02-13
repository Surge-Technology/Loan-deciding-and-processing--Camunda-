package com.surge.loanManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.surge.loanManagement.model.AssetDetails;
import com.surge.loanManagement.service.AssetService;

@RestController
public class AssetController {

	@Autowired
	AssetService assetService;
	
	 @PostMapping("/createAsset")
	    public ResponseEntity<AssetDetails> createAsset(@RequestBody AssetDetails assetDetails) {
	        AssetDetails createdAsset = assetService.createAsset(assetDetails);
	        return ResponseEntity.ok(createdAsset);
	    }

	    @GetMapping("/getAllAssets")
	    public ResponseEntity<List<AssetDetails>> getAllAssets() {
	        List<AssetDetails> assets = assetService.getAllAssets();
	        return ResponseEntity.ok(assets);
	    }

	    @GetMapping("/getAssetById/{assetId}")
	    public ResponseEntity<AssetDetails> getAssetById(@PathVariable long assetId) {
	        AssetDetails asset = assetService.getAssetById(assetId);
	        return ResponseEntity.ok(asset);
	    }

	    @PutMapping("/updateAsset/{assetId}")
	    public ResponseEntity<AssetDetails> updateAsset(@PathVariable long assetId, @RequestBody AssetDetails assetDetails) {
	        AssetDetails updatedAsset = assetService.updateAsset(assetId, assetDetails);
	        return ResponseEntity.ok(updatedAsset);
	    }

	    @DeleteMapping("/deleteAsset/{assetId}")
	    public ResponseEntity<Void> deleteAsset(@PathVariable long assetId) {
	    	assetService.deleteAsset(assetId);
	        return ResponseEntity.noContent().build();
	    }
	
}
