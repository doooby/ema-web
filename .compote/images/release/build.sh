set -e

NODE_ENV=development yarn install --silent
yarn build
