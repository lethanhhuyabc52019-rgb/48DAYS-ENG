# -*- coding: utf-8 -*-
"""
Download and merge Unit 1 video with full video and audio into Unit 01_Full.mp4
"""
import os
import sys
import subprocess
import imageio_ffmpeg

sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"D:\2.English\Tai lieu_ENG\Drive_Download\NGÀY 1"
OUT_FILE = os.path.join(SOURCE_DIR, "Unit 01_Full.mp4")
YT_URL = "https://www.youtube.com/watch?v=A2SD8BeJq-I"

def main():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"Using FFmpeg: {ffmpeg_exe}")
    
    # We use yt-dlp to download best video (mp4/h264) + best audio (m4a/aac) and merge
    cmd = [
        "yt-dlp",
        "--ffmpeg-location", ffmpeg_exe,
        "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
        "--merge-output-format", "mp4",
        "-o", OUT_FILE,
        YT_URL
    ]
    
    print(f"Downloading & merging Unit 1 video from: {YT_URL}")
    ret = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    print("STDOUT:", ret.stdout[-500:] if ret.stdout else "")
    if ret.returncode != 0:
        print("STDERR:", ret.stderr[-500:] if ret.stderr else "")
    
    if os.path.isfile(OUT_FILE) and os.path.getsize(OUT_FILE) > 10 * 1024 * 1024:
        size_mb = os.path.getsize(OUT_FILE) / (1024 * 1024)
        print(f"[SUCCESS] Unit 01_Full.mp4 created successfully! Size: {round(size_mb, 2)} MB")
    else:
        print("[ERROR] Failed to create Unit 01_Full.mp4")

if __name__ == '__main__':
    main()
