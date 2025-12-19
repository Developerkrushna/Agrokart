#!/usr/bin/env python3
"""
Test Script for AgiNet Web Scraping System
Demonstrates scraping functionality with sample data
"""

import json
import time
from agri_scraper import AgriScraper
from data_integrator import AgiNetDataIntegrator

def test_basic_scraping():
    """Test basic scraping functionality"""
    print("🌾 Testing Basic Scraping...")
    
    scraper = AgriScraper()
    
    # Generate sample data for testing
    products = scraper.generate_sample_data(20)
    
    print(f"✅ Generated {len(products)} sample products")
    
    # Display sample products
    print("\n📦 Sample Products:")
    for i, product in enumerate(products[:5]):
        print(f"{i+1}. {product.name}")
        print(f"   Price: {product.price}")
        print(f"   Category: {product.category}")
        print(f"   Brand: {product.brand}")
        print()
    
    # Save to JSON
    json_file = "test_products.json"
    if scraper.save_to_json(products, json_file):
        print(f"✅ Products saved to {json_file}")
        return json_file
    else:
        print("❌ Failed to save products")
        return None

def test_data_integration(json_file):
    """Test database integration"""
    print("\n🔄 Testing Data Integration...")
    
    integrator = AgiNetDataIntegrator("test_database.db")
    
    # Show initial stats
    initial_stats = integrator.get_database_stats()
    print(f"📊 Initial Database Stats: {initial_stats}")
    
    # Integrate data
    result = integrator.integrate_scraped_data(json_file)
    print(f"✅ Integration Result: {result}")
    
    # Show final stats
    final_stats = integrator.get_database_stats()
    print(f"📊 Final Database Stats: {final_stats}")
    
    # Export for frontend
    export_file = "test_export.json"
    if integrator.export_to_json(export_file):
        print(f"✅ Database exported to {export_file}")
        return export_file
    else:
        print("❌ Export failed")
        return None

def test_json_structure(json_file):
    """Test JSON file structure"""
    print(f"\n📋 Testing JSON Structure: {json_file}")
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ JSON file loaded successfully")
        print(f"📊 Structure:")
        
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, list):
                    print(f"   {key}: {len(value)} items")
                else:
                    print(f"   {key}: {value}")
                    
            # Show sample product structure
            if 'products' in data and data['products']:
                print(f"\n📦 Sample Product Structure:")
                sample_product = data['products'][0]
                for key, value in sample_product.items():
                    print(f"   {key}: {value}")
                    
        return True
        
    except Exception as e:
        print(f"❌ JSON structure test failed: {e}")
        return False

def performance_test():
    """Test scraping performance"""
    print("\n⚡ Performance Test...")
    
    scraper = AgriScraper()
    
    # Test different data sizes
    sizes = [10, 50, 100]
    
    for size in sizes:
        start_time = time.time()
        products = scraper.generate_sample_data(size)
        generation_time = time.time() - start_time
        
        start_time = time.time()
        scraper.save_to_json(products, f"perf_test_{size}.json")
        save_time = time.time() - start_time
        
        print(f"📊 Size {size}:")
        print(f"   Generation: {generation_time:.3f}s")
        print(f"   Save: {save_time:.3f}s")
        print(f"   Rate: {size/generation_time:.1f} products/sec")

def cleanup_test_files():
    """Clean up test files"""
    import os
    import glob
    
    test_files = [
        "test_products.json",
        "test_database.db",
        "test_export.json"
    ] + glob.glob("perf_test_*.json")
    
    for file in test_files:
        try:
            if os.path.exists(file):
                os.remove(file)
                print(f"🗑️ Removed {file}")
        except Exception as e:
            print(f"⚠️ Could not remove {file}: {e}")

def main():
    """Run all tests"""
    print("🧪 AgiNet Scraping System Test Suite")
    print("=" * 50)
    
    try:
        # Test 1: Basic scraping
        json_file = test_basic_scraping()
        if not json_file:
            print("❌ Basic scraping test failed")
            return
        
        # Test 2: JSON structure
        if not test_json_structure(json_file):
            print("❌ JSON structure test failed")
            return
        
        # Test 3: Data integration
        export_file = test_data_integration(json_file)
        if not export_file:
            print("❌ Data integration test failed")
            return
        
        # Test 4: Export structure
        if not test_json_structure(export_file):
            print("❌ Export structure test failed")
            return
        
        # Test 5: Performance
        performance_test()
        
        print("\n🎉 All tests completed successfully!")
        print("\n📋 Test Summary:")
        print("   ✅ Basic scraping")
        print("   ✅ JSON structure validation")
        print("   ✅ Database integration")
        print("   ✅ Data export")
        print("   ✅ Performance testing")
        
        # Show final file sizes
        import os
        print(f"\n📁 Generated Files:")
        for file in [json_file, export_file]:
            if os.path.exists(file):
                size = os.path.getsize(file)
                print(f"   {file}: {size:,} bytes")
        
    except Exception as e:
        print(f"❌ Test suite failed: {e}")
        
    finally:
        # Cleanup
        cleanup_choice = input("\n🗑️ Clean up test files? (y/n): ").lower()
        if cleanup_choice == 'y':
            cleanup_test_files()
            print("✅ Cleanup completed")

if __name__ == "__main__":
    main()
