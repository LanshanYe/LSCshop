HOST='101.132.130.150'

scp -rv ./dist/* root@$HOST:/data/wwwroot/YlbShop/public/btest/

echo "All done."
