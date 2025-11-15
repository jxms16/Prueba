from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.db.client import get_hunters_collection
from app.models.hunter import HunterCreate, HunterResponse

router = APIRouter(prefix="/api-hxh", tags=["Hunter x Hunter"])


@router.get("/hunters", response_model=List[HunterResponse])
def get_hunters():
    collection = get_hunters_collection()
    hunters = list(collection.find().sort("nombre", 1))
    return hunters


@router.get("/hunters/{hunter_id}", response_model=HunterResponse)
def get_hunter(hunter_id: str):
    collection = get_hunters_collection()
    try:
        hunter = collection.find_one({"_id": ObjectId(hunter_id)})
    except Exception as exc:
        raise HTTPException(status_code=400, detail="ID inválido") from exc

    if not hunter:
        raise HTTPException(status_code=404, detail="Cazador no encontrado")
    return hunter


@router.post("/hunters", response_model=HunterResponse, status_code=201)
def create_hunter(hunter: HunterCreate):
    collection = get_hunters_collection()
    result = collection.insert_one(hunter.model_dump())
    created = collection.find_one({"_id": result.inserted_id})
    return created


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

