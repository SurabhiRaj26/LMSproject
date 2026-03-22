const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lesson = require('./models/Lesson');

dotenv.config();

// Fixes for broken/invalid YouTube video IDs
const fixes = [
  // Course 4 - JavaScript: typo (MFOUg → MFNFg) — already applied, included for safety
  { old: 'PkZNo7MFOUg', new: 'PkZNo7MFNFg', desc: 'JavaScript Full Course for Beginners (FreeCodeCamp)' },

  // Course 4 - JavaScript: Functions and Scope lesson was dead
  { old: 'gigiNQvX5UI', new: 'Liv6eeb1VfE', desc: 'JavaScript Functions & Scope' },

  // Course 4 - JavaScript: DOM Manipulation lesson was dead
  { old: 'y17RuWUpzLI', new: '5fb2aPlgoys', desc: 'JavaScript DOM Manipulation Crash Course' },

  // Course 5 - Python: Automation lesson was dead
  { old: 'PXMJBEBiEYM', new: 'H2EJuAcrZYU', desc: 'Automate with Python – Full Course (FreeCodeCamp)' },

  // Course 6 - Data Science: Pandas lesson was dead
  { old: 'zyGJVix52DQ', new: 'gtjxAH8uaP0', desc: 'Pandas & Python for Data Analysis (FreeCodeCamp 2023)' },

  // Course 6 - Data Science: Matplotlib lesson was dead
  { old: '3Xc3CA655Ls', new: 'vmEHCJofslg', desc: 'Matplotlib Crash Course' },
];

const fix = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  for (const f of fixes) {
    const result = await Lesson.updateOne(
      { youtubeId: f.old },
      { $set: { youtubeId: f.new } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Fixed: ${f.old} → ${f.new}  [${f.desc}]`);
    } else if (result.matchedCount === 0) {
      console.log(`ℹ️  Not found (already fixed?): ${f.old}`);
    } else {
      console.log(`⚠️  Matched but not modified: ${f.old}`);
    }
  }

  console.log('\n🎉 All video ID fixes applied!');
  mongoose.disconnect();
};

fix().catch((err) => {
  console.error(err);
  process.exit(1);
});
