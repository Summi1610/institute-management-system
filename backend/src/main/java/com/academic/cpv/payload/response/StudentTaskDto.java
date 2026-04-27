package com.academic.cpv.payload.response;

import com.academic.cpv.model.ETaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTaskDto {
    private Long id;
    private ETaskStatus status;
    private String submissionUrl;
    private LocalDateTime submissionDate;
    private TaskDto task;
}
