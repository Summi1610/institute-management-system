package com.academic.cpv.util;

import com.academic.cpv.model.Batch;
import com.academic.cpv.model.Course;
import com.academic.cpv.model.Material;
import com.academic.cpv.model.StudentTask;
import com.academic.cpv.model.Task;
import com.academic.cpv.model.User;
import com.academic.cpv.payload.response.BatchDto;
import com.academic.cpv.payload.response.BatchRefDto;
import com.academic.cpv.payload.response.CourseDto;
import com.academic.cpv.payload.response.MaterialDto;
import com.academic.cpv.payload.response.StudentTaskDto;
import com.academic.cpv.payload.response.StudentTaskProgressDto;
import com.academic.cpv.payload.response.TaskDto;
import com.academic.cpv.payload.response.UserDto;

import java.util.stream.Collectors;

public class DtoMapper {
    public static CourseDto toCourseDto(Course course) {
        if (course == null)
            return null;
        return CourseDto.builder()
                .id(course.getId())
                .name(course.getName())
                .duration(course.getDuration())
                .description(course.getDescription())
                .build();
    }

    public static UserDto toUserDto(User user) {
        if (user == null)
            return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .isApproved(user.isApproved())
                .trialExpired(user.isTrialExpired())
                .build();
    }

    public static BatchDto toBatchDto(Batch batch) {
        if (batch == null)
            return null;
        return BatchDto.builder()
                .id(batch.getId())
                .name(batch.getName())
                .startTime(batch.getStartTime())
                .endTime(batch.getEndTime())
                .course(toCourseDto(batch.getCourse()))
                .trainer(toUserDto(batch.getTrainer()))
                .students(batch.getStudents() != null
                        ? batch.getStudents().stream().map(DtoMapper::toUserDto).collect(Collectors.toSet())
                        : null)
                .build();
    }

    public static BatchRefDto toBatchRefDto(Batch batch) {
        if (batch == null) {
            return null;
        }
        return BatchRefDto.builder()
                .id(batch.getId())
                .name(batch.getName())
                .build();
    }

    public static TaskDto toTaskDto(Task task) {
        if (task == null) {
            return null;
        }
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .deadline(task.getDeadline())
                .attachmentName(task.getAttachmentName())
                .batch(toBatchRefDto(task.getBatch()))
                .build();
    }

    public static StudentTaskDto toStudentTaskDto(StudentTask studentTask) {
        if (studentTask == null) {
            return null;
        }
        return StudentTaskDto.builder()
                .id(studentTask.getId())
                .status(studentTask.getStatus())
                .submissionUrl(studentTask.getSubmissionUrl())
                .submissionDate(studentTask.getSubmissionDate())
                .task(toTaskDto(studentTask.getTask()))
                .build();
    }

    public static StudentTaskProgressDto toStudentTaskProgressDto(StudentTask studentTask) {
        if (studentTask == null) {
            return null;
        }
        return StudentTaskProgressDto.builder()
                .id(studentTask.getId())
                .status(studentTask.getStatus())
                .submissionUrl(studentTask.getSubmissionUrl())
                .submissionDate(studentTask.getSubmissionDate())
                .student(toUserDto(studentTask.getStudent()))
                .build();
    }

    public static MaterialDto toMaterialDto(Material material) {
        if (material == null) {
            return null;
        }
        return MaterialDto.builder()
                .id(material.getId())
                .title(material.getTitle())
                .url(material.getUrl())
                .fileName(material.getFileName())
                .type(material.getType())
                .batch(toBatchRefDto(material.getBatch()))
                .build();
    }
}
