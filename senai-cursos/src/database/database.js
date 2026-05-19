import * as SQLite from 'expo-sqlite';
import { coursesSeed } from '../data/coursesSeed';

let database = null;
const SEED_VERSION = '2026-05-senai-suico-v5';

export async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('senai_cursos.db');
  }

  return database;
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      level TEXT NOT NULL,
      duration TEXT NOT NULL,
      area TEXT NOT NULL,
      teacher TEXT NOT NULL,
      rating REAL NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const version = await db.getFirstAsync(
    'SELECT value FROM app_meta WHERE key = ?;',
    'seed_version'
  );

  const result = await db.getFirstAsync('SELECT COUNT(*) AS total FROM courses;');

  if (!result || result.total === 0 || version?.value !== SEED_VERSION) {
    await resetAndSeedDatabase(false);
    await db.runAsync(
      'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?);',
      'seed_version',
      SEED_VERSION
    );
  }
}

export async function seedCourses() {
  const db = await getDatabase();

  for (const course of coursesSeed) {
    await db.runAsync(
      `INSERT INTO courses
        (title, subtitle, level, duration, area, teacher, rating, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      course.title,
      course.subtitle,
      course.level,
      course.duration,
      course.area,
      course.teacher,
      course.rating,
      course.description
    );
  }
}

export async function resetAndSeedDatabase(clearContacts = true) {
  const db = await getDatabase();

  if (clearContacts) {
    await db.execAsync('DELETE FROM courses; DELETE FROM contacts;');
  } else {
    await db.execAsync('DELETE FROM courses;');
  }

  await seedCourses();
}

export async function getAllCourses() {
  const db = await getDatabase();

  return db.getAllAsync(`
    SELECT *
    FROM courses
    ORDER BY area ASC, title ASC;
  `);
}

export async function getCoursesByFilter({
  search = '',
  area = 'Todos',
  level = 'Todos',
  teacher = 'Todos',
  minRating = 0,
  sortBy = 'rating',
}) {
  const db = await getDatabase();
  const params = [];
  const conditions = [];

  if (search.trim()) {
    conditions.push(`(
      title LIKE ? OR
      subtitle LIKE ? OR
      level LIKE ? OR
      area LIKE ? OR
      teacher LIKE ? OR
      description LIKE ?
    )`);

    const term = `%${search.trim()}%`;
    params.push(term, term, term, term, term, term);
  }

  if (area && area !== 'Todos') {
    conditions.push('area = ?');
    params.push(area);
  }

  if (level && level !== 'Todos') {
    conditions.push('level = ?');
    params.push(level);
  }

  if (teacher && teacher !== 'Todos') {
    conditions.push('teacher = ?');
    params.push(teacher);
  }

  if (Number(minRating) > 0) {
    conditions.push('rating >= ?');
    params.push(Number(minRating));
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const orderClauses = {
    rating: 'rating DESC, title COLLATE NOCASE ASC',
    title: 'title COLLATE NOCASE ASC',
    duration: 'CAST(duration AS INTEGER) ASC, title COLLATE NOCASE ASC',
    level: `CASE level
      WHEN 'Iniciante' THEN 1
      WHEN 'Intermediário' THEN 2
      WHEN 'Avançado' THEN 3
      ELSE 4
    END ASC, title COLLATE NOCASE ASC`,
  };

  const orderBy = orderClauses[sortBy] || orderClauses.rating;

  return db.getAllAsync(
    `
      SELECT *
      FROM courses
      ${whereClause}
      ORDER BY ${orderBy};
    `,
    ...params
  );
}

export async function saveContactMessage({ name, email, message }) {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();

  return db.runAsync(
    `INSERT INTO contacts (name, email, message, created_at)
     VALUES (?, ?, ?, ?);`,
    name,
    email,
    message,
    createdAt
  );
}
