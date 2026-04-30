# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first for better caching
COPY backend/requirements.txt ./backend/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the backend and frontend directories
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Set the working directory to where server.py is
WORKDIR /app/backend

# Make port 8080 available to the world outside this container
# (Cloud Run uses 8080 by default, but our app will read the PORT env var)
EXPOSE 8080

# Define environment variable
ENV PORT=8080
ENV FLASK_APP=server.py

# Run server.py when the container launches
# Using python directly for simpler background thread handling
CMD ["python", "server.py"]
