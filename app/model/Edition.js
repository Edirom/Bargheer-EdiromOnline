/**
 *  Edirom Online
 *  Copyright (C) 2011 The Edirom Project
 *  http://www.edirom.de
 *
 *  Edirom Online is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Edirom Online is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Edirom Online.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  ID: $Id: Edition.js 1219 2012-01-20 08:33:28Z daniel $
 */
Ext.define('de.edirom.online.model.Edition', {

    requires: [],

    extend: 'Ext.data.Model',
    fields: ['id', 'doc', 'name'],

    proxy: {
        type: 'ajax',
        url: 'data/xql/getEdition.xql'
    },

    /**
     * Concordances
     */
    concordances: null,

    getConcordances: function(fn, args) {

        var me = this;

        if(me.concordances == null)
            me.concordances = new Ext.util.MixedCollection();

        if(!me.concordances.containsKey(args.workId))
            me.fetchConcordances(args.workId, fn);
        else
            fn(me.concordances.get(args.workId));
    },

    fetchConcordances: function(workId, fn) {

        var me = this;

        Ext.Ajax.request({
            url: 'data/xql/getConcordances.xql',
            method: 'GET',
            params: {
                id: me.get('doc'),
                workId: workId
            },
            success: function(response){
                var data = response.responseText;

                me.concordances.add(workId, Ext.create('Ext.data.Store', {
                    fields: ['name', 'groups', 'connections'],
                    data: Ext.JSON.decode(data)
                }));

                fn(me.concordances.get(workId));
            }
        });
    }
});
