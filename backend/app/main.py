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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(hunters_router)

    @app.on_event("startup")
    def startup_event():
        seed_hunters()

    return app

