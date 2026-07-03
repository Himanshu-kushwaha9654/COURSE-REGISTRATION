package com.courseflow.scratch;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import com.courseflow.CourseFlowApplication;
import com.courseflow.repository.CourseRepository;

public class CheckDb {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(CourseFlowApplication.class, args);
        CourseRepository repo = context.getBean(CourseRepository.class);
        System.out.println("TOTAL COURSES IN DB: " + repo.count());
        System.exit(0);
    }
}
