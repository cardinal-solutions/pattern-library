desc "Build the middleman site."
task :build do
  sh %{bundle exec middleman build --verbose}
end

desc "Add files to Master"
task :add_build do
  sh %{git add --all}
end

desc "Commit files to Master"
task :add_commit do
  sh %{git commit -m "Adding build files on master"}
end

desc "Deploy files to Master"
task :deploy_master do
  sh %{git push origin master}
end

desc "Deploy build files to static server"
task :deploy_build do
  sh %{git subtree push --prefix build/ origin build}
end

desc "Build and upload the site."
task :deploy => [:build,:add_build, :add_commit, :deploy_master, :deploy_build]