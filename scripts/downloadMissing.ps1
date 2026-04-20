
$dishes = @{
    "sweet" = "https://loremflickr.com/800/600/indian,sweets,dessert";
    "tea" = "https://loremflickr.com/800/600/chai,tea,indian";
    "coffee" = "https://loremflickr.com/800/600/coffee,mug";
    "halwa" = "https://loremflickr.com/800/600/halwa,pudding";
}

$destFolder = "src/assets/dishes"

foreach ($name in $dishes.Keys) {
    $url = $dishes[$name]
    $dest = "$destFolder/$name.jpg"
    Write-Host "Downloading $name from loremflickr..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest
        Write-Host "Saved to $dest"
    } catch {
        Write-Error "Failed to download $name. Error: $($_.Exception.Message)"
    }
}
