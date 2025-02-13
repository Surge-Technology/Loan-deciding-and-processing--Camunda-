package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.AssetDetails;
import com.surge.loanManagement.repository.AssetRepository;

@Service
public class AssetService {

	@Autowired
	AssetRepository assetRepository;
	
	 public AssetDetails createAsset(AssetDetails assetDetails) {
	        return assetRepository.save(assetDetails);
	    }

	    public List<AssetDetails> getAllAssets() {
	        return assetRepository.findAll();
	    }

	    public AssetDetails getAssetById(long assetId) {
	        return assetRepository.findById(assetId)
	                .orElseThrow(() -> new RuntimeException("Asset not found with ID: " + assetId));
	    }

	    public AssetDetails updateAsset(long assetId, AssetDetails assetDetails) {
	        AssetDetails existingAsset = getAssetById(assetId);

	        existingAsset.setCreatedBy(assetDetails.getCreatedBy());
	        existingAsset.setCreatedOn(assetDetails.getCreatedOn());
	        existingAsset.setModifiedBy(assetDetails.getModifiedBy());
	        existingAsset.setModifiedOn(assetDetails.getModifiedOn());
	        return assetRepository.save(existingAsset);
	    }

	    public void deleteAsset(long assetId) {
	    	assetRepository.deleteById(assetId);
	    }
}
