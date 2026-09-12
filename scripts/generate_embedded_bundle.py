import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(base_dir, 'data')
js_dir = os.path.join(base_dir, 'js')

with open(os.path.join(data_dir, 'units.json'), encoding='utf-8') as f:
    units_catalog = json.load(f)

with open(os.path.join(data_dir, 'all_units_data.json'), encoding='utf-8') as f:
    all_units_data = json.load(f)

with open(os.path.join(data_dir, 'irregular_verbs.json'), encoding='utf-8') as f:
    irregular_verbs = json.load(f)

out_file = os.path.join(js_dir, 'embedded_data.js')
with open(out_file, 'w', encoding='utf-8') as f:
    f.write("// SMOB English Lab - Complete 48 Units Embedded Learning Data Bundle\n")
    f.write("// Strictly extracted 100% from local source files\n\n")
    
    f.write("window.SMOB_UNITS = ")
    json.dump(units_catalog, f, ensure_ascii=False)
    f.write(";\n\n")
    
    f.write("window.SMOB_ALL_DATA = ")
    json.dump(all_units_data, f, ensure_ascii=False)
    f.write(";\n\n")
    
    f.write("window.SMOB_IRREGULAR_VERBS = ")
    json.dump(irregular_verbs, f, ensure_ascii=False)
    f.write(";\n\n")
    
    # Backwards compatibility
    f.write("window.SMOB_UNIT1_DATA = window.SMOB_ALL_DATA['1'] || window.SMOB_ALL_DATA[1];\n")

print(f"Generated {out_file}, file size: {os.path.getsize(out_file) / 1024:.1f} KB")
