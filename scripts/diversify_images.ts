/**
 * Asigna imágenes únicas a cada propiedad según su tipo.
 * Usa una pool grande de fotos Unsplash para evitar repetición.
 */
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

const PropertySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String, type: String, images: [String],
}, { timestamps: true, strict: false });

const Property = mongoose.models?.Property || mongoose.model('Property', PropertySchema);

// Pool amplia de fotos por tipo (20+ por categoría, todas distintas)
const IMGS: Record<string, string[]> = {
  departamento: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
    'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800&q=80',
    'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80',
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
    'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1533779183510-8086a4e9e190?w=800&q=80',
  ],
  casa: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
    'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=800&q=80',
    'https://images.unsplash.com/photo-1598228723793-57e16985abb8?w=800&q=80',
    'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
    'https://images.unsplash.com/photo-1509660933844-6910e12765a0?w=800&q=80',
    'https://images.unsplash.com/photo-1596204976717-1a9ff47f74ef?w=800&q=80',
    'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
  ],
  terreno: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  ],
};

// Genera un hash numérico simple de un string
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickImage(slug: string, type: string): string {
  const pool = IMGS[type?.toLowerCase()] || IMGS.default;
  return pool[hashStr(slug) % pool.length];
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  const props = await Property.find({}).select('slug type images').lean();
  console.log(`Total properties: ${props.length}`);

  let updated = 0;
  for (const p of props) {
    const newImg = pickImage(p.slug, p.type);
    // Only update if it currently has a repeated/bad image or single image
    await Property.updateOne({ slug: p.slug }, { $set: { images: [newImg] } });
    updated++;
  }

  console.log(`Updated images for ${updated} properties`);
  await mongoose.disconnect();
}

run().catch(console.error);
