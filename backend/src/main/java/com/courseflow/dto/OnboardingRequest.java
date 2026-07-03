package com.courseflow.dto;

public class OnboardingRequest {
    private Long programId;
    private Integer currentSemester;

    public Long getProgramId() { return programId; }
    public void setProgramId(Long programId) { this.programId = programId; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }
}
