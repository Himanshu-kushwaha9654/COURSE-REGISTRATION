package com.courseflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "semester_capacity")
public class SemesterCapacity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer semester;

    @Column(nullable = false)
    private Integer maxCapacity;

    public SemesterCapacity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
}
