package com.courseflow.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "programs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "university_id"})
})
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "program_seq")
    @SequenceGenerator(name = "program_seq", sequenceName = "program_seq", allocationSize = 50)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer duration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "programs"})
    private University university;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<Course> courses;

    public Program() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public University getUniversity() { return university; }
    public void setUniversity(University university) { this.university = university; }
    public Set<Course> getCourses() { return courses; }
    public void setCourses(Set<Course> courses) { this.courses = courses; }
}
