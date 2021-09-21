libops_print "compiling release images"

libops_print -p "install & build app"
libops_docker_run app:base \
  "-v $stack_path/src:/app" \
  "-v $stack_path/var/node_modules:/app/node_modules" \
  "-v $stack_path/var/nuxt:/app/.nuxt" \
  "-v $stack_path/var/build:/app/tmp/build" \
  "bash .compote/images/app/release/build.sh"

libops_print -p "building"
bin/build_image app release
