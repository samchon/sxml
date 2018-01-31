import std = require("tstl");
import sxml = require("./sxml");

function main(): void
{
	let str: string = 
        "<invoke listener='setMemberList'>\n" +
        "    <parameter name='application' type='string'>simulation</parameter>\n" +
        "    <parameter name='sequence' type='number'>3</parameter>\n" +
        "    <parameter type='XML'>\n" +
        "        <memberList>\n" +
        "            <member id='samchon' name='Jeongho Nam' mail='samchon@samchon.org' />\n" +
        "            <member id='github' name='GitHub' mail='github@github.com' />\n" +
        "            <member id='old_man' name='Old Kim' mail='old_man@hanmail.net' />\n" +
        "            <member id='john' name='John Doe' mail='conman@gmail.com' />\n" +
        "            <member id='robot' name='Alphago' />\n" +
        "        </memberList>\n" +
        "    </parameter>\n" +
		"</invoke>";
	let xml1: sxml.XML = new sxml.XML(str);
	let xml2: sxml.XML = new sxml.XML(xml1.toString());

	if (xml1.toString() != xml2.toString())
		throw new std.DomainError("Error on XML Parser.");
}
main();