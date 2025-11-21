# Hunter x Hunter - Microservicio independiente

Este directorio contiene un proyecto completo (frontend + backend) basado en FastAPI y MongoDB.

## 📁 Contenido
```
hxh/
├── backend/   # FastAPI + MongoDB + Swagger
└── frontend/  # React (Vite) + Axios consumiendo el microservicio
```

## ⚙️ Requisitos
- Python 3.11+
- Node.js 18+
- MongoDB (proporcionado por Railway o Atlas)

## ▶️ Backend (FastAPI)
```bash
cd hxh/backend
pip install -r requirements.txt
cp env.example .env  # editar MONGO_URL
uvicorn main:app --reload
```
Swagger: `http://localhost:8000/api-hxh/docs`

## 💻 Frontend (Vite + React)
```bash
cd hxh/frontend
npm install
cp env.example .env  # definir VITE_HXH_API_URL
npm run dev
```
UI disponible en `http://localhost:5174`

## ☁️ Railway Deploy

### Backend
1. Crear servicio MongoDB en Railway.
2. Crear servicio nuevo "Deploy from Repo" → ruta `hxh/backend`.
3. **Variables de entorno requeridas:**
   - `MONGO_URL`: URL de conexión a MongoDB (Railway la proporciona automáticamente)
   - `MONGO_DB`: Nombre de la base de datos (default: `hunterxhunter_db`)
   - `PORT`: Railway lo asigna automáticamente
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Una vez desplegado, copia la URL del servicio (ej: `https://hxh-backend-production.up.railway.app`)

### Frontend
1. Crear otro servicio Railway con ruta `hxh/frontend`.
2. Build command: `npm install && npm run build`.
3. Start command: `npm run preview -- --host 0.0.0.0 --port $PORT` (o usa Static File Server).
4. **⚠️ VARIABLE DE ENTORNO CRÍTICA:**
   - `VITE_HXH_API_URL`: Debe apuntar a la URL del backend + `/api-hxh`
   - Ejemplo: `https://hxh-backend-production.up.railway.app/api-hxh`
   - **IMPORTANTE:** Esta variable DEBE estar configurada ANTES del build. Si la cambias después, necesitas hacer un rebuild.

### 🔧 Solución de Problemas

**Problema: El frontend recibe HTML en lugar de JSON**
- Verifica que `VITE_HXH_API_URL` esté configurada correctamente en Railway
- Asegúrate de que la URL termine con `/api-hxh` (ej: `https://tu-backend.up.railway.app/api-hxh`)
- Si cambiaste la variable después del build, necesitas hacer un nuevo build

**Problema: CORS errors**
- Verifica que la URL del frontend esté en la lista de `allow_origins` en `backend/app/main.py`

**Problema: Backend devuelve 404 en la raíz**
- Esto es normal, el backend ahora tiene una ruta raíz que devuelve información de la API
- Las rutas de la API están en `/api-hxh/*`

Listo: tendrás dos microservicios independientes listos para conectarse con el switch del frontend principal.
