package com.academic.cpv.payload.response;

import com.academic.cpv.model.EMaterialType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDto {
    private Long id;
    private String title;
    private String url;
    private String fileName;
    private EMaterialType type;
    private BatchRefDto batch;
}
