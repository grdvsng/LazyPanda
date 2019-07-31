var MenuPanel = function(master)
{
	var self = this,
		than = master;
	
	this.domElement     = null;
	this.domElementType = "div";

	this.type           = "innerElement";
	
	this.position = [{
			top: "1%"
		}, {
			bottom: "90"
	}];
	
	this.style = {
		backgroundColor: "red",
		position:        "relative",
		heigth:          "10%",
		width:           "90%",
		border:          "1px solid black"
	} 

	this.__init__ = function(params, position)
	{
		var posIndex = (position !== undefined) ? position:1,
			position = this.position[posIndex];
		this.style   = than.MethodsForObjects.objectAddition(this.style, position);
		
		console.log(this.style);
	}
}