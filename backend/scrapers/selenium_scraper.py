#!/usr/bin/env python3
"""
Advanced Agricultural Product Scraper using Selenium
For websites with dynamic content and JavaScript
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import json
import time
import logging
from typing import List, Dict
from agri_scraper import Product, AgriScraper
import random

logger = logging.getLogger(__name__)

class SeleniumAgriScraper(AgriScraper):
    """Advanced scraper using Selenium for dynamic content"""
    
    def __init__(self, headless=True):
        super().__init__()
        self.driver = None
        self.headless = headless
        self.setup_driver()
        
    def setup_driver(self):
        """Setup Chrome WebDriver with options"""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument("--headless")
            
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        # Disable images and CSS for faster loading
        prefs = {
            "profile.managed_default_content_settings.images": 2,
            "profile.default_content_setting_values.notifications": 2
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            logger.info("Chrome WebDriver initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            raise
            
    def wait_for_element(self, by, value, timeout=10):
        """Wait for element to be present"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element
        except TimeoutException:
            logger.warning(f"Element not found: {by}={value}")
            return None
            
    def scroll_to_load_more(self, max_scrolls=5):
        """Scroll down to load more products (for infinite scroll)"""
        for i in range(max_scrolls):
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            
            # Check if "Load More" button exists and click it
            try:
                load_more_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Load More') or contains(text(), 'Show More')]")
                if load_more_btn.is_displayed():
                    load_more_btn.click()
                    time.sleep(3)
            except NoSuchElementException:
                pass
                
    def scrape_krishijagran_shop(self, max_pages=3) -> List[Product]:
        """Scrape Krishi Jagran Shop (example dynamic site)"""
        logger.info("Starting Krishi Jagran Shop scraping...")
        products = []
        
        base_url = "https://shop.krishijagran.com"
        categories = [
            "/fertilizers",
            "/seeds",
            "/pesticides-insecticides"
        ]
        
        for category in categories:
            try:
                url = f"{base_url}{category}"
                logger.info(f"Scraping: {url}")
                
                self.driver.get(url)
                time.sleep(3)
                
                # Wait for products to load
                self.wait_for_element(By.CLASS_NAME, "product-item", timeout=15)
                
                # Scroll to load more products
                self.scroll_to_load_more()
                
                # Extract products
                product_elements = self.driver.find_elements(By.CSS_SELECTOR, ".product-item, .product-card, [data-product-id]")
                
                for element in product_elements:
                    try:
                        product = self.extract_dynamic_product(element, base_url, category)
                        if product:
                            products.append(product)
                    except Exception as e:
                        logger.error(f"Error extracting product: {e}")
                        continue
                        
                self.random_delay(2, 4)
                
            except Exception as e:
                logger.error(f"Error scraping {url}: {e}")
                continue
                
        logger.info(f"Krishi Jagran Shop scraping completed. Found {len(products)} products")
        return products
        
    def extract_dynamic_product(self, element, base_url, category) -> Product:
        """Extract product from dynamic element"""
        try:
            # Product name
            name_selectors = [
                ".product-title", ".product-name", "h3", "h4", 
                "[data-product-title]", ".title"
            ]
            name = self.find_text_by_selectors(element, name_selectors) or "Unknown Product"
            
            # Price
            price_selectors = [
                ".price", ".product-price", ".money", ".cost",
                "[data-price]", ".price-current"
            ]
            price = self.find_text_by_selectors(element, price_selectors) or "0"
            price = self.extract_price(price)
            
            # Original price
            original_price_selectors = [
                ".price-original", ".was-price", ".strike", ".old-price"
            ]
            original_price = self.find_text_by_selectors(element, original_price_selectors)
            original_price = self.extract_price(original_price) if original_price else None
            
            # Image
            img_selectors = ["img", ".product-image img", ".image img"]
            image_url = self.find_image_by_selectors(element, img_selectors, base_url)
            
            # Product URL
            link_selectors = ["a", ".product-link"]
            product_url = self.find_link_by_selectors(element, link_selectors, base_url)
            
            # Brand
            brand_selectors = [".brand", ".manufacturer", "[data-brand]"]
            brand = self.find_text_by_selectors(element, brand_selectors) or ""
            
            # Rating
            rating_selectors = [".rating", ".stars", "[data-rating]"]
            rating_text = self.find_text_by_selectors(element, rating_selectors)
            rating = self.extract_rating(rating_text) if rating_text else None
            
            category_name = category.split('/')[-1].replace('-', ' ').title()
            
            return Product(
                name=self.clean_text(name),
                price=price,
                original_price=original_price,
                image_url=image_url,
                description="",
                category=category_name,
                brand=self.clean_text(brand),
                availability="Available",
                rating=rating,
                reviews_count=None,
                source_url=product_url,
                source_site="Krishi Jagran Shop"
            )
            
        except Exception as e:
            logger.error(f"Error extracting dynamic product: {e}")
            return None
            
    def find_text_by_selectors(self, element, selectors: List[str]) -> str:
        """Find text using multiple CSS selectors"""
        for selector in selectors:
            try:
                found_element = element.find_element(By.CSS_SELECTOR, selector)
                text = found_element.text.strip()
                if text:
                    return text
            except NoSuchElementException:
                continue
        return ""
        
    def find_image_by_selectors(self, element, selectors: List[str], base_url: str) -> str:
        """Find image URL using multiple selectors"""
        for selector in selectors:
            try:
                img_element = element.find_element(By.CSS_SELECTOR, selector)
                img_url = img_element.get_attribute('src') or img_element.get_attribute('data-src')
                if img_url:
                    if not img_url.startswith('http'):
                        img_url = base_url + img_url if img_url.startswith('/') else base_url + '/' + img_url
                    return img_url
            except NoSuchElementException:
                continue
        return ""
        
    def find_link_by_selectors(self, element, selectors: List[str], base_url: str) -> str:
        """Find product link using multiple selectors"""
        for selector in selectors:
            try:
                link_element = element.find_element(By.CSS_SELECTOR, selector)
                link_url = link_element.get_attribute('href')
                if link_url:
                    if not link_url.startswith('http'):
                        link_url = base_url + link_url if link_url.startswith('/') else base_url + '/' + link_url
                    return link_url
            except NoSuchElementException:
                continue
        return ""
        
    def extract_rating(self, rating_text: str) -> float:
        """Extract rating from text"""
        import re
        if not rating_text:
            return None
        rating_match = re.search(r'(\d+\.?\d*)', rating_text)
        if rating_match:
            rating = float(rating_match.group(1))
            return min(rating, 5.0)  # Cap at 5.0
        return None
        
    def scrape_with_selenium(self, sites: List[str] = None) -> List[Product]:
        """Scrape multiple sites using Selenium"""
        all_products = []
        
        if not sites:
            sites = ["krishijagran"]
            
        for site in sites:
            try:
                if site == "krishijagran":
                    products = self.scrape_krishijagran_shop()
                    all_products.extend(products)
                # Add more sites here
                    
            except Exception as e:
                logger.error(f"Error scraping {site}: {e}")
                continue
                
        return self.remove_duplicates(all_products)
        
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            logger.info("WebDriver closed")
            
    def __del__(self):
        """Cleanup when object is destroyed"""
        self.close()


def main():
    """Main function for Selenium scraper"""
    scraper = None
    try:
        print("🚀 Starting Advanced Agricultural Product Scraping with Selenium...")
        
        scraper = SeleniumAgriScraper(headless=True)
        
        # Scrape products
        products = scraper.scrape_with_selenium()
        
        if products:
            # Save results
            scraper.save_to_json(products, "selenium_agri_products.json")
            
            print(f"✅ Successfully scraped {len(products)} products with Selenium!")
            print(f"📊 Categories: {set(p.category for p in products)}")
            
            # Show sample
            for i, product in enumerate(products[:3]):
                print(f"{i+1}. {product.name} - {product.price}")
                
        else:
            print("❌ No products were scraped")
            
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        print(f"❌ Scraping failed: {e}")
        
    finally:
        if scraper:
            scraper.close()


if __name__ == "__main__":
    main()
