FROM openjdk:17-jdk

WORKDIR /app

COPY target/spring-boot-demo-0.0.1-SNAPSHOT.jar /app/spring-boot-demo.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/spring-boot-demo.jar"]
