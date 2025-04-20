# Use the Bun image as the base image
FROM oven/bun:latest

# Install curl (for Coolify healthchecks)
RUN apt-get update && apt-get install curl wget -y

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Run the server when the container launches
ENTRYPOINT ["bun", "start"]
