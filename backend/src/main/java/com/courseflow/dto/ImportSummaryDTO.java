package com.courseflow.dto;

public class ImportSummaryDTO {
    private int importedCourses;
    private int updatedCourses;
    private int skippedRows;
    private int universitiesAdded;
    private int programsAdded;
    private double timeTakenSeconds;

    public int getImportedCourses() { return importedCourses; }
    public void setImportedCourses(int importedCourses) { this.importedCourses = importedCourses; }
    public int getUpdatedCourses() { return updatedCourses; }
    public void setUpdatedCourses(int updatedCourses) { this.updatedCourses = updatedCourses; }
    public int getSkippedRows() { return skippedRows; }
    public void setSkippedRows(int skippedRows) { this.skippedRows = skippedRows; }
    public int getUniversitiesAdded() { return universitiesAdded; }
    public void setUniversitiesAdded(int universitiesAdded) { this.universitiesAdded = universitiesAdded; }
    public int getProgramsAdded() { return programsAdded; }
    public void setProgramsAdded(int programsAdded) { this.programsAdded = programsAdded; }
    public double getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(double timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
}
