/// <reference path="API.ts" />

namespace sxml
{
	export class XML extends std.HashMap<string, XMLList>
	{
		/**
		 * @hidden
		 */
		private tag_: string;

		/**
		 * @hidden
		 */
		private value_: string;

		/**
		 * @hidden
		 */
		private property_map_: std.HashMap<string, string>;

		/* =============================================================
			CONSTRUCTORS
				- BASIC CONSTRUCTORS
				- PARSERS
		================================================================
			BASIC CONSTRUCTORS
		------------------------------------------------------------- */
		public constructor();
		public constructor(str: string);

		public constructor(str: string = "")
		{
			super();

			this.property_map_ = new std.HashMap<string, string>();
			this.value_ = "";

			if (str.indexOf("<") == -1)
				return;

			let start: number;
			let end: number;

			//ERASE HEADER OF XML
			if ((start = str.indexOf("<?xml")) != -1) 
			{
				end = str.indexOf("?>", start);

				if (end != -1)
					str = str.substr(end + 2);
			}

			//ERASE COMMENTS
			while ((start = str.indexOf("<!--")) != -1) 
			{
				end = str.indexOf("-->", start);
				if (end == -1)
					break;

				str = str.substr(0, start) + str.substr(end + 3);
			}

			//BEGIN PARSING
			this._Parse(str);
		}

		/* -------------------------------------------------------------
			PARSERS
		------------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private _Parse(str: string): void
		{
			this._Parse_tag(str);
			this._Parse_properties(str);

			let res = this._Parse_value(str);
			if (res.second == true)
				this._Parse_children(res.first);
		}

		/**
		 * @hidden
		 */
		private _Parse_tag(str: string): void
		{
			let start: number = str.indexOf("<") + 1;
			let end: number =
				XML._Compute_min_index
				(
					str.indexOf(" ", start),
					str.indexOf("\r\n", start),
					str.indexOf("\n", start),
					str.indexOf("\t", start),
					str.indexOf(">", start),
					str.indexOf("/", start)
				);
			if (start == 0 || end == -1)
				return;

			this.tag_ = str.substring(start, end);
		}

		/**
		 * @hidden
		 */
		private _Parse_properties(str: string): void
		{
			let start: number = str.indexOf("<" + this.tag_) + this.tag_.length + 1;
			let end: number = XML._Compute_min_index(str.lastIndexOf("/"), str.indexOf(">", start));

			if (start == -1 || end == -1 || start >= end)
				return;

			//<comp label='ABCD' /> : " label='ABCD' "
			let line: string = str.substring(start, end);
			if (line.indexOf("=") == -1)
				return;

			let label: string;
			let value: string;
			let helpers: _IXMLQuote[] = [];

			let inQuote: boolean = false;
			let quoteType: number;
			let equal: number;

			//INDEXING
			for (let i: number = 0; i < line.length; i++) 
			{
				//Start of quote
				if (inQuote == false && (line.charAt(i) == "'" || line.charAt(i) == "\"")) 
				{
					inQuote = true;
					start = i;

					if (line.charAt(i) == "'")
						quoteType = 1;
					else if (line.charAt(i) == "\"")
						quoteType = 2;
				}
				else if
					(
					inQuote == true &&
					(
						(quoteType == 1 && line.charAt(i) == "'") ||
						(quoteType == 2 && line.charAt(i) == "\"")
					)
				) 
				{
					helpers.push({ type: quoteType, start: start, end: i });
					inQuote = false;
				}
			}

			//CONSTRUCTING
			for (let i: number = 0; i < helpers.length; i++) 
			{
				let quote = helpers[i];

				if (i == 0) 
				{
					equal = line.indexOf("=");
					label = line.substring(0, equal).trim();
				}
				else 
				{
					equal = line.indexOf("=", helpers[i - 1].end + 1);
					label = line.substring(helpers[i - 1].end + 1, equal).trim();
				}
				value = line.substring(helpers[i].start + 1, helpers[i].end);

				this.setProperty(label, XML._Decode_property(value));
			}
		}

		/**
		 * @hidden
		 */
		private _Parse_value(str: string): std.Pair<string, boolean>
		{
			let end_slash: number = str.lastIndexOf("/");
			let end_block: number = str.indexOf(">");

			if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) 
			{
				//STATEMENT1: <TAG />
				//STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
				this.value_ = "";

				return new std.Pair<string, boolean>(str, false);
			}

			let start: number = end_block + 1;
			let end: number = str.lastIndexOf("<");
			str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG

			if (str.indexOf("<") == -1)
				this.value_ = XML._Decode_value(str.trim());
			else
				this.value_ = "";

			return new std.Pair<string, boolean>(str, true);
		}

		/**
		 * @hidden
		 */
		private _Parse_children(str: string): void
		{
			if (str.indexOf("<") == -1)
				return;

			let start: number = str.indexOf("<");
			let end: number = str.lastIndexOf(">") + 1;
			str = str.substring(start, end);

			let blockStart: number = 0;
			let blockEnd: number = 0;
			start = 0;

			for (let i: number = 0; i < str.length; i++) 
			{
				if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
					blockStart++;
				else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
					blockEnd++;

				if (blockStart >= 1 && blockStart == blockEnd) 
				{
					end = str.indexOf(">", i);

					let xmlList: XMLList;
					let xml: XML = new XML();
					xml._Parse(str.substring(start, end + 1));

					if (this.has(xml.tag_) == true)
						xmlList = this.get(xml.tag_);
					else 
					{
						xmlList = new XMLList();
						this.set(xml.tag_, xmlList);
					}
					xmlList.push(xml);

					i = end;
					start = end + 1;
					blockStart = 0;
					blockEnd = 0;
				}
			}
		}

		/* =============================================================
			ACCESSORS
				- GETTERS
				- SETTERS
				- ELEMENTS I/O
		================================================================
			GETTERS
		------------------------------------------------------------- */
		public getTag(): string
		{
			return this.tag_;
		}
		public getValue(): string
		{
			return this.value_;
		}

		public findProperty(key: string): std.HashMap.Iterator<string, string>
		{
			return this.property_map_.find(key);
		}
		public hasProperty(key: string): boolean
		{
			return this.property_map_.has(key);
		}
		public getProperty(key: string): string
		{
			return this.property_map_.get(key);
		}

		public getPropertyMap(): std.HashMap<string, string>
		{
			return this.property_map_;
		}

		/* -------------------------------------------------------------
			SETTERS
		------------------------------------------------------------- */
		public setTag(val: string): void
		{
			this.tag_ = val;
		}
		public setValue(val: string): void
		{
			this.value_ = val;
		}
		public insertValue(tag: string, value: string): XML
		{
			let xml = new XML();
			xml.setTag(tag);
			xml.setValue(value);

			this.push(xml);
			return xml;
		}

		public setProperty(key: string, value: string): void
		{
			this.property_map_.set(key, value);
		}
		public eraseProperty(key: string): void
		{
			let it = this.property_map_.find(key);
			if (it.equals(this.property_map_.end()) == true)
				throw Error("out of range");

			this.property_map_.erase(it);
		}

		/* -------------------------------------------------------------
			ELEMENTS I/O
		------------------------------------------------------------- */
		public push(...args: std.Pair<string, XMLList>[]): number;
		public push(...args: [string, XMLList][]): number;
		public push(...xmls: XML[]): number;
		public push(...xmlLists: XMLList[]): number;

		public push(...items: any[]): number
		{
			for (let i: number = 0; i < items.length; i++)
			{
				if (items[i] instanceof XML)
				{
					let xml: XML = items[i];

					if (this.has(xml.tag_) == true)
						this.get(xml.tag_).push(xml);
					else 
					{
						let xmlList: XMLList = new XMLList();
						xmlList.push(xml);

						this.set(xml.tag_, xmlList);
					}
				}
				else if (items[i] instanceof XMLList)
				{
					let xmlList: XMLList = items[i];

					if (xmlList.empty() == true)
						continue;

					if (this.has(xmlList.getTag()) == true)
					{
						let myXMLList: XMLList = this.get(xmlList.getTag());

						myXMLList.insert(myXMLList.end(), xmlList.begin(), xmlList.end());
					}
					else
						this.set(xmlList.getTag(), xmlList);
				}
				else
					super.push(items[i]);
			}

			return this.size();
		}

		/* -------------------------------------------------------------
			STRING UTILS
		------------------------------------------------------------- */
		public toString(tab: number = 0): string
		{
			let str: string = XML._Repeat("\t", tab) + "<" + this.tag_;
			let children_str: string = "";

			//PROPERTIES
			for (let p_it = this.property_map_.begin(); p_it.equals(this.property_map_.end()) == false; p_it = p_it.next())
				str += " " + p_it.first + "=\"" + XML._Encode_property(p_it.second) + "\"";

			if (this.size() == 0) 
			{
				// VALUE
				if (this.value_ != "")
					str += ">" + XML._Encode_value(this.value_) + "</" + this.tag_ + ">";
				else
					str += " />";
			}
			else 
			{
				// CHILDREN
				str += ">\n";

				for (let x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
					str += x_it.second.toString(tab + 1);

				str += XML._Repeat("\t", tab) + "</" + this.tag_ + ">";
			}
			return str;
		}

		/**
		 * @hidden
		 */
		private static _Compute_min_index(...args: number[]): number 
		{
			let min: number = args[0];

			for (let i: number = 1; i < args.length; i++)
			{
				if (args[i] == -1)
					continue;

				if (min == -1 || args[i] < min)
					min = args[i];
			}
			return min;
		}

		/**
		 * @hidden
		 */
		private static _Encode_value(str: string): string 
		{
			for (let p of XML.VALUE_CODES)
				str = str.split(p.first).join(p.second);
			return str;
		}

		/**
		 * @hidden
		 */
		private static _Encode_property(str: string): string 
		{
			for (let p of XML.PROPERTY_CODES)
				str = str.split(p.first).join(p.second);
			return str;
		}

		/**
		 * @hidden
		 */
		private static _Decode_value(str: string): string 
		{
			for (let p of XML.VALUE_CODES)
				str = str.split(p.second).join(p.first);
			return str;
		}

		/**
		 * @hidden
		 */
		private static _Decode_property(str: string): string 
		{
			for (let p of XML.PROPERTY_CODES)
				str = str.split(p.second).join(p.first);
			return str;
		}

		/**
		 * @hidden
		 */
		private static _Repeat(str: string, n: number): string
		{
			let ret: string = "";
			for (let i: number = 0; i < n; ++i)
				ret += str;

			return ret;
		}

		/**
		 * @hidden
		 */
		private static VALUE_CODES: std.Pair<string, string>[] =
			[
				std.make_pair("&", "&amp;"),
				std.make_pair("<", "&lt;"),
				std.make_pair(">", "&gt;")
			];

		/**
		 * @hidden
		 */
		private static PROPERTY_CODES: std.Pair<string, string>[] =
			[
				...XML.VALUE_CODES,
				std.make_pair("\"", "&quot;"),
				std.make_pair("'", "&apos;"),
				std.make_pair("\t", "&#x9;"),
				std.make_pair("\n", "&#xA;"),
				std.make_pair("\r", "&#xD;")
			];
	}

	interface _IXMLQuote
	{
		type: number;
		start: number;
		end: number;
	}
}
