from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.hunters import router as hunters_router
from app.core.config import get_settings
from app.services.seed import seed_hunters


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_title,
        description=settings.app_description,
        version=settings.app_version,
        docs_url=settings.docs_url,
        openapi_url=settings.openapi_url,
        contact={"name": "Hunter API Support", "email": "support@hunterxhunter.com"},
    )

    # Configurar CORS para permitir el frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://front-hxh-production.up.railway.app",
            "https://caballeros-del-zodiaco-production-efa5.up.railway.app",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://localhost:8000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(hunters_router)

    @app.get("/")
    def root():
        return {
            "message": "Hunter x Hunter API",
            "version": settings.app_version,
            "docs": settings.docs_url,
            "endpoints": {
                "hunters": "/api-hxh/hunters",
                "docs": "/api-hxh/docs",
            }
        }

    @app.on_event("startup")
    def startup_event():
        seed_hunters()

    return app

