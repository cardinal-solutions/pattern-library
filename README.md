# cardinal Styleguide

## Installation

The style guide was created with the static site generator Middleman. It requires Ruby to be installed. If you're using a Mac, Ruby is installed by default. If you're using Windows, you'll need to install Ruby first using the [RubyInstaller](http://rubyinstaller.org/).

Open up your preferred command line application, change directories to the `cardinal-styleguide` folder, and type the following (note: $ is just a representation of a command that should be typed in the command line, don't actually put it in the command line):

	$ gem install bundler

Bundler is a package manager for Ruby that manages the dependencies that will need to be installed to run Middleman. Once bundler is installed then:

	$ bundle install

## Start Middleman

This will install all of the required dependencies. You can now start up Middleman:

	$ bundle exec middleman

This will start up a Sinatra server running Middleman. You can now view the prototype at [http://localhost:4567](http://localhost:4567).