require 'json'
require 'mongoid'
require 'randy'
require 'sinatra'
require 'sinatra/cross_origin'

class Doc
  include Mongoid::Document

  field :token,   :type => String
  field :title,   :type => String
  field :content, :type => String
end

configure do
  enable  :cross_origin
  disable :protection

  Mongoid.load!(File.join(File.dirname(__FILE__), 'config', 'mongoid.yml'))

  Mongoid.configure do |config|
    config.raise_not_found_error = false
  end
end

helpers do
  def find_doc(id)
    doc = Doc.find(id)
    halt serve_json(:message => 'Document does not exist') if doc.nil?
    doc
  end

  def create_doc(title, content)
    Doc.create({
      :token   => Randy.string(10),
      :title   => title,
      :content => content
    })
  end

  def update_doc(doc, title, content)
    attributes = {}
    attributes[:title] = title unless title.nil?
    attributes[:content] = content unless content.nil?
    doc.update_attributes(attributes)
  end

  def verify_doc_editable(doc)
    if doc.token.nil?
      halt serve_json(:message => 'Document is not editable')
    end
    if doc.token != params['token']
      halt serve_json(:message => 'Not authorized to edit document')
    end
  end

  def serve_json(data)
    content_type :json
    json = data.to_json
    params['callback'] ? "#{params['callback']}(#{json})" : json
  end
end

get '/' do
  erb :index
end

get '/edit/*' do |id|
  doc = find_doc(id)

  verify_doc_editable(doc)

  @id      = doc.id
  @token   = doc.token
  @title   = doc.title
  @content = doc.content

  erb :index
end

get '/*' do |id|
  doc = find_doc(id)

  serve_json({
    :id      => id,
    :title   => doc.title,
    :content => doc.content,
    :message => "Retrieved document successfully"
  })
end

post '/' do
  doc = create_doc(params['title'], params['content'])

  serve_json({
    :id      => doc.id,
    :token   => doc.token,
    :message => "Document created successfully"
  })
end

post '/*' do |id|
  doc = find_doc(id)

  verify_doc_editable(doc)

  update_doc(doc, params['title'], params['content'])

  serve_json({
    :id      => doc.id,
    :message => "Document updated successfully"
  })
end
