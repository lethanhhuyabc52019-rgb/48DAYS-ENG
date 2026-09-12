Add-Type -AssemblyName System.Runtime.WindowsRuntime
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

$imgPath = 'C:\Users\Admin\AppData\Local\Temp\temp_ans_u2.jpeg'
$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath)
$file = Await $fileOp ([Windows.Storage.StorageFile])

$streamOp = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
$stream = Await $streamOp ([Windows.Storage.Streams.IRandomAccessStream])

$decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
$decoder = Await $decoderOp ([Windows.Graphics.Imaging.BitmapDecoder])

$bitmapOp = $decoder.GetSoftwareBitmapAsync()
$bitmap = Await $bitmapOp ([Windows.Graphics.Imaging.SoftwareBitmap])

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('en-US'))
}

$ocrOp = $engine.RecognizeAsync($bitmap)
$result = Await $ocrOp ([Windows.Media.Ocr.OcrResult])

Write-Output "OCR Text Length: $($result.Text.Length)"
$result.Lines | Select-Object -First 30 | ForEach-Object { $_.Text }
