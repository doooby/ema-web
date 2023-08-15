set -e

# $1 - dir path
# $2 - archive path
function archive_dir {
  [ -f $2 ] && rm $2
  tar -zcf $2 $1
}

NODE_ENV=development yarn install
yarn build

yarn install
archive_dir node_modules tmp/build/node_modules.tar.gz
archive_dir .nuxt tmp/build/nuxt.tar.gz
