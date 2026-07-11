const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Job = require('./models/Job');

// Realistic vacancies per job title
const VACANCIES_MAP = {
  'Frontend Developer': 5,
  'Backend Engineer': 4,
  'Data Analyst': 6,
  'Cybersecurity Analyst': 2,
  'DevOps Engineer': 3,
  'UI/UX Designer': 3,
  'Machine Learning Engineer': 2,
  'Full Stack Developer': 7,
  'Mobile App Developer (React Native)': 4,
  'Cloud Solutions Architect': 2,
  'QA Engineer': 5,
  'Blockchain Developer': 2,
  'Data Engineer': 3,
  'Site Reliability Engineer': 2,
  'Product Manager': 2,
  'Embedded Systems Engineer': 3,
  'Business Intelligence Developer': 4,
  'Android Developer': 4,
  'Network Engineer': 3,
  'Technical Content Writer': 6,
  'Logistics Coordinator': 8,
  'Staff Nurse': 15,
  'High School Mathematics Teacher': 10,
  'Executive Chef': 1,
  'Civil Site Engineer': 6,
  'Bank Branch Manager': 3,
  'Digital Marketing Manager': 4,
  'Sales Executive': 12,
  'HR Recruiter': 5,
  'Graphic Designer': 4,
  'Pharmacist': 7,
  'Financial Analyst': 3,
  'Event Coordinator': 5,
  'Legal Associate': 3,
  'Physical Therapist': 6,
  'Content Writer': 8,
  'Operations Manager': 2,
  'School Principal': 1,
  'Real Estate Sales Agent': 10,
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');
  console.log('✅ Connected');

  const jobs = await Job.find({});
  let updated = 0;

  for (const job of jobs) {
    const vacancies = VACANCIES_MAP[job.title] ?? Math.floor(Math.random() * 5) + 1;
    await Job.findByIdAndUpdate(job._id, { vacancies });
    updated++;
    console.log(`  ✓ ${job.title} → ${vacancies} vacancies`);
  }

  console.log(`\n✅ Updated ${updated} jobs with vacancies`);
  await mongoose.disconnect();
}

run().catch(console.error);
