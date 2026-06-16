#!/usr/bin/env node
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnvPaths() {
  if (process.env.DATABASE_URL) return;
  const candidates = [];
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    candidates.push(path.join(dir, '.env'));
    dir = path.dirname(dir);
  }
  candidates.push(path.resolve(process.cwd(), '.env'));

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        for (const line of content.split(/\r?\n/)) {
          const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
          if (m) {
            const key = m[1];
            let val = m[2];
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (!process.env[key]) process.env[key] = val;
          }
        }
        return;
      }
    } catch (e) {}
  }
}

loadEnvPaths();

async function reseed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    console.log('Truncating tables...');
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE applications, study_materials, exams, jobs, college_cutoffs, college_fees, colleges RESTART IDENTITY CASCADE');

    console.log('Inserting PGCET exams...');
    const res = await client.query(
      `INSERT INTO exams (name, full_name, description, exam_date, application_start_date, application_end_date, apply_link, eligibility, application_guide, official_website)
       VALUES
       ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10),
       ($11,$12,$13,$14,$15,$16,$17,$18,$19,$20),
       ($21,$22,$23,$24,$25,$26,$27,$28,$29,$30)
       RETURNING id`,
      [
        'Karnataka PGCET 2026 - MBA',
        'Post Graduate Common Entrance Test 2026 (MBA)',
        'Entrance test for admission to MBA programs in Karnataka. Managed by KEA.',
        '2026-06-15',
        '2026-04-01',
        '2026-05-15',
        'https://kea.kar.nic.in/pgcet2026',
        "Any Bachelor's degree with 50% aggregate (45% for SC/ST/OBC-I).",
        'Step 1: Visit KEA portal.\nStep 2: Register for PGCET MBA.\nStep 3: Fill details and pay fee.',
        'https://kea.kar.nic.in',

        'Karnataka PGCET 2026 - MCA',
        'Post Graduate Common Entrance Test 2026 (MCA)',
        'Entrance test for admission to MCA programs in Karnataka. Managed by KEA.',
        '2026-06-15',
        '2026-04-01',
        '2026-05-15',
        'https://kea.kar.nic.in/pgcet2026',
        'BCA/B.Sc (CS/IT) or any degree with Maths with 50% aggregate.',
        'Step 1: Visit KEA portal.\nStep 2: Register for PGCET MCA.\nStep 3: Fill details and pay fee.',
        'https://kea.kar.nic.in',

        'Karnataka PGCET 2026 - M.Tech',
        'Post Graduate Common Entrance Test 2026 (M.Tech/M.E/M.Arch)',
        'Entrance test for admission to M.Tech and other technical PG programs in Karnataka.',
        '2026-06-15',
        '2026-04-01',
        '2026-05-15',
        'https://kea.kar.nic.in/pgcet2026',
        'B.E/B.Tech in relevant branch with 50% aggregate.',
        'Step 1: Visit KEA portal.\nStep 2: Register for PGCET M.Tech.\nStep 3: Fill details and pay fee.',
        'https://kea.kar.nic.in',
      ],
    );

    const examIds = res.rows.map(r => r.id);
    const [mbaId, mcaId, mtechId] = examIds;

    console.log('Inserting study materials...');
    const materials = [
      [mbaId, 'MBA PGCET Official Syllabus 2026', 'Syllabus', 'PDF', 'Comprehensive syllabus and exam pattern for MBA.', 'https://kea.kar.nic.in/pgcet2026/syllabus_mba.pdf'],
      [mbaId, 'Quantitative Aptitude Video Classes', 'Mathematics', 'Video', 'Complete video playlist for MBA aptitude preparation.', 'https://www.youtube.com/watch?v=K-HMk9dw8Qk'],
      [mbaId, 'Logical Reasoning Full Course', 'Reasoning', 'Video', 'Expert lectures on logical and analytical reasoning.', 'https://www.youtube.com/watch?v=tTrT0xmSuPA'],

      [mcaId, 'MCA PGCET Official Syllabus 2026', 'Syllabus', 'PDF', 'Detailed MCA syllabus including Mathematics and Computer sections.', 'https://kea.kar.nic.in/pgcet2026/syllabus_mca.pdf'],
      [mcaId, 'Computer Awareness & Architecture Classes', 'Computer Science', 'Video', 'Video series on hardware, OS, and computer fundamentals.', 'https://www.youtube.com/watch?v=KUa2TORY23Q'],

      [mtechId, 'M.Tech PGCET Syllabus - All Branches', 'Syllabus', 'PDF', 'Common and branch-specific syllabus for M.Tech/ME.', 'https://kea.kar.nic.in/pgcet2026/syllabus_mtech.pdf'],
      [mtechId, 'Engineering Mathematics - NPTEL Video Series', 'Engineering Maths', 'Video', 'Advanced calculus and linear algebra for M.Tech.', 'https://www.youtube.com/watch?v=Me4TZN4qRuo'],
    ];

    const insertText = 'INSERT INTO study_materials (exam_id, title, subject, type, description, url) VALUES ' +
      materials.map((_, i) => `($${i*6+1},$${i*6+2},$${i*6+3},$${i*6+4},$${i*6+5},$${i*6+6})`).join(',') + ' RETURNING id';

    const flat = materials.flat();
    await client.query(insertText, flat);

    await client.query('COMMIT');
    console.log('Reseed completed successfully.');
  } catch (err) {
    console.error('Reseed failed:', err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

reseed();
