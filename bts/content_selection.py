# Outputs 30 sets of randomized topics 

import argparse
from os import mkdir
import os
import pandas as pd    
import random

from flowcharts.flowcharts import get_flowchart_list

def randomly_select_topics(topics, num_sets=30, topics_per_set=10):
    selected_sets = []
    for _ in range(num_sets):
        selected = random.sample(topics, topics_per_set)
        selected_sets.append(selected)
    return selected_sets

def args():
    parser = argparse.ArgumentParser(description="Randomly select topics for 30 surveys.")
    parser.add_argument('--input', type=str, required=True, help='Path to the input CSV file containing conversations.')
    return parser.parse_args()

def main():
    mkdir("content") if not os.path.exists("content") else None
    
    parsed_args = args()
    conversation_file = parsed_args.input

    # Get conversations and randomly select for 30 sets
    topics = get_flowchart_list()
    selected_sets = randomly_select_topics(topics)
    
    # For each set, store content in csv
    for set_index, set in enumerate(selected_sets):
        new_rows = []
        conversation_df = pd.read_csv(conversation_file)
        for topic in set:
            topic_rows = conversation_df[conversation_df['Flowchart'] == topic]
            
            if not topic_rows.empty:
                new_rows.extend(topic_rows.to_dict('records'))
        
        set_df = pd.DataFrame(new_rows)
        # set_df.insert(0, 'index', range(1, len(set_df) + 1))
        export_path = f"content/selected_topics_{set_index+1}.csv"
        set_df.to_csv(export_path, index=False)
        print(f"Selected topics saved to {export_path}")

    
if __name__ == "__main__":
    main()