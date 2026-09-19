# -*- coding: utf-8 -*-
"""
SMOB English Lab — Windows Desktop Application
Version 2.5 (High-Performance Learning Suite with Multi-Threaded Streaming Engine)
"""

import os
import sys
import json
import socket
import threading
import time
import urllib.parse
import mimetypes
import re
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver
import webview

# Safeguard stdout/stderr in PyInstaller --windowed / --noconsole environments
if sys.stdout is not None:
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if sys.stderr is None:
    sys.stderr = open(os.devnull, 'w')
if sys.stdout is None:
    sys.stdout = open(os.devnull, 'w')

def get_base_dir():
    if hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

def resolve_source_root():
    exe_dir = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.path.dirname(os.path.abspath(__file__))
    candidates = [
        # 1. Next to the executable (portable / shared copy)
        os.path.join(exe_dir, "Drive_Download"),
        os.path.join(exe_dir, "Tai lieu_ENG", "Drive_Download"),
        os.path.join(exe_dir, "Tai lieu_ENG"),
        os.path.join(exe_dir, "media"),
        # 2. In parent directory of executable
        os.path.join(os.path.dirname(exe_dir), "Drive_Download"),
        os.path.join(os.path.dirname(exe_dir), "Tai lieu_ENG", "Drive_Download"),
        # 3. Current working directory
        os.path.join(os.getcwd(), "Drive_Download"),
        os.path.join(os.getcwd(), "Tai lieu_ENG", "Drive_Download"),
        # 4. Standard local dev paths
        r"D:\2.English\Tai lieu_ENG\Drive_Download",
        r"D:\2.English\Tai lieu\_ENG\Drive\_Download",
        # 5. User documents folder
        os.path.expanduser(r"~\Documents\Drive_Download"),
        os.path.expanduser(r"~\Desktop\Drive_Download"),
    ]
    for c in candidates:
        if os.path.isdir(c):
            return c
    return candidates[0]

def find_free_port(start_port=56789):
    for port in range(start_port, start_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return 56789

class MediaHTTPRequestHandler(SimpleHTTPRequestHandler):
    """
    High-Performance, Non-Blocking HTTP Request Handler with Full HTTP/1.1
    Range Request Support (206 Partial Content) for Smooth Video & Audio Streaming.
    Guarantees zero-deadlock and immediate socket reclamation.
    """
    protocol_version = 'HTTP/1.1'
    timeout = 5.0  # 5-second socket timeout ensures no thread can ever hang indefinitely

    def log_message(self, format, *args):
        pass  # Completely suppress request logging for maximum throughput

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (socket.timeout, TimeoutError):
            self.close_connection = True
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            self.close_connection = True

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_HEAD(self):
        self.handle_request(send_body=False)

    def do_GET(self):
        self.handle_request(send_body=True)

    def send_file_range(self, file_path, custom_mime=None, send_body=True):
        if not os.path.isfile(file_path):
            self.send_error(404, "File Not Found")
            return

        try:
            file_size = os.path.getsize(file_path)
        except OSError:
            self.send_error(404, "Unable to read file size")
            return

        mimetype = custom_mime
        if not mimetype:
            mimetype, _ = mimetypes.guess_type(file_path)
            if not mimetype:
                if file_path.lower().endswith('.mp4'):
                    mimetype = 'video/mp4'
                elif file_path.lower().endswith('.webm'):
                    mimetype = 'video/webm'
                elif file_path.lower().endswith('.mp3'):
                    mimetype = 'audio/mpeg'
                elif file_path.lower().endswith('.wav'):
                    mimetype = 'audio/wav'
                elif file_path.lower().endswith('.js'):
                    mimetype = 'application/javascript; charset=utf-8'
                elif file_path.lower().endswith('.css'):
                    mimetype = 'text/css; charset=utf-8'
                elif file_path.lower().endswith('.json'):
                    mimetype = 'application/json; charset=utf-8'
                else:
                    mimetype = 'application/octet-stream'

        range_header = self.headers.get('Range')
        if range_header and range_header.startswith('bytes='):
            range_match = re.search(r'bytes=(\d+)-(\d*)', range_header)
            if range_match:
                start = int(range_match.group(1))
                end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
                if start >= file_size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    return
                end = min(end, file_size - 1)
                length = end - start + 1

                self.send_response(206)
                self.send_header('Content-Type', mimetype)
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Content-Length', str(length))
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                if send_body:
                    try:
                        with open(file_path, 'rb') as f:
                            f.seek(start)
                            remaining = length
                            while remaining > 0:
                                chunk_size = min(65536, remaining)
                                chunk = f.read(chunk_size)
                                if not chunk:
                                    break
                                self.wfile.write(chunk)
                                remaining -= len(chunk)
                    except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, socket.timeout):
                        self.close_connection = True
                return

        # Full file response
        self.send_response(200)
        self.send_header('Content-Type', mimetype)
        self.send_header('Content-Length', str(file_size))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if send_body:
            try:
                with open(file_path, 'rb') as f:
                    while True:
                        chunk = f.read(65536)
                        if not chunk:
                            break
                        self.wfile.write(chunk)
            except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, socket.timeout):
                self.close_connection = True

    def handle_request(self, send_body=True):
        parsed = urllib.parse.urlparse(self.path)
        raw_path = parsed.path
        server = self.server.media_server

        # 1. Route: / or /index.html
        if raw_path in ('/', '/index.html'):
            target = os.path.join(server.base_dir, 'index.html')
            self.send_file_range(target, 'text/html; charset=utf-8', send_body)
            return

        # 2. Route: /video/<unit_id>
        video_match = re.match(r'^/video/(\d+)$', raw_path)
        if video_match:
            unit_id = int(video_match.group(1))
            if unit_id in [12, 13]:
                self.send_error(404, "Video bài giảng hiện chưa có trong bộ dữ liệu gốc.")
                return
            folder = server.get_unit_folder(unit_id)
            if not folder:
                self.send_error(404, f"Thư mục Unit {unit_id} không tồn tại.")
                return
            video_file = server.get_unit_video_filename(folder)
            if not video_file:
                self.send_error(404, f"Không tìm thấy file video cho Unit {unit_id}.")
                return
            full_path = os.path.join(folder, video_file)
            self.send_file_range(full_path, None, send_body)
            return

        # 3. Route: /audio/<unit_id>/<filename>
        audio_match = re.match(r'^/audio/(\d+)/(.+)$', raw_path)
        if audio_match:
            unit_id = int(audio_match.group(1))
            filename = urllib.parse.unquote(audio_match.group(2))
            folder = server.get_unit_folder(unit_id)
            if not folder:
                self.send_error(404, f"Thư mục Unit {unit_id} không tồn tại.")
                return
            actual_file = filename
            if not os.path.isfile(os.path.join(folder, actual_file)):
                for f in os.listdir(folder):
                    if f.lower() == filename.lower():
                        actual_file = f
                        break
            full_path = os.path.join(folder, actual_file)
            self.send_file_range(full_path, None, send_body)
            return

        # 4. Route: /api/video_info/<unit_id>
        info_match = re.match(r'^/api/video_info/(\d+)$', raw_path)
        if info_match:
            unit_id = int(info_match.group(1))
            if unit_id in [12, 13]:
                data = {"available": False, "message": "Chưa có video trong nguồn gốc."}
            else:
                folder = server.get_unit_folder(unit_id)
                if not folder:
                    data = {"available": False, "message": "Thư mục không tồn tại."}
                else:
                    video_file = server.get_unit_video_filename(folder)
                    if not video_file:
                        data = {"available": False, "message": "Không tìm thấy file video."}
                    else:
                        full_path = os.path.join(folder, video_file)
                        size_mb = os.path.getsize(full_path) / (1024 * 1024)
                        data = {
                            "available": True,
                            "filename": video_file,
                            "size_mb": round(size_mb, 1),
                            "url": f"/video/{unit_id}"
                        }
            body = json.dumps(data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            if send_body:
                try:
                    self.wfile.write(body)
                except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, socket.timeout):
                    self.close_connection = True
            return

        # 5. Route: Static assets in base_dir (css/, js/, data/, assets/, favicon.ico, etc.)
        safe_rel = raw_path.lstrip('/')
        target = os.path.abspath(os.path.join(server.base_dir, safe_rel))
        # Prevent directory traversal
        if not target.startswith(os.path.abspath(server.base_dir)):
            self.send_error(403, "Access Denied")
            return

        if os.path.isfile(target):
            self.send_file_range(target, None, send_body)
        else:
            self.send_error(404, "File Not Found")

class ThreadedHTTPServer(socketserver.ThreadingMixIn, HTTPServer):
    daemon_threads = True
    block_on_close = False

class MediaServer:
    def __init__(self, base_dir, source_root, port):
        self.base_dir = base_dir
        self.source_root = source_root
        self.port = port
        self.httpd = None

    def get_unit_folder(self, unit_id):
        uid = int(unit_id)
        candidates = [
            f"NGÀY {uid}",
            f"NGAY {uid}",
            f"Ngày {uid}",
            f"Ngay {uid}"
        ]
        for name in candidates:
            p = os.path.join(self.source_root, name)
            if os.path.isdir(p):
                return p

        # Fallback: scan directories for matching number
        if os.path.isdir(self.source_root):
            for d in os.listdir(self.source_root):
                full_d = os.path.join(self.source_root, d)
                if os.path.isdir(full_d):
                    norm = d.upper().replace('À', 'A').replace('Á', 'A')
                    if norm == f"NGAY {uid}":
                        return full_d
        return None

    def get_unit_video_filename(self, folder):
        if not folder or not os.path.isdir(folder):
            return None
        all_files = os.listdir(folder)
        # 1. Prioritize merged full video files (*_Full.mp4 / *_full.mp4)
        fulls = [f for f in all_files if f.lower().endswith('_full.mp4')]
        if fulls:
            return fulls[0]
        # 2. Look for regular mp4 files that are NOT video-only/audio-only stream dumps
        valid_mp4s = [f for f in all_files if f.lower().endswith('.mp4') and not re.search(r'\.f\d+', f)]
        if valid_mp4s:
            return valid_mp4s[0]
        # 3. Look for regular webm files that are not stream dumps
        valid_webms = [f for f in all_files if f.lower().endswith('.webm') and not re.search(r'\.f\d+', f)]
        if valid_webms:
            return valid_webms[0]
        # 4. Fallback to any mp4
        mp4s = [f for f in all_files if f.lower().endswith('.mp4')]
        if mp4s:
            return mp4s[0]
        return None

    def start(self):
        self.httpd = ThreadedHTTPServer(('127.0.0.1', self.port), MediaHTTPRequestHandler)
        self.httpd.media_server = self
        self.httpd.serve_forever()

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()

class AppApi:
    def __init__(self, port, source_root, server=None):
        self.port = port
        self.source_root = source_root
        self.server = server
        self.window = None

    def set_window(self, window):
        self.window = window

    def get_server_port(self):
        return self.port

    def get_source_root(self):
        return self.source_root

    def get_video_url(self, unit_id):
        return f"http://127.0.0.1:{self.port}/video/{int(unit_id)}"

    def launch_video(self, unit_id, video_file=None):
        """Fallback: Mở video bằng player bên ngoài của Windows"""
        uid = int(unit_id)
        if uid in [12, 13]:
            return {"status": "MISSING", "message": "Video bài giảng hiện chưa có trong bộ dữ liệu gốc."}

        folder = self.server.get_unit_folder(uid) if self.server else None
        if not folder:
            candidates = [f"NGÀY {uid}", f"NGAY {uid}", f"Ngày {uid}"]
            for c in candidates:
                p = os.path.join(self.source_root, c)
                if os.path.isdir(p):
                    folder = p
                    break

        if not folder:
            return {"status": "ERROR", "message": f"Thư mục Unit {uid} không tồn tại."}

        target_file_name = self.server.get_unit_video_filename(folder) if self.server else None
        if target_file_name:
            target_file = os.path.join(folder, target_file_name)
            if os.path.isfile(target_file):
                try:
                    os.startfile(target_file)
                    return {"status": "SUCCESS", "path": target_file}
                except Exception as e:
                    return {"status": "ERROR", "message": str(e)}

        return {"status": "MISSING", "message": "Video bài giảng hiện chưa có trong bộ dữ liệu."}

    def open_browser(self, url):
        """Mở liên kết tra cứu bên ngoài bằng trình duyệt mặc định của hệ thống"""
        try:
            import webbrowser
            webbrowser.open(url)
            return {"status": "SUCCESS"}
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

    def launch_pdf(self, path=None):
        """Mở file PDF kế hoạch học tập bằng phần mềm xem PDF mặc định của Windows"""
        target = path or r"D:\2.English\Lo_Trinh_48_Ngay_Thong_Tha_SMOB.pdf"
        if not os.path.isfile(target):
            alt = r"D:\2.English\Ke_Hoach_Hoc_Tieng_Anh_Tuan_1_SMOB.pdf"
            if os.path.isfile(alt):
                target = alt
        if os.path.isfile(target):
            try:
                os.startfile(target)
                return {"status": "SUCCESS", "path": target}
            except Exception as e:
                return {"status": "ERROR", "message": str(e)}
        return {"status": "ERROR", "message": f"Không tìm thấy file PDF tại: {target}"}

    def save_backup_file(self, data_json):
        """Mở hộp thoại lưu file dữ liệu học tập (.json) trên Windows"""
        try:
            win = self.window or (webview.windows[0] if webview.windows else None)
            if win:
                file_path = win.create_file_dialog(
                    webview.SAVE_DIALOG,
                    save_filename="SMOB_English_Lab_Backup.json",
                    file_types=('JSON files (*.json)', 'All files (*.*)')
                )
                if file_path:
                    if isinstance(file_path, (list, tuple)):
                        file_path = file_path[0]
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(data_json)
                    return {"status": "SUCCESS", "path": file_path}
            return {"status": "CANCELLED"}
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

    def load_backup_file(self):
        """Mở hộp thoại nạp file dữ liệu học tập (.json) trên Windows"""
        try:
            win = self.window or (webview.windows[0] if webview.windows else None)
            if win:
                file_path = win.create_file_dialog(
                    webview.OPEN_DIALOG,
                    file_types=('JSON files (*.json)', 'All files (*.*)')
                )
                if file_path:
                    if isinstance(file_path, (list, tuple)):
                        file_path = file_path[0]
                    if os.path.isfile(file_path):
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                        return {"status": "SUCCESS", "data": content, "path": file_path}
            return {"status": "CANCELLED"}
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

def main():
    base_dir = get_base_dir()
    source_root = resolve_source_root()
    port = find_free_port(56789)

    # 1. Start local multi-threaded streaming server in background daemon thread
    server = MediaServer(base_dir, source_root, port)
    server_thread = threading.Thread(target=server.start, daemon=True)
    server_thread.start()

    # Wait until server is actually ready (avoids WebView2 "connection refused" on first request)
    for _ in range(30):  # up to 3 seconds
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=0.1):
                break
        except OSError:
            time.sleep(0.1)

    api = AppApi(port, source_root, server)
    app_url = f"http://127.0.0.1:{port}/index.html"

    # 2. Configure dedicated persistent profile storage for WebView2 (avoids random %TEMP% directories)
    data_folder = os.environ.get('APPDATA') or os.path.expanduser('~')
    storage_path = os.path.join(data_folder, 'SMOB_English_Lab', 'webview_profile')
    os.makedirs(storage_path, exist_ok=True)

    window = webview.create_window(
        title='SMOB English Lab — 48-Day Foundation Course (v2.5 - All-in-One Learning Suite)',
        url=app_url,
        js_api=api,
        width=1320,
        height=850,
        min_size=(1024, 700),
        background_color='#f5f5f7'
    )
    api.set_window(window)

    # 3. Launch PyWebView with explicit EdgeChromium engine & persistent profile storage
    webview.start(
        gui='edgechromium',
        private_mode=False,
        storage_path=storage_path,
        debug=False
    )

if __name__ == '__main__':
    main()
