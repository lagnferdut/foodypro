# Użyj oficjalnego, lekkiego obrazu Node.js w wersji 20
FROM node:20-slim

# Ustaw katalog roboczy wewnątrz kontenera
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json, aby zainstalować zależności
COPY package*.json ./

# Zainstaluj zależności produkcyjne
RUN npm ci --only=production

# Skopiuj resztę plików aplikacji do katalogu roboczego
COPY . .

# Poinformuj Docker, że aplikacja będzie działać na porcie 8080
EXPOSE 8080

# Komenda, która uruchomi Twoją aplikację (zmień server.js, jeśli trzeba)
CMD [ "node", "server.js" ]