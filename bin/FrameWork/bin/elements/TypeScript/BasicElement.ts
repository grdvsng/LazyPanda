export class BasicElement
{
	master:     object;
	domElement: object;
	htmlClass:  string;
	items:      object;

	constructor(core: object, child: object, master: object)
	{
		this.master    = master;
		this.htmlClass = (child['htmlClass'] === undefined) ? "div":child['htmlClass'];
	}
}