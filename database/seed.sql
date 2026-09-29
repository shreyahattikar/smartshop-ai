-- SmartShop AI - Seed Data (Demo Products, Reviews, Price History)
USE smartshop_ai;

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (id, name, category, description, price, original_price, rating, review_count, brand, marketplace, sustainability_score, image_url, specifications, discount_percent, tags) VALUES

-- Smartphones
(1, 'Samsung Galaxy S24 Ultra', 'Smartphones', 'Flagship smartphone with 200MP camera, S-Pen, and AI-powered features. Best-in-class performance for power users.', 124999, 134999, 4.6, 2841, 'Samsung', 'Amazon', 72, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', '{"display":"6.8 inch QHD+ Dynamic AMOLED 2X","processor":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB","battery":"5000mAh","camera":"200MP+12MP+10MP+10MP","os":"Android 14"}', 7, 'flagship,camera,stylus,ai'),

(2, 'OnePlus 12', 'Smartphones', 'Flagship killer with Hasselblad tuned cameras, 100W fast charging, and Snapdragon 8 Gen 3.', 64999, 69999, 4.5, 1562, 'OnePlus', 'Flipkart', 65, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', '{"display":"6.82 inch LTPO AMOLED","processor":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB","battery":"5400mAh","camera":"50MP+48MP+64MP","os":"Android 14","charging":"100W"}', 7, 'flagship killer,fast charging,hasselblad'),

(3, 'Redmi Note 13 Pro+', 'Smartphones', 'Mid-range powerhouse with 200MP camera and 120W fast charging at an incredible price.', 29999, 34999, 4.3, 3201, 'Xiaomi', 'Flipkart', 55, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400', '{"display":"6.67 inch AMOLED","processor":"Dimensity 7200 Ultra","ram":"8GB","storage":"256GB","battery":"5000mAh","camera":"200MP+8MP+2MP","os":"Android 13","charging":"120W"}', 14, 'budget,camera,fast charging'),

(4, 'iPhone 15 Pro', 'Smartphones', 'Apple A17 Pro chip, titanium design, USB-C, and ProMotion display for professionals.', 134900, 139900, 4.7, 4102, 'Apple', 'Apple Store', 68, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', '{"display":"6.1 inch Super Retina XDR ProMotion","processor":"A17 Pro","ram":"8GB","storage":"256GB","battery":"3274mAh","camera":"48MP+12MP+12MP","os":"iOS 17","material":"Titanium"}', 4, 'ios,titanium,pro,a17'),

(5, 'Motorola Edge 40', 'Smartphones', 'Slim flagship design with curved OLED display, IP68 rating, and clean Android experience.', 24999, 29999, 4.2, 876, 'Motorola', 'Amazon', 60, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', '{"display":"6.55 inch pOLED 144Hz","processor":"Dimensity 8020","ram":"8GB","storage":"256GB","battery":"4400mAh","camera":"50MP+13MP","os":"Android 13","ip_rating":"IP68"}', 17, 'slim,oled,ip68,budget flagship'),

-- Laptops
(6, 'MacBook Air M3', 'Laptops', 'Apple M3 chip with 18-hour battery life and fanless design. Perfect for students and professionals.', 114900, 119900, 4.8, 2234, 'Apple', 'Apple Store', 80, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', '{"display":"13.6 inch Liquid Retina","processor":"Apple M3","ram":"16GB","storage":"512GB SSD","battery":"18 hours","weight":"1.24 kg","ports":"2x Thunderbolt","os":"macOS Sonoma"}', 4, 'apple,m3,silent,ultralight'),

(7, 'Dell XPS 15', 'Laptops', 'Premium Windows laptop with OLED display, Intel Core i7 13th Gen, and NVIDIA RTX 4060 for creators.', 159990, 174990, 4.6, 1102, 'Dell', 'Dell.com', 65, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', '{"display":"15.6 inch OLED 3.5K","processor":"Intel Core i7-13700H","ram":"16GB DDR5","storage":"512GB NVMe","gpu":"NVIDIA RTX 4060 8GB","battery":"13 hours","weight":"1.86 kg","os":"Windows 11"}', 9, 'creator,oled,rtx,premium'),

(8, 'ASUS VivoBook 16X', 'Laptops', 'Versatile everyday laptop with AMD Ryzen 7 and a large 16-inch display for productivity.', 74990, 84990, 4.3, 956, 'ASUS', 'Flipkart', 58, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', '{"display":"16 inch FHD IPS 60Hz","processor":"AMD Ryzen 7 7730U","ram":"16GB","storage":"512GB SSD","battery":"10 hours","weight":"1.8 kg","os":"Windows 11"}', 12, 'everyday,amd,large display,value'),

(9, 'Lenovo IdeaPad Slim 5', 'Laptops', 'Thin and light laptop for students with good battery life and efficient AMD Ryzen 5 processor.', 54990, 62990, 4.2, 1834, 'Lenovo', 'Amazon', 62, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', '{"display":"14 inch FHD IPS","processor":"AMD Ryzen 5 7530U","ram":"16GB","storage":"512GB SSD","battery":"12 hours","weight":"1.46 kg","os":"Windows 11 Home"}', 13, 'student,thin,light,budget'),

(10, 'HP Pavilion Gaming 15', 'Laptops', 'Budget gaming laptop with NVIDIA RTX 3050 and Intel Core i5 for casual gamers.', 67990, 74990, 4.1, 2109, 'HP', 'Amazon', 45, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', '{"display":"15.6 inch FHD IPS 144Hz","processor":"Intel Core i5-12450H","ram":"8GB DDR4","storage":"512GB SSD","gpu":"NVIDIA RTX 3050 4GB","battery":"8 hours","weight":"2.2 kg","os":"Windows 11"}', 9, 'gaming,budget,rtx,144hz'),

-- Headphones
(11, 'Sony WH-1000XM5', 'Headphones', 'Industry-leading noise cancellation with 30-hour battery and multi-device connectivity.', 26990, 34990, 4.7, 5621, 'Sony', 'Amazon', 78, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', '{"type":"Over-ear","anc":"Yes - Industry leading","battery":"30 hours","driver":"30mm","connectivity":"Bluetooth 5.2, NFC","foldable":"No","microphone":"Yes - 8 mics","codec":"LDAC,AAC,SBC"}', 23, 'anc,premium,sony,work from home'),

(12, 'boAt Rockerz 550', 'Headphones', 'Affordable over-ear wireless headphones with 20-hour playtime for everyday use.', 1499, 3490, 3.9, 14230, 'boAt', 'Flipkart', 35, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', '{"type":"Over-ear","anc":"No","battery":"20 hours","driver":"40mm","connectivity":"Bluetooth 5.0","foldable":"Yes","microphone":"Yes"}', 57, 'budget,everyday,india,bass'),

(13, 'Apple AirPods Pro 2', 'Headphones', 'H2 chip with adaptive transparency, personalized spatial audio, and USB-C charging.', 26900, 29900, 4.6, 3102, 'Apple', 'Apple Store', 70, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', '{"type":"In-ear TWS","anc":"Yes - Adaptive","battery":"6h + 24h case","driver":"Custom Apple","connectivity":"Bluetooth 5.3, H2","charging":"USB-C, MagSafe","spatial_audio":"Yes"}', 10, 'ios,tws,spatial audio,adaptive'),

(14, 'Sennheiser Momentum 4', 'Headphones', 'Premium audio with 60-hour battery, adaptive ANC, and audiophile-grade sound quality.', 29990, 39990, 4.5, 820, 'Sennheiser', 'Amazon', 74, 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400', '{"type":"Over-ear","anc":"Yes - Adaptive","battery":"60 hours","driver":"42mm","connectivity":"Bluetooth 5.2","foldable":"Yes","microphone":"Yes - beamforming"}', 25, 'audiophile,60hour,premium,travel'),

-- Shoes
(15, 'Nike Air Max 270', 'Shoes', 'Lifestyle sneaker with 270-degree Air unit for all-day cushioning and iconic style.', 12995, 14995, 4.4, 1876, 'Nike', 'Nike.com', 52, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', '{"type":"Lifestyle Sneaker","sole":"Air Max 270 unit","upper":"Mesh + Synthetic","sizes":"6-12 UK","weight":"310g","color_options":["White/Black","Red/Black","All Black"]}', 13, 'running,lifestyle,airmax,cushion'),

(16, 'Adidas Ultraboost 22', 'Shoes', 'Performance running shoe with Boost midsole and Primeknit upper for responsive energy return.', 14999, 17999, 4.5, 2201, 'Adidas', 'Adidas.com', 66, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', '{"type":"Running Shoe","sole":"Continental Rubber + Boost","upper":"Primeknit+","sizes":"6-12 UK","weight":"325g","sustainable":"Partially recycled materials"}', 17, 'running,boost,performance,sustainable'),

(17, 'Campus OFC Running', 'Shoes', 'Affordable Indian brand running shoes with good grip and lightweight design for daily use.', 1499, 2499, 3.8, 4502, 'Campus', 'Flipkart', 40, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400', '{"type":"Running","sole":"EVA","upper":"Mesh","sizes":"6-12 UK","weight":"260g"}', 40, 'budget,india,running,daily'),

-- Backpacks
(18, 'Wildcraft Urban Casual', 'Backpacks', 'Water-resistant 30L backpack for daily commute and weekend travel with laptop compartment.', 2499, 3499, 4.1, 3821, 'Wildcraft', 'Amazon', 55, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', '{"capacity":"30L","laptop_size":"15.6 inch","material":"Water resistant nylon","compartments":3,"weight":"0.6 kg","color_options":["Black","Navy","Olive"]}', 29, 'travel,commute,water resistant,india'),

(19, 'Samsonite Tectonic 2', 'Backpacks', 'Premium laptop backpack with multiple pockets, ergonomic design, and durable zippers.', 4999, 6999, 4.4, 1245, 'Samsonite', 'Amazon', 60, 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400', '{"capacity":"25L","laptop_size":"15.6 inch","material":"Polyester","compartments":5,"weight":"0.9 kg","usb_port":"Yes"}', 29, 'premium,laptop,business,samsonite'),

-- Smartwatches
(20, 'Apple Watch Series 9', 'Smartwatches', 'Most powerful Apple Watch with S9 chip, double-tap gesture, and carbon-neutral option.', 41900, 44900, 4.7, 2983, 'Apple', 'Apple Store', 76, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', '{"display":"45mm Always-On Retina","processor":"S9 SiP","health":"ECG,Blood Oxygen,Temperature","battery":"18 hours","connectivity":"GPS+Cellular","os":"watchOS 10","water_resistance":"50m"}', 7, 'ios,health,fitness,premium'),

(21, 'Samsung Galaxy Watch 6', 'Smartwatches', 'Advanced health tracking with BIA body composition, improved sleep coaching, and Wear OS 4.', 29999, 34999, 4.5, 1432, 'Samsung', 'Flipkart', 65, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', '{"display":"44mm Super AMOLED","processor":"Exynos W930","health":"ECG,Blood Oxygen,BIA,Sleep","battery":"40 hours","connectivity":"GPS+LTE","os":"Wear OS 4"}', 14, 'android,health,samsung,wear os'),

(22, 'boAt Wave Sigma', 'Smartwatches', 'Budget smartwatch with large 1.83" display, SpO2 monitoring, and 7-day battery.', 1799, 4999, 3.7, 8921, 'boAt', 'Amazon', 30, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', '{"display":"1.83 inch TFT","health":"SpO2,Heart Rate,Sleep","battery":"7 days","connectivity":"Bluetooth","water_resistance":"IP68"}', 64, 'budget,india,spo2,budget watch');

-- ============================================================
-- REVIEWS (sample for key products)
-- ============================================================
INSERT INTO reviews (product_id, user_name, review_text, rating, review_date, verified_purchase) VALUES
(1, 'Rahul M.', 'Absolutely fantastic phone! The S-Pen integration with AI is revolutionary. Camera quality is top notch.', 5, '2024-02-15', TRUE),
(1, 'Priya K.', 'Best smartphone I have owned. The zoom capabilities are insane and battery lasts all day.', 5, '2024-02-20', TRUE),
(1, 'Vikram S.', 'Excellent phone but quite heavy and pricey. Performance is flawless. worth it for power users.', 4, '2024-03-01', TRUE),
(1, 'Ananya R.', 'Good phone overall but the price is too high for most people. My old phone does 80% of what this does.', 3, '2024-03-10', FALSE),

(6, 'Sneha L.', 'The M3 chip is blazing fast. Battery life is unreal — I get 15+ hours easily on a single charge.', 5, '2024-01-20', TRUE),
(6, 'Arjun P.', 'Perfect for my design work. Display is beautiful and the laptop barely gets warm. Silent operation!', 5, '2024-01-25', TRUE),
(6, 'Deepak T.', 'Great laptop. The port selection is limited (only 2 Thunderbolt) but performance makes up for it.', 4, '2024-02-05', TRUE),

(11, 'Meera N.', 'Best headphones I have ever used. The ANC is magical — completely blocks out metro noise.', 5, '2024-01-10', TRUE),
(11, 'Karan B.', 'Amazing sound quality and ANC. The call quality is crystal clear. Worth every rupee.', 5, '2024-02-01', TRUE),
(11, 'Pooja S.', 'Great headphones. Battery lasts forever. Not foldable so carrying is a bit awkward.', 4, '2024-02-18', TRUE),
(11, 'Rohan G.', 'Good sound but I expected more bass. Very comfortable for long sessions. ANC is excellent.', 4, '2024-03-02', FALSE),
(11, 'Sneha T.', 'Average product for the price. Not worth the premium. Build quality could be better.', 2, '2024-03-05', FALSE);

-- ============================================================
-- PRICE HISTORY (last 12 months for key products)
-- ============================================================
INSERT INTO price_history (product_id, recorded_price, recorded_at) VALUES
-- Samsung Galaxy S24 Ultra
(1, 129999, '2024-01-01'), (1, 132999, '2024-01-15'), (1, 131000, '2024-02-01'),
(1, 129500, '2024-02-15'), (1, 127999, '2024-03-01'), (1, 126000, '2024-03-15'),
(1, 125000, '2024-04-01'), (1, 124999, '2024-04-15'),

-- MacBook Air M3
(6, 119900, '2024-01-01'), (6, 119900, '2024-01-15'), (6, 117900, '2024-02-01'),
(6, 116900, '2024-02-15'), (6, 115900, '2024-03-01'), (6, 114900, '2024-03-15'),
(6, 114900, '2024-04-01'), (6, 114900, '2024-04-15'),

-- Sony WH-1000XM5
(11, 34990, '2024-01-01'), (11, 32990, '2024-01-15'), (11, 30990, '2024-02-01'),
(11, 29990, '2024-02-15'), (11, 28990, '2024-03-01'), (11, 27990, '2024-03-15'),
(11, 26990, '2024-04-01'), (11, 26990, '2024-04-15'),

-- OnePlus 12
(2, 69999, '2024-01-01'), (2, 68999, '2024-01-15'), (2, 67999, '2024-02-01'),
(2, 66999, '2024-02-15'), (2, 65999, '2024-03-01'), (2, 64999, '2024-03-15'),
(2, 64999, '2024-04-01'), (2, 64999, '2024-04-15');
