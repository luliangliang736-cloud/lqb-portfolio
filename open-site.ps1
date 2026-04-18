# Serve dist over HTTP and open the site.
$ErrorActionPreference = 'Stop'
$Port = 8765
$Root = Join-Path $PSScriptRoot 'dist'
$Index = Join-Path $Root 'index.html'

if (-not (Test-Path -LiteralPath $Index)) {
  Write-Host 'dist\index.html not found. Run: npm run build to preview the latest source build.' -ForegroundColor Red
  Read-Host 'Press Enter to exit'
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
  Write-Host "Cannot listen on port $Port." -ForegroundColor Red
  Read-Host 'Press Enter to exit'
  exit 1
}

$url = "http://127.0.0.1:$Port/"
Write-Host "Serving: $url" -ForegroundColor Green
Write-Host 'Close this window to stop the server.' -ForegroundColor DarkGray
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
    $msg = [Text.Encoding]::UTF8.GetBytes('Not Found')
    $res.StatusCode = 404
    $res.ContentType = 'text/plain; charset=utf-8'
    $res.ContentLength64 = $msg.LongLength
    $res.OutputStream.Write($msg, 0, $msg.Length)
  } finally {
    $res.OutputStream.Close()
  }
}
