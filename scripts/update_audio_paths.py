import json
import os
import re

data_dir = 'data'
audio_base_path = 'audio/'

for filename in os.listdir(data_dir):
    if filename.startswith('lesson') and filename.endswith('.json'):
        filepath = os.path.join(data_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        lesson_id = data.get('lessonId')
        if lesson_id is None:
            # Try to extract from filename
            match = re.search(r'lesson(\d+)\.json', filename)
            if match:
                lesson_id = int(match.group(1))
        
        if lesson_id:
            lesson_id_padded = f"{lesson_id:02d}"
            if 'texts' in data:
                for text in data['texts']:
                    text_id = text.get('id')
                    if text_id:
                        text['audio'] = f"{audio_base_path}{lesson_id_padded}-{text_id}.mp3"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {filename}")
