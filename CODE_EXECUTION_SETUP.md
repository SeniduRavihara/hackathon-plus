# Code Execution Setup Guide

This guide explains how to set up code execution for your hackathon platform.

## Option 1: Local Execution (Recommended for Development)

The current implementation uses local Node.js child processes to execute code. This is the simplest setup and works well for development.

### Prerequisites

Make sure you have the following installed on your system:

- **Python 3.x** - for Python code execution
- **Node.js** - for JavaScript code execution
- **Java JDK** - for Java code execution
- **GCC** - for C++ code execution

### Installation

#### Windows

```bash
# Python (if not already installed)
winget install Python.Python.3.9

# Node.js (if not already installed)
winget install OpenJS.NodeJS

# Java JDK
winget install Oracle.JDK

# GCC (via MinGW)
winget install MSYS2.MSYS2
# Then install gcc through MSYS2
```

#### macOS

```bash
# Using Homebrew
brew install python node openjdk gcc
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3 nodejs openjdk-11-jdk gcc g++
```

### Usage

The local execution is already configured and working. It supports:

- ✅ **Python** - Full syntax highlighting and execution
- ✅ **JavaScript** - Full syntax highlighting and execution
- ✅ **Java** - Full syntax highlighting and execution
- ✅ **C++** - Full syntax highlighting and execution

## Option 2: Docker Execution (Recommended for Production)

For better security and isolation, use the Docker-based execution service.

### Prerequisites

- **Docker** installed and running

### Installation

#### Windows

```bash
# Install Docker Desktop
winget install Docker.DockerDesktop
```

#### macOS

```bash
# Install Docker Desktop
brew install --cask docker
```

#### Linux

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Setup

1. **Pull required Docker images:**

```bash
docker pull python:3.9-slim
docker pull node:18-slim
docker pull openjdk:11-slim
docker pull gcc:11
```

2. **Switch to Docker execution:**
   Update the API endpoint in your frontend from `/api/execute` to `/api/execute-docker`

### Security Features

The Docker implementation includes:

- ✅ **Memory limits** (512MB per execution)
- ✅ **CPU limits** (1 CPU core per execution)
- ✅ **Network isolation** (no network access)
- ✅ **Privilege restrictions** (no new privileges)
- ✅ **Automatic cleanup** (containers are removed after execution)
- ✅ **Timeout protection** (10-second timeout)

## Option 3: Cloud Code Execution Services

For production environments, consider these cloud services:

### Judge0 (Free Tier Available)

- **URL**: https://judge0.com/
- **Features**: 60+ programming languages, API-based
- **Pricing**: Free tier available, paid plans for higher limits

### CodeX (Open Source)

- **GitHub**: https://github.com/codex-team/codex
- **Features**: Self-hosted, Docker-based
- **Pricing**: Free (self-hosted)

### Sphere Engine

- **URL**: https://sphere-engine.com/
- **Features**: Enterprise-grade, 70+ languages
- **Pricing**: Contact sales

## Option 4: Custom Sandbox

For maximum control, create a custom sandbox:

### Using Firecracker MicroVMs

```bash
# Install Firecracker
curl -Lo firecracker https://github.com/firecracker-microvm/firecracker/releases/download/v1.4.0/firecracker-v1.4.0-x86_64
chmod +x firecracker
```

### Using gVisor

```bash
# Install gVisor
curl -fsSL https://gvisor.dev/runsc/install.sh | sh
```

## Testing Your Setup

1. **Start your development server:**

```bash
npm run dev
```

2. **Navigate to a problem page** (e.g., http://localhost:3000/problems/1)

3. **Write some code and test:**

```python
# Python example
def solution():
    nums = list(map(int, input().split()))
    target = int(input())

    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return f"{i} {j}"
    return "No solution found"

print(solution())
```

4. **Click "Run Code"** to test execution

## Troubleshooting

### Common Issues

**"Command not found" errors:**

- Ensure all required compilers/interpreters are installed
- Check PATH environment variables
- Restart your terminal after installation

**Permission denied errors:**

- On Linux/macOS, ensure execute permissions
- On Windows, run as administrator if needed

**Docker permission errors:**

- Add your user to the docker group: `sudo usermod -aG docker $USER`
- Restart your system after adding to docker group

**Timeout errors:**

- Increase timeout values in the execution code
- Check system resources (CPU, memory)

### Performance Optimization

1. **Use connection pooling** for database operations
2. **Implement caching** for frequently executed code
3. **Use worker threads** for parallel execution
4. **Monitor resource usage** and set appropriate limits

## Security Considerations

### Local Execution

- ⚠️ **Limited isolation** - code runs on the same system
- ⚠️ **File system access** - code can read/write files
- ⚠️ **Network access** - code can make network requests

### Docker Execution (Recommended)

- ✅ **Process isolation** - code runs in containers
- ✅ **Resource limits** - CPU and memory restrictions
- ✅ **Network isolation** - no network access by default
- ✅ **File system isolation** - limited file system access

### Additional Security Measures

- Implement rate limiting
- Add input validation and sanitization
- Use secure random file names
- Implement proper error handling
- Add logging and monitoring

## Monitoring and Logging

Add these to your execution service for better monitoring:

```typescript
// Add to your execution route
console.log(`Executing ${language} code for problem ${problemId}`);
console.log(`Execution time: ${executionTime}ms`);
console.log(`Memory usage: ${memoryUsage}MB`);
```

## Next Steps

1. **Choose your execution method** based on your needs
2. **Test thoroughly** with various code examples
3. **Implement monitoring** and logging
4. **Add rate limiting** to prevent abuse
5. **Consider scaling** for production use

For production deployment, we recommend using the Docker-based execution for security and the cloud-based services for scalability.
