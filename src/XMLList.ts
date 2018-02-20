import std = require("tstl");

import XML = require("./XML");

class XMLList extends std.Vector<XML>
{
	public getTag(): string
	{
		return this.front().getTag();
	}
	
	public toString(level: number = 0): string
	{
		let ret: string = "";
		for (let xml of this)
			ret += xml.toString(level) + "\n";
		
		return ret;
	}
}

/**
 * @hidden
 */
namespace XMLList 
{
	export type Iterator = std.Vector.Iterator<XML>;
	export type ReverseIterator = std.Vector.ReverseIterator<XML>;

	export type iterator = Iterator;
	export type reverse_iterator = ReverseIterator;
}

export = XMLList;