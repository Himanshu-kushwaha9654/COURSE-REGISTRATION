package com.courseflow.service;

import com.courseflow.dto.CourseImportDTO;
import com.courseflow.dto.ImportSummaryDTO;
import com.courseflow.entity.Course;
import com.courseflow.entity.Program;
import com.courseflow.entity.University;
import com.courseflow.repository.CourseRepository;
import com.courseflow.repository.ProgramRepository;
import com.courseflow.repository.UniversityRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExcelImportService {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<CourseImportDTO> previewExcel(MultipartFile file) throws Exception {
        List<CourseImportDTO> previewList = new ArrayList<>();
        java.util.Set<String> existingCourseCodes = new java.util.HashSet<>(courseRepository.findAllCourseCodes());
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header
                
                CourseImportDTO dto = parseRowToDTO(row);
                if (dto == null) continue;
                
                // Determine status in O(1) time
                String status = "New Course";
                if (existingCourseCodes.contains(dto.getCourseCode())) {
                    status = "Existing Course (Will Update)";
                }
                
                dto.setStatus(status);
                previewList.add(dto);
            }
        }
        return previewList;
    }

    @Transactional
    public ImportSummaryDTO importExcel(MultipartFile file) throws Exception {
        long startTime = System.currentTimeMillis();
        ImportSummaryDTO summary = new ImportSummaryDTO();
        
        java.util.Map<String, University> uniCache = new java.util.HashMap<>();
        java.util.Map<String, Program> progCache = new java.util.HashMap<>();
        java.util.List<Course> coursesToSave = new java.util.ArrayList<>();
        
        // Fetch all existing courses into memory to avoid N+1 SELECTs
        java.util.List<Course> allCourses = courseRepository.findAll();
        java.util.Map<String, Course> courseCache = new java.util.HashMap<>();
        for (Course c : allCourses) {
            if (c.getProgram() != null) {
                courseCache.put(c.getCourseCode() + "-" + c.getProgram().getId(), c);
            }
        }
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header
                
                CourseImportDTO dto = parseRowToDTO(row);
                if (dto == null) {
                    summary.setSkippedRows(summary.getSkippedRows() + 1);
                    continue;
                }
                
                // 1. Get or Create University (Memory Cached)
                University university = uniCache.computeIfAbsent(dto.getUniversityName(), name -> {
                    return universityRepository.findByName(name).orElseGet(() -> {
                        University newUni = new University();
                        newUni.setName(name);
                        summary.setUniversitiesAdded(summary.getUniversitiesAdded() + 1);
                        return universityRepository.save(newUni);
                    });
                });
                        
                // 2. Get or Create Program (Memory Cached)
                String progKey = university.getId() + "-" + dto.getProgramName();
                Program program = progCache.computeIfAbsent(progKey, key -> {
                    return programRepository.findByNameAndUniversity(dto.getProgramName(), university).orElseGet(() -> {
                        Program newProg = new Program();
                        newProg.setName(dto.getProgramName());
                        newProg.setUniversity(university);
                        summary.setProgramsAdded(summary.getProgramsAdded() + 1);
                        return programRepository.save(newProg);
                    });
                });
                        
                // 3. Get or Create Course (Memory Cached)
                String courseKey = dto.getCourseCode() + "-" + program.getId();
                Course course = courseCache.get(courseKey);
                
                if (course != null) {
                    summary.setUpdatedCourses(summary.getUpdatedCourses() + 1);
                } else {
                    course = new Course();
                    course.setCourseCode(dto.getCourseCode());
                    course.setProgram(program);
                    summary.setImportedCourses(summary.getImportedCourses() + 1);
                    courseCache.put(courseKey, course); // Cache it for future rows
                }
                
                // Update fields
                course.setCourseName(dto.getCourseName() != null ? dto.getCourseName() : "Unknown Course");
                course.setSemester(dto.getSemester() != null ? dto.getSemester() : 0);
                course.setCredits(dto.getCredits() != null ? dto.getCredits() : 0);
                course.setDepartment(dto.getDepartment());
                course.setCourseType(dto.getCourseType());
                course.setDescription(dto.getDescription());
                course.setSyllabus(dto.getSyllabus());
                course.setSourceUrl(dto.getSourceUrl());
                
                coursesToSave.add(course);
            }
            
            // Save remaining
            if (!coursesToSave.isEmpty()) {
                courseRepository.saveAll(coursesToSave);
            }
        }
        
        long endTime = System.currentTimeMillis();
        summary.setTimeTakenSeconds((endTime - startTime) / 1000.0);
        return summary;
    }

    private CourseImportDTO parseRowToDTO(Row row) {
        CourseImportDTO dto = new CourseImportDTO();
        
        try {
            dto.setUniversityName(getStringValue(row.getCell(0)));
            dto.setProgramName(getStringValue(row.getCell(1)));
            dto.setSemester(getIntegerValue(row.getCell(2)));
            dto.setCourseCode(getStringValue(row.getCell(3)));
            dto.setCourseName(getStringValue(row.getCell(4)));
            dto.setCredits(getIntegerValue(row.getCell(5)));
            dto.setDepartment(getStringValue(row.getCell(6)));
            dto.setCourseType(getStringValue(row.getCell(7)));
            dto.setDescription(getStringValue(row.getCell(8)));
            dto.setSyllabus(getStringValue(row.getCell(9)));
            dto.setSourceUrl(getStringValue(row.getCell(10)));
            
            if (dto.getUniversityName() == null || dto.getProgramName() == null || dto.getCourseCode() == null) {
                return null;
            }
            return dto;
        } catch (Exception e) {
            return null; // Invalid row
        }
    }

    private String getStringValue(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((int) cell.getNumericCellValue());
        }
        return null;
    }

    private Integer getIntegerValue(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Integer.parseInt(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}
