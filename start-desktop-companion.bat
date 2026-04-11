@echo off
setlocal

cd /d "%~dp0"
set "LOCAL_NODE=%~dp0.local-tools\node\node.exe"
set "LOCAL_ELECTRON_EXE=%~dp0node_modules\electron\dist\electron.exe"
set "LOCAL_ELECTRON_CLI=%~dp0node_modules\electron\cli.js"
set "MAIN_ENTRY=%~dp0electron\main.mjs"
set "LOG_FILE=%~dp0desktop-companion-launch.log"

echo.>> "%LOG_FILE%"
echo [%date% %time%] Launch requested >> "%LOG_FILE%"

if exist "%LOCAL_ELECTRON_EXE%" if exist "%MAIN_ENTRY%" (
  echo Using direct electron.exe: %LOCAL_ELECTRON_EXE% >> "%LOG_FILE%"
  echo Using main entry: %MAIN_ENTRY% >> "%LOG_FILE%"
  start "" "%LOCAL_ELECTRON_EXE%" "%MAIN_ENTRY%"
) else if exist "%LOCAL_NODE%" if exist "%LOCAL_ELECTRON_CLI%" (
  echo Using local node: %LOCAL_NODE% >> "%LOG_FILE%"
  echo Using electron cli: %LOCAL_ELECTRON_CLI% >> "%LOG_FILE%"
  start "" "%LOCAL_NODE%" "%LOCAL_ELECTRON_CLI%" "%MAIN_ENTRY%"
) else (
  echo Local node/electron not found, falling back to npm >> "%LOG_FILE%"
  start "" npm run desktop:open
)

if errorlevel 1 (
  echo Launch failed with errorlevel %errorlevel% >> "%LOG_FILE%"
  echo.
  echo Failed to launch desktop companion.
  echo Check desktop-companion-launch.log for details.
  pause
)

if not errorlevel 1 (
  echo Launch command finished successfully >> "%LOG_FILE%"
)
