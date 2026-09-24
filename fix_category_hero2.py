import re

with open('apps/web/src/pages/auctions/CategoryDashboard.css', 'r') as f:
    content = f.read()

# Replace the 480px media query
old_480 = '''@media (max-width: 480px) {
  .category-hero {
    padding: 20px 15px;
    height: 180px;
  }
  .category-hero-image img {
    height: 100%;
    margin-right: -15%;
  }
  .category-hero-content h1 {
    font-size: 28px;
  }
  .category-hero-content p {
    font-size: 14px;
  }
  .subcategories-section {
    padding: 20px 15px;
  }
  .featured-auctions-section {
    padding: 30px 15px;
  }
  .featured-header h2 {
    font-size: 20px;
  }
  .product-card {
    min-width: 240px;
  }
}'''

new_480 = '''@media (max-width: 480px) {
  .category-hero {
    padding: 20px 15px;
    height: 160px;
  }
  .category-hero-image img {
    height: 100%;
    margin-right: -15%;
  }
  .category-hero-content h1 {
    font-size: 20px !important;
    margin-bottom: 8px !important;
    line-height: 1.1 !important;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
  .category-hero-content p {
    font-size: 10px !important;
    margin-bottom: 12px !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }
  .category-hero-content .explore-btn {
    padding: 6px 12px !important;
    font-size: 11px !important;
  }
  .subcategories-section {
    padding: 20px 15px;
  }
  .featured-auctions-section {
    padding: 30px 15px;
  }
  .featured-header h2 {
    font-size: 18px;
  }
  .product-card {
    min-width: 200px;
  }
}'''

content = content.replace(old_480, new_480)

with open('apps/web/src/pages/auctions/CategoryDashboard.css', 'w') as f:
    f.write(content)

