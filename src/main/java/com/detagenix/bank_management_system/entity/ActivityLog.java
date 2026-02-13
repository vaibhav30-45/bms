package com.detagenix.bank_management_system.entities.user;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    private String logId;
    private UserEntity user;
    private String activityType;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;
    private boolean successful;

    public boolean log() {
        return true;
    }

    public List<ActivityLog> getHistory() {
        return new ArrayList<>();
    }
}
