// SmartShop AI - Frontend Demo Data
// All prices in Indian Rupees (₹). This is sample data for demonstration.

export const DEMO_PRODUCTS = [
  {
    id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'Smartphones',
    description: 'Flagship smartphone with 200MP camera, S-Pen, and AI-powered features.',
    price: 124999, original_price: 134999, rating: 4.6, review_count: 2841,
    brand: 'Samsung', marketplace: 'Amazon', sustainability_score: 72, discount_percent: 7,
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    specifications: { display:'6.8" QHD+ AMOLED', processor:'Snapdragon 8 Gen 3', ram:'12GB', storage:'256GB', battery:'5000mAh', camera:'200MP+12MP+10MP' },
    tags: 'flagship,camera,stylus,ai'
  },
  {
    id: 2, name: 'OnePlus 12', category: 'Smartphones',
    description: 'Flagship killer with Hasselblad cameras and 100W fast charging.',
    price: 64999, original_price: 69999, rating: 4.5, review_count: 1562,
    brand: 'OnePlus', marketplace: 'Flipkart', sustainability_score: 65, discount_percent: 7,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    specifications: { display:'6.82" LTPO AMOLED', processor:'Snapdragon 8 Gen 3', ram:'12GB', storage:'256GB', battery:'5400mAh', charging:'100W' },
    tags: 'flagship killer,fast charging,hasselblad'
  },
  {
    id: 3, name: 'Redmi Note 13 Pro+', category: 'Smartphones',
    description: 'Mid-range powerhouse with 200MP camera at an incredible price.',
    price: 29999, original_price: 34999, rating: 4.3, review_count: 3201,
    brand: 'Xiaomi', marketplace: 'Flipkart', sustainability_score: 55, discount_percent: 14,
    image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
    specifications: { display:'6.67" AMOLED', processor:'Dimensity 7200 Ultra', ram:'8GB', storage:'256GB', battery:'5000mAh', charging:'120W' },
    tags: 'budget,camera,fast charging'
  },
  {
    id: 4, name: 'iPhone 15 Pro', category: 'Smartphones',
    description: 'Apple A17 Pro chip, titanium design, USB-C port.',
    price: 134900, original_price: 139900, rating: 4.7, review_count: 4102,
    brand: 'Apple', marketplace: 'Apple Store', sustainability_score: 68, discount_percent: 4,
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    specifications: { display:'6.1" Super Retina XDR', processor:'A17 Pro', ram:'8GB', storage:'256GB', battery:'3274mAh', material:'Titanium' },
    tags: 'ios,titanium,pro,a17'
  },
  {
    id: 5, name: 'Motorola Edge 40', category: 'Smartphones',
    description: 'Slim flagship design with curved OLED and IP68 rating.',
    price: 24999, original_price: 29999, rating: 4.2, review_count: 876,
    brand: 'Motorola', marketplace: 'Amazon', sustainability_score: 60, discount_percent: 17,
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    specifications: { display:'6.55" pOLED 144Hz', processor:'Dimensity 8020', ram:'8GB', storage:'256GB', battery:'4400mAh', ip_rating:'IP68' },
    tags: 'slim,oled,ip68,budget flagship'
  },
  {
    id: 6, name: 'MacBook Air M3', category: 'Laptops',
    description: 'Apple M3 chip with 18-hour battery life and fanless design.',
    price: 114900, original_price: 119900, rating: 4.8, review_count: 2234,
    brand: 'Apple', marketplace: 'Apple Store', sustainability_score: 80, discount_percent: 4,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    specifications: { display:'13.6" Liquid Retina', processor:'Apple M3', ram:'16GB', storage:'512GB SSD', battery:'18 hours', weight:'1.24 kg' },
    tags: 'apple,m3,silent,ultralight'
  },
  {
    id: 7, name: 'Dell XPS 15', category: 'Laptops',
    description: 'Premium Windows laptop with OLED display and RTX 4060.',
    price: 159990, original_price: 174990, rating: 4.6, review_count: 1102,
    brand: 'Dell', marketplace: 'Dell.com', sustainability_score: 65, discount_percent: 9,
    image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    specifications: { display:'15.6" OLED 3.5K', processor:'Intel Core i7-13700H', ram:'16GB DDR5', storage:'512GB NVMe', gpu:'NVIDIA RTX 4060' },
    tags: 'creator,oled,rtx,premium'
  },
  {
    id: 8, name: 'ASUS VivoBook 16X', category: 'Laptops',
    description: 'Versatile everyday laptop with AMD Ryzen 7 and 16" display.',
    price: 74990, original_price: 84990, rating: 4.3, review_count: 956,
    brand: 'ASUS', marketplace: 'Flipkart', sustainability_score: 58, discount_percent: 12,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    specifications: { display:'16" FHD IPS', processor:'AMD Ryzen 7 7730U', ram:'16GB', storage:'512GB SSD', battery:'10 hours' },
    tags: 'everyday,amd,large display,value'
  },
  {
    id: 9, name: 'Lenovo IdeaPad Slim 5', category: 'Laptops',
    description: 'Thin and light laptop for students with AMD Ryzen 5.',
    price: 54990, original_price: 62990, rating: 4.2, review_count: 1834,
    brand: 'Lenovo', marketplace: 'Amazon', sustainability_score: 62, discount_percent: 13,
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    specifications: { display:'14" FHD IPS', processor:'AMD Ryzen 5 7530U', ram:'16GB', storage:'512GB SSD', battery:'12 hours', weight:'1.46 kg' },
    tags: 'student,thin,light,budget'
  },
  {
    id: 10, name: 'HP Pavilion Gaming 15', category: 'Laptops',
    description: 'Budget gaming laptop with RTX 3050 for casual gamers.',
    price: 67990, original_price: 74990, rating: 4.1, review_count: 2109,
    brand: 'HP', marketplace: 'Amazon', sustainability_score: 45, discount_percent: 9,
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    specifications: { display:'15.6" FHD 144Hz', processor:'Intel Core i5-12450H', ram:'8GB DDR4', storage:'512GB SSD', gpu:'NVIDIA RTX 3050 4GB' },
    tags: 'gaming,budget,rtx,144hz'
  },
  {
    id: 11, name: 'Sony WH-1000XM5', category: 'Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery.',
    price: 26990, original_price: 34990, rating: 4.7, review_count: 5621,
    brand: 'Sony', marketplace: 'Amazon', sustainability_score: 78, discount_percent: 23,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    specifications: { type:'Over-ear', anc:'Yes - Industry Leading', battery:'30 hours', driver:'30mm', codec:'LDAC,AAC,SBC' },
    tags: 'anc,premium,sony,work from home'
  },
  {
    id: 12, name: 'boAt Rockerz 550', category: 'Headphones',
    description: 'Affordable over-ear wireless headphones with 20-hour playtime.',
    price: 1499, original_price: 3490, rating: 3.9, review_count: 14230,
    brand: 'boAt', marketplace: 'Flipkart', sustainability_score: 35, discount_percent: 57,
    image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    specifications: { type:'Over-ear', anc:'No', battery:'20 hours', driver:'40mm', foldable:'Yes' },
    tags: 'budget,everyday,india,bass'
  },
  {
    id: 13, name: 'Apple AirPods Pro 2', category: 'Headphones',
    description: 'H2 chip with adaptive transparency and personalized spatial audio.',
    price: 26900, original_price: 29900, rating: 4.6, review_count: 3102,
    brand: 'Apple', marketplace: 'Apple Store', sustainability_score: 70, discount_percent: 10,
    image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    specifications: { type:'In-ear TWS', anc:'Adaptive', battery:'6h + 24h case', spatial_audio:'Yes', charging:'USB-C/MagSafe' },
    tags: 'ios,tws,spatial audio,adaptive'
  },
  {
    id: 14, name: 'Sennheiser Momentum 4', category: 'Headphones',
    description: 'Premium audio with 60-hour battery and audiophile-grade sound.',
    price: 29990, original_price: 39990, rating: 4.5, review_count: 820,
    brand: 'Sennheiser', marketplace: 'Amazon', sustainability_score: 74, discount_percent: 25,
    image_url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
    specifications: { type:'Over-ear', anc:'Adaptive', battery:'60 hours', driver:'42mm', foldable:'Yes' },
    tags: 'audiophile,60hour,premium,travel'
  },
  {
    id: 15, name: 'Nike Air Max 270', category: 'Shoes',
    description: 'Lifestyle sneaker with 270-degree Air unit for all-day cushioning.',
    price: 12995, original_price: 14995, rating: 4.4, review_count: 1876,
    brand: 'Nike', marketplace: 'Nike.com', sustainability_score: 52, discount_percent: 13,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    specifications: { type:'Lifestyle Sneaker', sole:'Air Max 270', upper:'Mesh + Synthetic', weight:'310g' },
    tags: 'running,lifestyle,airmax,cushion'
  },
  {
    id: 16, name: 'Adidas Ultraboost 22', category: 'Shoes',
    description: 'Performance running shoe with Boost midsole and Primeknit upper.',
    price: 14999, original_price: 17999, rating: 4.5, review_count: 2201,
    brand: 'Adidas', marketplace: 'Adidas.com', sustainability_score: 66, discount_percent: 17,
    image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    specifications: { type:'Running', sole:'Continental Rubber + Boost', upper:'Primeknit+', weight:'325g', sustainable:'Partially recycled' },
    tags: 'running,boost,performance,sustainable'
  },
  {
    id: 17, name: 'Campus OFC Running', category: 'Shoes',
    description: 'Affordable Indian brand running shoes for daily use.',
    price: 1499, original_price: 2499, rating: 3.8, review_count: 4502,
    brand: 'Campus', marketplace: 'Flipkart', sustainability_score: 40, discount_percent: 40,
    image_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    specifications: { type:'Running', sole:'EVA', upper:'Mesh', weight:'260g' },
    tags: 'budget,india,running,daily'
  },
  {
    id: 18, name: 'Wildcraft Urban Casual', category: 'Backpacks',
    description: 'Water-resistant 30L backpack for commute and travel.',
    price: 2499, original_price: 3499, rating: 4.1, review_count: 3821,
    brand: 'Wildcraft', marketplace: 'Amazon', sustainability_score: 55, discount_percent: 29,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    specifications: { capacity:'30L', laptop_size:'15.6"', material:'Water resistant nylon', compartments:3, weight:'0.6 kg' },
    tags: 'travel,commute,water resistant,india'
  },
  {
    id: 19, name: 'Samsonite Tectonic 2', category: 'Backpacks',
    description: 'Premium laptop backpack with multiple pockets and ergonomic design.',
    price: 4999, original_price: 6999, rating: 4.4, review_count: 1245,
    brand: 'Samsonite', marketplace: 'Amazon', sustainability_score: 60, discount_percent: 29,
    image_url: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400',
    specifications: { capacity:'25L', laptop_size:'15.6"', material:'Polyester', compartments:5, weight:'0.9 kg', usb_port:'Yes' },
    tags: 'premium,laptop,business,samsonite'
  },
  {
    id: 20, name: 'Apple Watch Series 9', category: 'Smartwatches',
    description: 'Most powerful Apple Watch with S9 chip and double-tap gesture.',
    price: 41900, original_price: 44900, rating: 4.7, review_count: 2983,
    brand: 'Apple', marketplace: 'Apple Store', sustainability_score: 76, discount_percent: 7,
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
    specifications: { display:'45mm Always-On Retina', health:'ECG,Blood Oxygen,Temperature', battery:'18 hours', water_resistance:'50m' },
    tags: 'ios,health,fitness,premium'
  },
  {
    id: 21, name: 'Samsung Galaxy Watch 6', category: 'Smartwatches',
    description: 'Advanced health tracking with BIA body composition.',
    price: 29999, original_price: 34999, rating: 4.5, review_count: 1432,
    brand: 'Samsung', marketplace: 'Flipkart', sustainability_score: 65, discount_percent: 14,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    specifications: { display:'44mm Super AMOLED', health:'ECG,Blood Oxygen,BIA,Sleep', battery:'40 hours', os:'Wear OS 4' },
    tags: 'android,health,samsung,wear os'
  },
  {
    id: 22, name: 'boAt Wave Sigma', category: 'Smartwatches',
    description: 'Budget smartwatch with 1.83" display and SpO2 monitoring.',
    price: 1799, original_price: 4999, rating: 3.7, review_count: 8921,
    brand: 'boAt', marketplace: 'Amazon', sustainability_score: 30, discount_percent: 64,
    image_url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    specifications: { display:'1.83" TFT', health:'SpO2,Heart Rate,Sleep', battery:'7 days', water_resistance:'IP68' },
    tags: 'budget,india,spo2,budget watch'
  }
];

export const DEMO_REVIEWS = {
  1: [
    { id:1, user_name:'Rahul M.', rating:5, review_text:'Absolutely fantastic phone! The S-Pen integration with AI is revolutionary. Camera quality is top notch.', review_date:'2024-02-15', verified_purchase:true },
    { id:2, user_name:'Priya K.', rating:5, review_text:'Best smartphone I have owned. The zoom capabilities are insane and battery lasts all day.', review_date:'2024-02-20', verified_purchase:true },
    { id:3, user_name:'Vikram S.', rating:4, review_text:'Excellent phone but quite heavy and pricey. Performance is flawless. Worth it for power users.', review_date:'2024-03-01', verified_purchase:true },
    { id:4, user_name:'Ananya R.', rating:3, review_text:'Good phone overall but the price is too high for most people. My old phone does 80% of what this does.', review_date:'2024-03-10', verified_purchase:false }
  ],
  11: [
    { id:5, user_name:'Meera N.', rating:5, review_text:'Best headphones I have ever used. The ANC is magical — completely blocks out metro noise.', review_date:'2024-01-10', verified_purchase:true },
    { id:6, user_name:'Karan B.', rating:5, review_text:'Amazing sound quality and ANC. The call quality is crystal clear. Worth every rupee.', review_date:'2024-02-01', verified_purchase:true },
    { id:7, user_name:'Pooja S.', rating:4, review_text:'Great headphones. Battery lasts forever. Not foldable so carrying is a bit awkward.', review_date:'2024-02-18', verified_purchase:true },
    { id:8, user_name:'Rohan G.', rating:4, review_text:'Good sound but I expected more bass. Very comfortable for long sessions.', review_date:'2024-03-02', verified_purchase:false },
    { id:9, user_name:'Sneha T.', rating:2, review_text:'Average product for the price. Not worth the premium.', review_date:'2024-03-05', verified_purchase:false }
  ]
};

export const DEMO_PRICE_HISTORY = {
  1:  [ {recorded_price:129999,recorded_at:'2024-01-01'},{recorded_price:132999,recorded_at:'2024-01-15'},{recorded_price:131000,recorded_at:'2024-02-01'},{recorded_price:129500,recorded_at:'2024-02-15'},{recorded_price:127999,recorded_at:'2024-03-01'},{recorded_price:126000,recorded_at:'2024-03-15'},{recorded_price:125000,recorded_at:'2024-04-01'},{recorded_price:124999,recorded_at:'2024-04-15'} ],
  6:  [ {recorded_price:119900,recorded_at:'2024-01-01'},{recorded_price:119900,recorded_at:'2024-01-15'},{recorded_price:117900,recorded_at:'2024-02-01'},{recorded_price:116900,recorded_at:'2024-02-15'},{recorded_price:115900,recorded_at:'2024-03-01'},{recorded_price:114900,recorded_at:'2024-03-15'},{recorded_price:114900,recorded_at:'2024-04-01'},{recorded_price:114900,recorded_at:'2024-04-15'} ],
  11: [ {recorded_price:34990,recorded_at:'2024-01-01'},{recorded_price:32990,recorded_at:'2024-01-15'},{recorded_price:30990,recorded_at:'2024-02-01'},{recorded_price:29990,recorded_at:'2024-02-15'},{recorded_price:28990,recorded_at:'2024-03-01'},{recorded_price:27990,recorded_at:'2024-03-15'},{recorded_price:26990,recorded_at:'2024-04-01'},{recorded_price:26990,recorded_at:'2024-04-15'} ]
};

export const CATEGORIES = ['Smartphones','Laptops','Headphones','Shoes','Backpacks','Smartwatches'];

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(price);

export const getSustainabilityLabel = (score) => {
  if (score >= 70) return { label:'Excellent', color:'#16a34a' };
  if (score >= 50) return { label:'Good', color:'#65a30d' };
  if (score >= 30) return { label:'Fair', color:'#d97706' };
  return { label:'Poor', color:'#dc2626' };
};
