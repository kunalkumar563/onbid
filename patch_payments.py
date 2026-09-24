import re

with open('apps/api/src/modules/payments/payments.module.ts', 'r') as f:
    content = f.read()

old_exports = "exports: [PaymentsService],"
new_exports = "exports: [PaymentsService, RazorpayService],"

content = content.replace(old_exports, new_exports)

with open('apps/api/src/modules/payments/payments.module.ts', 'w') as f:
    f.write(content)

