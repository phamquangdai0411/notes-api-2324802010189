require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('../src/models/note');

async function measure(label, hint) {
  const result = await Note.find({ tags: 'docker' }).hint(hint).explain('executionStats');
  const s = result.executionStats;
  return {
    'Cach truy van': label,
    'Doc tra ve': s.nReturned,
    'Doc da duyet': s.totalDocsExamined,
    'Key da duyet': s.totalKeysExamined,
    'Thoi gian (ms)': s.executionTimeMillis
  };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await Note.syncIndexes();

  const scan = await measure('Collection scan ($natural)', { $natural: 1 });
  const index = await measure('Index scan (tags_1)', { tags: 1 });

  console.table([scan, index]);
  console.log(
    `Index giam so doc phai duyet ${(scan['Doc da duyet'] / index['Doc da duyet']).toFixed(1)} lan`
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});