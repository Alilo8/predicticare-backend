import './app.css'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
})



export function App() {
  const data = ['itching','skin_rash','nodal_skin_eruptions','continuous_sneezing','shivering','chills','joint_pain','stomach_pain','acidity','ulcers_on_tongue','muscle_wasting','vomiting','burning_micturition','spotting_ urination','fatigue','weight_gain','anxiety','cold_hands_and_feets','mood_swings','weight_loss','restlessness','lethargy','patches_in_throat','irregular_sugar_level','cough','high_fever','sunken_eyes','breathlessness','sweating','dehydration','indigestion','headache','yellowish_skin','dark_urine','nausea','loss_of_appetite','pain_behind_the_eyes','back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine','yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach','swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation','redness_of_eyes','sinus_pressure','runny_nose','congestion','chest_pain','weakness_in_limbs','fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region','bloody_stool','irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs','swollen_blood_vessels','puffy_face_and_eyes','enlarged_thyroid','brittle_nails','swollen_extremeties','excessive_hunger','extra_marital_contacts','drying_and_tingling_lips','slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints','movement_stiffness','spinning_movements','loss_of_balance','unsteadiness','weakness_of_one_body_side','loss_of_smell','bladder_discomfort','foul_smell_of urine','continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)','depression','irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain','abnormal_menstruation','dischromic _patches','watering_from_eyes','increased_appetite','polyuria','family_history','mucoid_sputum','rusty_sputum','lack_of_concentration','visual_disturbances','receiving_blood_transfusion','receiving_unsterile_injections','coma','stomach_bleeding','distention_of_abdomen','history_of_alcohol_consumption','fluid_overload','blood_in_sputum','prominent_veins_on_calf','palpitations','painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling','silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister','red_sore_around_nose','yellow_crust_ooze']
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState(data)
  const [diseases, setDiseases] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [prediction, setPrediction] = useState('');
  console.log(typeof(diseases))

  useEffect(() => {
    if(search){
      setSearchResult(data.filter(sample => {return sample.match(search)}))
    }
  }, [search])
  
  function submit(e){
    console.log('ok')
    e.preventDefault()
    client.post(
      '',
      {
        diseases
      }
    ).then(function(res){
      console.log(res)
      setPrediction(res.data)
    })
  }
  return (
    <div className='flex flex-col h-screen justify-around'>
      <div className='flex justify-center gap-5'>
        <div className='flex gap-5'>
          <div onBlur={() => setTimeout(() => setIsOpen(false), 180)}>
            <input onChange={e => setSearch(e.target.value)} value={search} onFocus={() => setIsOpen(true)}
            className='py-2 px-4 border border-blue-400 outline-none focus:border-blue-800 rounded-md' type='search' placeholder='search disease'></input>
            {isOpen}
            {isOpen && 
              <div className='flex flex-col absolute mt-2 rounded-md shadow-lg w-72 cursor-pointer max-h-96 overflow-y-scroll'>
                {searchResult.map((sample, i) => (
                  <div key={i} onClick={() => setSearch(sample)} className='py-2 px-4 hover:bg-gray-200 w-full text-left'>{sample}</div>
                ))}
              </div>
            }
          </div>
          <button onClick={() => setDiseases(diseases => [...diseases, search])} className='bg-blue-500 h-fit text-white p-2 rounded-md hover:bg-blue-400'>Add</button>
        </div>
        <div className='flex flex-col border border-gray-300 rounded-md h-96 w-80'>
            {diseases.map(disease => (
              <div>{disease}</div>
            ))}
        </div>
        <button onClick={submit} className='bg-blue-500 h-fit text-white p-2 rounded-md hover:bg-blue-400'>Predict</button>
      </div>
      <div>
        {prediction &&
          <span>
            Prediction: {prediction}
          </span>
        }
      </div>
    </div>
  )
}
