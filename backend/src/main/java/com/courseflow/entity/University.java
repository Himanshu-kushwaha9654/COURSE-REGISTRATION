package com.courseflow.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "universities")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "uni_seq")
    @SequenceGenerator(name = "uni_seq", sequenceName = "uni_seq", allocationSize = 50)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String website;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<Program> programs;

    public University() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public Set<Program> getPrograms() { return programs; }
    public void setPrograms(Set<Program> programs) { this.programs = programs; }
}
