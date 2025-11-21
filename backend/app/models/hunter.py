from typing import Optional, Any

from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, field_serializer


class HunterBase(BaseModel):
    nombre: str = Field(..., description="Nombre del cazador")
    edad: Optional[int] = Field(None, description="Edad del cazador")
    nen_tipo: Optional[str] = Field(None, description="Tipo de Nen")
    afiliacion: Optional[str] = Field(None, description="Afiliación o rol")
    imagen_url: str = Field(..., description="URL de imagen del cazador")


class HunterCreate(HunterBase):
    pass


class HunterResponse(HunterBase):
    id: str = Field(..., alias="_id")

    @field_serializer('id')
    def serialize_id(self, value: Any) -> str:
        """Convierte ObjectId a string para la serialización JSON"""
        if isinstance(value, ObjectId):
            return str(value)
        return str(value)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

