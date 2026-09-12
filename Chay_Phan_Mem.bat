@echo off
chcp 65001 >nul
title SMOB English Lab - Chay Phan Mem
echo ====================================================
echo DANG KHOI DONG PHAN MEM HOC TIENG ANH (SMOB LAB)...
echo ====================================================
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python chua duoc cai dat. Dang mo bang trinh duyet...
    start "" "%~dp0index.html"
    exit /b
)
python "%~dp0desktop_main.py"
if %errorlevel% neq 0 (
    echo [!] PyWebView co the chua san sang. Dang mo bang trinh duyet...
    start "" "%~dp0index.html"
)
