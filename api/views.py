from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room
from django.views.decorators.csrf import csrf_exempt
import pickle
import json
import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


module_dir = os.path.dirname(__file__)

file_path = os.path.join(module_dir, 'Training new.csv')
train_df = pd.read_csv(file_path)
train_df.head()

file_path = os.path.join(module_dir, 'disease_precaution.csv')
df = pd.read_csv(file_path)
precaution = {}
for i, row in df.iterrows():
    precaution[row['Disease']] = [row['Symptom_precaution_0'] , row['Symptom_precaution_1'] , str(row['Symptom_precaution_2']) , str(row['Symptom_precaution_3'])]

l1 = list(train_df.columns[:-1])
l1.append('aaa')
l2=[]
for i in range(len(l1)-1):
    l2.append(0)
    
X = train_df[['itching','skin_rash','nodal_skin_eruptions','continuous_sneezing','shivering','chills','joint_pain','stomach_pain','acidity','ulcers_on_tongue','muscle_wasting','vomiting','burning_micturition','spotting_ urination','fatigue','weight_gain','anxiety','cold_hands_and_feets','mood_swings','weight_loss','restlessness','lethargy','patches_in_throat','irregular_sugar_level','cough','high_fever','sunken_eyes','breathlessness','sweating','dehydration','indigestion','headache','yellowish_skin','dark_urine','nausea','loss_of_appetite','pain_behind_the_eyes','back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine','yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach','swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation','redness_of_eyes','sinus_pressure','runny_nose','congestion','chest_pain','weakness_in_limbs','fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region','bloody_stool','irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs','swollen_blood_vessels','puffy_face_and_eyes','enlarged_thyroid','brittle_nails','swollen_extremeties','excessive_hunger','extra_marital_contacts','drying_and_tingling_lips','slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints','movement_stiffness','spinning_movements','loss_of_balance','unsteadiness','weakness_of_one_body_side','loss_of_smell','bladder_discomfort','foul_smell_of urine','continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)','depression','irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain','abnormal_menstruation','dischromic _patches','watering_from_eyes','increased_appetite','polyuria','family_history','mucoid_sputum','rusty_sputum','lack_of_concentration','visual_disturbances','receiving_blood_transfusion','receiving_unsterile_injections','coma','stomach_bleeding','distention_of_abdomen','history_of_alcohol_consumption','fluid_overload','blood_in_sputum','prominent_veins_on_calf','palpitations','painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling','silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister','red_sore_around_nose','yellow_crust_ooze']]
y = train_df['prognosis']
X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.3)

''' Random Forest '''
rf_clf = RandomForestClassifier()
rf_clf.fit(X_train, y_train)
pred = rf_clf.predict(X_test)
acc = accuracy_score(y_test, pred)
print("Accuracy Score Random Forest: ", acc)

def randomforest(psymptoms):
    index = []
    for i in psymptoms:
        if i=='aaa' or i=='Select Here':
            index.append(psymptoms.index(i))
            
    for i in range(len(index)-1,-1,-1):
        del(psymptoms[index[i]])
    
    l2 = []
    for i in range(len(l1)-1):
        l2.append(0)
        
    for k in range(len(l1)):
        for z in psymptoms:
            if(z==l1[k]):
                l2[k]=1

    inputtest = [l2]
    predict = rf_clf.predict(inputtest)
    return predict[0]
 
# Create your views here.
@csrf_exempt 
def main(request):
    symptoms = json.loads(request.body.decode('utf-8'))['symptoms']
    print(symptoms)
    disease = randomforest(symptoms)
    response = {
        'disease' : disease,
        'precautions' : precaution[disease]
    }

    return HttpResponse(json.dumps(response))

class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
