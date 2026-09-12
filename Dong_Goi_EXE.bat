@echo off
chcp 65001 >nul
title SMOB English Lab - Dong Goi EXE
echo ====================================================
echo DANG DONG GOI PHAN MEM THANH FILE EXE DOC LAP...
echo ====================================================
python "%~dp0scripts\build_exe.py"
pause
