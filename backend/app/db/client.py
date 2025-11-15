from pymongo import MongoClient

from app.core.config import get_settings

settings = get_settings()

client = MongoClient(settings.mongo_url)
db = client[settings.mongo_db]


def get_hunters_collection():
    return db["hunters"]

