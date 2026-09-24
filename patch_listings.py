import re

with open('apps/api/src/modules/listings/listings.constants.ts', 'r') as f:
    content = f.read()

old_export = "export { CATEGORY_MIN_PRICE } from './category-taxonomy';"
new_export = "export { CATEGORY_MIN_PRICE, VALID_SUBCATEGORIES, VALID_SUBSUBCATEGORIES } from './category-taxonomy';"

content = content.replace(old_export, new_export)

with open('apps/api/src/modules/listings/listings.constants.ts', 'w') as f:
    f.write(content)
