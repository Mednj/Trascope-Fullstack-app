#!/bin/bash

echo "🚀 Setting up Transcope Backend API"
echo "=================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6+."
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

echo "✅ Java version: $(java -version 2>&1 | head -n 1)"
echo "✅ Maven version: $(mvn -version | head -n 1)"

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL is not running. Please start PostgreSQL and ensure it's accessible."
    echo "   You can start it with: sudo systemctl start postgresql"
fi

echo ""
echo "📦 Building the project..."
mvn clean install

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 To start the application, run:"
    echo "   mvn spring-boot:run"
    echo ""
    echo "🌐 The API will be available at: http://localhost:8080/api"
    echo "🔐 Demo credentials: merchant@transcope.com / password123"
    echo ""
    echo "📚 For more information, see README.md"
else
    echo "❌ Build failed. Please check the error messages above.
    exit 1
fi 