/**
 * purge_alquiler.ts
 * Borra TODAS las propiedades con operation='alquiler' de MongoDB Atlas.
 * Ejecutar con: npx tsx scripts/purge_alquiler.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI =
  'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

async function main() {
  console.log('Conectando a MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado.');

  const collection = mongoose.connection.collection('properties');

  const count = await collection.countDocuments({ operation: 'alquiler' });
  console.log(`Propiedades en alquiler encontradas: ${count}`);

  if (count === 0) {
    console.log('Nada que borrar.');
    await mongoose.disconnect();
    return;
  }

  const result = await collection.deleteMany({ operation: 'alquiler' });
  console.log(`Borradas: ${result.deletedCount} propiedades de alquiler.`);

  const remaining = await collection.countDocuments({});
  console.log(`Propiedades restantes en DB (solo venta): ${remaining}`);

  await mongoose.disconnect();
  console.log('Listo.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
