# 🌾 Agrokart Web Scraping System

A comprehensive web scraping solution for agricultural products to populate your Agrokart mobile app with real fertilizer, seed, and farming supply data.

## 📋 Features

- **Multi-Site Scraping**: Supports BigHaat, AgroStar, and other agricultural websites
- **Dual Scraping Methods**: 
  - Basic scraping with `requests` + `BeautifulSoup`
  - Advanced scraping with `Selenium` for dynamic content
- **Data Integration**: Automatic database integration with SQLite
- **Scheduled Scraping**: Automated scraping with configurable schedules
- **Duplicate Removal**: Smart duplicate detection and removal
- **Export Functionality**: JSON export for frontend integration
- **Respectful Scraping**: Rate limiting and user-agent rotation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend/scrapers
pip install -r requirements.txt
```

### 2. Install Chrome WebDriver (for Selenium)

```bash
# Ubuntu/Debian
sudo apt-get install chromium-chromedriver

# macOS
brew install chromedriver

# Windows
# Download from https://chromedriver.chromium.org/
```

### 3. Run Basic Scraping

```bash
# Generate sample data (safe for testing)
python agri_scraper.py

# Run one-time scraping
python scheduler.py --mode once
```

### 4. Integrate Data into Database

```bash
python data_integrator.py --json-file agrokart_products.json --export
```

## 📁 File Structure

```
backend/scrapers/
├── agri_scraper.py          # Basic scraping with requests/BeautifulSoup
├── selenium_scraper.py      # Advanced scraping with Selenium
├── data_integrator.py       # Database integration
├── scheduler.py             # Automated scheduling
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🔧 Configuration

### Basic Scraper (`agri_scraper.py`)

```python
from agri_scraper import AgriScraper

scraper = AgriScraper()

# Scrape all supported sites
products = scraper.scrape_all_sites(max_pages_per_site=3)

# Save to JSON
scraper.save_to_json(products, "my_products.json")
```

### Selenium Scraper (`selenium_scraper.py`)

```python
from selenium_scraper import SeleniumAgriScraper

scraper = SeleniumAgriScraper(headless=True)
products = scraper.scrape_with_selenium()
scraper.save_to_json(products, "selenium_products.json")
scraper.close()
```

### Data Integration (`data_integrator.py`)

```python
from data_integrator import AgrokartDataIntegrator

integrator = AgrokartDataIntegrator("../database.db")
result = integrator.integrate_scraped_data("products.json")
integrator.export_to_json("frontend_products.json")
```

## ⏰ Scheduled Scraping

### Run Continuous Scheduler

```bash
python scheduler.py --mode schedule
```

**Default Schedule:**
- Basic scraping: Every 6 hours
- Selenium scraping: Daily at 2:00 AM
- Database export: Every 12 hours
- Status updates: Every hour

### Customize Schedule

Edit `scheduler.py`:

```python
# Custom schedule
schedule.every(4).hours.do(scheduler.run_basic_scraping)
schedule.every().day.at("01:00").do(scheduler.run_selenium_scraping)
```

## 🎯 Supported Websites

### Currently Implemented

1. **BigHaat** (`bighaat.com`)
   - Fertilizers, Seeds, Pesticides, Farm Implements
   - Basic scraping with requests

2. **AgroStar** (`agrostar.in`)
   - Agricultural products and supplies
   - Basic scraping with requests

3. **Sample Data Generator**
   - For testing and development
   - Generates realistic agricultural product data

### Adding New Sites

1. **For Basic Sites** (static content):

```python
def scrape_new_site(self, max_pages=3):
    base_url = "https://newsite.com"
    # Implement scraping logic
    return products
```

2. **For Dynamic Sites** (JavaScript content):

```python
def scrape_dynamic_site(self):
    self.driver.get("https://dynamicsite.com")
    # Implement Selenium logic
    return products
```

## 📊 Data Structure

### Product Schema

```json
{
  "name": "NPK 19:19:19 Fertilizer",
  "price": "₹450",
  "original_price": "₹500",
  "image_url": "https://example.com/image.jpg",
  "description": "High quality NPK fertilizer",
  "category": "Fertilizers",
  "brand": "AgroTech",
  "availability": "In Stock",
  "rating": 4.5,
  "reviews_count": 120,
  "source_url": "https://site.com/product/123",
  "source_site": "BigHaat"
}
```

### Database Tables

- **products**: Main product information
- **categories**: Product categories
- **brands**: Product brands

## 🛡️ Best Practices

### Respectful Scraping

1. **Rate Limiting**: Built-in delays between requests
2. **User Agents**: Rotating user agents to avoid detection
3. **Terms of Service**: Always check and comply with website ToS
4. **Server Load**: Don't overload target servers

### Error Handling

- Comprehensive try-catch blocks
- Logging for debugging
- Graceful degradation on failures
- Automatic retry mechanisms

### Data Quality

- Duplicate detection and removal
- Data validation and cleaning
- Price normalization
- Image URL validation

## 🔍 Monitoring

### Check Scraper Status

```bash
# View logs
tail -f scraper.log

# Check status file
cat scheduler_status.json
```

### Database Statistics

```python
from data_integrator import AgrokartDataIntegrator

integrator = AgrokartDataIntegrator()
stats = integrator.get_database_stats()
print(stats)  # {'products': 150, 'categories': 5, 'brands': 12}
```

## 🚨 Troubleshooting

### Common Issues

1. **ChromeDriver Not Found**
   ```bash
   # Install ChromeDriver
   sudo apt-get install chromium-chromedriver
   ```

2. **Website Blocking Requests**
   - Increase delays between requests
   - Use different user agents
   - Check if site requires authentication

3. **Database Locked**
   ```bash
   # Check if database is in use
   lsof database.db
   ```

4. **Memory Issues with Selenium**
   ```python
   # Use headless mode
   scraper = SeleniumAgriScraper(headless=True)
   ```

### Debug Mode

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Performance Optimization

### Speed Improvements

1. **Disable Images in Selenium**
   ```python
   prefs = {"profile.managed_default_content_settings.images": 2}
   chrome_options.add_experimental_option("prefs", prefs)
   ```

2. **Parallel Scraping**
   ```python
   from concurrent.futures import ThreadPoolExecutor
   
   with ThreadPoolExecutor(max_workers=3) as executor:
       futures = [executor.submit(scrape_site, site) for site in sites]
   ```

3. **Database Optimization**
   ```sql
   CREATE INDEX idx_product_name ON products(name);
   CREATE INDEX idx_product_category ON products(category);
   ```

## 🔐 Security Considerations

- Store sensitive data in environment variables
- Use VPN/proxy for large-scale scraping
- Implement request signing if required
- Regular security updates for dependencies

## 📝 Legal Compliance

⚠️ **Important**: Always ensure compliance with:

1. Website Terms of Service
2. robots.txt files
3. Rate limiting requirements
4. Data protection regulations (GDPR, etc.)
5. Copyright and intellectual property laws

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add new scrapers or improve existing ones
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues or questions:
- Check logs in `scraper.log`
- Review error messages
- Ensure all dependencies are installed
- Verify website accessibility

---

**Happy Scraping! 🌾🚀**
