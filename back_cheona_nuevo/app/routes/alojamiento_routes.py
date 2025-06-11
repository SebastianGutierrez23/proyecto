from fastapi import APIRouter, HTTPException, status
from app.models.alojamiento import Alojamiento
from app.database.connection import cursor, mydb
from app.services import alojamiento_services
import mysql.connector

router = APIRouter(
    prefix="/alojamientos",
    tags=["alojamientos"]
)

@router.get("/all")
async def get_all_alojamientos():
    select_query = "SELECT * FROM alojamiento"
    cursor.execute(select_query)
    results = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    alojamientos = [dict(zip(columns, row)) for row in results]
    return alojamientos

@router.get("/")
async def get_alojamiento(id: int):
    select_query = "SELECT * FROM alojamiento where IdAlojamiento = %s"
    cursor.execute(select_query, (id,))
    results = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    alojamientos = [dict(zip(columns, row)) for row in results]
    return alojamientos
 
@router.post("/alojamiento_insert/", status_code=status.HTTP_201_CREATED)
def insert_alojamiento(alojamiento : Alojamiento):
    # Crea un hash de la contraseña usando SHA-256
   # hashed_password = hashlib.sha256(user.password.encode()).hexdigest()

    insert_query = """ 
    INSERT INTO alojamiento (nombre, estado, capacidad, tipo, comodidades, precio_por_noche)
    VALUES (%s, %s, %s, %s, %s, %s)
"""


    values = (alojamiento.nombre, alojamiento.estado, alojamiento.capacidad, alojamiento.tipo, alojamiento.comodidades, alojamiento.precio_por_noche)
              

    try:
        cursor.execute(insert_query, values)
        mydb.commit() # type: ignore
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Error: {err}")

    return {"message": "alojamiento insertado exitosamente"}
 
@router.patch("/alojamientos/{id}")
async def update_alojamientos(id: int, alojamiento: Alojamiento):
    # Consulta para actualizar el alojamiento con el id dado
    update_query = """
    UPDATE alojamiento 
    SET nombre= %s, estado = %s, capacidad = %s, tipo = %s, 
        comodidades = %s , precio_por_noche = %s
    WHERE IdAlojamiento = %s
    """
    values = (
        alojamiento.nombre,
        alojamiento.estado,
        alojamiento.capacidad,
        alojamiento.tipo,
        alojamiento.comodidades,
        alojamiento.precio_por_noche,
        id
    )
    try:
        cursor.execute(update_query, values)
        mydb.commit()  # type: ignore
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"Alojamiento con id {id} no encontrado.")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Error: {err}")

    return {"message": "Alojamiento actualizado con éxito", "id": id}


@router.delete("/alojamientos/{id}")
async def delete_alojamiento(id: int):
    # Consulta para eliminar el alojamiento con el id dado
    delete_query = "DELETE FROM alojamiento WHERE IdAlojamiento = %s"
    
    try:
        cursor.execute(delete_query, (id,))
        mydb.commit()  # type: ignore
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"Alojamiento con id {id} no encontrado.")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Error: {err}")

    return {"message": f"Alojamiento con id {id} eliminado con éxito"}

@router.get("/alojamientos/{id}")
async def get_alojamiento_by_id(id: int):
    select_query = "SELECT * FROM alojamiento WHERE IdAlojamiento = %s"
    cursor.execute(select_query, (id,))
    result = cursor.fetchone()
    if not result:
        raise HTTPException(status_code=404, detail=f"Alojamiento con id {id} no encontrado.")
    columns = [col[0] for col in cursor.description]
    alojamiento = dict(zip(columns, result))
    return alojamiento