# Frontend - Clinic

- This is the frontend for the clinic management system. Developed in Vue 3 with Vite, this web client allows viewing patient data stored in the PostgreSQL database via the .NET backend.
- The frontend runs inside a Docker container and is part of the `clinica-network`, which enables direct communication with the backend.
- The app already includes an example of API consumption through the `/pacientes` endpoint.
- This frontend currently only serves to visually verify the backend database. Its purpose is to confirm that all services are running correctly.

---

## 📁 Configuration Files

### 🐳 Dockerfile

The `Dockerfile` contains the necessary instructions to build the frontend image:

- Installs dependencies
- Builds the project with Vite
- Serves the files using Nginx

---

### 🐳 docker-compose.yml

The `docker-compose.yml` file is used to start the frontend container, connecting it to the `clinica-network`:

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    restart: always
networks:
  default:
    external:
      name: clinica-network
```

---

### ⚙️ Environment Variables

Inside the `frontend-app` folder, there is a `.env` file with the following configuration:

```env
VITE_API_URL=http://localhost:9000
```

---

## ✅ How to Run the Environment

1. Build and start the container:

```bash
docker-compose up --build
```

2. Once running:

- Frontend available at: `http://localhost:5173`
- The frontend automatically connects to the backend at: `http://localhost:9000/pacientes`

---

## 📌 Functionality

- Displays a list of patients retrieved directly from the PostgreSQL database.
- Data is fetched from the backend using a `fetch()` call.
