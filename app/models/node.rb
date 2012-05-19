class Node < ActiveRecord::Base
  belongs_to :map
  belongs_to :mark

  validates :x, presence: true
  validates :y, presence: true
  validates :name, presence: true
end
