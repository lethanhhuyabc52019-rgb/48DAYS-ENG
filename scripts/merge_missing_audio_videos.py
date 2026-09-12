# -*- coding: utf-8 -*-
"""
Merge separate video-only (.f398/.f396 .mp4) and audio-only (.f251 .webm) streams
into full 1080p MP4 with AAC audio for Units 1, 2, 3, 7, 9.
"""

import os
import sys
import subprocess
import imageio_ffmpeg

sys.stdout.reconfigure(encoding='utf-8')

SOURCE_ROOT = r"D:\2.English\Tai lieu_ENG\Drive_Download"

TARGET_UNITS = [
    (1, "NGÀY 1", "Unit 01_Full.mp4"),
    (2, "NGÀY 2", "Unit 02_Full.mp4"),
    (3, "NGÀY 3", "Unit 03_Full.mp4"),
    (7, "NGÀY 7", "Unit 07_Full.mp4"),
    (9, "NGÀY 9", "Unit 09_Full.mp4"),
]

def main():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"Using FFmpeg: {ffmpeg_exe}")

    for uid, folder_name, out_filename in TARGET_UNITS:
        folder_path = os.path.join(SOURCE_ROOT, folder_name)
        if not os.path.isdir(folder_path):
            print(f"[-] Folder not found: {folder_path}")
            continue

        out_path = os.path.join(folder_path, out_filename)
        if os.path.isfile(out_path) and os.path.getsize(out_path) > 10 * 1024 * 1024:
            print(f"[+] Already merged: {out_path} ({round(os.path.getsize(out_path)/(1024*1024), 2)} MB)")
            continue

        files = os.listdir(folder_path)
        video_cand = [f for f in files if ('.f398' in f or '.f396' in f) and f.endswith('.mp4')]
        audio_cand = [f for f in files if ('.f251' in f or 'webm' in f) and f.endswith('.webm')]

        if not video_cand or not audio_cand:
            print(f"[-] Missing video or audio cand in {folder_name}: video={video_cand}, audio={audio_cand}")
            continue

        v_file = os.path.join(folder_path, video_cand[0])
        a_file = os.path.join(folder_path, audio_cand[0])

        print(f"[*] Merging Unit {uid}:")
        print(f"    Video: {video_cand[0]}")
        print(f"    Audio: {audio_cand[0]}")
        print(f"    Output: {out_filename}")

        cmd = [
            ffmpeg_exe,
            "-y",
            "-i", v_file,
            "-i", a_file,
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            out_path
        ]

        ret = subprocess.run(cmd, capture_output=True)
        if ret.returncode == 0 and os.path.isfile(out_path):
            size_mb = os.path.getsize(out_path) / (1024 * 1024)
            print(f"[OK] Successfully created {out_filename} ({round(size_mb, 2)} MB)")
        else:
            print(f"[ERR] Failed to merge {folder_name}: {ret.stderr.decode('utf-8', errors='ignore')}")

if __name__ == '__main__':
    main()
