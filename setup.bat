@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
set USEPY=
where py >nul 2>&1 && set USEPY=py
if not defined USEPY where python >nul 2>&1 && set USEPY=python
if not defined USEPY echo Python not found & exit /b 1
if exist ".venv" (
  echo Using existing venv
) else (
  if "%USEPY%"=="py" (
    %USEPY% -3 -m venv .venv
  ) else (
    %USEPY% -m venv .venv
  )
)
set VPY=.\.venv\Scripts\python
"%VPY%" -m pip install -U pip websockets
for /f "delims=" %%I in ('"%VPY%" -c "import socket;s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM);s.connect(('8.8.8.8',80));print(s.getsockname()[0]);s.close()"') do set IP=%%I
if not defined IP set IP=localhost
rem Start static server if not running
netstat -ano | findstr ":8000" >nul || start /min cmd /c "%VPY% -m http.server 8000"
start "" http://%IP%:8000/
echo Relay URL: ws://%IP%:8787
"%VPY%" server.py
