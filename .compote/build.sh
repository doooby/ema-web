libops_print "compiling release images"

libops_print -p "build nuxt"
libops_docker_run app:base \
  "-v $stack_path/src:/app \
    -v $stack_path/var/dev_node_modules:/app/node_modules \
    -v $stack_path/var/nuxt:/app/.nuxt" \
  "bash .compote/images/app/release/build.sh"

libops_print -p "pack resources"
libops_docker_run app:base \
  "-v $stack_path/src:/app \
    -v $stack_path/var/node_modules:/app/node_modules \
    -v $stack_path/var/build:/app/tmp/build" \
  "bash .compote/images/app/release/pack.sh"

libops_print -p "build image"
bin/build_image app release
