class NodesController < ApplicationController
  # GET /nodes
  # GET /nodes.json
  def index
    if !params[:map_id].nil?
      @map = Map.find(params[:map_id])
      @nodes = @map.nodes
    else
      @nodes = Node.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @nodes }
    end
  end

  # GET /nodes/1
  # GET /nodes/1.json
  def show
    @node = Node.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @node }
    end
  end

  # GET /nodes/new
  # GET /nodes/new.json
  def new
    @map = Map.find(params[:map_id])

    #@node = Node.new
    @node = @map.nodes.build

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @node }
    end
  end

  # GET /nodes/1/edit
  def edit
    #@map = Map.find(params[:map_id])
    @node = Node.find(params[:id])
  end

  def create
    if !params[:type].nil?
        if params[:type] == '1'
           #if type is '1', it means update the node
           @node = Node.find(params[:node_id])
           respond_to do |format|
             if @node.update_attributes(name:params[:name], x:params[:x], y:params[:y])
               format.html { redirect_to @node, notice: 'Node was successfully updated.' }
               format.json { render json: @node, status: :created, location: @node }
             else
               format.html { render action: "edit" }
               format.json { render json: @node.errors, status: :unprocessable_entity }
             end
           end

         elsif params[:type] == '2'
           #delete node
           @node = Node.find(params[:node_id])
           @node.destroy

           respond_to do |format|
             format.html { redirect_to nodes_url }
             format.json { head :no_content }
           end

         elsif params[:type] == '3'
           #set a node as marked
           @marks = Mark.all
           @node = Node.find(params[:node_id])
           @marks.each do |mark|
             if mark.node.nil?
               @node.update_attributes(mark_id:mark.id)
               render json: @node, status: :created, location: @node
               break
             end
           end

         elsif params[:type] == '4'
            #delete the mark and set it as -1
           @node = Node.find(params[:node_id])
           @node.update_attributes(mark_id: -1)
           respond_to do |format|
             format.html { redirect_to nodes_url }
             format.json { head :no_content }
           end

         elsif params[:type] == '0'
          #create a new node, with mark_id = -1
           @map = Map.find(params[:map_id])
           @node = @map.nodes.new(x: params[:x], y: params[:y], mark_id: -1)

           respond_to do |format|
             if @node.save
                format.html { redirect_to @node, notice: 'Node was successfully created.' }
                format.json { render json: @node, status: :created, location: @node }
            else
              format.html { render action: "new" }
              format.json { render json: @node.errors, status: :unprocessable_entity }
            end
        end

           
         end
      else
        #create a new node in the server side
        @map = Map.find(params[:map_id])
        @node = @map.nodes.new(params[:node])

        respond_to do |format|
          if @node.save
            format.html { redirect_to @node, notice: 'Node was successfully created.' }
            format.json { render json: @node, status: :created, location: @node }
          else
            format.html { render action: "new" }
            format.json { render json: @node.errors, status: :unprocessable_entity }
          end
        end
      end

    end

    def update
        #@map = Map.find(params[:map_id])
        @node = Node.find(params[:id])

        respond_to do |format|
          #if @node.update_attributes(params[:node])
          if @node.update_attributes(name:params[:name], x:params[:x], y:params[:y],mark_id: params[:mark_id])
            format.html { redirect_to @node, notice: 'Node was successfully updated.' }
            #format.json { head :no_content }
            format.json { render json: @node, status: :created, location: @node }
          else
            format.html { render action: "edit" }
            format.json { render json: @node.errors, status: :unprocessable_entity }
          end
        end
    end

    def destroy
        @node = Node.find(params[:id])
        @node.destroy

        respond_to do |format|
          format.html { redirect_to nodes_url }
          format.json { head :no_content }
        end
    end
end
