var MethodsForObjects = function(core)
{
	var self = this,
		than = core;

	this.objectAddition = function(mainObject, addObject, appended)
	{
		var currentObject = (mainObject !== undefined) ? mainObject:{},
			addObject     = (addObject  !== undefined) ? addObject:{};

		for (var att in addObject)
		{
			currentObject[att] = addObject[att];
		}

		if (appended === undefined) 
		{
			currentObject = this.objectAddition(addObject, currentObject, true);
		}
		
		return currentObject;
	}

	this.isInObject = function(obj, key, ifTrue)
	{
		var result;

		for (var att in obj)
		{
			if (att === key)
			{
				if (ifTrue !== undefined) result = ifTrue;
				if (ifTrue === undefined) result = true;
				
				break;
			}
		}

		return result;
	}
}