import re

with open('apps/web/src/pages/home/HomeHeader.tsx', 'r') as f:
    content = f.read()

# Fix inline styles for Home link
content = re.sub(r'<Link\s+to="/"\s+className="mobile-navigation-button".*?>\s*Home\s*</Link>',
                r'<Link to="/" className="mobile-navigation-item main-link" onClick={closeMobileMenu}>Home</Link>',
                content, flags=re.DOTALL)

# Fix inline styles for All Categories button
content = re.sub(r'<button\s+type="button"\s+className="mobile-navigation-button".*?>\s*All Categories\s*</button>',
                r'<button type="button" className="mobile-navigation-item main-link" onClick={handleAllCategories}>All Categories</button>',
                content, flags=re.DOTALL)

with open('apps/web/src/pages/home/HomeHeader.tsx', 'w') as f:
    f.write(content)

with open('apps/web/src/pages/home/Home.css', 'a') as f:
    f.write('''
/* MOBILE MENU SPECIFIC FIXES */
@media (max-width: 700px) {
  .mobile-search {
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid rgba(59, 32, 82, 0.17);
    border-radius: 24px;
    padding: 0 15px;
    height: 44px;
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .mobile-search span {
    display: flex;
    align-items: center;
    color: #888;
    margin-right: 10px;
  }
  .mobile-search input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    background: transparent;
  }
  
  .mobile-navigation-item.main-link {
    font-weight: 600 !important;
    font-size: 16px !important;
    color: var(--purple-dark) !important;
    padding: 12px 0 !important;
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;
    cursor: pointer;
  }
}
''')

