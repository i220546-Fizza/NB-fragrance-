const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const { buildBottleSVG } = require('./svgGenerator');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'products');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Color palette per fragrance family (liquid) — cohesive luxury scheme:
// midnight navy / champagne gold / rose champagne / ivory / cocoa, with the
// liquid tint carrying each family's character.
// ---------------------------------------------------------------------------
const FAMILY_LIQUID = {
  Woody: { liquidColor: '#8B5E34', liquidColor2: '#3A2C25' },
  Floral: { liquidColor: '#E8B4B8', liquidColor2: '#C97C82' },
  Citrus: { liquidColor: '#F3D98B', liquidColor2: '#D8B65A' },
  Oud: { liquidColor: '#4A2F1E', liquidColor2: '#241209' },
  Fresh: { liquidColor: '#BFE8DE', liquidColor2: '#D8C27A' },
  Musky: { liquidColor: '#A68A72', liquidColor2: '#7C6552' },
  Sweet: { liquidColor: '#F2C6C0', liquidColor2: '#DBA85E' },
  Oriental: { liquidColor: '#7A1F2B', liquidColor2: '#B8862E' },
};

const FAMILY_ACCENT = {
  Oud: { accentColor: '#B8925A', accentColor2: '#7A5A32' },
  Oriental: { accentColor: '#B8925A', accentColor2: '#7A5A32' },
  Floral: { accentColor: '#D8B09A', accentColor2: '#B8876B' },
  Sweet: { accentColor: '#D8B09A', accentColor2: '#B8876B' },
  Woody: { accentColor: '#D6B77C', accentColor2: '#C9A96E' },
  Musky: { accentColor: '#D6B77C', accentColor2: '#C9A96E' },
  Citrus: { accentColor: '#D6B77C', accentColor2: '#C9A96E' },
  Fresh: { accentColor: '#D6B77C', accentColor2: '#C9A96E' },
};

// ---------------------------------------------------------------------------
// Review pools
// ---------------------------------------------------------------------------
const REVIEWER_NAMES = [
  'Ayesha Khan', 'Bilal Ahmed', 'Fatima Raza', 'Hamza Sheikh', 'Sara Malik',
  'Usman Tariq', 'Zainab Iqbal', 'Omar Farooq', 'Hira Siddiqui', 'Ali Hassan',
  'Mahnoor Javed', 'Danish Qureshi', 'Amna Yousuf', 'Rizwan Butt', 'Noor Fatima',
  'Faisal Chaudhry', 'Sana Aslam', 'Imran Baig', 'Laiba Anwar', 'Kashif Mehmood',
];

const REVIEW_TEMPLATES = [
  'An absolutely stunning fragrance — the opening is bright and the drydown lasts for hours. Compliments every time I wear it.',
  'This has become my signature scent. The sillage is perfect for the office without being overwhelming.',
  'Beautiful bottle and even better juice. The base notes really shine after a few hours on skin.',
  'Exactly what I expected from NB Classic Scents — refined, long-lasting, and worth every rupee.',
  'The projection is strong for the first two hours then settles into a lovely warm skin scent.',
  'Gifted this to my husband and he loved it. Packaging feels genuinely luxury.',
  'One spray is enough to last the whole day. The heart notes bloom beautifully in the evening.',
  'A bit strong on first application but settles into something gorgeous within thirty minutes.',
  'My go-to for date nights. Sophisticated, warm, and memorable.',
  'Great value for a designer-quality fragrance. Will definitely repurchase.',
  'The longevity is incredible — still noticeable after twelve hours.',
  'Elegant and unique, not something you smell on everyone else. Highly recommend.',
];

function pickReviews(rng, count) {
  const reviews = [];
  for (let i = 0; i < count; i += 1) {
    const rating = 3 + Math.floor(rng() * 3); // 3,4,5
    const name = REVIEWER_NAMES[Math.floor(rng() * REVIEWER_NAMES.length)];
    const comment = REVIEW_TEMPLATES[Math.floor(rng() * REVIEW_TEMPLATES.length)];
    reviews.push({
      user: new mongoose.Types.ObjectId(),
      name,
      rating,
      comment,
      createdAt: new Date(Date.now() - Math.floor(rng() * 60) * 24 * 60 * 60 * 1000),
    });
  }
  return reviews;
}

// simple deterministic pseudo-random generator so re-running the seed is stable
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Product catalog blueprint — 20 products across 4 collections x 5 each
// ---------------------------------------------------------------------------
const BLUEPRINTS = [
  // ---- Eclipse ----
  {
    name: 'Eclipse Noir Oud', collectionName: 'Eclipse', gender: 'Men', category: 'Premium',
    fragranceFamily: 'Oud', silhouette: 'tapered', size: '50ml', price: 15500, stock: 40,
    featured: true, bestseller: true, isNewArrival: false,
    topNotes: ['Saffron', 'Bergamot', 'Pink Pepper'], heartNotes: ['Oud Wood', 'Rose', 'Leather'],
    baseNotes: ['Amber', 'Sandalwood', 'Musk'], longevity: 'Very Long Lasting', sillage: 'Enormous',
    occasion: ['Night', 'Formal', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'A commanding oud composition opening with radiant saffron and pink pepper before settling into deep oud wood, rose and smoky leather, anchored by amber and sandalwood for an unforgettable trail.',
  },
  {
    name: 'Eclipse Aurum', collectionName: 'Eclipse', gender: 'Women', category: 'Women',
    fragranceFamily: 'Floral', silhouette: 'rounded-flacon', size: '50ml', price: 8200, stock: 25,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Bergamot', 'Pear', 'Pink Pepper'], heartNotes: ['Jasmine', 'Rose', 'Peony'],
    baseNotes: ['Musk', 'Amber', 'Sandalwood'], longevity: 'Long Lasting', sillage: 'Moderate',
    occasion: ['Day', 'Office', 'Casual'], season: ['Spring', 'Summer'],
    description: 'A luminous floral bouquet of jasmine, rose and peony wrapped in a soft musk and sandalwood base — elegant enough for the boardroom and warm enough for evening.',
  },
  {
    name: 'Eclipse Velvet Musk', collectionName: 'Eclipse', gender: 'Unisex', category: 'Unisex',
    fragranceFamily: 'Musky', silhouette: 'faceted', size: '100ml', price: 9800, stock: 4,
    featured: false, bestseller: false, isNewArrival: true,
    topNotes: ['Mandarin', 'Cardamom', 'Pink Pepper'], heartNotes: ['Iris', 'Violet', 'Tonka Bean'],
    baseNotes: ['White Musk', 'Cedarwood', 'Vanilla'], longevity: 'Long Lasting', sillage: 'Strong',
    occasion: ['Night', 'Casual', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'A velvety skin-scent built around creamy white musk, iris and tonka bean — sensual, close and quietly magnetic.',
  },
  {
    name: 'Eclipse Citron Royale', collectionName: 'Eclipse', gender: 'Men', category: 'Men',
    fragranceFamily: 'Citrus', silhouette: 'tall-rectangular', size: '100ml', price: 6200, stock: 55,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Sicilian Lemon', 'Bergamot', 'Grapefruit'], heartNotes: ['Neroli', 'Rosemary'],
    baseNotes: ['Vetiver', 'Musk', 'Cedarwood'], longevity: 'Moderate', sillage: 'Moderate',
    occasion: ['Day', 'Office', 'Casual'], season: ['Spring', 'Summer'],
    description: 'A crisp burst of Sicilian lemon and grapefruit over aromatic neroli, finished with a clean vetiver and cedarwood base for effortless everyday polish.',
  },
  {
    name: 'Eclipse Garnet Oriental', collectionName: 'Eclipse', gender: 'Women', category: 'Premium',
    fragranceFamily: 'Oriental', silhouette: 'rounded-flacon', size: '50ml', price: 13400, stock: 18,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Blood Orange', 'Cinnamon', 'Cardamom'], heartNotes: ['Rose', 'Saffron', 'Orchid'],
    baseNotes: ['Amber', 'Patchouli', 'Vanilla'], longevity: 'Very Long Lasting', sillage: 'Strong',
    occasion: ['Night', 'Formal'], season: ['Fall', 'Winter'],
    description: 'A rich garnet-toned oriental of blood orange and cinnamon over rose and saffron, deepened by amber, patchouli and vanilla for a truly opulent finish.',
  },

  // ---- Signature ----
  {
    name: 'Signature Bergamot Homme', collectionName: 'Signature', gender: 'Men', category: 'Men',
    fragranceFamily: 'Fresh', silhouette: 'tall-rectangular', size: '100ml', price: 5400, stock: 60,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Bergamot', 'Mint', 'Sea Notes'], heartNotes: ['Geranium', 'Lavender'],
    baseNotes: ['Ambroxan', 'Cedarwood', 'Musk'], longevity: 'Moderate', sillage: 'Moderate',
    occasion: ['Day', 'Office', 'Casual'], season: ['Spring', 'Summer'],
    description: 'A clean, confident fresh fragrance of bergamot and sea notes with an aromatic lavender heart, grounded by ambroxan and cedarwood.',
  },
  {
    name: 'Signature Rose Élan', collectionName: 'Signature', gender: 'Women', category: 'Women',
    fragranceFamily: 'Floral', silhouette: 'rounded-flacon', size: '50ml', price: 7600, stock: 30,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Raspberry', 'Bergamot', 'Pear'], heartNotes: ['Rose', 'Lily of the Valley', 'Peony'],
    baseNotes: ['Musk', 'Sandalwood', 'Amber'], longevity: 'Long Lasting', sillage: 'Moderate',
    occasion: ['Day', 'Date Night', 'Casual'], season: ['Spring', 'Summer'],
    description: 'A graceful rose fragrance brightened with raspberry and bergamot, resting on a soft musk and sandalwood base.',
  },
  {
    name: 'Signature Sandalwood Reserve', collectionName: 'Signature', gender: 'Unisex', category: 'Unisex',
    fragranceFamily: 'Woody', silhouette: 'faceted', size: '100ml', price: 11200, stock: 22,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Bergamot', 'Cardamom', 'Pink Pepper'], heartNotes: ['Cedarwood', 'Iris', 'Geranium'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'], longevity: 'Long Lasting', sillage: 'Strong',
    occasion: ['Office', 'Formal', 'Casual'], season: ['Fall', 'Winter'],
    description: 'Creamy sandalwood at its finest — layered with cedarwood, iris and a warm amber-musk base for a refined, unisex signature.',
  },
  {
    name: 'Signature Vanille Douce', collectionName: 'Signature', gender: 'Women', category: 'Gift Sets',
    fragranceFamily: 'Sweet', silhouette: 'tall-rectangular', size: '50ml', price: 6800, stock: 3,
    featured: false, bestseller: false, isNewArrival: true,
    topNotes: ['Pear', 'Pink Pepper', 'Bergamot'], heartNotes: ['Jasmine', 'Praline', 'Orchid'],
    baseNotes: ['Vanilla', 'Tonka Bean', 'Musk'], longevity: 'Long Lasting', sillage: 'Moderate',
    occasion: ['Casual', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'A gourmand delight of pear and praline over jasmine, finished with a plush vanilla and tonka bean base — comforting and irresistibly sweet.',
  },
  {
    name: 'Signature Oud Intense', collectionName: 'Signature', gender: 'Men', category: 'Premium',
    fragranceFamily: 'Oud', silhouette: 'tapered', size: '100ml', price: 16800, stock: 12,
    featured: false, bestseller: true, isNewArrival: false,
    topNotes: ['Cardamom', 'Saffron', 'Bergamot'], heartNotes: ['Oud Wood', 'Rose', 'Cedarwood'],
    baseNotes: ['Patchouli', 'Amber', 'Leather'], longevity: 'Very Long Lasting', sillage: 'Enormous',
    occasion: ['Night', 'Formal'], season: ['Fall', 'Winter'],
    description: 'An intense, resinous oud built on smoky patchouli and leather, spiced with cardamom and saffron for maximum presence.',
  },

  // ---- Midnight ----
  {
    name: 'Midnight Saffron', collectionName: 'Midnight', gender: 'Men', category: 'Premium',
    fragranceFamily: 'Oriental', silhouette: 'tapered', size: '50ml', price: 17200, stock: 9,
    featured: true, bestseller: false, isNewArrival: false,
    topNotes: ['Saffron', 'Bergamot', 'Pink Pepper'], heartNotes: ['Rose', 'Oud Wood', 'Patchouli'],
    baseNotes: ['Amber', 'Leather', 'Vanilla'], longevity: 'Very Long Lasting', sillage: 'Enormous',
    occasion: ['Night', 'Formal', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'A dramatic evening fragrance of saffron and rose over smoky oud, wrapped in amber, leather and vanilla for an unforgettable finish.',
  },
  {
    name: 'Midnight Jasmine Noir', collectionName: 'Midnight', gender: 'Women', category: 'Women',
    fragranceFamily: 'Floral', silhouette: 'rounded-flacon', size: '50ml', price: 9400, stock: 28,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Black Currant', 'Bergamot', 'Mandarin'], heartNotes: ['Jasmine', 'Tuberose', 'Orchid'],
    baseNotes: ['Musk', 'Sandalwood', 'Amber'], longevity: 'Long Lasting', sillage: 'Strong',
    occasion: ['Night', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'An intoxicating night-blooming jasmine and tuberose heart over dark musk and amber, for an alluring nocturnal signature.',
  },
  {
    name: 'Midnight Amber Woods', collectionName: 'Midnight', gender: 'Unisex', category: 'Unisex',
    fragranceFamily: 'Woody', silhouette: 'faceted', size: '100ml', price: 12600, stock: 20,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Cardamom', 'Cinnamon', 'Bergamot'], heartNotes: ['Cedarwood', 'Amber', 'Iris'],
    baseNotes: ['Sandalwood', 'Vanilla', 'Musk'], longevity: 'Long Lasting', sillage: 'Strong',
    occasion: ['Night', 'Casual', 'Office'], season: ['Fall', 'Winter'],
    description: 'Warm amber and cedarwood meet spiced cardamom and cinnamon, settling into a smooth sandalwood-vanilla base.',
  },
  {
    name: 'Midnight Musk Eclipse', collectionName: 'Midnight', gender: 'Men', category: 'Men',
    fragranceFamily: 'Musky', silhouette: 'tall-rectangular', size: '100ml', price: 7100, stock: 45,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Lavender', 'Bergamot', 'Mandarin'], heartNotes: ['Geranium', 'Nutmeg', 'Cinnamon'],
    baseNotes: ['Musk', 'Cedarwood', 'Amber'], longevity: 'Long Lasting', sillage: 'Strong',
    occasion: ['Night', 'Casual'], season: ['Fall', 'Winter'],
    description: 'A dark, warm musk fragrance layered with lavender and nutmeg over cedarwood and amber — quietly powerful.',
  },
  {
    name: 'Midnight Citrus Frost', collectionName: 'Midnight', gender: 'Women', category: 'Women',
    fragranceFamily: 'Citrus', silhouette: 'rounded-flacon', size: '50ml', price: 5900, stock: 4,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Mandarin', 'Yuzu', 'Grapefruit'], heartNotes: ['Freesia', 'Water Lily', 'Jasmine'],
    baseNotes: ['White Musk', 'Cedarwood', 'Amber'], longevity: 'Moderate', sillage: 'Moderate',
    occasion: ['Day', 'Casual'], season: ['Spring', 'Summer'],
    description: 'A frosted citrus fragrance of mandarin and yuzu over delicate freesia and water lily, finished with soft white musk.',
  },

  // ---- Essence ----
  {
    name: 'Essence of Bloom', collectionName: 'Essence', gender: 'Women', category: 'Women',
    fragranceFamily: 'Floral', silhouette: 'rounded-flacon', size: '50ml', price: 6400, stock: 50,
    featured: false, bestseller: false, isNewArrival: true,
    topNotes: ['Peony', 'Pear', 'Bergamot'], heartNotes: ['Rose', 'Freesia', 'Lily of the Valley'],
    baseNotes: ['Musk', 'Amber', 'Sandalwood'], longevity: 'Moderate', sillage: 'Moderate',
    occasion: ['Day', 'Casual', 'Office'], season: ['Spring', 'Summer'],
    description: 'A fresh spring bouquet of peony, pear and rose that blooms softly into musk and amber — light, joyful and easy to wear daily.',
  },
  {
    name: 'Essence Woodland', collectionName: 'Essence', gender: 'Men', category: 'Men',
    fragranceFamily: 'Woody', silhouette: 'tall-rectangular', size: '100ml', price: 8900, stock: 33,
    featured: true, bestseller: false, isNewArrival: false,
    topNotes: ['Bergamot', 'Green Apple', 'Cardamom'], heartNotes: ['Cedarwood', 'Lavender', 'Geranium'],
    baseNotes: ['Vetiver', 'Sandalwood', 'Musk'], longevity: 'Long Lasting', sillage: 'Moderate',
    occasion: ['Office', 'Casual'], season: ['Fall', 'Spring'],
    description: 'An earthy walk through cedarwood and vetiver, opened with bergamot and green apple for a grounded, versatile everyday scent.',
  },
  {
    name: 'Essence Honey Musk', collectionName: 'Essence', gender: 'Unisex', category: 'Gift Sets',
    fragranceFamily: 'Musky', silhouette: 'faceted', size: '50ml', price: 7300, stock: 26,
    featured: false, bestseller: false, isNewArrival: false,
    topNotes: ['Mandarin', 'Cardamom', 'Bergamot'], heartNotes: ['Honey', 'Orris', 'Jasmine'],
    baseNotes: ['White Musk', 'Tonka Bean', 'Sandalwood'], longevity: 'Long Lasting', sillage: 'Moderate',
    occasion: ['Casual', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'A warm honeyed musk with a soft orris heart and tonka bean base — comforting, skin-close and effortlessly charming.',
  },
  {
    name: 'Essence Fresh Aqua', collectionName: 'Essence', gender: 'Unisex', category: 'Unisex',
    fragranceFamily: 'Fresh', silhouette: 'tall-rectangular', size: '100ml', price: 4500, stock: 38,
    featured: false, bestseller: true, isNewArrival: false,
    topNotes: ['Sea Notes', 'Bergamot', 'Mint'], heartNotes: ['Water Lily', 'Sage'],
    baseNotes: ['Ambroxan', 'Musk'], longevity: 'Moderate', sillage: 'Moderate',
    occasion: ['Day', 'Casual', 'Office'], season: ['Spring', 'Summer'],
    description: 'An invigorating aquatic-fresh blend of sea notes and mint over a clean water lily heart, finished with soft ambroxan musk.',
  },
  {
    name: 'Essence Gold Oud', collectionName: 'Essence', gender: 'Men', category: 'Premium',
    fragranceFamily: 'Oud', silhouette: 'tapered', size: '100ml', price: 18500, stock: 15,
    featured: true, bestseller: true, isNewArrival: true,
    topNotes: ['Saffron', 'Pink Pepper', 'Bergamot'], heartNotes: ['Oud Wood', 'Rose', 'Patchouli'],
    baseNotes: ['Amber', 'Sandalwood', 'Musk'], longevity: 'Very Long Lasting', sillage: 'Enormous',
    occasion: ['Night', 'Formal', 'Date Night'], season: ['Fall', 'Winter'],
    description: 'The house flagship — a golden oud of remarkable depth, layering saffron and rose over patchouli, amber and sandalwood for a truly signature presence.',
  },
];

function buildImagesForProduct(blueprint, index, rng) {
  const familyLiquid = FAMILY_LIQUID[blueprint.fragranceFamily];
  const familyAccent = FAMILY_ACCENT[blueprint.fragranceFamily];
  const isFeatured = blueprint.featured;

  const baseParams = {
    silhouette: blueprint.silhouette,
    ...familyLiquid,
    ...familyAccent,
    labelText: 'N.B.',
    subLabel: blueprint.fragranceFamily.toUpperCase(),
    fillTopY: 255 + Math.floor(rng() * 40),
  };

  const images = [];
  const mainUid = `p${index + 1}`;
  const mainSvg = buildBottleSVG({ ...baseParams, uid: mainUid, highlightShift: 0 });
  const mainFile = `p${index + 1}.svg`;
  fs.writeFileSync(path.join(UPLOAD_DIR, mainFile), mainSvg, 'utf8');
  images.push(`/uploads/products/${mainFile}`);

  if (isFeatured) {
    const extraCount = 1 + Math.floor(rng() * 2); // 1 or 2 extra images -> 2-3 total
    for (let e = 0; e < extraCount; e += 1) {
      const suffix = String.fromCharCode(98 + e); // b, c
      const uid = `p${index + 1}-${suffix}`;
      const svg = buildBottleSVG({
        ...baseParams,
        uid,
        fillTopY: baseParams.fillTopY - 10 * (e + 1),
        highlightShift: (e + 1) * 8,
        subLabel: e === 0 ? blueprint.size.toUpperCase() : 'EAU DE PARFUM',
      });
      const file = `p${index + 1}-${suffix}.svg`;
      fs.writeFileSync(path.join(UPLOAD_DIR, file), svg, 'utf8');
      images.push(`/uploads/products/${file}`);
    }
  }

  return images;
}

async function seed() {
  await connectDB();

  console.log('Wiping existing products...');
  await Product.deleteMany({});

  console.log('Generating SVG bottle illustrations and inserting products...');

  let productCount = 0;
  for (let i = 0; i < BLUEPRINTS.length; i += 1) {
    const blueprint = BLUEPRINTS[i];
    const rng = mulberry32(1000 + i * 37);

    const images = buildImagesForProduct(blueprint, i, rng);
    const reviews = pickReviews(rng, 2 + Math.floor(rng() * 3)); // 2-4 reviews

    const numReviews = reviews.length;
    const rating = numReviews
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews) * 10) / 10
      : 0;

    const doc = {
      name: blueprint.name,
      description: blueprint.description,
      price: blueprint.price,
      images,
      gender: blueprint.gender,
      collectionName: blueprint.collectionName,
      category: blueprint.category,
      fragranceFamily: blueprint.fragranceFamily,
      topNotes: blueprint.topNotes,
      heartNotes: blueprint.heartNotes,
      baseNotes: blueprint.baseNotes,
      longevity: blueprint.longevity,
      sillage: blueprint.sillage,
      occasion: blueprint.occasion,
      season: blueprint.season,
      size: blueprint.size,
      stock: blueprint.stock,
      featured: blueprint.featured,
      bestseller: blueprint.bestseller,
      isNewArrival: blueprint.isNewArrival,
      reviews,
      rating,
      numReviews,
    };

    // eslint-disable-next-line no-await-in-loop
    await Product.create(doc);
    productCount += 1;
  }

  console.log(`Inserted ${productCount} products.`);

  // ---------------------------------------------------------------------
  // Admin user upsert
  // ---------------------------------------------------------------------
  const adminName = process.env.ADMIN_NAME || 'NB Admin';
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nbclassicscents.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  let admin = await User.findOne({ email: adminEmail }).select('+password');
  if (admin) {
    admin.role = 'admin';
    await admin.save();
    console.log(`Existing user promoted to admin: ${adminEmail}`);
  } else {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  const lowStock = await Product.countDocuments({ stock: { $lt: 5 } });
  const featuredCount = await Product.countDocuments({ featured: true });
  const bestsellerCount = await Product.countDocuments({ bestseller: true });
  const newArrivalCount = await Product.countDocuments({ isNewArrival: true });

  console.log('----------------------------------------------------');
  console.log('SEED SUMMARY');
  console.log('----------------------------------------------------');
  console.log(`Products inserted:   ${productCount}`);
  console.log(`Low stock (<5):      ${lowStock}`);
  console.log(`Featured:            ${featuredCount}`);
  console.log(`Bestseller:          ${bestsellerCount}`);
  console.log(`New arrivals:        ${newArrivalCount}`);
  console.log(`Admin account:       ${adminEmail} / (password from ADMIN_PASSWORD env)`);
  console.log(`SVG images written to: ${UPLOAD_DIR}`);
  console.log('----------------------------------------------------');
}

seed()
  .then(() => {
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding FAILED:', error);
    process.exit(1);
  });
