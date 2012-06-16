class Node < ActiveRecord::Base
  belongs_to :map
  belongs_to :mark
  has_many :lines, foreign_key: "start_id", dependent: :destroy
  
  has_many :ends, through: :lines, source: :end

  has_many :reverse_lines, foreign_key: "end_id",
                           class_name: "Line",
                           dependent: :destroy
  has_many :starts, through: :reverse_lines, source: :start

  validates :x, presence: true
  validates :y, presence: true
end
