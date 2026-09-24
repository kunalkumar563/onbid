import re

with open('apps/web/src/pages/home/HomeHeader.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAuth } from "../../context/AuthContext";')

with open('apps/web/src/pages/home/HomeHeader.tsx', 'w') as f:
    f.write(content)

