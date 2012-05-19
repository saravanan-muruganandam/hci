class Mark < ActiveRecord::Base
  has_one :node
  validates :code, presence: true
end
