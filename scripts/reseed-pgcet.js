#!/usr/bin/env node
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Try to load DATABASE_URL from environment, otherwise parse .env in repo root
function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
        if (m) {
          const key = m[1];
          let val = m[2];
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1);
          process.env[key] = val;
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

loadEnv();

async function reseed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    console.log('Truncating tables (applications, study_materials, exams, jobs, college_cutoffs, college_fees, colleges)');
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
    const mbaId = examIds[0];
    const mcaId = examIds[1];
    const mtechId = examIds[2];

    console.log('Inserting study materials...');
    const materials = [
      // MBA
      [mbaId, 'MBA PGCET Official Syllabus 2026', 'Syllabus', 'PDF', 'Comprehensive syllabus and exam pattern for MBA.', 'https://kea.kar.nic.in/pgcet2026/syllabus_mba.pdf'],
      [mbaId, 'Quantitative Aptitude Video Classes', 'Mathematics', 'Video', 'Complete video playlist for MBA aptitude preparation.', 'https://www.youtube.com/watch?v=K-HMk9dw8Qk'],
      [mbaId, 'Logical Reasoning Full Course', 'Reasoning', 'Video', 'Expert lectures on logical and analytical reasoning.', 'https://www.youtube.com/watch?v=tTrT0xmSuPA'],
      [mbaId, 'MBA Previous Year Papers (2020-2025)', 'Previous Papers', 'PDF', 'Consolidated archive of solved MBA PGCET papers.', 'https://kea.kar.nic.in/pgcet/mba_papers.zip'],
      [mbaId, 'MBA Proficiency Test (Full Length Quiz)', 'Mock Test', 'Practice_Test', 'Timed mock test covering all sections of the MBA PGCET.', 'https://www.indiabix.com/online-test/aptitude-test/'],
      [mbaId, 'English Language Mastery Notes', 'Verbal Ability', 'Notes', 'Grammar, RC, and vocabulary notes for MBA.', 'https://www.geeksforgeeks.org/english-grammar-for-competitive-exams/'],

      // MCA
      [mcaId, 'MCA PGCET Official Syllabus 2026', 'Syllabus', 'PDF', 'Detailed MCA syllabus including Mathematics and Computer sections.', 'https://kea.kar.nic.in/pgcet2026/syllabus_mca.pdf'],
      [mcaId, 'Computer Awareness & Architecture Classes', 'Computer Science', 'Video', 'Video series on hardware, OS, and computer fundamentals.', 'https://www.youtube.com/watch?v=KUa2TORY23Q'],
      [mcaId, 'Discrete Mathematics - NPTEL Course', 'Mathematics', 'Video', 'In-depth mathematical concepts for MCA entrance.', 'https://www.youtube.com/watch?v=Z03yYqARnms'],
      [mcaId, 'MCA Previous Year Solved Papers', 'Previous Papers', 'PDF', 'KEA archive of original MCA PGCET question papers.', 'https://kea.kar.nic.in/pgcet/mca_papers.zip'],
      [mcaId, 'Computer Science IQ Quiz', 'Mock Test', 'Practice_Test', 'Interactive test on data structures, OS, and C programming.', 'https://www.indiabix.com/online-test/computer-science-test/'],
      [mcaId, 'General Awareness for MCA Notes', 'General Knowledge', 'Notes', 'Important current affairs and static GK for MCA.', 'https://www.gktoday.in/current-affairs/'],

      // M.Tech
      [mtechId, 'M.Tech PGCET Syllabus - All Branches', 'Syllabus', 'PDF', 'Common and branch-specific syllabus for M.Tech/ME.', 'https://kea.kar.nic.in/pgcet2026/syllabus_mtech.pdf'],
      [mtechId, 'Engineering Mathematics - NPTEL Video Series', 'Engineering Maths', 'Video', 'Advanced calculus and linear algebra for M.Tech.', 'https://www.youtube.com/watch?v=Me4TZN4qRuo'],
      [mtechId, 'Technical Subject Masterclass (GATE/PGCET)', 'Technical', 'Video', 'High-level technical lectures for competitive engineering exams.', 'https://www.youtube.com/watch?v=cTIBsZFk_ck'],
      [mtechId, 'M.Tech Previous Year Papers Archive', 'Previous Papers', 'PDF', 'Branch-wise question papers from last 5 years.', 'https://kea.kar.nic.in/pgcet/mtech_papers.zip'],
      [mtechId, 'Engineering Math Mock Challenge', 'Mock Test', 'Practice_Test', 'Challenge your math skills with this PGCET-style quiz.', 'https://www.indiabix.com/online-test/engineering-mathematics-test/'],
      [mtechId, 'General Awareness & Verbal Ability Notes', 'General Aptitude', 'Notes', 'Quick revision notes for the common aptitude section.', 'https://www.fresherslive.com/online-test/general-awareness-test/questions-and-answers'],
    ];

    const insertText = 'INSERT INTO study_materials (exam_id, title, subject, type, description, url) VALUES ' +
      materials.map((_,i)=>`($${i*6+1},$${i*6+2},$${i*6+3},$${i*6+4},$${i*6+5},$${i*6+6})`).join(',') + ' RETURNING id';

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
