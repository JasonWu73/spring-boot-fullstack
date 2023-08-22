FROM openjdk:17-jdk

ENV TZ=Asia/Shanghai

WORKDIR /opt

COPY target/spring-boot-demo-0.0.1-SNAPSHOT.jar /opt/spring-boot-demo.jar

EXPOSE 8080

CMD ["java", "-jar", "/opt/spring-boot-demo.jar"]
