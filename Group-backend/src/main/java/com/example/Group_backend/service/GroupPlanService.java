package com.example.Group_backend.service;

import com.example.Group_backend.model.GroupPlan;
import com.example.Group_backend.repository.GroupPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class GroupPlanService {
    
    @Autowired
    private GroupPlanRepository groupPlanRepository;
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    public List<GroupPlan> getAllGroupPlans() {
        return groupPlanRepository.findAll();
    }
    
    public Optional<GroupPlan> getGroupPlanById(Long id) {
        return groupPlanRepository.findById(id);
    }
    
    public GroupPlan createGroupPlan(GroupPlan groupPlan) {
        if (groupPlan.getCreatedAt() == null) {
            groupPlan.setCreatedAt(LocalDateTime.now());
        }
        
        if (groupPlan.getStatus() == null) {
            groupPlan.setStatus("ACTIVE");
        }
        
        return groupPlanRepository.save(groupPlan);
    }
    
    public GroupPlan updateGroupPlan(Long id, GroupPlan updatedPlan) {
        return groupPlanRepository.findById(id)
                .map(plan -> {
                    plan.setName(updatedPlan.getName());
                    plan.setDescription(updatedPlan.getDescription());
                    plan.setStartDate(updatedPlan.getStartDate());
                    plan.setEndDate(updatedPlan.getEndDate());
                    plan.setLocation(updatedPlan.getLocation());
                    plan.setStatus(updatedPlan.getStatus());
                    plan.setMaxParticipants(updatedPlan.getMaxParticipants());
                    plan.setBudget(updatedPlan.getBudget());
                    
                    if (updatedPlan.getImageUrl() != null) {
                        plan.setImageUrl(updatedPlan.getImageUrl());
                    }
                    
                    return groupPlanRepository.save(plan);
                })
                .orElse(null);
    }
    
    public boolean deleteGroupPlan(Long id) {
        return groupPlanRepository.findById(id)
                .map(plan -> {
                    groupPlanRepository.delete(plan);
                    return true;
                })
                .orElse(false);
    }
    
    public List<GroupPlan> getGroupPlansByCreator(Long creatorId) {
        return groupPlanRepository.findByCreatorId(creatorId);
    }
    
    public List<GroupPlan> getActiveGroupPlans() {
        return groupPlanRepository.findByStatus("ACTIVE");
    }
    
    public List<GroupPlan> getUpcomingGroupPlans() {
        return groupPlanRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "ACTIVE");
    }
    
    public List<GroupPlan> getGroupPlansByLocation(String location) {
        return groupPlanRepository.findByLocationContainingIgnoreCase(location);
    }
    
    public List<GroupPlan> getAvailableGroupPlans() {
        return groupPlanRepository.findAvailablePlans();
    }
    
    public List<GroupPlan> getGroupPlansByParticipant(Long participantId) {
        return groupPlanRepository.findPlansByParticipant(participantId);
    }
    
    public boolean addParticipant(Long planId, Long participantId) {
        return groupPlanRepository.findById(planId)
                .map(plan -> {
                    if (plan.getParticipantIds().size() < plan.getMaxParticipants() 
                            && !plan.getParticipantIds().contains(participantId)) {
                        plan.addParticipant(participantId);
                        groupPlanRepository.save(plan);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
    
    public boolean removeParticipant(Long planId, Long participantId) {
        return groupPlanRepository.findById(planId)
                .map(plan -> {
                    if (plan.getParticipantIds().contains(participantId)) {
                        plan.removeParticipant(participantId);
                        groupPlanRepository.save(plan);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
    
    public String uploadImage(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String filename = UUID.randomUUID().toString() + "_" + Objects.requireNonNull(file.getOriginalFilename());
        Path filePath = uploadPath.resolve(filename);
        
        // Save the file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return filename;
    }
    
    public void updatePlanStatus(Long id, String status) {
        groupPlanRepository.findById(id).ifPresent(plan -> {
            plan.setStatus(status);
            groupPlanRepository.save(plan);
        });
    }
}
