/**
 * Asigna imágenes únicas a cada propiedad usando bulkWrite.
 * Imágenes contextuales según tipo + ciudad.
 */
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

const PropertySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String, type: String, ciudad: String, images: [String],
}, { timestamps: true, strict: false });

const Property = mongoose.models?.Property || mongoose.model('Property', PropertySchema);

// Fotos por contexto: tipo × ciudad
const POOLS: Record<string, string[]> = {
  // Departamentos urbanos
  'depto-urban': [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
    'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800&q=80',
    'https://images.unsplash.com/photo-1533779183510-8086a4e9e190?w=800&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
  ],
  // Departamentos con vista/turísticos (Bariloche, Mar del Plata)
  'depto-turistic': [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  ],
  // Casas urbanas/suburbanas
  'casa-urban': [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=800&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
    'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80',
    'https://images.unsplash.com/photo-1598228723793-57e16985abb8?w=800&q=80',
    'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
    'https://images.unsplash.com/photo-1509660933844-6910e12765a0?w=800&q=80',
    'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80',
    'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800&q=80',
  ],
  // Casas con naturaleza (Bariloche, Sierras, Mendoza)
  'casa-nature': [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1596204976717-1a9ff47f74ef?w=800&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    'https://images.unsplash.com/photo-1505832688652-3f40261cee10?w=800&q=80',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
  ],
  // Terrenos / lotes
  'terreno': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?w=800&q=80',
  ],
};

// Ciudades con naturaleza/sierras
const NATURE_CITIES = new Set(['Bariloche', 'Villa Carlos Paz', 'Mendoza', 'Salta', 'Merlo', 'Alta Gracia', 'Ushuaia', 'Neuquén']);

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getPool(type: string, ciudad: string): string[] {
  const t = type?.toLowerCase() || '';
  const isNature = NATURE_CITIES.has(ciudad);

  if (t === 'terreno' || t === 'lote') return POOLS.terreno;
  if (t.includes('casa') || t.includes('chalet') || t.includes('cabaña') || t.includes('finca')) {
    return isNature ? POOLS['casa-nature'] : POOLS['casa-urban'];
  }
  // departamento, PH, monoambiente, apart, etc.
  return isNature ? POOLS['depto-turistic'] : POOLS['depto-urban'];
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  const props = await (Property as any).find({}).select('slug type ciudad').lean();
  console.log(`Processing ${props.length} properties...`);

  const BATCH = 500;
  let total = 0;

  for (let i = 0; i < props.length; i += BATCH) {
    const batch = props.slice(i, i + BATCH);
    const ops = batch.map((p: any) => {
      const pool = getPool(p.type, p.ciudad);
      const img = pool[hashStr(p.slug) % pool.length];
      return {
        updateOne: {
          filter: { slug: p.slug },
          update: { $set: { images: [img] } },
        },
      };
    });
    await (Property as any).bulkWrite(ops, { ordered: false });
    total += batch.length;
    console.log(`Updated ${total}/${props.length}`);
  }

  console.log('Done!');
  await mongoose.disconnect();
}

run().catch(console.error);
