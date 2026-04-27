package com.academic.cpv.controller;

import com.academic.cpv.exception.ResourceNotFoundException;
import com.academic.cpv.model.Material;
import com.academic.cpv.model.StudentTask;
import com.academic.cpv.payload.response.MaterialDto;
import com.academic.cpv.payload.response.StudentTaskDto;
import com.academic.cpv.payload.request.UpdateTaskStatusRequest;
import com.academic.cpv.repository.MaterialRepository;
import com.academic.cpv.repository.StudentTaskRepository;
import com.academic.cpv.service.StudentService;
import com.academic.cpv.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
// @PreAuthorize("hasRole('STUDENT') or hasRole('TRAINER') or hasRole('ADMIN')")
public class StudentController {

    @Autowired
    StudentService studentService;

    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    StudentTaskRepository studentTaskRepository;

    @GetMapping("/my-tasks")
    public ResponseEntity<List<StudentTaskDto>> getMyTasks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(studentService.getMyTasks(username).stream()
                .map(DtoMapper::toStudentTaskDto)
                .collect(Collectors.toList()));
    }

    @PostMapping("/tasks/{studentTaskId}/status")
    public ResponseEntity<StudentTask> updateTaskStatus(@PathVariable Long studentTaskId,
            @RequestBody UpdateTaskStatusRequest request) {
        return ResponseEntity
                .ok(studentService.updateTaskStatus(studentTaskId, request.getStatus(), request.getSubmissionUrl()));
    }

    @GetMapping("/my-materials")
    public ResponseEntity<List<MaterialDto>> getMyMaterials() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(studentService.getMyMaterials(username).stream()
                .map(DtoMapper::toMaterialDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/materials/{materialId}/file")
    public ResponseEntity<byte[]> downloadMaterial(@PathVariable Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));

        if (material.getFileData() == null || material.getFileData().length == 0) {
            throw new ResourceNotFoundException("Material file", "materialId", materialId);
        }

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(material.getFileContentType() != null ? material.getFileContentType()
                                : MediaType.APPLICATION_PDF_VALUE))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + material.getFileName() + "\"")
                .body(material.getFileData());
    }

    @GetMapping("/tasks/{studentTaskId}/file")
    public ResponseEntity<byte[]> downloadTaskFile(@PathVariable Long studentTaskId) {
        StudentTask studentTask = studentTaskRepository.findById(studentTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentTask", "id", studentTaskId));

        if (studentTask.getTask() == null || studentTask.getTask().getAttachmentData() == null
                || studentTask.getTask().getAttachmentData().length == 0) {
            throw new ResourceNotFoundException("Task attachment", "studentTaskId", studentTaskId);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(studentTask.getTask().getAttachmentContentType() != null
                        ? studentTask.getTask().getAttachmentContentType()
                        : MediaType.APPLICATION_PDF_VALUE))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + studentTask.getTask().getAttachmentName() + "\"")
                .body(studentTask.getTask().getAttachmentData());
    }
}
