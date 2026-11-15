import { Facts } from "@/src/data/repositories/recommendations";
import { evaluate } from "@/src/logic/recommendation_system/recommender";

jest.mock("../src/data/database", () => ({ db: {} }));
const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-11-14T12:00:00Z").getTime();

beforeAll(() => { jest.useFakeTimers().setSystemTime(NOW); });
afterAll(() => { jest.useRealTimers(); });
const okPlant: Facts = {
    recommended_position: "full sun",
    watering_interval: 7,
    hardiness: 1,
    temp: 15,
    last_watered: NOW - 1 * DAY,
    cloud_cover: 20,
    position: "full sun"
}

const unhappyPlant: Facts = {
    recommended_position: "full sun",
    watering_interval: 7,
    hardiness: 1,
    temp: -2,
    last_watered: NOW - 10 * DAY,
    cloud_cover: 95,
    position: "partial shade"
}


describe('Recommender on a happy plant',()=>{
test('Ok Plant no recs',()=>{
    expect(evaluate(okPlant).messages).toEqual(
    [`There's no recommendations for this plant`,`This plant is happy!\nGreat Job!`])
});
})

describe('Recommender on only 1 ailment',()=>{
test('Plant needs watering',()=>{
    const messages = evaluate({...okPlant, last_watered: NOW - 15 * DAY}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`It's been 15 days since you watered this plant\nPlease water your plant as soon as you can`)
});

test('Plant needs position change',()=>{
    const messages = evaluate({...okPlant, position: "partial shade"}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`The plant is in partial shade please move your plant for it to receive full sun`)
});

test('Plant needs higher temps',()=>{
    const messages = evaluate({...okPlant, temp: -2}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toContain(`The current outside temperature, -2℃, might be too low for this plant, it prefers temperatures above 1℃.\nIf this plant is outside, it might suffer!`)
});

test('Plant needs temporary sun',()=>{
    const messages = evaluate({...okPlant, cloud_cover: 91}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`Seems like there's plenty of clouds right now, the plant might benefit from using an external light source`)
});

test('Plant has no temperature',()=>{
    const messages = evaluate({...okPlant, temp: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have context on this plant, we can't provide with recommendations!`)
});

test('Plant has no cloud coverage',()=>{
    const messages = evaluate({...okPlant, cloud_cover: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have context on this plant, we can't provide with recommendations!`)
});

test('Plant has no context at all',()=>{
    const messages = evaluate({...okPlant, temp: null, cloud_cover: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have context on this plant, we can't provide with recommendations!`)
});

test('System has no recommended position for plant',()=>{
    const messages = evaluate({...okPlant, recommended_position: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have the care requirements for this species. We apologise for this`)
});

test('System has no watering interval for plant',()=>{
    const messages = evaluate({...okPlant, watering_interval: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have the care requirements for this species. We apologise for this`)
});

test('System has no hardiness for plant',()=>{
    const messages = evaluate({...okPlant, hardiness: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have the care requirements for this species. We apologise for this`)
});

test('System missing two care reqs for plant',()=>{
    const messages = evaluate({...okPlant, watering_interval:null, hardiness: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have the care requirements for this species. We apologise for this`)
});

test('System missing all care reqs for plant',()=>{
    const messages = evaluate({...okPlant,recommended_position:null, watering_interval:null, hardiness: null}).messages
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatch(`We do not have the care requirements for this species. We apologise for this`)
});
})

describe('Some boundaries please',()=>{
    test("0% cloud cover is context, not missing context", () => {
    expect(evaluate({ ...okPlant, cloud_cover: 0 }).messages).toHaveLength(2)
    //just happy messages
});

    test("hardiness of 0 °C is a real care requirement", () => {
    expect(evaluate({ ...okPlant, hardiness: 0 }).messages).not.toContain(
    `We do not have the care requirements for this species. We apologise for this`)
});

})

describe('Check for creation date',()=>{
    test('Created on ok',()=>{
    const created_on = evaluate(unhappyPlant).created_on
    expect(created_on).toEqual(NOW)
});
})



describe('Evaluation recommender system',()=>{
    test('Recommendations for temp, position, cloudcoverage and watering ok',()=>{
    const messages = evaluate(unhappyPlant).messages
    expect(messages).toHaveLength(4)
    expect(messages).toContainEqual(`It's been 10 days since you watered this plant\nPlease water your plant as soon as you can`)
    expect(messages).toContainEqual(`Seems like there's plenty of clouds right now, the plant might benefit from using an external light source`)
    expect(messages).toContainEqual(`The plant is in partial shade please move your plant for it to receive full sun`)
    expect(messages).toContainEqual(`The current outside temperature, -2℃, might be too low for this plant, it prefers temperatures above 1℃.\nIf this plant is outside, it might suffer!`)
});
})