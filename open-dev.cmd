@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "NODE_DIR=%~dp0.local-tools\node"
if exist "%NODE_DIR%\node.exe" (
  set "PATH=%NODE_DIR%;%PATH%"
)

where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未检测到可用的 Node.js。
  echo 请先让我为项目下载便携 Node，或手动安装: https://nodejs.org/zh-cn
  pause
  exit /b 1
)

echo 正在安装依赖（首次较慢）...
call npm install
if errorlevel 1 (
  pause
  exit /b 1
)
echo.
echo 启动后浏览器将打开 http://localhost:5173
echo 在 Cursor 左侧看网页: Ctrl+Shift+P → 输入 "Simple Browser: Show" → 粘贴上述地址
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173/"
call npm run dev
