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
 *  ID: $Id: HeaderView.js 1222 2012-01-20 10:49:05Z daniel $
 */
Ext.define('de.edirom.online.view.window.HeaderView', {
    extend: 'Ext.panel.Panel',

    requires: [
    ],

    alias : 'widget.headerView',

    layout: 'fit',

    initComponent: function () {

        var me = this;

        me.html = '<div id="' + me.id + '_headerCont" class="headerViewContent"></div>';

        me.callParent();
    },

    setContent: function(data) {
        var me = this;
        var contEl = me.el.getById(me.id + '_headerCont');
        contEl.update(data);
    }
});

