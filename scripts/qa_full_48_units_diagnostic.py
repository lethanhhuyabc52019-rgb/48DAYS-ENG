from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "all_units_data.json"
APP_JS = ROOT / "js" / "app.js"
REPORT_DIR = ROOT / "reports"
DEFAULT_PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

GENERIC_EXPLANATION_PATTERNS = [
    "cau hoi trich xuat tu de thi goc",
    "câu hỏi trích xuất từ đề thi gốc",
    "dap an chinh xac theo giao trinh",
    "đáp án chính xác theo giáo trình",
    "ap dung cong thuc va quy tac chuan",
    "áp dụng công thức và quy tắc chuẩn",
    "khong co giai thich chi tiet",
    "không có giải thích chi tiết",
    "generated",
    "auto-generated",
]

SINGULAR_TO_PLURAL = {
    "man": "men",
    "woman": "women",
    "child": "children",
    "person": "people",
    "tooth": "teeth",
    "foot": "feet",
    "mouse": "mice",
    "goose": "geese",
    "baby": "babies",
    "city": "cities",
    "story": "stories",
    "box": "boxes",
    "bus": "buses",
    "watch": "watches",
    "dish": "dishes",
    "class": "classes",
    "fox": "foxes",
    "leaf": "leaves",
    "knife": "knives",
    "wife": "wives",
    "life": "lives",
    "book": "books",
    "dog": "dogs",
    "cat": "cats",
    "apple": "apples",
    "orange": "oranges",
    "picture": "pictures",
    "student": "students",
    "teacher": "teachers",
    "pen": "pens",
    "car": "cars",
    "house": "houses",
}

PERSON_WORDS = {
    "man",
    "woman",
    "boy",
    "girl",
    "father",
    "mother",
    "teacher",
    "student",
    "doctor",
    "nurse",
    "brother",
    "sister",
    "baby",
    "child",
    "children",
    "people",
    "person",
    "parents",
    "friend",
    "friends",
    "classmates",
}

OBJECT_WORDS = {
    "jeans",
    "pants",
    "trousers",
    "books",
    "pens",
    "cars",
    "house",
    "houses",
    "dogs",
    "cats",
    "oranges",
    "apples",
    "shirt",
    "shirts",
    "coat",
    "coats",
    "table",
    "chair",
    "kitchen",
    "office",
    "bank",
    "school",
    "hospital",
    "supermarket",
    "post office",
}

STOPWORDS = {
    "question",
    "choose",
    "answer",
    "correct",
    "the",
    "a",
    "an",
    "to",
    "in",
    "on",
    "at",
    "of",
    "and",
    "or",
    "is",
    "are",
    "am",
    "be",
    "do",
    "does",
    "did",
    "what",
    "who",
    "where",
    "when",
    "why",
    "how",
    "chon",
    "dap",
    "an",
    "dung",
    "cau",
    "hoi",
    "dien",
    "tu",
    "vao",
    "cho",
    "trong",
}


@dataclass
class Issue:
    severity: str
    category: str
    unit: int | None
    qid: str | None
    location: str
    message: str
    current: Any = None
    suggested: Any = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "severity": self.severity,
            "category": self.category,
            "unit": self.unit,
            "qid": self.qid,
            "location": self.location,
            "message": self.message,
            "current": self.current,
            "suggested": self.suggested,
        }


def strip_accents(text: str) -> str:
    text = (text or "").replace("Đ", "D").replace("đ", "d")
    text = unicodedata.normalize("NFKD", text or "")
    return "".join(ch for ch in text if not unicodedata.combining(ch))


def compact_text(text: str) -> str:
    text = strip_accents(text).lower()
    text = text.replace("’", "'").replace("‘", "'").replace("`", "'")
    text = re.sub(r"[_\-–—]+", " ", text)
    text = re.sub(r"[^a-z0-9'\s:.$/]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def normalize_answer(text: str) -> str:
    text = compact_text(text)
    text = re.sub(r"^[a-d]\s*[\.)]\s*", "", text)
    return text.strip()


def words_for_match(text: str) -> list[str]:
    text = re.sub(r"_{2,}|\.{2,}", " ", text or "")
    words = re.findall(r"[a-zA-Z][a-zA-Z']+|\d+:\d+|\d+", strip_accents(text).lower())
    return [w for w in words if len(w) > 2 and w not in STOPWORDS]


def safe_read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def import_pdfplumber():
    try:
        import pdfplumber  # type: ignore

        return pdfplumber
    except Exception:
        return None


def extract_pdf_text(path: Path, pdfplumber_module) -> tuple[str, int, int, str | None]:
    if not path.exists():
        return "", 0, 0, "missing_pdf_file"
    try:
        if pdfplumber_module:
            chunks: list[str] = []
            image_count = 0
            with pdfplumber_module.open(str(path)) as pdf:
                page_count = len(pdf.pages)
                for page in pdf.pages:
                    chunks.append(page.extract_text() or "")
                    image_count += len(page.images or [])
            return "\n".join(chunks), page_count, image_count, None

        from pypdf import PdfReader  # type: ignore

        reader = PdfReader(str(path))
        chunks = [(page.extract_text() or "") for page in reader.pages]
        return "\n".join(chunks), len(reader.pages), 0, None
    except Exception as exc:
        return "", 0, 0, f"{type(exc).__name__}: {exc}"


def find_unit_folder(pdf_root: Path, unit_id: int) -> Path | None:
    exact = pdf_root / f"NGÀY {unit_id}"
    if exact.exists():
        return exact
    if not pdf_root.exists():
        return None
    for child in pdf_root.iterdir():
        if child.is_dir() and re.search(rf"\b{unit_id}\b", child.name):
            return child
    return None


def classify_pdf_files(folder: Path | None) -> dict[str, Path | None]:
    result = {"exam": None, "answer": None, "theory": None}
    if not folder or not folder.exists():
        return result
    pdfs = sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() == ".pdf")
    for pdf in pdfs:
        n = compact_text(pdf.name)
        if "dap an" in n:
            result["answer"] = result["answer"] or pdf
        elif "bai thi" in n or "thi online" in n or "test" in n or "luyen thi" in n:
            result["exam"] = result["exam"] or pdf
        else:
            result["theory"] = result["theory"] or pdf
    return result


def correct_answer_matches_options(q: dict[str, Any]) -> bool:
    answer = str(q.get("correct_answer") or "")
    options = [str(o) for o in q.get("options") or []]
    if not answer or not options:
        return True
    a = compact_text(answer)
    if a in {compact_text(o) for o in options}:
        return True
    letter = re.match(r"^([a-d])(?:[\.)\s]|$)", a)
    if letter:
        idx = ord(letter.group(1)) - ord("a")
        return 0 <= idx < len(options)
    return normalize_answer(answer) in {normalize_answer(o) for o in options}


def expected_be_for_subject(stem: str) -> str | None:
    s = compact_text(stem)
    s = re.sub(r"^question\s+\d+\s*", "", s)
    patterns = [
        (r"\bi\s+_+", "am"),
        (r"\b(he|she|it|this|that)\s+_+", "is"),
        (r"\b(we|you|they|these|those)\s+_+", "are"),
        (r"\bthere\s+_+\s+(a|an|one)\b", "is"),
        (r"\bthere\s+_+\s+(\d+|many|some|two|three|four|five|six|seven|eight|nine|ten)\b", "are"),
    ]
    for pattern, expected in patterns:
        if re.search(pattern, s):
            return expected
    return None


def answer_first_word(answer: str) -> str:
    answer = normalize_answer(answer)
    return (re.findall(r"[a-z']+", answer) or [""])[0].replace("'", "")


def detect_question_semantics(q: dict[str, Any]) -> list[Issue]:
    unit = int(q.get("_unit_id"))
    qid = str(q.get("id") or "")
    stem = str(q.get("stem") or "")
    answer = str(q.get("correct_answer") or "")
    issues: list[Issue] = []

    expected = expected_be_for_subject(stem)
    first = answer_first_word(answer)
    if expected and first in {"am", "is", "are", "isnt", "arent", "was", "were"} and first != expected:
        issues.append(
            Issue(
                "high",
                "basic_grammar_to_be_mismatch",
                unit,
                qid,
                f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                f"Stem appears to require '{expected}', but correct_answer starts with '{first}'.",
                {"stem": stem, "correct_answer": answer},
                expected,
            )
        )

    s = compact_text(stem)
    a = compact_text(answer)
    answer_tokens = set(re.findall(r"[a-z]+", a))
    if re.search(r"\bwho\b", s) and (answer_tokens & OBJECT_WORDS or re.search(r"\b(it|they)\s+(is|are|'re|'s)\s+(a|an|the|his|her|my|our|their)?\s*(jeans|books|pants|car|house|dog|cat|office|kitchen)", a)):
        issues.append(
            Issue(
                "high",
                "who_what_semantic_mismatch",
                unit,
                qid,
                f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                "Question uses Who but the stored answer appears to identify an object/place.",
                {"stem": stem, "correct_answer": answer},
                "Verify against source PDF and change Who to What or correct the answer/person noun.",
            )
        )
    if re.search(r"\bwhat\b", s) and answer_tokens & PERSON_WORDS and not re.search(r"\bjob|occupation|name\b", s):
        issues.append(
            Issue(
                "medium",
                "who_what_semantic_mismatch",
                unit,
                qid,
                f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                "Question uses What but the stored answer appears to identify a person.",
                {"stem": stem, "correct_answer": answer},
                "Verify whether the source question should be Who.",
            )
        )

    if re.search(r"\b(these|those)\b", s) and re.search(r"\bit('s| is)\b", a):
        issues.append(
            Issue(
                "high",
                "demonstrative_pronoun_mismatch",
                unit,
                qid,
                f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                "These/Those are plural demonstratives, but answer uses It/It's.",
                {"stem": stem, "correct_answer": answer},
                "Use They are/They're or a plural noun phrase if confirmed by PDF.",
            )
        )
    if re.search(r"\b(this|that)\b", s) and re.search(r"\bthey('re| are)\b", a):
        issues.append(
            Issue(
                "high",
                "demonstrative_pronoun_mismatch",
                unit,
                qid,
                f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                "This/That are singular demonstratives, but answer uses They/They're.",
                {"stem": stem, "correct_answer": answer},
                "Use It is/It's or a singular noun phrase if confirmed by PDF.",
            )
        )

    return issues


def detect_plural_issue(q: dict[str, Any]) -> Issue | None:
    unit = int(q.get("_unit_id"))
    qid = str(q.get("id") or "")
    context = " ".join(
        str(q.get(k) or "")
        for k in ("part_title", "instruction", "stem")
    )
    context_norm = compact_text(context)
    answer_norm = normalize_answer(str(q.get("correct_answer") or ""))
    wants_plural = any(token in context_norm for token in ["so nhieu", "plural", "danh tu so nhieu", "chuyen sang so nhieu"])
    if not wants_plural:
        return None
    for singular, plural in SINGULAR_TO_PLURAL.items():
        if answer_norm == singular or answer_norm == f"{singular} _____":
            return Issue(
                "high",
                "plural_transformation_answer_is_singular",
                unit,
                qid,
                f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                f"Plural-transformation context, but correct_answer stores singular/base form '{singular}'.",
                {"stem": q.get("stem"), "correct_answer": q.get("correct_answer"), "instruction": q.get("instruction")},
                plural,
            )
    return None


def detect_preposition_variant(q: dict[str, Any]) -> Issue | None:
    unit = int(q.get("_unit_id"))
    qid = str(q.get("id") or "")
    answer = normalize_answer(str(q.get("correct_answer") or ""))
    variants = {normalize_answer(str(v)) for v in q.get("acceptable_variants") or []}
    if answer not in {"at", "in"}:
        return None
    counterpart = "in" if answer == "at" else "at"
    stem = compact_text(str(q.get("stem") or ""))
    ambiguous_places = ["school", "hospital", "office", "class", "university", "college", "restaurant", "hotel"]
    if counterpart not in variants and any(place in stem for place in ambiguous_places):
        return Issue(
            "medium",
            "missing_valid_preposition_variant",
            unit,
            qid,
            f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
            f"Preposition answer accepts only '{answer}', but context may also allow '{counterpart}'.",
            {"stem": q.get("stem"), "correct_answer": q.get("correct_answer"), "acceptable_variants": q.get("acceptable_variants")},
            f"Add acceptable_variants including '{counterpart}' if source/explanation supports it.",
        )
    return None


def collect_titles(unit: dict[str, Any]) -> set[str]:
    titles = {str(unit.get("title") or ""), str((unit.get("grammar") or {}).get("title") or "")}
    for section in (unit.get("grammar") or {}).get("sections") or []:
        if isinstance(section, dict):
            titles.add(str(section.get("title") or ""))
    return {compact_text(t) for t in titles if len(compact_text(t)) >= 8}


def detect_answer_title_issue(unit: dict[str, Any], q: dict[str, Any], titles: set[str]) -> Issue | None:
    answer_norm = normalize_answer(str(q.get("correct_answer") or ""))
    if not answer_norm or len(answer_norm) < 8:
        return None
    for title in titles:
        if answer_norm == title or (len(title) >= 12 and title in answer_norm):
            uid = int(unit.get("unit_id") or q.get("_unit_id"))
            qid = str(q.get("id") or "")
            return Issue(
                "high",
                "lesson_title_used_as_answer",
                uid,
                qid,
                f"data/all_units_data.json:unit {uid}:unit_test:{qid}",
                "correct_answer appears to contain a lesson/section title instead of the answer.",
                {"stem": q.get("stem"), "correct_answer": q.get("correct_answer")},
                "Replace with the exact key from the source answer PDF.",
            )
    return None


def detect_explanation_issue(q: dict[str, Any]) -> Issue | None:
    unit = int(q.get("_unit_id"))
    qid = str(q.get("id") or "")
    explanation = str(q.get("explanation") or "").strip()
    norm = compact_text(explanation)
    if not explanation:
        reason = "missing"
    elif len(explanation) < 45:
        reason = "too_short"
    elif any(compact_text(p) in norm for p in GENERIC_EXPLANATION_PATTERNS):
        reason = "generic_source_or_placeholder"
    else:
        return None
    return Issue(
        "medium",
        "weak_or_placeholder_explanation",
        unit,
        qid,
        f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
        f"Explanation is {reason}; regenerate a pedagogical explanation.",
        explanation,
        "Write a concise Vietnamese explanation: rule -> why answer fits -> why common distractors do not.",
    )


def detect_dirty_answer(q: dict[str, Any]) -> Issue | None:
    answer = str(q.get("correct_answer") or "")
    stripped = answer.strip()
    if not stripped:
        return Issue(
            "critical",
            "missing_correct_answer",
            int(q.get("_unit_id")),
            str(q.get("id") or ""),
            f"data/all_units_data.json:unit {q.get('_unit_id')}:unit_test:{q.get('id')}",
            "Question has no correct_answer.",
            q,
            "Fill from source answer PDF.",
        )
    dirty = []
    if "____" in stripped:
        dirty.append("underscore_blank")
    if "..." in stripped or "…" in stripped:
        dirty.append("ellipsis")
    if stripped in {"-", "--", "—", "–"} or re.search(r"(^|\s)-($|\s)", stripped):
        dirty.append("dash_placeholder")
    if not dirty:
        return None
    return Issue(
        "high",
        "dirty_correct_answer_formatting",
        int(q.get("_unit_id")),
        str(q.get("id") or ""),
        f"data/all_units_data.json:unit {q.get('_unit_id')}:unit_test:{q.get('id')}",
        f"correct_answer contains formatting/placeholder residue: {', '.join(dirty)}.",
        stripped,
        "Remove blanks/ellipsis/dashes and store only the accepted answer text.",
    )


def detect_pdf_text_mismatch(q: dict[str, Any], exam_text_norm: str, answer_text_norm: str) -> list[Issue]:
    issues: list[Issue] = []
    unit = int(q.get("_unit_id"))
    qid = str(q.get("id") or "")
    stem = str(q.get("stem") or "")
    answer = str(q.get("correct_answer") or "")

    stem_words = words_for_match(stem)
    if len(stem_words) >= 4 and exam_text_norm:
        hits = sum(1 for w in set(stem_words) if w in exam_text_norm)
        ratio = hits / max(1, len(set(stem_words)))
        if ratio < 0.55:
            issues.append(
                Issue(
                    "medium",
                    "stem_not_supported_by_exam_pdf_text",
                    unit,
                    qid,
                    f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                    f"Only {hits}/{len(set(stem_words))} meaningful stem tokens appear in extracted exam PDF text.",
                    {"stem": stem, "source_file": q.get("source_file")},
                    "Recompare this question with the source exam PDF; visual/image questions may require image review.",
                )
            )

    answer_norm = normalize_answer(answer)
    if answer_norm and len(answer_norm) >= 3 and answer_text_norm:
        variants = {answer_norm} | {normalize_answer(str(v)) for v in q.get("acceptable_variants") or []}
        variants = {v for v in variants if len(v) >= 3}
        if variants and not any(v in answer_text_norm or v in exam_text_norm for v in variants):
            issues.append(
                Issue(
                    "medium",
                    "answer_not_supported_by_pdf_text",
                    unit,
                    qid,
                    f"data/all_units_data.json:unit {unit}:unit_test:{qid}",
                    "correct_answer/acceptable_variants were not found in extracted source PDF text.",
                    {"correct_answer": answer, "acceptable_variants": q.get("acceptable_variants")},
                    "Verify against the answer PDF; if the key is image-only, record manual source evidence.",
                )
            )
    return issues


def audit_normalization_logic(app_js: str) -> list[Issue]:
    issues: list[Issue] = []
    check_answer = re.search(r"checkAnswer\(q,\s*userAns\)\s*\{(?P<body>.*?)\n\s*\}\n\s*nextQuestion", app_js, re.S)
    check_exam = re.search(r"checkExamAnswer\(q,\s*userAns\)\s*\{(?P<body>.*?)\n\s*\}\n\s*setPdfQuestionAnswer", app_js, re.S)
    for name, match in [("checkAnswer", check_answer), ("checkExamAnswer", check_exam)]:
        body = match.group("body") if match else ""
        missing = []
        if ".trim()" not in body:
            missing.append("trim")
        if ".toLowerCase()" not in body:
            missing.append("lowercase")
        if "’" not in body:
            missing.append("curly apostrophe normalization")
        if not re.search(r"replace\(\s*/\[[^\]]*[,.;]", body):
            missing.append("comma/period normalization")
        if "acceptable_variants" not in body:
            missing.append("acceptable_variants")
        severity = "medium" if missing else "info"
        issues.append(
            Issue(
                severity,
                "answer_normalization_logic",
                None,
                None,
                f"js/app.js:{name}",
                f"{name} normalization audit: " + ("missing " + ", ".join(missing) if missing else "basic trim/lower/apostrophe/variants present."),
                None,
                "Normalize trim, case, straight/curly apostrophes, repeated spaces, and terminal commas/periods for short-answer checks.",
            )
        )
    return issues


def markdown_table(rows: list[list[Any]], headers: list[str]) -> str:
    def cell(value: Any) -> str:
        return str(value).replace("|", "\\|").replace("\n", " ")

    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
    for row in rows:
        out.append("| " + " | ".join(cell(v) for v in row) + " |")
    return "\n".join(out)


def build_master_prompt(summary: dict[str, Any], issues: list[Issue], generated_at: str) -> str:
    by_category = defaultdict(list)
    for issue in issues:
        if issue.category != "answer_normalization_logic":
            by_category[issue.category].append(issue)

    detail_lines: list[str] = []
    priority_categories = [
        "missing_correct_answer",
        "dirty_correct_answer_formatting",
        "plural_transformation_answer_is_singular",
        "lesson_title_used_as_answer",
        "basic_grammar_to_be_mismatch",
        "who_what_semantic_mismatch",
        "demonstrative_pronoun_mismatch",
        "missing_valid_preposition_variant",
        "missing_or_invalid_image_asset",
        "pdf_visual_review_required",
        "weak_or_placeholder_explanation",
        "stem_not_supported_by_exam_pdf_text",
        "answer_not_supported_by_pdf_text",
    ]
    for category in priority_categories:
        items = by_category.get(category, [])
        if not items:
            continue
        detail_lines.append(f"\n### {category} ({len(items)} lỗi/rủi ro)")
        for issue in items[:200]:
            detail_lines.append(
                f"- Unit {issue.unit or '-'} | {issue.qid or '-'} | {issue.location}: {issue.message} "
                f"Current={json.dumps(issue.current, ensure_ascii=False)} | Suggested={json.dumps(issue.suggested, ensure_ascii=False)}"
            )
        if len(items) > 200:
            detail_lines.append(f"- ... còn {len(items) - 200} dòng, xem JSON report đầy đủ.")

    return f"""# MASTER FIX PROMPT CHO ANTIGRAVITY - SMOB ENGLISH LAB 48 UNITS

Bạn là Senior Data Repair + Build Agent cho dự án SMOB English Lab. Hãy sửa theo báo cáo QA tự động sinh lúc {generated_at}.

## 1. Phạm vi xử lý bắt buộc

- GIỮ NGUYÊN 100% UI/UX, layout, CSS, animation, theme, navigation và thiết kế hiện có.
- Chỉ được can thiệp các lớp dữ liệu và tiện ích cần thiết: `data/all_units_data.json`, file seeder/rebuild liên quan trong `scripts/`, `js/embedded_data.js` sau khi regenerate bundle, và logic normalization/chấm điểm trong `js/app.js` nếu cần.
- Không refactor giao diện, không đổi copy UI, không đổi cấu trúc CSS, không thêm landing page hay component mới.
- Mọi chỉnh sửa câu hỏi phải đối chiếu với PDF nguồn tại `D:\\2.English\\Tai lieu_ENG\\Drive_Download\\NGÀY {{unit}}`.

## 2. Kết quả quét đầu vào

- Units đã quét: {summary["units_scanned"]}/48.
- Tổng câu hỏi `unit_test`: {summary["total_questions"]}.
- Tổng issue/rủi ro phát hiện: {summary["total_issues"]}.
- PDF folders tìm thấy: {summary["pdf_folders_found"]}/48.
- Exam PDFs tìm thấy: {summary["exam_pdfs_found"]}/48.
- Answer PDFs tìm thấy: {summary["answer_pdfs_found"]}/48.
- Theory PDFs tìm thấy: {summary["theory_pdfs_found"]}/48.
- Câu có explanation yếu/placeholder: {summary["category_counts"].get("weak_or_placeholder_explanation", 0)}.
- Câu cần kiểm chứng lại với text PDF: {summary["category_counts"].get("stem_not_supported_by_exam_pdf_text", 0) + summary["category_counts"].get("answer_not_supported_by_pdf_text", 0)}.

## 3. Danh sách fix chi tiết
{chr(10).join(detail_lines) if detail_lines else "\nKhông có lỗi dữ liệu nghiêm trọng được script tự động phát hiện."}

## 4. Yêu cầu viết lại explanation

- Generate lại 100% `explanation` cho toàn bộ câu hỏi trong 48 Units, kể cả câu hiện đã có lời giải.
- Mỗi explanation viết bằng tiếng Việt chuẩn sư phạm, ngắn gọn nhưng đủ 3 ý: quy tắc/ngữ cảnh, lý do đáp án đúng, lưu ý bẫy hoặc vì sao lựa chọn khác sai.
- Với câu listening/visual, explanation phải nêu bằng chứng nguồn: transcript, chi tiết hình, giờ, vị trí, người/vật, hoặc dòng đáp án trong answer PDF.
- Không để lại chuỗi placeholder như "Câu hỏi trích xuất từ đề thi gốc", "Đáp án chính xác theo giáo trình", "Áp dụng công thức..." nếu không có phân tích cụ thể.

## 5. Quy trình sửa dữ liệu

1. Mở từng Unit có issue trong report JSON, đối chiếu `stem`, `options`, `correct_answer`, `acceptable_variants`, `explanation`, `source_page`, `source_file` với exam PDF và answer PDF gốc.
2. Sửa `correct_answer` để chỉ chứa đáp án sạch, không chứa `_____`, `...`, dấu `-` placeholder hoặc tiêu đề bài học.
3. Với câu có nhiều đáp án ngữ pháp hợp lệ, cập nhật `acceptable_variants` đầy đủ, đặc biệt các câu giới từ có thể nhận cả `at` và `in` nếu PDF/ngữ cảnh cho phép.
4. Với câu Who/What, This/That/These/Those, is/are/am, It's/They're, sửa đồng bộ stem-answer-options-explanation để đúng ngữ pháp và đúng PDF.
5. Với câu visual/listening, kiểm ảnh/audio trực tiếp. Nếu PDF có hình đồng hồ/vị trí/người-vật, bảo đảm đáp án trong app khớp chính xác nội dung hình, không chỉ khớp text đã trích xuất.
6. Nếu sửa `data/all_units_data.json`, chạy `python scripts/generate_embedded_bundle.py` để cập nhật `js/embedded_data.js`.

## 6. Yêu cầu normalization/chấm điểm

- Kiểm tra và nâng cấp `checkAnswer` và `checkExamAnswer` trong `js/app.js` nếu cần.
- Normalization tối thiểu phải xử lý: trim khoảng trắng, lowercase, chuẩn hóa `'` và `’`, gom nhiều spaces, bỏ dấu chấm/phẩy cuối câu cho short answer, và so khớp `acceptable_variants`.
- Không làm lỏng tới mức nhận câu sai là đúng; chỉ bỏ khác biệt định dạng không làm đổi nghĩa.

## 7. Testing, build và packaging

1. Chạy lại QA scan: `python scripts/qa_full_48_units_diagnostic.py`.
   - Nếu Python mặc định thiếu `pdfplumber`/`pypdf`, dùng runtime Codex: `C:\\Users\\Admin\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe scripts\\qa_full_48_units_diagnostic.py`.
2. Chạy data validation: `python scripts/verify_all_data.py` và các script test hiện có liên quan đến quiz/exam.
3. Chạy E2E test đạt 100% pass rate cho cả 48 Units: mở app, vào từng Unit, render Ngữ Pháp/Lý Thuyết và Bài Thi Online, nộp bài bằng đáp án đúng, xác nhận điểm/chấm đúng.
4. Cập nhật database seeder/rebuild script nếu dữ liệu sửa thủ công có nguy cơ bị ghi đè bởi pipeline.
5. Đóng gói bản phát hành bằng `python scripts/build_exe.py`.
6. Sau build, chạy `python scripts/clean_system_and_temp.py`.
7. Xuất báo cáo nghiệm thu `reports/final_acceptance_test_log.md` gồm: commit/datetime, files changed, commands run, pass/fail, số câu hỏi, số explanation regenerate, danh sách issue đã resolved, residual risks.

## 8. Điều kiện hoàn thành

- Không còn issue high/critical trong QA report.
- Không còn explanation placeholder/generic.
- `js/embedded_data.js` đồng bộ với `data/all_units_data.json`.
- App chạy offline bình thường.
- EXE mới được build và báo cáo nghiệm thu được lưu trong `reports/`.
"""


def build_markdown_report(summary: dict[str, Any], unit_rows: list[dict[str, Any]], issues: list[Issue], generated_at: str) -> str:
    category_rows = [[cat, count] for cat, count in sorted(summary["category_counts"].items(), key=lambda x: (-x[1], x[0]))]
    severity_rows = [[sev, count] for sev, count in sorted(summary["severity_counts"].items(), key=lambda x: x[0])]
    units_table = markdown_table(
        [
            [
                row["unit"],
                row["question_count"],
                "yes" if row["exam_pdf"] else "no",
                "yes" if row["answer_pdf"] else "no",
                "yes" if row["theory_pdf"] else "no",
                row["exam_image_count"],
                row["issue_count"],
            ]
            for row in unit_rows
        ],
        ["Unit", "Questions", "Exam PDF", "Answer PDF", "Theory PDF", "Exam Images", "Issues"],
    )
    top_issue_rows = [
        [issue.severity, issue.category, issue.unit or "-", issue.qid or "-", issue.message]
        for issue in sorted(issues, key=lambda i: ({"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}.get(i.severity, 9), i.unit or 0))[:120]
    ]
    return f"""# Full 48 Units QA Diagnostic Report

Generated: {generated_at}

## Summary

- Units scanned: {summary["units_scanned"]}/48
- Total questions: {summary["total_questions"]}
- Total issues/risks: {summary["total_issues"]}
- PDF folders found: {summary["pdf_folders_found"]}/48
- Exam PDFs found: {summary["exam_pdfs_found"]}/48
- Answer PDFs found: {summary["answer_pdfs_found"]}/48
- Theory PDFs found: {summary["theory_pdfs_found"]}/48

## Severity Counts

{markdown_table(severity_rows, ["Severity", "Count"])}

## Category Counts

{markdown_table(category_rows, ["Category", "Count"])}

## Unit Coverage

{units_table}

## Highest Priority Findings

{markdown_table(top_issue_rows, ["Severity", "Category", "Unit", "QID", "Message"])}

Full machine-readable details are in `reports/full_48_units_qa_report.json`.
The Antigravity handoff prompt is in `reports/MASTER_FIX_PROMPT_ANTIGRAVITY.md`.
"""


def run_audit(pdf_root: Path) -> tuple[dict[str, Any], list[dict[str, Any]], list[Issue]]:
    data = safe_read_json(DATA_FILE)
    app_js = APP_JS.read_text(encoding="utf-8")
    pdfplumber_module = import_pdfplumber()
    issues: list[Issue] = []
    unit_rows: list[dict[str, Any]] = []
    pdf_folders_found = exam_pdfs_found = answer_pdfs_found = theory_pdfs_found = 0
    total_questions = 0

    if sorted(int(k) for k in data.keys() if str(k).isdigit()) != list(range(1, 49)):
        issues.append(
            Issue(
                "critical",
                "unit_coverage",
                None,
                None,
                "data/all_units_data.json",
                "Expected unit keys 1..48 exactly.",
                sorted(data.keys()),
                "Restore complete 48-unit coverage.",
            )
        )

    for unit_id in range(1, 49):
        unit = data.get(str(unit_id), {})
        tests = unit.get("unit_test") or []
        total_questions += len(tests)
        folder = find_unit_folder(pdf_root, unit_id)
        if folder:
            pdf_folders_found += 1
        pdf_files = classify_pdf_files(folder)
        exam_pdfs_found += 1 if pdf_files["exam"] else 0
        answer_pdfs_found += 1 if pdf_files["answer"] else 0
        theory_pdfs_found += 1 if pdf_files["theory"] else 0

        exam_text, exam_pages, exam_images, exam_err = extract_pdf_text(pdf_files["exam"], pdfplumber_module) if pdf_files["exam"] else ("", 0, 0, "missing_exam_pdf")
        answer_text, answer_pages, answer_images, answer_err = extract_pdf_text(pdf_files["answer"], pdfplumber_module) if pdf_files["answer"] else ("", 0, 0, "missing_answer_pdf")
        theory_text, theory_pages, theory_images, theory_err = extract_pdf_text(pdf_files["theory"], pdfplumber_module) if pdf_files["theory"] else ("", 0, 0, "missing_theory_pdf")
        exam_norm = compact_text(exam_text)
        answer_norm = compact_text(answer_text)

        for kind, err in [("exam", exam_err), ("answer", answer_err), ("theory", theory_err)]:
            if err:
                issues.append(
                    Issue(
                        "high" if "missing" in err else "medium",
                        "pdf_source_availability",
                        unit_id,
                        None,
                        str(folder or pdf_root),
                        f"{kind} PDF unavailable or unreadable: {err}",
                        str(pdf_files.get(kind)),
                        "Restore/read the source PDF before final fixing.",
                    )
                )

        titles = collect_titles(unit)
        seen_ids: set[str] = set()
        app_image_questions = 0
        for q in tests:
            q["_unit_id"] = unit_id
            qid = str(q.get("id") or "")
            if not qid or qid in seen_ids:
                issues.append(
                    Issue(
                        "high",
                        "duplicate_or_missing_question_id",
                        unit_id,
                        qid or None,
                        f"data/all_units_data.json:unit {unit_id}:unit_test",
                        "Question id is missing or duplicated within the unit.",
                        qid,
                        "Assign a stable unique id.",
                    )
                )
            seen_ids.add(qid)

            if not q.get("stem"):
                issues.append(
                    Issue(
                        "critical",
                        "missing_stem",
                        unit_id,
                        qid,
                        f"data/all_units_data.json:unit {unit_id}:unit_test:{qid}",
                        "Question has no stem.",
                        q,
                        "Fill stem from source exam PDF.",
                    )
                )

            dirty = detect_dirty_answer(q)
            if dirty:
                issues.append(dirty)
            plural = detect_plural_issue(q)
            if plural:
                issues.append(plural)
            title_issue = detect_answer_title_issue(unit, q, titles)
            if title_issue:
                issues.append(title_issue)
            expl = detect_explanation_issue(q)
            if expl:
                issues.append(expl)
            prep = detect_preposition_variant(q)
            if prep:
                issues.append(prep)
            issues.extend(detect_question_semantics(q))

            if not correct_answer_matches_options(q):
                issues.append(
                    Issue(
                        "high",
                        "correct_answer_option_mismatch",
                        unit_id,
                        qid,
                        f"data/all_units_data.json:unit {unit_id}:unit_test:{qid}",
                        "correct_answer does not match any option or valid option letter.",
                        {"correct_answer": q.get("correct_answer"), "options": q.get("options")},
                        "Align correct_answer with options and acceptable_variants.",
                    )
                )

            if q.get("type") == "IMAGE_FILL" or q.get("image_url"):
                app_image_questions += 1
                raw_image = str(q.get("image_url") or "")
                image_path = Path(raw_image)
                if raw_image and not image_path.is_absolute():
                    image_path = ROOT / raw_image
                if not raw_image or not image_path.exists():
                    issues.append(
                        Issue(
                            "high",
                            "missing_or_invalid_image_asset",
                            unit_id,
                            qid,
                            f"data/all_units_data.json:unit {unit_id}:unit_test:{qid}",
                            "Image question has missing or non-existing image_url.",
                            raw_image,
                            "Point image_url to an existing extracted source image.",
                        )
                    )

            issues.extend(detect_pdf_text_mismatch(q, exam_norm, answer_norm))

        if exam_images > 0 and app_image_questions == 0:
            issues.append(
                Issue(
                    "medium",
                    "pdf_visual_review_required",
                    unit_id,
                    None,
                    str(pdf_files["exam"]),
                    "Exam PDF contains images but app data has no IMAGE_FILL/image_url questions for this unit.",
                    {"exam_image_count": exam_images, "question_count": len(tests)},
                    "Manually verify image/text alignment, especially clock/location/person-object questions.",
                )
            )
        elif exam_images > 0:
            issues.append(
                Issue(
                    "low",
                    "pdf_visual_review_required",
                    unit_id,
                    None,
                    str(pdf_files["exam"]),
                    "Exam PDF contains images; text extraction cannot prove image-answer alignment.",
                    {"exam_image_count": exam_images, "app_image_questions": app_image_questions},
                    "Run visual QA/OCR/vision check for clock, location and picture-description answers.",
                )
            )

        grammar = unit.get("grammar") or {}
        full_theory = str(grammar.get("full_text") or unit.get("full_theory_text") or "")
        if theory_text and full_theory:
            theory_words = words_for_match(full_theory[:2000])
            hits = sum(1 for w in set(theory_words) if w in compact_text(theory_text))
            ratio = hits / max(1, len(set(theory_words)))
            if ratio < 0.65:
                issues.append(
                    Issue(
                        "medium",
                        "grammar_theory_pdf_text_drift",
                        unit_id,
                        None,
                        f"data/all_units_data.json:unit {unit_id}:grammar.full_text",
                        f"Embedded grammar/theory text has weak overlap with theory PDF text ({ratio:.0%}).",
                        {"theory_file": str(pdf_files["theory"])},
                        "Re-extract or manually compare grammar sections against the theory PDF.",
                    )
                )

        unit_rows.append(
            {
                "unit": unit_id,
                "question_count": len(tests),
                "folder": str(folder) if folder else None,
                "exam_pdf": str(pdf_files["exam"]) if pdf_files["exam"] else None,
                "answer_pdf": str(pdf_files["answer"]) if pdf_files["answer"] else None,
                "theory_pdf": str(pdf_files["theory"]) if pdf_files["theory"] else None,
                "exam_pages": exam_pages,
                "answer_pages": answer_pages,
                "theory_pages": theory_pages,
                "exam_image_count": exam_images,
                "answer_image_count": answer_images,
                "theory_image_count": theory_images,
                "issue_count": 0,
            }
        )

    issues.extend(audit_normalization_logic(app_js))

    issue_counts_by_unit = Counter(issue.unit for issue in issues if issue.unit is not None)
    for row in unit_rows:
        row["issue_count"] = issue_counts_by_unit.get(row["unit"], 0)

    summary = {
        "units_scanned": len([k for k in data.keys() if str(k).isdigit()]),
        "total_questions": total_questions,
        "total_issues": len(issues),
        "pdf_root": str(pdf_root),
        "pdf_folders_found": pdf_folders_found,
        "exam_pdfs_found": exam_pdfs_found,
        "answer_pdfs_found": answer_pdfs_found,
        "theory_pdfs_found": theory_pdfs_found,
        "severity_counts": dict(Counter(issue.severity for issue in issues)),
        "category_counts": dict(Counter(issue.category for issue in issues)),
    }
    return summary, unit_rows, issues


def main() -> int:
    parser = argparse.ArgumentParser(description="Full QA diagnostic for SMOB English Lab 48 Units.")
    parser.add_argument("--pdf-root", default=str(DEFAULT_PDF_ROOT), help="Root folder containing NGÀY 1..48 PDF folders.")
    args = parser.parse_args()

    sys.stdout.reconfigure(encoding="utf-8")
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf_root = Path(args.pdf_root)
    REPORT_DIR.mkdir(exist_ok=True)

    print("=== SMOB English Lab Full 48 Units QA Diagnostic ===")
    print(f"Data: {DATA_FILE}")
    print(f"PDF root: {pdf_root}")

    summary, unit_rows, issues = run_audit(pdf_root)
    issue_dicts = [issue.as_dict() for issue in issues]
    report_json = {
        "generated_at": generated_at,
        "summary": summary,
        "units": unit_rows,
        "issues": issue_dicts,
    }

    json_path = REPORT_DIR / "full_48_units_qa_report.json"
    md_path = REPORT_DIR / "full_48_units_qa_report.md"
    prompt_path = REPORT_DIR / "MASTER_FIX_PROMPT_ANTIGRAVITY.md"

    json_path.write_text(json.dumps(report_json, ensure_ascii=False, indent=2), encoding="utf-8")
    md_path.write_text(build_markdown_report(summary, unit_rows, issues, generated_at), encoding="utf-8")
    prompt_path.write_text(build_master_prompt(summary, issues, generated_at), encoding="utf-8")

    print("\n=== Summary ===")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    print(f"\nWrote: {json_path}")
    print(f"Wrote: {md_path}")
    print(f"Wrote: {prompt_path}")
    return 1 if any(issue.severity in {"critical", "high"} for issue in issues) else 0


if __name__ == "__main__":
    raise SystemExit(main())
