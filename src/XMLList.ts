import * as std from "tstl";

import {XML} from "./XML";

export class XMLList extends std.Vector<XML>
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

export namespace XMLList 
{
	export type Iterator = std.Vector.Iterator<XML>;
	export type ReverseIterator = std.Vector.ReverseIterator<XML>;

	export type iterator = Iterator;
	export type reverse_iterator = ReverseIterator;
}
