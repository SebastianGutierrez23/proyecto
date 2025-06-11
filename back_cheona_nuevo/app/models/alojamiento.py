from typing import Optional
from pydantic import BaseModel

class Alojamiento(BaseModel):
    nombre: str
    estado: str
    capacidad: int
    tipo: str
    comodidades: str
    precio_por_noche: int