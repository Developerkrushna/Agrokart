#!/usr/bin/env python3
"""
Auto-sync service for AgiNet
Automatically syncs scraped data to frontend and monitors for updates
"""

import os
import time
import shutil
import logging
from datetime import datetime
from pathlib import Path
from agri_scraper import AgriScraper
from data_integrator import AgiNetDataIntegrator

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('auto_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AutoSyncService:
    """Auto-sync service for continuous data updates"""
    
    def __init__(self):
        self.scraper = AgriScraper()
        self.integrator = AgiNetDataIntegrator()
        self.frontend_data_path = "../../frontend/src/data/products.json"
        self.last_sync = None
        self.sync_interval = 300  # 5 minutes
        
    def check_frontend_path(self):
        """Check if frontend data path exists"""
        frontend_dir = os.path.dirname(self.frontend_data_path)
        if not os.path.exists(frontend_dir):
            os.makedirs(frontend_dir, exist_ok=True)
            logger.info(f"Created frontend data directory: {frontend_dir}")
        return True
        
    def generate_fresh_data(self):
        """Generate fresh sample data"""
        try:
            logger.info("🌾 Generating fresh agricultural data...")
            
            # Generate new sample data with current timestamp
            products = self.scraper.generate_sample_data(100)
            
            if products:
                # Save to JSON
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                json_file = f"auto_sync_{timestamp}.json"
                
                if self.scraper.save_to_json(products, json_file):
                    logger.info(f"✅ Generated {len(products)} products")
                    return json_file
                else:
                    logger.error("❌ Failed to save generated data")
                    return None
            else:
                logger.warning("⚠️ No products generated")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error generating data: {e}")
            return None
            
    def sync_to_database(self, json_file):
        """Sync data to database"""
        try:
            logger.info("🔄 Syncing data to database...")
            
            result = self.integrator.integrate_scraped_data(json_file)
            
            if result['products'] > 0:
                logger.info(f"✅ Database sync completed: {result}")
                return True
            else:
                logger.warning("⚠️ No new products added to database")
                return False
                
        except Exception as e:
            logger.error(f"❌ Database sync failed: {e}")
            return False
            
    def export_to_frontend(self):
        """Export database to frontend JSON"""
        try:
            logger.info("📤 Exporting to frontend...")
            
            # Export to temporary file first
            temp_export = f"temp_export_{int(time.time())}.json"
            
            if self.integrator.export_to_json(temp_export):
                # Copy to frontend data directory
                if self.check_frontend_path():
                    shutil.copy(temp_export, self.frontend_data_path)
                    logger.info(f"✅ Frontend data updated: {self.frontend_data_path}")
                    
                    # Cleanup temp file
                    os.remove(temp_export)
                    return True
                else:
                    logger.error("❌ Frontend path check failed")
                    return False
            else:
                logger.error("❌ Export to JSON failed")
                return False
                
        except Exception as e:
            logger.error(f"❌ Frontend export failed: {e}")
            return False
            
    def get_sync_status(self):
        """Get current sync status"""
        try:
            stats = self.integrator.get_database_stats()
            
            # Check if frontend file exists and get its timestamp
            frontend_exists = os.path.exists(self.frontend_data_path)
            frontend_modified = None
            
            if frontend_exists:
                frontend_modified = datetime.fromtimestamp(
                    os.path.getmtime(self.frontend_data_path)
                ).isoformat()
            
            return {
                "database_stats": stats,
                "frontend_file_exists": frontend_exists,
                "frontend_last_modified": frontend_modified,
                "last_sync": self.last_sync.isoformat() if self.last_sync else None,
                "sync_interval_minutes": self.sync_interval / 60,
                "service_status": "running"
            }
            
        except Exception as e:
            logger.error(f"Error getting sync status: {e}")
            return {"error": str(e)}
            
    def run_sync_cycle(self):
        """Run one complete sync cycle"""
        try:
            logger.info("🚀 Starting sync cycle...")
            
            # Step 1: Generate fresh data
            json_file = self.generate_fresh_data()
            if not json_file:
                return False
                
            # Step 2: Sync to database
            if not self.sync_to_database(json_file):
                return False
                
            # Step 3: Export to frontend
            if not self.export_to_frontend():
                return False
                
            # Step 4: Update sync timestamp
            self.last_sync = datetime.now()
            
            # Step 5: Cleanup
            if os.path.exists(json_file):
                os.remove(json_file)
                
            logger.info("✅ Sync cycle completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Sync cycle failed: {e}")
            return False
            
    def run_continuous(self):
        """Run continuous auto-sync"""
        logger.info("🔄 Starting continuous auto-sync service...")
        logger.info(f"📅 Sync interval: {self.sync_interval / 60} minutes")
        
        # Run initial sync
        self.run_sync_cycle()
        
        try:
            while True:
                time.sleep(self.sync_interval)
                
                logger.info("⏰ Auto-sync interval reached")
                self.run_sync_cycle()
                
                # Log status
                status = self.get_sync_status()
                logger.info(f"📊 Current status: {status['database_stats']}")
                
        except KeyboardInterrupt:
            logger.info("🛑 Auto-sync service stopped by user")
        except Exception as e:
            logger.error(f"❌ Auto-sync service error: {e}")
            
    def run_once(self):
        """Run sync once and exit"""
        logger.info("🔄 Running one-time sync...")
        
        success = self.run_sync_cycle()
        
        if success:
            status = self.get_sync_status()
            logger.info("📊 Final Status:")
            for key, value in status["database_stats"].items():
                logger.info(f"   {key.title()}: {value}")
                
            logger.info("✅ One-time sync completed successfully")
        else:
            logger.error("❌ One-time sync failed")
            
        return success


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="AgiNet Auto-Sync Service")
    parser.add_argument("--mode", choices=["continuous", "once"], default="once",
                       help="Run mode: 'continuous' for auto-sync, 'once' for single sync")
    parser.add_argument("--interval", type=int, default=300,
                       help="Sync interval in seconds (default: 300 = 5 minutes)")
    
    args = parser.parse_args()
    
    # Create auto-sync service
    sync_service = AutoSyncService()
    sync_service.sync_interval = args.interval
    
    if args.mode == "continuous":
        sync_service.run_continuous()
    else:
        sync_service.run_once()


if __name__ == "__main__":
    main()
