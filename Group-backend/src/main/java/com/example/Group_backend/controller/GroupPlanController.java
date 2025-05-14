package com.example.Group_backend.controller;

import com.example.Group_backend.model.GroupPlan;
import com.example.Group_backend.service.GroupPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/group-plans")
@CrossOrigin(origins = "*")
public class GroupPlanController {
    
    @Autowired
    private GroupPlanService groupPlanService;
    
    @GetMapping
    public ResponseEntity<List<GroupPlan>> getAllGroupPlans() {
        return ResponseEntity.ok(groupPlanService.getAllGroupPlans());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GroupPlan> getGroupPlanById(@PathVariable Long id) {
        return groupPlanService.getGroupPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<GroupPlan> createGroupPlan(@RequestBody GroupPlan groupPlan) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupPlanService.createGroupPlan(groupPlan));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GroupPlan> updateGroupPlan(@PathVariable Long id, @RequestBody GroupPlan groupPlan) {
        GroupPlan updatedPlan = groupPlanService.updateGroupPlan(id, groupPlan);
        if (updatedPlan != null) {
            return ResponseEntity.ok(updatedPlan);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupPlan(@PathVariable Long id) {
        boolean deleted = groupPlanService.deleteGroupPlan(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<GroupPlan>> getGroupPlansByCreator(@PathVariable Long creatorId) {
        return ResponseEntity.ok(groupPlanService.getGroupPlansByCreator(creatorId));
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<GroupPlan>> getActiveGroupPlans() {
        return ResponseEntity.ok(groupPlanService.getActiveGroupPlans());
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<GroupPlan>> getUpcomingGroupPlans() {
        return ResponseEntity.ok(groupPlanService.getUpcomingGroupPlans());
    }
    
    @GetMapping("/location")
    public ResponseEntity<List<GroupPlan>> getGroupPlansByLocation(@RequestParam String location) {
        return ResponseEntity.ok(groupPlanService.getGroupPlansByLocation(location));
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<GroupPlan>> getAvailableGroupPlans() {
        return ResponseEntity.ok(groupPlanService.getAvailableGroupPlans());
    }
    
    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<GroupPlan>> getGroupPlansByParticipant(@PathVariable Long participantId) {
        return ResponseEntity.ok(groupPlanService.getGroupPlansByParticipant(participantId));
    }
    
    @PostMapping("/{planId}/participants/{participantId}")
    public ResponseEntity<Void> addParticipant(@PathVariable Long planId, @PathVariable Long participantId) {
        boolean added = groupPlanService.addParticipant(planId, participantId);
        if (added) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    
    @DeleteMapping("/{planId}/participants/{participantId}")
    public ResponseEntity<Void> removeParticipant(@PathVariable Long planId, @PathVariable Long participantId) {
        boolean removed = groupPlanService.removeParticipant(planId, participantId);
        if (removed) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String filename = groupPlanService.uploadImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", filename));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updatePlanStatus(@PathVariable Long id, @RequestParam String status) {
        groupPlanService.updatePlanStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
