class Direction < ActiveRecord::Base
  def self.query from_id, to_id
    where("from_id = ? AND to_id = ?", from_id, to_id).first
  end

  def self.clean
    Direction.all.each do |d|
      d.destroy
    end
  end

  def self.floyd
    self.clean
    max = 999999

    nodes = Node.all
    n = nodes.count

    d = Array.new
    for i in (0..n-1)
      d[i] = Array.new
    end

    for i in (0..n-1)
      for j in (0..n-1)
        direction = Direction.new(from_id: nodes[i].id, to_id: nodes[j].id)

        if i.eql? j
          direction.distance = 0
        else
          p = Line.query nodes[i].id, nodes[j].id
          
          if p.is_a? Line 
            direction.distance = p.cost
            direction.next_id = nodes[j].id
            direction.orientation = p.orientation
          else
            direction.distance = max
            direction.orientation = -2
          end
        end
        d[i][j] = direction
      end
    end

    for k in (0..n-1)
      for i in (0..n-1)
        for j in (0..n-1)
          if d[i][j].distance > d[i][k].distance + d[k][j].distance
            d[i][j].distance = d[i][k].distance + d[k][j].distance
            d[i][j].next_id = d[i][k].next_id
          end
        end
      end
    end

    for i in (0..n-1)
      for j in (0..n-1)
        d[i][j].save
      end
    end

  end
end
