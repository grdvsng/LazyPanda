var MethodsForObjects = function(core)
{
	var self = this,
		than = core;

	this.objectAddition(mainObject, addObject)
	{
		var currentObject = mainObject;

		for (var att in addObject)
		{
			currentObject[att] = addObject[att];
		}

		return currentObject;
	}
}