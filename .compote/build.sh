mount_app="-v $stack_path/src:/app"
mount_node_modules="-v $stack_path/var/node_modules:/app/node_modules"
mount_nuxt_build="-v $stack_path/var/nuxt:/app/.nuxt"

libops_print "compiling release images"

libops_print -p "updating node_modules"
libops_docker_run app:base \
    "$mount_app $mount_node_modules" \
    "yarn install --silent"

libops_print -p "building nuxt.js"
libops_docker_run app:base \
    "$mount_app $mount_node_modules $mount_nuxt_build" \
    "yarn build"

libops_print -p "building"
bin/build_image app release
