# Stage 1: Build
FROM golang:1.24.4-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /app/bin/main ./cmd/api

# Stage 2: Run
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/bin/main .

EXPOSE 8080

CMD ["./main"]
