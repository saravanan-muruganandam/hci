var canvas, ctx;
var circles = [];
var lines = [];//the line should have x1,y1,x2,y2,start_c,end_c
var selectedCircle;

var hoveredCircle;
var hoveredLine;

var start_circle;
var opLine;

var circle_id = 0;
var line_id = 0;

var line_conn = [];

var move_flag = false;
var pic_flag = false;
var conn_flag = false;
var del_flag = false;
var info_flag = false;

var img = new Image();
img.src="";
var img_width = 0;
var img_height = 0;

var bg_img=new Image();
bg_img.src="images/null.jpg";
var bg_width;
var bg_height;

var window_scale = 1;
var display_width = 900;
var display_height = 500;
var window_x = 0;
var window_y = 0;

var window_move_flag = false;//if pic_flag is set when click on the canvas this flag will be set
var start_pic_x = 0;
var start_pic_y = 0;

var window_width = 0;
var window_height = 0;

var hovered_flag = 0;
var hoveredCircle=undefined;

var start_id,end_id;//for the hovered line
var start_name = undefined;
var end_name = undefined;
var ini_bg = true;
var z_out = false;

var R = 15;
var hovered_R = 25;
var cid_temp = -1;
var c_name_temp = "";
var lid_temp = -1;
var img_url = "";
//var server_host = "59.78.23.109:3000";
var server_host = "192.168.1.25:3000";

var cycle_time = 1;
var retry_time = 0;

var url_map_id = 0;
//var return_state = 0;

// -------------------------------------------------------------

// objects :

function Request(argname) 
{ 
	var url = document.location.href; 
	var arrStr = url.substring(url.indexOf("?")+1).split("&"); 
	//return arrStr; 
	for(var i =0;i<arrStr.length;i++) 
	{ 
		var loc = arrStr[i].indexOf(argname+"="); 

	if(loc!=-1) 
	{ 
		return arrStr[i].replace(argname+"=","").replace("?",""); 
		break; 
	} 

} 
return ""; 
} 


function circleIdFetcher(x,y){

	var state = false;
	$.ajax({
		async:false,
		type: "POST",
		url: "http://"+server_host+"/maps/1/nodes.json",
		data:{'type':0,'x':x,'y':y},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//alert(textStatus);
			//alert(data);
			//console.log(data);
			//var result = eval('('+data+')');
			//alert(result.id);
			//cid_temp = result.id;
			cid_temp = data.id;
			//alert(cid_temp);
			state = true;
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			//alert("cid ajax error");
		}
	});

	return state;
}

function lineIdFetcher(start_id,end_id){
	var state = false;
	$.ajax({
		async:false,
		type: "POST",
		url: "http://"+server_host+"/maps/1/lines.json",
		data:{'type':0,'start_id':start_id,'end_id':end_id},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//alert(textStatus);
			//alert(data);
			//console.log(data);
			//var result = eval('('+data+')');
			//alert(result.id);
			//cid_temp = result.id;
			lid_temp = data.id;
			//alert(cid_temp);
			state = true;
			alert("new line success!");
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			//alert("cid ajax error");
			alert("new line failed!");
		}
	});
	return state;
}

function circleAjaxDel(del_cid){
	var state=false;
	$.ajax({
		async:false,
		type: "POST",
		url: "http://"+server_host+"/maps/1/nodes.json",
		data:{'type':2,'node_id':del_cid},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//del successful
			//alert(textStatus);
			//alert(data);
			//alert("circle del success")
			state = true;
			//alert("del circle success");
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			//alert("circle del failed");
			//alert("del failed");
		}
	});
	return state;
}

function circleAjaxUpdate(cid,new_x,new_y,new_name){

	var state = false;
	$.ajax({
		async:false,
		type: "POST",
		url: "http://"+server_host+"/maps/1/nodes.json",
		data:{'type':1,'node_id':cid,'name':new_name,'x':new_x,'y':new_y},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//del successful
			//alert(textStatus);
			//alert(data);
			alert("circle update success")
			state = true;
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			//alert("c update error");
			state = false;
		}
	});
	
	return state;
}

function markApply(){
	//apply a mark id for the hovered circle
	var state=false;
	$.ajax({
		async:false,
		type: "PUT",
		url: "???",
		data:{'id':circles[hoveredCircle].id},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//var result = eval('('+data+')');
			//alert(result.id);
			circles[hoveredCircle].mark_id = data.mark_id;
			state = true;
			
			document.getElementById("mark_id").innerHTML = "";
			document.getElementById("mark_id").innerHTML = circles[hoveredCircle].mark_id;
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			alert("mark apply failed. Please try again later")
		}
	});
	
	return state;
}

function Circle(x, y){
    this.x = x;
    this.y = y;
    //this.radius = radius;	
	this.mark_id = 0;
	//circle id get
	retry_time = 0;
	var new_c_state=false;
	do{
		new_c_state = circleIdFetcher(x,y);
		//alert(id_flag);
		retry_time++;
	}while(!new_c_state && retry_time<cycle_time)
	if(new_c_state){
		alert("c success");
		this.id = cid_temp;
		//circle_id = circle_id + 1;
		this.state = true;
	}else{
		alert("new_circle_failed");
		this.state = false;
	}
	this.name = "node "+this.id;
}

function Line(x1,y1,x2,y2,start_c,end_c){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.start_c = start_c;
	this.end_c = end_c;
	this.a = 0;
	this.b = 0;
	
	//line id get
	
	this.id = "l"+line_id;
	line_id = line_id + 1;
}

function lineAjaxDel(del_lid){
	var state=false;
	$.ajax({
		async:false,
		type: "POST",
		url: "http://"+server_host+"/maps/1/lines.json",
		data:{'type':2,'line_id':del_lid},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//del successful
			//alert(textStatus);
			//alert(data);
			state = true;
			alert("line del success");
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			alert("line del failed");
		}
	});
	return state;
}


function mapSizeMod(m_id,m_width,m_height){//push these info to server to change the height and width
	var state = false;
	var radio = m_width/img_width;
	$.ajax({
		async:false,
		type: "POST",
		url: "http://"+server_host+"/maps.json",
		data:{'type':1,'map_id':m_id,'width':m_width,'height':m_height},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			state = true;
			
			for(var i=0;i<circles.length;i++){
				circles[i].x *= radio;
				circles[i].y *= radio;
			}
			for(var i=0;i<lines.length;i++){
				lines[i].x1 *= radio;
				lines[i].y1 *= radio;
				lines[i].x2 *= radio;
				lines[i].y2 *= radio;
			}
			
			alert("map update success");
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			alert("map update ajax error");
		}
	});
	return state;
}
// -------------------------------------------------------------

//pull functions

function localCircle(c_id,c_name,x,y,mark_id){
    this.x = x;
    this.y = y;
	this.id = c_id;
	this.name = c_name;
	this.mark_id = mark_id;
}

function localLine(l_id,l_start_c,l_end_c){

	this.id = l_id;
	this.start_c = l_start_c;
	this.end_c = l_end_c;
	//console.log(this.start_c+" "+this.end_c);
	//alert(this.start_c+" "+this.end_c);
	for(var i=0;i<circles.length;i++){
		
		if(circles[i].id == l_start_c){
			this.x1 = circles[i].x;
			this.y1 = circles[i].y;
			find_head = true;
			break				
		}
	}
	for(var i=0;i<circles.length;i++){
		if(circles[i].id == l_end_c){
			this.x2 = circles[i].x;
			this.y2 = circles[i].y;
			break;
		}
	}
	this.a = (this.y1-this.y2)/(this.x1-this.x2);
	this.b = (this.x2*this.y1-this.x1*this.y2)/(this.x2-this.x1);
}

function mapInfoGet(map_id){
	var state = false;
	$.ajax({
		async:false,
		type: "GET",
		url: "http://"+server_host+"/maps/"+map_id+".json",
		//data:{'type':0,'map_id':map_id},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//alert(textStatus);
			//alert(data);
			console.log(data);
			img_width = data.width;
			img_height = data.height;
			img.src = "http://"+server_host+"/"+data.path;
			//alert(cid_temp);
			state = true;
			alert("map info ok");
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			alert("map info ajax error");
		}
	});
	
	//alert("map img state:"+state);

	return state;
}

function nodeGet(map_id){
	var state = false;
	$.ajax({
		async:false,
		type: "GET",
		url: "http://"+server_host+"/maps/1/nodes.json",
		//data:{map_id':map_id},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//alert(textStatus);			
			//console.log(data);
			for(var i=0;i < data.length;i++){//load the circles from data
				//var x = data.x;
				//var y = data.y;
				//circles.push(new Circle(x,y));
				var c_temp = new localCircle(data[i].id,data[i].name,data[i].x,data[i].y,data[i].mark_id);
				circles.push(c_temp);
			}
			state = true;
			alert("nodes load complete");
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			alert("nodes info ajax error");
		}
	});

	return state;
}

function lineGet(map_id){
	var state = false;
	$.ajax({
		async:false,
		type: "GET",
		url: "http://"+server_host+"/maps/1/lines.json",
		//data:{'type':0,'map_id':map_id},
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//alert(textStatus);			
			console.log(data);
			for(var i=0;i < data.length;i++){//load the circles from data
				//console.log(data[i].id+data[i].start_id+data[i].end_id+data[i].map_id);
				//console.log("line_id:"+data[i].id);
				//console.log("start id:"+data[i].start_id);
				//console.log("end_id:"+data[i].end_id);
				var l_temp = new localLine(data[i].id,data[i].start_id,data[i].end_id);
				lines.push(l_temp);	
			}
			state = true;
			alert("lines get ok");
			console.log(lines);
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			alert("lines info ajax error");
		}
	});

	return state;
}

// draw functions :

function clear() { // clear canvas function
    ctx.clearRect(0, 0, display_width, display_height);
}

function drawCircle(ctx, x, y, radius) { // draw circle function    
    ctx.fillStyle = 'rgba(255, 35, 55, 1.0)';
	ctx.beginPath();	
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
	ctx.fill();
}

function drawBackground(){
	ctx.drawImage(bg_img,0,0);
	
	var right_less = false;
	var down_less = false;
	
	
	if(bg_width < window_width){
		right_less = true;
	}
	if(bg_height < window_height){
		down_less = true;
	}
	
	if(right_less && !down_less){//only the right side need
		ctx.drawImage(bg_img,bg_width,0);
	}else if(down_less && !right_less){
		ctx.drawImage(bg_img,0,bg_height);
	}else if(down_less && right_less){
		ctx.drawImage(bg_img,bg_width,0);
		ctx.drawImage(bg_img,0,bg_height);
		ctx.drawImage(bg_img,bg_width,bg_height);
	}
}

function drawScene() { // main drawScene function
    clear(); // clear canvas
	//hovered_flag += 1;
	//if(hovered_flag == 100){
	//	hoveredLine = undefined;
	//	hoveredCircle = undefined;}
	
	display_width = img_width*window_scale;
	display_height = img_height*window_scale;
	if(pic_flag || ini_bg || z_out){
		drawBackground();
		ini_bg = false;
		z_out = false;
	}
	ctx.drawImage(img,window_x,window_y,display_width,display_height);
	
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
		
	for (var i=0; i<lines.length; i++) {//draw the lines
		var headlen = 30;
		var angle = Math.atan2(lines[i].y2-lines[i].y1,lines[i].x2-lines[i].x1);
		if(lines[i].id!=null && i!=hoveredLine){//in case this line is deleted
			ctx.beginPath();
			ctx.moveTo(lines[i].x1*window_scale+window_x, lines[i].y1*window_scale+window_y);
			ctx.lineTo(lines[i].x2*window_scale+window_x, lines[i].y2*window_scale+window_y);
			ctx.lineTo(lines[i].x2*window_scale+window_x-headlen*Math.cos(angle-Math.PI/6),lines[i].y2*window_scale+window_y-headlen*Math.sin(angle-Math.PI/6));
			ctx.moveTo(lines[i].x2*window_scale+window_x, lines[i].y2*window_scale+window_y);
			ctx.lineTo(lines[i].x2*window_scale+window_x-headlen*Math.cos(angle+Math.PI/6),lines[i].y2*window_scale+window_y-headlen*Math.sin(angle+Math.PI/6));
			ctx.closePath();
			ctx.stroke(); // draw border
		}
		if(hoveredLine == i){
			//alert("hey");
			ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
			ctx.beginPath();
			ctx.moveTo(lines[i].x1*window_scale+window_x, lines[i].y1*window_scale+window_y);
			ctx.lineTo(lines[i].x2*window_scale+window_x, lines[i].y2*window_scale+window_y);
			ctx.lineTo(lines[i].x2*window_scale+window_x-headlen*Math.cos(angle-Math.PI/6),lines[i].y2*window_scale+window_y-headlen*Math.sin(angle-Math.PI/6));
			ctx.moveTo(lines[i].x2*window_scale+window_x, lines[i].y2*window_scale+window_y);
			ctx.lineTo(lines[i].x2*window_scale+window_x-headlen*Math.cos(angle+Math.PI/6),lines[i].y2*window_scale+window_y-headlen*Math.sin(angle+Math.PI/6));
			ctx.closePath();
			ctx.stroke(); // draw border
			ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
		}
	}		
	

    for (var i=0; i<circles.length; i++) { // display all our circles
		if(circles[i].x*window_scale>(-window_x)-15 && circles[i].x*window_scale<(-window_x)+window_width+15 && circles[i].y*window_scale>(-window_y)-15 && circles[i].y*window_scale<(-window_y)+window_height+15){
			drawCircle(ctx, circles[i].x*window_scale+window_x, circles[i].y*window_scale+window_y, (hoveredCircle == i) ? hovered_R : R);
		}
		
		if(hoveredCircle == i){
			ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			ctx.stroke();
		}
    }
}

function zoomIn(){
	dis_x = Math.abs(window_x)+window_width/2;
	dis_y = Math.abs(window_y)+window_height/2;
	
	window_x -= (dis_x/window_scale);
	window_y -= (dis_y/window_scale);	
	//alert(temp_x+" "+temp_y);
	if(window_width > img_width*window_scale){
		window_x = 0;
	}
	if(window_height > img_height*window_scale){
		window_y = 0;
	}

	window_scale += 1;
	//alert(display_width+" "+display_height);
	R = R*(window_scale+1)/window_scale
	hovered_R = hovered_R*(window_scale+1)/window_scale
}

function bigger(){
	window_x = 0;
	window_y = 0;	
		
	if(mapSizeMod(1,img_width+100,img_height+100)){
		img_width += 100;
		img_height += 100;
	}else{
		alert("bigger failed");
	}
}

function zoomOut(){
	if(window_scale>1){
		dis_x = Math.abs(window_x)+window_width/2;
		dis_y = Math.abs(window_y)+window_height/2;
		temp_x = window_x+(dis_x/window_scale);
		temp_y = window_y+(dis_y/window_scale);
		
		window_scale -= 1;
		display_width = img_width*window_scale;
		display_height = img_height*window_scale;
		
		//alert(display_width+window_x+"\n"+window_width+"\n"+temp_x);
		if(display_width+window_x < window_width){
			temp_x  = window_width-display_width;
		}
		if(display_height+window_y < window_height){
			temp_y  = window_height-display_height;
		}
		if(temp_x > 0){
			temp_x = 0;
		}
		if(temp_y > 0){
			temp_y = 0;
		}
		//alert(temp_x+" "+temp_y);	
		window_x = temp_x;
		window_y = temp_y;

		z_out = true;		
		if(window_scale > 1){
			R = R*(window_scale-1)/window_scale
			hovered_R = hovered_R*(window_scale-1)/window_scale
		}else{
			R = 15;
			hovered_R = 25;
		}
	}
}

function smaller(){
	window_x = 0;
	window_y = 0;
	
	
	if(mapSizeMod(1,img_width-100,img_height-100)){
		img_width -= 100;
		img_height -= 100;
	}else{
		alert("smaller failed");
	}
	
	z_out = true;
	
	
}

// -------------------------------------------------------------

function newCircle(){
	var circleRadius = 15;
    var x = (Math.random()*(display_width-50)-window_x)/window_scale + 25;
    var y = (Math.random()*(display_height-50)-window_y)/window_scale + 25;
    //circles.push(new Circle(x,y));
	var c_temp = new Circle(x,y);
	if(c_temp.state){
		circles.push(c_temp);
	}
}

function setMove(){
	move_flag = true;
	conn_flag = false;
	del_flag = false;
	pic_flag = false;
	info_flag = false;
}

function setConn(){
	move_flag = false;
	conn_flag = true;
	del_flag = false;
	pic_flag = false;
	info_flag = false;
}

function setDel(){
	move_flag = false;
	conn_flag = false;
	del_flag = true;
	pic_flag = false;
	info_flag = false;
}

function setPic(){
	move_flag = false;
	conn_flag = false;
	del_flag = false;
	pic_flag = true;
	info_flag = false;
}

function setInfoEdit(){
	move_flag = false;
	conn_flag = false;
	del_flag = false;
	pic_flag = false;
	info_flag = true;
}


function grabCircle(mouseX,mouseY){	
    for (var i=0; i<circles.length; i++) { // checking through all circles - are mouse down inside circle or not
        var circleX = circles[i].x*window_scale + window_x;
        var circleY = circles[i].y*window_scale + window_y;
		var radius = R;
        if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)) {
			selectedCircle = i;
			break;
		}
	}
	//to seek the lines connect to this circle	
	if(selectedCircle != null){
		for(var i=0;i < lines.length;i++){
			if(lines[i].start_c==circles[selectedCircle].id){
				line_conn.push(new Array(i,0));
			}else if(lines[i].end_c==circles[selectedCircle].id){
				line_conn.push(new Array(i,1));
			}
			//alert(circles[selectedCircle].id+" "+lines[i].start_c+" "+lines[i].end_c);
		}
	}
}

function dragCircle(mouseX,mouseY){	
    if (selectedCircle != null) {     
		var radius = R;
		if(mouseX>20 && mouseX<display_width-20 && mouseY>20 && mouseY<display_height-20){
			circles[selectedCircle].x = (mouseX-window_x)/window_scale;
			circles[selectedCircle].y = (mouseY-window_y)/window_scale;
		}
		
		for(var i=0;i < line_conn.length;i++){
			if(line_conn[i][1]){
				lines[line_conn[i][0]].x2 = (mouseX-window_x)/window_scale;
				lines[line_conn[i][0]].y2 = (mouseY-window_y)/window_scale;
			}else{
				lines[line_conn[i][0]].x1 = (mouseX-window_x)/window_scale;
				lines[line_conn[i][0]].y1 = (mouseY-window_y)/window_scale;
			}
		}
    }
}

function lineStart(mouseX,mouseY){
	for (var i=0; i<circles.length; i++) { // checking through all circles - are mouse down inside circle or not
        var circleX = circles[i].x;
        var circleY = circles[i].y;
		var radius = R;
        if (Math.pow(mouseX-circleX*window_scale-window_x,2) + Math.pow(mouseY-circleY*window_scale-window_y,2) < Math.pow(radius,2)) {
			start_circle = i;
			break;
		}
	}
	//create a new line conn to this circle
	if(start_circle!=null){//in case there's no line on operate
		lines.push(new Line(circles[start_circle].x,circles[start_circle].y,
		circles[start_circle].x,circles[start_circle].y,circles[start_circle].id,circles[start_circle].id));
		opLine = lines.length - 1;
	}
}

function lineConn(mouseX,mouseY){
	 if (opLine != null) {     
        lines[opLine].x2 = (mouseX-window_x)/window_scale; // changing the shape of operating line
		lines[opLine].y2 = (mouseY-window_y)/window_scale; 
    }
}

function lineEnd(mouseX,mouseY){
	var end_circle = null;
	var line_right = false;
	for (var i=0; i<circles.length; i++) { // checking through all circles - are mouse down inside circle or not
        var circleX = circles[i].x*window_scale+window_x;
        var circleY = circles[i].y*window_scale+window_y;
		var radius = R;
        if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)) {
			end_circle = i;
			break;
		}
	}
	
	if(end_circle != null){//to make sure we have found a circle
		if(end_circle != start_circle){
			//the line can not stay in the same circle
			var redundant = false;
			for(var i=0;i < lines.length-1;i++){//seek through the lines to see if any line redundant
				if(lines[i].start_c==circles[start_circle].id && lines[i].end_c==circles[end_circle].id){
					redundant = true;					
					break;
				}else if(lines[i].start_c==circles[end_circle].id && lines[i].end_c==circles[start_circle].id){
					redundant = true;					
					break;
				}
			}
			if(!redundant){
				//add line on server side
				var l_add_flag = false;
				retry_time = 0;
				do{
					l_add_flag = lineIdFetcher(lines[opLine].start_c,circles[end_circle].id);
					retry_time++;
				}while(!l_add_flag && retry_time<cycle_time);
				if(!l_add_flag){//line add failed
					alert("server error")
				}else{//line add success
					line_right = true;
				}
			}else{
				alert("redundant");
			}
		}else{
			alert("end = start");
		}
	}
	
	if(line_right){
		lines[opLine].end_c = circles[end_circle].id;
		lines[opLine].x2 = circles[end_circle].x;
		lines[opLine].y2 = circles[end_circle].y;
		lines[opLine].id = lid_temp;
		
		lines[opLine].a = (lines[opLine].y1-lines[opLine].y2)/(lines[opLine].x1-lines[opLine].x2);
		lines[opLine].b = (lines[opLine].x2*lines[opLine].y1-lines[opLine].x1*lines[opLine].y2)/(lines[opLine].x2-lines[opLine].x1);
	}else{
		if(start_circle!=null){
			lines.pop();//del the new line
		}
	}
	
	start_circle = null;
	end_circle = null;
	opLine = null;
}

function del(mouseX,mouseY){
	var del_circle = null;
	for (var i=0; i<circles.length; i++) { // checking through all circles - are mouse down inside circle or not
        var circleX = circles[i].x*window_scale+window_x;
        var circleY = circles[i].y*window_scale+window_y;
		var radius = R;
        if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)) {
			del_circle = i;
			
			//ask server to del the node on server side
			var c_del_flag = false;
			retry_time = 0;
			do{
				c_del_flag = circleAjaxDel(circles[del_circle].id)
				retry_time++;
			}while(!c_del_flag && retry_time<cycle_time);
			if(!c_del_flag){								// del failed
				del_circle = null;
				alert("circle del failed");
				return false;
			}else{
				alert("circle del sucess");
			}

			break;
		}
	}
	if(del_circle != null){//find the line connect to this circle
		for(var i=0;i < lines.length;i++){
			if(lines[i].start_c==circles[del_circle].id || lines[i].end_c==circles[del_circle].id){
				lines.splice(i,1);
				i = i - 1;
				
				//server will delete the lines related in the database				
			}
		}
		
		circles.splice(del_circle,1);
	}

	//if click is on lines then del line
	for(var i=0;i < lines.length;i++){
		//var a = (mouseY-lines[i].y2)/(mouseX-lines[i].x2)
		//var b = (lines[i].x2*mouseY-mouseX*lines[i].y2)/(lines[i].x2-mouseX)		
		
		var bigX = (lines[i].x1 > lines[i].x2 ? lines[i].x1:lines[i].x2);
		var smallX = (lines[i].x1 > lines[i].x2 ? lines[i].x2:lines[i].x1)
		var bigY = (lines[i].y1 > lines[i].y2 ? lines[i].y1:lines[i].y2);
		var smallY = (lines[i].y1 > lines[i].y2 ? lines[i].y2:lines[i].y1);
		var transfer_x = (mouseX-window_x)/window_scale;
		var transfer_y = (mouseY-window_y)/window_scale;
		if(bigX - smallX < 20){
			bigX = bigX + 20;
			smallX = smallX - 20;
		}
		if(bigY - smallY < 20){
			bigY = bigY + 20;
			smallY = smallY - 20;
		}
				
		if(transfer_x>smallX && transfer_x<bigX && transfer_y>smallY && transfer_y<bigY){
			//alert(a+" "+b+"\n"+lines[i].a+" "+lines[i].b);
			//alert(mouseX+" "+mouseY+"\n"+bigX+" "+bigY+"\n"+smallX+" "+smallY);
			var dis = Math.abs(transfer_x*lines[i].a-transfer_y+lines[i].b)/Math.sqrt(lines[i].a*lines[i].a+lines[i].b*lines[i].b);
			//alert(dis);
			if(dis<0.03){//del the line			
				//ask server to del the line on server side
				var l_del_flag = false;
				retry_time = 0;
				do{
					l_del_flag = lineAjaxDel(lines[i].id);
				}while(!l_del_flag && retry_time<cycle_time);
				if(!l_del_flag){//del failed
					alert("line del failed");
				}else{
					lines.splice(i,1);				
				}
				break;
			}
		}
	}
}
// initialization

$(function(){
	
	url_map_id = Request("id");

    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var circleRadius = R;	
	
	$("#circle_dialog").dialog({autoOpen:false,modal:true});
	$("#path_dialog").dialog({autoOpen:false,modal:true});
	$("#cir_dia_btn").button();
	$("#mark_apply").button();
	$("#cir_dia_btn").click(function(){//change the circle name		
		//update circle name on server side
		var c_name_mod_flag = false;
		retry_time = 0;
		do{
			c_name_mod_flag = circleAjaxUpdate(cirlces[hoveredCircle].id,cirlces[hoveredCircle].x,cirlces[hoveredCircle].y,cirlces[hoveredCircle].name);
			retry_time++;
		}while(!c_name_mod_flag && retry_time<cycle_time);
		if(!c_name_mod_flag){	//name change failed
			alert("name change failed");
		}else{					//name mod success
			alert("name change success");
			circles[hoveredCircle].name = document.getElementById("circle_name").value;
		}
		$("#circle_dialog").dialog("close");		
	});
	
	//$("#brand").menu();
	
	$("#smaller").button({
		icons:{
			primary:"ui-icon-zoomin"
		}		
	});
	$(".tool").css({
		width:'133'
	});
	$("#bigger").button({
		icons:{
			primary:"ui-icon-zoomout"
		}		
	});
	
	$("#update").button({
		icons:{
			primary:"ui-icon-wrench"
		}		
	});
	
	canvas.width = window.innerWidth-150;
	canvas.height = window.innerHeight-100;
	
	bg_width = 1024;
	bg_height = 1024;
	
	window_width = canvas.width;
    window_height = canvas.height;
	//$("#dialog").dialog();

	/*
    var circlesCount = 2; // we will draw 7 circles randomly
    for (var i=0; i<circlesCount; i++) {
        var x = Math.random()*display_width;
        var y = Math.random()*display_height;
        circles.push(new Circle(x,y));
    }
	*/
	
	//lines.push(new Line(0,0,100,100,"null","null"));
	
	 mapInfoGet(url_map_id);
	 nodeGet(url_map_id);
	 lineGet(url_map_id);

    // binding mousedown event (for dragging)
    $('#scene').mousedown(function(e) {
	
		//$('#dialog-message').dialog('open');
		//$("#circle_dialog").dialog("open");
		//alert(bg_width);
		//alert(bg_img.height);
		//alert(circles.length+" "+circles[0].x+" "+circles[0].y);
		
        var canoffset = $(this).offset();
		//var mouseX = e.layerX || 0;
		//var mouseY = e.layerY || 0;		
		//var mouseX = e.layerX - document.body.scrollLeft  - Math.floor(canoffset.left);
		//var mouseY = e.layerY - document.body.scrollTop  - Math.floor(canoffset.top) + 1;
		
		var mouseX = e.pageX - Math.floor(canoffset.left);
		var mouseY = e.pageY - Math.floor(canoffset.top) + 1;
		
		//alert(mouseX+" "+mouseY+"\n"+circles[0].x+" "+circles[0].y);
		if(move_flag){
			//alert(canoffset.left+"\n"+mouseX+" "+mouseY+"\n"+circles[0].x+" "+circles[0].y);
			//alert(e.clientX+" "+e.clientY+"\n"+e.layerX+" "+e.layerY+"\n"+e.pageX+" "+e.pageY+"\n"+circles[0].x+" "+circles[0].y+"\n"+canoffset.left+" "+canoffset.top)
			grabCircle(mouseX,mouseY);
		}else if(conn_flag){
			lineStart(mouseX,mouseY);
		}else if(del_flag){
		
		}else if(pic_flag){
			window_move_flag = true;
			start_pic_x = mouseX;
			start_pic_y = mouseY;
		}else if(info_flag){
			if(hoveredCircle != undefined){
				$("#circle_dialog").dialog("open");
				document.getElementById("circle_name").value = circles[hoveredCircle].name;
				document.getElementById("link_group").innerHTML = "link null";
				document.getElementById("link_floor").innerHTML = "floor null";
				if(!circles[hoveredCircle].mark_id){
					document.getElementById("mark_id").innerHTML = "not a marked node";
				}else{
					document.getElementById("mark_id").innerHTML = circles[hoveredCircle].mark_id;
				}
			}else if(hoveredLine != undefined){				
				document.getElementById("start_circle").innerHTML = start_name+"(id:"+start_id+")";
				document.getElementById("end_circle").innerHTML = end_name+"(id:"+end_id+")";
				$("#path_dialog").dialog("open");
				
			}
		}
    });

    $('#scene').mousemove(function(e) { // binding mousemove event for dragging selected circle
		//var mouseX = e.layerX || 0;
		//var mouseY = e.layerY || 0;

		var canoffset = $(this).offset();
		//var mouseX = e.layerX + document.body.scrollLeft - Math.floor(canoffset.left);
		//var mouseY = e.layerY + document.body.scrollTop  - Math.floor(canoffset.top) + 1;
		var mouseX = e.pageX - Math.floor(canoffset.left);
		var mouseY = e.pageY - Math.floor(canoffset.top) + 1;
		
        if(move_flag){
			dragCircle(mouseX,mouseY);
		}else if(conn_flag){
			lineConn(mouseX,mouseY)
		}else if(del_flag){
		
		}else if(pic_flag && window_move_flag){
			temp_x = window_x + 0.5*(mouseX-start_pic_x);
			temp_y = window_y + 0.5*(mouseY-start_pic_y);
			if(temp_x > 0){//¿ØÖÆÍ¼Æ¬×óÉÏ½Çx
				window_x = 0;
			}else if(Math.abs(temp_x)+window_width < display_width){
				window_x = temp_x;
			}
			
			if(temp_y > 0){//¿ØÖÆÍ¼Æ¬×óÉÏ½Çy
				window_y = 0;
			}else if(Math.abs(temp_y)+window_height < display_height){
				window_y = temp_y;
			}

			start_pic_x = mouseX;
			start_pic_y = mouseY;
		}
		
        hoveredCircle = undefined;
        for (var i=0; i<circles.length; i++) { // checking through all circles - are mouse down inside circle or not
            var circleX = circles[i].x*window_scale + window_x;
            var circleY = circles[i].y*window_scale + window_y;
            var radius = R;
            if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)) {
                hoveredCircle = i;
				
				var display = document.getElementById("display");
				display.innerHTML = "";
				display.innerHTML += "Circle name: "+circles[hoveredCircle].name+"<br />";
				display.innerHTML += "Circle id: "+circles[hoveredCircle].id+"<br />";
				display.innerHTML += "x:"+ circles[hoveredCircle].x + "<br />";
				display.innerHTML += "y:"+ circles[hoveredCircle].y + "<br />";
				display.innerHTML += "Link group: link null<br />";
				display.innerHTML += "Link floor: null";

                break;
            }
        }
		
		hoveredLine = undefined;
		for(var i=0;i < lines.length;i++){//find the hovered line
			//var a = (mouseY-lines[i].y2)/(mouseX-lines[i].x2)
			//var b = (lines[i].x2*mouseY-mouseX*lines[i].y2)/(lines[i].x2-mouseX)		
			var bigX = (lines[i].x1 > lines[i].x2 ? lines[i].x1:lines[i].x2);
			var smallX = (lines[i].x1 > lines[i].x2 ? lines[i].x2:lines[i].x1)
			var bigY = (lines[i].y1 > lines[i].y2 ? lines[i].y1:lines[i].y2);
			var smallY = (lines[i].y1 > lines[i].y2 ? lines[i].y2:lines[i].y1);
			var transfer_x = (mouseX-window_x)/window_scale;
			var transfer_y = (mouseY-window_y)/window_scale;
			if(bigX - smallX < 20){
				bigX = bigX + 20;
				smallX = smallX - 20;
			}
			if(bigY - smallY < 20){
				bigY = bigY + 20;
				smallY = smallY - 20;
			}				
			if(transfer_x>smallX && transfer_x<bigX && transfer_y>smallY && transfer_y<bigY){
				//alert(a+" "+b+"\n"+lines[i].a+" "+lines[i].b);
				//alert(mouseX+" "+mouseY+"\n"+bigX+" "+bigY+"\n"+smallX+" "+smallY);
				var dis = Math.abs(transfer_x*lines[i].a-transfer_y+lines[i].b)/Math.sqrt(lines[i].a*lines[i].a+lines[i].b*lines[i].b);
				//alert(dis);
				if(dis<0.05 && hoveredCircle==undefined && mouseX<window_width && mouseY<window_height){//del the line
					
					hoveredLine = i;
					
					start_name = undefined;
					end_name = undefined;
					start_id = lines[hoveredLine].start_c
					end_id = lines[hoveredLine].end_c
					var hovered_line_id = lines[hoveredLine].id;
					for(i=0;i < circles.length;i++){
						if(start_id == circles[i].id){
							start_name = circles[i].name;
						}
						if(end_id == circles[i].id){
							end_name = circles[i].name;
						}
						if(start_name!=undefined && end_name!=undefined){
							break;
						}
					}
			
					var display = document.getElementById("display");
					display.innerHTML = "";
					display.innerHTML = "Operating on line: "+hovered_line_id +"<br />";
					display.innerHTML += "start from circle: "+start_name+"<br />"
					display.innerHTML += "end at circle: " + end_name+"<br />"
					display.innerHTML += "direction: a to b";
					//alert("hoveredLine:"+i);
					break;
				}
			}
		}
		
		hovered_flag = 0;		
    });

    $('#scene').mouseup(function(e) { // on mouseup - cleaning selectedCircle
		//var mouseX = e.layerX || 0;
		//var mouseY = e.layerY || 0;
		
		var canoffset = $(this).offset();
		//var mouseX = e.layerX + document.body.scrollLeft  - Math.floor(canoffset.left) ;
		//var mouseY = e.layerY + document.body.scrollTop  - Math.floor(canoffset.top) + 1;
		var mouseX = e.pageX - Math.floor(canoffset.left);
		var mouseY = e.pageY - Math.floor(canoffset.top) + 1;
		
        if(move_flag){
		
			//update the circle moved to server
			retry_time = 0;
			var move_c_return_state = false;
			do{				
				move_c_return_state = circleAjaxUpdate(circles[selectedCircle].id,circles[selectedCircle].x,circles[selectedCircle].y,circles[selectedCircle].name);
				retry_time++;
			}while(!move_c_return_state && retry_time<cycle_time);
			if(!move_c_return_state){
				alert("update failed! Please try again later");
			}
			selectedCircle = null;
			for(var i=0;i < line_conn.length;i++){
				lines[line_conn[i][0]].a = (lines[line_conn[i][0]].y1-lines[line_conn[i][0]].y2)/(lines[line_conn[i][0]].x1-lines[line_conn[i][0]].x2);
				lines[line_conn[i][0]].b = (lines[line_conn[i][0]].x2*lines[line_conn[i][0]].y1-lines[line_conn[i][0]].x1*lines[line_conn[i][0]].y2)/(lines[line_conn[i][0]].x2-lines[line_conn[i][0]].x1);
			}			
			line_conn.length = 0;//clean the array line_conn
		}else if(conn_flag){
			lineEnd(mouseX,mouseY);
		}else if(del_flag){
			del(mouseX,mouseY);
		}else if(pic_flag){
			window_move_flag = false;
		}
    });
	
    setInterval(drawScene, 100); // loop drawScene
});