#!/usr/bin/env node
const fetch = global.fetch || require('node-fetch');

const BASE = process.env.API_BASE || 'http://localhost:3008';

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@govportal.com', password: 'Admin@123' }),
  });
  if (!res.ok) throw new Error('Login failed: ' + res.status);
  const sc = res.headers.get('set-cookie');
  if (!sc) throw new Error('No set-cookie received');
  const cookie = sc.split(';')[0];
  return cookie;
}

async function createExam(cookie, exam) {
  const res = await fetch(`${BASE}/api/admin/exams/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(exam),
  });
  if (!res.ok) throw new Error('Create exam failed: ' + (await res.text()));
  return res.json();
}

async function createMaterial(cookie, material) {
  const res = await fetch(`${BASE}/api/admin/study-materials/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(material),
  });
  if (!res.ok) throw new Error('Create material failed: ' + (await res.text()));
  return res.json();
}

async function main(){
  try{
    const cookie = await login();
    console.log('Logged in, cookie:', cookie);

    const exams = [
      { name: 'Karnataka PGCET 2026 - MBA', fullName: 'Post Graduate Common Entrance Test 2026 (MBA)', description: 'Entrance test for admission to MBA programs in Karnataka. Managed by KEA.', examDate:'2026-06-15', applicationStartDate:'2026-04-01', applicationEndDate:'2026-05-15', applyLink:'https://kea.kar.nic.in/pgcet2026', eligibility:"Any Bachelor's degree with 50% aggregate (45% for SC/ST/OBC-I).", applicationGuide:'Step 1: Visit KEA portal.\nStep 2: Register for PGCET MBA.\nStep 3: Fill details and pay fee.', officialWebsite:'https://kea.kar.nic.in' },
      { name: 'Karnataka PGCET 2026 - MCA', fullName: 'Post Graduate Common Entrance Test 2026 (MCA)', description: 'Entrance test for admission to MCA programs in Karnataka. Managed by KEA.', examDate:'2026-06-15', applicationStartDate:'2026-04-01', applicationEndDate:'2026-05-15', applyLink:'https://kea.kar.nic.in/pgcet2026', eligibility:'BCA/B.Sc (CS/IT) or any degree with Maths with 50% aggregate.', applicationGuide:'Step 1: Visit KEA portal.\nStep 2: Register for PGCET MCA.\nStep 3: Fill details and pay fee.', officialWebsite:'https://kea.kar.nic.in' },
      { name: 'Karnataka PGCET 2026 - M.Tech', fullName: 'Post Graduate Common Entrance Test 2026 (M.Tech/M.E/M.Arch)', description: 'Entrance test for admission to M.Tech and other technical PG programs in Karnataka.', examDate:'2026-06-15', applicationStartDate:'2026-04-01', applicationEndDate:'2026-05-15', applyLink:'https://kea.kar.nic.in/pgcet2026', eligibility:'B.E/B.Tech in relevant branch with 50% aggregate.', applicationGuide:'Step 1: Visit KEA portal.\nStep 2: Register for PGCET M.Tech.\nStep 3: Fill details and pay fee.', officialWebsite:'https://kea.kar.nic.in' }
    ];

    const createdExams = [];
    for(const e of exams){
      const created = await createExam(cookie, e);
      console.log('Created exam id', created.id);
      createdExams.push(created);
    }

    const materials = [];
    const mbaId = createdExams[0].id;
    const mcaId = createdExams[1].id;
    const mtechId = createdExams[2].id;

    materials.push({ examId:mbaId, title:'MBA PGCET Official Syllabus 2026', subject:'Syllabus', type:'PDF', description:'Comprehensive syllabus and exam pattern for MBA.', url:'https://kea.kar.nic.in/pgcet2026/syllabus_mba.pdf' });
    materials.push({ examId:mbaId, title:'Quantitative Aptitude Video Classes', subject:'Mathematics', type:'Video', description:'Complete video playlist for MBA aptitude preparation.', url:'https://www.youtube.com/watch?v=K-HMk9dw8Qk' });
    materials.push({ examId:mbaId, title:'MBA Previous Year Papers', subject:'Previous Papers', type:'PDF', description:'Consolidated archive of solved MBA PGCET papers.', url:'https://kea.kar.nic.in/pgcet/mba_papers.zip' });

    materials.push({ examId:mcaId, title:'MCA PGCET Official Syllabus 2026', subject:'Syllabus', type:'PDF', description:'Detailed MCA syllabus including Mathematics and Computer sections.', url:'https://kea.kar.nic.in/pgcet2026/syllabus_mca.pdf' });

    materials.push({ examId:mtechId, title:'M.Tech PGCET Syllabus - All Branches', subject:'Syllabus', type:'PDF', description:'Common and branch-specific syllabus for M.Tech/ME.', url:'https://kea.kar.nic.in/pgcet2026/syllabus_mtech.pdf' });

    for(const m of materials){
      const cm = await createMaterial(cookie, m);
      console.log('Created material', cm.id, cm.title || m.title);
    }

    const check = await fetch(`${BASE}/api/study-materials`);
    console.log('study-materials status', check.status);
    console.log(await check.json());

  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

main();
