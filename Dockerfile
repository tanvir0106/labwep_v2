# ─── Stage 1: Build React frontend ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --frozen-lockfile
COPY client/ ./
RUN npm run build

# ─── Stage 2: Production image with Node + LaTeX ────────────────────────────
FROM node:20-slim

# Install LaTeX (texlive) with required packages
# texlive-latex-base + texlive-latex-extra covers all packages used
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-latex-recommended \
    texlive-fonts-recommended \
    texlive-science \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ ./

# Copy React build into server's public folder
COPY --from=builder /app/client/build ./public

# Create required directories
RUN mkdir -p outputs uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:5000/api/health', r => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "index.js"]
