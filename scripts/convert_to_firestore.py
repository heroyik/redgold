import json

def convert_to_firestore(data):
    if isinstance(data, dict):
        fields = {}
        for k, v in data.items():
            fields[k] = convert_to_firestore(v)
        return {"mapValue": {"fields": fields}}
    elif isinstance(data, list):
        values = [convert_to_firestore(i) for i in data]
        return {"arrayValue": {"values": values}}
    elif isinstance(data, bool):
        return {"booleanValue": data}
    elif isinstance(data, int):
        return {"integerValue": str(data)}
    elif isinstance(data, float):
        return {"doubleValue": data}
    elif isinstance(data, str):
        return {"stringValue": data}
    elif data is None:
        return {"nullValue": None}
    return {}

def main():
    with open('data/lesson2.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # The document object itself should be the 'fields' part
    firestore_doc = convert_to_firestore(data)
    # The API expects the top level to be 'fields'
    print(json.dumps(firestore_doc["mapValue"], ensure_ascii=False))

if __name__ == "__main__":
    main()
