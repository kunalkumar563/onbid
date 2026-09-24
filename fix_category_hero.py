import re

with open('apps/web/src/pages/auctions/CategoryDashboard.css', 'r') as f:
    content = f.read()

old_mobile_hero = '''  .category-hero {
    flex-direction: column;
    height: auto;
    padding: 40px 5%;
    text-align: center;
  }
  
  .category-hero-image {
    margin-top: 30px;
  }
  
  .category-hero-image img {
    margin-right: 0;
    transform: none;
    height: 250px;
  }'''

new_mobile_hero = '''  .category-hero {
    flex-direction: row;
    height: 200px;
    padding: 20px 5%;
    text-align: left;
    justify-content: space-between;
  }
  
  .category-hero-content {
    flex: 1.5;
    z-index: 2;
  }
  
  .category-hero-image {
    flex: 1;
    margin-top: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .category-hero-image img {
    height: 120%;
    margin-right: -10%;
    transform: translateY(0);
    object-fit: contain;
  }'''

content = content.replace(old_mobile_hero, new_mobile_hero)

old_tiny_hero = '''  .category-hero {
    padding: 30px 15px;
  }'''

new_tiny_hero = '''  .category-hero {
    padding: 20px 15px;
    height: 180px;
  }
  .category-hero-image img {
    height: 100%;
    margin-right: -15%;
  }'''

content = content.replace(old_tiny_hero, new_tiny_hero)

# Fix subcategories text cut off (squished text in the screenshot, wait, the subcategories text looks overlapped)
# In the screenshot, "Mobile Phones", "Laptops & Compute...", "Audio & Headphone...", "Cameras & Photograph..."
# Let's fix that too.
old_sub_scroll = '''.subcategories-scroll {
  display: flex;
  gap: 40px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none;
}'''

new_sub_scroll = '''.subcategories-scroll {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 15px;
  scrollbar-width: none;
}'''

content = content.replace(old_sub_scroll, new_sub_scroll)

with open('apps/web/src/pages/auctions/CategoryDashboard.css', 'w') as f:
    f.write(content)
