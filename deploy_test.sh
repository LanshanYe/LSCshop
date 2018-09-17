HOST='101.132.130.150'

scp -rv ./dist/* root@$HOST:/data/wwwroot/TaoYuanLibrary/public/backend/

echo "All done."
