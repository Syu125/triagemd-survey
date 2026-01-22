from os import mkdir
import os
import re
import pandas as pd
import argparse
import ftfy

# Extracts specific conversation turns based on provided indices.

def extract_turns(row):
    """
    Extracts specific turns from a conversation based on provided indices.

    Parameters:
    conversation (list of dict): The conversation represented as a list of turns.
    indices (list of int): The indices of the turns to extract.

    Returns:
    list of dict: The extracted turns.
    """
    snippets = ""
    conversation = row['Conversation']
    splits = conversation.split('\n')

    pattern = r'(Patient|TriageMD):\s*(.*?)(?=(Patient|TriageMD):|$)'
    matches = re.findall(pattern, conversation, flags=re.DOTALL)

    def clean_text(s):
        # Fix encoding issues first
        s = ftfy.fix_text(s)

        # Trim whitespace
        s = s.strip()

        # Remove trailing list delimiter ONLY (", or ',)
        s = re.sub(r'(["\'])\s*,\s*$', r'\1', s)
        s = re.sub(r',\s*$', '', s)

        # Remove wrapping quotes if present
        if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
            s = s[1:-1]

        # Normalize spacing after punctuation
        s = re.sub(r'([.,?!])([A-Za-z])', r'\1 \2', s)

        return s.strip()

    cleaned = [
        f"{speaker}: {clean_text(text)}"
        for speaker, text, _ in matches
    ]

    for line in cleaned:
        print("NEW:\n",line)

    midpoint = len(cleaned) // 2 if len(cleaned) % 2 == 0 else (len(cleaned) // 2) + 1 

    
    new_cleaned = []

    for line in cleaned:
        match = re.search(r'[A-Za-z].*?[.!?](?=[^.!?]*$)', line, re.DOTALL)
        if not match:
            continue

        text = match.group()
        text = re.sub(r'["\',\]\s]+$', '', text)
        text = text.replace('Â°F', '°F')

        new_cleaned.append(text.strip())

    cleaned = new_cleaned
        
    snippets = f"{cleaned[0]}\n{cleaned[1]}\n{cleaned[midpoint]}\n{cleaned[midpoint+1]}\n{cleaned[-2]}\n{cleaned[-1]}"
        
    return snippets

def args():
    parser = argparse.ArgumentParser(description="Extract specific conversation turns.")
    parser.add_argument('--input', type=str, required=True, help='Path to the input CSV file containing conversations.')
    return parser.parse_args()

def main():
    mkdir("shortened") if not os.path.exists("shortened") else None
    
    parsed_args = args()
    conversation_file = parsed_args.input
    conversation_name = conversation_file.split('\\')[-1].replace('.csv', '')
    print(conversation_name)

    conversation_df = pd.read_csv(conversation_file)
    new_rows = []
    for index, row in conversation_df.iterrows():
        print(row['Path'])
        extracted_turns = extract_turns(row)
        
        row['Shortened_Conversation'] = str(extracted_turns)
        new_rows.append(row)
        
    conversation_df = pd.DataFrame(new_rows)
    export_path = f"shortened/{conversation_name}_shortened.csv"
    conversation_df.to_csv(export_path, index=False)
    print(f"Shortened conversations saved to {export_path}")

        
if __name__ == "__main__":
    main()