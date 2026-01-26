export const VALID_CODES = [
  "A9K3Q7",
  "M2F8RZ",
  "7TQ4L9",
  "X5N8C2",
  "R4Z7M1",
  "K9W2F8",
  "3C7AQL",
  "N8X2M5",
  "F6RZ9K",
  "Q4T1W7",
  "8MZK3A",
  "L5R9X2",
  "C7F4NQ",
  "W2A8MZ",
  "9T3KXR",
  "FZ6Q1M",
  "A4N7W8",
  "2XK9RC",
  "M7Q5FZ",
  "K1T8A4",
  "R9C6X2",
  "W7M4FQ",
  "XK2Z93",
  "NQ5A8R",
  "4Z9TMW",
  "C1X7F8",
  "QZ3M2K",
  "A8R5N9",
  "T4FZ1C",
  "M9WQX7",
  "TEST",
];

export const CODE_TO_VERSION: { [key: string]: number } = {
  A9K3Q7: 1,
  M2F8RZ: 2,
  "7TQ4L9": 3,
  X5N8C2: 4,
  R4Z7M1: 5,
  K9W2F8: 6,
  "3C7AQL": 7,
  N8X2M5: 8,
  F6RZ9K: 9,
  Q4T1W7: 10,
  "8MZK3A": 11,
  L5R9X2: 12,
  C7F4NQ: 13,
  W2A8MZ: 14,
  "9T3KXR": 15,
  FZ6Q1M: 16,
  A4N7W8: 17,
  "2XK9RC": 18,
  M7Q5FZ: 19,
  K1T8A4: 20,
  R9C6X2: 21,
  W7M4FQ: 22,
  XK2Z93: 23,
  NQ5A8R: 24,
  "4Z9TMW": 25,
  C1X7F8: 26,
  QZ3M2K: 27,
  A8R5N9: 28,
  T4FZ1C: 29,
  M9WQX7: 30,
  TEST: 31,
};

export const FLOWCHART_GROUPS: { [key: string]: string[] } = {
  general_medicine: [
    "Feeling Generally Ill Flowchart",
    "Unexplained Weight Loss Flowchart",
    "Overweight Flowchart",
    "Fever Flowchart",
    "Fever In Young Children Flowchart",
    "Fever In Children Flowchart",
    "Excessive Sweating Flowchart",
    "Slow Weight Gain In Young Children Flowchart",
  ],
  neurology: [
    "Feeling Faint And Fainting Flowchart",
    "Dizziness Flowchart",
    "Headache Flowchart",
    "Numbness Or Tingling Flowchart",
    "Twitching And Trembling Flowchart",
    "Pain In The Face Flowchart",
    "Confusion Flowchart",
    "Confusion In Older People Flowchart",
    "Impaired Memory Flowchart",
    "Difficulty Speaking Flowchart",
  ],
  mental_behavioral_health: [
    "Disturbing Thoughts Or Feelings Flowchart",
    "Unusual Behavior Flowchart",
    "Depression Flowchart",
    "Anxiety Flowchart",
    "Hallucinations Flowchart",
    "Nightmares Flowchart",
    "Difficulty Sleeping Flowchart",
    "Waking At Night In Children Flowchart",
    "Crying In Infants Flowchart",
  ],
  dermatology: [
    "Hair Loss Flowchart",
    "General Skin Problems Flowchart",
    "Facial Skin Problems Flowchart",
    "Itchy Spots And Rashes Flowchart",
    "Itching Without A Rash Flowchart",
    "Rash With Fever Flowchart",
    "Raised Spots And Lumps Flowchart",
    "Abnormal Hair Growth In Women Flowchart",
    "Skin Problems In Young Children Flowchart",
    "Itching In Children Flowchart",
    "Swellings In Children Flowchart",
    "Swellings Under The Skin Flowchart",
  ],
  eye_ent_oral_health: [
    "Painful Eye Flowchart",
    "Disturbed Or Impaired Vision Flowchart",
    "Earache Flowchart",
    "Noises In The Ear Flowchart",
  ],
  gastroenterology: [
    "Vomiting Flowchart",
    "Recurring Vomiting Flowchart",
    "Abdominal Pain Flowchart",
    "Recurring Abdominal Pain Flowchart",
    "Swollen Abdomen Flowchart",
    "Gas And Belching Flowchart",
    "Diarrhea Flowchart",
    "Constipation Flowchart",
    "Abnormal Looking Stools Flowchart",
    "Vomiting In Infants Flowchart",
    "Diarrhea In Infants Flowchart",
    "Abdominal Pain In Children Flowchart",
  ],
  musculoskeletal_system: [
    "Backache Flowchart",
    "Cramp Flowchart",
    "Painful Or Stiff Neck Flowchart",
    "Painful Arm Or Hand Flowchart",
    "Painful Leg Flowchart",
    "Painful Knee Flowchart",
    "Painful Shoulder Flowchart",
    "Painful Ankles Flowchart",
    "Swollen Ankles Flowchart",
    "Foot Problems Flowchart",
    "Limping In Children Flowchart",
  ],
  reproductive_health: [
    "Painful Or Enlarged Testicles Flowchart",
    "Painful Intercourse In Men Flowchart",
    "Infertility In Men Flowchart",
    "Infertility In Women Flowchart",
    "Absent Periods Flowchart",
    "Heavy Periods Flowchart",
    "Painful Periods Flowchart",
    "Pelvic Pain In Women Flowchart",
    "Irregular Vaginal Bleeding Flowchart",
    "Abnormal Vaginal Discharge Flowchart",
  ],
};

export const FLOWCHART_DESCRIPTIONS: { [key: string]: string } = {
  "Infertility In Men Flowchart":
    "All ages - Male - Flowchart for the inability to conceive after more than 12 months of having intercourse without using contraception.",
  "Abnormal Looking Stools Flowchart":
    "All ages - Male and Female - Flowchart for stools that are not the usual color or consistency.",
  "Painful Or Enlarged Testicles Flowchart":
    "All ages - Male - Flowchart for pain or swelling that may affect one or both testicles or the scrotum (the pouch that contains the testicles).",
  "Vomiting Flowchart":
    ">6 months - Male and Female - Flowchart for throwing up.",
  "Bad Breath Flowchart":
    "All ages - Male and Female - Flowchart for foul-smelling breath that may be temporary or persistent.",
  "Wheezing Flowchart":
    "All ages - Male and Female - Flowchart for noisy, difficult breathing.",
  "Nightmares Flowchart":
    "All ages - Male and Female - Flowchart for frightening dreams that may be disturbing enough to wake you.",
  "Vaginal Irritation Flowchart":
    "All ages - Female - Flowchart for itching or soreness inside or just outside the vagina.",
  "Headache Flowchart":
    "All ages - Male and Female - Flowchart for mild to severe pain in the head.",
  "Feeling Generally Ill Flowchart":
    "All ages - Male and Female - Flowchart for a vague sense of not being well.",
  "Unusual Behavior Flowchart":
    "All ages - Male and Female - Flowchart for behavior that is significantly different from a person's usual behavior.",
  "Disturbed Or Impaired Vision Flowchart":
    "All ages - Male and Female - Flowchart for vision problems, including blurring, double vision, or seeing flashing lights or floating spots.",
  "Breast Problems In New Mothers Flowchart":
    "All ages - Female - Flowchart for pain, tenderness, or lumps in the breasts within 4 months of having a baby.",
  "Hearing Loss Flowchart":
    "All ages - Male and Female - Flowchart for impaired ability to hear in one or both ears.",
  "Slow Weight Gain In Young Children Flowchart":
    "0-2 years - Male and Female - Flowchart for failure to gain weight or grow at the expected rate.",
  "Fever Flowchart":
    ">12 years - Male and Female - Flowchart for a temperature of 100f or higher.",
  "Painful Periods Flowchart":
    "All ages - Female - Flowchart for pain with menstruation.",
  "Pelvic Pain In Women Flowchart":
    "All ages - Female - Flowchart for pain in the pelvic area.",
  "Twitching And Trembling Flowchart":
    "All ages - Male and Female - Flowchart for involuntary muscle movements including sudden, brief twitching and persistent trembling or shaking.",
  "Earache Flowchart":
    "All ages - Male and Female - Flowchart for pain in one or both ears.",
  "Chest Pain Flowchart":
    "All ages - Male and Female - Flowchart for any pain between the neck and the bottom of the rib cage.",
  "Diarrhea In Infants Flowchart":
    "0-6 months - Male and Female - Flowchart for having three to four watery bowel movements within 24 hours.",
  "Itchy Spots And Rashes Flowchart":
    ">2 years - Male and Female - Flowchart for discolored or raised areas of itchy skin.",
  "Difficulty Swallowing Flowchart":
    "All ages - Male and Female - Flowchart for discomfort or pain when swallowing, or the inability to swallow.",
  "Foot Problems Flowchart":
    "All ages - Male and Female - Flowchart for pain, irritation, or swelling anywhere in one or both feet.",
  "Impaired Memory Flowchart":
    "All ages - Male and Female - Flowchart for difficulty remembering specific facts, events, or periods of time.",
  "Difficulty Breathing Flowchart":
    "All ages - Male and Female - Flowchart for shortness of breath or tightness in your chest that makes you aware of your breathing.",
  "Swellings In Children Flowchart":
    "0-12 years - Male and Female - Flowchart for any swellings or lumps in the neck or armpits.",
  "Dizziness Flowchart":
    "All ages - Male and Female - Flowchart for a spinning sensation accompanied by light-headedness and unsteadiness.",
  "Pain Or Lumps In The Breast Flowchart":
    "All ages - Female - Flowchart for aches, pain, tenderness, or lumps in one or both breasts.",
  "Numbness Or Tingling Flowchart":
    "All ages - Male and Female - Flowchart for loss of feeling or a prickly sensation in any part of the body.",
  "Abdominal Pain Flowchart":
    ">12 years - Male and Female - Flowchart for pain between the bottom of the rib cage and the groin.",
  "Waking At Night In Children Flowchart":
    "0-5 years - Male and Female - Flowchart for difficulty sleeping through the night that causes a child to cry or call out.",
  "Raised Spots And Lumps Flowchart":
    "All ages - Male and Female - Flowchart for raised areas on the skin that may be inflamed, dark-colored, rough, or hard.",
  "Abdominal Pain In Children Flowchart":
    "2-12 years - Male and Female - Flowchart for pain in the area between the bottom of the rib cage and the groin.",
  "Excessive Sweating Flowchart":
    "All ages - Male and Female - Flowchart for sweating that is not associated with warm environmental temperatures or exercise.",
  "Painful Shoulder Flowchart":
    "All ages - Male and Female - Flowchart for pain, stiffness, or limited movement in the shoulder.",
  "Painful Knee Flowchart":
    "All ages - Male and Female - Flowchart for pain in or around the knee joint.",
  "Sore Throat Flowchart":
    "All ages - Male and Female - Flowchart for a rough or raw feeling at the back of the throat that causes discomfort, especially when swallowing.",
  "Difficulty Speaking Flowchart":
    "All ages - Male and Female - Flowchart for difficulty choosing, using, or pronouncing words.",
  "Swollen Abdomen Flowchart":
    "All ages - Male and Female - Flowchart for generalized swelling over the entire abdomen between the bottom of the rib cage and the groin.",
  "Runny Nose Flowchart":
    "All ages - Male and Female - Flowchart for a partially or completely blocked nose, with a liquid discharge.",
  "Itching Without A Rash Flowchart":
    ">12 years - Male and Female - Flowchart for the skin itches but there is no change in its appearance.",
  "Coughing In Children Flowchart":
    "2-12 years - Male and Female - Flowchart for coughing in children, which is usually a symptom of a respiratory infection.",
  "Rash With Fever Flowchart":
    "All ages - Male and Female - Flowchart for spots, discolored areas, or blisters on the skin and a temperature of 100f or higher.",
  "Depression Flowchart":
    "All ages - Male and Female - Flowchart for a mood disorder characterized by feelings of sadness, hopelessness, and helplessness, usually combined with poor self-esteem, apathy, and withdrawal from social situations.",
  "Abnormal Hair Growth In Women Flowchart":
    "All ages - Female - Flowchart for excessive hair anywhere on the body.",
  "Facial Skin Problems Flowchart":
    ">2 years - Male and Female - Flowchart for any rash, spots, or changes in the skin on the face.",
  "Painful Or Stiff Neck Flowchart":
    "All ages - Male and Female - Flowchart for pain or discomfort or inability to move the neck.",
  "Pain In The Face Flowchart":
    "All ages - Male and Female - Flowchart for pain in one or both sides of the face or forehead.",
  "General Skin Problems Flowchart":
    ">2 years - Male and Female - Flowchart for changes in the skin, including rashes and spots.",
  "Difficulty Sleeping Flowchart":
    ">5 years - Male and Female - Flowchart for frequent problems falling asleep or staying asleep.",
  "Disturbing Thoughts Or Feelings Flowchart":
    "All ages - Male and Female - Flowchart for having thoughts or feelings that seem abnormal or unhealthy.",
  "Coughing Up Blood Flowchart":
    "All ages - Male and Female - Flowchart for coughing up blood or mucus that is colored or streaked bright red or rusty brown, contains dark flecks or spots, or is pink and frothy.",
  "Feeling Faint And Fainting Flowchart":
    "All ages - Male and Female - Flowchart for a sudden feeling of weakness and unsteadiness that may result in brief loss of consciousness.",
  "Irregular Vaginal Bleeding Flowchart":
    "All ages - Female - Flowchart for any bleeding that occurs between menstrual periods, during pregnancy, or after menopause.",
  "Swellings Under The Skin Flowchart":
    ">12 years - Male and Female - Flowchart for a new lump or swelling under the skin that you can see or feel.",
  "Painful Leg Flowchart":
    "All ages - Male and Female - Flowchart for intermittent or continuous pain in the thigh or calf.",
  "Hoarseness Or Loss Of Voice Flowchart":
    "All ages - Male and Female - Flowchart for abnormal huskiness in the voice.",
  "Skin Problems In Young Children Flowchart":
    "0-2 years - Male and Female - Flowchart for skin discoloration, inflammation, or blemishes.",
  "Abnormally Frequent Urination Flowchart":
    "All ages - Male and Female - Flowchart for feeling the urge to urinate and urinating more often than usual.",
  "Confusion In Older People Flowchart":
    ">65 years - Male and Female - Flowchart for a loss of clarity about times, places, and events, or a loss of contact with reality.",
  "Palpitations Flowchart":
    "All ages - Male and Female - Flowchart for a feeling that your heart is beating irregularly or more strongly or rapidly than usual.",
  "Sore Mouth Or Tongue Flowchart":
    "All ages - Male and Female - Flowchart for soreness inside the mouth or on or around the tongue or lips.",
  "Gas And Belching Flowchart":
    "All ages - Male and Female - Flowchart for the expulsion of gas from the digestive tract through the mouth or the anus (also called flatulence).",
  "Painful Ankles Flowchart":
    "All ages - Male and Female - Flowchart for pain in or around one or both ankles.",
  "Recurring Vomiting Flowchart":
    ">6 months - Male and Female - Flowchart for vomiting several times within a week.",
  "Swollen Ankles Flowchart":
    "All ages - Male and Female - Flowchart for swelling or puffiness in one or both ankles.",
  "Cramp Flowchart":
    "All ages - Male and Female - Flowchart for involuntary, painful tightening of muscles other than the abdominal muscles.",
  "Limping In Children Flowchart":
    "0-12 years - Male and Female - Flowchart for difficulty walking (in a young child, a reluctance to walk) that may be accompanied by pain in the affected hip, leg, or foot.",
  "Abnormal Vaginal Discharge Flowchart":
    "All ages - Female - Flowchart for discharge from the vagina that is different than usual in color, consistency, or quantity.",
  "Toothache Flowchart":
    "All ages - Male and Female - Flowchart for pain in the teeth or gums.",
  "Painful Urination Flowchart":
    "All ages - Male and Female - Flowchart for discomfort when urinating, sometimes accompanied by pain in the lower abdomen.",
  "Recurring Abdominal Pain Flowchart":
    ">12 years - Male and Female - Flowchart for abdominal pain that comes and goes.",
  "Lack Of Bladder Control In Older People Flowchart":
    ">65 years - Male and Female - Flowchart for involuntary urination.",
  "Abnormal Looking Urine Flowchart":
    "All ages - Male and Female - Flowchart for urine that differs from its usual color or that is cloudy or tinged with blood.",
  "Heavy Periods Flowchart":
    "All ages - Female - Flowchart for menstrual periods lasting longer than 7 days or that are longer or heavier than usual.",
  "Noises In The Ear Flowchart":
    "All ages - Male and Female - Flowchart for sounds (such as ringing, buzzing, or hissing) that have no external source and that only you can hear.",
  "Itching In Children Flowchart":
    "2-12 years - Male and Female - Flowchart for skin irritation that makes a child want to scratch.",
  "Lack Of Bladder Control Flowchart":
    "0-65 years - Male and Female - Flowchart for involuntary urination.",
  "Painful Arm Or Hand Flowchart":
    "All ages - Male and Female - Flowchart for pain in the arm, elbow, wrist, or hand.",
  "Infertility In Women Flowchart":
    "All ages - Female - Flowchart for the inability to conceive after more than 12 months of having intercourse without using contraception.",
  "Coughing Flowchart":
    ">12 years - Male and Female - Flowchart for a sudden, forceful release of air from the lungs that helps clear material from breathing passages.",
  "Painful Eye Flowchart":
    "All ages - Male and Female - Flowchart for continuous or intermittent pain in or around the eye.",
  "Unexplained Weight Loss Flowchart":
    "All ages - Male and Female - Flowchart for losing a lot of weight (10 or more pounds in 10 weeks or less) without trying.",
  "Constipation Flowchart":
    "All ages - Male and Female - Flowchart for infrequent, difficult passage of hard stools.",
  "Hallucinations Flowchart":
    "All ages - Male and Female - Flowchart for abnormal sensory perceptions that occur without an external stimulus and are not based on reality.",
  "Overweight Flowchart":
    "All ages - Male and Female - Flowchart for if you are overweight according to the body mass index chart, you may be putting your health at risk.",
  "Hair Loss Flowchart":
    "All ages - Male and Female - Flowchart for thinning of hair or hair loss on all or part of the head.",
  "Vomiting In Infants Flowchart":
    "0-6 months - Male and Female - Flowchart for burping or throwing up after feedings.",
  "Fever In Young Children Flowchart":
    "0-2 years - Male and Female - Flowchart for an axillary (armpit) temperature over 100ºF or a rectal temperature over 102ºF.",
  "Absent Periods Flowchart":
    "All ages - Female - Flowchart for not getting your menstrual period when it's due.",
  "Crying In Infants Flowchart":
    "0-6 months - Male and Female - Flowchart for any persistent crying in infants.",
  "Painful Intercourse In Women Flowchart":
    "All ages - Female - Flowchart for pain or discomfort during or just after sexual intercourse.",
  "Anxiety Flowchart":
    "All ages - Male and Female - Flowchart for a feeling of tension, apprehension, or edginess, sometimes accompanied by physical symptoms such as palpitations or diarrhea.",
  "Backache Flowchart":
    "All ages - Male and Female - Flowchart for continuous or intermittent pain or stiffness in the back.",
  "Painful Intercourse In Men Flowchart":
    "All ages - Male - Flowchart for pain or discomfort during or just after intercourse.",
  "Confusion Flowchart":
    "All ages - Male and Female - Flowchart for confusion ranging from being unsure about times, places, and events to complete loss of contact with reality.",
  "Fever In Children Flowchart":
    "2-12 years - Male and Female - Flowchart for an axillary temperature over 100ºF, an oral temperature over 101ºF, or a rectal temperature over 102ºF.",
  "Diarrhea Flowchart":
    ">6 months - Male and Female - Flowchart for frequent passing of unusually loose stools.",
};
