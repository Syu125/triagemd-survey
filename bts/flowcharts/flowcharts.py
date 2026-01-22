def flowchart_categories():
    """Categorize flowcharts into 10 medical specialties."""

    general_medicine = ["Feeling Generally Ill Flowchart", "Unexplained Weight Loss Flowchart", "Overweight Flowchart", "Fever Flowchart", "Fever In Young Children Flowchart", "Fever In Children Flowchart", "Excessive Sweating Flowchart", "Slow Weight Gain In Young Children Flowchart"]
    neurology = ["Feeling Faint And Fainting Flowchart", "Dizziness Flowchart", "Headache Flowchart", "Numbness Or Tingling Flowchart", "Twitching And Trembling Flowchart", "Pain In The Face Flowchart", "Confusion Flowchart", "Confusion In Older People Flowchart", "Impaired Memory Flowchart", "Difficulty Speaking Flowchart"]
    mental_behavioral_health = ["Disturbing Thoughts Or Feelings Flowchart", "Unusual Behavior Flowchart", "Depression Flowchart", "Anxiety Flowchart", "Hallucinations Flowchart", "Nightmares Flowchart", "Difficulty Sleeping Flowchart", "Waking At Night In Children Flowchart", "Crying In Infants Flowchart"]
    dermatology = ["Hair Loss Flowchart", "General Skin Problems Flowchart", "Facial Skin Problems Flowchart", "Itchy Spots And Rashes Flowchart", "Itching Without A Rash Flowchart", "Rash With Fever Flowchart", "Raised Spots And Lumps Flowchart", "Abnormal Hair Growth In Women Flowchart", "Skin Problems In Young Children Flowchart", "Itching In Children Flowchart", "Swellings In Children Flowchart", "Swellings Under The Skin Flowchart"]
    eye_ent_oral_health = ["Painful Eye Flowchart", "Disturbed Or Impaired Vision Flowchart", "Earache Flowchart", "Noises In The Ear Flowchart", "Hearing Loss Flowchart", "Runny Nose Flowchart", "Sore Throat Flowchart", "Hoarseness Or Loss Of Voice Flowchart", "Toothache Flowchart", "Difficulty Swallowing Flowchart", "Sore Mouth Or Tongue Flowchart", "Bad Breath Flowchart"]
    pulmonology_cardiology = ["Coughing Flowchart", "Coughing Up Blood Flowchart", "Wheezing Flowchart", "Difficulty Breathing Flowchart", "Palpitations Flowchart", "Coughing In Children Flowchart", "Chest Pain Flowchart"]
    urology = ["Abnormally Frequent Urination Flowchart", "Abnormal Looking Urine Flowchart", "Painful Urination Flowchart", "Lack Of Bladder Control Flowchart", "Lack Of Bladder Control In Older People Flowchart"]
    gastroenterology = ["Vomiting Flowchart", "Recurring Vomiting Flowchart", "Abdominal Pain Flowchart", "Recurring Abdominal Pain Flowchart", "Swollen Abdomen Flowchart", "Gas And Belching Flowchart", "Diarrhea Flowchart", "Constipation Flowchart", "Abnormal Looking Stools Flowchart", "Vomiting In Infants Flowchart", "Diarrhea In Infants Flowchart", "Abdominal Pain In Children Flowchart"]
    musculoskeletal_system = ["Backache Flowchart", "Cramp Flowchart", "Painful Or Stiff Neck Flowchart", "Painful Arm Or Hand Flowchart", "Painful Leg Flowchart", "Painful Knee Flowchart", "Painful Shoulder Flowchart", "Painful Ankles Flowchart", "Swollen Ankles Flowchart", "Foot Problems Flowchart", "Limping In Children Flowchart"]
    reproductive_health = ["Painful Or Enlarged Testicles Flowchart", "Painful Intercourse In Men Flowchart", "Infertility In Men Flowchart", "Infertility In Women Flowchart", "Absent Periods Flowchart", "Heavy Periods Flowchart", "Painful Periods Flowchart", "Pelvic Pain In Women Flowchart", "Irregular Vaginal Bleeding Flowchart", "Abnormal Vaginal Discharge Flowchart", "Vaginal Irritation Flowchart", "Painful Intercourse In Women Flowchart", "Pain Or Lumps In The Breast Flowchart", "Breast Problems In New Mothers Flowchart"]

    flowchart_category_dict = {"General_Medicine": general_medicine, "Neurology": neurology, "Mental_and_Behavioral_Health": mental_behavioral_health, "Dermatology": dermatology, "Eye_Ear_Nose_Throat_and_Oral_Health": eye_ent_oral_health, "Pulmonology_and_Cardiology": pulmonology_cardiology, "Urology": urology, "Gastroenterology": gastroenterology, "Musculoskeletal_System": musculoskeletal_system, "Reproductive_Health": reproductive_health}
    return flowchart_category_dict

def get_flowchart_list():
    """Get a list of all flowcharts from all categories."""
    
    categories = flowchart_categories()
    flowchart_list = []
    for category in categories.values():
        flowchart_list.extend(category)
        
    return flowchart_list
