class SenomaSpiderChart {

 constructor ( id ) {
	 this.id = id;
	 this.showNumberPoint = true;
 }

 setLabelsAndValues( values, labels ) {
	 this.values = values;
	 this.labels = labels;
	 this.canvas = null;
	 this.context = null;
	 this.mousePos = null;
	 this.lastsize = 300;
	 this.positions = null;
	 this.setZeroToPositions();
 }

 doSize(size) {
	 $("#"+this.id).attr("width",size+"px");
	 $("#"+this.id).attr("height",size+"px");
	 $("#"+this.id).css("width",size+"px");
	 $("#"+this.id).css("height",size+"px");
	 this.setZeroToPositions();
	 this.lastsize = size;
 }

 desenha() {
	 if (this.canvas==null) {

		 this.canvas = $("#"+this.id);
		 var obj = this;
		 $("#"+this.id).mousemove(function( event ) {
				obj.getMousePos(event);
			});

	 } else {
		 try {
			 this.canvas = document.getElementById(this.id);
			 this.context = this.canvas.getContext("2d");
		 } catch (e) {
			 return ;
		 }

		 // clear this.canvas
		 this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		 for (var i=0; i<this.labels.length; i++) {
			 if (parseInt(this.values[i])<0) this.values[i] = 0;
			 if (parseInt(this.values[i])>10) this.values[i] = 10;
			 if (parseFloat(this.positions[i]) < (parseFloat(this.values[i])-0.25)) this.positions[i]+= 0.25;
			 else if (parseFloat(this.positions[i]) > (parseFloat(this.values[i])+0.25)) this.positions[i]-= 0.25;
		 }

		 var w = this.canvas.width;
		 var h = this.canvas.height;
		 var padding = this.getPadding();
		 var r =  (this.canvas.width/2)-padding;
		 var raio = 0;
		 var pos1;
		 var pos2;
		 var angle = (360/this.labels.length);

		 // DESENHA AS LINHAS DE ESCALA
		 for (raio = 1; raio<11; raio++) {
			 for (var i = 0; i<this.labels.length; i++) {
				 pos1 = this.getXY(this.canvas.width/2, this.canvas.height/2, ((r/10)*raio), (-90 + (i*angle)));
				 pos2 = this.getXY(this.canvas.width/2, this.canvas.height/2, ((r/10)*raio), (-90 + (i*angle))+angle);
				 this.drawLine("#EEEEEE", 2, pos1, pos2);
			 }
		 }

		 // DESENHA OS RAIOS
		 pos1 = { x : this.canvas.width / 2, y : this.canvas.height / 2 };
		 for (var i = 0; i<this.labels.length; i++) {
			 pos2 = this.getXY(this.canvas.width/2, this.canvas.height/2, r+(r/15), -90 + (i*angle));
			 this.drawLine("#999999", 2, pos1, pos2);

			 this.setFont(400);
			 var teste = 0;
			 if (parseInt(i*angle)>270) {
				 pos2.x -= (r/25);
				 pos2.y -= (r/15);
				 teste = 270;
			 } else if (parseInt(i*angle)>195) {
				 pos2.x -= (r/25);
				 pos2.y += (r/15);
				 teste = 195;
			 } else if (parseInt(i*angle)>165) {
				 pos2.y += (r/15);
				 teste = 165;
			 } else if (parseInt(i*angle)>90) {
				 pos2.x += (r/25);
				 pos2.y += (r/15);
				 teste = 90;
			 } else if (parseInt(i*angle)>15) {
				 pos2.x += (r/25);
				 pos2.y -= (r/15);
				 teste = 15;
			 } else {
				 pos2.y -= (r/15);
			 }

			 if (this.showNumberPoint) {
				 this.context.fillText( this.labels[i]+' ('+this.values[i]+')', pos2.x, pos2.y);
			 } else  {
				 this.context.fillText( this.labels[i], pos2.x, pos2.y);
			 }
		 }

		 // DESENHA OS FUNDOS
		 var i2 = 0;
		 for (var i = 0; i<this.labels.length; i++) {
			 if (i==this.labels.length-1) i2 = 0; else i2 = i+1;
			 pos1 = this.getXY(this.canvas.width/2, this.canvas.height/2, ((r*this.positions[i])/10), (-90 + (i*angle)));
			 pos2 = this.getXY(this.canvas.width/2, this.canvas.height/2, ((r*this.positions[i2])/10), (-90 + (i*angle)+angle));
			 this.context.moveTo(this.canvas.width/2, this.canvas.height/2);
			 this.context.lineTo(pos1.x, pos1.y);
			 this.context.lineTo(pos2.x, pos2.y);
			 this.drawBack();
			 this.drawLine("#399c36", 2, pos1, pos2);
		 }

		 // DESENHA AS BOLINHAS
		 for (var i = 0; i<this.labels.length; i++) {
			 pos1 = this.getXY(this.canvas.width/2, this.canvas.height/2, ((r*this.positions[i])/10), (-90 + (i*angle)));
			 if (this.mousePos !=null && pos1.x-10<this.mousePos.x && pos1.x+10>this.mousePos.x && pos1.y-10<this.mousePos.y && pos1.y+10>this.mousePos.y) {
				 this.drawBola(pos1, 3);
				 this.setFont(500);
				 if (i == 0) { pos1.y = pos1.y-(r/10); }
				 if (i == 1 || i == 2) { pos1.x = pos1.x+(r/7); }
				 if (i == 3) { pos1.y = pos1.y+(r/10); }
				 if (i == 4 || i == 5) { pos1.x = pos1.x-(r/7); }
				 this.drawText(this.values[i], pos1, true);
			 } else{
				 this.drawBola(pos1, 0);
			 }
		 }
	 }
 }

 getXY(x, y, raio, theta) {
	 return {
		 x: x + raio * Math.cos(Math.PI * theta / 180.0),
		 y: y + raio * Math.sin(Math.PI * theta / 180.0)
	 };
 }

 drawBack() {
	 this.context.fillStyle = "#399c3633";
	 this.context.fill();
 }

 drawLine(color, weight, pos1, pos2) {
	 this.context.beginPath();
	 this.context.strokeStyle = color;
	 this.context.lineWidth = weight;
	 this.context.moveTo(pos1.x, pos1.y);
	 this.context.lineTo(pos2.x, pos2.y);
	 this.context.stroke();
 }

 drawBola(pos, valbol){
	 var bol = 4;
	 if (this.canvas.width>450) bol = 6;
	 if (this.canvas.width>700) bol = 8;
	 this.context.beginPath();
	 this.context.arc(pos.x, pos.y, bol+valbol, 0, 2 * Math.PI, false);
	 this.context.fillStyle = '#399c36';
	 this.context.fill();
	 this.context.lineWidth = 1;
	 this.context.strokeStyle = '#298c26';
	 this.context.stroke();
 }

 drawText(text, pos, stroke) {
	 if (stroke==true) this.context.strokeText(text, pos.x, pos.y);
	 this.context.fillText(text, pos.x, pos.y);
 }

 setFont(weight) {
	 this.context.strokeStyle= "#FFFFFF";
	 this.context.fillStyle = '#333333';
	 this.context.textAlign = 'center';
	 this.context.textBaseline = 'middle';
	 if (this.canvas.width>900) { this.context.font = weight+' 17pt Helvetica Neue'; this.context.lineWidth = 10; }
	 else if (this.canvas.width>800) { this.context.font = weight+' 16pt Helvetica Neue'; this.context.lineWidth = 9; }
	 else if (this.canvas.width>700) { this.context.font = weight+' 15pt Helvetica Neue'; this.context.lineWidth = 8; }
	 else if (this.canvas.width>600) { this.context.font = weight+' 14pt Helvetica Neue'; this.context.lineWidth = 7; }
	 else if (this.canvas.width>500) { this.context.font = weight+' 13pt Helvetica Neue'; this.context.lineWidth = 6; }
	 else if (this.canvas.width>400) { this.context.font = weight+' 12pt Helvetica Neue'; this.context.lineWidth = 5; }
	 else { this.context.font = weight+' 11pt Helvetica Neue'; this.context.lineWidth = 4; }
 }

	getPadding() {
	 var padding = 50;
	 if (this.canvas.width>900) padding = 100;
	 else if (this.canvas.width>800) padding = 90;
	 else if (this.canvas.width>700) padding = 80;
	 else if (this.canvas.width>600) padding = 70;
	 else if (this.canvas.width>500) padding = 60;
	 return padding;
	}

	getMousePos(evt) {
		var rect = this.canvas.getBoundingClientRect();
		this.mousePos = {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	setZeroToPositions() {
		this.positions = new Array();
		for ( var i = 0; i < this.labels.length; i++ ) {
			this.positions[this.positions.length] = 0;
		}
	}
}