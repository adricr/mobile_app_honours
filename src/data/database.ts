import carereqs from '@/src/data/seed/care_requirements.json';
import catalogue from '@/src/logic/plants/id_system/labels.json';
import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync("plantcare.db")
export async function initDb(db:SQLite.SQLiteDatabase) {
    await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS plant_catalogue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        species TEXT NOT NULL UNIQUE,
        common_name TEXT,
        position TEXT,
        water_schedule INTEGER
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species INTEGER NOT NULL,
      photo_uri TEXT,
      care_requirements TEXT,
      care_recommendations TEXT,
      current_status TEXT,
      care_log TEXT,
      collection INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (species) REFERENCES plant_catalogue(id),
      FOREIGN KEY (collection) REFERENCES collections(id) ON UPDATE CASCADE
      
    );

    CREATE TABLE IF NOT EXISTS care_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant INTEGER NOT NULL,
        date TEXT,
        actions TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plant) REFERENCES plants(id) ON DELETE CASCADE
        
    );
    `);
}

export async function dropDb(db:SQLite.SQLiteDatabase) {
    await db.execAsync(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS care_logs;
    DROP TABLE IF EXISTS plants;
    DROP TABLE IF EXISTS collections;
    DROP TABLE IF EXISTS plant_catalogue;

    PRAGMA foreign_keys = ON;
    `);
}

export async function seedDb(db:SQLite.SQLiteDatabase) {
    const catalogueQuery = 'SELECT COUNT(*) AS count FROM plant_catalogue'
    const catalogRow = await db.getFirstAsync<{ count: number }>(catalogueQuery);
    if (catalogRow && catalogRow.count === 0){
        console.log("seeding plant catalogue")
        await db.withTransactionAsync(async()=>{
            for (const key in catalogue){
                for(const care_key in carereqs)
                    if(carereqs[care_key].species === catalogue[key].species){
                        await db.runAsync('INSERT INTO plant_catalogue (species, common_name, position, water_schedule) VALUES (?,?,?,?)',catalogue[key].species, catalogue[key].common_name, carereqs[care_key].position, carereqs[care_key].water_schedule)}
            }
        })
    }   

    
}