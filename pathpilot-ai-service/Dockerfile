FROM python:3.10-slim

WORKDIR /app

# Install system dependencies needed for compiling Chroma/sqlite if necessary
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

# Create directory for persistent vector database storage
RUN mkdir -p chroma_db

EXPOSE 8000

ENV CHROMA_DB_PATH=/app/chroma_db
ENV PORT=8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
