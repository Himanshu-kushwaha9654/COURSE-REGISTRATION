package com.courseflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class CourseFlowApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixDbConstraints() {
        try {
            jdbcTemplate.execute("ALTER TABLE courses DROP CONSTRAINT IF EXISTS uk_p02ts69sh53ptd62m3c67v0");
        } catch (Exception e) {}
        
        try {
            jdbcTemplate.execute("ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_course_code_key");
        } catch (Exception e) {}
        
        try {
            jdbcTemplate.execute("ALTER TABLE courses ADD COLUMN IF NOT EXISTS max_seats INT DEFAULT 60 NOT NULL");
            System.out.println("Added max_seats column successfully!");
        } catch (Exception e) {
            System.out.println("Failed to add max_seats: " + e.getMessage());
        }

        // Sync sequences for Hibernate batch inserts
        try {
            jdbcTemplate.execute("SELECT setval('course_seq', COALESCE((SELECT MAX(id) FROM courses), 0) + 100)");
            jdbcTemplate.execute("SELECT setval('program_seq', COALESCE((SELECT MAX(id) FROM programs), 0) + 50)");
            jdbcTemplate.execute("SELECT setval('uni_seq', COALESCE((SELECT MAX(id) FROM universities), 0) + 50)");
            System.out.println("Synced sequences successfully!");
        } catch (Exception e) {
            System.out.println("Failed to sync sequences: " + e.getMessage());
        }
    }

	public static void main(String[] args) {
		java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("UTC"));
		SpringApplication.run(CourseFlowApplication.class, args);
	}

}
