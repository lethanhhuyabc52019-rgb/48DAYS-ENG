# -*- coding: utf-8 -*-
"""
SMOB English Lab — Windows Desktop Application
Version 2.0 (All-in-One Learning Suite with In-App Video & Audio Streaming)
"""

import os
import sys
import json
import socket
import threading
import webview
import bottle

sys.stdout.reconfigure(encoding='utf-8')

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

class MediaServer:
    def __init__(self, base_dir, source_root, port):
        self.base_dir = base_dir
        self.source_root = source_root
        self.port = port
        self.app = bottle.Bottle()
        self.setup_routes()

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
        # 2. Look for regular mp4 files that are NOT video-only/audio-only stream dumps (.f398 / .f396 / .f251 etc.)
        import re
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

    def setup_routes(self):
        @self.app.route('/')
        @self.app.route('/index.html')
        def index():
            return bottle.static_file('index.html', root=self.base_dir)

        @self.app.route('/css/<filepath:path>')
        def serve_css(filepath):
            return bottle.static_file(filepath, root=os.path.join(self.base_dir, 'css'))

        @self.app.route('/js/<filepath:path>')
        def serve_js(filepath):
            return bottle.static_file(filepath, root=os.path.join(self.base_dir, 'js'))

        @self.app.route('/data/<filepath:path>')
        def serve_data(filepath):
            return bottle.static_file(filepath, root=os.path.join(self.base_dir, 'data'))

        @self.app.route('/assets/<filepath:path>')
        def serve_assets(filepath):
            return bottle.static_file(filepath, root=os.path.join(self.base_dir, 'assets'))

        @self.app.route('/video/<unit_id:int>')
        def stream_video(unit_id):
            if unit_id in [12, 13]:
                bottle.abort(404, "Video bài giảng hiện chưa có trong bộ dữ liệu.")
            folder = self.get_unit_folder(unit_id)
            if not folder:
                bottle.abort(404, f"Thư mục Unit {unit_id} không tồn tại.")
            video_file = self.get_unit_video_filename(folder)
            if not video_file:
                bottle.abort(404, f"Không tìm thấy video cho Unit {unit_id}.")
            mimetype = 'video/mp4' if video_file.lower().endswith('.mp4') else 'video/webm'
            return bottle.static_file(video_file, root=folder, mimetype=mimetype)

        @self.app.route('/audio/<unit_id:int>/<filename:path>')
        def stream_audio(unit_id, filename):
            folder = self.get_unit_folder(unit_id)
            if not folder:
                bottle.abort(404, f"Thư mục Unit {unit_id} không tồn tại.")
            actual_file = filename
            if not os.path.isfile(os.path.join(folder, actual_file)):
                for f in os.listdir(folder):
                    if f.lower() == filename.lower():
                        actual_file = f
                        break
            mimetype = 'audio/mpeg' if actual_file.lower().endswith('.mp3') else 'audio/wav'
            return bottle.static_file(actual_file, root=folder, mimetype=mimetype)

        @self.app.route('/api/video_info/<unit_id:int>')
        def video_info(unit_id):
            bottle.response.content_type = 'application/json'
            if unit_id in [12, 13]:
                return json.dumps({"available": False, "message": "Chưa có video trong nguồn gốc."})
            folder = self.get_unit_folder(unit_id)
            if not folder:
                return json.dumps({"available": False, "message": "Thư mục không tồn tại."})
            video_file = self.get_unit_video_filename(folder)
            if not video_file:
                return json.dumps({"available": False, "message": "Không tìm thấy file video."})
            full_path = os.path.join(folder, video_file)
            size_mb = os.path.getsize(full_path) / (1024 * 1024)
            return json.dumps({
                "available": True,
                "filename": video_file,
                "size_mb": round(size_mb, 1),
                "url": f"/video/{unit_id}"
            })

    def start(self):
        bottle.run(self.app, host='127.0.0.1', port=self.port, quiet=True)

class AppApi:
    def __init__(self, port, source_root, server=None):
        self.port = port
        self.source_root = source_root
        self.server = server

    def get_server_port(self):
        return self.port

    def get_source_root(self):
        return self.source_root

    def get_video_url(self, unit_id):
        return f"http://127.0.0.1:{self.port}/video/{int(unit_id)}"

    def launch_video(self, unit_id, video_file=None):
        """Fallback: Cho phép mở bằng player bên ngoài của Windows nếu học viên muốn"""
        uid = int(unit_id)
        if uid in [12, 13]:
            return {"status": "MISSING", "message": "Video bài giảng hiện chưa có trong bộ dữ liệu gốc."}
            
        folder = self.server.get_unit_folder(uid) if self.server else None
        if not folder:
            candidates = [
                f"NGÀY {uid}",
                f"NGAY {uid}",
                f"Ngày {uid}"
            ]
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

def main():
    base_dir = get_base_dir()
    source_root = resolve_source_root()
    port = find_free_port(56789)
    
    # Start local streaming server in background daemon thread
    server = MediaServer(base_dir, source_root, port)
    server_thread = threading.Thread(target=server.start, daemon=True)
    server_thread.start()
    
    api = AppApi(port, source_root, server)
    app_url = f"http://127.0.0.1:{port}/index.html"
    
    window = webview.create_window(
        title='SMOB English Lab — 48-Day Foundation Course (v2.5 - All-in-One Learning Suite)',
        url=app_url,
        js_api=api,
        width=1320,
        height=850,
        min_size=(1024, 700),
        background_color='#f5f5f7'
    )
    
    webview.start(debug=False)

if __name__ == '__main__':
    main()
