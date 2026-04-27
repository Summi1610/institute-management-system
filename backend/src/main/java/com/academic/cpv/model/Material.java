package com.academic.cpv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String url;

    private String fileName;

    private String fileContentType;

    @Lob
    @JsonIgnore
    private byte[] fileData;

    @Enumerated(EnumType.STRING)
    private EMaterialType type;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;
}
