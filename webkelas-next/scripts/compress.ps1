param(
    [string]$TargetDir = "c:\xampp\htdocs\webkelas - Copy\webkelas-next\public\assets\uploads\aktivitas"
)

Add-Type -AssemblyName System.Drawing

function Compress-SingleImage {
    param(
        [string]$Path,
        [int]$Quality = 78
    )
    try {
        $bytes = [System.IO.File]::ReadAllBytes($Path)
        $ms = New-Object System.IO.MemoryStream(,$bytes)
        $orig = [System.Drawing.Image]::FromStream($ms)

        $maxDim = 1200.0
        $scale = 1.0
        if ($orig.Width -gt $maxDim -or $orig.Height -gt $maxDim) {
            $scale = $maxDim / [Math]::Max($orig.Width, $orig.Height)
        }
        $newW = [int]($orig.Width * $scale)
        $newH = [int]($orig.Height * $scale)

        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($orig, 0, 0, $newW, $newH)

        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

        $orig.Dispose()
        $ms.Dispose()

        $outMs = New-Object System.IO.MemoryStream
        $bmp.Save($outMs, $codec, $encoderParams)
        $bmp.Dispose()
        $g.Dispose()

        [System.IO.File]::WriteAllBytes($Path, $outMs.ToArray())
        $outMs.Dispose()

        $fi = Get-Item $Path
        Write-Host "Compressed: $($fi.Name) -> $([math]::Round($fi.Length / 1KB, 1)) KB"
    } catch {
        Write-Warning "Failed on ${Path}: $_"
    }
}

Get-ChildItem -Path $TargetDir -Filter "*.jpg" | ForEach-Object {
    Compress-SingleImage -Path $_.FullName -Quality 78
}
