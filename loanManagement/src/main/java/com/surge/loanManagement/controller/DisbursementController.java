/*
 * package com.surge.loanManagement.controller;
 * 
 * import java.util.List;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.http.ResponseEntity; import
 * org.springframework.stereotype.Service; import
 * org.springframework.web.bind.annotation.DeleteMapping; import
 * org.springframework.web.bind.annotation.GetMapping; import
 * org.springframework.web.bind.annotation.PathVariable; import
 * org.springframework.web.bind.annotation.PostMapping; import
 * org.springframework.web.bind.annotation.PutMapping; import
 * org.springframework.web.bind.annotation.RequestBody;
 * 
 * import com.surge.loanManagement.model.DisbursementDetails; import
 * com.surge.loanManagement.service.DisbursementService;
 * 
 * @Service public class DisbursementController {
 * 
 * @Autowired DisbursementService disbursementService;
 * 
 * @PostMapping("/createDisbursement") public
 * ResponseEntity<DisbursementDetails> createDisbursement(
 * 
 * @RequestBody DisbursementDetails disbursementDetails) { DisbursementDetails
 * createdDisbursement =
 * disbursementService.createDisbursement(disbursementDetails); return
 * ResponseEntity.ok(createdDisbursement); }
 * 
 * @GetMapping("/getAllDisbursements") public
 * ResponseEntity<List<DisbursementDetails>> getAllDisbursements() {
 * List<DisbursementDetails> disbursements =
 * disbursementService.getAllDisbursements(); return
 * ResponseEntity.ok(disbursements); }
 * 
 * @GetMapping("/getDisbursementById/{disbursementId}") public
 * ResponseEntity<DisbursementDetails> getDisbursementById(@PathVariable long
 * disbursementId) { DisbursementDetails disbursement =
 * disbursementService.getDisbursementById(disbursementId); return
 * ResponseEntity.ok(disbursement); }
 * 
 * @PutMapping("/updateDisbursement/{disbursementId}") public
 * ResponseEntity<DisbursementDetails> updateDisbursement(@PathVariable long
 * disbursementId,
 * 
 * @RequestBody DisbursementDetails disbursementDetails) { DisbursementDetails
 * updatedDisbursement = disbursementService.updateDisbursement(disbursementId,
 * disbursementDetails); return ResponseEntity.ok(updatedDisbursement); }
 * 
 * @DeleteMapping("/deleteDisbursement/{disbursementId}") public
 * ResponseEntity<Void> deleteDisbursement(@PathVariable long disbursementId) {
 * disbursementService.deleteDisbursement(disbursementId); return
 * ResponseEntity.noContent().build(); }
 * 
 * 
 * }
 */