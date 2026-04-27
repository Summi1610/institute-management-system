package com.academic.cpv.controller;

import com.academic.cpv.exception.AppException;
import com.academic.cpv.exception.ResourceNotFoundException;
import com.academic.cpv.model.*;
import com.academic.cpv.payload.response.StudentTaskProgressDto;
import com.academic.cpv.payload.response.TaskDto;
import com.academic.cpv.service.TrainerService;
import com.academic.cpv.payload.response.BatchDto;
import com.academic.cpv.repository.TaskRepository;
import com.academic.cpv.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trainer")
// @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
public class TrainerController {

    @Autowired
    TrainerService trainerService;

    @Autowired
    TaskRepository taskRepository;

    @GetMapping("/my-batches")
    public ResponseEntity<List<BatchDto>> getMyBatches() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(trainerService.getMyBatches(username).stream()
                .map(DtoMapper::toBatchDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/batches/{batchId}/tasks")
    public ResponseEntity<List<TaskDto>> getBatchTasks(@PathVariable Long batchId) {
        return ResponseEntity.ok(trainerService.getBatchTasks(batchId).stream()
                .map(DtoMapper::toTaskDto)
                .collect(Collectors.toList()));
    }

    @PostMapping(value = "/batches/{batchId}/materials", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Material> shareMaterial(@PathVariable Long batchId,
            @RequestParam String title,
            @RequestParam EMaterialType type,
            @RequestParam(required = false) String url,
            @RequestParam(required = false) MultipartFile file) {
        if (type == EMaterialType.VIDEO && !StringUtils.hasText(url)) {
            throw new AppException("Video link is required.");
        }

        if (type == EMaterialType.DOCUMENT) {
            validatePdf(file, "Material PDF");
        }

        Material material = Material.builder()
                .title(title)
                .url(type == EMaterialType.VIDEO ? url : null)
                .fileName(file != null ? file.getOriginalFilename() : null)
                .fileContentType(file != null ? file.getContentType() : null)
                .fileData(readBytes(file))
                .type(type)
                .build();
        return ResponseEntity.ok(trainerService.shareMaterial(batchId, material));
    }

    @PostMapping(value = "/batches/{batchId}/tasks", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Task> createTask(@PathVariable Long batchId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime deadline,
            @RequestParam(required = false) MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            validatePdf(file, "Task PDF");
        }

        Task task = Task.builder()
                .title(title)
                .description(description)
                .deadline(deadline)
                .attachmentName(file != null ? file.getOriginalFilename() : null)
                .attachmentContentType(file != null ? file.getContentType() : null)
                .attachmentData(readBytes(file))
                .build();
        return ResponseEntity.ok(trainerService.createTask(batchId, task));
    }

    @GetMapping("/tasks/{taskId}/progress")
    public ResponseEntity<List<StudentTaskProgressDto>> getStudentProgress(@PathVariable Long taskId) {
        return ResponseEntity.ok(trainerService.getStudentProgress(taskId).stream()
                .map(DtoMapper::toStudentTaskProgressDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/tasks/{taskId}/attachment")
    public ResponseEntity<byte[]> downloadTaskAttachment(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        if (task.getAttachmentData() == null || task.getAttachmentData().length == 0) {
            throw new ResourceNotFoundException("Task attachment", "taskId", taskId);
        }

        return ResponseEntity.ok()
                .contentType(MediaType
                        .parseMediaType(task.getAttachmentContentType() != null ? task.getAttachmentContentType()
                                : MediaType.APPLICATION_PDF_VALUE))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + task.getAttachmentName() + "\"")
                .body(task.getAttachmentData());
    }

    private void validatePdf(MultipartFile file, String label) {
        if (file == null || file.isEmpty()) {
            throw new AppException(label + " is required.");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new AppException(label + " must be a PDF file.");
        }
    }

    private byte[] readBytes(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            return file.getBytes();
        } catch (java.io.IOException ex) {
            throw new AppException("Failed to read uploaded file.");
        }
    }
}
