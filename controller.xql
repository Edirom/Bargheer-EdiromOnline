xquery version "1.0";

import module namespace config="http://exist-db.org/xquery/apps/config" at "modules/config.xqm";

declare variable $exist:path external;
declare variable $exist:resource external;

if ($exist:path eq "/") then
    (: forward root path to index.xql :)
    <dispatch xmlns="http://exist.sourceforge.net/NS/exist">
        <forward url="index.html"/>
    </dispatch>
else if ($exist:resource eq "app.js") then
    <dispatch xmlns="http://exist.sourceforge.net/NS/exist">
        <forward url="app.xql"/>
    </dispatch>
else if (contains($exist:path, '$bargheer-edition$')) then
    <dispatch xmlns="http://exist.sourceforge.net/NS/exist">
        <forward url="{replace($exist:path, '.*\$bargheer\-edition\$', substring-after($config:bargheer-edition-root, '/apps'))}"/>
    </dispatch>
(:else if (starts-with($exist:path, "/data")) then
    <dispatch xmlns="http://exist.sourceforge.net/NS/exist">
        <!--<redirect url="/exist/restxq{$exist:path}"/>-->
        <forward servlet="RestXqServlet"/>
    </dispatch>:)
else
    (: everything else is passed through :)
    <dispatch xmlns="http://exist.sourceforge.net/NS/exist">
        <cache-control cache="yes"/>
    </dispatch>