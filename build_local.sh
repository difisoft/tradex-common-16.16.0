npm run build
rm -rf ../techx-aaa/node_modules/tradex-common
mkdir -p ../techx-aaa/node_modules/tradex-common
cp -R build ../techx-aaa/node_modules/tradex-common/
cp -R package.json ../techx-aaa/node_modules/tradex-common/
cp -R package-lock.json ../techx-aaa/node_modules/tradex-common/
cp -R README.md ../techx-aaa/node_modules/tradex-common/