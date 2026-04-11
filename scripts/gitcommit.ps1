function ship($branch, $message) {
    git checkout -b $branch
    git add .
    git commit -m $message
    git push origin $branch
    git checkout master
    git branch -D $branch

    Write-Host "🚀 Deployment started !" -ForegroundColor Cyan
}