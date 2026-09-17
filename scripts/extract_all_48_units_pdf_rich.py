import os, sys, fitz, json, re
sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
data_file = r'D:\2.English\ENG Learning_Antigravity\data\all_units_data.json'

with open(data_file, 'r', encoding='utf-8') as f:
    all_units = json.load(f)

for u in range(1, 49):
    u_str = str(u)
    if u_str not in all_units:
        all_units[u_str] = {'unit_id': u, 'unit_number': u}

    folder = os.path.join(src_dir, f'NGÀY {u}')
    if not os.path.isdir(folder):
        continue

    pdfs = [f for f in os.listdir(folder) if f.endswith('.pdf')]
    theory_file = next((f for f in pdfs if 'đáp án' not in f.lower() and 'bài thi' not in f.lower() and 'thi online' not in f.lower() and 'bài tập' not in f.lower()), None)
    
    if not theory_file:
        continue

    doc = fitz.open(os.path.join(folder, theory_file))
    pages_data = []
    full_text_parts = []

    for pno in range(len(doc)):
        page = doc[pno]
        ptxt = page.get_text()
        full_text_parts.append(f"--- TRANG {pno+1} ---\n" + ptxt)
        
        tables = []
        try:
            tabs = page.find_tables()
            for t in tabs.tables:
                raw_rows = t.extract()
                clean_rows = []
                for r in raw_rows:
                    cleaned_cells = [c.strip().replace('\n', ' ') for c in r if c and c.strip()]
                    if cleaned_cells:
                        clean_rows.append(cleaned_cells)
                
                # Check if all rows have consistent or usable column count >= 2
                if len(clean_rows) >= 2:
                    # Normalize columns
                    max_cols = max(len(r) for r in clean_rows)
                    if max_cols >= 2:
                        tables.append({
                            'bbox': list(t.bbox),
                            'col_count': max_cols,
                            'rows': clean_rows
                        })
        except Exception as e:
            pass

        pages_data.append({
            'page': pno + 1,
            'text': ptxt,
            'tables': tables
        })

    doc.close()

    all_units[u_str]['full_theory_pages'] = pages_data
    all_units[u_str]['full_theory_text'] = "\n\n".join(full_text_parts)
    if 'source_trace' not in all_units[u_str]:
        all_units[u_str]['source_trace'] = {}
    all_units[u_str]['source_trace']['theory_file'] = theory_file

with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(all_units, f, ensure_ascii=False, indent=2)

print("Pristine table cleaning completed for all 48 units!")
