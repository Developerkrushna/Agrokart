#!/usr/bin/env python3
"""
Agricultural Product Web Scraper for AgiNet
Scrapes fertilizers, seeds, and farming supplies from various agri websites
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
from urllib.parse import urljoin, urlparse
import logging
from typing import List, Dict, Optional
import re
from dataclasses import dataclass, asdict

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class Product:
    """Product data structure"""
    name: str
    price: str
    original_price: Optional[str]
    image_url: str
    description: str
    category: str
    brand: str
    availability: str
    rating: Optional[float]
    reviews_count: Optional[int]
    source_url: str
    source_site: str

class AgriScraper:
    """Main scraper class for agricultural websites"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        self.products = []
        
    def random_delay(self, min_delay=1, max_delay=3):
        """Add random delay to avoid being blocked"""
        time.sleep(random.uniform(min_delay, max_delay))
        
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())
        
    def extract_price(self, price_text: str) -> str:
        """Extract price from text"""
        if not price_text:
            return "0"
        # Extract numbers and currency symbols
        price_match = re.search(r'[₹$€£]?\s*[\d,]+\.?\d*', price_text)
        return price_match.group(0) if price_match else "0"
        
    def scrape_bighaat(self, max_pages=5) -> List[Product]:
        """Scrape BigHaat fertilizers"""
        logger.info("Starting BigHaat scraping...")
        products = []
        
        base_url = "https://www.bighaat.com"
        categories = [
            "/collections/fertilizers",
            "/collections/seeds",
            "/collections/pesticides",
            "/collections/farm-implements"
        ]
        
        for category in categories:
            for page in range(1, max_pages + 1):
                try:
                    url = f"{base_url}{category}?page={page}"
                    logger.info(f"Scraping: {url}")
                    
                    response = self.session.get(url, timeout=10)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Find product containers
                    product_items = soup.find_all(['div', 'article'], class_=re.compile(r'product|item'))
                    
                    if not product_items:
                        logger.warning(f"No products found on {url}")
                        break
                        
                    for item in product_items:
                        try:
                            product = self.extract_bighaat_product(item, base_url, category)
                            if product:
                                products.append(product)
                        except Exception as e:
                            logger.error(f"Error extracting product: {e}")
                            continue
                    
                    self.random_delay()
                    
                except Exception as e:
                    logger.error(f"Error scraping {url}: {e}")
                    continue
                    
        logger.info(f"BigHaat scraping completed. Found {len(products)} products")
        return products
        
    def extract_bighaat_product(self, item, base_url, category) -> Optional[Product]:
        """Extract product details from BigHaat item"""
        try:
            # Product name
            name_elem = item.find(['h3', 'h4', 'a'], class_=re.compile(r'title|name|product'))
            name = self.clean_text(name_elem.get_text()) if name_elem else "Unknown Product"
            
            # Price
            price_elem = item.find(['span', 'div'], class_=re.compile(r'price|money|cost'))
            price = self.extract_price(price_elem.get_text()) if price_elem else "0"
            
            # Original price (if discounted)
            original_price_elem = item.find(['span', 'div'], class_=re.compile(r'original|was|strike'))
            original_price = self.extract_price(original_price_elem.get_text()) if original_price_elem else None
            
            # Image
            img_elem = item.find('img')
            image_url = ""
            if img_elem:
                image_url = img_elem.get('src') or img_elem.get('data-src') or ""
                if image_url and not image_url.startswith('http'):
                    image_url = urljoin(base_url, image_url)
            
            # Product URL
            link_elem = item.find('a')
            product_url = ""
            if link_elem:
                product_url = link_elem.get('href', '')
                if product_url and not product_url.startswith('http'):
                    product_url = urljoin(base_url, product_url)
            
            # Category from URL
            category_name = category.split('/')[-1].replace('-', ' ').title()
            
            return Product(
                name=name,
                price=price,
                original_price=original_price,
                image_url=image_url,
                description="",
                category=category_name,
                brand="",
                availability="In Stock",
                rating=None,
                reviews_count=None,
                source_url=product_url,
                source_site="BigHaat"
            )
            
        except Exception as e:
            logger.error(f"Error extracting BigHaat product: {e}")
            return None
            
    def scrape_agrostar(self, max_pages=3) -> List[Product]:
        """Scrape AgroStar products"""
        logger.info("Starting AgroStar scraping...")
        products = []
        
        base_url = "https://www.agrostar.in"
        categories = [
            "/fertilizers",
            "/seeds",
            "/crop-protection",
            "/farm-implements"
        ]
        
        for category in categories:
            for page in range(1, max_pages + 1):
                try:
                    url = f"{base_url}{category}?page={page}"
                    logger.info(f"Scraping: {url}")
                    
                    response = self.session.get(url, timeout=10)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Find product containers (adjust selectors based on actual site structure)
                    product_items = soup.find_all(['div', 'article'], class_=re.compile(r'product|card|item'))
                    
                    if not product_items:
                        logger.warning(f"No products found on {url}")
                        break
                        
                    for item in product_items:
                        try:
                            product = self.extract_agrostar_product(item, base_url, category)
                            if product:
                                products.append(product)
                        except Exception as e:
                            logger.error(f"Error extracting product: {e}")
                            continue
                    
                    self.random_delay()
                    
                except Exception as e:
                    logger.error(f"Error scraping {url}: {e}")
                    continue
                    
        logger.info(f"AgroStar scraping completed. Found {len(products)} products")
        return products
        
    def extract_agrostar_product(self, item, base_url, category) -> Optional[Product]:
        """Extract product details from AgroStar item"""
        try:
            # Similar extraction logic as BigHaat but adapted for AgroStar structure
            name_elem = item.find(['h3', 'h4', 'a'], class_=re.compile(r'title|name|product'))
            name = self.clean_text(name_elem.get_text()) if name_elem else "Unknown Product"
            
            price_elem = item.find(['span', 'div'], class_=re.compile(r'price|rupee|cost'))
            price = self.extract_price(price_elem.get_text()) if price_elem else "0"
            
            img_elem = item.find('img')
            image_url = ""
            if img_elem:
                image_url = img_elem.get('src') or img_elem.get('data-src') or ""
                if image_url and not image_url.startswith('http'):
                    image_url = urljoin(base_url, image_url)
            
            link_elem = item.find('a')
            product_url = ""
            if link_elem:
                product_url = link_elem.get('href', '')
                if product_url and not product_url.startswith('http'):
                    product_url = urljoin(base_url, product_url)
            
            category_name = category.split('/')[-1].replace('-', ' ').title()
            
            return Product(
                name=name,
                price=price,
                original_price=None,
                image_url=image_url,
                description="",
                category=category_name,
                brand="",
                availability="Available",
                rating=None,
                reviews_count=None,
                source_url=product_url,
                source_site="AgroStar"
            )
            
        except Exception as e:
            logger.error(f"Error extracting AgroStar product: {e}")
            return None

    def scrape_all_sites(self, max_pages_per_site=3) -> List[Product]:
        """Scrape all supported agricultural websites"""
        all_products = []

        # Scrape BigHaat
        try:
            bighaat_products = self.scrape_bighaat(max_pages_per_site)
            all_products.extend(bighaat_products)
        except Exception as e:
            logger.error(f"Error scraping BigHaat: {e}")

        # Scrape AgroStar
        try:
            agrostar_products = self.scrape_agrostar(max_pages_per_site)
            all_products.extend(agrostar_products)
        except Exception as e:
            logger.error(f"Error scraping AgroStar: {e}")

        # Remove duplicates based on name and price
        unique_products = self.remove_duplicates(all_products)

        logger.info(f"Total unique products scraped: {len(unique_products)}")
        return unique_products

    def remove_duplicates(self, products: List[Product]) -> List[Product]:
        """Remove duplicate products based on name similarity"""
        unique_products = []
        seen_names = set()

        for product in products:
            # Create a normalized name for comparison
            normalized_name = re.sub(r'[^\w\s]', '', product.name.lower())
            normalized_name = re.sub(r'\s+', ' ', normalized_name).strip()

            if normalized_name not in seen_names:
                seen_names.add(normalized_name)
                unique_products.append(product)

        return unique_products

    def save_to_json(self, products: List[Product], filename: str = "agri_products.json"):
        """Save products to JSON file"""
        try:
            products_dict = [asdict(product) for product in products]

            with open(filename, 'w', encoding='utf-8') as f:
                json.dump({
                    "products": products_dict,
                    "total_count": len(products_dict),
                    "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "categories": list(set(p.category for p in products))
                }, f, indent=2, ensure_ascii=False)

            logger.info(f"Products saved to {filename}")
            return True

        except Exception as e:
            logger.error(f"Error saving to JSON: {e}")
            return False

    def save_to_firebase(self, products: List[Product], collection_name: str = "products"):
        """Save products to Firebase Firestore"""
        try:
            import firebase_admin
            from firebase_admin import credentials, firestore

            # Initialize Firebase (you'll need to add your credentials)
            if not firebase_admin._apps:
                cred = credentials.Certificate("path/to/your/firebase-credentials.json")
                firebase_admin.initialize_app(cred)

            db = firestore.client()

            batch = db.batch()
            collection_ref = db.collection(collection_name)

            for product in products:
                doc_ref = collection_ref.document()
                batch.set(doc_ref, asdict(product))

            batch.commit()
            logger.info(f"Products uploaded to Firebase collection: {collection_name}")
            return True

        except Exception as e:
            logger.error(f"Error uploading to Firebase: {e}")
            return False

    def get_sample_image_url(self, product_name: str, category: str) -> str:
        """Get appropriate image URL based on product name and category"""
        name_lower = product_name.lower()
        category_lower = category.lower()

        # Agricultural product images from Unsplash
        if 'npk' in name_lower or 'nitrogen' in name_lower or 'urea' in name_lower:
            return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format'
        elif 'organic' in name_lower or 'compost' in name_lower:
            return 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop&auto=format'
        elif 'wheat' in name_lower or 'rice' in name_lower or 'corn' in name_lower:
            return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format'
        elif 'tomato' in name_lower or 'vegetable' in name_lower:
            return 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop&auto=format'
        elif 'spray' in name_lower or 'pesticide' in name_lower:
            return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format'
        elif 'tractor' in name_lower or 'pump' in name_lower:
            return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format'
        elif 'irrigation' in name_lower or 'drip' in name_lower:
            return 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop&auto=format'
        elif 'fertilizer' in category_lower:
            return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&auto=format'
        elif 'seed' in category_lower:
            return 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop&auto=format'
        elif 'equipment' in category_lower:
            return 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&auto=format'
        else:
            # Default agricultural image
            return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format'

    def generate_sample_data(self, count: int = 100) -> List[Product]:
        """Generate sample agricultural product data for testing"""
        sample_products = []

        fertilizer_names = [
            "NPK 19:19:19 Fertilizer 50kg", "Urea 46% Nitrogen 45kg", "DAP Fertilizer 50kg",
            "Potash Fertilizer 25kg", "Organic Compost 40kg", "Vermicompost 20kg",
            "Liquid NPK Fertilizer 1L", "Calcium Nitrate 25kg", "Magnesium Sulphate 10kg",
            "Zinc Sulphate 5kg", "Boron Fertilizer 1kg", "Iron Chelate 500g",
            "Phosphorus Rich Fertilizer", "Nitrogen Booster 20kg", "Potassium Chloride 25kg",
            "Organic Manure 50kg", "Bio Fertilizer 10kg", "Micronutrient Mix 5kg",
            "Sulphur Fertilizer 20kg", "Calcium Carbonate 25kg", "Humic Acid 1L",
            "Seaweed Extract 500ml", "Amino Acid Fertilizer", "Growth Promoter 250ml"
        ]

        seed_names = [
            "Hybrid Tomato Seeds F1", "Wheat Seeds HD-2967 10kg", "Rice Seeds Basmati 1121",
            "Corn Seeds Hybrid 900M", "Cotton Seeds Bt 450g", "Soybean Seeds JS-335",
            "Sunflower Seeds Hybrid KBSH-44", "Mustard Seeds Varuna", "Chili Seeds G4",
            "Onion Seeds Nasik Red", "Carrot Seeds Nantes", "Cabbage Seeds Golden Acre",
            "Brinjal Seeds Hybrid", "Okra Seeds Arka Anamika", "Cucumber Seeds Hybrid",
            "Watermelon Seeds Sugar Baby", "Muskmelon Seeds Hara Madhu", "Bottle Gourd Seeds",
            "Ridge Gourd Seeds", "Bitter Gourd Seeds", "Pumpkin Seeds", "Radish Seeds",
            "Spinach Seeds All Green", "Coriander Seeds Pant Haritima", "Fenugreek Seeds",
            "Fennel Seeds", "Cumin Seeds", "Sesame Seeds", "Groundnut Seeds",
            "Bajra Seeds Hybrid", "Jowar Seeds", "Ragi Seeds", "Barley Seeds"
        ]

        pesticide_names = [
            "Chlorpyrifos 20% EC 1L", "Imidacloprid 17.8% SL 250ml", "2,4-D Herbicide 500ml",
            "Glyphosate 41% SL 1L", "Mancozeb 75% WP 1kg", "Carbendazim 50% WP 500g",
            "Lambda Cyhalothrin 5% EC", "Atrazine 50% WP 1kg", "Paraquat Dichloride 24% SL",
            "Copper Oxychloride 50% WP", "Thiamethoxam 25% WG", "Acetamiprid 20% SP",
            "Cypermethrin 10% EC", "Malathion 50% EC", "Dimethoate 30% EC",
            "Monocrotophos 36% SL", "Profenofos 50% EC", "Quinalphos 25% EC",
            "Triazophos 40% EC", "Endosulfan 35% EC", "Dichlorvos 76% EC",
            "Phorate 10% CG", "Carbofuran 3% CG", "Fipronil 5% SC"
        ]

        equipment_names = [
            "Drip Irrigation Kit 1 Acre", "Sprinkler System Complete", "Water Pump 3HP",
            "Tractor Rotavator 7ft", "Cultivator 9 Tyne", "Disc Harrow 20 Disc",
            "Seed Drill 9 Tyne", "Thresher Machine", "Chaff Cutter Manual",
            "Winnowing Fan", "Spray Pump 16L", "Knapsack Sprayer",
            "Power Weeder", "Brush Cutter", "Hedge Trimmer",
            "Garden Tools Set", "Pruning Shears", "Watering Can 10L",
            "Mulching Film", "Shade Net 50%", "Anti Bird Net",
            "Greenhouse Kit Small", "Poly House Material", "Fogger System"
        ]

        all_names = fertilizer_names + seed_names + pesticide_names + equipment_names
        categories = (["Fertilizers"] * len(fertilizer_names) +
                     ["Seeds"] * len(seed_names) +
                     ["Pesticides"] * len(pesticide_names) +
                     ["Farm Equipment"] * len(equipment_names))

        for i in range(min(count, len(all_names))):
            price = random.randint(100, 5000)
            original_price = price + random.randint(50, 500) if random.choice([True, False]) else None

            sample_products.append(Product(
                name=all_names[i],
                price=f"₹{price}",
                original_price=f"₹{original_price}" if original_price else None,
                image_url=self.get_sample_image_url(all_names[i], categories[i]),
                description=f"High quality {all_names[i].lower()} for better crop yield and farming productivity.",
                category=categories[i],
                brand=random.choice([
                    "AgroTech", "FarmPro", "GreenGrow", "CropMax", "AgriStar",
                    "BioFarm", "EcoGreen", "NutriCrop", "HarvestMax", "SeedMaster",
                    "FertilePlus", "OrganicPro", "CropCare", "AgriBoost", "FarmFresh"
                ]),
                availability="In Stock" if random.choice([True, True, True, False]) else "Out of Stock",
                rating=round(random.uniform(3.5, 5.0), 1),
                reviews_count=random.randint(10, 500),
                source_url=f"https://example.com/product/{i+1}",
                source_site="Sample Data"
            ))

        return sample_products


def main():
    """Main function to run the scraper"""
    scraper = AgriScraper()

    # Option 1: Scrape real websites (be respectful of rate limits)
    print("🌾 Starting Agricultural Product Scraping...")
    print("⚠️  Please ensure you comply with website terms of service")

    choice = input("Choose option:\n1. Scrape real websites\n2. Generate sample data\nEnter choice (1/2): ")

    if choice == "1":
        products = scraper.scrape_all_sites(max_pages_per_site=2)
    else:
        products = scraper.generate_sample_data(100)

    if products:
        # Save to JSON
        scraper.save_to_json(products, "agrokart_products.json")

        # Optionally save to Firebase (uncomment if you have Firebase setup)
        # scraper.save_to_firebase(products)

        print(f"✅ Successfully scraped {len(products)} products!")
        print(f"📊 Categories found: {set(p.category for p in products)}")

        # Display sample products
        print("\n📦 Sample Products:")
        for i, product in enumerate(products[:5]):
            print(f"{i+1}. {product.name} - {product.price} ({product.category})")

    else:
        print("❌ No products were scraped")


if __name__ == "__main__":
    main()
