# ==========================================
# STAGE 1: BUILD ENVIRONMENT
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compile and package
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# STAGE 2: PRODUCTION RUNTIME
# ==========================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy artifact from build stage
COPY --from=build /app/target/*.jar app.jar

# Setup local file upload directory
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
