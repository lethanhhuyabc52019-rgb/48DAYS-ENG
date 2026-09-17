param([int]$unit)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type -AssemblyName System.Drawing
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$imgFile = "D:\2.English\ENG Learning_Antigravity\reports\answer_keys_rendered\unit_{0:D2}_answer_key.png" -f $unit
if (-not (Test-Path $imgFile)) {
    Write-Error "File not found: $imgFile"
    exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($imgFile)
$totalHeight = $bmp.Height
$totalWidth = $bmp.Width
$sliceHeight = 1600

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$tmpDir = "C:\Users\Admin\AppData\Local\Temp\ocr_slices"
if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }

Write-Output "=== UNIT $unit ANSWER KEY OCR ($totalWidth x $totalHeight) ==="

$y = 0
$sliceIndex = 0
while ($y -lt $totalHeight) {
    $h = [Math]::Min($sliceHeight, $totalHeight - $y)
    $rect = New-Object System.Drawing.Rectangle(0, $y, $totalWidth, $h)
    $cropBmp = $bmp.Clone($rect, $bmp.PixelFormat)
    
    $slicePath = Join-Path $tmpDir ("slice_{0}_{1}.png" -f $unit, $sliceIndex)
    $cropBmp.Save($slicePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropBmp.Dispose()

    $fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($slicePath)
    $file = Await $fileOp ([Windows.Storage.StorageFile])
    $streamOp = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
    $stream = Await $streamOp ([Windows.Storage.Streams.IRandomAccessStream])
    $decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
    $decoder = Await $decoderOp ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmapOp = $decoder.GetSoftwareBitmapAsync()
    $bitmap = Await $bitmapOp ([Windows.Graphics.Imaging.SoftwareBitmap])

    $ocrOp = $engine.RecognizeAsync($bitmap)
    $result = Await $ocrOp ([Windows.Media.Ocr.OcrResult])

    $result.Lines | ForEach-Object { $_.Text }

    $y += $h
    $sliceIndex++
}
$bmp.Dispose()
