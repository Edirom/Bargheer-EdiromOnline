xquery version "1.0";
(:
  Edirom Online
  Copyright (C) 2011 The Edirom Project
  http://www.edirom.de

  Edirom Online is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Edirom Online is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Foobar.  If not, see <http://www.gnu.org/licenses/>.

  ID: $Id: getReducedDocument.xql 1328 2012-05-16 14:59:35Z daniel $
:)

declare namespace request="http://exist-db.org/xquery/request";

import module namespace config = "http://exist-db.org/xquery/apps/config" at "../../modules/config.xqm";

declare option exist:serialize "method=xhtml media-type=text/html omit-xml-declaration=yes indent=yes";
(:declare option exist:serialize "method=text media-type=text/plain omit-xml-declaration=yes";:)

let $uri := request:get-parameter('uri', '')
let $selectionId := request:get-parameter('selectionId', '')
let $subtreeRoot := request:get-parameter('subtreeRoot', '')
let $idPrefix := request:get-parameter('idPrefix', '')

let $base := concat('file:', system:get-module-load-path())

let $doc := doc($uri)/root()
let $xsl := '../xslt/reduceToSelection.xsl'
let $doc := transform:transform($doc, $xsl, <parameters><param name="selectionId" value="{$selectionId}"/><param name="subtreeRoot" value="{$subtreeRoot}"/></parameters>)
let $doc := $doc/root()

let $xslInstruction := $doc//processing-instruction(xml-stylesheet)
let $xslInstruction := for $i in util:serialize($xslInstruction, ())
                        return
                        if(matches($i, 'type="text/xsl"'))
                        then(substring-before(substring-after($i, 'href="'), '"'))
                        else()


let $xsl := if($xslInstruction)then(doc($xslInstruction))else('../xslt/teiBody2HTML.xsl')
return
    transform:transform($doc/root(), $xsl, <parameters><param name="base" value="{concat($base, '/../xslt/')}"/><param name="idPrefix" value="{$idPrefix}"/><param name="graphicsPrefix" value="{$config:img-scaler-base}"/></parameters>)
