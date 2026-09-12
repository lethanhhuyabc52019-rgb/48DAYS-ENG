@echo off
chcp 65001 >nul
title Don Dep He Thong - Temp, Prefetch
echo ====================================================
echo DANG DON DEP TEMP, %%TEMP%% VA PREFETCH...
echo ====================================================
python "%~dp0scripts\clean_system_and_temp.py"
pause
