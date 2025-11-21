from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.db.client import get_hunters_collection
from app.models.hunter import HunterCreate, HunterResponse
from app.services.seed import seed_hunters

router = APIRouter(prefix="/api-hxh", tags=["Hunter x Hunter"])


@router.get("/hunters", response_model=List[HunterResponse])
def get_hunters():
    try:
        collection = get_hunters_collection()
        hunters = list(collection.find().sort("nombre", 1))
        # Convertir ObjectId a string para cada hunter
        for hunter in hunters:
            if "_id" in hunter and isinstance(hunter["_id"], ObjectId):
                hunter["_id"] = str(hunter["_id"])
        return hunters
    except Exception as e:
        print(f"Error en get_hunters: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener cazadores: {str(e)}")


@router.get("/hunters/{hunter_id}", response_model=HunterResponse)
def get_hunter(hunter_id: str):
    try:
        collection = get_hunters_collection()
        hunter = collection.find_one({"_id": ObjectId(hunter_id)})
        if not hunter:
            raise HTTPException(status_code=404, detail="Cazador no encontrado")
        # Convertir ObjectId a string
        if "_id" in hunter and isinstance(hunter["_id"], ObjectId):
            hunter["_id"] = str(hunter["_id"])
        return hunter
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"ID inválido: {str(exc)}") from exc


@router.post("/hunters", response_model=HunterResponse, status_code=201)
def create_hunter(hunter: HunterCreate):
    try:
        collection = get_hunters_collection()
        result = collection.insert_one(hunter.model_dump())
        created = collection.find_one({"_id": result.inserted_id})
        if not created:
            raise HTTPException(status_code=500, detail="Error al crear cazador")
        # Convertir ObjectId a string
        if "_id" in created and isinstance(created["_id"], ObjectId):
            created["_id"] = str(created["_id"])
        return created
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear cazador: {str(e)}") from e


@router.delete("/hunters/{hunter_id}", status_code=204)
def delete_hunter(hunter_id: str):
    collection = get_hunters_collection()
    try:
        deletion = collection.delete_one({"_id": ObjectId(hunter_id)})
    except Exception as exc:
        raise HTTPException(status_code=400, detail="ID inválido") from exc

    if deletion.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cazador no encontrado")
    return None


@router.post("/hunters/reset", status_code=200)
def reset_hunters():
    """Resetea la base de datos eliminando todos los cazadores y restaurando los iniciales"""
    try:
        seed_hunters(force=True)
        return {"message": "Cazadores reseteados correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al resetear cazadores: {str(e)}") from e


@router.get("")
def root_info():
    return {
        "mensaje": "API de Hunter x Hunter",
        "version": "1.0.0",
        "swagger": "/api-hxh/docs",
        "recursos": {
            "listar": "/api-hxh/hunters",
            "crear": "/api-hxh/hunters",
            "detalle": "/api-hxh/hunters/{id}",
        },
    }

