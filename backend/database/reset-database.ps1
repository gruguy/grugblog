# PowerShell 脚本：重置数据库
# 使用方法: .\reset-database.ps1

$mysqlUser = "root"
$mysqlPassword = "Gruguy31"
$mysqlHost = "localhost"
$mysqlPort = 3306
$database = "blog"

Write-Host "正在重置数据库..." -ForegroundColor Yellow

# 执行重置 SQL
$sqlFile = Join-Path $PSScriptRoot "reset.sql"
$mysqlCommand = "mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword < `"$sqlFile`""

Write-Host "执行 SQL 文件: $sqlFile" -ForegroundColor Cyan
Invoke-Expression $mysqlCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "数据库重置成功！" -ForegroundColor Green
} else {
    Write-Host "数据库重置失败，请检查 MySQL 连接和权限" -ForegroundColor Red
    Write-Host "你也可以手动执行: mysql -u $mysqlUser -p < $sqlFile" -ForegroundColor Yellow
}

