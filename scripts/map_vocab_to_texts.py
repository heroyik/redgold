import json
import os

def map_vocab_to_texts(lesson_file):
    with open(lesson_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    global_vocab = data.get('vocabulary', [])
    if not global_vocab:
        print(f"No vocabulary found in {lesson_file}")
        return

    if 'texts' in data:
        for text_obj in data['texts']:
            # Extract all Chinese characters from the text content
            all_text = ""
            for line in text_obj.get('content', []):
                all_text += line.get('text', "")
            
            # Find which global vocab words are in this text
            text_vocab = []
            for vocab_item in global_vocab:
                if vocab_item['word'] in all_text:
                    # Avoid duplicates
                    if vocab_item not in text_vocab:
                        text_vocab.append(vocab_item)
            
            # Update the text object with its specific vocabulary
            text_obj['vocabulary'] = text_vocab
            print(f"Mapped {len(text_vocab)} words to Text {text_obj.get('id')} in {os.path.basename(lesson_file)}")

    with open(lesson_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    data_dir = 'data'
    for filename in os.listdir(data_dir):
        if filename.startswith('lesson') and filename.endswith('.json'):
            print(f"Processing {filename}...")
            map_vocab_to_texts(os.path.join(data_dir, filename))

if __name__ == "__main__":
    main()
