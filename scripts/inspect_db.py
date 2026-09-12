import sqlite3
import json

conn = sqlite3.connect(r'C:\Users\Admin\.gemini\antigravity-ide\brain\319d43f5-0571-43aa-b298-d633acb3253a\scratch\smob_english_lab_schema.db')
c = conn.cursor()
tables = c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print('Tables in DB:', tables)
for t in tables:
    name = t[0]
    count = c.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]
    print(f'  {name}: {count} rows')
    # show first row
    first = c.execute(f"SELECT * FROM {name} LIMIT 1").fetchone()
    if first:
        cols = [d[0] for d in c.description]
        print(f'    sample cols: {cols}')
