import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI || '';
mongoose.connect(uri).then(async () => {
  const db = mongoose.connection.db!;
  const total = await db.collection('properties').countDocuments();
  console.log('TOTAL:', total);
  const ops = await db.collection('properties').aggregate([{$group: {_id: '$operation', count: {$sum: 1}}}]).toArray();
  console.log('ops:', ops.map((o: {_id: string; count: number}) => o._id + ':' + o.count).join(' | '));
  const top = await db.collection('properties').aggregate([{$group: {_id: '$ciudad', count: {$sum: 1}}}, {$sort: {count: -1}}, {$limit: 8}]).toArray();
  top.forEach((c: {_id: string; count: number}) => console.log('  ' + c._id + ': ' + c.count));
  await mongoose.disconnect();
});
