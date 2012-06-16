class LinesController < ApplicationController
  def index
    if !params[:map_id].nil?
      @map = Map.find(params[:map_id])
      #@lines = Line.all
      @lines = @map.lines
    else
      @lines = Line.all
    end

    respond_to do |format|
      format.html #index.html.erb
      format.json { render json: @lines }
    end
  end

  def show
    @line = Line.find(params[:id])

    respond_to do |format|
      format.html #show.html.erb
      format.json { render json: @line }
    end
  end

  def new
    @map = Map.find(params[:map_id])
    @line = @map.lines.new
    #@line = Line.new

    respond_to do |format|
      format.html #new.html.erb
      format.json { render json: @line }
    end
  end

  def create
    if params[:type] == '0'
      #create a new line
      @map = Map.find(params[:map_id])

      @line = @map.lines.new(start_id:params[:start_id], end_id:params[:end_id])
      @map.lines.create(start_id: params[:end_id], end_id: params[:start_id])

      respond_to do |format|
        if @line.save
          format.html { redirect_to @line, notice: 'line was successfully created.' }
          format.json { render json: @line, status: :created, location: @line }
        else
          format.html { render action: "new" }
          format.json { render json: @line.errors, status: :unprocessable_entity }
        end
      end
    else
       #delete line
      @line = Line.find(params[:line_id])
      @line.destroy

      respond_to do |format|
        format.html { redirect_to lines_url }
        format.json { head :no_content }
      end
    end
  end

  def edit
    @line = Line.find(params[:id])
  end

  def update
    @line = Line.find(params[:id])

    respond_to do |format|
      if @line.update_attributes(params[:line])
        format.html { redirect_to @line, notice: 'Line was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @line.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @line = Line.find(params[:id])
    @line.destroy

    respond_to do |format|
      format.html { redirect_to lines_url }
      format.json { head :no_content }
    end
  end

end
