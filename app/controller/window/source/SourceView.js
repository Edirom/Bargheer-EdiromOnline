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
 *  ID: $Id: SourceView.js 1273 2012-03-09 16:27:21Z daniel $
 */
Ext.define('de.edirom.online.controller.window.source.SourceView', {

    extend: 'Ext.app.Controller',

    views: [
        'window.source.SourceView'
    ],

    init: function() {
        this.control({
            'sourceView': {
                afterlayout: this.onSourceViewRendered,
                single: true
            }
        });
    },

    onSourceViewRendered: function(view) {
        var me = this;

        if(view.initialized) return;
        view.initialized = true;

        view.on('measureVisibilityChange', me.onMeasureVisibilityChange, me);
        view.on('annotationsVisibilityChange', me.onAnnotationsVisibilityChange, me);
        view.on('overlayVisiblityChange', me.onOverlayVisibilityChange, me);
        view.on('gotoMovement', me.onGotoMovement, me);
        view.on('gotoMeasureByName', me.onGotoMeasureByName, me);
        view.on('gotoMeasure', me.onGotoMeasure, me);
        view.on('gotoZone', me.onGotoZone, me);

        Ext.Ajax.request({
            url: 'data/xql/getPages.xql',
            method: 'GET',
            params: {
                uri: view.uri
            },
            success: function(response){
                var data = response.responseText;

                var pages = Ext.create('Ext.data.Store', {
                    fields: ['id', 'name', 'path', 'width', 'height', 'measures', 'annotations'],
                    data: Ext.JSON.decode(data)
                });

                me.pagesLoaded(pages, view);
            }
        });

        Ext.Ajax.request({
            url: 'data/xql/getMovements.xql',
            method: 'GET',
            params: {
                uri: view.uri
            },
            success: function(response){
                var data = response.responseText;

                var movements = Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data: Ext.JSON.decode(data)
                });

                me.movementsLoaded(movements, view);
            }
        });

        Ext.Ajax.request({
            url: 'data/xql/getAnnotationInfos.xql',
            method: 'GET',
            params: {
                uri: view.uri
            },
            success: function(response){
                var data = response.responseText;
                data = Ext.JSON.decode(data);

                var priorities = Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data: data['priorities']
                });
                var categories = Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data: data['categories']
                });

                me.annotInfosLoaded(priorities, categories, view);
            }
        });

        Ext.Ajax.request({
            url: 'data/xql/getOverlays.xql',
            method: 'GET',
            params: {
                uri: view.uri
            },
            success: function(response){
                var data = response.responseText;

                var overlays = Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data: Ext.JSON.decode(data)
                });

                me.overlaysLoaded(overlays, view);
            }
        });
    },

    pagesLoaded: function(pages, view) {
        view.setImageSet(pages);
    },

    movementsLoaded: function(movements, view) {
        view.setMovements(movements);
    },

    annotInfosLoaded: function(priorities, categories, view) {
        view.setAnnotationFilter(priorities, categories);
    },

    overlaysLoaded: function(overlays, view) {
        view.setOverlays(overlays);
    },

    onGotoMovement: function(view, movementId) {
        var me = this;

        Ext.Ajax.request({
            url: 'data/xql/getMovementsFirstPage.xql',
            method: 'GET',
            params: {
                uri: view.uri,
                movementId: movementId
            },
            success: function(response){
                var data = response.responseText;
                me.gotoMovement(Ext.String.trim(data), view);
            }
        });
    },

    gotoMovement: function(pageId, view) {
        if(pageId != '')
            view.showPage(pageId);
    },

    onMeasureVisibilityChange: function(view, visible) {
        var me = this;

        if(visible) {

            var pageId = view.getActivePage().get('id');
            me.fetchMeasures(view.uri, pageId, Ext.bind(me.measuresLoaded, me, [view, pageId], true));

        }else {
            view.hideMeasures();
        }
    },

    fetchMeasures: function(uri, pageId, fn) {
        Ext.Ajax.request({
            url: 'data/xql/getMeasuresOnPage.xql',
            method: 'GET',
            params: {
                uri: uri,
                pageId: pageId
            },
            success: function(response){
                var data = response.responseText;

                var measures = Ext.create('Ext.data.Store', {
                    fields: ['zoneId', 'ulx', 'uly', 'lrx', 'lry', 'id', 'name', 'type', 'rest'],
                    data: Ext.JSON.decode(data)
                });

                if(typeof fn == 'function')
                    fn(measures);
            }
        });
    },

    measuresLoaded: function(measures, view, pageId) {

        if(pageId != view.getActivePage().get('id')) return;

        view.showMeasures(measures);
    },

    onAnnotationsVisibilityChange: function(view, visible) {
        var me = this;

        if(visible) {
            var pageId = view.getActivePage().get('id');

            Ext.Ajax.request({
                url: 'data/xql/getAnnotationsOnPage.xql',
                method: 'GET',
                params: {
                    uri: view.uri,
                    pageId: pageId
                },
                success: function(response){
                    var data = response.responseText;

                    var annotations = Ext.create('Ext.data.Store', {
                        fields: ['id', 'title', 'text', 'uri', 'plist', 'svgList', 'priority', 'categories', 'fn'],
                        data: Ext.JSON.decode(data)
                    });

                    me.annotationsLoaded(annotations, view, pageId);
                }
            });

        }else {
            view.hideAnnotations();
        }
    },

    annotationsLoaded: function(annotations, view, pageId) {

        if(pageId != view.getActivePage().get('id')) return;

        view.showAnnotations(annotations);
    },

    onOverlayVisibilityChange: function(view, overlayId, visible) {
        var me = this;

        if(visible) {

            var pageId = view.getActivePage().get('id');

            Ext.Ajax.request({
                url: 'data/xql/getOverlayOnPage.xql',
                method: 'GET',
                params: {
                    uri: view.uri,
                    pageId: pageId,
                    overlayId: overlayId
                },
                success: function(response){
                    var data = response.responseText;

                    if(data.trim() == '') return;

                    me.overlayLoaded(view, pageId, overlayId, data);
                }
            });

        }else {
            view.hideOverlay(overlayId);
        }
    },

    overlayLoaded: function(view, pageId, overlayId, overlay) {

        if(pageId != view.getActivePage().get('id')) return;

        view.showOverlay(overlayId, overlay);
    },

    onGotoMeasureByName: function(view, measure, movementId) {
        var me = this;

        Ext.Ajax.request({
            url: 'data/xql/getMeasurePage.xql',
            method: 'GET',
            params: {
                id: view.uri,
                measure: measure,
                movementId: movementId
            },
            success: Ext.bind(function(response){
                var data = response.responseText;
                this.gotoMeasure(Ext.JSON.decode(data), view);
            }, me)
        });
    },

    onGotoMeasure: function(view, measureId) {

        var me = this;

        Ext.Ajax.request({
            url: 'data/xql/getMeasurePage.xql',
            method: 'GET',
            params: {
                id: view.uri,
                measure: measureId
            },
            success: Ext.bind(function(response){
                var data = response.responseText;
                this.gotoMeasure(Ext.JSON.decode(data), view);
            }, me)
        });
    },

    gotoMeasure: function(result, view) {
        var me = this;

        var measureId = result.measureId;
        var pageId = result.pageId;

        if(measureId != '' && pageId != '') {
            if(view.imageSet == null) {
                view.on('afterImagesLoaded', Ext.bind(me.fetchMeasures, me, [view.uri, pageId, Ext.bind(me.gotoMeasureLoaded, me, [view, measureId], true)], false), view, [{single:true}]);
                view.showPage(pageId);
            
            }else {
                if(typeof view.getActivePage() == 'undefined' || view.getActivePage().get('id') != pageId)
                    view.showPage(pageId);
                
                me.fetchMeasures(view.uri, pageId, Ext.bind(me.gotoMeasureLoaded, me, [view, measureId], true));
            }
        }
    },

    gotoMeasureLoaded: function(measures, view, measureId) {
        view.showMeasure(measures.getById(measureId));
    },

    onGotoZone: function(view, zoneId) {

        var me = this;

        Ext.Ajax.request({
            url: 'data/xql/getZone.xql',
            method: 'GET',
            params: {
                uri: view.uri,
                zoneId: zoneId
            },
            success: Ext.bind(function(response){
                var data = response.responseText;
                this.gotoZone(Ext.JSON.decode(data), view);
            }, me)
        });
    },

    gotoZone: function(result, view) {
        var me = this;

        var zoneId = result.zoneId;
        var pageId = result.pageId;

        if(zoneId != '' && pageId != '') {
            
            if(view.imageSet == null) {
                view.on('afterImagesLoaded', Ext.bind(view.showZone, view, [result], false), view, [{single:true}]);
                view.showPage(pageId);
            
            }else if(typeof view.getActivePage() == 'undefined' || view.getActivePage().get('id') != pageId) {
                view.showPage(pageId);
                view.showZone(result);
                
            }else {
                view.showZone(result);
            }
        }
    }
});
