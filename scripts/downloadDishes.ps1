
$dishes = @{
    "idli" = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800";
    "dosa" = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800";
    "biryani" = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800"; # Thali as fallback
    "biryani_real" = "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800";
    "parotta" = "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800";
    "poori" = "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=800";
    "curry" = "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800";
    "sweet" = "https://images.unsplash.com/photo-1593560708920-61dd723b5bb3?q=80&w=800";
    "starter" = "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=800";
    "tea" = "https://images.unsplash.com/photo-1544787210-2213d84ad96b?q=80&w=800";
    "meals" = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800";
    "chutney" = "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800";
    "juice" = "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800";
    "coffee" = "https://images.unsplash.com/photo-1541173103073-9bd622cdec3j?q=80&w=800";
    "vada" = "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=800";
    "halwa" = "https://images.unsplash.com/photo-1589135344358-5221043859d0?q=80&w=800";
}

$destFolder = "src/assets/dishes"
if (!(Test-Path $destFolder)) {
    New-Item -ItemType Directory -Path $destFolder
}

foreach ($name in $dishes.Keys) {
    $url = $dishes[$name]
    $dest = "$destFolder/$name.jpg"
    Write-Host "Downloading $name..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest
        Write-Host "Saved to $dest"
    } catch {
        Write-Error "Failed to download $name. Error: $($_.Exception.Message)"
    }
}
