# -*- coding: utf-8 -*-
"""
Validation script for SMOB English Lab: Listening & Audio Questions
Validates data consistency between disk audio files, unit metadata, and questions.
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'all_units_data.json')
DRIVE_DIR = r"D:\2.English\Tai lieu_ENG\Drive_Download"

def clean_str(s):
    return ''.join(c.lower() for c in (s or '') if c.isalnum())

def main():
    print("=== BẮT ĐẦU KIỂM TRA DỮ LIỆU LUYỆN NGHE (LISTENING VALIDATION) ===")
    
    if not os.path.isfile(DATA_FILE):
        print(f"[ERROR] Không tìm thấy tệp {DATA_FILE}")
        return False

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)

    total_audio_units = 0
    total_audio_tracks = 0
    total_audio_questions = 0
    missing_disk_files = []
    orphaned_questions = []
    missing_answer_questions = []
    unmatched_tracks = []

    for uid in range(1, 49):
        u = db.get(str(uid), {})
        has_audio = u.get('has_audio', False)
        audio_files = u.get('audio_files') or u.get('source_trace', {}).get('audio_files', [])
        unit_test = u.get('unit_test', [])

        if not has_audio and not audio_files:
            continue

        total_audio_units += 1
        folder = os.path.join(DRIVE_DIR, f"NGÀY {uid}")

        # 1. Check disk files
        for af in audio_files:
            total_audio_tracks += 1
            path = os.path.join(folder, af)
            if not os.path.isfile(path):
                missing_disk_files.append((uid, af, path))

        # 2. Check track matching & questions
        test_audio_qs = [q for q in unit_test if q.get('audio_track')]
        total_audio_questions += len(test_audio_qs)

        for q in test_audio_qs:
            q_track = q.get('audio_track')
            clean_q = clean_str(q_track)
            
            # Check answer
            ans = q.get('correct_answer') or q.get('answer')
            if not ans or not str(ans).strip():
                missing_answer_questions.append((uid, q.get('id'), q.get('stem')))

            # Check if track is in audio_files
            matched_af = any(clean_str(af) == clean_q for af in audio_files)
            if not matched_af:
                orphaned_questions.append((uid, q.get('id'), q_track))

        for af in audio_files:
            clean_af = clean_str(af)
            matched_qs = [q for q in test_audio_qs if clean_str(q.get('audio_track')) == clean_af]
            if len(matched_qs) == 0:
                unmatched_tracks.append((uid, af))

    print(f"Tổng số Unit có Audio: {total_audio_units} / 48")
    print(f"Tổng số File Audio MP3: {total_audio_tracks}")
    print(f"Tổng số Câu hỏi Luyện nghe: {total_audio_questions}")

    success = True

    if missing_disk_files:
        print(f"\n[!] CẢNH BÁO: {len(missing_disk_files)} file audio thiếu trên ổ đĩa:")
        for uid, af, p in missing_disk_files:
            print(f"   - Unit {uid}: {af} -> {p}")
        success = False
    else:
        print("✓ 100% File audio MP3 tồn tại đầy đủ trên ổ đĩa!")

    if missing_answer_questions:
        print(f"\n[!] LỖI: {len(missing_answer_questions)} câu hỏi thiếu đáp án đúng:")
        for uid, qid, stem in missing_answer_questions:
            print(f"   - Unit {uid}, ID {qid}: {stem}")
        success = False
    else:
        print("✓ 100% Câu hỏi luyện nghe có đáp án đúng chuẩn xác!")

    if orphaned_questions:
        print(f"\n[!] LỖI: {len(orphaned_questions)} câu hỏi có track không khớp metadata audio_files:")
        for uid, qid, trk in orphaned_questions:
            print(f"   - Unit {uid}, ID {qid}, track {trk}")
        success = False
    else:
        print("✓ 100% Câu hỏi luyện nghe khớp đúng file audio MP3!")

    if unmatched_tracks:
        print(f"\n[INFO] {len(unmatched_tracks)} track audio không có câu hỏi test riêng (dùng cho shadowing):")
        for uid, af in unmatched_tracks:
            print(f"   - Unit {uid}: {af}")
    else:
        print("✓ 100% File audio đều có bài tập đi kèm tương ứng!")

    print("\n=== KẾT QUẢ KIỂM TRA: " + ("ĐẠT CHUẨN 100%" if success else "CÓ LỖI") + " ===")
    return success

if __name__ == '__main__':
    ok = main()
    sys.exit(0 if ok else 1)
