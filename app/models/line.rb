class Line < ActiveRecord::Base
  belongs_to :map
  belongs_to :start, class_name: "Node"
  belongs_to :end, class_name: "Node"

  before_save :set_cost
  before_save :set_orientation

  validates :start_id, presence: true
  validates :end_id, presence: true
  validates :map_id, presence: true

  def self.query start_id, end_id
    where("start_id = ? AND end_id = ?", start_id, end_id).first
  end

  def set_cost
    @start_node = Node.find(self.start_id)
    @end_node = Node.find(self.end_id)
    self.cost = (@start_node.x - @end_node.x)*(@start_node.x - @end_node.x) + (@start_node.y - @end_node.y)*(@start_node.y - @end_node.y)
  end

  def set_orientation
    orientation = 0
    @start_node = Node.find(self.start_id)
    @end_node = Node.find(self.end_id)
      if @start_node.x == @end_node.x
        if @start_node.y < @end_node.y
          orientation = 270
        elsif @start_node.y == @end_node.y
          orientation = -1
        else 
          orientation = 90
        end
      elsif @start_node.y == @end_node.y
        if @start_node.x < @end_node.x
          orientation = 0
        else
          orientation = 180
        end
      else
        orientation = Math.atan2((@end_node.y - @start_node.y),(@end_node.x - @start_node.x))*360/(2*3.1415925)
        if orientation < 0
          orientation = orientation + 360
        end
      end
    self.orientation = orientation
  end

end
