# Frontend - Clinic

- This is the frontend for the clinic management system. Developed in Vue 3 with Vite, this web client allows viewing patient data stored in the PostgreSQL database via the .NET backend.
- The frontend runs inside a Docker container and is part of the `clinica-network`, which enables direct communication with the backend.
- The app already includes an example of API consumption through the `/pacientes` endpoint.
- This frontend currently only serves to visually verify the backend database. Its purpose is to confirm that all services are running correctly.

---

## 📁 Configuration Files

### 🐳 Dockerfile

The `Dockerfile` contains the necessary instructions to build the frontend image:

Step-by-step explanation:

1. **Use Node.js Alpine image** as the base for building the app.
2. **Set the working directory** to `/app`.
3. **Copy the project files** into the container.
4. **Install dependencies** and build the frontend with Vite.
5. **Use Nginx** as the production web server.
6. **Copy the built files** from the build stage into Nginx's default HTML directory.
7. **Expose port 80** for HTTP access.

---

### 🐳 docker-compose.yml

The `docker-compose.yml` file is used to start the frontend container, connecting it to the `clinica-network` or the newtork name you wanna use, just make sure you use the same network name in the backend and frontend:

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

Inside the `frontend-app` folder, there is a `.env` file used to configure the backend API endpoint:

```env
VITE_API_URL=http://localhost:9000
```

This allows the frontend to dynamically access the backend from different environments.  
For example, in `App.vue`, the API call is made using:

```js
fetch(import.meta.env.VITE_API_URL + '/pacientes')
```

---

## ✅ How to Run the Environment

1. Open a terminal in the frontend project root folder.
2. Make sure Docker is running.
3. Make sure the docker network is running
4. Run first docker newtork, then the bakcen and finnaly the front end
5. Run:

```bash
docker-compose up --build
```

4. Once running:

- Frontend available at: `http://localhost:5173`
- The frontend automatically connects to the backend at: `http://localhost:9000/pacientes`

---

## 📌 Functionality

- Displays a list of patients retrieved directly from the PostgreSQL database.
- Data is fetched from the backend using a `fetch()` call.
