from __future__ import annotations

import hashlib
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "all_units_data.json"
REPORT_DIR = ROOT / "reports"

OBJECT_WORDS = {
    "apple": {"apple", "apples", "quả táo", "táo"},
    "cake": {"cake", "birthday cake", "bánh sinh nhật", "bánh"},
    "dog": {"dog", "dogs", "puppy", "puppies", "con chó", "chó", "cún"},
    "bird": {"bird", "birds", "con chim", "chim"},
    "cat": {"cat", "cats", "con mèo", "mèo"},
    "book": {"book", "books", "sách", "cuốn sách"},
    "pen": {"pen", "pens", "bút"},
    "chair": {"chair", "chairs", "ghế"},
    "car": {"car", "cars", "ô tô", "xe hơi", "xe ô tô"},
    "teacher": {"teacher", "teachers", "giáo viên"},
    "student": {"student", "students", "học sinh", "sinh viên"},
    "baby": {"baby", "babies", "em bé", "đứa bé"},
    "office": {"office", "văn phòng", "cơ quan"},
    "kitchen": {"kitchen", "nhà bếp", "bếp"},
    "bedroom": {"bedroom", "phòng ngủ"},
    "living_room": {"living room", "phòng khách"},
    "table": {"table", "bàn"},
    "school": {"school", "trường học"},
    "bus": {"bus", "xe buýt"},
}

VISUAL_CUE_WORDS = {
    "tranh",
    "hình",
    "image",
    "picture",
    "nhìn",
    "dựa vào",
    "clock",
    "đồng hồ",
    "where",
    "when",
    "what",
    "who",
}


def norm(text: Any) -> str:
    text = str(text or "").lower()
    text = text.replace("’", "'").replace("‘", "'")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def object_mentions(text: Any) -> set[str]:
    lowered = norm(text)
    found: set[str] = set()
    for canonical, variants in OBJECT_WORDS.items():
        for variant in variants:
            if re.search(rf"(^|[^a-zA-ZÀ-ỹ]){re.escape(variant)}([^a-zA-ZÀ-ỹ]|$)", lowered):
                found.add(canonical)
                break
    return found


def text_has_visual_cue(q: dict[str, Any]) -> bool:
    text = norm(" ".join(str(q.get(k) or "") for k in ["stem", "instruction", "part_title", "explanation"]))
    return any(cue in text for cue in VISUAL_CUE_WORDS)


def image_signature(path: Path) -> dict[str, Any]:
    raw = path.read_bytes()
    with Image.open(path) as im:
        return {
            "sha1": hashlib.sha1(raw).hexdigest(),
            "width": im.width,
            "height": im.height,
            "mode": im.mode,
            "bytes": len(raw),
        }


def option_answer_consistency(q: dict[str, Any]) -> list[str]:
    problems: list[str] = []
    options = [str(o) for o in q.get("options") or []]
    answer = str(q.get("correct_answer") or "")
    if not options:
        return problems
    clean_answer = norm(re.sub(r"^[a-d]\.\s*", "", answer, flags=re.I)).rstrip(".")
    clean_options = [norm(re.sub(r"^[a-d]\.\s*", "", o, flags=re.I)).rstrip(".") for o in options]
    if clean_answer and clean_answer not in clean_options:
        letter = re.match(r"^([a-d])(?:[.)\s]|$)", norm(answer))
        if not letter:
            problems.append("correct_answer text does not match any option exactly after prefix/punctuation cleanup")
    return problems


def extract_time_mentions(text: Any) -> set[str]:
    s = norm(text)
    times = set(re.findall(r"\b\d{1,2}:\d{2}\b", s))
    for hour in re.findall(r"\b(\d{1,2})\s*o'clock\b", s):
        times.add(f"{int(hour)}:00")
    return times


def diagnose_question(unit_id: str, q: dict[str, Any], image_records: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    qid = str(q.get("id") or "")
    location = f"data/all_units_data.json:unit {unit_id}:unit_test:{qid}"
    img = q.get("image_url")
    stem = q.get("stem")
    answer = q.get("correct_answer")
    explanation = q.get("explanation")
    options = q.get("options") or []
    variants = q.get("acceptable_variants") or []

    for field_name, value in [("stem", stem), ("correct_answer", answer), ("explanation", explanation)]:
        value_text = str(value or "")
        if "____" in value_text or "..." in value_text or "…" in value_text:
            issues.append(
                {
                    "severity": "high" if field_name == "correct_answer" else "medium",
                    "category": "text_cleanup_placeholder_residue",
                    "unit": unit_id,
                    "qid": qid,
                    "location": location,
                    "message": f"{field_name} still contains blank/ellipsis placeholder residue.",
                    "current": value_text,
                    "suggested": "Store clean answer text and keep blanks only in stem when pedagogically required.",
                }
            )

    for problem in option_answer_consistency(q):
        issues.append(
            {
                "severity": "high",
                "category": "answer_key_option_mismatch",
                "unit": unit_id,
                "qid": qid,
                "location": location,
                "message": problem,
                "current": {"correct_answer": answer, "options": options},
                "suggested": "Align correct_answer, options and acceptable_variants from source answer PDF.",
            }
        )

    text_blob = " ".join(str(x or "") for x in [stem, answer, explanation, " ".join(map(str, options)), " ".join(map(str, variants))])
    mentions_all = object_mentions(text_blob)
    mentions_answer = object_mentions(" ".join(str(x or "") for x in [answer, " ".join(map(str, variants))]))
    mentions_expl = object_mentions(explanation)
    mentions_stem_options = object_mentions(" ".join(str(x or "") for x in [stem, " ".join(map(str, options))]))

    contradictory_pairs = [
        ("dog", "bird"),
        ("dog", "cat"),
        ("bird", "cat"),
        ("apple", "cake"),
        ("office", "kitchen"),
        ("office", "bedroom"),
        ("kitchen", "bedroom"),
    ]
    for a, b in contradictory_pairs:
        if a in mentions_all and b in mentions_all:
            issues.append(
                {
                    "severity": "high",
                    "category": "semantic_contradiction_in_question_bundle",
                    "unit": unit_id,
                    "qid": qid,
                    "location": location,
                    "message": f"Question bundle contains conflicting concepts: {a} vs {b}.",
                    "current": {"stem": stem, "options": options, "correct_answer": answer, "explanation": explanation},
                    "suggested": "Inspect the actual image/PDF and rewrite stem, options, key and explanation as one consistent bundle.",
                }
            )

    if mentions_expl and mentions_stem_options and not (mentions_expl & mentions_stem_options | mentions_answer):
        issues.append(
            {
                "severity": "medium",
                "category": "explanation_mentions_unanchored_object",
                "unit": unit_id,
                "qid": qid,
                "location": location,
                "message": "Explanation mentions object/place not anchored in stem/options/answer.",
                "current": {"mentions_in_explanation": sorted(mentions_expl), "mentions_in_question_answer": sorted(mentions_stem_options | mentions_answer), "explanation": explanation},
                "suggested": "Rewrite explanation from actual image/PDF evidence.",
            }
        )

    stem_times = extract_time_mentions(stem)
    answer_times = extract_time_mentions(answer)
    variant_times = extract_time_mentions(" ".join(map(str, variants)))
    explanation_times = extract_time_mentions(explanation)
    all_times = stem_times | answer_times | variant_times | explanation_times
    if len(all_times) > 1:
        issues.append(
            {
                "severity": "high",
                "category": "time_answer_explanation_mismatch",
                "unit": unit_id,
                "qid": qid,
                "location": location,
                "message": "Question bundle contains multiple different time values.",
                "current": {"stem_times": sorted(stem_times), "answer_times": sorted(answer_times), "variant_times": sorted(variant_times), "explanation_times": sorted(explanation_times)},
                "suggested": "Verify clock image/PDF and keep exactly the correct time across key, variants and explanation.",
            }
        )

    if img:
        img_path = (ROOT / str(img)).resolve()
        if not img_path.exists():
            issues.append(
                {
                    "severity": "critical",
                    "category": "missing_image_asset",
                    "unit": unit_id,
                    "qid": qid,
                    "location": location,
                    "message": "image_url points to a missing file.",
                    "current": img,
                    "suggested": "Re-extract exact question image from source PDF and update image_url.",
                }
            )
        else:
            record = image_records.setdefault(str(img), image_signature(img_path))
            basename = img_path.name.lower()
            q_num = re.search(r"q(\d+)", basename)
            numeric_qid = re.search(r"(\d+)$", qid)
            if numeric_qid and q_num and int(numeric_qid.group(1)) != int(q_num.group(1)):
                issues.append(
                    {
                        "severity": "medium",
                        "category": "ambiguous_image_id_mapping",
                        "unit": unit_id,
                        "qid": qid,
                        "location": location,
                        "message": "Question id number and image filename question number differ.",
                        "current": {"qid": qid, "image_url": img},
                        "suggested": "Create explicit source-backed mapping table: unit, part, source page, source image xref/crop, qid.",
                    }
                )
            if record["width"] < 80 or record["height"] < 80:
                issues.append(
                    {
                        "severity": "medium",
                        "category": "suspicious_small_image_asset",
                        "unit": unit_id,
                        "qid": qid,
                        "location": location,
                        "message": "Referenced image is unusually small and may be an icon/crop artifact.",
                        "current": {"image_url": img, "width": record["width"], "height": record["height"], "bytes": record["bytes"]},
                        "suggested": "Re-extract a clean isolated question image from source PDF.",
                    }
                )
    elif text_has_visual_cue(q):
        issues.append(
            {
                "severity": "high",
                "category": "visual_question_without_image_url",
                "unit": unit_id,
                "qid": qid,
                "location": location,
                "message": "Question/explanation references a picture but has no image_url.",
                "current": {"stem": stem, "correct_answer": answer, "explanation": explanation},
                "suggested": "Attach the exact source image or remove visual wording after PDF verification.",
            }
        )

    return issues


def make_contact_sheet(items: list[dict[str, Any]], output: Path) -> None:
    thumb_w, thumb_h = 240, 155
    label_h = 118
    cols = 3
    rows = max(1, (len(items) + cols - 1) // cols)
    canvas = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "white")
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 12)
    except Exception:
        font = None

    for idx, item in enumerate(items):
        x = (idx % cols) * thumb_w
        y = (idx // cols) * (thumb_h + label_h)
        img_path = ROOT / item["image_url"]
        try:
            im = Image.open(img_path).convert("RGB")
            im.thumbnail((thumb_w - 10, thumb_h - 10), Image.Resampling.LANCZOS)
            canvas.paste(im, (x + (thumb_w - im.width) // 2, y + 5))
        except Exception as exc:
            draw.text((x + 6, y + 40), f"IMAGE ERROR: {exc}", fill=(180, 0, 0), font=font)
        label = (
            f"U{item['unit']} {item['qid']}\n"
            f"{Path(item['image_url']).name}\n"
            f"{str(item['stem'])[:58]}\n"
            f"ANS: {str(item['correct_answer'])[:54]}\n"
            f"EXPL: {str(item['explanation'])[:50]}"
        )
        draw.multiline_text((x + 6, y + thumb_h), label, fill=(0, 0, 0), font=font, spacing=2)

    output.parent.mkdir(exist_ok=True)
    canvas.save(output, quality=92)


def build_prompt(summary: dict[str, Any], issues: list[dict[str, Any]]) -> str:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for issue in issues:
        grouped[issue["category"]].append(issue)

    sections = []
    for category, rows in sorted(grouped.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        sections.append(f"\n### {category} ({len(rows)})")
        for issue in rows[:120]:
            sections.append(
                "- Unit {unit} | {qid} | {severity}: {message} Current={current} Suggested={suggested}".format(
                    unit=issue["unit"],
                    qid=issue["qid"],
                    severity=issue["severity"],
                    message=issue["message"],
                    current=json.dumps(issue["current"], ensure_ascii=False),
                    suggested=json.dumps(issue["suggested"], ensure_ascii=False),
                )
            )
        if len(rows) > 120:
            sections.append(f"- ... còn {len(rows) - 120} issue, xem JSON report đầy đủ.")

    return f"""# MASTER FIX PROMPT NGHIÊM NGẶT CHO ANTIGRAVITY - VISUAL/DATA CLEAN 48 UNITS

Bạn là Senior Data Repair Agent cho SMOB English Lab. Nhiệm vụ là FIX TRIỆT ĐỂ lỗi dữ liệu còn tồn đọng, đặc biệt mismatch Tranh - Câu hỏi - Answer Key - Explanation.

## Phạm vi bắt buộc

- GIỮ NGUYÊN 100% UI/UX, CSS, layout, theme, animation, navigation.
- Chỉ sửa dữ liệu và utility: `data/all_units_data.json`, seeder/rebuild scripts liên quan, `js/embedded_data.js` sau khi regenerate, và `js/app.js` chỉ nếu cần normalization/chấm điểm.
- Không sửa giao diện, không đổi style, không làm lại app.

## Báo cáo đầu vào

- Visual questions có `image_url`: {summary["image_question_count"]}.
- Image assets được tham chiếu: {summary["referenced_image_count"]}.
- Issue/rủi ro phát hiện: {summary["total_issues"]}.
- High/Critical: {summary["high_or_critical"]}.
- Contact sheet để đối chiếu nhanh: `reports/referenced_image_questions_contact_sheet.jpg`.
- JSON report đầy đủ: `reports/visual_alignment_qa_report.json`.

## Chỉ thị nghiêm ngặt

Không được sửa qua loa từng string riêng lẻ. Với mọi câu có ảnh hoặc cue hình ảnh, phải sửa theo bundle 4 trường: `image_url` + `stem` + `correct_answer/acceptable_variants/options` + `explanation`.

Antigravity phải tạo hoặc cập nhật bảng mapping nguồn có kiểm chứng:

- Unit
- Database question id
- Part/question number trong PDF
- Source PDF path
- Source page
- Source image/crop id hoặc xref nếu có
- Nội dung thật của hình
- Stem đúng
- Options đúng
- Answer key đúng
- Explanation đúng

Sau đó dùng bảng mapping này để ghi lại JSON. Không được để tình trạng hình bánh sinh nhật nhưng câu hỏi/options là apples; hình văn phòng nhưng key là kitchen; hình chó nhưng explanation nói chim.

## Danh sách issue cần xử lý từ scan
{chr(10).join(sections)}

## Yêu cầu viết lại 100% explanation

- Viết lại explanation cho toàn bộ 879 câu của 48 Units, không chỉ các câu bị flag.
- Explanation tiếng Việt chuẩn sư phạm: nêu quy tắc/ngữ cảnh, vì sao đáp án đúng, và bẫy/sai khác thường gặp.
- Với câu hình ảnh: mô tả đúng vật/người/vị trí/giờ trong hình thật, dựa trên PDF gốc.
- Với câu nghe: nêu transcript hoặc bằng chứng audio/transcript.
- Cấm placeholder/generic: "Câu hỏi trích xuất từ đề thi gốc", "Đáp án chính xác theo giáo trình", "Áp dụng công thức..." nếu không có phân tích.

## Nguồn đối chiếu bắt buộc

- PDF đề/đáp án/lý thuyết: `D:\\2.English\\Tai lieu_ENG\\Drive_Download\\NGÀY {{unit}}`
- Source chính: `D:\\2.English\\ENG Learning_Antigravity\\data\\all_units_data.json`
- Bundle app: `D:\\2.English\\ENG Learning_Antigravity\\js\\embedded_data.js`
- Output phát hành: `D:\\2.English\\phan mem hoc\\SMOB English Lab.exe`

## Quy trình nghiệm thu bắt buộc

1. Chạy visual scan:
   `C:\\Users\\Admin\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe scripts\\qa_visual_alignment_diagnostic.py`

2. Chạy full QA scan:
   `C:\\Users\\Admin\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe scripts\\qa_full_48_units_diagnostic.py`

3. Chạy data validation:
   `python scripts\\verify_all_data.py`

4. Regenerate bundle:
   `python scripts\\generate_embedded_bundle.py`

5. Kiểm E2E 48 Units: mở app, render Grammar và Bài Thi Online, nộp bằng answer key đúng, xác nhận 100% pass trên toàn bộ câu đã sửa.

6. Build/package:
   `python scripts\\build_exe.py`

7. EXE cuối cùng phải được cập nhật tại:
   `D:\\2.English\\phan mem hoc\\SMOB English Lab.exe`

8. Sau build chạy:
   `python scripts\\clean_system_and_temp.py`

9. Xuất báo cáo nghiệm thu:
   `reports/final_acceptance_test_log.md`

## Điều kiện bàn giao

- Không còn high/critical issue trong `visual_alignment_qa_report.json`.
- Không còn high/critical issue trong `full_48_units_qa_report.json`.
- Không còn mismatch tranh-câu hỏi-key-explanation.
- Không còn explanation nói sai vật/người/vị trí/giờ.
- `data/all_units_data.json` và `js/embedded_data.js` đồng bộ.
- EXE đã cập nhật đúng `D:\\2.English\\phan mem hoc`.
"""


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    REPORT_DIR.mkdir(exist_ok=True)
    issues: list[dict[str, Any]] = []
    image_records: dict[str, dict[str, Any]] = {}
    image_items: list[dict[str, Any]] = []

    for unit_id, unit in data.items():
        for q in unit.get("unit_test", []) or []:
            if q.get("image_url"):
                image_items.append(
                    {
                        "unit": unit_id,
                        "qid": str(q.get("id") or ""),
                        "image_url": q.get("image_url"),
                        "stem": q.get("stem"),
                        "correct_answer": q.get("correct_answer"),
                        "explanation": q.get("explanation"),
                    }
                )
            issues.extend(diagnose_question(unit_id, q, image_records))

    hashes = defaultdict(list)
    for img, sig in image_records.items():
        hashes[sig["sha1"]].append(img)
    for sha1, imgs in hashes.items():
        if len(imgs) > 1:
            issues.append(
                {
                    "severity": "medium",
                    "category": "duplicate_referenced_image_binary",
                    "unit": None,
                    "qid": None,
                    "location": "assets/exam_images",
                    "message": "Multiple image_url values point to byte-identical images.",
                    "current": imgs,
                    "suggested": "Verify duplicates are intentional; otherwise remap to the correct source crop.",
                }
            )

    summary = {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "image_question_count": len(image_items),
        "referenced_image_count": len(image_records),
        "total_issues": len(issues),
        "high_or_critical": sum(1 for i in issues if i["severity"] in {"high", "critical"}),
        "severity_counts": dict(Counter(i["severity"] for i in issues)),
        "category_counts": dict(Counter(i["category"] for i in issues)),
    }

    contact_sheet = REPORT_DIR / "referenced_image_questions_contact_sheet.jpg"
    make_contact_sheet(image_items, contact_sheet)

    report = {"summary": summary, "image_questions": image_items, "image_records": image_records, "issues": issues}
    (REPORT_DIR / "visual_alignment_qa_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    (REPORT_DIR / "MASTER_VISUAL_DATA_FIX_PROMPT_ANTIGRAVITY.md").write_text(build_prompt(summary, issues), encoding="utf-8")

    print("=== Visual Alignment QA Summary ===")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    print(f"Wrote: {REPORT_DIR / 'visual_alignment_qa_report.json'}")
    print(f"Wrote: {REPORT_DIR / 'referenced_image_questions_contact_sheet.jpg'}")
    print(f"Wrote: {REPORT_DIR / 'MASTER_VISUAL_DATA_FIX_PROMPT_ANTIGRAVITY.md'}")
    return 1 if summary["high_or_critical"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
