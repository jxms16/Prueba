from app.db.client import get_hunters_collection


def seed_hunters():
    collection = get_hunters_collection()
    if collection.count_documents({}) > 0:
        return

    hunters = [
        {
            "nombre": "Gon Freecss",
            "edad": 12,
            "nen_tipo": "Refuerzo",
            "afiliacion": "Cazador",
            "imagen_url": "https://i.imgur.com/P0cwBwR.jpeg",
        },
        {
            "nombre": "Killua Zoldyck",
            "edad": 12,
            "nen_tipo": "Transmutación",
            "afiliacion": "Familia Zoldyck",
            "imagen_url": "https://i.imgur.com/0qU6u8Z.jpeg",
        },
        {
            "nombre": "Kurapika",
            "edad": 17,
            "nen_tipo": "Especialización",
            "afiliacion": "Clan Kurta",
            "imagen_url": "https://i.imgur.com/TS5R1Yx.jpeg",
        },
        {
            "nombre": "Leorio Paradinight",
            "edad": 19,
            "nen_tipo": "Emisión",
            "afiliacion": "Asociación de Cazadores",
            "imagen_url": "https://i.imgur.com/Xd9z1Qt.jpeg",
        },
        {
            "nombre": "Hisoka Morow",
            "edad": 28,
            "nen_tipo": "Transmutación",
            "afiliacion": "Cazador Independiente",
            "imagen_url": "https://i.imgur.com/1R9PlqI.jpeg",
        },
        {
            "nombre": "Chrollo Lucilfer",
            "edad": 26,
            "nen_tipo": "Especialización",
            "afiliacion": "Genei Ryodan",
            "imagen_url": "https://i.imgur.com/kpENYxH.jpeg",
        },
        {
            "nombre": "Biscuit Krueger",
            "edad": 57,
            "nen_tipo": "Transmutación",
            "afiliacion": "Cazadora",
            "imagen_url": "https://i.imgur.com/zI5qLZ6.jpeg",
        },
        {
            "nombre": "Isaac Netero",
            "edad": 110,
            "nen_tipo": "Refuerzo",
            "afiliacion": "Asociación de Cazadores",
            "imagen_url": "https://i.imgur.com/0pHC2Ch.jpeg",
        },
        {
            "nombre": "Meruem",
            "edad": 0,
            "nen_tipo": "Especialización",
            "afiliacion": "Hormigas Quimera",
            "imagen_url": "https://i.imgur.com/CkXg5pP.jpeg",
        },
        {
            "nombre": "Neferpitou",
            "edad": 1,
            "nen_tipo": "Especialización",
            "afiliacion": "Guardia Real",
            "imagen_url": "https://i.imgur.com/S12t4An.jpeg",
        },
        {
            "nombre": "Morel Mackernasey",
            "edad": 45,
            "nen_tipo": "Materialización",
            "afiliacion": "Cazador",
            "imagen_url": "https://i.imgur.com/EKYRFFB.jpeg",
        },
        {
            "nombre": "Knuckle Bine",
            "edad": 28,
            "nen_tipo": "Emisión",
            "afiliacion": "Cazador",
            "imagen_url": "https://i.imgur.com/7j7zv4m.jpeg",
        },
    ]

    collection.insert_many(hunters)
    print("✅ Hunters iniciales insertados")

