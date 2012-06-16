class Map < ActiveRecord::Base
  has_many :nodes, dependent: :destroy
  has_many :lines, dependent: :destroy
end
