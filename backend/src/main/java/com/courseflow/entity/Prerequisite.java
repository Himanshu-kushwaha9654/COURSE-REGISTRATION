package com.courseflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prerequisites")
public class Prerequisite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "required_course_id", nullable = false)
    private Course requiredCourse;

    public Prerequisite() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Course getRequiredCourse() { return requiredCourse; }
    public void setRequiredCourse(Course requiredCourse) { this.requiredCourse = requiredCourse; }
}
