import {BasicElement} from "./BasicElement";

class DefaultView extends BasicElement
{
	public type:  string = "View";
	public class: string = "DefaultView";
	public self:  object = this;
	
	constructor(core: object, child: object, master: object)
	{
		super(core, child, master);
	}
}