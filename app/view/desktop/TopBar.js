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
 *  ID: $Id: TopBar.js 1455 2012-10-11 10:42:55Z daniel $
 */
Ext.define('de.edirom.online.view.desktop.TopBar', {
    extend: 'Ext.toolbar.Toolbar',

    requires: [
        'Ext.button.Split'
    ],

    alias : 'widget.topbar',
	id : 'ediromToolbar',
	
    initComponent: function () {

        var me = this;

        me.homeButton = Ext.create('Ext.button.Button', {
            id: 'homeBtn',
            cls: 'taskSquareButton home',
            tooltip: { text: getLangString('view.desktop.TaskBar_home'), align: 'bl-tl' }//,
            //handler: Ext.bind(me.fireEvent, me, ['openConcordanceNavigator'], false)
        });

        me.workCombo = Ext.create('Ext.button.Button', {
            text: 'Werk',
            id: 'workSwitch',
            cls: 'insetButton',
            indent: false,
            menu : {
                items: []
            }
        });

        me.searchButton = Ext.create('Ext.button.Button', {
            id: 'searchBtn',
            cls: 'taskSquareButton search',
            tooltip: { text: getLangString('view.desktop.TaskBar_search'), align: 'bl-tl' }//,
            //handler: Ext.bind(me.fireEvent, me, ['openConcordanceNavigator'], false)
        });


        me.items = [
            new Ext.toolbar.Toolbar({
                flex: 1,
                cls: 'ux-desktop-topbar-flex',
                items: [
                    me.homeButton,
                    this.workCombo,
                    '->',
                    {
                        xtype: 'textfield',
                        width: 180
                    },
                    me.searchButton
                ]
            })
        ];

        me.callParent();
    }
});