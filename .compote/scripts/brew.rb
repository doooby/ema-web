
Compote.log :yellow, '===== building nuxt app'
Compote.run <<-CMD
sudo docker run --rm \\
  --env-file .env
  -v ./src:/app \\
  -v ./var/node_modules:/app/node_modules \\
  -v ./var/nuxt:/app/.nuxt \\
  -v ./var/build:/app/tmp/build \\
  jar--#{$jar.name}:base \\
  bash .compote/images/release/build.sh
CMD

Compote.log :yellow, '===== building docker image'
dockerignore = <<-FILE
!src
!var/build
FILE
$jar.with_dockerignore dockerignore do
  Compote.run <<-CMD
sudo docker build \\
  -f src/.compote/images/release/Dockerfile \\
  -t jar--#{$jar.name}:release \\
  --build-arg JAR_NAME=#{$jar.name} \\
  .
CMD
end

Compote.log :yellow, '===== restarting container'
Compote.run $jar.compose_cmd('up -d')
