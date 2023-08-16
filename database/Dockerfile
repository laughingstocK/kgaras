# Use the official MariaDB image as the base image
FROM mariadb:latest

# Set environment variables for MariaDB
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=ontology_repair_db
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=password

# Copy custom configuration file (optional)
# COPY my.cnf /etc/mysql/conf.d/my.cnf

# Copy the SQL script to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/
