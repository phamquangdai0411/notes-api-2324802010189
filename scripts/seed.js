require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('../src/models/note');

const TAGS = ['docker', 'mongodb', 'cloud', 'nodejs', 'api', 'linux', 'devops', 'storage'];

function randomTags() {
  const count = 1 + Math.floor(Math.random() * 3);
  return [...TAGS].sort(() => Math.random() - 0.5).slice(0, count);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await Note.deleteMany({ owner: 'seed' });
  const docs = Array.from({ length: 2000 }, (_, i) => ({
    title: `Ghi chu so ${i + 1}`,
    content: `Noi dung mau cho ghi chu ${i + 1}`,
    tags: randomTags(),
    owner: 'seed'
  }));
  await Note.insertMany(docs);
  const total = await Note.countDocuments();
  console.log(`Da tao ${docs.length} ghi chu. Tong so document: ${total}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});