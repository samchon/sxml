# Simple XML
[![npm version](https://badge.fury.io/js/sxml.svg)](https://www.npmjs.com/package/sxml)
[![Downloads](https://img.shields.io/npm/dm/sxml.svg)](https://www.npmjs.com/package/sxml)
[![DeepScan Grade](https://deepscan.io/api/projects/1799/branches/7793/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1799&bid=7793)
[![Chat on Gitter](https://badges.gitter.im/samchon/sxml.svg)](https://gitter.im/samchon/sxml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

It's the most simple, concise and eledic library for XML. Just remember that structure, then you'll understand how to use it. If you want to know more about the detailed features, then utilize <u>auto-completion</u> of TypeScript or read the [Guide Documents](https://github.com/samchon/sxml/wiki).

```typescript
declare module "sxml"
{
    export class XML extends std.HashMap<string, XMLList>
    {
        private tag_: string;
        private value_: string;
        private properties_: std.HashMap<string, string>;
    }
    export class XMLList extends std.Vector<XML>;
}
```



## Installation
### NPM Module
Installing **SXML** in *NodeJS* is very easy. Just install with the `npm`

```bash
# Install SXML from the NPM module
npm install --save sxml
```

### Usage
It's very easy. Access to XML objects considering principle structure of SXML.

```typescript
import sxml = require("sxml");

import XML = sxml.XML;
import XMLList = sxml.XMLList;

function main(str: string): void
{
    // CREATE AN XML OBJECT BY PARSING CHARACTERS
    let xml: XML = new XML(str);

    //----
    // LIST OF PARAMETER OBJECTS
    //----
    // XML => std.HashMap<string, XMLList>
    // XMLList => std.Vector<XML>
    let xmlList: XMLList = xml.get("parameter");

    console.log("#" + xmlList.size()); // #3
    
    // PROPERTIES & VALUE OF 1ST PARAMETER
    console.log
    (
        xmlList.at(0).getProperty("name"), // "application"
        xmlList.at(0).getProperty("type"),  // "string"
        xmlList.at(0).getValue() // "simulation"
    );

    // PROPERTIES & VALUE OF 2ND PARAMETER
    console.log
    (
        xmlList.at(1).getProperty("name"), // "sequence"
        xmlList.at(1).getProperty("type"), // "number"
        xmlList.at(1).getValue() // "3"
    );

    //----
    // ACCESS TO CHILDREN XML OBJECTS
    //----
    let members: XMLList = xml.get("parameter").at(2)
        .get("memberList").at(0)
        .get("member");

    // PRINT PROPERTIES
    console.log
    (
        members.at(0).getProperty("id"), // "samchon"
        members.at(1).getProperty("email"), // "github@github.com"
        members.at(4).getProperty("name") // "Alphago
    );
}

main
(
	"<invoke listener='setMemberList'>\n" +
        "    <parameter name='application' type='string'>simulation</parameter>\n" +
        "    <parameter name='sequence' type='number'>3</parameter>\n" +
        "    <parameter type='XML'>\n" +
        "        <memberList>\n" +
        "            <member id='samchon' name='Jeongho Nam' email='samchon@samchon.org' />\n" +
        "            <member id='github' name='GitHub' email='github@github.com' />\n" +
        "            <member id='old_man' name='Old Kim' email='old_man@hanmail.net' />\n" +
        "            <member id='john' name='John Doe' email='conman@gmail.com' />\n" +
        "            <member id='robot' name='Alphago' />\n" +
        "        </memberList>\n" +
        "    </parameter>\n" +
    "</invoke>"
);
```



## References
  - **Repositories**
    - [GitHub Repository](https://github.com/samchon/sxml)
    - [NPM Repository](https://www.npmjs.com/package/sxml)
  - **Documents**
    - [**Guide Documents**](https://github.com/samchon/sxml/wiki)
    - [API Documents](http://samchon.github.io/sxml/api)
  - **Related Projects**
    - [TSTL](https://github.com/samchon/tstl)
    - [Samchon Framework](https://github.com/samchon/framework)