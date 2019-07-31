var MenuPanel = function(core, child)
{
	var self = this,
		than = core;
	
	this.domElement     = null;
	this.domElementType = "div";

	this.type           = "innerElement";
	
	this.position = [{
			top: "1%"
		}, {
			bottom: "90%"
	}];
	
	this.style = {
		backgroundColor: "orange",
		position:        "relative",
		color:           "black",
		fontFamily:      than.style.fontFamily,
		fontSize:        than.style.fontSize,
		position:        "relative",
		heigth:          "10%",
		width:           "90%",
		border:          "1px solid black"
	} 

	this.compile = function(child)
	{
		var posIndex = (position !== undefined) ? position:1,
			position = this.position[posIndex];
		this.style   = than.modules.MethodsForObjects.objectAddition(this.style, position);
		
		than.modules.MethodsForObjects.objectAddition(this, child);
		return this;
	}

	this.compile(child);
}