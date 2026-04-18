# 本地打开 dist 站点（无需 Node）：起 http 服务并打开系统浏览器
$ErrorActionPreference = 'Stop'
$Port = 8765
$Root = Join-Path $PSScriptRoot 'dist'
$Index = Join-Path $Root 'index.html'
if (-not (Test-Path -LiteralPath $Index)) {
  Write-Host '未找到 dist\index.html，请先在 digital-human 目录执行: npm run build' -ForegroundColor Red
  Read-Host '按 Enter 退出'
  exit 1
}

function Get-Mime([string]$ext) {
  switch ($ext.ToLower()) {
    '.html' { 'text/html; charset=utf-8' }
    '.js' { 'application/javascript; charset=utf-8' }
    '.css' { 'text/css; charset=utf-8' }
    '.svg' { 'image/svg+xml' }
    '.png' { 'image/png' }
    '.jpg' { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.webp' { 'image/webp' }
    '.ico' { 'image/x-icon' }
    '.json' { 'application/json; charset=utf-8' }
    '.woff' { 'font/woff' }
    '.woff2' { 'font/woff2' }
    '.ttf' { 'font/ttf' }
    default { 'application/octet-stream' }
  }
}

$rootFull = [IO.Path]::GetFullPath($Root)
$assetExts = @('.js', '.css', '.map', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.json', '.woff', '.woff2', '.ttf')

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
try {
  $listener.Start()
} catch {
  Write-Host "无法监听端口 $Port（可能被占用）。请关闭占用程序或编辑 打开.ps1 修改 `$Port。" -ForegroundColor Red
  Read-Host '按 Enter 退出'
  exit 1
}

$url = "http://127.0.0.1:$Port/"
Write-Host "已启动: $url" -ForegroundColor Green
Write-Host '关闭本窗口即停止服务。' -ForegroundColor DarkGray
Start-Process $url

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }
    $rel = $path.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
    if ($rel -match '\.\.') { throw 'bad' }
    $candidate = [IO.Path]::GetFullPath((Join-Path $Root $rel))
    if (-not $candidate.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) { throw 'bad' }

    $full = $null
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
      $full = $candidate
    } else {
      $ext = [IO.Path]::GetExtension($candidate)
      if ($assetExts -contains $ext.ToLower()) {
        throw 'notfound'
      }
      $full = $Index
    }

    $bytes = [IO.File]::ReadAllBytes($full)
    $res.StatusCode = 200
    $res.ContentType = Get-Mime ([IO.Path]::GetExtension($full))
    $res.ContentLength64 = $bytes.LongLength
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 404
    $msg = [Text.Encoding]::UTF8.GetBytes('Not Found')
    $res.ContentLength64 = $msg.LongLength
    $res.OutputStream.Write($msg, 0, $msg.Length)
  } finally {
    $res.OutputStream.Close()
  }
}
