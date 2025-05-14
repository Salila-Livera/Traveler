package com.example.Group_backend.repository;

import com.example.Group_backend.model.GroupPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GroupPlanRepository extends JpaRepository<GroupPlan, Long> {
    
    // Find plans by creator
    List<GroupPlan> findByCreatorId(Long creatorId);
    
    // Find active plans
    List<GroupPlan> findByStatus(String status);
    
    // Find plans between dates
    List<GroupPlan> findByStartDateBetween(LocalDateTime start, LocalDateTime end);
    
    // Find plans by location
    List<GroupPlan> findByLocationContainingIgnoreCase(String location);
    
    // Find plans with available slots
    @Query("SELECT g FROM GroupPlan g WHERE size(g.participantIds) < g.maxParticipants AND g.status = 'ACTIVE'")
    List<GroupPlan> findAvailablePlans();
    
    // Find plans where a user is participating
    @Query("SELECT g FROM GroupPlan g WHERE :participantId MEMBER OF g.participantIds")
    List<GroupPlan> findPlansByParticipant(Long participantId);
    
    // Find upcoming plans
    List<GroupPlan> findByStartDateAfterAndStatusOrderByStartDateAsc(LocalDateTime now, String status);
}
