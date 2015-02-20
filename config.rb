# ----------------------------------------------
# Basic Setup
# ----------------------------------------------
activate :livereload
activate :relative_assets
activate :directory_indexes
activate :syntax, :line_numbers => true

set :relative_links, true

# ----------------------------------------------
# Page Processing
# ----------------------------------------------
require 'slim'
set :slim, :pretty => true

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :autolink => true, :smartypants => true

# ----------------------------------------------
# CSS Processing
# ----------------------------------------------
# Susy grids in Compass
# First: gem install susy --pre
require 'susy'

# ----------------------------------------------
# Page options, layouts, aliases and proxies
# ----------------------------------------------

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

page "/examples/*", :layout => "examples"


# ----------------------------------------------
# Helpers
# ----------------------------------------------

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Methods defined in the helpers block are available in templates
helpers do
  def inline_code(code)
    '<code>' + escape_html(code.to_s) + '</code>'
  end

  def simple_example(partial_link)
    partial("/layouts/partials/live-partial-template", :locals => {:codePartial => partial_link})
  end

  def live_example(partial_link)
    content_tag :div, :class => "styleguide-example" do
      partial("/layouts/partials/live-partial-template", :locals => {:codePartial => partial_link})
    end
  end

  def code_example(partial_link, snippet_type)
    content_tag :div, :class => "styleguide-code" do
      partial("/layouts/partials/code-partial-template", :locals => {:isCode => snippet_type, :codePartial => partial_link})
    end
  end

  def combo_example(partial_link, snippet_type=false)
    live_example(partial_link)

    code_example(partial_link, snippet_type)
  end

  # possible fix to see if it's a child link item by finding the parent
  # http://stackoverflow.com/questions/15325277/middleman-parent-siblings-children-methods
  def link_to_active(link_text, link_url)
    current_path = current_page.url
    first_directory = current_page.path.split('/').first

    if current_path == link_url
      concat_safe_content link_to(link_text, link_url, :class => "active")
    else
      concat_safe_content link_to(link_text, link_url)
    end
  end

  def link_to_active_parent(link_text, link_url)
    current_path = current_page.url
    # first_directory = current_page.path.split('/').first
    first_directory = link_url.split('/').last

    if current_path == link_url || current_page.data.id == first_directory
      concat_safe_content link_to(link_text, link_url, :class => "active")
    else
      concat_safe_content link_to(link_text, link_url)
    end
  end

  def code_block(language=nil, options={}, &block)
    # raise 'The code helper requires a block to be provided.' unless block_given?

    # # Save current buffer for later
    # @_out_buf, _buf_was = "", @_out_buf

    # begin
    #   content = capture_html(&block)
    # ensure
    #   # Reset stored buffer
    #   @_out_buf = _buf_was
    # end
    # content = content.encode(Encoding::UTF_8)

    #concat_content Middleman::Syntax::Highlighter.highlight(content, language).html_safe

    ### New
    content = capture_html(&block)
    content = content.encode(Encoding::UTF_8)
    concat_safe_content Middleman::Syntax::Highlighter.highlight(content, language).html_safe
  end

  # def code_block(code_snippet, type='html')
  #   Middleman::Syntax::Highlighter.highlight(code_snippet, type.to_s)
  #   # Middleman::Syntax::Highlighter.highlight(<<-"CODE".chomp, 'ruby')
  #   #   snippet.to_s
  #   # CODE
  # end

  # Calculate the years for a copyright
  def copyright_years(start_year)
    end_year = Date.today.year
    if start_year == end_year
      start_year.to_s
    else
      start_year.to_s + '-' + end_year.to_s
    end
  end
end

# ----------------------------------------------
# Directories
# ----------------------------------------------
set :css_dir, 'assets/stylesheets'

set :js_dir, 'assets/javascripts'

set :images_dir, 'assets/images'

# ----------------------------------------------
# International
# ----------------------------------------------
# activate :translation_helper
# activate :directory_indexes
# activate :i18n, :mount_at_root => :en

# ----------------------------------------------
# Build-specific configuration
# ----------------------------------------------
configure :build do
  # Change Compass configuration
  compass_config do |config|
    # config.preferred_syntax   = :sass
    config.output_style = :compressed
    config.sass_options = { :line_comments => false}
  end
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_path, "/Content/images/"

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher
end

# ----------------------------------------------
# Deploy
# ----------------------------------------------

# activate :deploy do |deploy|
#   deploy.build_before = true
#   deploy.method = :rsync
#   deploy.host   = "/Volumes/CardinalStyle"
#   deploy.path   = ""
#   # Optional Settings
#   # deploy.user  = "tvaughan" # no default
#   deploy.port  = 22
#   # deploy.port  = 5309 # ssh port, default: 22
#   # deploy.clean = true # remove orphaned files on remote host, default: false
#   # deploy.flags = "-rltgoDvzO --no-p --del -e" # add custom flags, default: -avze
# end
