# PowerShell script to create placeholder profile images
# Run this from the worldfigures directory

$profileSlugs = @(
    "sam-altman",
    "jensen-huang",
    "mark-zuckerberg",
    "sundar-pichai",
    "satya-nadella",
    "demis-hassabis",
    "lisa-su",
    "geoffrey-hinton",
    "vladimir-putin",
    "joe-biden",
    "benjamin-netanyahu",
    "mohammed-bin-salman",
    "keir-starmer",
    "larry-fink",
    "warren-buffett",
    "jamie-dimon",
    "jeff-bezos",
    "taylor-swift",
    "joe-rogan",
    "mrbeast",
    "cristiano-ronaldo",
    "oprah-winfrey",
    "yuval-noah-harari",
    "peter-thiel",
    "jennifer-doudna",
    "kamala-harris",
    "tim-cook",
    "dario-amodei",
    "giorgia-meloni",
    "bill-gates",
    "lebron-james",
    "bernard-arnault",
    "recep-tayyip-erdogan",
    "yann-lecun"
)

$imageDir = "public\images\people"

# Create directory if it doesn't exist
if (-not (Test-Path $imageDir)) {
    New-Item -ItemType Directory -Path $imageDir -Force | Out-Null
    Write-Host "Created directory: $imageDir" -ForegroundColor Green
}

Write-Host "`n=== Profile Image Setup ===" -ForegroundColor Cyan
Write-Host "Total profiles needing images: $($profileSlugs.Count)" -ForegroundColor Yellow
Write-Host "`nChecking existing images..." -ForegroundColor Cyan

$missing = @()
$existing = @()

foreach ($slug in $profileSlugs) {
    $imagePath = Join-Path $imageDir "$slug.jpg"
    if (Test-Path $imagePath) {
        $existing += $slug
    } else {
        $missing += $slug
    }
}

Write-Host "`n✅ Existing images: $($existing.Count)" -ForegroundColor Green
Write-Host "❌ Missing images: $($missing.Count)" -ForegroundColor Red

if ($missing.Count -gt 0) {
    Write-Host "`n=== Missing Images ===" -ForegroundColor Yellow
    foreach ($slug in $missing) {
        Write-Host "  - $slug.jpg" -ForegroundColor Gray
    }
    
    Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
    Write-Host "1. Download professional headshots (400x400px recommended)" -ForegroundColor White
    Write-Host "2. Name them exactly as listed above (e.g., 'sam-altman.jpg')" -ForegroundColor White
    Write-Host "3. Place them in: $imageDir" -ForegroundColor White
    Write-Host "`nSuggested sources:" -ForegroundColor White
    Write-Host "  - Wikimedia Commons (public domain)" -ForegroundColor Gray
    Write-Host "  - Official press photos" -ForegroundColor Gray
    Write-Host "  - UI Avatars API for temporary placeholders" -ForegroundColor Gray
    
    Write-Host "`n=== Generate Temporary Placeholders? ===" -ForegroundColor Yellow
    Write-Host "This will create simple colored placeholder images with initials." -ForegroundColor Gray
    $response = Read-Host "Generate placeholders for missing images? (y/n)"
    
    if ($response -eq 'y') {
        Write-Host "`nGenerating placeholders..." -ForegroundColor Cyan
        
        # Note: Requires ImageMagick or similar. For now, create a text file with URLs
        $placeholderUrls = @()
        foreach ($slug in $missing) {
            $name = ($slug -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() }) -join ''
            $url = "https://ui-avatars.com/api/?name=$name&size=400&background=0D8ABC&color=fff&bold=true"
            $placeholderUrls += "$slug : $url"
        }
        
        $urlFile = "placeholder-image-urls.txt"
        $placeholderUrls | Out-File -FilePath $urlFile -Encoding UTF8
        Write-Host "✅ Saved placeholder URLs to: $urlFile" -ForegroundColor Green
        Write-Host "You can download these URLs using a batch downloader or manually." -ForegroundColor Gray
    }
} else {
    Write-Host "`n✅ All images present!" -ForegroundColor Green
}

Write-Host "`n=== Complete Profile List ===" -ForegroundColor Cyan
Write-Host "All 45 profiles:" -ForegroundColor Yellow
@(
    "elon-musk", "volodymyr-zelenskyy", "donald-trump", "ursula-von-der-leyen",
    "narendra-modi", "jacinda-ardern", "xi-jinping", "emmanuel-macron"
) + $profileSlugs | Sort-Object | ForEach-Object {
    $status = if (Test-Path (Join-Path $imageDir "$_.jpg")) { "✅" } else { "❌" }
    Write-Host "  $status $_" -ForegroundColor Gray
}

Write-Host "`n=== Done ===" -ForegroundColor Green
