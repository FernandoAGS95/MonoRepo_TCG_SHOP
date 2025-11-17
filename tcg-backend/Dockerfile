# tcg-backend/Dockerfile

# Etapa de build con Maven + JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B package -DskipTests

# Etapa de runtime con JDK 21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Config BD desde variables de entorno
ENV SPRING_DATASOURCE_URL=""
ENV SPRING_DATASOURCE_USERNAME=""
ENV SPRING_DATASOURCE_PASSWORD=""
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
