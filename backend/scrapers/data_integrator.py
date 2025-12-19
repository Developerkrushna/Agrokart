#!/usr/bin/env python3
"""
Data Integration Script for Agrokart
Imports scraped agricultural product data into the backend database
"""

import json
import sqlite3
import logging
from typing import List, Dict
from datetime import datetime
import os
import sys

# Add parent directory to path to import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

logger = logging.getLogger(__name__)

class AgrokartDataIntegrator:
    """Integrates scraped data into Agrokart database"""
    
    def __init__(self, db_path: str = "../database.db"):
        self.db_path = db_path
        self.setup_database()
        
    def setup_database(self):
        """Setup database tables for products"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create products table if not exists
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    price REAL NOT NULL,
                    original_price REAL,
                    category TEXT NOT NULL,
                    brand TEXT,
                    image_url TEXT,
                    availability TEXT DEFAULT 'In Stock',
                    rating REAL,
                    reviews_count INTEGER,
                    source_url TEXT,
                    source_site TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create categories table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    image_url TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create brands table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS brands (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    logo_url TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database tables created/verified successfully")
            
        except Exception as e:
            logger.error(f"Error setting up database: {e}")
            raise
            
    def load_json_data(self, json_file: str) -> List[Dict]:
        """Load product data from JSON file"""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            if isinstance(data, dict) and 'products' in data:
                return data['products']
            elif isinstance(data, list):
                return data
            else:
                logger.error("Invalid JSON format")
                return []
                
        except Exception as e:
            logger.error(f"Error loading JSON data: {e}")
            return []
            
    def clean_price(self, price_str: str) -> float:
        """Clean and convert price string to float"""
        if not price_str:
            return 0.0
            
        # Remove currency symbols and spaces
        import re
        price_clean = re.sub(r'[₹$€£,\s]', '', str(price_str))
        
        try:
            return float(price_clean)
        except ValueError:
            return 0.0
            
    def insert_categories(self, categories: List[str]):
        """Insert unique categories into database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            for category in set(categories):
                cursor.execute('''
                    INSERT OR IGNORE INTO categories (name, description)
                    VALUES (?, ?)
                ''', (category, f"Agricultural products in {category} category"))
                
            conn.commit()
            conn.close()
            logger.info(f"Inserted {len(set(categories))} categories")
            
        except Exception as e:
            logger.error(f"Error inserting categories: {e}")
            
    def insert_brands(self, brands: List[str]):
        """Insert unique brands into database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            for brand in set(filter(None, brands)):  # Filter out empty brands
                cursor.execute('''
                    INSERT OR IGNORE INTO brands (name, description)
                    VALUES (?, ?)
                ''', (brand, f"Agricultural products by {brand}"))
                
            conn.commit()
            conn.close()
            logger.info(f"Inserted {len(set(filter(None, brands)))} brands")
            
        except Exception as e:
            logger.error(f"Error inserting brands: {e}")
            
    def insert_products(self, products: List[Dict]) -> int:
        """Insert products into database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            inserted_count = 0
            
            for product in products:
                try:
                    # Clean and prepare data
                    name = product.get('name', '').strip()
                    if not name:
                        continue
                        
                    price = self.clean_price(product.get('price', '0'))
                    original_price = self.clean_price(product.get('original_price')) if product.get('original_price') else None
                    
                    # Check if product already exists (by name and price)
                    cursor.execute('''
                        SELECT id FROM products WHERE name = ? AND price = ?
                    ''', (name, price))
                    
                    if cursor.fetchone():
                        continue  # Skip duplicate
                        
                    # Insert product
                    cursor.execute('''
                        INSERT INTO products (
                            name, description, price, original_price, category,
                            brand, image_url, availability, rating, reviews_count,
                            source_url, source_site
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        name,
                        product.get('description', ''),
                        price,
                        original_price,
                        product.get('category', 'General'),
                        product.get('brand', ''),
                        product.get('image_url', ''),
                        product.get('availability', 'In Stock'),
                        product.get('rating'),
                        product.get('reviews_count'),
                        product.get('source_url', ''),
                        product.get('source_site', '')
                    ))
                    
                    inserted_count += 1
                    
                except Exception as e:
                    logger.error(f"Error inserting product {product.get('name', 'Unknown')}: {e}")
                    continue
                    
            conn.commit()
            conn.close()
            logger.info(f"Inserted {inserted_count} products into database")
            return inserted_count
            
        except Exception as e:
            logger.error(f"Error inserting products: {e}")
            return 0
            
    def integrate_scraped_data(self, json_file: str) -> Dict[str, int]:
        """Main integration function"""
        logger.info(f"Starting data integration from {json_file}")
        
        # Load data
        products = self.load_json_data(json_file)
        if not products:
            logger.error("No products loaded from JSON file")
            return {"products": 0, "categories": 0, "brands": 0}
            
        # Extract categories and brands
        categories = [p.get('category', 'General') for p in products]
        brands = [p.get('brand', '') for p in products if p.get('brand')]
        
        # Insert data
        self.insert_categories(categories)
        self.insert_brands(brands)
        products_inserted = self.insert_products(products)
        
        result = {
            "products": products_inserted,
            "categories": len(set(categories)),
            "brands": len(set(filter(None, brands)))
        }
        
        logger.info(f"Integration completed: {result}")
        return result
        
    def get_database_stats(self) -> Dict[str, int]:
        """Get current database statistics"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Count products
            cursor.execute("SELECT COUNT(*) FROM products")
            products_count = cursor.fetchone()[0]
            
            # Count categories
            cursor.execute("SELECT COUNT(*) FROM categories")
            categories_count = cursor.fetchone()[0]
            
            # Count brands
            cursor.execute("SELECT COUNT(*) FROM brands")
            brands_count = cursor.fetchone()[0]
            
            conn.close()
            
            return {
                "products": products_count,
                "categories": categories_count,
                "brands": brands_count
            }
            
        except Exception as e:
            logger.error(f"Error getting database stats: {e}")
            return {"products": 0, "categories": 0, "brands": 0}
            
    def export_to_json(self, output_file: str = "agrokart_database_export.json"):
        """Export database products to JSON for frontend"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get all products with category and brand info
            cursor.execute('''
                SELECT 
                    p.id, p.name, p.description, p.price, p.original_price,
                    p.category, p.brand, p.image_url, p.availability,
                    p.rating, p.reviews_count, p.source_url, p.source_site,
                    p.created_at
                FROM products p
                ORDER BY p.created_at DESC
            ''')
            
            products = []
            for row in cursor.fetchall():
                products.append({
                    "id": row[0],
                    "name": row[1],
                    "description": row[2],
                    "price": row[3],
                    "original_price": row[4],
                    "category": row[5],
                    "brand": row[6],
                    "image_url": row[7],
                    "availability": row[8],
                    "rating": row[9],
                    "reviews_count": row[10],
                    "source_url": row[11],
                    "source_site": row[12],
                    "created_at": row[13]
                })
                
            # Get categories
            cursor.execute("SELECT name FROM categories ORDER BY name")
            categories = [row[0] for row in cursor.fetchall()]
            
            # Get brands
            cursor.execute("SELECT name FROM brands WHERE name != '' ORDER BY name")
            brands = [row[0] for row in cursor.fetchall()]
            
            conn.close()
            
            # Export data
            export_data = {
                "products": products,
                "categories": categories,
                "brands": brands,
                "total_products": len(products),
                "exported_at": datetime.now().isoformat()
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)
                
            logger.info(f"Database exported to {output_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error exporting database: {e}")
            return False


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Integrate scraped data into Agrokart database")
    parser.add_argument("--json-file", required=True, help="JSON file with scraped products")
    parser.add_argument("--db-path", default="../database.db", help="Database file path")
    parser.add_argument("--export", action="store_true", help="Export database to JSON after integration")
    
    args = parser.parse_args()
    
    # Setup logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    try:
        integrator = AgrokartDataIntegrator(args.db_path)
        
        # Show current stats
        print("📊 Current Database Stats:")
        current_stats = integrator.get_database_stats()
        for key, value in current_stats.items():
            print(f"   {key.title()}: {value}")
            
        # Integrate data
        print(f"\n🔄 Integrating data from {args.json_file}...")
        result = integrator.integrate_scraped_data(args.json_file)
        
        print("\n✅ Integration Results:")
        for key, value in result.items():
            print(f"   {key.title()} Added: {value}")
            
        # Show new stats
        print("\n📊 Updated Database Stats:")
        new_stats = integrator.get_database_stats()
        for key, value in new_stats.items():
            print(f"   {key.title()}: {value}")
            
        # Export if requested
        if args.export:
            print("\n📤 Exporting database to JSON...")
            if integrator.export_to_json():
                print("✅ Export completed successfully")
            else:
                print("❌ Export failed")
                
    except Exception as e:
        print(f"❌ Integration failed: {e}")
        logger.error(f"Integration failed: {e}")


if __name__ == "__main__":
    main()
