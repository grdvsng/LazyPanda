var MenuButton = function(master)
{
	var self = this,
		than = master;

	this.domElement     = null;
	this.domElementType = "div";
	
	this.type       = "innerElement";
	
	this.style = {
		backgroundColor: "inherit",
		position:        "relative",
		heigth:          "90%",
		width:           "20%",
		border:          "inherit",
		borderRadius:    "10px",
		fontSize:        "12pt",
		fontColor:       "white"
	}

	this.setText = function(data)
	{
		self.domElement.innerText = data;
	}
}