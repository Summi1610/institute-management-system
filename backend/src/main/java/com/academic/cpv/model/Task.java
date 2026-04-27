package com.academic.cpv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private LocalDateTime deadline;

    private String attachmentName;

    private String attachmentContentType;

    @Lob
    @JsonIgnore
    private byte[] attachmentData;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;
}
