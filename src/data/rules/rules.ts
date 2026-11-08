import { Rule } from "../repositories/recommendations"

export const rules:Rule[] =[
    {
        name: "low temps",
        condition: f=> f.temp!= null && f.temp<f.hardiness,
        result: f=> {return "needs_higher_temps"}

    },
    {
        name: "pls water",
        condition: f=> f.watering_interval!=null && (Date.now()-(f.watering_interval*24*60*60*1000)) > f.last_watered ,
        result: f=> {return "needs_watering"}
    },
    {
        name: "Lots of clouds",
        condition: f=> f.cloud_cover!= null && f.cloud_cover>90 && f.recommended_position == "full sun",
        result: f=>{return "needs_temporary_sun"}
    },
    {
        name: "Needs different position",
        condition: f=> f.recommended_position && f.position != f.recommended_position,
        result: f=>{return "needs_new_position"}
    },
    {
        name: "Needs context",
        condition: f=> !f.temp || !f.cloud_cover,
        result: f=>{return "needs_context"}
    },
        {
        name: "Needs Care Reqs",
        condition: f=> !f.recommended_position || !f.watering_interval || !f.hardiness,
        result: f=>{return "needs_care_reqs"}
    }
]