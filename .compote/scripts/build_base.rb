$jar.with_dockerignore do
  Compote.run <<-CMD
sudo docker build \\
  -f src/.compote/images/base/Dockerfile \\
  -t jar--#{$jar.name}:base \\
  .
CMD
end
