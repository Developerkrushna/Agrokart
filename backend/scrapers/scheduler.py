#!/usr/bin/env python3
"""
Automated Scraping Scheduler for AgiNet
Runs scraping tasks on schedule and updates database
"""

import schedule
import time
import logging
from datetime import datetime
import os
import json
from agri_scraper import AgriScraper
from selenium_scraper import SeleniumAgriScraper
from data_integrator import AgiNetDataIntegrator

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ScrapingScheduler:
    """Manages scheduled scraping tasks"""
    
    def __init__(self):
        self.scraper = AgriScraper()
        self.selenium_scraper = None
        self.integrator = AgiNetDataIntegrator()
        self.last_run = None
        
    def run_basic_scraping(self):
        """Run basic scraping with requests/BeautifulSoup"""
        try:
            logger.info("🌾 Starting scheduled basic scraping...")

            # Try real scraping first, fallback to sample data
            try:
                logger.info("Attempting real website scraping...")
                products = self.scraper.scrape_all_sites(max_pages_per_site=2)
                if not products:
                    logger.warning("No products from real scraping, using sample data")
                    products = self.scraper.generate_sample_data(100)
            except Exception as e:
                logger.warning(f"Real scraping failed: {e}, using sample data")
                products = self.scraper.generate_sample_data(100)
            
            if products:
                # Save to JSON
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                json_file = f"scheduled_scrape_{timestamp}.json"
                
                if self.scraper.save_to_json(products, json_file):
                    # Integrate into database
                    result = self.integrator.integrate_scraped_data(json_file)
                    logger.info(f"✅ Basic scraping completed: {result}")
                    
                    # Cleanup old JSON files (keep last 5)
                    self.cleanup_old_files("scheduled_scrape_*.json", keep=5)
                    
                else:
                    logger.error("❌ Failed to save scraped data")
            else:
                logger.warning("⚠️ No products scraped")
                
            self.last_run = datetime.now()
            
        except Exception as e:
            logger.error(f"❌ Basic scraping failed: {e}")
            
    def run_selenium_scraping(self):
        """Run advanced scraping with Selenium"""
        try:
            logger.info("🚀 Starting scheduled Selenium scraping...")

            self.selenium_scraper = SeleniumAgriScraper(headless=True)

            # Try real Selenium scraping first, fallback to sample data
            try:
                logger.info("Attempting Selenium website scraping...")
                products = self.selenium_scraper.scrape_with_selenium()
                if not products:
                    logger.warning("No products from Selenium scraping, using sample data")
                    products = self.selenium_scraper.generate_sample_data(50)
            except Exception as e:
                logger.warning(f"Selenium scraping failed: {e}, using sample data")
                products = self.selenium_scraper.generate_sample_data(50)
            
            if products:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                json_file = f"selenium_scrape_{timestamp}.json"
                
                if self.selenium_scraper.save_to_json(products, json_file):
                    result = self.integrator.integrate_scraped_data(json_file)
                    logger.info(f"✅ Selenium scraping completed: {result}")
                    
                    self.cleanup_old_files("selenium_scrape_*.json", keep=3)
                else:
                    logger.error("❌ Failed to save Selenium scraped data")
            else:
                logger.warning("⚠️ No products scraped with Selenium")
                
        except Exception as e:
            logger.error(f"❌ Selenium scraping failed: {e}")
            
        finally:
            if self.selenium_scraper:
                self.selenium_scraper.close()
                self.selenium_scraper = None
                
    def cleanup_old_files(self, pattern: str, keep: int = 5):
        """Clean up old scraping files"""
        try:
            import glob
            files = glob.glob(pattern)
            files.sort(key=os.path.getmtime, reverse=True)
            
            # Remove old files
            for file in files[keep:]:
                os.remove(file)
                logger.info(f"🗑️ Removed old file: {file}")
                
        except Exception as e:
            logger.error(f"Error cleaning up files: {e}")
            
    def export_database(self):
        """Export database for frontend"""
        try:
            logger.info("📤 Exporting database...")
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            export_file = f"agrokart_export_{timestamp}.json"
            
            if self.integrator.export_to_json(export_file):
                logger.info(f"✅ Database exported to {export_file}")
                
                # Copy to frontend data directory if it exists
                frontend_data_dir = "../../frontend/src/data"
                if os.path.exists(frontend_data_dir):
                    import shutil
                    shutil.copy(export_file, os.path.join(frontend_data_dir, "products.json"))
                    logger.info("📋 Copied export to frontend data directory")
                    
            else:
                logger.error("❌ Database export failed")
                
        except Exception as e:
            logger.error(f"❌ Database export failed: {e}")
            
    def get_status(self) -> dict:
        """Get scheduler status"""
        stats = self.integrator.get_database_stats()
        
        return {
            "last_run": self.last_run.isoformat() if self.last_run else None,
            "database_stats": stats,
            "next_basic_run": schedule.next_run(),
            "scheduler_active": True
        }
        
    def save_status(self):
        """Save status to file"""
        try:
            status = self.get_status()
            with open("scheduler_status.json", "w") as f:
                json.dump(status, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving status: {e}")


def setup_schedule():
    """Setup scraping schedule"""
    scheduler = ScrapingScheduler()

    # Schedule basic scraping every 4 hours for fresh data
    schedule.every(4).hours.do(scheduler.run_basic_scraping)

    # Schedule Selenium scraping twice daily (2 AM and 2 PM)
    schedule.every().day.at("02:00").do(scheduler.run_selenium_scraping)
    schedule.every().day.at("14:00").do(scheduler.run_selenium_scraping)

    # Schedule database export every 6 hours for frontend sync
    schedule.every(6).hours.do(scheduler.export_database)

    # Schedule status save every 30 minutes for monitoring
    schedule.every(30).minutes.do(scheduler.save_status)

    logger.info("📅 Enhanced scraping schedule configured:")
    logger.info("   - Basic scraping: Every 4 hours")
    logger.info("   - Selenium scraping: Twice daily (2 AM & 2 PM)")
    logger.info("   - Database export: Every 6 hours")
    logger.info("   - Status update: Every 30 minutes")

    return scheduler

def run_scheduler():
    """Run the scheduler"""
    scheduler = setup_schedule()
    
    # Run initial scraping
    logger.info("🚀 Running initial scraping...")
    scheduler.run_basic_scraping()
    scheduler.export_database()
    scheduler.save_status()
    
    logger.info("⏰ Scheduler started. Press Ctrl+C to stop.")
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
            
    except KeyboardInterrupt:
        logger.info("🛑 Scheduler stopped by user")
        
    except Exception as e:
        logger.error(f"❌ Scheduler error: {e}")
        
    finally:
        if scheduler.selenium_scraper:
            scheduler.selenium_scraper.close()

def run_once():
    """Run scraping once and exit"""
    scheduler = ScrapingScheduler()
    
    print("🌾 Running one-time scraping...")
    
    # Run basic scraping
    scheduler.run_basic_scraping()
    
    # Export database
    scheduler.export_database()
    
    # Show stats
    stats = scheduler.get_status()
    print("\n📊 Final Stats:")
    for key, value in stats["database_stats"].items():
        print(f"   {key.title()}: {value}")
        
    print("✅ One-time scraping completed!")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="AgiNet Scraping Scheduler")
    parser.add_argument("--mode", choices=["schedule", "once"], default="once",
                       help="Run mode: 'schedule' for continuous, 'once' for single run")
    
    args = parser.parse_args()
    
    if args.mode == "schedule":
        run_scheduler()
    else:
        run_once()

if __name__ == "__main__":
    main()
