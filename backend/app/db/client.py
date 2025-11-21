from pymongo import MongoClient

from app.core.config import get_settings

settings = get_settings()

# Crear cliente MongoDB con manejo de errores
try:
    client = MongoClient(settings.mongo_url)
    db = client[settings.mongo_db]
    # Probar la conexión
    client.admin.command('ping')
    print(f"✓ Conectado a MongoDB: {settings.mongo_db}")
except Exception as e:
    print(f"✗ Error conectando a MongoDB: {e}")
    print(f"  URL: {settings.mongo_url}")
    raise


def get_hunters_collection():
    return db["hunters"]

