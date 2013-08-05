require 'json'
require 'mongoid'
require 'sinatra'
require 'sinatra/cross_origin'

class Doc
  include Mongoid::Document
  field :content, :type => String
end

configure do
  enable :cross_origin
  disable :protection
  Mongoid.load!(File.join(File.dirname(__FILE__), 'config', 'mongoid.yml'))
end

helpers do
  def serve_json(data)
    json = data.to_json
    params['callback'] ? "#{params['callback']}(#{json})" : json
  end
end

get '/' do
  erb :index
end

get '/*' do |id|
  content_type :text
  doc = Doc.find(id)
  serve_json(:id => id, :content => doc.content)
end

post '/' do
  content_type :json
  doc = Doc.create(:content => params['content'])
  puts "Saved doc: #{doc.id}"
  serve_json(:id => doc.id)
end
