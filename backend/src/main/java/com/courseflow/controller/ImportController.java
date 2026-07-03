package com.courseflow.controller;

import com.courseflow.dto.CourseImportDTO;
import com.courseflow.dto.ImportSummaryDTO;
import com.courseflow.service.ExcelImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ImportController {

    @Autowired
    private ExcelImportService excelImportService;

    @PostMapping("/preview")
    public ResponseEntity<?> previewExcel(@RequestParam("file") MultipartFile file) {
        try {
            List<CourseImportDTO> preview = excelImportService.previewExcel(file);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error parsing Excel file: " + e.getMessage());
        }
    }

    @PostMapping("/execute")
    public ResponseEntity<?> executeImport(@RequestParam("file") MultipartFile file) {
        System.out.println("Received execute request for file: " + file.getOriginalFilename() + ", size: " + file.getSize());
        try {
            ImportSummaryDTO summary = excelImportService.importExcel(file);
            System.out.println("Import successful! Summary: " + summary.getImportedCourses());
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR IN IMPORT EXECUTE:");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error importing data: " + e.getMessage() + " | Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "None"));
        }
    }
}
