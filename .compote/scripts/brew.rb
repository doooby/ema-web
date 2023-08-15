
Console.log :yellow, '===== building nuxt app'
Compote.run <<-CMD
sudo docker run --rm jar_#{$jar.name}:base \\
  -v src:/app \\
  -v var/dev_node_modules:/app/node_modules \\
  -v var/nuxt:/app/.nuxt \\
  bash .compote/images/release/build.sh
CMD

Console.log :yellow, '===== packing the app'
Compote.run <<-CMD
sudo docker run --rm jar_#{$jar.name}:base \\
  -v src:/app \\
  -v var/dev_node_modules:/app/node_modules \\
  -v var/nuxt:/app/.nuxt \\
  -v var/build:/app/tmp/build \\
  bash .compote/images/release/pack.sh
CMD

Console.log :yellow, '===== building docker image'
dockerignore = <<-FILE
!src
!var/build
FILE
$jar.with_dockerignore dockerignore do
  Compote.run <<-CMD
sudo docker build \\
  -f src/.compote/images/release/Dockerfile \\
  -t jar_#{$jar.name}:release \\
  .
CMD
end

Console.log :yellow, '===== restarting container'
Compote.run $jar.compose_cmd('up -d')
