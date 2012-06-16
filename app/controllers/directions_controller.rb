class DirectionsController < ApplicationController
  # GET /directions
  # GET /directions.json
  def index
    @directions = Direction.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @directions }
    end
  end

  # GET /directions/1
  # GET /directions/1.json
  def show
    @direction = Direction.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @direction }
    end
  end

  # GET /directions/new
  # GET /directions/new.json
  def new
    @direction = Direction.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @direction }
    end
  end

  # GET /directions/1/edit
  def edit
    @direction = Direction.find(params[:id])
  end

  # POST /directions
  # POST /directions.json
  def create
    @direction = Direction.new(params[:direction])

    respond_to do |format|
      if @direction.save
        format.html { redirect_to @direction, notice: 'Direction was successfully created.' }
        format.json { render json: @direction, status: :created, location: @direction }
      else
        format.html { render action: "new" }
        format.json { render json: @direction.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /directions/1
  # PUT /directions/1.json
  def update
    @direction = Direction.find(params[:id])

    respond_to do |format|
      if @direction.update_attributes(params[:direction])
        format.html { redirect_to @direction, notice: 'Direction was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @direction.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /directions/1
  # DELETE /directions/1.json
  def destroy
    @direction = Direction.find(params[:id])
    @direction.destroy

    respond_to do |format|
      format.html { redirect_to directions_url }
      format.json { head :no_content }
    end
  end

  def from_to
     @mark = Mark.find(params[:from])
     @from_node = @mark.node
     @to_node = get_dest params[:to]
     @direction = Direction.query @from_node.id, @to_node.id
    
 #   @direction = Direction.query params[:from_id], params[:to_id]
    respond_to do |format|
      format.html #show.html.erb
      format.json { render json: @direction }
    end
  end

  def calculate
    Direction.floyd
    @directions = Direction.all

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @directions }
    end
  end

  def get_dest dest
    @node = Node.find_by_name(dest)
  end
end
