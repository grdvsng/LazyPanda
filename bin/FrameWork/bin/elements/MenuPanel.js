var MenuPanel = function(master)
{
	var self = this,
		than = master;
	
	this.domElement     = null;
	this.domElementType = "div";

	this.type           = "inner";

	this.params = {
		backgroundColor: "red",
		position:        "relative",
		heigth:          "10%",
		width:           "90%",
		border:          "1px solid black"
	}
}