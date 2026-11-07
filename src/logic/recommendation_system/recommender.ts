import { Facts, getFacts, isRecommendation, PlantRecommendation, Recommendation, updateRecommendation } from "@/src/data/repositories/recommendations";

import { Plant } from "@/src/data/repositories/plants";
import { rules } from "@/src/data/rules/rules";


export function evaluate(facts:Facts):PlantRecommendation{
const readableDate = Math.round((Date.now() - facts.last_watered)/1000/60/60/24)
let recommendations: Recommendation[] = []
let messages: string[] = []
   //Get first the result of running the rules, you know the flags
    rules.forEach(
        (rule)=>{
            if(rule.condition(facts)){
                const res = rule.result(facts)
                if(isRecommendation(res)){
                    recommendations.push(res);
                }
                //Need to implement what happens when they are not recommendations
                // all Rules output recommendations for now
            }
        }
    )
    //And if we have flags, create the apropriate messages for the user to read
    if(recommendations.length > 0){
            recommendations.forEach(
        (recommendation)=>{
            switch (recommendation) {
                case "needs_watering":
                    messages.push(`It's been ${readableDate} days since you watered this plant\nPlease water your plant as soon as you can`)
                    break;
                case "needs_new_position":
                    messages.push(`The plant is in ${facts.position} please move your plant for it to receive ${facts.recommended_position}`)
                    break;
                //perhaps later
                // case "increase_humidity":
                //     messages.push(`This plant would benefit from raising it humidity to about ${facts.recommended_humidity}\% `)
                //     break;
                case "needs_higher_temps":
                    messages.push(`The current outside temperature, ${facts.temp}℃, might be too low for this plant, it prefers temperatures above ${facts.hardiness}℃.\nIf this plant is outside, it might suffer!`)
                    break;
                case "needs_temporary_sun":
                    messages.push(`Seems like there's plenty of clouds right now, the plant might benefit from using an external light source`)
                    break;
                case "needs_context":
                    messages.push(`We do not have context on this plant, we can't provide with recommendations!`)
                    break;
                case "needs_care_reqs":
                    messages.push(`We do not have the care requirements for this species. We apologise for this`)
                    break;
                default:
                    break;
            }

        }
    )
    }else{
        messages.push(`There's no recommendations for this plant`)
        messages.push(`This plant is happy!\nGreat Job!`)
    }

return {
    messages: messages,
    created_on: Date.now()
}
}


export async function assignRecommendations(plant:Plant):Promise<{ok:boolean, message:string}>{
    let facts:Facts|string = getFacts(plant.current_status,plant.care_requirements);
    if(typeof facts == "string"){
        return {ok: false, message: facts}
    }

    let recommendation = evaluate(facts)
    let changes = await updateRecommendation(plant.id,recommendation)
    if(changes && changes > 0){
        return {ok: true, message: "Recommendations ready"}
    }
    return {ok: false, message: "The recommendations could not be updated"}
}

