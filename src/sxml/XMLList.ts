/// <reference path="API.ts" />

namespace sxml
{
    export class XMLList extends std.Vector<XML>
	{
		public getTag(): string
		{
			return this.front().getTag();
		}
		
		public toString(level: number = 0): string
		{
			let str: string = "";
			
			for (let i: number = 0; i < this.size(); i++)
				str += this.at(i).toString(level) + "\n";

			return str;
		}
	}
}