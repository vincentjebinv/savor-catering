import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';


const DB_NAME = 'solai_catering_db';
const sqlite = new SQLiteConnection(CapacitorSQLite);

export const initDB = async () => {
  try {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(DB_NAME, false)).result;
    let db: SQLiteDBConnection;
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection(DB_NAME, false);
    } else {
      db = await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, false);
    }
    await db.open();

    // 🟢 USERS TABLE (COLLATE NOCASE prevents Capital Letter errors)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL COLLATE NOCASE, 
        password_hash TEXT NOT NULL,
        company_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, name_en TEXT NOT NULL, name_ta TEXT NOT NULL, display_order INTEGER DEFAULT 0, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);`);
    await db.execute(`CREATE TABLE IF NOT EXISTS dishes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, category_id INTEGER NOT NULL, name_en TEXT NOT NULL, name_ta TEXT, price REAL DEFAULT 0, image_path TEXT, ingredients TEXT, varieties TEXT, display_order INTEGER DEFAULT 0, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE);`);
    await db.execute(`CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, customer_name TEXT, event_name TEXT, address TEXT, event_date TEXT, event_time TEXT, notes TEXT, status TEXT DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);`);
    await db.execute(`CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, dish_name_en TEXT, dish_name_ta TEXT, quantity INTEGER, category_name TEXT, FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE);`);
    await db.execute(`CREATE TABLE IF NOT EXISTS settings (user_id INTEGER PRIMARY KEY, logo_path TEXT, backup_frequency TEXT DEFAULT 'manual');`);

    console.log("✅ Database Ready");
    return true;
  } catch (err) {
    console.error("❌ DB Init Failed", err);
    return false;
  }
};

export const getDBConnection = async (): Promise<SQLiteDBConnection> => {
    const isConn = (await sqlite.isConnection(DB_NAME, false)).result;
    if (isConn) return await sqlite.retrieveConnection(DB_NAME, false);
    const db = await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, false);
    await db.open();
    return db;
};