#!/bin/bash
pip install -r requirements.txt
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

Then in Render Settings → **Build Command** change to:
```
bash build.sh