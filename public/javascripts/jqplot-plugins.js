/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    // Class: $.jqplot.BezierCurveRenderer.js
    // Renderer which draws lines as stacked bezier curves.
    // Data for the line will not be specified as an array of
    // [x, y] data point values, but as a an array of [start piont, bezier curve]
    // So, the line is specified as: [[xstart, ystart], [cp1x, cp1y, cp2x, cp2y, xend, yend]].
    $.jqplot.BezierCurveRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.BezierCurveRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BezierCurveRenderer.prototype.constructor = $.jqplot.BezierCurveRenderer;

    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.BezierCurveRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        // this._plotData should be same as this.data
        var data = this.data;
        this.gridData = [];
        this._prevGridData = [];
        // if seriesIndex = 0, fill to x axis.
        // if seriesIndex > 0, fill to previous series data.
        var idx = this.index;
        if (data.length == 2) {
            if (idx == 0) {
                this.gridData = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[1][2]), yp.call(this._yaxis, data[1][3]),  
                        xp.call(this._xaxis, data[1][4]), yp.call(this._yaxis, data[1][5])],
                    [xp.call(this._xaxis, data[1][4]), yp.call(this._yaxis, this._yaxis.min)],
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, this._yaxis.min)]
                ];
            }
            else {
                var psd = plot.series[idx-1].data;
                this.gridData = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[1][2]), yp.call(this._yaxis, data[1][3]),  
                        xp.call(this._xaxis, data[1][4]), yp.call(this._yaxis, data[1][5])],
                    [xp.call(this._xaxis, psd[1][4]), yp.call(this._yaxis, psd[1][5])],
                    [xp.call(this._xaxis, psd[1][2]), yp.call(this._yaxis, psd[1][3]), 
                        xp.call(this._xaxis, psd[1][0]), yp.call(this._yaxis, psd[1][1]),  
                        xp.call(this._xaxis, psd[0][0]), yp.call(this._yaxis, psd[0][1])]
                ];
            }
        }
        else {
            if (idx == 0) {
                this.gridData = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[2][0]), yp.call(this._yaxis, data[2][1]),  
                        xp.call(this._xaxis, data[3][0]), yp.call(this._yaxis, data[3][1])],
                    [xp.call(this._xaxis, data[3][1]), yp.call(this._yaxis, this._yaxis.min)],
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, this._yaxis.min)]
                ];
            }
            else {
                var psd = plot.series[idx-1].data;
                this.gridData = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[2][0]), yp.call(this._yaxis, data[2][1]),  
                        xp.call(this._xaxis, data[3][0]), yp.call(this._yaxis, data[3][1])],
                    [xp.call(this._xaxis, psd[3][0]), yp.call(this._yaxis, psd[3][1])],
                    [xp.call(this._xaxis, psd[2][0]), yp.call(this._yaxis, psd[2][1]), 
                        xp.call(this._xaxis, psd[1][0]), yp.call(this._yaxis, psd[1][1]),  
                        xp.call(this._xaxis, psd[0][0]), yp.call(this._yaxis, psd[0][1])]
                ];
            }
        }
    };
    
    // Method: makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.BezierCurveRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var pgd = [];
        // if seriesIndex = 0, fill to x axis.
        // if seriesIndex > 0, fill to previous series data.
        var idx = this.index;
        if (data.length == 2) {
            if (idx == 0) {
                gd = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[1][2]), yp.call(this._yaxis, data[1][3]),  
                        xp.call(this._xaxis, data[1][4]), yp.call(this._yaxis, data[1][5])],
                    [xp.call(this._xaxis, data[1][4]), yp.call(this._yaxis, this._yaxis.min)],
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, this._yaxis.min)]
                ];
            }
            else {
                var psd = plot.series[idx-1].data;
                gd = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[1][2]), yp.call(this._yaxis, data[1][3]),  
                        xp.call(this._xaxis, data[1][4]), yp.call(this._yaxis, data[1][5])],
                    [xp.call(this._xaxis, psd[1][4]), yp.call(this._yaxis, psd[1][5])],
                    [xp.call(this._xaxis, psd[1][2]), yp.call(this._yaxis, psd[1][3]), 
                        xp.call(this._xaxis, psd[1][0]), yp.call(this._yaxis, psd[1][1]),  
                        xp.call(this._xaxis, psd[0][0]), yp.call(this._yaxis, psd[0][1])]
                ];
            }
        }
        else {
            if (idx == 0) {
                gd = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[2][0]), yp.call(this._yaxis, data[2][1]),  
                        xp.call(this._xaxis, data[3][0]), yp.call(this._yaxis, data[3][1])],
                    [xp.call(this._xaxis, data[3][1]), yp.call(this._yaxis, this._yaxis.min)],
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, this._yaxis.min)]
                ];
            }
            else {
                var psd = plot.series[idx-1].data;
                gd = [
                    [xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])], 
                    [xp.call(this._xaxis, data[1][0]), yp.call(this._yaxis, data[1][1]), 
                        xp.call(this._xaxis, data[2][0]), yp.call(this._yaxis, data[2][1]),  
                        xp.call(this._xaxis, data[3][0]), yp.call(this._yaxis, data[3][1])],
                    [xp.call(this._xaxis, psd[3][0]), yp.call(this._yaxis, psd[3][1])],
                    [xp.call(this._xaxis, psd[2][0]), yp.call(this._yaxis, psd[2][1]), 
                        xp.call(this._xaxis, psd[1][0]), yp.call(this._yaxis, psd[1][1]),  
                        xp.call(this._xaxis, psd[0][0]), yp.call(this._yaxis, psd[0][1])]
                ];
            }
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.BezierCurveRenderer.prototype.draw = function(ctx, gd, options) {
        var i;
        ctx.save();
        if (gd.length) {
            if (this.showLine) {
                ctx.save();
                var opts = (options != null) ? options : {};
                ctx.fillStyle = opts.fillStyle || this.color;
                ctx.beginPath();
                ctx.moveTo(gd[0][0], gd[0][1]);
                ctx.bezierCurveTo(gd[1][0], gd[1][1], gd[1][2], gd[1][3], gd[1][4], gd[1][5]);
                ctx.lineTo(gd[2][0], gd[2][1]);
                if (gd[3].length == 2) {
                    ctx.lineTo(gd[3][0], gd[3][1]);
                }
                else {
                    ctx.bezierCurveTo(gd[3][0], gd[3][1], gd[3][2], gd[3][3], gd[3][4], gd[3][5]);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.BezierCurveRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, shadows drawn with lines.
    };
    
    $.jqplot.BezierAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.BezierAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.BezierAxisRenderer.prototype.constructor = $.jqplot.BezierAxisRenderer;
        
    
    // Axes on a plot with Bezier Curves
    $.jqplot.BezierAxisRenderer.prototype.init = function(options){
        $.extend(true, this, options);
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s.data;  
            if (d.length == 4) {
                for (var j=0; j<d.length; j++) { 
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        if (d[j][0] < db.min || db.min == null) {
                            db.min = d[j][0];
                        }
                        if (d[j][0] > db.max || db.max == null) {
                            db.max = d[j][0];
                        }
                    }              
                    else {
                        if (d[j][1] < db.min || db.min == null) {
                            db.min = d[j][1];
                        }
                        if (d[j][1] > db.max || db.max == null) {
                            db.max = d[j][1];
                        }
                    }              
                }
            }          
            else {    
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[0][0] < db.min || db.min == null) {
                        db.min = d[0][0];
                    }
                    if (d[0][0] > db.max || db.max == null) {
                        db.max = d[0][0];
                    }
                    for (var j=0; j<5; j+=2) {
                        if (d[1][j] < db.min || db.min == null) {
                            db.min = d[1][j];
                        }
                        if (d[1][j] > db.max || db.max == null) {
                            db.max = d[1][j];
                        }
                    }
                }              
                else {
                    if (d[0][1] < db.min || db.min == null) {
                        db.min = d[0][1];
                    }
                    if (d[0][1] > db.max || db.max == null) {
                        db.max = d[0][1];
                    }
                    for (var j=1; j<6; j+=2) {
                        if (d[1][j] < db.min || db.min == null) {
                            db.min = d[1][j];
                        }
                        if (d[1][j] > db.max || db.max == null) {
                            db.max = d[1][j];
                        }
                    }
                }           
            }
        }
    };
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = $.extend(true, {pad:0}, options.axesDefaults);
        options.seriesDefaults = options.seriesDefaults || {};
        options.legend = $.extend(true, {placement:'outside'}, options.legend);
        // only set these if there is a pie series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.BezierCurveRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.BezierCurveRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.BezierAxisRenderer;
        }
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
})(jQuery);    
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(b){b.jqplot.BezierCurveRenderer=function(){b.jqplot.LineRenderer.call(this)};b.jqplot.BezierCurveRenderer.prototype=new b.jqplot.LineRenderer();b.jqplot.BezierCurveRenderer.prototype.constructor=b.jqplot.BezierCurveRenderer;b.jqplot.BezierCurveRenderer.prototype.setGridData=function(h){var e=this._xaxis.series_u2p;var g=this._yaxis.series_u2p;var f=this.data;this.gridData=[];this._prevGridData=[];var d=this.index;if(f.length==2){if(d==0){this.gridData=[[e.call(this._xaxis,f[0][0]),g.call(this._yaxis,f[0][1])],[e.call(this._xaxis,f[1][0]),g.call(this._yaxis,f[1][1]),e.call(this._xaxis,f[1][2]),g.call(this._yaxis,f[1][3]),e.call(this._xaxis,f[1][4]),g.call(this._yaxis,f[1][5])],[e.call(this._xaxis,f[1][4]),g.call(this._yaxis,this._yaxis.min)],[e.call(this._xaxis,f[0][0]),g.call(this._yaxis,this._yaxis.min)]]}else{var c=h.series[d-1].data;this.gridData=[[e.call(this._xaxis,f[0][0]),g.call(this._yaxis,f[0][1])],[e.call(this._xaxis,f[1][0]),g.call(this._yaxis,f[1][1]),e.call(this._xaxis,f[1][2]),g.call(this._yaxis,f[1][3]),e.call(this._xaxis,f[1][4]),g.call(this._yaxis,f[1][5])],[e.call(this._xaxis,c[1][4]),g.call(this._yaxis,c[1][5])],[e.call(this._xaxis,c[1][2]),g.call(this._yaxis,c[1][3]),e.call(this._xaxis,c[1][0]),g.call(this._yaxis,c[1][1]),e.call(this._xaxis,c[0][0]),g.call(this._yaxis,c[0][1])]]}}else{if(d==0){this.gridData=[[e.call(this._xaxis,f[0][0]),g.call(this._yaxis,f[0][1])],[e.call(this._xaxis,f[1][0]),g.call(this._yaxis,f[1][1]),e.call(this._xaxis,f[2][0]),g.call(this._yaxis,f[2][1]),e.call(this._xaxis,f[3][0]),g.call(this._yaxis,f[3][1])],[e.call(this._xaxis,f[3][1]),g.call(this._yaxis,this._yaxis.min)],[e.call(this._xaxis,f[0][0]),g.call(this._yaxis,this._yaxis.min)]]}else{var c=h.series[d-1].data;this.gridData=[[e.call(this._xaxis,f[0][0]),g.call(this._yaxis,f[0][1])],[e.call(this._xaxis,f[1][0]),g.call(this._yaxis,f[1][1]),e.call(this._xaxis,f[2][0]),g.call(this._yaxis,f[2][1]),e.call(this._xaxis,f[3][0]),g.call(this._yaxis,f[3][1])],[e.call(this._xaxis,c[3][0]),g.call(this._yaxis,c[3][1])],[e.call(this._xaxis,c[2][0]),g.call(this._yaxis,c[2][1]),e.call(this._xaxis,c[1][0]),g.call(this._yaxis,c[1][1]),e.call(this._xaxis,c[0][0]),g.call(this._yaxis,c[0][1])]]}}};b.jqplot.BezierCurveRenderer.prototype.makeGridData=function(g,i){var f=this._xaxis.series_u2p;var h=this._yaxis.series_u2p;var e=[];var j=[];var d=this.index;if(g.length==2){if(d==0){e=[[f.call(this._xaxis,g[0][0]),h.call(this._yaxis,g[0][1])],[f.call(this._xaxis,g[1][0]),h.call(this._yaxis,g[1][1]),f.call(this._xaxis,g[1][2]),h.call(this._yaxis,g[1][3]),f.call(this._xaxis,g[1][4]),h.call(this._yaxis,g[1][5])],[f.call(this._xaxis,g[1][4]),h.call(this._yaxis,this._yaxis.min)],[f.call(this._xaxis,g[0][0]),h.call(this._yaxis,this._yaxis.min)]]}else{var c=i.series[d-1].data;e=[[f.call(this._xaxis,g[0][0]),h.call(this._yaxis,g[0][1])],[f.call(this._xaxis,g[1][0]),h.call(this._yaxis,g[1][1]),f.call(this._xaxis,g[1][2]),h.call(this._yaxis,g[1][3]),f.call(this._xaxis,g[1][4]),h.call(this._yaxis,g[1][5])],[f.call(this._xaxis,c[1][4]),h.call(this._yaxis,c[1][5])],[f.call(this._xaxis,c[1][2]),h.call(this._yaxis,c[1][3]),f.call(this._xaxis,c[1][0]),h.call(this._yaxis,c[1][1]),f.call(this._xaxis,c[0][0]),h.call(this._yaxis,c[0][1])]]}}else{if(d==0){e=[[f.call(this._xaxis,g[0][0]),h.call(this._yaxis,g[0][1])],[f.call(this._xaxis,g[1][0]),h.call(this._yaxis,g[1][1]),f.call(this._xaxis,g[2][0]),h.call(this._yaxis,g[2][1]),f.call(this._xaxis,g[3][0]),h.call(this._yaxis,g[3][1])],[f.call(this._xaxis,g[3][1]),h.call(this._yaxis,this._yaxis.min)],[f.call(this._xaxis,g[0][0]),h.call(this._yaxis,this._yaxis.min)]]}else{var c=i.series[d-1].data;e=[[f.call(this._xaxis,g[0][0]),h.call(this._yaxis,g[0][1])],[f.call(this._xaxis,g[1][0]),h.call(this._yaxis,g[1][1]),f.call(this._xaxis,g[2][0]),h.call(this._yaxis,g[2][1]),f.call(this._xaxis,g[3][0]),h.call(this._yaxis,g[3][1])],[f.call(this._xaxis,c[3][0]),h.call(this._yaxis,c[3][1])],[f.call(this._xaxis,c[2][0]),h.call(this._yaxis,c[2][1]),f.call(this._xaxis,c[1][0]),h.call(this._yaxis,c[1][1]),f.call(this._xaxis,c[0][0]),h.call(this._yaxis,c[0][1])]]}}return e};b.jqplot.BezierCurveRenderer.prototype.draw=function(c,g,d){var e;c.save();if(g.length){if(this.showLine){c.save();var f=(d!=null)?d:{};c.fillStyle=f.fillStyle||this.color;c.beginPath();c.moveTo(g[0][0],g[0][1]);c.bezierCurveTo(g[1][0],g[1][1],g[1][2],g[1][3],g[1][4],g[1][5]);c.lineTo(g[2][0],g[2][1]);if(g[3].length==2){c.lineTo(g[3][0],g[3][1])}else{c.bezierCurveTo(g[3][0],g[3][1],g[3][2],g[3][3],g[3][4],g[3][5])}c.closePath();c.fill();c.restore()}}c.restore()};b.jqplot.BezierCurveRenderer.prototype.drawShadow=function(c,e,d){};b.jqplot.BezierAxisRenderer=function(){b.jqplot.LinearAxisRenderer.call(this)};b.jqplot.BezierAxisRenderer.prototype=new b.jqplot.LinearAxisRenderer();b.jqplot.BezierAxisRenderer.prototype.constructor=b.jqplot.BezierAxisRenderer;b.jqplot.BezierAxisRenderer.prototype.init=function(f){b.extend(true,this,f);var c=this._dataBounds;for(var g=0;g<this._series.length;g++){var h=this._series[g];var k=h.data;if(k.length==4){for(var e=0;e<k.length;e++){if(this.name=="xaxis"||this.name=="x2axis"){if(k[e][0]<c.min||c.min==null){c.min=k[e][0]}if(k[e][0]>c.max||c.max==null){c.max=k[e][0]}}else{if(k[e][1]<c.min||c.min==null){c.min=k[e][1]}if(k[e][1]>c.max||c.max==null){c.max=k[e][1]}}}}else{if(this.name=="xaxis"||this.name=="x2axis"){if(k[0][0]<c.min||c.min==null){c.min=k[0][0]}if(k[0][0]>c.max||c.max==null){c.max=k[0][0]}for(var e=0;e<5;e+=2){if(k[1][e]<c.min||c.min==null){c.min=k[1][e]}if(k[1][e]>c.max||c.max==null){c.max=k[1][e]}}}else{if(k[0][1]<c.min||c.min==null){c.min=k[0][1]}if(k[0][1]>c.max||c.max==null){c.max=k[0][1]}for(var e=1;e<6;e+=2){if(k[1][e]<c.min||c.min==null){c.min=k[1][e]}if(k[1][e]>c.max||c.max==null){c.max=k[1][e]}}}}}};function a(g,f,d){d=d||{};d.axesDefaults=b.extend(true,{pad:0},d.axesDefaults);d.seriesDefaults=d.seriesDefaults||{};d.legend=b.extend(true,{placement:"outside"},d.legend);var c=false;if(d.seriesDefaults.renderer==b.jqplot.BezierCurveRenderer){c=true}else{if(d.series){for(var e=0;e<d.series.length;e++){if(d.series[e].renderer==b.jqplot.BezierCurveRenderer){c=true}}}}if(c){d.axesDefaults.renderer=b.jqplot.BezierAxisRenderer}}b.jqplot.preInitHooks.push(a)})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    
    // Class: $.jqplot.BarRenderer
    // A plugin renderer for jqPlot to draw a bar plot.
    // Draws series as a line.
    
    $.jqplot.BarRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.BarRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BarRenderer.prototype.constructor = $.jqplot.BarRenderer;
    
    // called with scope of series.
    $.jqplot.BarRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: barPadding
        // Number of pixels between adjacent bars at the same axis value.
        this.barPadding = 8;
        // prop: barMargin
        // Number of pixels between groups of bars at adjacent axis values.
        this.barMargin = 10;
        // prop: barDirection
        // 'vertical' = up and down bars, 'horizontal' = side to side bars
        this.barDirection = 'vertical';
        // prop: barWidth
        // Width of the bar in pixels (auto by devaul).  null = calculated automatically.
        this.barWidth = null;
        // prop: shadowOffset
        // offset of the shadow from the slice and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.08;
        // prop: waterfall
        // true to enable waterfall plot.
        this.waterfall = false;
        // prop: groups
        // group bars into this many groups
        this.groups = 1;
        // prop: varyBarColor
        // true to color each bar of a series separately rather than
        // have every bar of a given series the same color.
        // If used for non-stacked multiple series bar plots, user should
        // specify a separate 'seriesColors' array for each series.
        // Otherwise, each series will set their bars to the same color array.
        // This option has no Effect for stacked bar charts and is disabled.
        this.varyBarColor = false;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a bar.
        this.highlightColors = [];
        // prop: transposedData
        // NOT IMPLEMENTED YET.  True if this is a horizontal bar plot and 
        // x and y values are "transposed".  Tranposed, or "swapped", data is 
        // required prior to rev. 894 builds of jqPlot with horizontal bars. 
        // Allows backward compatability of bar renderer horizontal bars with 
        // old style data sets.
        this.transposedData = true;
        this.renderer.animation = {
            show: false,
            direction: 'down',
            speed: 3000,
            _supported: true
        };
        this._type = 'bar';
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        //////
        // This is probably wrong here.
        // After going back and forth on whether renderer should be the thing
        // or extend the thing, it seems that it it best if it is a property
        // on the thing.  This should be something that is commonized 
        // among series renderers in the future.
        //////
        $.extend(true, this, options);

        // really should probably do this
        $.extend(true, this.renderer, options);
        // fill is still needed to properly draw the legend.
        // bars have to be filled.
        this.fill = true;

        // if horizontal bar and animating, reset the default direction
        if (this.barDirection === 'horizontal' && this.rendererOptions.animation && this.rendererOptions.animation.direction == null) {
            this.renderer.animation.direction = 'left';
        }
        
        if (this.waterfall) {
            this.fillToZero = false;
            this.disableStack = true;
        }
        
        if (this.barDirection == 'vertical' ) {
            this._primaryAxis = '_xaxis';
            this._stackAxis = 'y';
            this.fillAxis = 'y';
        }
        else {
            this._primaryAxis = '_yaxis';
            this._stackAxis = 'x';
            this.fillAxis = 'x';
        }
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        // total number of values for all bar series, total number of bar series, and position of this series
        this._plotSeriesInfo = null;
        // Array of actual data colors used for each data point.
        this._dataColors = [];
        this._barPoints = [];
        
        // set the shape renderer options
        var opts = {lineJoin:'miter', lineCap:'round', fill:true, isarc:false, strokeStyle:this.color, fillStyle:this.color, closePath:this.fill};
        this.renderer.shapeRenderer.init(opts);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:true, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, closePath:this.fill};
        this.renderer.shadowRenderer.init(sopts);
        
        plot.postInitHooks.addOnce(postInit);
        plot.postDrawHooks.addOnce(postPlotDraw);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick); 
    };
    
    // called with scope of series
    function barPreInit(target, data, seriesDefaults, options) {
        if (this.rendererOptions.barDirection == 'horizontal') {
            this._stackAxis = 'x';
            this._primaryAxis = '_yaxis';
        }
        if (this.rendererOptions.waterfall == true) {
            this._data = $.extend(true, [], this.data);
            var sum = 0;
            var pos = (!this.rendererOptions.barDirection || this.rendererOptions.barDirection === 'vertical' || this.transposedData === false) ? 1 : 0;
            for(var i=0; i<this.data.length; i++) {
                sum += this.data[i][pos];
                if (i>0) {
                    this.data[i][pos] += this.data[i-1][pos];
                }
            }
            this.data[this.data.length] = (pos == 1) ? [this.data.length+1, sum] : [sum, this.data.length+1];
            this._data[this._data.length] = (pos == 1) ? [this._data.length+1, sum] : [sum, this._data.length+1];
        }
        if (this.rendererOptions.groups > 1) {
            this.breakOnNull = true;
            var l = this.data.length;
            var skip = parseInt(l/this.rendererOptions.groups, 10);
            var count = 0;
            for (var i=skip; i<l; i+=skip) {
                this.data.splice(i+count, 0, [null, null]);
                this._plotData.splice(i+count, 0, [null, null]);
                this._stackData.splice(i+count, 0, [null, null]);
                count++;
            }
            for (i=0; i<this.data.length; i++) {
                if (this._primaryAxis == '_xaxis') {
                    this.data[i][0] = i+1;
                    this._plotData[i][0] = i+1;
                    this._stackData[i][0] = i+1;
                }
                else {
                    this.data[i][1] = i+1;
                    this._plotData[i][1] = i+1;
                    this._stackData[i][1] = i+1;
                }
            }
        }
    }
    
    $.jqplot.preSeriesInitHooks.push(barPreInit);
    
    // needs to be called with scope of series, not renderer.
    $.jqplot.BarRenderer.prototype.calcSeriesNumbers = function() {
        var nvals = 0;
        var nseries = 0;
        var paxis = this[this._primaryAxis];
        var s, series, pos;
        // loop through all series on this axis
        for (var i=0; i < paxis._series.length; i++) {
            series = paxis._series[i];
            if (series === this) {
                pos = i;
            }
            // is the series rendered as a bar?
            if (series.renderer.constructor == $.jqplot.BarRenderer) {
                // gridData may not be computed yet, use data length insted
                nvals += series.data.length;
                nseries += 1;
            }
        }
        // return total number of values for all bar series, total number of bar series, and position of this series
        return [nvals, nseries, pos];
    };

    $.jqplot.BarRenderer.prototype.setBarWidth = function() {
        // need to know how many data values we have on the approprate axis and figure it out.
        var i;
        var nvals = 0;
        var nseries = 0;
        var paxis = this[this._primaryAxis];
        var s, series, pos;
        var temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        nvals = temp[0];
        nseries = temp[1];
        var nticks = paxis.numberTicks;
        var nbins = (nticks-1)/2;
        // so, now we have total number of axis values.
        if (paxis.name == 'xaxis' || paxis.name == 'x2axis') {
            if (this._stack) {
                this.barWidth = (paxis._offsets.max - paxis._offsets.min) / nvals * nseries - this.barMargin;
            }
            else {
                this.barWidth = ((paxis._offsets.max - paxis._offsets.min)/nbins  - this.barPadding * (nseries-1) - this.barMargin*2)/nseries;
                // this.barWidth = (paxis._offsets.max - paxis._offsets.min) / nvals - this.barPadding - this.barMargin/nseries;
            }
        }
        else {
            if (this._stack) {
                this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals * nseries - this.barMargin;
            }
            else {
                this.barWidth = ((paxis._offsets.min - paxis._offsets.max)/nbins  - this.barPadding * (nseries-1) - this.barMargin*2)/nseries;
                // this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals - this.barPadding - this.barMargin/nseries;
            }
        }
        return [nvals, nseries];
    };

    function computeHighlightColors (colors) {
        var ret = [];
        for (var i=0; i<colors.length; i++){
            var rgba = $.jqplot.getColorComponents(colors[i]);
            var newrgb = [rgba[0], rgba[1], rgba[2]];
            var sum = newrgb[0] + newrgb[1] + newrgb[2];
            for (var j=0; j<3; j++) {
                // when darkening, lowest color component can be is 60.
                newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                newrgb[j] = parseInt(newrgb[j], 10);
            }
            ret.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
        }
        return ret;
    }

    function getStart(sidx, didx, comp, plot, axis) {
        // check if sign change
        var seriesIndex = sidx,
            prevSeriesIndex = sidx - 1,
            start,
            prevVal,
            aidx = (axis === 'x') ? 0 : 1;

        // is this not the first series?
        if (seriesIndex > 0) {
            prevVal = plot.series[prevSeriesIndex]._plotData[didx][aidx];

            // is there a sign change
            if ((comp * prevVal) < 0) {
                start = getStart(prevSeriesIndex, didx, comp, plot, axis);
            }

            // no sign change.
            else {
                start = plot.series[prevSeriesIndex].gridData[didx][aidx];
            }

        }

        // if first series, return value at 0
        else {

            start = (aidx === 0) ? plot.series[seriesIndex]._xaxis.series_u2p(0) : plot.series[seriesIndex]._yaxis.series_u2p(0);
        }

        return start;
    }

    
    $.jqplot.BarRenderer.prototype.draw = function(ctx, gridData, options, plot) {
        var i;
        // Ughhh, have to make a copy of options b/c it may be modified later.
        var opts = $.extend({}, options);
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, pointy;
        // clear out data colors.
        this._dataColors = [];
        this._barPoints = [];
        
        if (this.barWidth == null) {
            this.renderer.setBarWidth.call(this);
        }
        
        var temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        var nvals = temp[0];
        var nseries = temp[1];
        var pos = temp[2];
        var points = [];
        
        if (this._stack) {
            this._barNudge = 0;
        }
        else {
            this._barNudge = (-Math.abs(nseries/2 - 0.5) + pos) * (this.barWidth + this.barPadding);
        }
        if (showLine) {
            var negativeColors = new $.jqplot.ColorGenerator(this.negativeSeriesColors);
            var positiveColors = new $.jqplot.ColorGenerator(this.seriesColors);
            var negativeColor = negativeColors.get(this.index);
            if (! this.useNegativeColors) {
                negativeColor = opts.fillStyle;
            }
            var positiveColor = opts.fillStyle;
            var base;
            var xstart; 
            var ystart;
            
            if (this.barDirection == 'vertical') {
                for (var i=0; i<gridData.length; i++) {
                    if (!this._stack && this.data[i][1] == null) {
                        continue;
                    }
                    points = [];
                    base = gridData[i][0] + this._barNudge;
                    
                    // stacked
                    if (this._stack && this._prevGridData.length) {
                        ystart = getStart(this.index, i, this._plotData[i][1], plot, 'y');
                    }

                    // not stacked
                    else {
                        if (this.fillToZero) {
                            ystart = this._yaxis.series_u2p(0);
                        }
                        else if (this.waterfall && i > 0 && i < this.gridData.length-1) {
                            ystart = this.gridData[i-1][1];
                        }
                        else if (this.waterfall && i == 0 && i < this.gridData.length-1) {
                            if (this._yaxis.min <= 0 && this._yaxis.max >= 0) {
                                ystart = this._yaxis.series_u2p(0);
                            }
                            else if (this._yaxis.min > 0) {
                                ystart = ctx.canvas.height;
                            }
                            else {
                                ystart = 0;
                            }
                        }
                        else if (this.waterfall && i == this.gridData.length - 1) {
                            if (this._yaxis.min <= 0 && this._yaxis.max >= 0) {
                                ystart = this._yaxis.series_u2p(0);
                            }
                            else if (this._yaxis.min > 0) {
                                ystart = ctx.canvas.height;
                            }
                            else {
                                ystart = 0;
                            }
                        }
                        else {
                            ystart = ctx.canvas.height;
                        }
                    }
                    if ((this.fillToZero && this._plotData[i][1] < 0) || (this.waterfall && this._data[i][1] < 0)) {
                        if (this.varyBarColor && !this._stack) {
                            if (this.useNegativeColors) {
                                opts.fillStyle = negativeColors.next();
                            }
                            else {
                                opts.fillStyle = positiveColors.next();
                            }
                        }
                        else {
                            opts.fillStyle = negativeColor;
                        }
                    }
                    else {
                        if (this.varyBarColor && !this._stack) {
                            opts.fillStyle = positiveColors.next();
                        }
                        else {
                            opts.fillStyle = positiveColor;
                        }
                    }
                    
                    if (!this.fillToZero || this._plotData[i][1] >= 0) { 
                        points.push([base-this.barWidth/2, ystart]);
                        points.push([base-this.barWidth/2, gridData[i][1]]);
                        points.push([base+this.barWidth/2, gridData[i][1]]);
                        points.push([base+this.barWidth/2, ystart]);
                    }
                    // for negative bars make sure points are always ordered clockwise
                    else {              
                        points.push([base-this.barWidth/2, gridData[i][1]]);
                        points.push([base-this.barWidth/2, ystart]);
                        points.push([base+this.barWidth/2, ystart]);
                        points.push([base+this.barWidth/2, gridData[i][1]]);
                    }
                    this._barPoints.push(points);
                    // now draw the shadows if not stacked.
                    // for stacked plots, they are predrawn by drawShadow
                    if (shadow && !this._stack) {
                        var sopts = $.extend(true, {}, opts);
                        // need to get rid of fillStyle on shadow.
                        delete sopts.fillStyle;
                        this.renderer.shadowRenderer.draw(ctx, points, sopts);
                    }
                    var clr = opts.fillStyle || this.color;
                    this._dataColors.push(clr);
                    this.renderer.shapeRenderer.draw(ctx, points, opts); 
                }
            }
            
            else if (this.barDirection == 'horizontal'){
                for (var i=0; i<gridData.length; i++) {
                    if (!this._stack && this.data[i][0] == null) {
                        continue;
                    }
                    points = [];
                    base = gridData[i][1] - this._barNudge;
                    xstart;
                    
                    if (this._stack && this._prevGridData.length) {
                        xstart = getStart(this.index, i, this._plotData[i][0], plot, 'x');
                    }
                    // not stacked
                    else {
                        if (this.fillToZero) {
                            xstart = this._xaxis.series_u2p(0);
                        }
                        else if (this.waterfall && i > 0 && i < this.gridData.length-1) {
                            xstart = this.gridData[i-1][0];
                        }
                        else if (this.waterfall && i == 0 && i < this.gridData.length-1) {
                            if (this._xaxis.min <= 0 && this._xaxis.max >= 0) {
                                xstart = this._xaxis.series_u2p(0);
                            }
                            else if (this._xaxis.min > 0) {
                                xstart = 0;
                            }
                            else {
                                xstart = 0;
                            }
                        }
                        else if (this.waterfall && i == this.gridData.length - 1) {
                            if (this._xaxis.min <= 0 && this._xaxis.max >= 0) {
                                xstart = this._xaxis.series_u2p(0);
                            }
                            else if (this._xaxis.min > 0) {
                                xstart = 0;
                            }
                            else {
                                xstart = ctx.canvas.width;
                            }
                        }
                        else {
                            xstart = 0;
                        }
                    }
                    if ((this.fillToZero && this._plotData[i][0] < 0) || (this.waterfall && this._data[i][0] < 0)) {
                        if (this.varyBarColor && !this._stack) {
                            if (this.useNegativeColors) {
                                opts.fillStyle = negativeColors.next();
                            }
                            else {
                                opts.fillStyle = positiveColors.next();
                            }
                        }
                        else {
                            opts.fillStyle = negativeColor;
                        }
                    }
                    else {
                        if (this.varyBarColor && !this._stack) {
                            opts.fillStyle = positiveColors.next();
                        }
                        else {
                            opts.fillStyle = positiveColor;
                        }                    
                    }
                    

                    if (!this.fillToZero || this._plotData[i][0] >= 0) {
                        points.push([xstart, base + this.barWidth / 2]);
                        points.push([xstart, base - this.barWidth / 2]);
                        points.push([gridData[i][0], base - this.barWidth / 2]);
                        points.push([gridData[i][0], base + this.barWidth / 2]);
                    }
                    else {
                        points.push([gridData[i][0], base + this.barWidth / 2]);
                        points.push([gridData[i][0], base - this.barWidth / 2]);
                        points.push([xstart, base - this.barWidth / 2]);
                        points.push([xstart, base + this.barWidth / 2]);
                    }

                    this._barPoints.push(points);
                    // now draw the shadows if not stacked.
                    // for stacked plots, they are predrawn by drawShadow
                    if (shadow && !this._stack) {
                        var sopts = $.extend(true, {}, opts);
                        delete sopts.fillStyle;
                        this.renderer.shadowRenderer.draw(ctx, points, sopts);
                    }
                    var clr = opts.fillStyle || this.color;
                    this._dataColors.push(clr);
                    this.renderer.shapeRenderer.draw(ctx, points, opts);
                } 
            }
        }                
        
        if (this.highlightColors.length == 0) {
            this.highlightColors = $.jqplot.computeHighlightColors(this._dataColors);
        }
        
        else if (typeof(this.highlightColors) == 'string') {
            var temp = this.highlightColors;
            this.highlightColors = [];
            for (var i=0; i<this._dataColors.length; i++) {
                this.highlightColors.push(temp);
            }
        }
        
    };
    
     
    // for stacked plots, shadows will be pre drawn by drawShadow.
    $.jqplot.BarRenderer.prototype.drawShadow = function(ctx, gridData, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, points, pointy, nvals, nseries, pos;
        
        if (this._stack && this.shadow) {
            if (this.barWidth == null) {
                this.renderer.setBarWidth.call(this);
            }
        
            var temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
            nvals = temp[0];
            nseries = temp[1];
            pos = temp[2];
        
            if (this._stack) {
                this._barNudge = 0;
            }
            else {
                this._barNudge = (-Math.abs(nseries/2 - 0.5) + pos) * (this.barWidth + this.barPadding);
            }
            if (showLine) {
            
                if (this.barDirection == 'vertical') {
                    for (var i=0; i<gridData.length; i++) {
                        if (this.data[i][1] == null) {
                            continue;
                        }
                        points = [];
                        var base = gridData[i][0] + this._barNudge;
                        var ystart;
                    
                        if (this._stack && this._prevGridData.length) {
                            ystart = getStart(this.index, i, this._plotData[i][1], plot, 'y');
                        }
                        else {
                            if (this.fillToZero) {
                                ystart = this._yaxis.series_u2p(0);
                            }
                            else {
                                ystart = ctx.canvas.height;
                            }
                        }
                    
                        points.push([base-this.barWidth/2, ystart]);
                        points.push([base-this.barWidth/2, gridData[i][1]]);
                        points.push([base+this.barWidth/2, gridData[i][1]]);
                        points.push([base+this.barWidth/2, ystart]);
                        this.renderer.shadowRenderer.draw(ctx, points, opts);
                    }
                }
            
                else if (this.barDirection == 'horizontal'){
                    for (var i=0; i<gridData.length; i++) {
                        if (this.data[i][0] == null) {
                            continue;
                        }
                        points = [];
                        var base = gridData[i][1] - this._barNudge;
                        var xstart;
                    
                        if (this._stack && this._prevGridData.length) {
                            xstart = getStart(this.index, i, this._plotData[i][0], plot, 'x');
                        }
                        else {
                            if (this.fillToZero) {
                                xstart = this._xaxis.series_u2p(0);
                            }
                            else {
                                xstart = 0;
                            }
                        }
                    
                        points.push([xstart, base+this.barWidth/2]);
                        points.push([gridData[i][0], base+this.barWidth/2]);
                        points.push([gridData[i][0], base-this.barWidth/2]);
                        points.push([xstart, base-this.barWidth/2]);
                        this.renderer.shadowRenderer.draw(ctx, points, opts);
                    }  
                }
            }   
            
        }
    };
    
    function postInit(target, data, options) {
        for (var i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.BarRenderer) {
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.barRenderer && this.plugins.barRenderer.highlightCanvas) {

            this.plugins.barRenderer.highlightCanvas.resetCanvas();
            this.plugins.barRenderer.highlightCanvas = null;
        }
         
        this.plugins.barRenderer = {highlightedSeriesIndex:null};
        this.plugins.barRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-barRenderer-highlight-canvas', this._plotDimensions, this));
        this.plugins.barRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }   
    
    function highlight (plot, sidx, pidx, points) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.barRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.barRenderer.highlightedSeriesIndex = sidx;
        var opts = {fillStyle: s.highlightColors[pidx]};
        s.renderer.shapeRenderer.draw(canvas._ctx, points, opts);
        canvas = null;
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.barRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.barRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
        canvas =  null;
    }
    
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].show && plot.series[ins[0]].highlightMouseOver &&
                !(ins[0] == plot.plugins.barRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.barRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.barRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.barRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(d){d.jqplot.BarRenderer=function(){d.jqplot.LineRenderer.call(this)};d.jqplot.BarRenderer.prototype=new d.jqplot.LineRenderer();d.jqplot.BarRenderer.prototype.constructor=d.jqplot.BarRenderer;d.jqplot.BarRenderer.prototype.init=function(o,q){this.barPadding=8;this.barMargin=10;this.barDirection="vertical";this.barWidth=null;this.shadowOffset=2;this.shadowDepth=5;this.shadowAlpha=0.08;this.waterfall=false;this.groups=1;this.varyBarColor=false;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.transposedData=true;this.renderer.animation={show:false,direction:"down",speed:3000,_supported:true};this._type="bar";if(o.highlightMouseDown&&o.highlightMouseOver==null){o.highlightMouseOver=false}d.extend(true,this,o);d.extend(true,this.renderer,o);this.fill=true;if(this.barDirection==="horizontal"&&this.rendererOptions.animation&&this.rendererOptions.animation.direction==null){this.renderer.animation.direction="left"}if(this.waterfall){this.fillToZero=false;this.disableStack=true}if(this.barDirection=="vertical"){this._primaryAxis="_xaxis";this._stackAxis="y";this.fillAxis="y"}else{this._primaryAxis="_yaxis";this._stackAxis="x";this.fillAxis="x"}this._highlightedPoint=null;this._plotSeriesInfo=null;this._dataColors=[];this._barPoints=[];var p={lineJoin:"miter",lineCap:"round",fill:true,isarc:false,strokeStyle:this.color,fillStyle:this.color,closePath:this.fill};this.renderer.shapeRenderer.init(p);var n={lineJoin:"miter",lineCap:"round",fill:true,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,closePath:this.fill};this.renderer.shadowRenderer.init(n);q.postInitHooks.addOnce(h);q.postDrawHooks.addOnce(j);q.eventListenerHooks.addOnce("jqplotMouseMove",b);q.eventListenerHooks.addOnce("jqplotMouseDown",a);q.eventListenerHooks.addOnce("jqplotMouseUp",l);q.eventListenerHooks.addOnce("jqplotClick",e);q.eventListenerHooks.addOnce("jqplotRightClick",m)};function g(t,p,o,w){if(this.rendererOptions.barDirection=="horizontal"){this._stackAxis="x";this._primaryAxis="_yaxis"}if(this.rendererOptions.waterfall==true){this._data=d.extend(true,[],this.data);var s=0;var u=(!this.rendererOptions.barDirection||this.rendererOptions.barDirection==="vertical"||this.transposedData===false)?1:0;for(var q=0;q<this.data.length;q++){s+=this.data[q][u];if(q>0){this.data[q][u]+=this.data[q-1][u]}}this.data[this.data.length]=(u==1)?[this.data.length+1,s]:[s,this.data.length+1];this._data[this._data.length]=(u==1)?[this._data.length+1,s]:[s,this._data.length+1]}if(this.rendererOptions.groups>1){this.breakOnNull=true;var n=this.data.length;var v=parseInt(n/this.rendererOptions.groups,10);var r=0;for(var q=v;q<n;q+=v){this.data.splice(q+r,0,[null,null]);this._plotData.splice(q+r,0,[null,null]);this._stackData.splice(q+r,0,[null,null]);r++}for(q=0;q<this.data.length;q++){if(this._primaryAxis=="_xaxis"){this.data[q][0]=q+1;this._plotData[q][0]=q+1;this._stackData[q][0]=q+1}else{this.data[q][1]=q+1;this._plotData[q][1]=q+1;this._stackData[q][1]=q+1}}}}d.jqplot.preSeriesInitHooks.push(g);d.jqplot.BarRenderer.prototype.calcSeriesNumbers=function(){var r=0;var t=0;var q=this[this._primaryAxis];var p,o,u;for(var n=0;n<q._series.length;n++){o=q._series[n];if(o===this){u=n}if(o.renderer.constructor==d.jqplot.BarRenderer){r+=o.data.length;t+=1}}return[r,t,u]};d.jqplot.BarRenderer.prototype.setBarWidth=function(){var q;var n=0;var o=0;var t=this[this._primaryAxis];var x,r,v;var w=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);n=w[0];o=w[1];var u=t.numberTicks;var p=(u-1)/2;if(t.name=="xaxis"||t.name=="x2axis"){if(this._stack){this.barWidth=(t._offsets.max-t._offsets.min)/n*o-this.barMargin}else{this.barWidth=((t._offsets.max-t._offsets.min)/p-this.barPadding*(o-1)-this.barMargin*2)/o}}else{if(this._stack){this.barWidth=(t._offsets.min-t._offsets.max)/n*o-this.barMargin}else{this.barWidth=((t._offsets.min-t._offsets.max)/p-this.barPadding*(o-1)-this.barMargin*2)/o}}return[n,o]};function f(o){var q=[];for(var s=0;s<o.length;s++){var r=d.jqplot.getColorComponents(o[s]);var n=[r[0],r[1],r[2]];var t=n[0]+n[1]+n[2];for(var p=0;p<3;p++){n[p]=(t>570)?n[p]*0.8:n[p]+0.3*(255-n[p]);n[p]=parseInt(n[p],10)}q.push("rgb("+n[0]+","+n[1]+","+n[2]+")")}return q}function i(v,u,s,t,o){var q=v,w=v-1,n,p,r=(o==="x")?0:1;if(q>0){p=t.series[w]._plotData[u][r];if((s*p)<0){n=i(w,u,s,t,o)}else{n=t.series[w].gridData[u][r]}}else{n=(r===0)?t.series[q]._xaxis.series_u2p(0):t.series[q]._yaxis.series_u2p(0)}return n}d.jqplot.BarRenderer.prototype.draw=function(E,L,q,G){var I;var A=d.extend({},q);var w=(A.shadow!=undefined)?A.shadow:this.shadow;var O=(A.showLine!=undefined)?A.showLine:this.showLine;var F=(A.fill!=undefined)?A.fill:this.fill;var p=this.xaxis;var J=this.yaxis;var y=this._xaxis.series_u2p;var K=this._yaxis.series_u2p;var D,C;this._dataColors=[];this._barPoints=[];if(this.barWidth==null){this.renderer.setBarWidth.call(this)}var N=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);var x=N[0];var v=N[1];var s=N[2];var H=[];if(this._stack){this._barNudge=0}else{this._barNudge=(-Math.abs(v/2-0.5)+s)*(this.barWidth+this.barPadding)}if(O){var u=new d.jqplot.ColorGenerator(this.negativeSeriesColors);var B=new d.jqplot.ColorGenerator(this.seriesColors);var M=u.get(this.index);if(!this.useNegativeColors){M=A.fillStyle}var t=A.fillStyle;var r;var P;var o;if(this.barDirection=="vertical"){for(var I=0;I<L.length;I++){if(!this._stack&&this.data[I][1]==null){continue}H=[];r=L[I][0]+this._barNudge;if(this._stack&&this._prevGridData.length){o=i(this.index,I,this._plotData[I][1],G,"y")}else{if(this.fillToZero){o=this._yaxis.series_u2p(0)}else{if(this.waterfall&&I>0&&I<this.gridData.length-1){o=this.gridData[I-1][1]}else{if(this.waterfall&&I==0&&I<this.gridData.length-1){if(this._yaxis.min<=0&&this._yaxis.max>=0){o=this._yaxis.series_u2p(0)}else{if(this._yaxis.min>0){o=E.canvas.height}else{o=0}}}else{if(this.waterfall&&I==this.gridData.length-1){if(this._yaxis.min<=0&&this._yaxis.max>=0){o=this._yaxis.series_u2p(0)}else{if(this._yaxis.min>0){o=E.canvas.height}else{o=0}}}else{o=E.canvas.height}}}}}if((this.fillToZero&&this._plotData[I][1]<0)||(this.waterfall&&this._data[I][1]<0)){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){A.fillStyle=u.next()}else{A.fillStyle=B.next()}}else{A.fillStyle=M}}else{if(this.varyBarColor&&!this._stack){A.fillStyle=B.next()}else{A.fillStyle=t}}if(!this.fillToZero||this._plotData[I][1]>=0){H.push([r-this.barWidth/2,o]);H.push([r-this.barWidth/2,L[I][1]]);H.push([r+this.barWidth/2,L[I][1]]);H.push([r+this.barWidth/2,o])}else{H.push([r-this.barWidth/2,L[I][1]]);H.push([r-this.barWidth/2,o]);H.push([r+this.barWidth/2,o]);H.push([r+this.barWidth/2,L[I][1]])}this._barPoints.push(H);if(w&&!this._stack){var z=d.extend(true,{},A);delete z.fillStyle;this.renderer.shadowRenderer.draw(E,H,z)}var n=A.fillStyle||this.color;this._dataColors.push(n);this.renderer.shapeRenderer.draw(E,H,A)}}else{if(this.barDirection=="horizontal"){for(var I=0;I<L.length;I++){if(!this._stack&&this.data[I][0]==null){continue}H=[];r=L[I][1]-this._barNudge;P;if(this._stack&&this._prevGridData.length){P=i(this.index,I,this._plotData[I][0],G,"x")}else{if(this.fillToZero){P=this._xaxis.series_u2p(0)}else{if(this.waterfall&&I>0&&I<this.gridData.length-1){P=this.gridData[I-1][0]}else{if(this.waterfall&&I==0&&I<this.gridData.length-1){if(this._xaxis.min<=0&&this._xaxis.max>=0){P=this._xaxis.series_u2p(0)}else{if(this._xaxis.min>0){P=0}else{P=0}}}else{if(this.waterfall&&I==this.gridData.length-1){if(this._xaxis.min<=0&&this._xaxis.max>=0){P=this._xaxis.series_u2p(0)}else{if(this._xaxis.min>0){P=0}else{P=E.canvas.width}}}else{P=0}}}}}if((this.fillToZero&&this._plotData[I][0]<0)||(this.waterfall&&this._data[I][0]<0)){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){A.fillStyle=u.next()}else{A.fillStyle=B.next()}}else{A.fillStyle=M}}else{if(this.varyBarColor&&!this._stack){A.fillStyle=B.next()}else{A.fillStyle=t}}if(!this.fillToZero||this._plotData[I][0]>=0){H.push([P,r+this.barWidth/2]);H.push([P,r-this.barWidth/2]);H.push([L[I][0],r-this.barWidth/2]);H.push([L[I][0],r+this.barWidth/2])}else{H.push([L[I][0],r+this.barWidth/2]);H.push([L[I][0],r-this.barWidth/2]);H.push([P,r-this.barWidth/2]);H.push([P,r+this.barWidth/2])}this._barPoints.push(H);if(w&&!this._stack){var z=d.extend(true,{},A);delete z.fillStyle;this.renderer.shadowRenderer.draw(E,H,z)}var n=A.fillStyle||this.color;this._dataColors.push(n);this.renderer.shapeRenderer.draw(E,H,A)}}}}if(this.highlightColors.length==0){this.highlightColors=d.jqplot.computeHighlightColors(this._dataColors)}else{if(typeof(this.highlightColors)=="string"){var N=this.highlightColors;this.highlightColors=[];for(var I=0;I<this._dataColors.length;I++){this.highlightColors.push(N)}}}};d.jqplot.BarRenderer.prototype.drawShadow=function(z,G,p,B){var D;var w=(p!=undefined)?p:{};var t=(w.shadow!=undefined)?w.shadow:this.shadow;var I=(w.showLine!=undefined)?w.showLine:this.showLine;var A=(w.fill!=undefined)?w.fill:this.fill;var o=this.xaxis;var E=this.yaxis;var v=this._xaxis.series_u2p;var F=this._yaxis.series_u2p;var y,C,x,u,s,r;if(this._stack&&this.shadow){if(this.barWidth==null){this.renderer.setBarWidth.call(this)}var H=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);u=H[0];s=H[1];r=H[2];if(this._stack){this._barNudge=0}else{this._barNudge=(-Math.abs(s/2-0.5)+r)*(this.barWidth+this.barPadding)}if(I){if(this.barDirection=="vertical"){for(var D=0;D<G.length;D++){if(this.data[D][1]==null){continue}C=[];var q=G[D][0]+this._barNudge;var n;if(this._stack&&this._prevGridData.length){n=i(this.index,D,this._plotData[D][1],B,"y")}else{if(this.fillToZero){n=this._yaxis.series_u2p(0)}else{n=z.canvas.height}}C.push([q-this.barWidth/2,n]);C.push([q-this.barWidth/2,G[D][1]]);C.push([q+this.barWidth/2,G[D][1]]);C.push([q+this.barWidth/2,n]);this.renderer.shadowRenderer.draw(z,C,w)}}else{if(this.barDirection=="horizontal"){for(var D=0;D<G.length;D++){if(this.data[D][0]==null){continue}C=[];var q=G[D][1]-this._barNudge;var J;if(this._stack&&this._prevGridData.length){J=i(this.index,D,this._plotData[D][0],B,"x")}else{if(this.fillToZero){J=this._xaxis.series_u2p(0)}else{J=0}}C.push([J,q+this.barWidth/2]);C.push([G[D][0],q+this.barWidth/2]);C.push([G[D][0],q-this.barWidth/2]);C.push([J,q-this.barWidth/2]);this.renderer.shadowRenderer.draw(z,C,w)}}}}}};function h(q,p,n){for(var o=0;o<this.series.length;o++){if(this.series[o].renderer.constructor==d.jqplot.BarRenderer){if(this.series[o].highlightMouseOver){this.series[o].highlightMouseDown=false}}}}function j(){if(this.plugins.barRenderer&&this.plugins.barRenderer.highlightCanvas){this.plugins.barRenderer.highlightCanvas.resetCanvas();this.plugins.barRenderer.highlightCanvas=null}this.plugins.barRenderer={highlightedSeriesIndex:null};this.plugins.barRenderer.highlightCanvas=new d.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-barRenderer-highlight-canvas",this._plotDimensions,this));this.plugins.barRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(n){k(n.data.plot)})}function c(u,t,q,p){var o=u.series[t];var n=u.plugins.barRenderer.highlightCanvas;n._ctx.clearRect(0,0,n._ctx.canvas.width,n._ctx.canvas.height);o._highlightedPoint=q;u.plugins.barRenderer.highlightedSeriesIndex=t;var r={fillStyle:o.highlightColors[q]};o.renderer.shapeRenderer.draw(n._ctx,p,r);n=null}function k(p){var n=p.plugins.barRenderer.highlightCanvas;n._ctx.clearRect(0,0,n._ctx.canvas.width,n._ctx.canvas.height);for(var o=0;o<p.series.length;o++){p.series[o]._highlightedPoint=null}p.plugins.barRenderer.highlightedSeriesIndex=null;p.target.trigger("jqplotDataUnhighlight");n=null}function b(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var o=jQuery.Event("jqplotDataMouseOver");o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p);if(s.series[p[0]].show&&s.series[p[0]].highlightMouseOver&&!(p[0]==s.plugins.barRenderer.highlightedSeriesIndex&&p[1]==s.series[p[0]]._highlightedPoint)){var n=jQuery.Event("jqplotDataHighlight");n.which=r.which;n.pageX=r.pageX;n.pageY=r.pageY;s.target.trigger(n,p);c(s,t.seriesIndex,t.pointIndex,t.points)}}else{if(t==null){k(s)}}}function a(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];if(r.series[o[0]].highlightMouseDown&&!(o[0]==r.plugins.barRenderer.highlightedSeriesIndex&&o[1]==r.series[o[0]]._highlightedPoint)){var n=jQuery.Event("jqplotDataHighlight");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o);c(r,s.seriesIndex,s.pointIndex,s.points)}}else{if(s==null){k(r)}}}function l(p,o,s,r,q){var n=q.plugins.barRenderer.highlightedSeriesIndex;if(n!=null&&q.series[n].highlightMouseDown){k(q)}}function e(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];var n=jQuery.Event("jqplotDataClick");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o)}}function m(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var n=s.plugins.barRenderer.highlightedSeriesIndex;if(n!=null&&s.series[n].highlightMouseDown){k(s)}var o=jQuery.Event("jqplotDataRightClick");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p)}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.BlockRenderer
     * Plugin renderer to draw a x-y block chart.  A Block chart has data points displayed as
     * colored squares with a text label inside.  Data must be supplied in the form:
     * 
     * > [[x1, y1, "label 1", {css}], [x2, y2, "label 2", {css}], ...]
     * 
     * The label and css object are optional.  If the label is ommitted, the
     * box will collapse unless a css height and/or width is specified.
     * 
     * The css object is an object specifying css properties 
     * such as:
     * 
     * > {background:'#4f98a5', border:'3px solid gray', padding:'1px'}
     * 
     * Note that css properties specified with the data point override defaults
     * specified with the series.
     * 
     */
    $.jqplot.BlockRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.BlockRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BlockRenderer.prototype.constructor = $.jqplot.BlockRenderer;
    
    // called with scope of a series
    $.jqplot.BlockRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: css
        // default css styles that will be applied to all data blocks.
        // these values will be overridden by css styles supplied with the
        // individulal data points.
        this.css = {padding:'2px', border:'1px solid #999', textAlign:'center'};
        // prop: escapeHtml
        // true to escape html in the box label.
        this.escapeHtml = false;
        // prop: insertBreaks
        // true to turn spaces in data block label into html breaks <br />.
        this.insertBreaks = true;
        // prop: varyBlockColors
        // true to vary the color of each block in this series according to
        // the seriesColors array.  False to set each block to the color
        // specified on this series.  This has no effect if a css background color
        // option is specified in the renderer css options.
        this.varyBlockColors = false;
        $.extend(true, this, options);
        if (this.css.backgroundColor) {
            this.color = this.css.backgroundColor;
        }
        else if (this.css.background) {
            this.color = this.css.background;
        }
        else if (!this.varyBlockColors) {
            this.css.background = this.color;
        }
        this.canvas = new $.jqplot.BlockCanvas();
        this.shadowCanvas =  new $.jqplot.BlockCanvas();
        this.canvas._plotDimensions = this._plotDimensions;
        this.shadowCanvas._plotDimensions = this._plotDimensions;
        this._type = 'block';
        
        // group: Methods 
        //
        // Method: moveBlock
        // Moves an individual block.  More efficient than redrawing
        // the whole series by calling plot.drawSeries().
        // Properties:
        // idx - the 0 based index of the block or point in this series.
        // x - the x coordinate in data units (value on x axis) to move the block to.
        // y - the y coordinate in data units (value on the y axis) to move the block to.
        // duration - optional parameter to create an animated movement.  Can be a
        // number (higher is slower animation) or 'fast', 'normal' or 'slow'.  If not
        // provided, the element is moved without any animation.
        this.moveBlock = function (idx, x, y, duration) {
            // update plotData, stackData, data and gridData
            // x and y are in data coordinates.
            var el = this.canvas._elem.children(':eq('+idx+')');
            this.data[idx][0] = x;
            this.data[idx][1] = y;
            this._plotData[idx][0] = x;
            this._plotData[idx][1] = y;
            this._stackData[idx][0] = x;
            this._stackData[idx][1] = y;
            this.gridData[idx][0] = this._xaxis.series_u2p(x);
            this.gridData[idx][1] = this._yaxis.series_u2p(y);
            var w = el.outerWidth();
            var h = el.outerHeight();
            var left = this.gridData[idx][0] - w/2 + 'px';
            var top = this.gridData[idx][1] - h/2 + 'px';
            if (duration) {
                if (parseInt(duration, 10)) {
                    duration = parseInt(duration, 10);
                }
                el.animate({left:left, top:top}, duration);
            }
            else {
                el.css({left:left, top:top});
            }
            el = null;
        };
    };
    
    // called with scope of series
    $.jqplot.BlockRenderer.prototype.draw = function (ctx, gd, options) {
        if (this.plugins.pointLabels) {
            this.plugins.pointLabels.show = false;
        }
        var i, el, d, gd, t, css, w, h, left, top;
        var opts = (options != undefined) ? options : {};
        var colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        this.canvas._elem.empty();
        for (i=0; i<this.gridData.length; i++) {
            d = this.data[i];
            gd = this.gridData[i];
            t = '';
            css = {};
            if (typeof d[2] == 'string') {
                t = d[2];
            }
            else if (typeof d[2] == 'object') {
                css = d[2];
            }
            if (typeof d[3] ==  'object') {
                css = d[3];
            }
            if (this.insertBreaks){ 
                t = t.replace(/ /g, '<br />');
            }
            css = $.extend(true, {}, this.css, css);
            // create a div
            el = $('<div style="position:absolute;margin-left:auto;margin-right:auto;"></div>');
            this.canvas._elem.append(el);
            // set text
            this.escapeHtml ? el.text(t) : el.html(t);
            // style it
            // remove styles we don't want overridden.
            delete css.position;
            delete css.marginRight;
            delete css.marginLeft;
            if (!css.background && !css.backgroundColor && !css.backgroundImage){ 
                css.background = colorGenerator.next();
            }
            el.css(css);
            w = el.outerWidth();
            h = el.outerHeight();
            left = gd[0] - w/2 + 'px';
            top = gd[1] - h/2 + 'px';
            el.css({left:left, top:top});
            el = null;
        }
    };
    
    $.jqplot.BlockCanvas = function() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;  
    };
    
    $.jqplot.BlockCanvas.prototype = new $.jqplot.ElemContainer();
    $.jqplot.BlockCanvas.prototype.constructor = $.jqplot.BlockCanvas;
    
    $.jqplot.BlockCanvas.prototype.createElement = function(offsets, clss, plotDimensions) {
        this._offsets = offsets;
        var klass = 'jqplot-blockCanvas';
        if (clss != undefined) {
            klass = clss;
        }
        var elem;
        // if this canvas already has a dom element, don't make a new one.
        if (this._elem) {
            elem = this._elem.get(0);
        }
        else {
            elem = document.createElement('div');
        }
        // if new plotDimensions supplied, use them.
        if (plotDimensions != undefined) {
            this._plotDimensions = plotDimensions;
        }
        
        var w = this._plotDimensions.width - this._offsets.left - this._offsets.right + 'px';
        var h = this._plotDimensions.height - this._offsets.top - this._offsets.bottom + 'px';
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', width:w, height:h, left: this._offsets.left, top: this._offsets.top });
        
        this._elem.addClass(klass);
        return this._elem;
    };
    
    $.jqplot.BlockCanvas.prototype.setContext = function() {
        this._ctx = {
            canvas:{
                width:0,
                height:0
            },
            clearRect:function(){return null;}
        };
        return this._ctx;
    };
    
})(jQuery);
    
    
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.BlockRenderer=function(){a.jqplot.LineRenderer.call(this)};a.jqplot.BlockRenderer.prototype=new a.jqplot.LineRenderer();a.jqplot.BlockRenderer.prototype.constructor=a.jqplot.BlockRenderer;a.jqplot.BlockRenderer.prototype.init=function(b){this.css={padding:"2px",border:"1px solid #999",textAlign:"center"};this.escapeHtml=false;this.insertBreaks=true;this.varyBlockColors=false;a.extend(true,this,b);if(this.css.backgroundColor){this.color=this.css.backgroundColor}else{if(this.css.background){this.color=this.css.background}else{if(!this.varyBlockColors){this.css.background=this.color}}}this.canvas=new a.jqplot.BlockCanvas();this.shadowCanvas=new a.jqplot.BlockCanvas();this.canvas._plotDimensions=this._plotDimensions;this.shadowCanvas._plotDimensions=this._plotDimensions;this._type="block";this.moveBlock=function(l,j,i,e){var c=this.canvas._elem.children(":eq("+l+")");this.data[l][0]=j;this.data[l][1]=i;this._plotData[l][0]=j;this._plotData[l][1]=i;this._stackData[l][0]=j;this._stackData[l][1]=i;this.gridData[l][0]=this._xaxis.series_u2p(j);this.gridData[l][1]=this._yaxis.series_u2p(i);var k=c.outerWidth();var f=c.outerHeight();var d=this.gridData[l][0]-k/2+"px";var g=this.gridData[l][1]-f/2+"px";if(e){if(parseInt(e,10)){e=parseInt(e,10)}c.animate({left:d,top:g},e)}else{c.css({left:d,top:g})}c=null}};a.jqplot.BlockRenderer.prototype.draw=function(q,o,r){if(this.plugins.pointLabels){this.plugins.pointLabels.show=false}var f,c,l,o,p,k,n,g,e,m;var b=(r!=undefined)?r:{};var j=new a.jqplot.ColorGenerator(this.seriesColors);this.canvas._elem.empty();for(f=0;f<this.gridData.length;f++){l=this.data[f];o=this.gridData[f];p="";k={};if(typeof l[2]=="string"){p=l[2]}else{if(typeof l[2]=="object"){k=l[2]}}if(typeof l[3]=="object"){k=l[3]}if(this.insertBreaks){p=p.replace(/ /g,"<br />")}k=a.extend(true,{},this.css,k);c=a('<div style="position:absolute;margin-left:auto;margin-right:auto;"></div>');this.canvas._elem.append(c);this.escapeHtml?c.text(p):c.html(p);delete k.position;delete k.marginRight;delete k.marginLeft;if(!k.background&&!k.backgroundColor&&!k.backgroundImage){k.background=j.next()}c.css(k);n=c.outerWidth();g=c.outerHeight();e=o[0]-n/2+"px";m=o[1]-g/2+"px";c.css({left:e,top:m});c=null}};a.jqplot.BlockCanvas=function(){a.jqplot.ElemContainer.call(this);this._ctx};a.jqplot.BlockCanvas.prototype=new a.jqplot.ElemContainer();a.jqplot.BlockCanvas.prototype.constructor=a.jqplot.BlockCanvas;a.jqplot.BlockCanvas.prototype.createElement=function(i,e,c){this._offsets=i;var b="jqplot-blockCanvas";if(e!=undefined){b=e}var g;if(this._elem){g=this._elem.get(0)}else{g=document.createElement("div")}if(c!=undefined){this._plotDimensions=c}var d=this._plotDimensions.width-this._offsets.left-this._offsets.right+"px";var f=this._plotDimensions.height-this._offsets.top-this._offsets.bottom+"px";this._elem=a(g);this._elem.css({position:"absolute",width:d,height:f,left:this._offsets.left,top:this._offsets.top});this._elem.addClass(b);return this._elem};a.jqplot.BlockCanvas.prototype.setContext=function(){this._ctx={canvas:{width:0,height:0},clearRect:function(){return null}};return this._ctx}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    var arrayMax = function( array ){
        return Math.max.apply( Math, array );
    };
    var arrayMin = function( array ){
        return Math.min.apply( Math, array );
    };

    /**
     * Class: $.jqplot.BubbleRenderer
     * Plugin renderer to draw a bubble chart.  A Bubble chart has data points displayed as
     * colored circles with an optional text label inside.  To use
     * the bubble renderer, you must include the bubble renderer like:
     * 
     * > <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.bubbleRenderer.js"></script>
     * 
     * Data must be supplied in 
     * the form:
     * 
     * > [[x1, y1, r1, <label or {label:'text', color:color}>], ...]
     * 
     * where the label or options 
     * object is optional.  
     * 
     * Note that all bubble colors will be the same
     * unless the "varyBubbleColors" option is set to true.  Colors can be specified in the data array
     * or in the seriesColors array option on the series.  If no colors are defined, the default jqPlot
     * series of 16 colors are used.  Colors are automatically cycled around again if there are more
     * bubbles than colors.
     * 
     * Bubbles are autoscaled by default to fit within the chart area while maintaining 
     * relative sizes.  If the "autoscaleBubbles" option is set to false, the r(adius) values
     * in the data array a treated as literal pixel values for the radii of the bubbles.
     * 
     * Properties are passed into the bubble renderer in the rendererOptions object of
     * the series options like:
     * 
     * > seriesDefaults: {
     * >     renderer: $.jqplot.BubbleRenderer,
     * >     rendererOptions: {
     * >         bubbleAlpha: 0.7,
     * >         varyBubbleColors: false
     * >     }
     * > }
     * 
     */
    $.jqplot.BubbleRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.BubbleRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BubbleRenderer.prototype.constructor = $.jqplot.BubbleRenderer;
    
    // called with scope of a series
    $.jqplot.BubbleRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: varyBubbleColors
        // True to vary the color of each bubble in this series according to
        // the seriesColors array.  False to set each bubble to the color
        // specified on this series.  This has no effect if a css background color
        // option is specified in the renderer css options.
        this.varyBubbleColors = true;
        // prop: autoscaleBubbles
        // True to scale the bubble radius based on plot size.
        // False will use the radius value as provided as a raw pixel value for
        // bubble radius.
        this.autoscaleBubbles = true;
        // prop: autoscaleMultiplier
        // Multiplier the bubble size if autoscaleBubbles is true.
        this.autoscaleMultiplier = 1.0;
        // prop: autoscalePointsFactor
        // Factor which decreases bubble size based on how many bubbles on on the chart.
        // 0 means no adjustment for number of bubbles.  Negative values will decrease
        // size of bubbles as more bubbles are added.  Values between 0 and -0.2
        // should work well.
        this.autoscalePointsFactor = -0.07;
        // prop: escapeHtml
        // True to escape html in bubble label text.
        this.escapeHtml = true;
        // prop: highlightMouseOver
        // True to highlight bubbles when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a bubble.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // An array of colors to use when highlighting a slice.  Calculated automatically
        // if not supplied.
        this.highlightColors = [];
        // prop: bubbleAlpha
        // Alpha transparency to apply to all bubbles in this series.
        this.bubbleAlpha = 1.0;
        // prop: highlightAlpha
        // Alpha transparency to apply when highlighting bubble.
        // Set to value of bubbleAlpha by default.
        this.highlightAlpha = null;
        // prop: bubbleGradients
        // True to color the bubbles with gradient fills instead of flat colors.
        // NOT AVAILABLE IN IE due to lack of excanvas support for radial gradient fills.
        // will be ignored in IE.
        this.bubbleGradients = false;
        // prop: showLabels
        // True to show labels on bubbles (if any), false to not show.
        this.showLabels = true;
        // array of [point index, radius] which will be sorted in descending order to plot 
        // largest points below smaller points.
        this.radii = [];
        this.maxRadius = 0;
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        // array of jQuery labels.
        this.labels = [];
        this.bubbleCanvases = [];
        this._type = 'bubble';
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);
        
        if (this.highlightAlpha == null) {
            this.highlightAlpha = this.bubbleAlpha;
            if (this.bubbleGradients) {
                this.highlightAlpha = 0.35;
            }
        }
        
        this.autoscaleMultiplier = this.autoscaleMultiplier * Math.pow(this.data.length, this.autoscalePointsFactor);
        
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // adjust the series colors for options colors passed in with data or for alpha.
        // note, this can leave undefined holes in the seriesColors array.
        var comps;
        for (var i=0; i<this.data.length; i++) {
            var color = null;
            var d = this.data[i];
            this.maxRadius = Math.max(this.maxRadius, d[2]);
            if (d[3]) {
                if (typeof(d[3]) == 'object') {
                    color = d[3]['color'];
                }
            }
            
            if (color == null) {
                if (this.seriesColors[i] != null) {
                    color = this.seriesColors[i];
                }
            }
            
            if (color && this.bubbleAlpha < 1.0) {
                comps = $.jqplot.getColorComponents(color);
                color = 'rgba('+comps[0]+', '+comps[1]+', '+comps[2]+', '+this.bubbleAlpha+')';
            }
            
            if (color) {
                this.seriesColors[i] = color;
            }
        }
        
        if (!this.varyBubbleColors) {
            this.seriesColors = [this.color];
        }
        
        this.colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+', '+this.highlightAlpha+')');
            }
        }
        
        this.highlightColorGenerator = new $.jqplot.ColorGenerator(this.highlightColors);
        
        var sopts = {fill:true, isarc:true, angle:this.shadowAngle, alpha:this.shadowAlpha, closePath:true};
        
        this.renderer.shadowRenderer.init(sopts);
        
        this.canvas = new $.jqplot.DivCanvas();
        this.canvas._plotDimensions = this._plotDimensions;
        
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);
        
    };
    

    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.BubbleRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        this.gridData = [];
        var radii = [];
        this.radii = [];
        var dim = Math.min(plot._height, plot._width);
        for (var i=0; i<this.data.length; i++) {
            if (data[i] != null) {
                this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1]), data[i][2]]);
                this.radii.push([i, data[i][2]]);
                radii.push(data[i][2]);
            }
        }
        var r, val, maxr = this.maxRadius = arrayMax(radii);
        var l = this.gridData.length;
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = this.autoscaleMultiplier * dim / 6;
                this.gridData[i][2] = r * val;
            }
        }
        
        this.radii.sort(function(a, b) { return b[1] - a[1]; });
    };
    
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.BubbleRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var radii = [];
        this.radii = [];
        var dim = Math.min(plot._height, plot._width);
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1]), data[i][2]]);
                radii.push(data[i][2]);
                this.radii.push([i, data[i][2]]);
            }
        }
        var r, val, maxr = this.maxRadius = arrayMax(radii);
        var l = this.gridData.length;
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = this.autoscaleMultiplier * dim / 6;
                gd[i][2] = r * val;
            }
        }
        this.radii.sort(function(a, b) { return b[1] - a[1]; });
        return gd;
    };
    
    // called with scope of series
    $.jqplot.BubbleRenderer.prototype.draw = function (ctx, gd, options) {
        if (this.plugins.pointLabels) {
            this.plugins.pointLabels.show = false;
        }
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        this.canvas._elem.empty();
        for (var i=0; i<this.radii.length; i++) {
            var idx = this.radii[i][0];
            var t=null;
            var color = null;
            var el = null;
            var tel = null;
            var d = this.data[idx];
            var gd = this.gridData[idx];
            if (d[3]) {
                if (typeof(d[3]) == 'object') {
                    t = d[3]['label'];
                }
                else if (typeof(d[3]) == 'string') {
                    t = d[3];
                }
            }
            
            // color = (this.varyBubbleColors) ? this.colorGenerator.get(idx) : this.color;
            color = this.colorGenerator.get(idx);
            
            // If we're drawing a shadow, expand the canvas dimensions to accomodate.
            var canvasRadius = gd[2];
            var offset, depth;
            if (this.shadow) {
                offset = (0.7 + gd[2]/40).toFixed(1);
                depth = 1 + Math.ceil(gd[2]/15);
                canvasRadius += offset*depth;
            }
            this.bubbleCanvases[idx] = new $.jqplot.BubbleCanvas();
            this.canvas._elem.append(this.bubbleCanvases[idx].createElement(gd[0], gd[1], canvasRadius));
            this.bubbleCanvases[idx].setContext();
            var ctx = this.bubbleCanvases[idx]._ctx;
            var x = ctx.canvas.width/2;
            var y = ctx.canvas.height/2;
            if (this.shadow) {
                this.renderer.shadowRenderer.draw(ctx, [x, y, gd[2], 0, 2*Math.PI], {offset: offset, depth: depth});
            }
            this.bubbleCanvases[idx].draw(gd[2], color, this.bubbleGradients, this.shadowAngle/180*Math.PI);
            
            // now draw label.
            if (t && this.showLabels) {
                tel = $('<div style="position:absolute;" class="jqplot-bubble-label"></div>');
                if (this.escapeHtml) {
                    tel.text(t);
                }
                else {
                    tel.html(t);
                }
                this.canvas._elem.append(tel);
                var h = $(tel).outerHeight();
                var w = $(tel).outerWidth();
                var top = gd[1] - 0.5*h;
                var left = gd[0] - 0.5*w;
                tel.css({top: top, left: left});
                this.labels[idx] = $(tel);
            }
        }
    };

    
    $.jqplot.DivCanvas = function() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;  
    };
    
    $.jqplot.DivCanvas.prototype = new $.jqplot.ElemContainer();
    $.jqplot.DivCanvas.prototype.constructor = $.jqplot.DivCanvas;
    
    $.jqplot.DivCanvas.prototype.createElement = function(offsets, clss, plotDimensions) {
        this._offsets = offsets;
        var klass = 'jqplot-DivCanvas';
        if (clss != undefined) {
            klass = clss;
        }
        var elem;
        // if this canvas already has a dom element, don't make a new one.
        if (this._elem) {
            elem = this._elem.get(0);
        }
        else {
            elem = document.createElement('div');
        }
        // if new plotDimensions supplied, use them.
        if (plotDimensions != undefined) {
            this._plotDimensions = plotDimensions;
        }
        
        var w = this._plotDimensions.width - this._offsets.left - this._offsets.right + 'px';
        var h = this._plotDimensions.height - this._offsets.top - this._offsets.bottom + 'px';
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', width:w, height:h, left: this._offsets.left, top: this._offsets.top });
        
        this._elem.addClass(klass);
        return this._elem;
    };
    
    $.jqplot.DivCanvas.prototype.setContext = function() {
        this._ctx = {
            canvas:{
                width:0,
                height:0
            },
            clearRect:function(){return null;}
        };
        return this._ctx;
    };
    
    $.jqplot.BubbleCanvas = function() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;
    };
    
    $.jqplot.BubbleCanvas.prototype = new $.jqplot.ElemContainer();
    $.jqplot.BubbleCanvas.prototype.constructor = $.jqplot.BubbleCanvas;
    
    // initialize with the x,y pont of bubble center and the bubble radius.
    $.jqplot.BubbleCanvas.prototype.createElement = function(x, y, r) {     
        var klass = 'jqplot-bubble-point';

        var elem;
        // if this canvas already has a dom element, don't make a new one.
        if (this._elem) {
            elem = this._elem.get(0);
        }
        else {
            elem = document.createElement('canvas');
        }
        
        elem.width = (r != null) ? 2*r : elem.width;
        elem.height = (r != null) ? 2*r : elem.height;
        this._elem = $(elem);
        var l = (x != null && r != null) ? x - r : this._elem.css('left');
        var t = (y != null && r != null) ? y - r : this._elem.css('top');
        this._elem.css({ position: 'absolute', left: l, top: t });
        
        this._elem.addClass(klass);
        if ($.jqplot.use_excanvas) {
            window.G_vmlCanvasManager.init_(document);
            elem = window.G_vmlCanvasManager.initElement(elem);
        }
        
        return this._elem;
    };
    
    $.jqplot.BubbleCanvas.prototype.draw = function(r, color, gradients, angle) {
        var ctx = this._ctx;
        // r = Math.floor(r*1.04);
        // var x = Math.round(ctx.canvas.width/2);
        // var y = Math.round(ctx.canvas.height/2);
        var x = ctx.canvas.width/2;
        var y = ctx.canvas.height/2;
        ctx.save();
        if (gradients && !$.jqplot.use_excanvas) {
            r = r*1.04;
            var comps = $.jqplot.getColorComponents(color);
            var colorinner = 'rgba('+Math.round(comps[0]+0.8*(255-comps[0]))+', '+Math.round(comps[1]+0.8*(255-comps[1]))+', '+Math.round(comps[2]+0.8*(255-comps[2]))+', '+comps[3]+')';
            var colorend = 'rgba('+comps[0]+', '+comps[1]+', '+comps[2]+', 0)';
            // var rinner = Math.round(0.35 * r);
            // var xinner = Math.round(x - Math.cos(angle) * 0.33 * r);
            // var yinner = Math.round(y - Math.sin(angle) * 0.33 * r);
            var rinner = 0.35 * r;
            var xinner = x - Math.cos(angle) * 0.33 * r;
            var yinner = y - Math.sin(angle) * 0.33 * r;
            var radgrad = ctx.createRadialGradient(xinner, yinner, rinner, x, y, r);
            radgrad.addColorStop(0, colorinner);
            radgrad.addColorStop(0.93, color);
            radgrad.addColorStop(0.96, colorend);
            radgrad.addColorStop(1, colorend);
            // radgrad.addColorStop(.98, colorend);
            ctx.fillStyle = radgrad;
            ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            var ang = 2*Math.PI;
            ctx.arc(x, y, r, 0, ang, 0);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    };
    
    $.jqplot.BubbleCanvas.prototype.setContext = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        return this._ctx;
    };
    
    $.jqplot.BubbleAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.BubbleAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.BubbleAxisRenderer.prototype.constructor = $.jqplot.BubbleAxisRenderer;
        
    // called with scope of axis object.
    $.jqplot.BubbleAxisRenderer.prototype.init = function(options){
        $.extend(true, this, options);
        var db = this._dataBounds;
        var minsidx = 0,
            minpidx = 0,
            maxsidx = 0,
            maxpidx = 0,
            maxr = 0,
            minr = 0,
            minMaxRadius = 0,
            maxMaxRadius = 0,
            maxMult = 0,
            minMult = 0;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                        minsidx=i;
                        minpidx=j;
                        minr = d[j][2];
                        minMaxRadius = s.maxRadius;
                        minMult = s.autoscaleMultiplier;
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                        maxsidx=i;
                        maxpidx=j;
                        maxr = d[j][2];
                        maxMaxRadius = s.maxRadius;
                        maxMult = s.autoscaleMultiplier;
                    }
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                        minsidx=i;
                        minpidx=j;
                        minr = d[j][2];
                        minMaxRadius = s.maxRadius;
                        minMult = s.autoscaleMultiplier;
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                        maxsidx=i;
                        maxpidx=j;
                        maxr = d[j][2];
                        maxMaxRadius = s.maxRadius;
                        maxMult = s.autoscaleMultiplier;
                    }
                }              
            }
        }
        
        var minRatio = minr/minMaxRadius;
        var maxRatio = maxr/maxMaxRadius;
        
        // need to estimate the effect of the radius on total axis span and adjust axis accordingly.
        var span = db.max - db.min;
        // var dim = (this.name == 'xaxis' || this.name == 'x2axis') ? this._plotDimensions.width : this._plotDimensions.height;
        var dim = Math.min(this._plotDimensions.width, this._plotDimensions.height);
        
        var minfact = minRatio * minMult/3 * span;
        var maxfact = maxRatio * maxMult/3 * span;
        db.max += maxfact;
        db.min -= minfact;
    };
    
    function highlight (plot, sidx, pidx) {
        plot.plugins.bubbleRenderer.highlightLabelCanvas.empty();
        var s = plot.series[sidx];
        var canvas = plot.plugins.bubbleRenderer.highlightCanvas;
        var ctx = canvas._ctx;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.bubbleRenderer.highlightedSeriesIndex = sidx;
        
        var color = s.highlightColorGenerator.get(pidx);
        var x = s.gridData[pidx][0],
            y = s.gridData[pidx][1],
            r = s.gridData[pidx][2];
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();        
        // bring label to front
        if (s.labels[pidx]) {
            plot.plugins.bubbleRenderer.highlightLabel = s.labels[pidx].clone();
            plot.plugins.bubbleRenderer.highlightLabel.appendTo(plot.plugins.bubbleRenderer.highlightLabelCanvas);
            plot.plugins.bubbleRenderer.highlightLabel.addClass('jqplot-bubble-label-highlight');
        }
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.bubbleRenderer.highlightCanvas;
        var sidx = plot.plugins.bubbleRenderer.highlightedSeriesIndex;
        plot.plugins.bubbleRenderer.highlightLabelCanvas.empty();
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.bubbleRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
    
 
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var si = neighbor.seriesIndex;
            var pi = neighbor.pointIndex;
            var ins = [si, pi, neighbor.data, plot.series[si].gridData[pi][2]];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.bubbleRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    } 
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var si = neighbor.seriesIndex;
            var pi = neighbor.pointIndex;
            var ins = [si, pi, neighbor.data, plot.series[si].gridData[pi][2]];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.bubbleRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.bubbleRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var si = neighbor.seriesIndex;
            var pi = neighbor.pointIndex;
            var ins = [si, pi, neighbor.data, plot.series[si].gridData[pi][2]];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var si = neighbor.seriesIndex;
            var pi = neighbor.pointIndex;
            var ins = [si, pi, neighbor.data, plot.series[si].gridData[pi][2]];
            var idx = plot.plugins.bubbleRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.bubbleRenderer && this.plugins.bubbleRenderer.highlightCanvas) {
            this.plugins.bubbleRenderer.highlightCanvas.resetCanvas();
            this.plugins.bubbleRenderer.highlightCanvas = null;
        }
        
        this.plugins.bubbleRenderer = {highlightedSeriesIndex:null};
        this.plugins.bubbleRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        this.plugins.bubbleRenderer.highlightLabel = null;
        this.plugins.bubbleRenderer.highlightLabelCanvas = $('<div style="position:absolute;"></div>');
        var top = this._gridPadding.top;
        var left = this._gridPadding.left;
        var width = this._plotDimensions.width - this._gridPadding.left - this._gridPadding.right;
        var height = this._plotDimensions.height - this._gridPadding.top - this._gridPadding.bottom;
        this.plugins.bubbleRenderer.highlightLabelCanvas.css({top:top, left:left, width:width+'px', height:height+'px'});

        this.eventCanvas._elem.before(this.plugins.bubbleRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-bubbleRenderer-highlight-canvas', this._plotDimensions, this));
        this.eventCanvas._elem.before(this.plugins.bubbleRenderer.highlightLabelCanvas);
        
        var hctx = this.plugins.bubbleRenderer.highlightCanvas.setContext();
    }

    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a Bubble series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.BubbleRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.BubbleRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.BubbleAxisRenderer;
            options.sortData = false;
        }
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
})(jQuery);
    
    
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(f){var d=function(m){return Math.max.apply(Math,m)};var j=function(m){return Math.min.apply(Math,m)};f.jqplot.BubbleRenderer=function(){f.jqplot.LineRenderer.call(this)};f.jqplot.BubbleRenderer.prototype=new f.jqplot.LineRenderer();f.jqplot.BubbleRenderer.prototype.constructor=f.jqplot.BubbleRenderer;f.jqplot.BubbleRenderer.prototype.init=function(w,t){this.varyBubbleColors=true;this.autoscaleBubbles=true;this.autoscaleMultiplier=1;this.autoscalePointsFactor=-0.07;this.escapeHtml=true;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.bubbleAlpha=1;this.highlightAlpha=null;this.bubbleGradients=false;this.showLabels=true;this.radii=[];this.maxRadius=0;this._highlightedPoint=null;this.labels=[];this.bubbleCanvases=[];this._type="bubble";if(w.highlightMouseDown&&w.highlightMouseOver==null){w.highlightMouseOver=false}f.extend(true,this,w);if(this.highlightAlpha==null){this.highlightAlpha=this.bubbleAlpha;if(this.bubbleGradients){this.highlightAlpha=0.35}}this.autoscaleMultiplier=this.autoscaleMultiplier*Math.pow(this.data.length,this.autoscalePointsFactor);this._highlightedPoint=null;var n;for(var r=0;r<this.data.length;r++){var p=null;var v=this.data[r];this.maxRadius=Math.max(this.maxRadius,v[2]);if(v[3]){if(typeof(v[3])=="object"){p=v[3]["color"]}}if(p==null){if(this.seriesColors[r]!=null){p=this.seriesColors[r]}}if(p&&this.bubbleAlpha<1){n=f.jqplot.getColorComponents(p);p="rgba("+n[0]+", "+n[1]+", "+n[2]+", "+this.bubbleAlpha+")"}if(p){this.seriesColors[r]=p}}if(!this.varyBubbleColors){this.seriesColors=[this.color]}this.colorGenerator=new f.jqplot.ColorGenerator(this.seriesColors);if(this.highlightColors.length==0){for(var r=0;r<this.seriesColors.length;r++){var o=f.jqplot.getColorComponents(this.seriesColors[r]);var u=[o[0],o[1],o[2]];var s=u[0]+u[1]+u[2];for(var q=0;q<3;q++){u[q]=(s>570)?u[q]*0.8:u[q]+0.3*(255-u[q]);u[q]=parseInt(u[q],10)}this.highlightColors.push("rgba("+u[0]+","+u[1]+","+u[2]+", "+this.highlightAlpha+")")}}this.highlightColorGenerator=new f.jqplot.ColorGenerator(this.highlightColors);var m={fill:true,isarc:true,angle:this.shadowAngle,alpha:this.shadowAlpha,closePath:true};this.renderer.shadowRenderer.init(m);this.canvas=new f.jqplot.DivCanvas();this.canvas._plotDimensions=this._plotDimensions;t.eventListenerHooks.addOnce("jqplotMouseMove",a);t.eventListenerHooks.addOnce("jqplotMouseDown",b);t.eventListenerHooks.addOnce("jqplotMouseUp",k);t.eventListenerHooks.addOnce("jqplotClick",g);t.eventListenerHooks.addOnce("jqplotRightClick",l);t.postDrawHooks.addOnce(h)};f.jqplot.BubbleRenderer.prototype.setGridData=function(w){var q=this._xaxis.series_u2p;var m=this._yaxis.series_u2p;var t=this._plotData;this.gridData=[];var s=[];this.radii=[];var v=Math.min(w._height,w._width);for(var u=0;u<this.data.length;u++){if(t[u]!=null){this.gridData.push([q.call(this._xaxis,t[u][0]),m.call(this._yaxis,t[u][1]),t[u][2]]);this.radii.push([u,t[u][2]]);s.push(t[u][2])}}var n,o,x=this.maxRadius=d(s);var p=this.gridData.length;if(this.autoscaleBubbles){for(var u=0;u<p;u++){o=s[u]/x;n=this.autoscaleMultiplier*v/6;this.gridData[u][2]=n*o}}this.radii.sort(function(y,r){return r[1]-y[1]})};f.jqplot.BubbleRenderer.prototype.makeGridData=function(t,w){var q=this._xaxis.series_u2p;var n=this._yaxis.series_u2p;var x=[];var s=[];this.radii=[];var v=Math.min(w._height,w._width);for(var u=0;u<t.length;u++){if(t[u]!=null){x.push([q.call(this._xaxis,t[u][0]),n.call(this._yaxis,t[u][1]),t[u][2]]);s.push(t[u][2]);this.radii.push([u,t[u][2]])}}var m,o,y=this.maxRadius=d(s);var p=this.gridData.length;if(this.autoscaleBubbles){for(var u=0;u<p;u++){o=s[u]/y;m=this.autoscaleMultiplier*v/6;x[u][2]=m*o}}this.radii.sort(function(z,r){return r[1]-z[1]});return x};f.jqplot.BubbleRenderer.prototype.draw=function(D,J,n){if(this.plugins.pointLabels){this.plugins.pointLabels.show=false}var A=(n!=undefined)?n:{};var r=(A.shadow!=undefined)?A.shadow:this.shadow;this.canvas._elem.empty();for(var G=0;G<this.radii.length;G++){var C=this.radii[G][0];var z=null;var F=null;var m=null;var p=null;var I=this.data[C];var J=this.gridData[C];if(I[3]){if(typeof(I[3])=="object"){z=I[3]["label"]}else{if(typeof(I[3])=="string"){z=I[3]}}}F=this.colorGenerator.get(C);var E=J[2];var q,K;if(this.shadow){q=(0.7+J[2]/40).toFixed(1);K=1+Math.ceil(J[2]/15);E+=q*K}this.bubbleCanvases[C]=new f.jqplot.BubbleCanvas();this.canvas._elem.append(this.bubbleCanvases[C].createElement(J[0],J[1],E));this.bubbleCanvases[C].setContext();var D=this.bubbleCanvases[C]._ctx;var u=D.canvas.width/2;var s=D.canvas.height/2;if(this.shadow){this.renderer.shadowRenderer.draw(D,[u,s,J[2],0,2*Math.PI],{offset:q,depth:K})}this.bubbleCanvases[C].draw(J[2],F,this.bubbleGradients,this.shadowAngle/180*Math.PI);if(z&&this.showLabels){p=f('<div style="position:absolute;" class="jqplot-bubble-label"></div>');if(this.escapeHtml){p.text(z)}else{p.html(z)}this.canvas._elem.append(p);var H=f(p).outerHeight();var v=f(p).outerWidth();var B=J[1]-0.5*H;var o=J[0]-0.5*v;p.css({top:B,left:o});this.labels[C]=f(p)}}};f.jqplot.DivCanvas=function(){f.jqplot.ElemContainer.call(this);this._ctx};f.jqplot.DivCanvas.prototype=new f.jqplot.ElemContainer();f.jqplot.DivCanvas.prototype.constructor=f.jqplot.DivCanvas;f.jqplot.DivCanvas.prototype.createElement=function(s,p,n){this._offsets=s;var m="jqplot-DivCanvas";if(p!=undefined){m=p}var r;if(this._elem){r=this._elem.get(0)}else{r=document.createElement("div")}if(n!=undefined){this._plotDimensions=n}var o=this._plotDimensions.width-this._offsets.left-this._offsets.right+"px";var q=this._plotDimensions.height-this._offsets.top-this._offsets.bottom+"px";this._elem=f(r);this._elem.css({position:"absolute",width:o,height:q,left:this._offsets.left,top:this._offsets.top});this._elem.addClass(m);return this._elem};f.jqplot.DivCanvas.prototype.setContext=function(){this._ctx={canvas:{width:0,height:0},clearRect:function(){return null}};return this._ctx};f.jqplot.BubbleCanvas=function(){f.jqplot.ElemContainer.call(this);this._ctx};f.jqplot.BubbleCanvas.prototype=new f.jqplot.ElemContainer();f.jqplot.BubbleCanvas.prototype.constructor=f.jqplot.BubbleCanvas;f.jqplot.BubbleCanvas.prototype.createElement=function(n,u,s){var m="jqplot-bubble-point";var q;if(this._elem){q=this._elem.get(0)}else{q=document.createElement("canvas")}q.width=(s!=null)?2*s:q.width;q.height=(s!=null)?2*s:q.height;this._elem=f(q);var o=(n!=null&&s!=null)?n-s:this._elem.css("left");var p=(u!=null&&s!=null)?u-s:this._elem.css("top");this._elem.css({position:"absolute",left:o,top:p});this._elem.addClass(m);if(f.jqplot.use_excanvas){window.G_vmlCanvasManager.init_(document);q=window.G_vmlCanvasManager.initElement(q)}return this._elem};f.jqplot.BubbleCanvas.prototype.draw=function(m,s,v,p){var D=this._ctx;var B=D.canvas.width/2;var z=D.canvas.height/2;D.save();if(v&&!f.jqplot.use_excanvas){m=m*1.04;var o=f.jqplot.getColorComponents(s);var u="rgba("+Math.round(o[0]+0.8*(255-o[0]))+", "+Math.round(o[1]+0.8*(255-o[1]))+", "+Math.round(o[2]+0.8*(255-o[2]))+", "+o[3]+")";var t="rgba("+o[0]+", "+o[1]+", "+o[2]+", 0)";var C=0.35*m;var A=B-Math.cos(p)*0.33*m;var n=z-Math.sin(p)*0.33*m;var w=D.createRadialGradient(A,n,C,B,z,m);w.addColorStop(0,u);w.addColorStop(0.93,s);w.addColorStop(0.96,t);w.addColorStop(1,t);D.fillStyle=w;D.fillRect(0,0,D.canvas.width,D.canvas.height)}else{D.fillStyle=s;D.strokeStyle=s;D.lineWidth=1;D.beginPath();var q=2*Math.PI;D.arc(B,z,m,0,q,0);D.closePath();D.fill()}D.restore()};f.jqplot.BubbleCanvas.prototype.setContext=function(){this._ctx=this._elem.get(0).getContext("2d");return this._ctx};f.jqplot.BubbleAxisRenderer=function(){f.jqplot.LinearAxisRenderer.call(this)};f.jqplot.BubbleAxisRenderer.prototype=new f.jqplot.LinearAxisRenderer();f.jqplot.BubbleAxisRenderer.prototype.constructor=f.jqplot.BubbleAxisRenderer;f.jqplot.BubbleAxisRenderer.prototype.init=function(n){f.extend(true,this,n);var I=this._dataBounds;var H=0,v=0,m=0,y=0,q=0,r=0,D=0,t=0,F=0,z=0;for(var E=0;E<this._series.length;E++){var x=this._series[E];var G=x._plotData;for(var B=0;B<G.length;B++){if(this.name=="xaxis"||this.name=="x2axis"){if(G[B][0]<I.min||I.min==null){I.min=G[B][0];H=E;v=B;r=G[B][2];D=x.maxRadius;z=x.autoscaleMultiplier}if(G[B][0]>I.max||I.max==null){I.max=G[B][0];m=E;y=B;q=G[B][2];t=x.maxRadius;F=x.autoscaleMultiplier}}else{if(G[B][1]<I.min||I.min==null){I.min=G[B][1];H=E;v=B;r=G[B][2];D=x.maxRadius;z=x.autoscaleMultiplier}if(G[B][1]>I.max||I.max==null){I.max=G[B][1];m=E;y=B;q=G[B][2];t=x.maxRadius;F=x.autoscaleMultiplier}}}}var o=r/D;var w=q/t;var C=I.max-I.min;var A=Math.min(this._plotDimensions.width,this._plotDimensions.height);var p=o*z/3*C;var u=w*F/3*C;I.max+=u;I.min-=p};function e(p,v,q){p.plugins.bubbleRenderer.highlightLabelCanvas.empty();var z=p.series[v];var n=p.plugins.bubbleRenderer.highlightCanvas;var w=n._ctx;w.clearRect(0,0,w.canvas.width,w.canvas.height);z._highlightedPoint=q;p.plugins.bubbleRenderer.highlightedSeriesIndex=v;var o=z.highlightColorGenerator.get(q);var u=z.gridData[q][0],t=z.gridData[q][1],m=z.gridData[q][2];w.save();w.fillStyle=o;w.strokeStyle=o;w.lineWidth=1;w.beginPath();w.arc(u,t,m,0,2*Math.PI,0);w.closePath();w.fill();w.restore();if(z.labels[q]){p.plugins.bubbleRenderer.highlightLabel=z.labels[q].clone();p.plugins.bubbleRenderer.highlightLabel.appendTo(p.plugins.bubbleRenderer.highlightLabelCanvas);p.plugins.bubbleRenderer.highlightLabel.addClass("jqplot-bubble-label-highlight")}}function i(p){var m=p.plugins.bubbleRenderer.highlightCanvas;var o=p.plugins.bubbleRenderer.highlightedSeriesIndex;p.plugins.bubbleRenderer.highlightLabelCanvas.empty();m._ctx.clearRect(0,0,m._ctx.canvas.width,m._ctx.canvas.height);for(var n=0;n<p.series.length;n++){p.series[n]._highlightedPoint=null}p.plugins.bubbleRenderer.highlightedSeriesIndex=null;p.target.trigger("jqplotDataUnhighlight")}function a(s,p,m,v,r){if(v){var n=v.seriesIndex;var o=v.pointIndex;var q=[n,o,v.data,r.series[n].gridData[o][2]];var t=jQuery.Event("jqplotDataMouseOver");t.pageX=s.pageX;t.pageY=s.pageY;r.target.trigger(t,q);if(r.series[q[0]].highlightMouseOver&&!(q[0]==r.plugins.bubbleRenderer.highlightedSeriesIndex&&q[1]==r.series[q[0]]._highlightedPoint)){var u=jQuery.Event("jqplotDataHighlight");u.which=s.which;u.pageX=s.pageX;u.pageY=s.pageY;r.target.trigger(u,q);e(r,q[0],q[1])}}else{if(v==null){i(r)}}}function b(s,p,m,u,r){if(u){var n=u.seriesIndex;var o=u.pointIndex;var q=[n,o,u.data,r.series[n].gridData[o][2]];if(r.series[q[0]].highlightMouseDown&&!(q[0]==r.plugins.bubbleRenderer.highlightedSeriesIndex&&q[1]==r.series[q[0]]._highlightedPoint)){var t=jQuery.Event("jqplotDataHighlight");t.which=s.which;t.pageX=s.pageX;t.pageY=s.pageY;r.target.trigger(t,q);e(r,q[0],q[1])}}else{if(u==null){i(r)}}}function k(o,n,r,q,p){var m=p.plugins.bubbleRenderer.highlightedSeriesIndex;if(m!=null&&p.series[m].highlightMouseDown){i(p)}}function g(s,p,m,u,r){if(u){var n=u.seriesIndex;var o=u.pointIndex;var q=[n,o,u.data,r.series[n].gridData[o][2]];var t=jQuery.Event("jqplotDataClick");t.which=s.which;t.pageX=s.pageX;t.pageY=s.pageY;r.target.trigger(t,q)}}function l(s,p,m,v,r){if(v){var n=v.seriesIndex;var o=v.pointIndex;var q=[n,o,v.data,r.series[n].gridData[o][2]];var t=r.plugins.bubbleRenderer.highlightedSeriesIndex;if(t!=null&&r.series[t].highlightMouseDown){i(r)}var u=jQuery.Event("jqplotDataRightClick");u.which=s.which;u.pageX=s.pageX;u.pageY=s.pageY;r.target.trigger(u,q)}}function h(){if(this.plugins.bubbleRenderer&&this.plugins.bubbleRenderer.highlightCanvas){this.plugins.bubbleRenderer.highlightCanvas.resetCanvas();this.plugins.bubbleRenderer.highlightCanvas=null}this.plugins.bubbleRenderer={highlightedSeriesIndex:null};this.plugins.bubbleRenderer.highlightCanvas=new f.jqplot.GenericCanvas();this.plugins.bubbleRenderer.highlightLabel=null;this.plugins.bubbleRenderer.highlightLabelCanvas=f('<div style="position:absolute;"></div>');var q=this._gridPadding.top;var p=this._gridPadding.left;var n=this._plotDimensions.width-this._gridPadding.left-this._gridPadding.right;var m=this._plotDimensions.height-this._gridPadding.top-this._gridPadding.bottom;this.plugins.bubbleRenderer.highlightLabelCanvas.css({top:q,left:p,width:n+"px",height:m+"px"});this.eventCanvas._elem.before(this.plugins.bubbleRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-bubbleRenderer-highlight-canvas",this._plotDimensions,this));this.eventCanvas._elem.before(this.plugins.bubbleRenderer.highlightLabelCanvas);var o=this.plugins.bubbleRenderer.highlightCanvas.setContext()}function c(q,p,n){n=n||{};n.axesDefaults=n.axesDefaults||{};n.seriesDefaults=n.seriesDefaults||{};var m=false;if(n.seriesDefaults.renderer==f.jqplot.BubbleRenderer){m=true}else{if(n.series){for(var o=0;o<n.series.length;o++){if(n.series[o].renderer==f.jqplot.BubbleRenderer){m=true}}}}if(m){n.axesDefaults.renderer=f.jqplot.BubbleAxisRenderer;n.sortData=false}}f.jqplot.preInitHooks.push(c)})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
    * Class: $.jqplot.CanvasAxisLabelRenderer
    * Renderer to draw axis labels with a canvas element to support advanced
    * featrues such as rotated text.  This renderer uses a separate rendering engine
    * to draw the text on the canvas.  Two modes of rendering the text are available.
    * If the browser has native font support for canvas fonts (currently Mozila 3.5
    * and Safari 4), you can enable text rendering with the canvas fillText method.
    * You do so by setting the "enableFontSupport" option to true. 
    * 
    * Browsers lacking native font support will have the text drawn on the canvas
    * using the Hershey font metrics.  Even if the "enableFontSupport" option is true
    * non-supporting browsers will still render with the Hershey font.
    * 
    */
    $.jqplot.CanvasAxisLabelRenderer = function(options) {
        // Group: Properties
        
        // prop: angle
        // angle of text, measured clockwise from x axis.
        this.angle = 0;
        // name of the axis associated with this tick
        this.axis;
        // prop: show
        // whether or not to show the tick (mark and label).
        this.show = true;
        // prop: showLabel
        // whether or not to show the label.
        this.showLabel = true;
        // prop: label
        // label for the axis.
        this.label = '';
        // prop: fontFamily
        // CSS spec for the font-family css attribute.
        // Applies only to browsers supporting native font rendering in the
        // canvas tag.  Currently Mozilla 3.5 and Safari 4.
        this.fontFamily = '"Trebuchet MS", Arial, Helvetica, sans-serif';
        // prop: fontSize
        // CSS spec for font size.
        this.fontSize = '11pt';
        // prop: fontWeight
        // CSS spec for fontWeight:  normal, bold, bolder, lighter or a number 100 - 900
        this.fontWeight = 'normal';
        // prop: fontStretch
        // Multiplier to condense or expand font width.  
        // Applies only to browsers which don't support canvas native font rendering.
        this.fontStretch = 1.0;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = '#666666';
        // prop: enableFontSupport
        // true to turn on native canvas font support in Mozilla 3.5+ and Safari 4+.
        // If true, label will be drawn with canvas tag native support for fonts.
        // If false, label will be drawn with Hershey font metrics.
        this.enableFontSupport = true;
        // prop: pt2px
        // Point to pixel scaling factor, used for computing height of bounding box
        // around a label.  The labels text renderer has a default setting of 1.4, which 
        // should be suitable for most fonts.  Leave as null to use default.  If tops of
        // letters appear clipped, increase this.  If bounding box seems too big, decrease.
        // This is an issue only with the native font renderering capabilities of Mozilla
        // 3.5 and Safari 4 since they do not provide a method to determine the font height.
        this.pt2px = null;
        
        this._elem;
        this._ctx;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
        
        $.extend(true, this, options);
        
        if (options.angle == null && this.axis != 'xaxis' && this.axis != 'x2axis') {
            this.angle = -90;
        }
        
        var ropts = {fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily};
        if (this.pt2px) {
            ropts.pt2px = this.pt2px;
        }
        
        if (this.enableFontSupport) {
            if ($.jqplot.support_canvas_text()) {
                this._textRenderer = new $.jqplot.CanvasFontRenderer(ropts);
            }
            
            else {
                this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
            }
        }
        else {
            this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
        }
    };
    
    $.jqplot.CanvasAxisLabelRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this._textRenderer.init({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily});
    };
    
    // return width along the x axis
    // will check first to see if an element exists.
    // if not, will return the computed text box width.
    $.jqplot.CanvasAxisLabelRenderer.prototype.getWidth = function(ctx) {
        if (this._elem) {
         return this._elem.outerWidth(true);
        }
        else {
            var tr = this._textRenderer;
            var l = tr.getWidth(ctx);
            var h = tr.getHeight(ctx);
            var w = Math.abs(Math.sin(tr.angle)*h) + Math.abs(Math.cos(tr.angle)*l);
            return w;
        }
    };
    
    // return height along the y axis.
    $.jqplot.CanvasAxisLabelRenderer.prototype.getHeight = function(ctx) {
        if (this._elem) {
         return this._elem.outerHeight(true);
        }
        else {
            var tr = this._textRenderer;
            var l = tr.getWidth(ctx);
            var h = tr.getHeight(ctx);
            var w = Math.abs(Math.cos(tr.angle)*h) + Math.abs(Math.sin(tr.angle)*l);
            return w;
        }
    };
    
    $.jqplot.CanvasAxisLabelRenderer.prototype.getAngleRad = function() {
        var a = this.angle * Math.PI/180;
        return a;
    };
    
    $.jqplot.CanvasAxisLabelRenderer.prototype.draw = function(ctx, plot) {
          // Memory Leaks patch
          if (this._elem) {
              if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
                  window.G_vmlCanvasManager.uninitElement(this._elem.get(0));
              }
            
              this._elem.emptyForce();
              this._elem = null;
          }

        // create a canvas here, but can't draw on it untill it is appended
        // to dom for IE compatability.
        var elem = plot.canvasManager.getCanvas();

        this._textRenderer.setText(this.label, ctx);
        var w = this.getWidth(ctx);
        var h = this.getHeight(ctx);
        elem.width = w;
        elem.height = h;
        elem.style.width = w;
        elem.style.height = h;
        
        elem = plot.canvasManager.initCanvas(elem);

        this._elem = $(elem);
        this._elem.css({ position: 'absolute'});
        this._elem.addClass('jqplot-'+this.axis+'-label');
        
        elem = null;
        return this._elem;
    };
    
    $.jqplot.CanvasAxisLabelRenderer.prototype.pack = function() {
        this._textRenderer.draw(this._elem.get(0).getContext("2d"), this.label);
    };
    
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.CanvasAxisLabelRenderer=function(b){this.angle=0;this.axis;this.show=true;this.showLabel=true;this.label="";this.fontFamily='"Trebuchet MS", Arial, Helvetica, sans-serif';this.fontSize="11pt";this.fontWeight="normal";this.fontStretch=1;this.textColor="#666666";this.enableFontSupport=true;this.pt2px=null;this._elem;this._ctx;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null};a.extend(true,this,b);if(b.angle==null&&this.axis!="xaxis"&&this.axis!="x2axis"){this.angle=-90}var c={fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily};if(this.pt2px){c.pt2px=this.pt2px}if(this.enableFontSupport){if(a.jqplot.support_canvas_text()){this._textRenderer=new a.jqplot.CanvasFontRenderer(c)}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}};a.jqplot.CanvasAxisLabelRenderer.prototype.init=function(b){a.extend(true,this,b);this._textRenderer.init({fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily})};a.jqplot.CanvasAxisLabelRenderer.prototype.getWidth=function(d){if(this._elem){return this._elem.outerWidth(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.sin(f.angle)*e)+Math.abs(Math.cos(f.angle)*c);return b}};a.jqplot.CanvasAxisLabelRenderer.prototype.getHeight=function(d){if(this._elem){return this._elem.outerHeight(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.cos(f.angle)*e)+Math.abs(Math.sin(f.angle)*c);return b}};a.jqplot.CanvasAxisLabelRenderer.prototype.getAngleRad=function(){var b=this.angle*Math.PI/180;return b};a.jqplot.CanvasAxisLabelRenderer.prototype.draw=function(c,f){if(this._elem){if(a.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined){window.G_vmlCanvasManager.uninitElement(this._elem.get(0))}this._elem.emptyForce();this._elem=null}var e=f.canvasManager.getCanvas();this._textRenderer.setText(this.label,c);var b=this.getWidth(c);var d=this.getHeight(c);e.width=b;e.height=d;e.style.width=b;e.style.height=d;e=f.canvasManager.initCanvas(e);this._elem=a(e);this._elem.css({position:"absolute"});this._elem.addClass("jqplot-"+this.axis+"-label");e=null;return this._elem};a.jqplot.CanvasAxisLabelRenderer.prototype.pack=function(){this._textRenderer.draw(this._elem.get(0).getContext("2d"),this.label)}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
    *  Class: $.jqplot.CanvasAxisTickRenderer
    * Renderer to draw axis ticks with a canvas element to support advanced
    * featrues such as rotated text.  This renderer uses a separate rendering engine
    * to draw the text on the canvas.  Two modes of rendering the text are available.
    * If the browser has native font support for canvas fonts (currently Mozila 3.5
    * and Safari 4), you can enable text rendering with the canvas fillText method.
    * You do so by setting the "enableFontSupport" option to true. 
    * 
    * Browsers lacking native font support will have the text drawn on the canvas
    * using the Hershey font metrics.  Even if the "enableFontSupport" option is true
    * non-supporting browsers will still render with the Hershey font.
    */
    $.jqplot.CanvasAxisTickRenderer = function(options) {
        // Group: Properties
        
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // prop: showMark
        // whether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // whether or not to draw the gridline on the grid at this tick.
        this.showGridline = true;
        // prop: isMinorTick
        // if this is a minor tick.
        this.isMinorTick = false;
        // prop: angle
        // angle of text, measured clockwise from x axis.
        this.angle = 0;
        // prop:  markSize
        // Length of the tick marks in pixels.  For 'cross' style, length
        // will be stoked above and below axis, so total length will be twice this.
        this.markSize = 4;
        // prop: show
        // whether or not to show the tick (mark and label).
        this.show = true;
        // prop: showLabel
        // whether or not to show the label.
        this.showLabel = true;
        // prop: labelPosition
        // 'auto', 'start', 'middle' or 'end'.
        // Whether tick label should be positioned so the start, middle, or end
        // of the tick mark.
        this.labelPosition = 'auto';
        this.label = '';
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.
        // The default $.jqplot.DefaultTickFormatter uses sprintf.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: prefix
        // String to prepend to the tick label.
        // Prefix is prepended to the formatted tick label.
        this.prefix = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily = '"Trebuchet MS", Arial, Helvetica, sans-serif';
        // prop: fontSize
        // CSS spec for font size.
        this.fontSize = '10pt';
        // prop: fontWeight
        // CSS spec for fontWeight
        this.fontWeight = 'normal';
        // prop: fontStretch
        // Multiplier to condense or expand font width.  
        // Applies only to browsers which don't support canvas native font rendering.
        this.fontStretch = 1.0;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = '#666666';
        // prop: enableFontSupport
        // true to turn on native canvas font support in Mozilla 3.5+ and Safari 4+.
        // If true, tick label will be drawn with canvas tag native support for fonts.
        // If false, tick label will be drawn with Hershey font metrics.
        this.enableFontSupport = true;
        // prop: pt2px
        // Point to pixel scaling factor, used for computing height of bounding box
        // around a label.  The labels text renderer has a default setting of 1.4, which 
        // should be suitable for most fonts.  Leave as null to use default.  If tops of
        // letters appear clipped, increase this.  If bounding box seems too big, decrease.
        // This is an issue only with the native font renderering capabilities of Mozilla
        // 3.5 and Safari 4 since they do not provide a method to determine the font height.
        this.pt2px = null;
        
        this._elem;
        this._ctx;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
        
        $.extend(true, this, options);
        
        var ropts = {fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily};
        if (this.pt2px) {
            ropts.pt2px = this.pt2px;
        }
        
        if (this.enableFontSupport) {
            if ($.jqplot.support_canvas_text()) {
                this._textRenderer = new $.jqplot.CanvasFontRenderer(ropts);
            }
            
            else {
                this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
            }
        }
        else {
            this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this._textRenderer.init({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily});
    };
    
    // return width along the x axis
    // will check first to see if an element exists.
    // if not, will return the computed text box width.
    $.jqplot.CanvasAxisTickRenderer.prototype.getWidth = function(ctx) {
        if (this._elem) {
         return this._elem.outerWidth(true);
        }
        else {
            var tr = this._textRenderer;
            var l = tr.getWidth(ctx);
            var h = tr.getHeight(ctx);
            var w = Math.abs(Math.sin(tr.angle)*h) + Math.abs(Math.cos(tr.angle)*l);
            return w;
        }
    };
    
    // return height along the y axis.
    $.jqplot.CanvasAxisTickRenderer.prototype.getHeight = function(ctx) {
        if (this._elem) {
         return this._elem.outerHeight(true);
        }
        else {
            var tr = this._textRenderer;
            var l = tr.getWidth(ctx);
            var h = tr.getHeight(ctx);
            var w = Math.abs(Math.cos(tr.angle)*h) + Math.abs(Math.sin(tr.angle)*l);
            return w;
        }
    };

    // return top.
    $.jqplot.CanvasAxisTickRenderer.prototype.getTop = function(ctx) {
        if (this._elem) {
         return this._elem.position().top;
        }
        else {
            return null;
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad = function() {
        var a = this.angle * Math.PI/180;
        return a;
    };
    
    
    $.jqplot.CanvasAxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        if (isMinor) {
            this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.draw = function(ctx, plot) {
        if (!this.label) {
            this.label = this.prefix + this.formatter(this.formatString, this.value);
        }
        
        // Memory Leaks patch
        if (this._elem) {
            if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
                window.G_vmlCanvasManager.uninitElement(this._elem.get(0));
            }
            
            this._elem.emptyForce();
            this._elem = null;
        }

        // create a canvas here, but can't draw on it untill it is appended
        // to dom for IE compatability.

        var elem = plot.canvasManager.getCanvas();

        this._textRenderer.setText(this.label, ctx);
        var w = this.getWidth(ctx);
        var h = this.getHeight(ctx);
        // canvases seem to need to have width and heigh attributes directly set.
        elem.width = w;
        elem.height = h;
        elem.style.width = w;
        elem.style.height = h;
        elem.style.textAlign = 'left';
        elem.style.position = 'absolute';

        elem = plot.canvasManager.initCanvas(elem);

        this._elem = $(elem);
        this._elem.css(this._styles);
        this._elem.addClass('jqplot-'+this.axis+'-tick');

        elem = null;
        return this._elem;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.pack = function() {
        this._textRenderer.draw(this._elem.get(0).getContext("2d"), this.label);
    };
    
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.CanvasAxisTickRenderer=function(b){this.mark="outside";this.showMark=true;this.showGridline=true;this.isMinorTick=false;this.angle=0;this.markSize=4;this.show=true;this.showLabel=true;this.labelPosition="auto";this.label="";this.value=null;this._styles={};this.formatter=a.jqplot.DefaultTickFormatter;this.formatString="";this.prefix="";this.fontFamily='"Trebuchet MS", Arial, Helvetica, sans-serif';this.fontSize="10pt";this.fontWeight="normal";this.fontStretch=1;this.textColor="#666666";this.enableFontSupport=true;this.pt2px=null;this._elem;this._ctx;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null};a.extend(true,this,b);var c={fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily};if(this.pt2px){c.pt2px=this.pt2px}if(this.enableFontSupport){if(a.jqplot.support_canvas_text()){this._textRenderer=new a.jqplot.CanvasFontRenderer(c)}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}};a.jqplot.CanvasAxisTickRenderer.prototype.init=function(b){a.extend(true,this,b);this._textRenderer.init({fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily})};a.jqplot.CanvasAxisTickRenderer.prototype.getWidth=function(d){if(this._elem){return this._elem.outerWidth(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.sin(f.angle)*e)+Math.abs(Math.cos(f.angle)*c);return b}};a.jqplot.CanvasAxisTickRenderer.prototype.getHeight=function(d){if(this._elem){return this._elem.outerHeight(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.cos(f.angle)*e)+Math.abs(Math.sin(f.angle)*c);return b}};a.jqplot.CanvasAxisTickRenderer.prototype.getTop=function(b){if(this._elem){return this._elem.position().top}else{return null}};a.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad=function(){var b=this.angle*Math.PI/180;return b};a.jqplot.CanvasAxisTickRenderer.prototype.setTick=function(b,d,c){this.value=b;if(c){this.isMinorTick=true}return this};a.jqplot.CanvasAxisTickRenderer.prototype.draw=function(c,f){if(!this.label){this.label=this.prefix+this.formatter(this.formatString,this.value)}if(this._elem){if(a.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined){window.G_vmlCanvasManager.uninitElement(this._elem.get(0))}this._elem.emptyForce();this._elem=null}var e=f.canvasManager.getCanvas();this._textRenderer.setText(this.label,c);var b=this.getWidth(c);var d=this.getHeight(c);e.width=b;e.height=d;e.style.width=b;e.style.height=d;e.style.textAlign="left";e.style.position="absolute";e=f.canvasManager.initCanvas(e);this._elem=a(e);this._elem.css(this._styles);this._elem.addClass("jqplot-"+this.axis+"-tick");e=null;return this._elem};a.jqplot.CanvasAxisTickRenderer.prototype.pack=function(){this._textRenderer.draw(this._elem.get(0).getContext("2d"),this.label)}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    var objCounter = 0;
    // class: $.jqplot.CanvasOverlay
    $.jqplot.CanvasOverlay = function(opts){
        var options = opts || {};
        this.options = {
            show: $.jqplot.config.enablePlugins,
            deferDraw: false
        };
        // prop: objects
        this.objects = [];
        this.objectNames = [];
        this.canvas = null;
        this.markerRenderer = new $.jqplot.MarkerRenderer({style:'line'});
        this.markerRenderer.init();
        this.highlightObjectIndex = null;
        if (options.objects) {
            var objs = options.objects,
                obj;
            for (var i=0; i<objs.length; i++) {
                obj = objs[i];
                for (var n in obj) {
                    switch (n) {
                        case 'line':
                            this.addLine(obj[n]);
                            break;
                        case 'horizontalLine':
                            this.addHorizontalLine(obj[n]);
                            break;
                        case 'dashedHorizontalLine':
                            this.addDashedHorizontalLine(obj[n]);
                            break;
                        case 'verticalLine':
                            this.addVerticalLine(obj[n]);
                            break;
                        case 'dashedVerticalLine':
                            this.addDashedVerticalLine(obj[n]);
                            break;
                        case 'rectangle':
                            this.addRectangle(obj[n]);
                            break;
                        default:
                            break;
                    }
                }   
            }
        }
        $.extend(true, this.options, options);
    };
    
    // called with scope of a plot object
    $.jqplot.CanvasOverlay.postPlotInit = function (target, data, opts) {
        var options = opts || {};
        // add a canvasOverlay attribute to the plot
        this.plugins.canvasOverlay = new $.jqplot.CanvasOverlay(options.canvasOverlay);     
    };


    function LineBase() {
        this.uid = null;
        this.type = null;
        this.gridStart = null;
        this.gridStop = null;
        this.tooltipWidthFactor = 0;
        this.options = {           
            // prop: name
            // Optional name for the overlay object.
            // Can be later used to retrieve the object by name.
            name: null,
            // prop: show
            // true to show (draw), false to not draw.
            show: true,
            // prop: lineWidth
            // Width of the line.
            lineWidth: 2,
            // prop: lineCap
            // Type of ending placed on the line ['round', 'butt', 'square']
            lineCap: 'round',
            // prop: color
            // color of the line
            color: '#666666',
            // prop: shadow
            // whether or not to draw a shadow on the line
            shadow: true,
            // prop: shadowAngle
            // Shadow angle in degrees
            shadowAngle: 45,
            // prop: shadowOffset
            // Shadow offset from line in pixels
            shadowOffset: 1,
            // prop: shadowDepth
            // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
            shadowDepth: 3,
            // prop: shadowAlpha
            // Alpha channel transparency of shadow.  0 = transparent.
            shadowAlpha: '0.07',
            // prop: xaxis
            // X axis to use for positioning/scaling the line.
            xaxis: 'xaxis',
            // prop: yaxis
            // Y axis to use for positioning/scaling the line.
            yaxis: 'yaxis',
            // prop: showTooltip
            // Show a tooltip with data point values.
            showTooltip: false,
            // prop: showTooltipPrecision
            // Controls how close to line cursor must be to show tooltip.
            // Higher number = closer to line, lower number = farther from line.
            // 1.0 = cursor must be over line.
            showTooltipPrecision: 0.6,
            // prop: tooltipLocation
            // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
            tooltipLocation: 'nw',
            // prop: fadeTooltip
            // true = fade in/out tooltip, flase = show/hide tooltip
            fadeTooltip: true,
            // prop: tooltipFadeSpeed
            // 'slow', 'def', 'fast', or number of milliseconds.
            tooltipFadeSpeed: "fast",
            // prop: tooltipOffset
            // Pixel offset of tooltip from the highlight.
            tooltipOffset: 4,
            // prop: tooltipFormatString
            // Format string passed the x and y values of the cursor on the line.
            // e.g., 'Dogs: %.2f, Cats: %d'.
            tooltipFormatString: '%d, %d'
        };
    }
    
    
    function Rectangle(options) {
        LineBase.call(this);
        this.type = 'rectangle';
        var opts = {
         // prop: xmin
                // x value for the start of the line, null to scale to axis min.
                xmin: null,
                // prop: xmax
                // x value for the end of the line, null to scale to axis max.
                xmax: null,
                // prop xOffset
                // offset ends of the line inside the grid. Number
                xOffset: '6px', // number or string. Number interpreted as units, string as pixels.
                xminOffset: null,
                xmaxOffset: null,
                
                ymin: null,
                ymax: null,
                yOffset: '6px', // number or string. Number interpreted as units, string as pixels.
                yminOffset: null,
                ymaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    Rectangle.prototype = new LineBase();
    Rectangle.prototype.constructor = Rectangle;

    
    /**
     * Class: Line
     * A straight line.
     */
    function Line(options) {
        LineBase.call(this);
        this.type = 'line';
        var opts = {
            // prop: start
            // [x, y] coordinates for the start of the line.
            start: [],
            // prop: stop
            // [x, y] coordinates for the end of the line.
            stop: []
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    Line.prototype = new LineBase();
    Line.prototype.constructor = Line;


    /**
     * Class: HorizontalLine
     * A straight horizontal line.
     */
    function HorizontalLine(options) {
        LineBase.call(this);
        this.type = 'horizontalLine';
        var opts = {
            // prop: y
            // y value to position the line
            y: null,
            // prop: xmin
            // x value for the start of the line, null to scale to axis min.
            xmin: null,
            // prop: xmax
            // x value for the end of the line, null to scale to axis max.
            xmax: null,
            // prop xOffset
            // offset ends of the line inside the grid.  Number 
            xOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    HorizontalLine.prototype = new LineBase();
    HorizontalLine.prototype.constructor = HorizontalLine;
    

    /**
     * Class: DashedHorizontalLine
     * A straight dashed horizontal line.
     */
    function DashedHorizontalLine(options) {
        LineBase.call(this);
        this.type = 'dashedHorizontalLine';
        var opts = {
            y: null,
            xmin: null,
            xmax: null,
            xOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null,
            // prop: dashPattern
            // Array of line, space settings in pixels.
            // Default is 8 pixel of line, 8 pixel of space.
            // Note, limit to a 2 element array b/c of bug with higher order arrays.
            dashPattern: [8,8]
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    DashedHorizontalLine.prototype = new LineBase();
    DashedHorizontalLine.prototype.constructor = DashedHorizontalLine;
    

    /**
     * Class: VerticalLine
     * A straight vertical line.
     */
    function VerticalLine(options) {
        LineBase.call(this);
        this.type = 'verticalLine';
        var opts = {
            x: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    VerticalLine.prototype = new LineBase();
    VerticalLine.prototype.constructor = VerticalLine;
    

    /**
     * Class: DashedVerticalLine
     * A straight dashed vertical line.
     */
    function DashedVerticalLine(options) {
        LineBase.call(this);
        this.type = 'dashedVerticalLine';
        this.start = null;
        this.stop = null;
        var opts = {
            x: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null,
            // prop: dashPattern
            // Array of line, space settings in pixels.
            // Default is 8 pixel of line, 8 pixel of space.
            // Note, limit to a 2 element array b/c of bug with higher order arrays.
            dashPattern: [8,8]
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    DashedVerticalLine.prototype = new LineBase();
    DashedVerticalLine.prototype.constructor = DashedVerticalLine;
    
    $.jqplot.CanvasOverlay.prototype.addLine = function(opts) {
        var line = new Line(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addHorizontalLine = function(opts) {
        var line = new HorizontalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addDashedHorizontalLine = function(opts) {
        var line = new DashedHorizontalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addVerticalLine = function(opts) {
        var line = new VerticalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addDashedVerticalLine = function(opts) {
        var line = new DashedVerticalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addRectangle = function(opts) {
        var line = new Rectangle(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.removeObject = function(idx) {
        // check if integer, remove by index
        if ($.type(idx) == 'number') {
            this.objects.splice(idx, 1);
            this.objectNames.splice(idx, 1);
        }
        // if string, remove by name
        else {
            var id = $.inArray(idx, this.objectNames);
            if (id != -1) {
                this.objects.splice(id, 1);
                this.objectNames.splice(id, 1);
            }
        }
    };
    
    $.jqplot.CanvasOverlay.prototype.getObject = function(idx) {
        // check if integer, remove by index
        if ($.type(idx) == 'number') {
            return this.objects[idx];
        }
        // if string, remove by name
        else {
            var id = $.inArray(idx, this.objectNames);
            if (id != -1) {
                return this.objects[id];
            }
        }
    };
    
    // Set get as alias for getObject.
    $.jqplot.CanvasOverlay.prototype.get = $.jqplot.CanvasOverlay.prototype.getObject;
    
    $.jqplot.CanvasOverlay.prototype.clear = function(plot) {
        this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(), this.canvas.getHeight());
    };
    
    $.jqplot.CanvasOverlay.prototype.draw = function(plot) {
        var obj, 
            objs = this.objects,
            mr = this.markerRenderer,
            start,
            stop;
        if (this.options.show) {
            this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(), this.canvas.getHeight());
            for (var k=0; k<objs.length; k++) {
                obj = objs[k];
                var opts = $.extend(true, {}, obj.options);
                if (obj.options.show) {
                    // style and shadow properties should be set before
                    // every draw of marker renderer.
                    mr.shadow = obj.options.shadow;
                    obj.tooltipWidthFactor = obj.options.lineWidth / obj.options.showTooltipPrecision;
                    switch (obj.type) {
                        case 'line':
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            mr.style = 'line';
                            opts.closePath = false;
                            start = [plot.axes[obj.options.xaxis].series_u2p(obj.options.start[0]), plot.axes[obj.options.yaxis].series_u2p(obj.options.start[1])];
                            stop = [plot.axes[obj.options.xaxis].series_u2p(obj.options.stop[0]), plot.axes[obj.options.yaxis].series_u2p(obj.options.stop[1])];
                            obj.gridStart = start;
                            obj.gridStop = stop;
                            mr.draw(start, stop, this.canvas._ctx, opts);
                            break;
                        case 'horizontalLine':
                            
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.y != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                                if (obj.options.xmin != null) {
                                    xstart = xaxis.series_u2p(obj.options.xmin);
                                }
                                else if (xminoff != null) {
                                    if ($.type(xminoff) == "number") {
                                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                    }
                                    else if ($.type(xminoff) == "string") {
                                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                    }
                                }
                                if (obj.options.xmax != null) {
                                    xstop = xaxis.series_u2p(obj.options.xmax);
                                }
                                else if (xmaxoff != null) {
                                    if ($.type(xmaxoff) == "number") {
                                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                    }
                                    else if ($.type(xmaxoff) == "string") {
                                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                    }
                                }
                                if (xstop != null && xstart != null) {
                                    obj.gridStart = [xstart, y];
                                    obj.gridStop = [xstop, y];
                                    mr.draw([xstart, y], [xstop, y], this.canvas._ctx, opts);
                                }
                            }
                            break;

                        case 'dashedHorizontalLine':
                            
                            var dashPat = obj.options.dashPattern;
                            var dashPatLen = 0;
                            for (var i=0; i<dashPat.length; i++) {
                                dashPatLen += dashPat[i];
                            }

                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.y != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                                if (obj.options.xmin != null) {
                                    xstart = xaxis.series_u2p(obj.options.xmin);
                                }
                                else if (xminoff != null) {
                                    if ($.type(xminoff) == "number") {
                                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                    }
                                    else if ($.type(xminoff) == "string") {
                                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                    }
                                }
                                if (obj.options.xmax != null) {
                                    xstop = xaxis.series_u2p(obj.options.xmax);
                                }
                                else if (xmaxoff != null) {
                                    if ($.type(xmaxoff) == "number") {
                                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                    }
                                    else if ($.type(xmaxoff) == "string") {
                                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                    }
                                }
                                if (xstop != null && xstart != null) {
                                    obj.gridStart = [xstart, y];
                                    obj.gridStop = [xstop, y];
                                    var numDash = Math.ceil((xstop - xstart)/dashPatLen);
                                    var b=xstart, e;
                                    for (var i=0; i<numDash; i++) {
                                        for (var j=0; j<dashPat.length; j+=2) {
                                            e = b+dashPat[j];
                                            mr.draw([b, y], [e, y], this.canvas._ctx, opts);
                                            b += dashPat[j];
                                            if (j < dashPat.length-1) {
                                                b += dashPat[j+1];
                                            }
                                        }
                                    }
                                }
                            }
                            break;

                        case 'verticalLine':
                            
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.x != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var yaxis = plot.axes[obj.options.yaxis],
                                    ystart,
                                    ystop,
                                    x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                    yminoff = obj.options.yminOffset || obj.options.yOffset,
                                    ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                                if (obj.options.ymin != null) {
                                    ystart = yaxis.series_u2p(obj.options.ymin);
                                }
                                else if (yminoff != null) {
                                    if ($.type(yminoff) == "number") {
                                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                    }
                                    else if ($.type(yminoff) == "string") {
                                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                    }
                                }
                                if (obj.options.ymax != null) {
                                    ystop = yaxis.series_u2p(obj.options.ymax);
                                }
                                else if (ymaxoff != null) {
                                    if ($.type(ymaxoff) == "number") {
                                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                    }
                                    else if ($.type(ymaxoff) == "string") {
                                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                    }
                                }
                                if (ystop != null && ystart != null) {
                                    obj.gridStart = [x, ystart];
                                    obj.gridStop = [x, ystop];
                                    mr.draw([x, ystart], [x, ystop], this.canvas._ctx, opts);
                                }
                            }
                            break;

                        case 'dashedVerticalLine':
                            
                            var dashPat = obj.options.dashPattern;
                            var dashPatLen = 0;
                            for (var i=0; i<dashPat.length; i++) {
                                dashPatLen += dashPat[i];
                            }

                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.x != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var yaxis = plot.axes[obj.options.yaxis],
                                    ystart,
                                    ystop,
                                    x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                    yminoff = obj.options.yminOffset || obj.options.yOffset,
                                    ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                                if (obj.options.ymin != null) {
                                    ystart = yaxis.series_u2p(obj.options.ymin);
                                }
                                else if (yminoff != null) {
                                    if ($.type(yminoff) == "number") {
                                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                    }
                                    else if ($.type(yminoff) == "string") {
                                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                    }
                                }
                                if (obj.options.ymax != null) {
                                    ystop = yaxis.series_u2p(obj.options.ymax);
                                }
                                else if (ymaxoff != null) {
                                    if ($.type(ymaxoff) == "number") {
                                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                    }
                                    else if ($.type(ymaxoff) == "string") {
                                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                    }
                                }


                                if (ystop != null && ystart != null) {
                                    obj.gridStart = [x, ystart];
                                    obj.gridStop = [x, ystop];
                                    var numDash = Math.ceil((ystart - ystop)/dashPatLen);
                                    var firstDashAdjust = ((numDash * dashPatLen) - (ystart - ystop))/2.0;
                                    var b=ystart, e, bs, es;
                                    for (var i=0; i<numDash; i++) {
                                        for (var j=0; j<dashPat.length; j+=2) {
                                            e = b - dashPat[j];
                                            if (e < ystop) {
                                                e = ystop;
                                            }
                                            if (b < ystop) {
                                                b = ystop;
                                            }
                                            // es = e;
                                            // if (i == 0) {
                                            //  es += firstDashAdjust;
                                            // }
                                            mr.draw([x, b], [x, e], this.canvas._ctx, opts);
                                            b -= dashPat[j];
                                            if (j < dashPat.length-1) {
                                                b -= dashPat[j+1];
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                            
                        case 'rectangle':
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            mr.style = 'line';
                            opts.closePath = true;
                            
                            var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                            if (obj.options.xmin != null) {
                                xstart = xaxis.series_u2p(obj.options.xmin);
                            }
                            else if (xminoff != null) {
                                if ($.type(xminoff) == "number") {
                                    xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                }
                                else if ($.type(xminoff) == "string") {
                                    xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                }
                            }
                            if (obj.options.xmax != null) {
                                xstop = xaxis.series_u2p(obj.options.xmax);
                            }
                            else if (xmaxoff != null) {
                                if ($.type(xmaxoff) == "number") {
                                    xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                }
                                else if ($.type(xmaxoff) == "string") {
                                    xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                }
                            }
                            
                            var yaxis = plot.axes[obj.options.yaxis],
                                ystart,
                                ystop,
                                x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                yminoff = obj.options.yminOffset || obj.options.yOffset,
                                ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                            if (obj.options.ymin != null) {
                                ystart = yaxis.series_u2p(obj.options.ymin);
                            }
                            else if (yminoff != null) {
                                if ($.type(yminoff) == "number") {
                                    ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                }
                                else if ($.type(yminoff) == "string") {
                                    ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                }
                            }
                            if (obj.options.ymax != null) {
                                ystop = yaxis.series_u2p(obj.options.ymax);
                            }
                            else if (ymaxoff != null) {
                                if ($.type(ymaxoff) == "number") {
                                    ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                }
                                else if ($.type(ymaxoff) == "string") {
                                    ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                }
                            }
                            

                            if (xstop != null && xstart != null && ystop != null && ystart != null) {
                                obj.gridStart = [xstart, ystart];
                                obj.gridStop = [xstop, ystop];
                                
                                this.canvas._ctx.fillStyle = obj.options.color;
                                this.canvas._ctx.fillRect(xstart, ystart, xstop - xstart, ystop - ystart);
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.CanvasOverlay.postPlotDraw = function() {
        var co = this.plugins.canvasOverlay;
        // Memory Leaks patch    
        if (co && co.highlightCanvas) {
            co.highlightCanvas.resetCanvas();
            co.highlightCanvas = null;
        }
        co.canvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(co.canvas.createElement(this._gridPadding, 'jqplot-overlayCanvas-canvas', this._plotDimensions, this));
        co.canvas.setContext();
        if (!co.deferDraw) {
            co.draw(this);
        }

        var elem = document.createElement('div');
        co._tooltipElem = $(elem);
        elem = null;
        co._tooltipElem.addClass('jqplot-canvasOverlay-tooltip');
        co._tooltipElem.css({position:'absolute', display:'none'});
        
        this.eventCanvas._elem.before(co._tooltipElem);
        this.eventCanvas._elem.bind('mouseleave', { elem: co._tooltipElem }, function (ev) { ev.data.elem.hide(); });

        var co = null;
    };


    function showTooltip(plot, obj, gridpos, datapos) {
        var co = plot.plugins.canvasOverlay;
        var elem = co._tooltipElem;

        var opts = obj.options, x, y;

        elem.html($.jqplot.sprintf(opts.tooltipFormatString, datapos[0], datapos[1]));
        
        switch (opts.tooltipLocation) {
            case 'nw':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true)/2;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                x = gridpos[0] + plot._gridPadding.left + opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                x = gridpos[0] + plot._gridPadding.left + opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                x = gridpos[0] + plot._gridPadding.left + opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset;
                break;
            case 's':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true)/2;
                y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset;
                break;
            case 'sw':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset;
                break;
            case 'w':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
        }

        elem.css('left', x);
        elem.css('top', y);
        if (opts.fadeTooltip) {
            // Fix for stacked up animations.  Thnanks Trevor!
            elem.stop(true,true).fadeIn(opts.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        elem = null;
    }


    function isNearLine(point, lstart, lstop, width) {
        // r is point to test, p and q are end points.
        var rx = point[0];
        var ry = point[1];
        var px = Math.round(lstop[0]);
        var py = Math.round(lstop[1]);
        var qx = Math.round(lstart[0]);
        var qy = Math.round(lstart[1]);

        var l = Math.sqrt(Math.pow(px-qx, 2) + Math.pow(py-qy, 2));

        // scale error term by length of line.
        var eps = width*l;
        var res = Math.abs((qx-px) * (ry-py) - (qy-py) * (rx-px));
        var ret = (res < eps) ? true : false;
        return ret;
    }
    
    function isNearRectangle(point, lstart, lstop, width) {
        // r is point to test, p and q are end points.
        var rx = point[0];
        var ry = point[1];
        var px = Math.round(lstop[0]);
        var py = Math.round(lstop[1]);
        var qx = Math.round(lstart[0]);
        var qy = Math.round(lstart[1]);
        
        var temp;
        if (px > qx) { temp = px; px = qx; qx = temp; }
        if (py > qy) { temp = py; py = qy; qy = temp; }
        
        var ret = (rx >= px && rx <= qx && ry >= py && ry <= qy);
        
        return ret;
    }


    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var co = plot.plugins.canvasOverlay;
        var objs = co.objects;
        var l = objs.length;
        var obj, haveHighlight=false;
        var elem;
        for (var i=0; i<l; i++) {
            obj = objs[i];
            if (obj.options.showTooltip) {
            	var n;
                if (obj.type === 'rectangle') {
                 n = isNearRectangle([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop, obj.tooltipWidthFactor);
                } else {
                 n = isNearLine([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop, obj.tooltipWidthFactor);
                }
                datapos = [plot.axes[obj.options.xaxis].series_p2u(gridpos.x), plot.axes[obj.options.yaxis].series_p2u(gridpos.y)];

                // cases:
                //    near line, no highlighting
                //    near line, highliting on this line
                //    near line, highlighting another line
                //    not near any line, highlighting
                //    not near any line, no highlighting

                // near line, not currently highlighting
                if (n && co.highlightObjectIndex == null) {
                    switch (obj.type) {
                        case 'line':
                            showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                            break;

                        case 'horizontalLine':
                        case 'dashedHorizontalLine':
                            showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                            break;

                        case 'verticalLine':
                        case 'dashedVerticalLine':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        case 'rectangle':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        default:
                            break;
                    } 
                    co.highlightObjectIndex = i;
                    haveHighlight = true;
                    break;
                }

                // near line, highlighting another line.
                else if (n && co.highlightObjectIndex !== i) {
                    // turn off tooltip.
                    elem = co._tooltipElem;
                    if (obj.fadeTooltip) {
                        elem.fadeOut(obj.tooltipFadeSpeed);
                    }
                    else {
                        elem.hide();
                    }

                    // turn on right tooltip.
                    switch (obj.type) {
                        case 'line':
                            showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                            break;

                        case 'horizontalLine':
                        case 'dashedHorizontalLine':
                            showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                            break;

                        case 'verticalLine':
                        case 'dashedVerticalLine':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        case 'rectangle':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        default:
                            break;
                    }

                    co.highlightObjectIndex = i;
                    haveHighlight = true;
                    break;
                }

                // near line, already highlighting this line, update
                else if (n) {
                    switch (obj.type) {
                        case 'line':
                            showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                            break;

                        case 'horizontalLine':
                        case 'dashedHorizontalLine':
                            showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                            break;

                        case 'verticalLine':
                        case 'dashedVerticalLine':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        case 'rectangle':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        default:
                            break;
                    }

                    haveHighlight = true;
                    break;
                }
            }
        }

        // check if we are highlighting and not near a line, turn it off.
        if (!haveHighlight && co.highlightObjectIndex !== null) {
            elem = co._tooltipElem;
            obj = co.getObject(co.highlightObjectIndex);
            if (obj.fadeTooltip) {
                elem.fadeOut(obj.tooltipFadeSpeed);
            }
            else {
                elem.hide();
            }
            co.highlightObjectIndex = null;
        }
    }
    
    $.jqplot.postInitHooks.push($.jqplot.CanvasOverlay.postPlotInit);
    $.jqplot.postDrawHooks.push($.jqplot.CanvasOverlay.postPlotDraw);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);

})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(d){var f=0;d.jqplot.CanvasOverlay=function(q){var o=q||{};this.options={show:d.jqplot.config.enablePlugins,deferDraw:false};this.objects=[];this.objectNames=[];this.canvas=null;this.markerRenderer=new d.jqplot.MarkerRenderer({style:"line"});this.markerRenderer.init();this.highlightObjectIndex=null;if(o.objects){var s=o.objects,r;for(var p=0;p<s.length;p++){r=s[p];for(var t in r){switch(t){case"line":this.addLine(r[t]);break;case"horizontalLine":this.addHorizontalLine(r[t]);break;case"dashedHorizontalLine":this.addDashedHorizontalLine(r[t]);break;case"verticalLine":this.addVerticalLine(r[t]);break;case"dashedVerticalLine":this.addDashedVerticalLine(r[t]);break;case"rectangle":this.addRectangle(r[t]);break;default:break}}}}d.extend(true,this.options,o)};d.jqplot.CanvasOverlay.postPlotInit=function(q,p,o){var n=o||{};this.plugins.canvasOverlay=new d.jqplot.CanvasOverlay(n.canvasOverlay)};function i(){this.uid=null;this.type=null;this.gridStart=null;this.gridStop=null;this.tooltipWidthFactor=0;this.options={name:null,show:true,lineWidth:2,lineCap:"round",color:"#666666",shadow:true,shadowAngle:45,shadowOffset:1,shadowDepth:3,shadowAlpha:"0.07",xaxis:"xaxis",yaxis:"yaxis",showTooltip:false,showTooltipPrecision:0.6,tooltipLocation:"nw",fadeTooltip:true,tooltipFadeSpeed:"fast",tooltipOffset:4,tooltipFormatString:"%d, %d"}}function m(n){i.call(this);this.type="rectangle";var o={xmin:null,xmax:null,xOffset:"6px",xminOffset:null,xmaxOffset:null,ymin:null,ymax:null,yOffset:"6px",yminOffset:null,ymaxOffset:null};d.extend(true,this.options,o,n);if(this.options.showTooltipPrecision<0.01){this.options.showTooltipPrecision=0.01}}m.prototype=new i();m.prototype.constructor=m;function b(n){i.call(this);this.type="line";var o={start:[],stop:[]};d.extend(true,this.options,o,n);if(this.options.showTooltipPrecision<0.01){this.options.showTooltipPrecision=0.01}}b.prototype=new i();b.prototype.constructor=b;function e(n){i.call(this);this.type="horizontalLine";var o={y:null,xmin:null,xmax:null,xOffset:"6px",xminOffset:null,xmaxOffset:null};d.extend(true,this.options,o,n);if(this.options.showTooltipPrecision<0.01){this.options.showTooltipPrecision=0.01}}e.prototype=new i();e.prototype.constructor=e;function j(n){i.call(this);this.type="dashedHorizontalLine";var o={y:null,xmin:null,xmax:null,xOffset:"6px",xminOffset:null,xmaxOffset:null,dashPattern:[8,8]};d.extend(true,this.options,o,n);if(this.options.showTooltipPrecision<0.01){this.options.showTooltipPrecision=0.01}}j.prototype=new i();j.prototype.constructor=j;function c(n){i.call(this);this.type="verticalLine";var o={x:null,ymin:null,ymax:null,yOffset:"6px",yminOffset:null,ymaxOffset:null};d.extend(true,this.options,o,n);if(this.options.showTooltipPrecision<0.01){this.options.showTooltipPrecision=0.01}}c.prototype=new i();c.prototype.constructor=c;function l(n){i.call(this);this.type="dashedVerticalLine";this.start=null;this.stop=null;var o={x:null,ymin:null,ymax:null,yOffset:"6px",yminOffset:null,ymaxOffset:null,dashPattern:[8,8]};d.extend(true,this.options,o,n);if(this.options.showTooltipPrecision<0.01){this.options.showTooltipPrecision=0.01}}l.prototype=new i();l.prototype.constructor=l;d.jqplot.CanvasOverlay.prototype.addLine=function(o){var n=new b(o);n.uid=f++;this.objects.push(n);this.objectNames.push(n.options.name)};d.jqplot.CanvasOverlay.prototype.addHorizontalLine=function(o){var n=new e(o);n.uid=f++;this.objects.push(n);this.objectNames.push(n.options.name)};d.jqplot.CanvasOverlay.prototype.addDashedHorizontalLine=function(o){var n=new j(o);n.uid=f++;this.objects.push(n);this.objectNames.push(n.options.name)};d.jqplot.CanvasOverlay.prototype.addVerticalLine=function(o){var n=new c(o);n.uid=f++;this.objects.push(n);this.objectNames.push(n.options.name)};d.jqplot.CanvasOverlay.prototype.addDashedVerticalLine=function(o){var n=new l(o);n.uid=f++;this.objects.push(n);this.objectNames.push(n.options.name)};d.jqplot.CanvasOverlay.prototype.addRectangle=function(o){var n=new m(o);n.uid=f++;this.objects.push(n);this.objectNames.push(n.options.name)};d.jqplot.CanvasOverlay.prototype.removeObject=function(n){if(d.type(n)=="number"){this.objects.splice(n,1);this.objectNames.splice(n,1)}else{var o=d.inArray(n,this.objectNames);if(o!=-1){this.objects.splice(o,1);this.objectNames.splice(o,1)}}};d.jqplot.CanvasOverlay.prototype.getObject=function(n){if(d.type(n)=="number"){return this.objects[n]}else{var o=d.inArray(n,this.objectNames);if(o!=-1){return this.objects[o]}}};d.jqplot.CanvasOverlay.prototype.get=d.jqplot.CanvasOverlay.prototype.getObject;d.jqplot.CanvasOverlay.prototype.clear=function(n){this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(),this.canvas.getHeight())};d.jqplot.CanvasOverlay.prototype.draw=function(K){var A,v=this.objects,F=this.markerRenderer,s,G;if(this.options.show){this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(),this.canvas.getHeight());for(var H=0;H<v.length;H++){A=v[H];var B=d.extend(true,{},A.options);if(A.options.show){F.shadow=A.options.shadow;A.tooltipWidthFactor=A.options.lineWidth/A.options.showTooltipPrecision;switch(A.type){case"line":F.style="line";B.closePath=false;s=[K.axes[A.options.xaxis].series_u2p(A.options.start[0]),K.axes[A.options.yaxis].series_u2p(A.options.start[1])];G=[K.axes[A.options.xaxis].series_u2p(A.options.stop[0]),K.axes[A.options.yaxis].series_u2p(A.options.stop[1])];A.gridStart=s;A.gridStop=G;F.draw(s,G,this.canvas._ctx,B);break;case"horizontalLine":if(A.options.y!=null){F.style="line";B.closePath=false;var p=K.axes[A.options.xaxis],S,L,w=K.axes[A.options.yaxis].series_u2p(A.options.y),I=A.options.xminOffset||A.options.xOffset,t=A.options.xmaxOffset||A.options.xOffset;if(A.options.xmin!=null){S=p.series_u2p(A.options.xmin)}else{if(I!=null){if(d.type(I)=="number"){S=p.series_u2p(p.min+I)}else{if(d.type(I)=="string"){S=p.series_u2p(p.min)+parseFloat(I)}}}}if(A.options.xmax!=null){L=p.series_u2p(A.options.xmax)}else{if(t!=null){if(d.type(t)=="number"){L=p.series_u2p(p.max-t)}else{if(d.type(t)=="string"){L=p.series_u2p(p.max)-parseFloat(t)}}}}if(L!=null&&S!=null){A.gridStart=[S,w];A.gridStop=[L,w];F.draw([S,w],[L,w],this.canvas._ctx,B)}}break;case"dashedHorizontalLine":var o=A.options.dashPattern;var E=0;for(var M=0;M<o.length;M++){E+=o[M]}if(A.options.y!=null){F.style="line";B.closePath=false;var p=K.axes[A.options.xaxis],S,L,w=K.axes[A.options.yaxis].series_u2p(A.options.y),I=A.options.xminOffset||A.options.xOffset,t=A.options.xmaxOffset||A.options.xOffset;if(A.options.xmin!=null){S=p.series_u2p(A.options.xmin)}else{if(I!=null){if(d.type(I)=="number"){S=p.series_u2p(p.min+I)}else{if(d.type(I)=="string"){S=p.series_u2p(p.min)+parseFloat(I)}}}}if(A.options.xmax!=null){L=p.series_u2p(A.options.xmax)}else{if(t!=null){if(d.type(t)=="number"){L=p.series_u2p(p.max-t)}else{if(d.type(t)=="string"){L=p.series_u2p(p.max)-parseFloat(t)}}}}if(L!=null&&S!=null){A.gridStart=[S,w];A.gridStop=[L,w];var r=Math.ceil((L-S)/E);var Q=S,O;for(var M=0;M<r;M++){for(var J=0;J<o.length;J+=2){O=Q+o[J];F.draw([Q,w],[O,w],this.canvas._ctx,B);Q+=o[J];if(J<o.length-1){Q+=o[J+1]}}}}}break;case"verticalLine":if(A.options.x!=null){F.style="line";B.closePath=false;var N=K.axes[A.options.yaxis],n,u,z=K.axes[A.options.xaxis].series_u2p(A.options.x),D=A.options.yminOffset||A.options.yOffset,q=A.options.ymaxOffset||A.options.yOffset;if(A.options.ymin!=null){n=N.series_u2p(A.options.ymin)}else{if(D!=null){if(d.type(D)=="number"){n=N.series_u2p(N.min-D)}else{if(d.type(D)=="string"){n=N.series_u2p(N.min)-parseFloat(D)}}}}if(A.options.ymax!=null){u=N.series_u2p(A.options.ymax)}else{if(q!=null){if(d.type(q)=="number"){u=N.series_u2p(N.max+q)}else{if(d.type(q)=="string"){u=N.series_u2p(N.max)+parseFloat(q)}}}}if(u!=null&&n!=null){A.gridStart=[z,n];A.gridStop=[z,u];F.draw([z,n],[z,u],this.canvas._ctx,B)}}break;case"dashedVerticalLine":var o=A.options.dashPattern;var E=0;for(var M=0;M<o.length;M++){E+=o[M]}if(A.options.x!=null){F.style="line";B.closePath=false;var N=K.axes[A.options.yaxis],n,u,z=K.axes[A.options.xaxis].series_u2p(A.options.x),D=A.options.yminOffset||A.options.yOffset,q=A.options.ymaxOffset||A.options.yOffset;if(A.options.ymin!=null){n=N.series_u2p(A.options.ymin)}else{if(D!=null){if(d.type(D)=="number"){n=N.series_u2p(N.min-D)}else{if(d.type(D)=="string"){n=N.series_u2p(N.min)-parseFloat(D)}}}}if(A.options.ymax!=null){u=N.series_u2p(A.options.ymax)}else{if(q!=null){if(d.type(q)=="number"){u=N.series_u2p(N.max+q)}else{if(d.type(q)=="string"){u=N.series_u2p(N.max)+parseFloat(q)}}}}if(u!=null&&n!=null){A.gridStart=[z,n];A.gridStop=[z,u];var r=Math.ceil((n-u)/E);var C=((r*E)-(n-u))/2;var Q=n,O,P,R;for(var M=0;M<r;M++){for(var J=0;J<o.length;J+=2){O=Q-o[J];if(O<u){O=u}if(Q<u){Q=u}F.draw([z,Q],[z,O],this.canvas._ctx,B);Q-=o[J];if(J<o.length-1){Q-=o[J+1]}}}}}break;case"rectangle":F.style="line";B.closePath=true;var p=K.axes[A.options.xaxis],S,L,w=K.axes[A.options.yaxis].series_u2p(A.options.y),I=A.options.xminOffset||A.options.xOffset,t=A.options.xmaxOffset||A.options.xOffset;if(A.options.xmin!=null){S=p.series_u2p(A.options.xmin)}else{if(I!=null){if(d.type(I)=="number"){S=p.series_u2p(p.min+I)}else{if(d.type(I)=="string"){S=p.series_u2p(p.min)+parseFloat(I)}}}}if(A.options.xmax!=null){L=p.series_u2p(A.options.xmax)}else{if(t!=null){if(d.type(t)=="number"){L=p.series_u2p(p.max-t)}else{if(d.type(t)=="string"){L=p.series_u2p(p.max)-parseFloat(t)}}}}var N=K.axes[A.options.yaxis],n,u,z=K.axes[A.options.xaxis].series_u2p(A.options.x),D=A.options.yminOffset||A.options.yOffset,q=A.options.ymaxOffset||A.options.yOffset;if(A.options.ymin!=null){n=N.series_u2p(A.options.ymin)}else{if(D!=null){if(d.type(D)=="number"){n=N.series_u2p(N.min-D)}else{if(d.type(D)=="string"){n=N.series_u2p(N.min)-parseFloat(D)}}}}if(A.options.ymax!=null){u=N.series_u2p(A.options.ymax)}else{if(q!=null){if(d.type(q)=="number"){u=N.series_u2p(N.max+q)}else{if(d.type(q)=="string"){u=N.series_u2p(N.max)+parseFloat(q)}}}}if(L!=null&&S!=null&&u!=null&&n!=null){A.gridStart=[S,n];A.gridStop=[L,u];this.canvas._ctx.fillStyle=A.options.color;this.canvas._ctx.fillRect(S,n,L-S,u-n)}break;default:break}}}}};d.jqplot.CanvasOverlay.postPlotDraw=function(){var o=this.plugins.canvasOverlay;if(o&&o.highlightCanvas){o.highlightCanvas.resetCanvas();o.highlightCanvas=null}o.canvas=new d.jqplot.GenericCanvas();this.eventCanvas._elem.before(o.canvas.createElement(this._gridPadding,"jqplot-overlayCanvas-canvas",this._plotDimensions,this));o.canvas.setContext();if(!o.deferDraw){o.draw(this)}var n=document.createElement("div");o._tooltipElem=d(n);n=null;o._tooltipElem.addClass("jqplot-canvasOverlay-tooltip");o._tooltipElem.css({position:"absolute",display:"none"});this.eventCanvas._elem.before(o._tooltipElem);this.eventCanvas._elem.bind("mouseleave",{elem:o._tooltipElem},function(p){p.data.elem.hide()});var o=null};function k(s,q,r,p){var u=s.plugins.canvasOverlay;var o=u._tooltipElem;var n=q.options,v,t;o.html(d.jqplot.sprintf(n.tooltipFormatString,p[0],p[1]));switch(n.tooltipLocation){case"nw":v=r[0]+s._gridPadding.left-o.outerWidth(true)-n.tooltipOffset;t=r[1]+s._gridPadding.top-n.tooltipOffset-o.outerHeight(true);break;case"n":v=r[0]+s._gridPadding.left-o.outerWidth(true)/2;t=r[1]+s._gridPadding.top-n.tooltipOffset-o.outerHeight(true);break;case"ne":v=r[0]+s._gridPadding.left+n.tooltipOffset;t=r[1]+s._gridPadding.top-n.tooltipOffset-o.outerHeight(true);break;case"e":v=r[0]+s._gridPadding.left+n.tooltipOffset;t=r[1]+s._gridPadding.top-o.outerHeight(true)/2;break;case"se":v=r[0]+s._gridPadding.left+n.tooltipOffset;t=r[1]+s._gridPadding.top+n.tooltipOffset;break;case"s":v=r[0]+s._gridPadding.left-o.outerWidth(true)/2;t=r[1]+s._gridPadding.top+n.tooltipOffset;break;case"sw":v=r[0]+s._gridPadding.left-o.outerWidth(true)-n.tooltipOffset;t=r[1]+s._gridPadding.top+n.tooltipOffset;break;case"w":v=r[0]+s._gridPadding.left-o.outerWidth(true)-n.tooltipOffset;t=r[1]+s._gridPadding.top-o.outerHeight(true)/2;break;default:v=r[0]+s._gridPadding.left-o.outerWidth(true)-n.tooltipOffset;t=r[1]+s._gridPadding.top-n.tooltipOffset-o.outerHeight(true);break}o.css("left",v);o.css("top",t);if(n.fadeTooltip){o.stop(true,true).fadeIn(n.tooltipFadeSpeed)}else{o.show()}o=null}function h(z,q,s,p){var o=z[0];var n=z[1];var y=Math.round(s[0]);var x=Math.round(s[1]);var u=Math.round(q[0]);var t=Math.round(q[1]);var r=Math.sqrt(Math.pow(y-u,2)+Math.pow(x-t,2));var A=p*r;var w=Math.abs((u-y)*(n-x)-(t-x)*(o-y));var v=(w<A)?true:false;return v}function g(x,q,r,p){var o=x[0];var n=x[1];var w=Math.round(r[0]);var v=Math.round(r[1]);var t=Math.round(q[0]);var s=Math.round(q[1]);var y;if(w>t){y=w;w=t;t=y}if(v>s){y=v;v=s;s=y}var u=(o>=w&&o<=t&&n>=v&&n<=s);return u}function a(z,w,r,A,x){var y=x.plugins.canvasOverlay;var v=y.objects;var s=v.length;var u,o=false;var q;for(var t=0;t<s;t++){u=v[t];if(u.options.showTooltip){var p;if(u.type==="rectangle"){p=g([w.x,w.y],u.gridStart,u.gridStop,u.tooltipWidthFactor)}else{p=h([w.x,w.y],u.gridStart,u.gridStop,u.tooltipWidthFactor)}r=[x.axes[u.options.xaxis].series_p2u(w.x),x.axes[u.options.yaxis].series_p2u(w.y)];if(p&&y.highlightObjectIndex==null){switch(u.type){case"line":k(x,u,[w.x,w.y],r);break;case"horizontalLine":case"dashedHorizontalLine":k(x,u,[w.x,u.gridStart[1]],[r[0],u.options.y]);break;case"verticalLine":case"dashedVerticalLine":k(x,u,[u.gridStart[0],w.y],[u.options.x,r[1]]);break;case"rectangle":k(x,u,[u.gridStart[0],w.y],[u.options.x,r[1]]);break;default:break}y.highlightObjectIndex=t;o=true;break}else{if(p&&y.highlightObjectIndex!==t){q=y._tooltipElem;if(u.fadeTooltip){q.fadeOut(u.tooltipFadeSpeed)}else{q.hide()}switch(u.type){case"line":k(x,u,[w.x,w.y],r);break;case"horizontalLine":case"dashedHorizontalLine":k(x,u,[w.x,u.gridStart[1]],[r[0],u.options.y]);break;case"verticalLine":case"dashedVerticalLine":k(x,u,[u.gridStart[0],w.y],[u.options.x,r[1]]);break;case"rectangle":k(x,u,[u.gridStart[0],w.y],[u.options.x,r[1]]);break;default:break}y.highlightObjectIndex=t;o=true;break}else{if(p){switch(u.type){case"line":k(x,u,[w.x,w.y],r);break;case"horizontalLine":case"dashedHorizontalLine":k(x,u,[w.x,u.gridStart[1]],[r[0],u.options.y]);break;case"verticalLine":case"dashedVerticalLine":k(x,u,[u.gridStart[0],w.y],[u.options.x,r[1]]);break;case"rectangle":k(x,u,[u.gridStart[0],w.y],[u.options.x,r[1]]);break;default:break}o=true;break}}}}}if(!o&&y.highlightObjectIndex!==null){q=y._tooltipElem;u=y.getObject(y.highlightObjectIndex);if(u.fadeTooltip){q.fadeOut(u.tooltipFadeSpeed)}else{q.hide()}y.highlightObjectIndex=null}}d.jqplot.postInitHooks.push(d.jqplot.CanvasOverlay.postPlotInit);d.jqplot.postDrawHooks.push(d.jqplot.CanvasOverlay.postPlotDraw);d.jqplot.eventListenerHooks.push(["jqplotMouseMove",a])})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 *
 * included jsDate library by Chris Leonello:
 *
 * Copyright (c) 2010-2013 Chris Leonello
 *
 * jsDate is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly.
 *
 * jsDate borrows many concepts and ideas from the Date Instance 
 * Methods by Ken Snyder along with some parts of Ken's actual code.
 * 
 * Ken's original Date Instance Methods and copyright notice:
 * 
 * Ken Snyder (ken d snyder at gmail dot com)
 * 2008-09-10
 * version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
 * Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 *
 * jqplotToImage function based on Larry Siden's export-jqplot-to-png.js.
 * Larry has generously given permission to adapt his code for inclusion
 * into jqPlot.
 *
 * Larry's original code can be found here:
 *
 * https://github.com/lsiden/export-jqplot-to-png
 * 
 * 
 */

(function($) {    
    // This code is a modified version of the canvastext.js code, copyright below:
    //
    // This code is released to the public domain by Jim Studt, 2007.
    // He may keep some sort of up to date copy at http://www.federated.com/~jim/canvastext/
    //
    $.jqplot.CanvasTextRenderer = function(options){
        this.fontStyle = 'normal';  // normal, italic, oblique [not implemented]
        this.fontVariant = 'normal';    // normal, small caps [not implemented]
        this.fontWeight = 'normal'; // normal, bold, bolder, lighter, 100 - 900
        this.fontSize = '10px'; 
        this.fontFamily = 'sans-serif';
        this.fontStretch = 1.0;
        this.fillStyle = '#666666';
        this.angle = 0;
        this.textAlign = 'start';
        this.textBaseline = 'alphabetic';
        this.text;
        this.width;
        this.height;
        this.pt2px = 1.28;

        $.extend(true, this, options);
        this.normalizedFontSize = this.normalizeFontSize(this.fontSize);
        this.setHeight();
    };
    
    $.jqplot.CanvasTextRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this.normalizedFontSize = this.normalizeFontSize(this.fontSize);
        this.setHeight();
    };
    
    // convert css spec into point size
    // returns float
    $.jqplot.CanvasTextRenderer.prototype.normalizeFontSize = function(sz) {
        sz = String(sz);
        var n = parseFloat(sz);
        if (sz.indexOf('px') > -1) {
            return n/this.pt2px;
        }
        else if (sz.indexOf('pt') > -1) {
            return n;
        }
        else if (sz.indexOf('em') > -1) {
            return n*12;
        }
        else if (sz.indexOf('%') > -1) {
            return n*12/100;
        }
        // default to pixels;
        else {
            return n/this.pt2px;
        }
    };
    
    
    $.jqplot.CanvasTextRenderer.prototype.fontWeight2Float = function(w) {
        // w = normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
        // return values adjusted for Hershey font.
        if (Number(w)) {
            return w/400;
        }
        else {
            switch (w) {
                case 'normal':
                    return 1;
                    break;
                case 'bold':
                    return 1.75;
                    break;
                case 'bolder':
                    return 2.25;
                    break;
                case 'lighter':
                    return 0.75;
                    break;
                default:
                    return 1;
                    break;
             }   
        }
    };
    
    $.jqplot.CanvasTextRenderer.prototype.getText = function() {
        return this.text;
    };
    
    $.jqplot.CanvasTextRenderer.prototype.setText = function(t, ctx) {
        this.text = t;
        this.setWidth(ctx);
        return this;
    };
    
    $.jqplot.CanvasTextRenderer.prototype.getWidth = function(ctx) {
        return this.width;
    };
    
    $.jqplot.CanvasTextRenderer.prototype.setWidth = function(ctx, w) {
        if (!w) {
            this.width = this.measure(ctx, this.text);
        }
        else {
            this.width = w;   
        }
        return this;
    };
    
    // return height in pixels.
    $.jqplot.CanvasTextRenderer.prototype.getHeight = function(ctx) {
        return this.height;
    };
    
    // w - height in pt
    // set heigh in px
    $.jqplot.CanvasTextRenderer.prototype.setHeight = function(w) {
        if (!w) {
            //height = this.fontSize /0.75;
            this.height = this.normalizedFontSize * this.pt2px;
        }
        else {
            this.height = w;   
        }
        return this;
    };

    $.jqplot.CanvasTextRenderer.prototype.letter = function (ch)
    {
        return this.letters[ch];
    };

    $.jqplot.CanvasTextRenderer.prototype.ascent = function()
    {
        return this.normalizedFontSize;
    };

    $.jqplot.CanvasTextRenderer.prototype.descent = function()
    {
        return 7.0*this.normalizedFontSize/25.0;
    };

    $.jqplot.CanvasTextRenderer.prototype.measure = function(ctx, str)
    {
        var total = 0;
        var len = str.length;
 
        for (var i = 0; i < len; i++) {
            var c = this.letter(str.charAt(i));
            if (c) {
                total += c.width * this.normalizedFontSize / 25.0 * this.fontStretch;
            }
        }
        return total;
    };

    $.jqplot.CanvasTextRenderer.prototype.draw = function(ctx,str)
    {
        var x = 0;
        // leave room at bottom for descenders.
        var y = this.height*0.72;
         var total = 0;
         var len = str.length;
         var mag = this.normalizedFontSize / 25.0;

         ctx.save();
         var tx, ty;
         
         // 1st quadrant
         if ((-Math.PI/2 <= this.angle && this.angle <= 0) || (Math.PI*3/2 <= this.angle && this.angle <= Math.PI*2)) {
             tx = 0;
             ty = -Math.sin(this.angle) * this.width;
         }
         // 4th quadrant
         else if ((0 < this.angle && this.angle <= Math.PI/2) || (-Math.PI*2 <= this.angle && this.angle <= -Math.PI*3/2)) {
             tx = Math.sin(this.angle) * this.height;
             ty = 0;
         }
         // 2nd quadrant
         else if ((-Math.PI < this.angle && this.angle < -Math.PI/2) || (Math.PI <= this.angle && this.angle <= Math.PI*3/2)) {
             tx = -Math.cos(this.angle) * this.width;
             ty = -Math.sin(this.angle) * this.width - Math.cos(this.angle) * this.height;
         }
         // 3rd quadrant
         else if ((-Math.PI*3/2 < this.angle && this.angle < Math.PI) || (Math.PI/2 < this.angle && this.angle < Math.PI)) {
             tx = Math.sin(this.angle) * this.height - Math.cos(this.angle)*this.width;
             ty = -Math.cos(this.angle) * this.height;
         }
         
         ctx.strokeStyle = this.fillStyle;
         ctx.fillStyle = this.fillStyle;
         ctx.translate(tx, ty);
         ctx.rotate(this.angle);
         ctx.lineCap = "round";
         // multiplier was 2.0
         var fact = (this.normalizedFontSize > 30) ? 2.0 : 2 + (30 - this.normalizedFontSize)/20;
         ctx.lineWidth = fact * mag * this.fontWeight2Float(this.fontWeight);
         
         for ( var i = 0; i < len; i++) {
            var c = this.letter( str.charAt(i));
            if ( !c) {
                continue;
            }

            ctx.beginPath();

            var penUp = 1;
            var needStroke = 0;
            for ( var j = 0; j < c.points.length; j++) {
              var a = c.points[j];
              if ( a[0] == -1 && a[1] == -1) {
                  penUp = 1;
                  continue;
              }
              if ( penUp) {
                  ctx.moveTo( x + a[0]*mag*this.fontStretch, y - a[1]*mag);
                  penUp = false;
              } else {
                  ctx.lineTo( x + a[0]*mag*this.fontStretch, y - a[1]*mag);
              }
            }
            ctx.stroke();
            x += c.width*mag*this.fontStretch;
         }
         ctx.restore();
         return total;
    };

    $.jqplot.CanvasTextRenderer.prototype.letters = {
         ' ': { width: 16, points: [] },
         '!': { width: 10, points: [[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]] },
         '"': { width: 16, points: [[4,21],[4,14],[-1,-1],[12,21],[12,14]] },
         '#': { width: 21, points: [[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]] },
         '$': { width: 20, points: [[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]] },
         '%': { width: 24, points: [[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]] },
         '&': { width: 26, points: [[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]] },
         '\'': { width: 10, points: [[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]] },
         '(': { width: 14, points: [[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]] },
         ')': { width: 14, points: [[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]] },
         '*': { width: 16, points: [[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]] },
         '+': { width: 26, points: [[13,18],[13,0],[-1,-1],[4,9],[22,9]] },
         ',': { width: 10, points: [[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]] },
         '-': { width: 18, points: [[6,9],[12,9]] },
         '.': { width: 10, points: [[5,2],[4,1],[5,0],[6,1],[5,2]] },
         '/': { width: 22, points: [[20,25],[2,-7]] },
         '0': { width: 20, points: [[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]] },
         '1': { width: 20, points: [[6,17],[8,18],[11,21],[11,0]] },
         '2': { width: 20, points: [[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]] },
         '3': { width: 20, points: [[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]] },
         '4': { width: 20, points: [[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]] },
         '5': { width: 20, points: [[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]] },
         '6': { width: 20, points: [[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]] },
         '7': { width: 20, points: [[17,21],[7,0],[-1,-1],[3,21],[17,21]] },
         '8': { width: 20, points: [[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]] },
         '9': { width: 20, points: [[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]] },
         ':': { width: 10, points: [[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]] },
         ';': { width: 10, points: [[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]] },
         '<': { width: 24, points: [[20,18],[4,9],[20,0]] },
         '=': { width: 26, points: [[4,12],[22,12],[-1,-1],[4,6],[22,6]] },
         '>': { width: 24, points: [[4,18],[20,9],[4,0]] },
         '?': { width: 18, points: [[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]] },
         '@': { width: 27, points: [[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]] },
         'A': { width: 18, points: [[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]] },
         'B': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]] },
         'C': { width: 21, points: [[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]] },
         'D': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]] },
         'E': { width: 19, points: [[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]] },
         'F': { width: 18, points: [[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]] },
         'G': { width: 21, points: [[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]] },
         'H': { width: 22, points: [[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]] },
         'I': { width: 8, points: [[4,21],[4,0]] },
         'J': { width: 16, points: [[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]] },
         'K': { width: 21, points: [[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]] },
         'L': { width: 17, points: [[4,21],[4,0],[-1,-1],[4,0],[16,0]] },
         'M': { width: 24, points: [[4,21],[4,0],[-1,-1],[4,21],[12,0],[-1,-1],[20,21],[12,0],[-1,-1],[20,21],[20,0]] },
         'N': { width: 22, points: [[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]] },
         'O': { width: 22, points: [[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]] },
         'P': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]] },
         'Q': { width: 22, points: [[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]] },
         'R': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]] },
         'S': { width: 20, points: [[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]] },
         'T': { width: 16, points: [[8,21],[8,0],[-1,-1],[1,21],[15,21]] },
         'U': { width: 22, points: [[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]] },
         'V': { width: 18, points: [[1,21],[9,0],[-1,-1],[17,21],[9,0]] },
         'W': { width: 24, points: [[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]] },
         'X': { width: 20, points: [[3,21],[17,0],[-1,-1],[17,21],[3,0]] },
         'Y': { width: 18, points: [[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]] },
         'Z': { width: 20, points: [[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]] },
         '[': { width: 14, points: [[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]] },
         '\\': { width: 14, points: [[0,21],[14,-3]] },
         ']': { width: 14, points: [[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]] },
         '^': { width: 16, points: [[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]] },
         '_': { width: 16, points: [[0,-2],[16,-2]] },
         '`': { width: 10, points: [[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]] },
         'a': { width: 19, points: [[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'b': { width: 19, points: [[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]] },
         'c': { width: 18, points: [[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'd': { width: 19, points: [[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'e': { width: 18, points: [[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'f': { width: 12, points: [[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]] },
         'g': { width: 19, points: [[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'h': { width: 19, points: [[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]] },
         'i': { width: 8, points: [[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]] },
         'j': { width: 10, points: [[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]] },
         'k': { width: 17, points: [[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]] },
         'l': { width: 8, points: [[4,21],[4,0]] },
         'm': { width: 30, points: [[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]] },
         'n': { width: 19, points: [[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]] },
         'o': { width: 19, points: [[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]] },
         'p': { width: 19, points: [[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]] },
         'q': { width: 19, points: [[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'r': { width: 13, points: [[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]] },
         's': { width: 17, points: [[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]] },
         't': { width: 12, points: [[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]] },
         'u': { width: 19, points: [[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]] },
         'v': { width: 16, points: [[2,14],[8,0],[-1,-1],[14,14],[8,0]] },
         'w': { width: 22, points: [[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]] },
         'x': { width: 17, points: [[3,14],[14,0],[-1,-1],[14,14],[3,0]] },
         'y': { width: 16, points: [[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]] },
         'z': { width: 17, points: [[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]] },
         '{': { width: 14, points: [[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]] },
         '|': { width: 8, points: [[4,25],[4,-7]] },
         '}': { width: 14, points: [[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]] },
         '~': { width: 24, points: [[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]] }
     };
     
    $.jqplot.CanvasFontRenderer = function(options) {
        options = options || {};
        if (!options.pt2px) {
            options.pt2px = 1.5;
        }
        $.jqplot.CanvasTextRenderer.call(this, options);
    };
    
    $.jqplot.CanvasFontRenderer.prototype = new $.jqplot.CanvasTextRenderer({});
    $.jqplot.CanvasFontRenderer.prototype.constructor = $.jqplot.CanvasFontRenderer;

    $.jqplot.CanvasFontRenderer.prototype.measure = function(ctx, str)
    {
        // var fstyle = this.fontStyle+' '+this.fontVariant+' '+this.fontWeight+' '+this.fontSize+' '+this.fontFamily;
        var fstyle = this.fontSize+' '+this.fontFamily;
        ctx.save();
        ctx.font = fstyle;
        var w = ctx.measureText(str).width;
        ctx.restore();
        return w;
    };

    $.jqplot.CanvasFontRenderer.prototype.draw = function(ctx, str)
    {
        var x = 0;
        // leave room at bottom for descenders.
        var y = this.height*0.72;
        //var y = 12;

         ctx.save();
         var tx, ty;
         
         // 1st quadrant
         if ((-Math.PI/2 <= this.angle && this.angle <= 0) || (Math.PI*3/2 <= this.angle && this.angle <= Math.PI*2)) {
             tx = 0;
             ty = -Math.sin(this.angle) * this.width;
         }
         // 4th quadrant
         else if ((0 < this.angle && this.angle <= Math.PI/2) || (-Math.PI*2 <= this.angle && this.angle <= -Math.PI*3/2)) {
             tx = Math.sin(this.angle) * this.height;
             ty = 0;
         }
         // 2nd quadrant
         else if ((-Math.PI < this.angle && this.angle < -Math.PI/2) || (Math.PI <= this.angle && this.angle <= Math.PI*3/2)) {
             tx = -Math.cos(this.angle) * this.width;
             ty = -Math.sin(this.angle) * this.width - Math.cos(this.angle) * this.height;
         }
         // 3rd quadrant
         else if ((-Math.PI*3/2 < this.angle && this.angle < Math.PI) || (Math.PI/2 < this.angle && this.angle < Math.PI)) {
             tx = Math.sin(this.angle) * this.height - Math.cos(this.angle)*this.width;
             ty = -Math.cos(this.angle) * this.height;
         }
         ctx.strokeStyle = this.fillStyle;
         ctx.fillStyle = this.fillStyle;
        // var fstyle = this.fontStyle+' '+this.fontVariant+' '+this.fontWeight+' '+this.fontSize+' '+this.fontFamily;
        var fstyle = this.fontSize+' '+this.fontFamily;
         ctx.font = fstyle;
         ctx.translate(tx, ty);
         ctx.rotate(this.angle);
         ctx.fillText(str, x, y);
         // ctx.strokeText(str, x, y);

         ctx.restore();
    };
    
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.CanvasTextRenderer=function(b){this.fontStyle="normal";this.fontVariant="normal";this.fontWeight="normal";this.fontSize="10px";this.fontFamily="sans-serif";this.fontStretch=1;this.fillStyle="#666666";this.angle=0;this.textAlign="start";this.textBaseline="alphabetic";this.text;this.width;this.height;this.pt2px=1.28;a.extend(true,this,b);this.normalizedFontSize=this.normalizeFontSize(this.fontSize);this.setHeight()};a.jqplot.CanvasTextRenderer.prototype.init=function(b){a.extend(true,this,b);this.normalizedFontSize=this.normalizeFontSize(this.fontSize);this.setHeight()};a.jqplot.CanvasTextRenderer.prototype.normalizeFontSize=function(b){b=String(b);var c=parseFloat(b);if(b.indexOf("px")>-1){return c/this.pt2px}else{if(b.indexOf("pt")>-1){return c}else{if(b.indexOf("em")>-1){return c*12}else{if(b.indexOf("%")>-1){return c*12/100}else{return c/this.pt2px}}}}};a.jqplot.CanvasTextRenderer.prototype.fontWeight2Float=function(b){if(Number(b)){return b/400}else{switch(b){case"normal":return 1;break;case"bold":return 1.75;break;case"bolder":return 2.25;break;case"lighter":return 0.75;break;default:return 1;break}}};a.jqplot.CanvasTextRenderer.prototype.getText=function(){return this.text};a.jqplot.CanvasTextRenderer.prototype.setText=function(c,b){this.text=c;this.setWidth(b);return this};a.jqplot.CanvasTextRenderer.prototype.getWidth=function(b){return this.width};a.jqplot.CanvasTextRenderer.prototype.setWidth=function(c,b){if(!b){this.width=this.measure(c,this.text)}else{this.width=b}return this};a.jqplot.CanvasTextRenderer.prototype.getHeight=function(b){return this.height};a.jqplot.CanvasTextRenderer.prototype.setHeight=function(b){if(!b){this.height=this.normalizedFontSize*this.pt2px}else{this.height=b}return this};a.jqplot.CanvasTextRenderer.prototype.letter=function(b){return this.letters[b]};a.jqplot.CanvasTextRenderer.prototype.ascent=function(){return this.normalizedFontSize};a.jqplot.CanvasTextRenderer.prototype.descent=function(){return 7*this.normalizedFontSize/25};a.jqplot.CanvasTextRenderer.prototype.measure=function(d,g){var f=0;var b=g.length;for(var e=0;e<b;e++){var h=this.letter(g.charAt(e));if(h){f+=h.width*this.normalizedFontSize/25*this.fontStretch}}return f};a.jqplot.CanvasTextRenderer.prototype.draw=function(s,n){var r=0;var o=this.height*0.72;var p=0;var l=n.length;var k=this.normalizedFontSize/25;s.save();var h,f;if((-Math.PI/2<=this.angle&&this.angle<=0)||(Math.PI*3/2<=this.angle&&this.angle<=Math.PI*2)){h=0;f=-Math.sin(this.angle)*this.width}else{if((0<this.angle&&this.angle<=Math.PI/2)||(-Math.PI*2<=this.angle&&this.angle<=-Math.PI*3/2)){h=Math.sin(this.angle)*this.height;f=0}else{if((-Math.PI<this.angle&&this.angle<-Math.PI/2)||(Math.PI<=this.angle&&this.angle<=Math.PI*3/2)){h=-Math.cos(this.angle)*this.width;f=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height}else{if((-Math.PI*3/2<this.angle&&this.angle<Math.PI)||(Math.PI/2<this.angle&&this.angle<Math.PI)){h=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width;f=-Math.cos(this.angle)*this.height}}}}s.strokeStyle=this.fillStyle;s.fillStyle=this.fillStyle;s.translate(h,f);s.rotate(this.angle);s.lineCap="round";var t=(this.normalizedFontSize>30)?2:2+(30-this.normalizedFontSize)/20;s.lineWidth=t*k*this.fontWeight2Float(this.fontWeight);for(var g=0;g<l;g++){var m=this.letter(n.charAt(g));if(!m){continue}s.beginPath();var e=1;var b=0;for(var d=0;d<m.points.length;d++){var q=m.points[d];if(q[0]==-1&&q[1]==-1){e=1;continue}if(e){s.moveTo(r+q[0]*k*this.fontStretch,o-q[1]*k);e=false}else{s.lineTo(r+q[0]*k*this.fontStretch,o-q[1]*k)}}s.stroke();r+=m.width*k*this.fontStretch}s.restore();return p};a.jqplot.CanvasTextRenderer.prototype.letters={" ":{width:16,points:[]},"!":{width:10,points:[[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},'"':{width:16,points:[[4,21],[4,14],[-1,-1],[12,21],[12,14]]},"#":{width:21,points:[[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]]},"$":{width:20,points:[[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},"%":{width:24,points:[[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]]},"&":{width:26,points:[[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]]},"'":{width:10,points:[[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]]},"(":{width:14,points:[[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]]},")":{width:14,points:[[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]]},"*":{width:16,points:[[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]]},"+":{width:26,points:[[13,18],[13,0],[-1,-1],[4,9],[22,9]]},",":{width:10,points:[[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},"-":{width:18,points:[[6,9],[12,9]]},".":{width:10,points:[[5,2],[4,1],[5,0],[6,1],[5,2]]},"/":{width:22,points:[[20,25],[2,-7]]},"0":{width:20,points:[[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]]},"1":{width:20,points:[[6,17],[8,18],[11,21],[11,0]]},"2":{width:20,points:[[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]]},"3":{width:20,points:[[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},"4":{width:20,points:[[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]]},"5":{width:20,points:[[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},"6":{width:20,points:[[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]]},"7":{width:20,points:[[17,21],[7,0],[-1,-1],[3,21],[17,21]]},"8":{width:20,points:[[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]]},"9":{width:20,points:[[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]]},":":{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},";":{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},"<":{width:24,points:[[20,18],[4,9],[20,0]]},"=":{width:26,points:[[4,12],[22,12],[-1,-1],[4,6],[22,6]]},">":{width:24,points:[[4,18],[20,9],[4,0]]},"?":{width:18,points:[[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]]},"@":{width:27,points:[[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]]},A:{width:18,points:[[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]]},B:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]]},C:{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]]},D:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]]},E:{width:19,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]]},F:{width:18,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]]},G:{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]]},H:{width:22,points:[[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]]},I:{width:8,points:[[4,21],[4,0]]},J:{width:16,points:[[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]]},K:{width:21,points:[[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]]},L:{width:17,points:[[4,21],[4,0],[-1,-1],[4,0],[16,0]]},M:{width:24,points:[[4,21],[4,0],[-1,-1],[4,21],[12,0],[-1,-1],[20,21],[12,0],[-1,-1],[20,21],[20,0]]},N:{width:22,points:[[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]]},O:{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]]},P:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]]},Q:{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]]},R:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]]},S:{width:20,points:[[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},T:{width:16,points:[[8,21],[8,0],[-1,-1],[1,21],[15,21]]},U:{width:22,points:[[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]]},V:{width:18,points:[[1,21],[9,0],[-1,-1],[17,21],[9,0]]},W:{width:24,points:[[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]]},X:{width:20,points:[[3,21],[17,0],[-1,-1],[17,21],[3,0]]},Y:{width:18,points:[[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]]},Z:{width:20,points:[[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]]},"[":{width:14,points:[[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]]},"\\":{width:14,points:[[0,21],[14,-3]]},"]":{width:14,points:[[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]]},"^":{width:16,points:[[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]]},_:{width:16,points:[[0,-2],[16,-2]]},"`":{width:10,points:[[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]]},a:{width:19,points:[[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},b:{width:19,points:[[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},c:{width:18,points:[[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},d:{width:19,points:[[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},e:{width:18,points:[[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},f:{width:12,points:[[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]]},g:{width:19,points:[[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},h:{width:19,points:[[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},i:{width:8,points:[[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]]},j:{width:10,points:[[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]]},k:{width:17,points:[[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]]},l:{width:8,points:[[4,21],[4,0]]},m:{width:30,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]]},n:{width:19,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},o:{width:19,points:[[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]]},p:{width:19,points:[[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},q:{width:19,points:[[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},r:{width:13,points:[[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]]},s:{width:17,points:[[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]]},t:{width:12,points:[[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]]},u:{width:19,points:[[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]]},v:{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0]]},w:{width:22,points:[[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]]},x:{width:17,points:[[3,14],[14,0],[-1,-1],[14,14],[3,0]]},y:{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]]},z:{width:17,points:[[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]]},"{":{width:14,points:[[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]]},"|":{width:8,points:[[4,25],[4,-7]]},"}":{width:14,points:[[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]]},"~":{width:24,points:[[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]]}};a.jqplot.CanvasFontRenderer=function(b){b=b||{};if(!b.pt2px){b.pt2px=1.5}a.jqplot.CanvasTextRenderer.call(this,b)};a.jqplot.CanvasFontRenderer.prototype=new a.jqplot.CanvasTextRenderer({});a.jqplot.CanvasFontRenderer.prototype.constructor=a.jqplot.CanvasFontRenderer;a.jqplot.CanvasFontRenderer.prototype.measure=function(c,e){var d=this.fontSize+" "+this.fontFamily;c.save();c.font=d;var b=c.measureText(e).width;c.restore();return b};a.jqplot.CanvasFontRenderer.prototype.draw=function(e,g){var c=0;var h=this.height*0.72;e.save();var d,b;if((-Math.PI/2<=this.angle&&this.angle<=0)||(Math.PI*3/2<=this.angle&&this.angle<=Math.PI*2)){d=0;b=-Math.sin(this.angle)*this.width}else{if((0<this.angle&&this.angle<=Math.PI/2)||(-Math.PI*2<=this.angle&&this.angle<=-Math.PI*3/2)){d=Math.sin(this.angle)*this.height;b=0}else{if((-Math.PI<this.angle&&this.angle<-Math.PI/2)||(Math.PI<=this.angle&&this.angle<=Math.PI*3/2)){d=-Math.cos(this.angle)*this.width;b=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height}else{if((-Math.PI*3/2<this.angle&&this.angle<Math.PI)||(Math.PI/2<this.angle&&this.angle<Math.PI)){d=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width;b=-Math.cos(this.angle)*this.height}}}}e.strokeStyle=this.fillStyle;e.fillStyle=this.fillStyle;var f=this.fontSize+" "+this.fontFamily;e.font=f;e.translate(d,b);e.rotate(this.angle);e.fillText(g,c,h);e.restore()}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {   
    /**
    *  class: $.jqplot.CategoryAxisRenderer
    *  A plugin for jqPlot to render a category style axis, with equal pixel spacing between y data values of a series.
    *  
    *  To use this renderer, include the plugin in your source
    *  > <script type="text/javascript" language="javascript" src="plugins/jqplot.categoryAxisRenderer.js"></script>
    *  
    *  and supply the appropriate options to your plot
    *  
    *  > {axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}}}
    **/
    $.jqplot.CategoryAxisRenderer = function(options) {
        $.jqplot.LinearAxisRenderer.call(this);
        // prop: sortMergedLabels
        // True to sort tick labels when labels are created by merging
        // x axis values from multiple series.  That is, say you have
        // two series like:
        // > line1 = [[2006, 4],            [2008, 9], [2009, 16]];
        // > line2 = [[2006, 3], [2007, 7], [2008, 6]];
        // If no label array is specified, tick labels will be collected
        // from the x values of the series.  With sortMergedLabels
        // set to true, tick labels will be:
        // > [2006, 2007, 2008, 2009]
        // With sortMergedLabels set to false, tick labels will be:
        // > [2006, 2008, 2009, 2007]
        //
        // Note, this property is specified on the renderOptions for the 
        // axes when creating a plot:
        // > axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer, rendererOptions:{sortMergedLabels:true}}}
        this.sortMergedLabels = false;
    };
    
    $.jqplot.CategoryAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.CategoryAxisRenderer.prototype.constructor = $.jqplot.CategoryAxisRenderer;
    
    $.jqplot.CategoryAxisRenderer.prototype.init = function(options){
        this.groups = 1;
        this.groupLabels = [];
        this._groupLabels = [];
        this._grouped = false;
        this._barsPerGroup = null;
        this.reverse = false;
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        $.extend(true, this, {tickOptions:{formatString:'%d'}}, options);
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            if (s.groups) {
                this.groups = s.groups;
            }
            var d = s.data;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                    }
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                    }
                }              
            }
        }
        
        if (this.groupLabels.length) {
            this.groups = this.groupLabels.length;
        }
    };
 

    $.jqplot.CategoryAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;

        // if we already have ticks, use them.
        if (userTicks.length) {
            // adjust with blanks if we have groups
            if (this.groups > 1 && !this._grouped) {
                var l = userTicks.length;
                var skip = parseInt(l/this.groups, 10);
                var count = 0;
                for (var i=skip; i<l; i+=skip) {
                    userTicks.splice(i+count, 0, ' ');
                    count++;
                }
                this._grouped = true;
            }
            this.min = 0.5;
            this.max = userTicks.length + 0.5;
            var range = this.max - this.min;
            this.numberTicks = 2*userTicks.length + 1;
            for (i=0; i<userTicks.length; i++){
                tt = this.min + 2 * i * range / (this.numberTicks-1);
                // need a marker before and after the tick
                var t = new this.tickRenderer(this.tickOptions);
                t.showLabel = false;
                // t.showMark = true;
                t.setTick(tt, this.name);
                this._ticks.push(t);
                var t = new this.tickRenderer(this.tickOptions);
                t.label = userTicks[i];
                // t.showLabel = true;
                t.showMark = false;
                t.showGridline = false;
                t.setTick(tt+0.5, this.name);
                this._ticks.push(t);
            }
            // now add the last tick at the end
            var t = new this.tickRenderer(this.tickOptions);
            t.showLabel = false;
            // t.showMark = true;
            t.setTick(tt+1, this.name);
            this._ticks.push(t);
        }

        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            // if max, min, and interval specified and interval won't fit, ignore interval.
            if (this.min != null && this.max != null && this.tickInterval != null) {
                if (parseInt((this.max-this.min)/this.tickInterval, 10) != (this.max-this.min)/this.tickInterval) {
                    this.tickInterval = null;
                }
            }
        
            // find out how many categories are in the lines and collect labels
            var labels = [];
            var numcats = 0;
            var min = 0.5;
            var max, val;
            var isMerged = false;
            for (var i=0; i<this._series.length; i++) {
                var s = this._series[i];
                for (var j=0; j<s.data.length; j++) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        val = s.data[j][0];
                    }
                    else {
                        val = s.data[j][1];
                    }
                    if ($.inArray(val, labels) == -1) {
                        isMerged = true;
                        numcats += 1;      
                        labels.push(val);
                    }
                }
            }
            
            if (isMerged && this.sortMergedLabels) {
                if (typeof labels[0] == "string") {
                    labels.sort();
                } else {
                    labels.sort(function(a,b) { return a - b; });
                }
            }
            
            // keep a reference to these tick labels to use for redrawing plot (see bug #57)
            this.ticks = labels;
            
            // now bin the data values to the right lables.
            for (var i=0; i<this._series.length; i++) {
                var s = this._series[i];
                for (var j=0; j<s.data.length; j++) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        val = s.data[j][0];
                    }
                    else {
                        val = s.data[j][1];
                    }
                    // for category axis, force the values into category bins.
                    // we should have the value in the label array now.
                    var idx = $.inArray(val, labels)+1;
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        s.data[j][0] = idx;
                    }
                    else {
                        s.data[j][1] = idx;
                    }
                }
            }
            
            // adjust with blanks if we have groups
            if (this.groups > 1 && !this._grouped) {
                var l = labels.length;
                var skip = parseInt(l/this.groups, 10);
                var count = 0;
                for (var i=skip; i<l; i+=skip+1) {
                    labels[i] = ' ';
                }
                this._grouped = true;
            }
        
            max = numcats + 0.5;
            if (this.numberTicks == null) {
                this.numberTicks = 2*numcats + 1;
            }

            var range = max - min;
            this.min = min;
            this.max = max;
            var track = 0;
            
            // todo: adjust this so more ticks displayed.
            var maxVisibleTicks = parseInt(3+dim/10, 10);
            var skip = parseInt(numcats/maxVisibleTicks, 10);

            if (this.tickInterval == null) {

                this.tickInterval = range / (this.numberTicks-1);

            }
            // if tickInterval is specified, we will ignore any computed maximum.
            for (var i=0; i<this.numberTicks; i++){
                tt = this.min + i * this.tickInterval;
                var t = new this.tickRenderer(this.tickOptions);
                // if even tick, it isn't a category, it's a divider
                if (i/2 == parseInt(i/2, 10)) {
                    t.showLabel = false;
                    t.showMark = true;
                }
                else {
                    if (skip>0 && track<skip) {
                        t.showLabel = false;
                        track += 1;
                    }
                    else {
                        t.showLabel = true;
                        track = 0;
                    } 
                    t.label = t.formatter(t.formatString, labels[(i-1)/2]);
                    t.showMark = false;
                    t.showGridline = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }
        
    };
    
    // called with scope of axis
    $.jqplot.CategoryAxisRenderer.prototype.draw = function(ctx, plot) {
        if (this.show) {
            // populate the axis label and value properties.
            // createTicks is a method on the renderer, but
            // call it within the scope of the axis.
            this.renderer.createTicks.call(this);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get its bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            // Added for theming.
            if (this._elem) {
                // this._elem.empty();
                // Memory Leaks patch
                this._elem.emptyForce();
            }

            this._elem = this._elem || $('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');
            
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                this._elem.width(this._plotDimensions.width);
            }
            else {
                this._elem.height(this._plotDimensions.height);
            }
            
            // create a _label object.
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var elem = this._label.draw(ctx, plot);
                elem.appendTo(this._elem);
            }
    
            var t = this._ticks;
            for (var i=0; i<t.length; i++) {
                var tick = t[i];
                if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    var elem = tick.draw(ctx, plot);
                    elem.appendTo(this._elem);
                }
            }
        
            this._groupLabels = [];
            // now make group labels
            for (var i=0; i<this.groupLabels.length; i++)
            {
                var elem = $('<div style="position:absolute;" class="jqplot-'+this.name+'-groupLabel"></div>');
                elem.html(this.groupLabels[i]);
                this._groupLabels.push(elem);
                elem.appendTo(this._elem);
            }
        }
        return this._elem;
    };
    
    // called with scope of axis
    $.jqplot.CategoryAxisRenderer.prototype.set = function() { 
        var dim = 0;
        var temp;
        var w = 0;
        var h = 0;
        var lshow = (this._label == null) ? false : this._label.show;
        if (this.show) {
            var t = this._ticks;
            for (var i=0; i<t.length; i++) {
                var tick = t[i];
                if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        temp = tick._elem.outerHeight(true);
                    }
                    else {
                        temp = tick._elem.outerWidth(true);
                    }
                    if (temp > dim) {
                        dim = temp;
                    }
                }
            }
            
            var dim2 = 0;
            for (var i=0; i<this._groupLabels.length; i++) {
                var l = this._groupLabels[i];
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    temp = l.outerHeight(true);
                }
                else {
                    temp = l.outerWidth(true);
                }
                if (temp > dim2) {
                    dim2 = temp;
                }
            }
            
            if (lshow) {
                w = this._label._elem.outerWidth(true);
                h = this._label._elem.outerHeight(true); 
            }
            if (this.name == 'xaxis') {
                dim += dim2 + h;
                this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            }
            else if (this.name == 'x2axis') {
                dim += dim2 + h;
                this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            }
            else if (this.name == 'yaxis') {
                dim += dim2 + w;
                this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
            else {
                dim += dim2 + w;
                this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
        }  
    };
    
    // called with scope of axis
    $.jqplot.CategoryAxisRenderer.prototype.pack = function(pos, offsets) {
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        var i;

        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        if (!this.reverse) {
            // point to unit and unit to point conversions references to Plot DOM element top left corner.
            
            this.u2p = function(u){
                return (u - min) * pixellength / unitlength + offmin;
            };

            this.p2u = function(p){
                return (p - offmin) * unitlength / pixellength + min;
            };
                    
            if (this.name == 'xaxis' || this.name == 'x2axis'){
                this.series_u2p = function(u){
                    return (u - min) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }
            
            else {
                this.series_u2p = function(u){
                    return (u - max) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
        }

        else {
            // point to unit and unit to point conversions references to Plot DOM element top left corner.
            
            this.u2p = function(u){
                return offmin + (max - u) * pixellength / unitlength;
            };

            this.p2u = function(p){
                return min + (p - offmin) * unitlength / pixellength;
            };
                    
            if (this.name == 'xaxis' || this.name == 'x2axis'){
                this.series_u2p = function(u){
                    return (max - u) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
            
            else {
                this.series_u2p = function(u){
                    return (min - u) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }

        }
            
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'xaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (temp * t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'end':
                                    shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                case 'start':
                                    shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    break;
                                case 'middle':
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                
                var labeledge=['bottom', 0];
                if (lshow) {
                    var w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                        labeledge = ['bottom', this._label._elem.outerHeight(true)];
                    }
                    else {
                        this._label._elem.css('top', '0px');
                        labeledge = ['top', this._label._elem.outerHeight(true)];
                    }
                    this._label.pack();
                }
                
                // draw the group labels
                var step = parseInt(this._ticks.length/this.groups, 10) + 1;
                for (i=0; i<this._groupLabels.length; i++) {
                    var mid = 0;
                    var count = 0;
                    for (var j=i*step; j<(i+1)*step; j++) {
                        if (j >= this._ticks.length-1) continue; // the last tick does not exist as there is no other group in order to have an empty one.
                        if (this._ticks[j]._elem && this._ticks[j].label != " ") {
                            var t = this._ticks[j]._elem;
                            var p = t.position();
                            mid += p.left + t.outerWidth(true)/2;
                            count++;
                        }
                    }
                    mid = mid/count;
                    this._groupLabels[i].css({'left':(mid - this._groupLabels[i].outerWidth(true)/2)});
                    this._groupLabels[i].css(labeledge[0], labeledge[1]);
                }
            }
            else {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'yaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (temp * t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    // if (t.angle > 0) {
                                    //     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    // }
                                    // else {
                                    //     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    // }
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                
                var labeledge=['left', 0];
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                        labeledge = ['left', this._label._elem.outerWidth(true)];
                    }
                    else {
                        this._label._elem.css('right', '0px');
                        labeledge = ['right', this._label._elem.outerWidth(true)];
                    }   
                    this._label.pack();
                }
                
                // draw the group labels, position top here, do left after label position.
                var step = parseInt(this._ticks.length/this.groups, 10) + 1; // step is one more than before as we don't want to have overlaps in loops
                for (i=0; i<this._groupLabels.length; i++) {
                    var mid = 0;
                    var count = 0;
                    for (var j=i*step; j<(i+1)*step; j++) { // j must never reach (i+1)*step as we don't want to have overlap between loops
                        if (j >= this._ticks.length-1) continue; // the last tick does not exist as there is no other group in order to have an empty one.
                        if (this._ticks[j]._elem && this._ticks[j].label != " ") {
                            var t = this._ticks[j]._elem;
                            var p = t.position();
                            mid += p.top + t.outerHeight()/2;
                            count++;
                        }
                    }
                    mid = mid/count;
                    this._groupLabels[i].css({'top':mid - this._groupLabels[i].outerHeight()/2});
                    this._groupLabels[i].css(labeledge[0], labeledge[1]);
                    
                }
            }
        }
    };    
    
    
})(jQuery);

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.CategoryAxisRenderer=function(b){a.jqplot.LinearAxisRenderer.call(this);this.sortMergedLabels=false};a.jqplot.CategoryAxisRenderer.prototype=new a.jqplot.LinearAxisRenderer();a.jqplot.CategoryAxisRenderer.prototype.constructor=a.jqplot.CategoryAxisRenderer;a.jqplot.CategoryAxisRenderer.prototype.init=function(e){this.groups=1;this.groupLabels=[];this._groupLabels=[];this._grouped=false;this._barsPerGroup=null;this.reverse=false;a.extend(true,this,{tickOptions:{formatString:"%d"}},e);var b=this._dataBounds;for(var f=0;f<this._series.length;f++){var g=this._series[f];if(g.groups){this.groups=g.groups}var h=g.data;for(var c=0;c<h.length;c++){if(this.name=="xaxis"||this.name=="x2axis"){if(h[c][0]<b.min||b.min==null){b.min=h[c][0]}if(h[c][0]>b.max||b.max==null){b.max=h[c][0]}}else{if(h[c][1]<b.min||b.min==null){b.min=h[c][1]}if(h[c][1]>b.max||b.max==null){b.max=h[c][1]}}}}if(this.groupLabels.length){this.groups=this.groupLabels.length}};a.jqplot.CategoryAxisRenderer.prototype.createTicks=function(){var D=this._ticks;var z=this.ticks;var F=this.name;var C=this._dataBounds;var v,A;var q,w;var d,c;var b,x;if(z.length){if(this.groups>1&&!this._grouped){var r=z.length;var p=parseInt(r/this.groups,10);var e=0;for(var x=p;x<r;x+=p){z.splice(x+e,0," ");e++}this._grouped=true}this.min=0.5;this.max=z.length+0.5;var m=this.max-this.min;this.numberTicks=2*z.length+1;for(x=0;x<z.length;x++){b=this.min+2*x*m/(this.numberTicks-1);var h=new this.tickRenderer(this.tickOptions);h.showLabel=false;h.setTick(b,this.name);this._ticks.push(h);var h=new this.tickRenderer(this.tickOptions);h.label=z[x];h.showMark=false;h.showGridline=false;h.setTick(b+0.5,this.name);this._ticks.push(h)}var h=new this.tickRenderer(this.tickOptions);h.showLabel=false;h.setTick(b+1,this.name);this._ticks.push(h)}else{if(F=="xaxis"||F=="x2axis"){v=this._plotDimensions.width}else{v=this._plotDimensions.height}if(this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null}if(this.min!=null&&this.max!=null&&this.tickInterval!=null){if(parseInt((this.max-this.min)/this.tickInterval,10)!=(this.max-this.min)/this.tickInterval){this.tickInterval=null}}var y=[];var B=0;var q=0.5;var w,E;var f=false;for(var x=0;x<this._series.length;x++){var k=this._series[x];for(var u=0;u<k.data.length;u++){if(this.name=="xaxis"||this.name=="x2axis"){E=k.data[u][0]}else{E=k.data[u][1]}if(a.inArray(E,y)==-1){f=true;B+=1;y.push(E)}}}if(f&&this.sortMergedLabels){if(typeof y[0]=="string"){y.sort()}else{y.sort(function(j,i){return j-i})}}this.ticks=y;for(var x=0;x<this._series.length;x++){var k=this._series[x];for(var u=0;u<k.data.length;u++){if(this.name=="xaxis"||this.name=="x2axis"){E=k.data[u][0]}else{E=k.data[u][1]}var n=a.inArray(E,y)+1;if(this.name=="xaxis"||this.name=="x2axis"){k.data[u][0]=n}else{k.data[u][1]=n}}}if(this.groups>1&&!this._grouped){var r=y.length;var p=parseInt(r/this.groups,10);var e=0;for(var x=p;x<r;x+=p+1){y[x]=" "}this._grouped=true}w=B+0.5;if(this.numberTicks==null){this.numberTicks=2*B+1}var m=w-q;this.min=q;this.max=w;var o=0;var g=parseInt(3+v/10,10);var p=parseInt(B/g,10);if(this.tickInterval==null){this.tickInterval=m/(this.numberTicks-1)}for(var x=0;x<this.numberTicks;x++){b=this.min+x*this.tickInterval;var h=new this.tickRenderer(this.tickOptions);if(x/2==parseInt(x/2,10)){h.showLabel=false;h.showMark=true}else{if(p>0&&o<p){h.showLabel=false;o+=1}else{h.showLabel=true;o=0}h.label=h.formatter(h.formatString,y[(x-1)/2]);h.showMark=false;h.showGridline=false}h.setTick(b,this.name);this._ticks.push(h)}}};a.jqplot.CategoryAxisRenderer.prototype.draw=function(b,j){if(this.show){this.renderer.createTicks.call(this);var h=0;var c;if(this._elem){this._elem.emptyForce()}this._elem=this._elem||a('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');if(this.name=="xaxis"||this.name=="x2axis"){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var g=this._label.draw(b,j);g.appendTo(this._elem)}var f=this._ticks;for(var e=0;e<f.length;e++){var d=f[e];if(d.showLabel&&(!d.isMinorTick||this.showMinorTicks)){var g=d.draw(b,j);g.appendTo(this._elem)}}this._groupLabels=[];for(var e=0;e<this.groupLabels.length;e++){var g=a('<div style="position:absolute;" class="jqplot-'+this.name+'-groupLabel"></div>');g.html(this.groupLabels[e]);this._groupLabels.push(g);g.appendTo(this._elem)}}return this._elem};a.jqplot.CategoryAxisRenderer.prototype.set=function(){var e=0;var m;var k=0;var f=0;var d=(this._label==null)?false:this._label.show;if(this.show){var n=this._ticks;for(var c=0;c<n.length;c++){var g=n[c];if(g.showLabel&&(!g.isMinorTick||this.showMinorTicks)){if(this.name=="xaxis"||this.name=="x2axis"){m=g._elem.outerHeight(true)}else{m=g._elem.outerWidth(true)}if(m>e){e=m}}}var j=0;for(var c=0;c<this._groupLabels.length;c++){var b=this._groupLabels[c];if(this.name=="xaxis"||this.name=="x2axis"){m=b.outerHeight(true)}else{m=b.outerWidth(true)}if(m>j){j=m}}if(d){k=this._label._elem.outerWidth(true);f=this._label._elem.outerHeight(true)}if(this.name=="xaxis"){e+=j+f;this._elem.css({height:e+"px",left:"0px",bottom:"0px"})}else{if(this.name=="x2axis"){e+=j+f;this._elem.css({height:e+"px",left:"0px",top:"0px"})}else{if(this.name=="yaxis"){e+=j+k;this._elem.css({width:e+"px",left:"0px",top:"0px"});if(d&&this._label.constructor==a.jqplot.AxisLabelRenderer){this._label._elem.css("width",k+"px")}}else{e+=j+k;this._elem.css({width:e+"px",right:"0px",top:"0px"});if(d&&this._label.constructor==a.jqplot.AxisLabelRenderer){this._label._elem.css("width",k+"px")}}}}}};a.jqplot.CategoryAxisRenderer.prototype.pack=function(e,c){var C=this._ticks;var v=this.max;var s=this.min;var n=c.max;var l=c.min;var q=(this._label==null)?false:this._label.show;var x;for(var r in e){this._elem.css(r,e[r])}this._offsets=c;var g=n-l;var k=v-s;if(!this.reverse){this.u2p=function(h){return(h-s)*g/k+l};this.p2u=function(h){return(h-l)*k/g+s};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(h){return(h-s)*g/k};this.series_p2u=function(h){return h*k/g+s}}else{this.series_u2p=function(h){return(h-v)*g/k};this.series_p2u=function(h){return h*k/g+v}}}else{this.u2p=function(h){return l+(v-h)*g/k};this.p2u=function(h){return s+(h-l)*k/g};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(h){return(v-h)*g/k};this.series_p2u=function(h){return h*k/g+v}}else{this.series_u2p=function(h){return(s-h)*g/k};this.series_p2u=function(h){return h*k/g+s}}}if(this.show){if(this.name=="xaxis"||this.name=="x2axis"){for(x=0;x<C.length;x++){var o=C[x];if(o.show&&o.showLabel){var b;if(o.constructor==a.jqplot.CanvasAxisTickRenderer&&o.angle){var A=(this.name=="xaxis")?1:-1;switch(o.labelPosition){case"auto":if(A*o.angle<0){b=-o.getWidth()+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2}else{b=-o._textRenderer.height*Math.sin(o._textRenderer.angle)/2}break;case"end":b=-o.getWidth()+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2;break;case"start":b=-o._textRenderer.height*Math.sin(o._textRenderer.angle)/2;break;case"middle":b=-o.getWidth()/2+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2;break;default:b=-o.getWidth()/2+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2;break}}else{b=-o.getWidth()/2}var D=this.u2p(o.value)+b+"px";o._elem.css("left",D);o.pack()}}var z=["bottom",0];if(q){var m=this._label._elem.outerWidth(true);this._label._elem.css("left",l+g/2-m/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px");z=["bottom",this._label._elem.outerHeight(true)]}else{this._label._elem.css("top","0px");z=["top",this._label._elem.outerHeight(true)]}this._label.pack()}var d=parseInt(this._ticks.length/this.groups,10)+1;for(x=0;x<this._groupLabels.length;x++){var B=0;var f=0;for(var u=x*d;u<(x+1)*d;u++){if(u>=this._ticks.length-1){continue}if(this._ticks[u]._elem&&this._ticks[u].label!=" "){var o=this._ticks[u]._elem;var r=o.position();B+=r.left+o.outerWidth(true)/2;f++}}B=B/f;this._groupLabels[x].css({left:(B-this._groupLabels[x].outerWidth(true)/2)});this._groupLabels[x].css(z[0],z[1])}}else{for(x=0;x<C.length;x++){var o=C[x];if(o.show&&o.showLabel){var b;if(o.constructor==a.jqplot.CanvasAxisTickRenderer&&o.angle){var A=(this.name=="yaxis")?1:-1;switch(o.labelPosition){case"auto":case"end":if(A*o.angle<0){b=-o._textRenderer.height*Math.cos(-o._textRenderer.angle)/2}else{b=-o.getHeight()+o._textRenderer.height*Math.cos(o._textRenderer.angle)/2}break;case"start":if(o.angle>0){b=-o._textRenderer.height*Math.cos(-o._textRenderer.angle)/2}else{b=-o.getHeight()+o._textRenderer.height*Math.cos(o._textRenderer.angle)/2}break;case"middle":b=-o.getHeight()/2;break;default:b=-o.getHeight()/2;break}}else{b=-o.getHeight()/2}var D=this.u2p(o.value)+b+"px";o._elem.css("top",D);o.pack()}}var z=["left",0];if(q){var y=this._label._elem.outerHeight(true);this._label._elem.css("top",n-g/2-y/2+"px");if(this.name=="yaxis"){this._label._elem.css("left","0px");z=["left",this._label._elem.outerWidth(true)]}else{this._label._elem.css("right","0px");z=["right",this._label._elem.outerWidth(true)]}this._label.pack()}var d=parseInt(this._ticks.length/this.groups,10)+1;for(x=0;x<this._groupLabels.length;x++){var B=0;var f=0;for(var u=x*d;u<(x+1)*d;u++){if(u>=this._ticks.length-1){continue}if(this._ticks[u]._elem&&this._ticks[u].label!=" "){var o=this._ticks[u]._elem;var r=o.position();B+=r.top+o.outerHeight()/2;f++}}B=B/f;this._groupLabels[x].css({top:B-this._groupLabels[x].outerHeight()/2});this._groupLabels[x].css(z[0],z[1])}}}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.ciParser
     * Data Renderer function which converts a custom JSON data object into jqPlot data format.
     * Set this as a callable on the jqplot dataRenderer plot option:
     * 
     * > plot = $.jqplot('mychart', [data], { dataRenderer: $.jqplot.ciParser, ... });
     * 
     * Where data is an object in JSON format or a JSON encoded string conforming to the
     * City Index API spec.
     * 
     * Note that calling the renderer function is handled internally by jqPlot.  The
     * user does not have to call the function.  The parameters described below will
     * automatically be passed to the ciParser function.
     * 
     * Parameters:
     * data - JSON encoded string or object.
     * plot - reference to jqPlot Plot object.
     * 
     * Returns:
     * data array in jqPlot format.
     * 
     */
    $.jqplot.ciParser = function (data, plot) {
        var ret = [],
            line,
            temp,
            i, j, k, kk;
    
         if (typeof(data) == "string") {
             data =  $.jqplot.JSON.parse(data, handleStrings);
         }
 
         else if (typeof(data) == "object") {
             for (k in data) {
                 for (i=0; i<data[k].length; i++) {
                     for (kk in data[k][i]) {
                         data[k][i][kk] = handleStrings(kk, data[k][i][kk]);
                     }
                 }
             }
         }
 
         else {
             return null;
         }
 
         // function handleStrings
         // Checks any JSON encoded strings to see if they are
         // encoded dates.  If so, pull out the timestamp.
         // Expects dates to be represented by js timestamps.
 
         function handleStrings(key, value) {
            var a;
            if (value != null) {
                if (value.toString().indexOf('Date') >= 0) {
                    //here we will try to extract the ticks from the Date string in the "value" fields of JSON returned data
                    a = /^\/Date\((-?[0-9]+)\)\/$/.exec(value);
                    if (a) {
                        return parseInt(a[1], 10);
                    }
                }
                return value;
            }
         }
 
        for (var prop in data) {
            line = [];
            temp = data[prop];
            switch (prop) {
                case "PriceTicks":
                    for (i=0; i<temp.length; i++) {
                        line.push([temp[i]['TickDate'], temp[i]['Price']]);
                    }
                    break;
                case "PriceBars":
                    for (i=0; i<temp.length; i++) {
                        line.push([temp[i]['BarDate'], temp[i]['Open'], temp[i]['High'], temp[i]['Low'], temp[i]['Close']]);
                    }
                    break;
            }
            ret.push(line);
        }
        return ret;
    };
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.ciParser=function(g,l){var m=[],o,n,h,f,e,c;if(typeof(g)=="string"){g=a.jqplot.JSON.parse(g,d)}else{if(typeof(g)=="object"){for(e in g){for(h=0;h<g[e].length;h++){for(c in g[e][h]){g[e][h][c]=d(c,g[e][h][c])}}}}else{return null}}function d(j,k){var i;if(k!=null){if(k.toString().indexOf("Date")>=0){i=/^\/Date\((-?[0-9]+)\)\/$/.exec(k);if(i){return parseInt(i[1],10)}}return k}}for(var b in g){o=[];n=g[b];switch(b){case"PriceTicks":for(h=0;h<n.length;h++){o.push([n[h]["TickDate"],n[h]["Price"]])}break;case"PriceBars":for(h=0;h<n.length;h++){o.push([n[h]["BarDate"],n[h]["Open"],n[h]["High"],n[h]["Low"],n[h]["Close"]])}break}m.push(o)}return m}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    
    /**
     * Class: $.jqplot.Cursor
     * Plugin class representing the cursor as displayed on the plot.
     */
    $.jqplot.Cursor = function(options) {
        // Group: Properties
        //
        // prop: style
        // CSS spec for cursor style
        this.style = 'crosshair';
        this.previousCursor = 'auto';
        // prop: show
        // whether to show the cursor or not.
        this.show = $.jqplot.config.enablePlugins;
        // prop: showTooltip
        // show a cursor position tooltip.  Location of the tooltip
        // will be controlled by followMouse and tooltipLocation.
        this.showTooltip = true;
        // prop: followMouse
        // Tooltip follows the mouse, it is not at a fixed location.
        // Tooltip will show on the grid at the location given by
        // tooltipLocation, offset from the grid edge by tooltipOffset.
        this.followMouse = false;
        // prop: tooltipLocation
        // Where to position tooltip.  If followMouse is true, this is
        // relative to the cursor, otherwise, it is relative to the grid.
        // One of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.tooltipLocation = 'se';
        // prop: tooltipOffset
        // Pixel offset of tooltip from the grid boudaries or cursor center.
        this.tooltipOffset = 6;
        // prop: showTooltipGridPosition
        // show the grid pixel coordinates of the mouse.
        this.showTooltipGridPosition = false;
        // prop: showTooltipUnitPosition
        // show the unit (data) coordinates of the mouse.
        this.showTooltipUnitPosition = true;
        // prop: showTooltipDataPosition
        // Used with showVerticalLine to show intersecting data points in the tooltip.
        this.showTooltipDataPosition = false;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference
        // Note, if showTooltipDataPosition is true, the default tooltipFormatString
        // will be set to the cursorLegendFormatString, not the default given here.
        this.tooltipFormatString = '%.4P, %.4P';
        // prop: useAxesFormatters
        // Use the x and y axes formatters to format the text in the tooltip.
        this.useAxesFormatters = true;
        // prop: tooltipAxisGroups
        // Show position for the specified axes.
        // This is an array like [['xaxis', 'yaxis'], ['xaxis', 'y2axis']]
        // Default is to compute automatically for all visible axes.
        this.tooltipAxisGroups = [];
        // prop: zoom
        // Enable plot zooming.
        this.zoom = false;
        // zoomProxy and zoomTarget properties are not directly set by user.  
        // They Will be set through call to zoomProxy method.
        this.zoomProxy = false;
        this.zoomTarget = false;
        // prop: looseZoom
        // Will expand zoom range to provide more rounded tick values.
        // Works only with linear, log and date axes.
        this.looseZoom = true;
        // prop: clickReset
        // Will reset plot zoom if single click on plot without drag.
        this.clickReset = false;
        // prop: dblClickReset
        // Will reset plot zoom if double click on plot without drag.
        this.dblClickReset = true;
        // prop: showVerticalLine
        // draw a vertical line across the plot which follows the cursor.
        // When the line is near a data point, a special legend and/or tooltip can
        // be updated with the data values.
        this.showVerticalLine = false;
        // prop: showHorizontalLine
        // draw a horizontal line across the plot which follows the cursor.
        this.showHorizontalLine = false;
        // prop: constrainZoomTo
        // 'none', 'x' or 'y'
        this.constrainZoomTo = 'none';
        // // prop: autoscaleConstraint
        // // when a constrained axis is specified, true will
        // // auatoscale the adjacent axis.
        // this.autoscaleConstraint = true;
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        this._zoom = {start:[], end:[], started: false, zooming:false, isZoomed:false, axes:{start:{}, end:{}}, gridpos:{}, datapos:{}};
        this._tooltipElem;
        this.zoomCanvas;
        this.cursorCanvas;
        // prop: intersectionThreshold
        // pixel distance from data point or marker to consider cursor lines intersecting with point.
        // If data point markers are not shown, this should be >= 1 or will often miss point intersections.
        this.intersectionThreshold = 2;
        // prop: showCursorLegend
        // Replace the plot legend with an enhanced legend displaying intersection information.
        this.showCursorLegend = false;
        // prop: cursorLegendFormatString
        // Format string used in the cursor legend.  If showTooltipDataPosition is true,
        // this will also be the default format string used by tooltipFormatString.
        this.cursorLegendFormatString = $.jqplot.Cursor.cursorLegendFormatString;
        // whether the cursor is over the grid or not.
        this._oldHandlers = {onselectstart: null, ondrag: null, onmousedown: null};
        // prop: constrainOutsideZoom
        // True to limit actual zoom area to edges of grid, even when zooming
        // outside of plot area.  That is, can't zoom out by mousing outside plot.
        this.constrainOutsideZoom = true;
        // prop: showTooltipOutsideZoom
        // True will keep updating the tooltip when zooming of the grid.
        this.showTooltipOutsideZoom = false;
        // true if mouse is over grid, false if not.
        this.onGrid = false;
        $.extend(true, this, options);
    };
    
    $.jqplot.Cursor.cursorLegendFormatString = '%s x:%s, y:%s';
    
    // called with scope of plot
    $.jqplot.Cursor.init = function (target, data, opts){
        // add a cursor attribute to the plot
        var options = opts || {};
        this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
        var c = this.plugins.cursor;

        if (c.show) {
            $.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);
            
            if (c.showCursorLegend) {              
                opts.legend = opts.legend || {};
                opts.legend.renderer =  $.jqplot.CursorLegendRenderer;
                opts.legend.formatString = this.plugins.cursor.cursorLegendFormatString;
                opts.legend.show = true;
            }
            
            if (c.zoom) {
                $.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleMouseDown]);
                
                if (c.clickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotClick', handleClick]);
                }
                
                if (c.dblClickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotDblClick', handleDblClick]);
                }             
            }
    
            this.resetZoom = function() {
                var axes = this.axes;
                if (!c.zoomProxy) {
                    for (var ax in axes) {
                        axes[ax].reset();
                        axes[ax]._ticks = [];
                        // fake out tick creation algorithm to make sure original auto
                        // computed format string is used if _overrideFormatString is true
                        if (c._zoom.axes[ax] !== undefined) {
                            axes[ax]._autoFormatString = c._zoom.axes[ax].tickFormatString;
                        }
                    }
                    this.redraw();
                }
                else {
                    var ctx = this.plugins.cursor.zoomCanvas._ctx;
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                    ctx = null;
                }
                this.plugins.cursor._zoom.isZoomed = false;
                this.target.trigger('jqplotResetZoom', [this, this.plugins.cursor]);
            };
            

            if (c.showTooltipDataPosition) {
                c.showTooltipUnitPosition = false;
                c.showTooltipGridPosition = false;
                if (options.cursor.tooltipFormatString == undefined) {
                    c.tooltipFormatString = $.jqplot.Cursor.cursorLegendFormatString;
                }
            }
        }
    };
    
    // called with context of plot
    $.jqplot.Cursor.postDraw = function() {
        var c = this.plugins.cursor;
        
        // Memory Leaks patch
        if (c.zoomCanvas) {
            c.zoomCanvas.resetCanvas();
            c.zoomCanvas = null;
        }
        
        if (c.cursorCanvas) {
            c.cursorCanvas.resetCanvas();
            c.cursorCanvas = null;
        }
        
        if (c._tooltipElem) {
            c._tooltipElem.emptyForce();
            c._tooltipElem = null;
        }

        
        if (c.zoom) {
            c.zoomCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding, 'jqplot-zoom-canvas', this._plotDimensions, this));
            c.zoomCanvas.setContext();
        }

        var elem = document.createElement('div');
        c._tooltipElem = $(elem);
        elem = null;
        c._tooltipElem.addClass('jqplot-cursor-tooltip');
        c._tooltipElem.css({position:'absolute', display:'none'});
        
        
        if (c.zoomCanvas) {
            c.zoomCanvas._elem.before(c._tooltipElem);
        }

        else {
            this.eventCanvas._elem.before(c._tooltipElem);
        }

        if (c.showVerticalLine || c.showHorizontalLine) {
            c.cursorCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding, 'jqplot-cursor-canvas', this._plotDimensions, this));
            c.cursorCanvas.setContext();
        }

        // if we are showing the positions in unit coordinates, and no axes groups
        // were specified, create a default set.
        if (c.showTooltipUnitPosition){
            if (c.tooltipAxisGroups.length === 0) {
                var series = this.series;
                var s;
                var temp = [];
                for (var i=0; i<series.length; i++) {
                    s = series[i];
                    var ax = s.xaxis+','+s.yaxis;
                    if ($.inArray(ax, temp) == -1) {
                        temp.push(ax);
                    }
                }
                for (var i=0; i<temp.length; i++) {
                    c.tooltipAxisGroups.push(temp[i].split(','));
                }
            }
        }
    };
    
    // Group: methods
    //
    // method: $.jqplot.Cursor.zoomProxy
    // links targetPlot to controllerPlot so that plot zooming of
    // targetPlot will be controlled by zooming on the controllerPlot.
    // controllerPlot will not actually zoom, but acts as an
    // overview plot.  Note, the zoom options must be set to true for
    // zoomProxy to work.
    $.jqplot.Cursor.zoomProxy = function(targetPlot, controllerPlot) {
        var tc = targetPlot.plugins.cursor;
        var cc = controllerPlot.plugins.cursor;
        tc.zoomTarget = true;
        tc.zoom = true;
        tc.style = 'auto';
        tc.dblClickReset = false;
        cc.zoom = true;
        cc.zoomProxy = true;
              
        controllerPlot.target.bind('jqplotZoom', plotZoom);
        controllerPlot.target.bind('jqplotResetZoom', plotReset);

        function plotZoom(ev, gridpos, datapos, plot, cursor) {
            tc.doZoom(gridpos, datapos, targetPlot, cursor);
        } 

        function plotReset(ev, plot, cursor) {
            targetPlot.resetZoom();
        }
    };
    
    $.jqplot.Cursor.prototype.resetZoom = function(plot, cursor) {
        var axes = plot.axes;
        var cax = cursor._zoom.axes;
        if (!plot.plugins.cursor.zoomProxy && cursor._zoom.isZoomed) {
            for (var ax in axes) {
                // axes[ax]._ticks = [];
                // axes[ax].min = cax[ax].min;
                // axes[ax].max = cax[ax].max;
                // axes[ax].numberTicks = cax[ax].numberTicks; 
                // axes[ax].tickInterval = cax[ax].tickInterval;
                // // for date axes
                // axes[ax].daTickInterval = cax[ax].daTickInterval;
                axes[ax].reset();
                axes[ax]._ticks = [];
                // fake out tick creation algorithm to make sure original auto
                // computed format string is used if _overrideFormatString is true
                axes[ax]._autoFormatString = cax[ax].tickFormatString;
            }
            plot.redraw();
            cursor._zoom.isZoomed = false;
        }
        else {
            var ctx = cursor.zoomCanvas._ctx;
            ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
            ctx = null;
        }
        plot.target.trigger('jqplotResetZoom', [plot, cursor]);
    };
    
    $.jqplot.Cursor.resetZoom = function(plot) {
        plot.resetZoom();
    };
    
    $.jqplot.Cursor.prototype.doZoom = function (gridpos, datapos, plot, cursor) {
        var c = cursor;
        var axes = plot.axes;
        var zaxes = c._zoom.axes;
        var start = zaxes.start;
        var end = zaxes.end;
        var min, max, dp, span,
            newmin, newmax, curax, _numberTicks, ret;
        var ctx = plot.plugins.cursor.zoomCanvas._ctx;
        // don't zoom if zoom area is too small (in pixels)
        if ((c.constrainZoomTo == 'none' && Math.abs(gridpos.x - c._zoom.start[0]) > 6 && Math.abs(gridpos.y - c._zoom.start[1]) > 6) || (c.constrainZoomTo == 'x' && Math.abs(gridpos.x - c._zoom.start[0]) > 6) ||  (c.constrainZoomTo == 'y' && Math.abs(gridpos.y - c._zoom.start[1]) > 6)) {
            if (!plot.plugins.cursor.zoomProxy) {
                for (var ax in datapos) {
                    // make a copy of the original axes to revert back.
                    if (c._zoom.axes[ax] == undefined) {
                        c._zoom.axes[ax] = {};
                        c._zoom.axes[ax].numberTicks = axes[ax].numberTicks;
                        c._zoom.axes[ax].tickInterval = axes[ax].tickInterval;
                        // for date axes...
                        c._zoom.axes[ax].daTickInterval = axes[ax].daTickInterval;
                        c._zoom.axes[ax].min = axes[ax].min;
                        c._zoom.axes[ax].max = axes[ax].max;
                        c._zoom.axes[ax].tickFormatString = (axes[ax].tickOptions != null) ? axes[ax].tickOptions.formatString :  '';
                    }


                    if ((c.constrainZoomTo == 'none') || (c.constrainZoomTo == 'x' && ax.charAt(0) == 'x') || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'y')) {   
                        dp = datapos[ax];
                        if (dp != null) {           
                            if (dp > start[ax]) { 
                                newmin = start[ax];
                                newmax = dp;
                            }
                            else {
                                span = start[ax] - dp;
                                newmin = dp;
                                newmax = start[ax];
                            }

                            curax = axes[ax];

                            _numberTicks = null;

                            // if aligning this axis, use number of ticks from previous axis.
                            // Do I need to reset somehow if alignTicks is changed and then graph is replotted??
                            if (curax.alignTicks) {
                                if (curax.name === 'x2axis' && plot.axes.xaxis.show) {
                                    _numberTicks = plot.axes.xaxis.numberTicks;
                                }
                                else if (curax.name.charAt(0) === 'y' && curax.name !== 'yaxis' && curax.name !== 'yMidAxis' && plot.axes.yaxis.show) {
                                    _numberTicks = plot.axes.yaxis.numberTicks;
                                }
                            }
                            
                            if (this.looseZoom && (axes[ax].renderer.constructor === $.jqplot.LinearAxisRenderer || axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer )) { //} || axes[ax].renderer.constructor === $.jqplot.DateAxisRenderer)) {

                                ret = $.jqplot.LinearTickGenerator(newmin, newmax, curax._scalefact, _numberTicks);

                                // if new minimum is less than "true" minimum of axis display, adjust it
                                if (axes[ax].tickInset && ret[0] < axes[ax].min + axes[ax].tickInset * axes[ax].tickInterval) {
                                    ret[0] += ret[4];
                                    ret[2] -= 1;
                                }

                                // if new maximum is greater than "true" max of axis display, adjust it
                                if (axes[ax].tickInset && ret[1] > axes[ax].max - axes[ax].tickInset * axes[ax].tickInterval) {
                                    ret[1] -= ret[4];
                                    ret[2] -= 1;
                                }

                                // for log axes, don't fall below current minimum, this will look bad and can't have 0 in range anyway.
                                if (axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer && ret[0] < axes[ax].min) {
                                    // remove a tick and shift min up
                                    ret[0] += ret[4];
                                    ret[2] -= 1;
                                }

                                axes[ax].min = ret[0];
                                axes[ax].max = ret[1];
                                axes[ax]._autoFormatString = ret[3];
                                axes[ax].numberTicks = ret[2];
                                axes[ax].tickInterval = ret[4];
                                // for date axes...
                                axes[ax].daTickInterval = [ret[4]/1000, 'seconds'];
                            }
                            else {
                                axes[ax].min = newmin;
                                axes[ax].max = newmax;
                                axes[ax].tickInterval = null;
                                axes[ax].numberTicks = null;
                                // for date axes...
                                axes[ax].daTickInterval = null;
                            }

                            axes[ax]._ticks = [];
                        }
                    }
                            
                    // if ((c.constrainZoomTo == 'x' && ax.charAt(0) == 'y' && c.autoscaleConstraint) || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'x' && c.autoscaleConstraint)) {
                    //     dp = datapos[ax];
                    //     if (dp != null) {
                    //         axes[ax].max == null;
                    //         axes[ax].min = null;
                    //     }
                    // }
                }
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                plot.redraw();
                c._zoom.isZoomed = true;
                ctx = null;
            }
            plot.target.trigger('jqplotZoom', [gridpos, datapos, plot, cursor]);
        }
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Cursor.init);
    $.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);
    
    function updateTooltip(gridpos, datapos, plot) {
        var c = plot.plugins.cursor;
        var s = '';
        var addbr = false;
        if (c.showTooltipGridPosition) {
            s = gridpos.x+', '+gridpos.y;
            addbr = true;
        }
        if (c.showTooltipUnitPosition) {
            var g;
            for (var i=0; i<c.tooltipAxisGroups.length; i++) {
                g = c.tooltipAxisGroups[i];
                if (addbr) {
                    s += '<br />';
                }
                if (c.useAxesFormatters) {
                    for (var j=0; j<g.length; j++) {
                        if (j) {
                            s += ', ';
                        }
                        var af = plot.axes[g[j]]._ticks[0].formatter;
                        var afstr = plot.axes[g[j]]._ticks[0].formatString;
                        s += af(afstr, datapos[g[j]]);
                    }
                }
                else {
                    s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]], datapos[g[1]]);
                }
                addbr = true;
            }
        }
        
        if (c.showTooltipDataPosition) {
            var series = plot.series; 
            var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
            var addbr = false;
        
            for (var i = 0; i< series.length; i++) {
                if (series[i].show) {
                    var idx = series[i].index;
                    var label = series[i].label.toString();
                    var cellid = $.inArray(idx, ret.indices);
                    var sx = undefined;
                    var sy = undefined;
                    if (cellid != -1) {
                        var data = ret.data[cellid].data;
                        if (c.useAxesFormatters) {
                            var xf = series[i]._xaxis._ticks[0].formatter;
                            var yf = series[i]._yaxis._ticks[0].formatter;
                            var xfstr = series[i]._xaxis._ticks[0].formatString;
                            var yfstr = series[i]._yaxis._ticks[0].formatString;
                            sx = xf(xfstr, data[0]);
                            sy = yf(yfstr, data[1]);
                        }
                        else {
                            sx = data[0];
                            sy = data[1];
                        }
                        if (addbr) {
                            s += '<br />';
                        }
                        s += $.jqplot.sprintf(c.tooltipFormatString, label, sx, sy);
                        addbr = true;
                    }
                }
            }
            
        }
        c._tooltipElem.html(s);
    }
    
    function moveLine(gridpos, plot) {
        var c = plot.plugins.cursor;
        var ctx = c.cursorCanvas._ctx;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        if (c.showVerticalLine) {
            c.shapeRenderer.draw(ctx, [[gridpos.x, 0], [gridpos.x, ctx.canvas.height]]);
        }
        if (c.showHorizontalLine) {
            c.shapeRenderer.draw(ctx, [[0, gridpos.y], [ctx.canvas.width, gridpos.y]]);
        }
        var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
        if (c.showCursorLegend) {
            var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
            for (var i=0; i<cells.length; i++) {
                var idx = $(cells[i]).data('seriesIndex');
                var series = plot.series[idx];
                var label = series.label.toString();
                var cellid = $.inArray(idx, ret.indices);
                var sx = undefined;
                var sy = undefined;
                if (cellid != -1) {
                    var data = ret.data[cellid].data;
                    if (c.useAxesFormatters) {
                        var xf = series._xaxis._ticks[0].formatter;
                        var yf = series._yaxis._ticks[0].formatter;
                        var xfstr = series._xaxis._ticks[0].formatString;
                        var yfstr = series._yaxis._ticks[0].formatString;
                        sx = xf(xfstr, data[0]);
                        sy = yf(yfstr, data[1]);
                    }
                    else {
                        sx = data[0];
                        sy = data[1];
                    }
                }
                if (plot.legend.escapeHtml) {
                    $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                }
                else {
                    $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                }
            }        
        }
        ctx = null;
    }
        
    function getIntersectingPoints(plot, x, y) {
        var ret = {indices:[], data:[]};
        var s, i, d0, d, j, r, p;
        var threshold;
        var c = plot.plugins.cursor;
        for (var i=0; i<plot.series.length; i++) {
            s = plot.series[i];
            r = s.renderer;
            if (s.show) {
                threshold = c.intersectionThreshold;
                if (s.showMarker) {
                    threshold += s.markerRenderer.size/2;
                }
                for (var j=0; j<s.gridData.length; j++) {
                    p = s.gridData[j];
                    // check vertical line
                    if (c.showVerticalLine) {
                        if (Math.abs(x-p[0]) <= threshold) {
                            ret.indices.push(i);
                            ret.data.push({seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]});
                        }
                    }
                } 
            }
        }
        return ret;
    }
    
    function moveTooltip(gridpos, plot) {
        var c = plot.plugins.cursor;  
        var elem = c._tooltipElem;
        switch (c.tooltipLocation) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default:
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
        }
            
        elem.css('left', x);
        elem.css('top', y);
        elem = null;
    }
    
    function positionTooltip(plot) { 
        // fake a grid for positioning
        var grid = plot._gridPadding; 
        var c = plot.plugins.cursor;
        var elem = c._tooltipElem;  
        switch (c.tooltipLocation) {
            case 'nw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'n':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'ne':
                var a = grid.right + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css({right:a, top:b});
                break;
            case 'e':
                var a = grid.right + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({right:a, top:b});
                break;
            case 'se':
                var a = grid.right + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
            case 's':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'sw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'w':
                var a = grid.left + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({left:a, top:b});
                break;
            default:  // same as 'se'
                var a = grid.right - c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
        }
        elem = null;
    }
    
    function handleClick (ev, gridpos, datapos, neighbor, plot) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var c = plot.plugins.cursor;
        if (c.clickReset) {
            c.resetZoom(plot, c);
        }
        var sel = window.getSelection;
        if (document.selection && document.selection.empty)
        {
            document.selection.empty();
        }
        else if (sel && !sel().isCollapsed) {
            sel().collapse();
        }
        return false;
    }
    
    function handleDblClick (ev, gridpos, datapos, neighbor, plot) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var c = plot.plugins.cursor;
        if (c.dblClickReset) {
            c.resetZoom(plot, c);
        }
        var sel = window.getSelection;
        if (document.selection && document.selection.empty)
        {
            document.selection.empty();
        }
        else if (sel && !sel().isCollapsed) {
            sel().collapse();
        }
        return false;
    }
    
    function handleMouseLeave(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        c.onGrid = false;
        if (c.show) {
            $(ev.target).css('cursor', c.previousCursor);
            if (c.showTooltip && !(c._zoom.zooming && c.showTooltipOutsideZoom && !c.constrainOutsideZoom)) {
                c._tooltipElem.empty();
                c._tooltipElem.hide();
            }
            if (c.zoom) {
                c._zoom.gridpos = gridpos;
                c._zoom.datapos = datapos;
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                var ctx = c.cursorCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                ctx = null;
            }
            if (c.showCursorLegend) {
                var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
                for (var i=0; i<cells.length; i++) {
                    var idx = $(cells[i]).data('seriesIndex');
                    var series = plot.series[idx];
                    var label = series.label.toString();
                    if (plot.legend.escapeHtml) {
                        $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
                    }
                    else {
                        $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
                    }
                
                }        
            }
        }
    }
    
    function handleMouseEnter(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        c.onGrid = true;
        if (c.show) {
            c.previousCursor = ev.target.style.cursor;
            ev.target.style.cursor = c.style;
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
                else {
                    positionTooltip(plot);
                }
                c._tooltipElem.show();
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                moveLine(gridpos, plot);
            }
        }

    }    
    
    function handleMouseMove(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        if (c.show) {
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                moveLine(gridpos, plot);
            }
        }
    }
            
    function getEventPosition(ev) {
        var plot = ev.data.plot;
        var go = plot.eventCanvas._elem.offset();
        var gridPos = {x:ev.pageX - go.left, y:ev.pageY - go.top};
        //////
        // TO DO: handle yMidAxis
        //////
        var dataPos = {xaxis:null, yaxis:null, x2axis:null, y2axis:null, y3axis:null, y4axis:null, y5axis:null, y6axis:null, y7axis:null, y8axis:null, y9axis:null, yMidAxis:null};
        var an = ['xaxis', 'yaxis', 'x2axis', 'y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
        var ax = plot.axes;
        var n, axis;
        for (n=11; n>0; n--) {
            axis = an[n-1];
            if (ax[axis].show) {
                dataPos[axis] = ax[axis].series_p2u(gridPos[axis.charAt(0)]);
            }
        }

        return {offsets:go, gridPos:gridPos, dataPos:dataPos};
    }    
    
    function handleZoomMove(ev) {
        var plot = ev.data.plot;
        var c = plot.plugins.cursor;
        // don't do anything if not on grid.
        if (c.show && c.zoom && c._zoom.started && !c.zoomTarget) {
            ev.preventDefault();
            var ctx = c.zoomCanvas._ctx;
            var positions = getEventPosition(ev);
            var gridpos = positions.gridPos;
            var datapos = positions.dataPos;
            c._zoom.gridpos = gridpos;
            c._zoom.datapos = datapos;
            c._zoom.zooming = true;
            var xpos = gridpos.x;
            var ypos = gridpos.y;
            var height = ctx.canvas.height;
            var width = ctx.canvas.width;
            if (c.showTooltip && !c.onGrid && c.showTooltipOutsideZoom) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
            }
            if (c.constrainZoomTo == 'x') {
                c._zoom.end = [xpos, height];
            }
            else if (c.constrainZoomTo == 'y') {
                c._zoom.end = [width, ypos];
            }
            else {
                c._zoom.end = [xpos, ypos];
            }
            var sel = window.getSelection;
            if (document.selection && document.selection.empty)
            {
                document.selection.empty();
            }
            else if (sel && !sel().isCollapsed) {
                sel().collapse();
            }
            drawZoomBox.call(c);
            ctx = null;
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        if(plot.plugins.mobile){
            $(document).one('vmouseup.jqplot_cursor', {plot:plot}, handleMouseUp);
        } else {
            $(document).one('mouseup.jqplot_cursor', {plot:plot}, handleMouseUp);
        }
        var axes = plot.axes;
        if (document.onselectstart != undefined) {
            c._oldHandlers.onselectstart = document.onselectstart;
            document.onselectstart = function () { return false; };
        }
        if (document.ondrag != undefined) {
            c._oldHandlers.ondrag = document.ondrag;
            document.ondrag = function () { return false; };
        }
        if (document.onmousedown != undefined) {
            c._oldHandlers.onmousedown = document.onmousedown;
            document.onmousedown = function () { return false; };
        }
        if (c.zoom) {
            if (!c.zoomProxy) {
                var ctx = c.zoomCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                ctx = null;
            }
            if (c.constrainZoomTo == 'x') {
                c._zoom.start = [gridpos.x, 0];
            }
            else if (c.constrainZoomTo == 'y') {
                c._zoom.start = [0, gridpos.y];
            }
            else {
                c._zoom.start = [gridpos.x, gridpos.y];
            }
            c._zoom.started = true;
            for (var ax in datapos) {
                // get zoom starting position.
                c._zoom.axes.start[ax] = datapos[ax];
            }  
           if(plot.plugins.mobile){
                $(document).bind('vmousemove.jqplotCursor', {plot:plot}, handleZoomMove);              
            } else {
                $(document).bind('mousemove.jqplotCursor', {plot:plot}, handleZoomMove);              
            }

        }
    }
    
    function handleMouseUp(ev) {
        var plot = ev.data.plot;
        var c = plot.plugins.cursor;
        if (c.zoom && c._zoom.zooming && !c.zoomTarget) {
            var xpos = c._zoom.gridpos.x;
            var ypos = c._zoom.gridpos.y;
            var datapos = c._zoom.datapos;
            var height = c.zoomCanvas._ctx.canvas.height;
            var width = c.zoomCanvas._ctx.canvas.width;
            var axes = plot.axes;
            
            if (c.constrainOutsideZoom && !c.onGrid) {
                if (xpos < 0) { xpos = 0; }
                else if (xpos > width) { xpos = width; }
                if (ypos < 0) { ypos = 0; }
                else if (ypos > height) { ypos = height; }
                
                for (var axis in datapos) {
                    if (datapos[axis]) {
                        if (axis.charAt(0) == 'x') {
                            datapos[axis] = axes[axis].series_p2u(xpos);
                        }
                        else {
                            datapos[axis] = axes[axis].series_p2u(ypos);
                        }
                    }
                }
            }
            
            if (c.constrainZoomTo == 'x') {
                ypos = height;
            }
            else if (c.constrainZoomTo == 'y') {
                xpos = width;
            }
            c._zoom.end = [xpos, ypos];
            c._zoom.gridpos = {x:xpos, y:ypos};
            
            c.doZoom(c._zoom.gridpos, datapos, plot, c);
        }
        c._zoom.started = false;
        c._zoom.zooming = false;
        
        $(document).unbind('mousemove.jqplotCursor', handleZoomMove);
        
        if (document.onselectstart != undefined && c._oldHandlers.onselectstart != null){
            document.onselectstart = c._oldHandlers.onselectstart;
            c._oldHandlers.onselectstart = null;
        }
        if (document.ondrag != undefined && c._oldHandlers.ondrag != null){
            document.ondrag = c._oldHandlers.ondrag;
            c._oldHandlers.ondrag = null;
        }
        if (document.onmousedown != undefined && c._oldHandlers.onmousedown != null){
            document.onmousedown = c._oldHandlers.onmousedown;
            c._oldHandlers.onmousedown = null;
        }

    }
    
    function drawZoomBox() {
        var start = this._zoom.start;
        var end = this._zoom.end;
        var ctx = this.zoomCanvas._ctx;
        var l, t, h, w;
        if (end[0] > start[0]) {
            l = start[0];
            w = end[0] - start[0];
        }
        else {
            l = end[0];
            w = start[0] - end[0];
        }
        if (end[1] > start[1]) {
            t = start[1];
            h = end[1] - start[1];
        }
        else {
            t = end[1];
            h = start[1] - end[1];
        }
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1.0;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.clearRect(l, t, w, h);
        // IE won't show transparent fill rect, so stroke a rect also.
        ctx.strokeRect(l,t,w,h);
        ctx = null;
    }
    
    $.jqplot.CursorLegendRenderer = function(options) {
        $.jqplot.TableLegendRenderer.call(this, options);
        this.formatString = '%s';
    };
    
    $.jqplot.CursorLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.CursorLegendRenderer.prototype.constructor = $.jqplot.CursorLegendRenderer;
    
    // called in context of a Legend
    $.jqplot.CursorLegendRenderer.prototype.draw = function() {
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }
        if (this.show) {
            var series = this._series, s;
            // make a table.  one line label per row.
            var elem = document.createElement('table');
            this._elem = $(elem);
            elem = null;
            this._elem.addClass('jqplot-legend jqplot-cursor-legend');
            this._elem.css('position', 'absolute');
        
            var pad = false;
            for (var i = 0; i< series.length; i++) {
                s = series[i];
                if (s.show && s.showLabel) {
                    var lt = $.jqplot.sprintf(this.formatString, s.label.toString());
                    if (lt) {
                        var color = s.color;
                        if (s._stack && !s.fill) {
                            color = '';
                        }
                        addrow.call(this, lt, color, pad, i);
                        pad = true;
                    }
                    // let plugins add more rows to legend.  Used by trend line plugin.
                    for (var j=0; j<$.jqplot.addLegendRowHooks.length; j++) {
                        var item = $.jqplot.addLegendRowHooks[j].call(this, s);
                        if (item) {
                            addrow.call(this, item.label, item.color, pad);
                            pad = true;
                        } 
                    }
                }
            }
            series = s = null;
            delete series;
            delete s;
        }
        
        function addrow(label, color, pad, idx) {
            var rs = (pad) ? this.rowSpacing : '0';
            var tr = $('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);
            tr.data('seriesIndex', idx);
            $('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+rs+';">'+
                '<div style="border:1px solid #cccccc;padding:0.2em;">'+
                '<div class="jqplot-cursor-legend-swatch" style="background-color:'+color+';"></div>'+
                '</div></td>').appendTo(tr);
            var td = $('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:'+rs+';"></td>');
            td.appendTo(tr);
            td.data('seriesIndex', idx);
            if (this.escapeHtml) {
                td.text(label);
            }
            else {
                td.html(label);
            }
            tr = null;
            td = null;
        }
        return this._elem;
    };
    
})(jQuery);

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(j){j.jqplot.Cursor=function(q){this.style="crosshair";this.previousCursor="auto";this.show=j.jqplot.config.enablePlugins;this.showTooltip=true;this.followMouse=false;this.tooltipLocation="se";this.tooltipOffset=6;this.showTooltipGridPosition=false;this.showTooltipUnitPosition=true;this.showTooltipDataPosition=false;this.tooltipFormatString="%.4P, %.4P";this.useAxesFormatters=true;this.tooltipAxisGroups=[];this.zoom=false;this.zoomProxy=false;this.zoomTarget=false;this.looseZoom=true;this.clickReset=false;this.dblClickReset=true;this.showVerticalLine=false;this.showHorizontalLine=false;this.constrainZoomTo="none";this.shapeRenderer=new j.jqplot.ShapeRenderer();this._zoom={start:[],end:[],started:false,zooming:false,isZoomed:false,axes:{start:{},end:{}},gridpos:{},datapos:{}};this._tooltipElem;this.zoomCanvas;this.cursorCanvas;this.intersectionThreshold=2;this.showCursorLegend=false;this.cursorLegendFormatString=j.jqplot.Cursor.cursorLegendFormatString;this._oldHandlers={onselectstart:null,ondrag:null,onmousedown:null};this.constrainOutsideZoom=true;this.showTooltipOutsideZoom=false;this.onGrid=false;j.extend(true,this,q)};j.jqplot.Cursor.cursorLegendFormatString="%s x:%s, y:%s";j.jqplot.Cursor.init=function(t,s,r){var q=r||{};this.plugins.cursor=new j.jqplot.Cursor(q.cursor);var u=this.plugins.cursor;if(u.show){j.jqplot.eventListenerHooks.push(["jqplotMouseEnter",b]);j.jqplot.eventListenerHooks.push(["jqplotMouseLeave",f]);j.jqplot.eventListenerHooks.push(["jqplotMouseMove",i]);if(u.showCursorLegend){r.legend=r.legend||{};r.legend.renderer=j.jqplot.CursorLegendRenderer;r.legend.formatString=this.plugins.cursor.cursorLegendFormatString;r.legend.show=true}if(u.zoom){j.jqplot.eventListenerHooks.push(["jqplotMouseDown",a]);if(u.clickReset){j.jqplot.eventListenerHooks.push(["jqplotClick",k])}if(u.dblClickReset){j.jqplot.eventListenerHooks.push(["jqplotDblClick",c])}}this.resetZoom=function(){var x=this.axes;if(!u.zoomProxy){for(var w in x){x[w].reset();x[w]._ticks=[];if(u._zoom.axes[w]!==undefined){x[w]._autoFormatString=u._zoom.axes[w].tickFormatString}}this.redraw()}else{var v=this.plugins.cursor.zoomCanvas._ctx;v.clearRect(0,0,v.canvas.width,v.canvas.height);v=null}this.plugins.cursor._zoom.isZoomed=false;this.target.trigger("jqplotResetZoom",[this,this.plugins.cursor])};if(u.showTooltipDataPosition){u.showTooltipUnitPosition=false;u.showTooltipGridPosition=false;if(q.cursor.tooltipFormatString==undefined){u.tooltipFormatString=j.jqplot.Cursor.cursorLegendFormatString}}}};j.jqplot.Cursor.postDraw=function(){var x=this.plugins.cursor;if(x.zoomCanvas){x.zoomCanvas.resetCanvas();x.zoomCanvas=null}if(x.cursorCanvas){x.cursorCanvas.resetCanvas();x.cursorCanvas=null}if(x._tooltipElem){x._tooltipElem.emptyForce();x._tooltipElem=null}if(x.zoom){x.zoomCanvas=new j.jqplot.GenericCanvas();this.eventCanvas._elem.before(x.zoomCanvas.createElement(this._gridPadding,"jqplot-zoom-canvas",this._plotDimensions,this));x.zoomCanvas.setContext()}var v=document.createElement("div");x._tooltipElem=j(v);v=null;x._tooltipElem.addClass("jqplot-cursor-tooltip");x._tooltipElem.css({position:"absolute",display:"none"});if(x.zoomCanvas){x.zoomCanvas._elem.before(x._tooltipElem)}else{this.eventCanvas._elem.before(x._tooltipElem)}if(x.showVerticalLine||x.showHorizontalLine){x.cursorCanvas=new j.jqplot.GenericCanvas();this.eventCanvas._elem.before(x.cursorCanvas.createElement(this._gridPadding,"jqplot-cursor-canvas",this._plotDimensions,this));x.cursorCanvas.setContext()}if(x.showTooltipUnitPosition){if(x.tooltipAxisGroups.length===0){var t=this.series;var u;var q=[];for(var r=0;r<t.length;r++){u=t[r];var w=u.xaxis+","+u.yaxis;if(j.inArray(w,q)==-1){q.push(w)}}for(var r=0;r<q.length;r++){x.tooltipAxisGroups.push(q[r].split(","))}}}};j.jqplot.Cursor.zoomProxy=function(v,r){var q=v.plugins.cursor;var u=r.plugins.cursor;q.zoomTarget=true;q.zoom=true;q.style="auto";q.dblClickReset=false;u.zoom=true;u.zoomProxy=true;r.target.bind("jqplotZoom",t);r.target.bind("jqplotResetZoom",s);function t(x,w,z,y,A){q.doZoom(w,z,v,A)}function s(w,x,y){v.resetZoom()}};j.jqplot.Cursor.prototype.resetZoom=function(u,v){var t=u.axes;var s=v._zoom.axes;if(!u.plugins.cursor.zoomProxy&&v._zoom.isZoomed){for(var r in t){t[r].reset();t[r]._ticks=[];t[r]._autoFormatString=s[r].tickFormatString}u.redraw();v._zoom.isZoomed=false}else{var q=v.zoomCanvas._ctx;q.clearRect(0,0,q.canvas.width,q.canvas.height);q=null}u.target.trigger("jqplotResetZoom",[u,v])};j.jqplot.Cursor.resetZoom=function(q){q.resetZoom()};j.jqplot.Cursor.prototype.doZoom=function(G,t,C,u){var I=u;var F=C.axes;var r=I._zoom.axes;var w=r.start;var s=r.end;var B,E,z,D,v,x,q,H,J;var A=C.plugins.cursor.zoomCanvas._ctx;if((I.constrainZoomTo=="none"&&Math.abs(G.x-I._zoom.start[0])>6&&Math.abs(G.y-I._zoom.start[1])>6)||(I.constrainZoomTo=="x"&&Math.abs(G.x-I._zoom.start[0])>6)||(I.constrainZoomTo=="y"&&Math.abs(G.y-I._zoom.start[1])>6)){if(!C.plugins.cursor.zoomProxy){for(var y in t){if(I._zoom.axes[y]==undefined){I._zoom.axes[y]={};I._zoom.axes[y].numberTicks=F[y].numberTicks;I._zoom.axes[y].tickInterval=F[y].tickInterval;I._zoom.axes[y].daTickInterval=F[y].daTickInterval;I._zoom.axes[y].min=F[y].min;I._zoom.axes[y].max=F[y].max;I._zoom.axes[y].tickFormatString=(F[y].tickOptions!=null)?F[y].tickOptions.formatString:""}if((I.constrainZoomTo=="none")||(I.constrainZoomTo=="x"&&y.charAt(0)=="x")||(I.constrainZoomTo=="y"&&y.charAt(0)=="y")){z=t[y];if(z!=null){if(z>w[y]){v=w[y];x=z}else{D=w[y]-z;v=z;x=w[y]}q=F[y];H=null;if(q.alignTicks){if(q.name==="x2axis"&&C.axes.xaxis.show){H=C.axes.xaxis.numberTicks}else{if(q.name.charAt(0)==="y"&&q.name!=="yaxis"&&q.name!=="yMidAxis"&&C.axes.yaxis.show){H=C.axes.yaxis.numberTicks}}}if(this.looseZoom&&(F[y].renderer.constructor===j.jqplot.LinearAxisRenderer||F[y].renderer.constructor===j.jqplot.LogAxisRenderer)){J=j.jqplot.LinearTickGenerator(v,x,q._scalefact,H);if(F[y].tickInset&&J[0]<F[y].min+F[y].tickInset*F[y].tickInterval){J[0]+=J[4];J[2]-=1}if(F[y].tickInset&&J[1]>F[y].max-F[y].tickInset*F[y].tickInterval){J[1]-=J[4];J[2]-=1}if(F[y].renderer.constructor===j.jqplot.LogAxisRenderer&&J[0]<F[y].min){J[0]+=J[4];J[2]-=1}F[y].min=J[0];F[y].max=J[1];F[y]._autoFormatString=J[3];F[y].numberTicks=J[2];F[y].tickInterval=J[4];F[y].daTickInterval=[J[4]/1000,"seconds"]}else{F[y].min=v;F[y].max=x;F[y].tickInterval=null;F[y].numberTicks=null;F[y].daTickInterval=null}F[y]._ticks=[]}}}A.clearRect(0,0,A.canvas.width,A.canvas.height);C.redraw();I._zoom.isZoomed=true;A=null}C.target.trigger("jqplotZoom",[G,t,C,u])}};j.jqplot.preInitHooks.push(j.jqplot.Cursor.init);j.jqplot.postDrawHooks.push(j.jqplot.Cursor.postDraw);function e(G,r,C){var J=C.plugins.cursor;var w="";var N=false;if(J.showTooltipGridPosition){w=G.x+", "+G.y;N=true}if(J.showTooltipUnitPosition){var F;for(var E=0;E<J.tooltipAxisGroups.length;E++){F=J.tooltipAxisGroups[E];if(N){w+="<br />"}if(J.useAxesFormatters){for(var D=0;D<F.length;D++){if(D){w+=", "}var H=C.axes[F[D]]._ticks[0].formatter;var B=C.axes[F[D]]._ticks[0].formatString;w+=H(B,r[F[D]])}}else{w+=j.jqplot.sprintf(J.tooltipFormatString,r[F[0]],r[F[1]])}N=true}}if(J.showTooltipDataPosition){var u=C.series;var M=d(C,G.x,G.y);var N=false;for(var E=0;E<u.length;E++){if(u[E].show){var y=u[E].index;var t=u[E].label.toString();var I=j.inArray(y,M.indices);var z=undefined;var x=undefined;if(I!=-1){var L=M.data[I].data;if(J.useAxesFormatters){var A=u[E]._xaxis._ticks[0].formatter;var q=u[E]._yaxis._ticks[0].formatter;var K=u[E]._xaxis._ticks[0].formatString;var v=u[E]._yaxis._ticks[0].formatString;z=A(K,L[0]);x=q(v,L[1])}else{z=L[0];x=L[1]}if(N){w+="<br />"}w+=j.jqplot.sprintf(J.tooltipFormatString,t,z,x);N=true}}}}J._tooltipElem.html(w)}function g(C,A){var E=A.plugins.cursor;var z=E.cursorCanvas._ctx;z.clearRect(0,0,z.canvas.width,z.canvas.height);if(E.showVerticalLine){E.shapeRenderer.draw(z,[[C.x,0],[C.x,z.canvas.height]])}if(E.showHorizontalLine){E.shapeRenderer.draw(z,[[0,C.y],[z.canvas.width,C.y]])}var G=d(A,C.x,C.y);if(E.showCursorLegend){var r=j(A.targetId+" td.jqplot-cursor-legend-label");for(var B=0;B<r.length;B++){var v=j(r[B]).data("seriesIndex");var t=A.series[v];var s=t.label.toString();var D=j.inArray(v,G.indices);var x=undefined;var w=undefined;if(D!=-1){var H=G.data[D].data;if(E.useAxesFormatters){var y=t._xaxis._ticks[0].formatter;var q=t._yaxis._ticks[0].formatter;var F=t._xaxis._ticks[0].formatString;var u=t._yaxis._ticks[0].formatString;x=y(F,H[0]);w=q(u,H[1])}else{x=H[0];w=H[1]}}if(A.legend.escapeHtml){j(r[B]).text(j.jqplot.sprintf(E.cursorLegendFormatString,s,x,w))}else{j(r[B]).html(j.jqplot.sprintf(E.cursorLegendFormatString,s,x,w))}}}z=null}function d(A,F,E){var B={indices:[],data:[]};var G,w,u,C,v,q,t;var z;var D=A.plugins.cursor;for(var w=0;w<A.series.length;w++){G=A.series[w];q=G.renderer;if(G.show){z=D.intersectionThreshold;if(G.showMarker){z+=G.markerRenderer.size/2}for(var v=0;v<G.gridData.length;v++){t=G.gridData[v];if(D.showVerticalLine){if(Math.abs(F-t[0])<=z){B.indices.push(w);B.data.push({seriesIndex:w,pointIndex:v,gridData:t,data:G.data[v]})}}}}}return B}function n(r,t){var v=t.plugins.cursor;var s=v._tooltipElem;switch(v.tooltipLocation){case"nw":var q=r.x+t._gridPadding.left-s.outerWidth(true)-v.tooltipOffset;var u=r.y+t._gridPadding.top-v.tooltipOffset-s.outerHeight(true);break;case"n":var q=r.x+t._gridPadding.left-s.outerWidth(true)/2;var u=r.y+t._gridPadding.top-v.tooltipOffset-s.outerHeight(true);break;case"ne":var q=r.x+t._gridPadding.left+v.tooltipOffset;var u=r.y+t._gridPadding.top-v.tooltipOffset-s.outerHeight(true);break;case"e":var q=r.x+t._gridPadding.left+v.tooltipOffset;var u=r.y+t._gridPadding.top-s.outerHeight(true)/2;break;case"se":var q=r.x+t._gridPadding.left+v.tooltipOffset;var u=r.y+t._gridPadding.top+v.tooltipOffset;break;case"s":var q=r.x+t._gridPadding.left-s.outerWidth(true)/2;var u=r.y+t._gridPadding.top+v.tooltipOffset;break;case"sw":var q=r.x+t._gridPadding.left-s.outerWidth(true)-v.tooltipOffset;var u=r.y+t._gridPadding.top+v.tooltipOffset;break;case"w":var q=r.x+t._gridPadding.left-s.outerWidth(true)-v.tooltipOffset;var u=r.y+t._gridPadding.top-s.outerHeight(true)/2;break;default:var q=r.x+t._gridPadding.left+v.tooltipOffset;var u=r.y+t._gridPadding.top+v.tooltipOffset;break}s.css("left",q);s.css("top",u);s=null}function m(u){var s=u._gridPadding;var v=u.plugins.cursor;var t=v._tooltipElem;switch(v.tooltipLocation){case"nw":var r=s.left+v.tooltipOffset;var q=s.top+v.tooltipOffset;t.css("left",r);t.css("top",q);break;case"n":var r=(s.left+(u._plotDimensions.width-s.right))/2-t.outerWidth(true)/2;var q=s.top+v.tooltipOffset;t.css("left",r);t.css("top",q);break;case"ne":var r=s.right+v.tooltipOffset;var q=s.top+v.tooltipOffset;t.css({right:r,top:q});break;case"e":var r=s.right+v.tooltipOffset;var q=(s.top+(u._plotDimensions.height-s.bottom))/2-t.outerHeight(true)/2;t.css({right:r,top:q});break;case"se":var r=s.right+v.tooltipOffset;var q=s.bottom+v.tooltipOffset;t.css({right:r,bottom:q});break;case"s":var r=(s.left+(u._plotDimensions.width-s.right))/2-t.outerWidth(true)/2;var q=s.bottom+v.tooltipOffset;t.css({left:r,bottom:q});break;case"sw":var r=s.left+v.tooltipOffset;var q=s.bottom+v.tooltipOffset;t.css({left:r,bottom:q});break;case"w":var r=s.left+v.tooltipOffset;var q=(s.top+(u._plotDimensions.height-s.bottom))/2-t.outerHeight(true)/2;t.css({left:r,top:q});break;default:var r=s.right-v.tooltipOffset;var q=s.bottom+v.tooltipOffset;t.css({right:r,bottom:q});break}t=null}function k(r,q,v,u,t){r.preventDefault();r.stopImmediatePropagation();var w=t.plugins.cursor;if(w.clickReset){w.resetZoom(t,w)}var s=window.getSelection;if(document.selection&&document.selection.empty){document.selection.empty()}else{if(s&&!s().isCollapsed){s().collapse()}}return false}function c(r,q,v,u,t){r.preventDefault();r.stopImmediatePropagation();var w=t.plugins.cursor;if(w.dblClickReset){w.resetZoom(t,w)}var s=window.getSelection;if(document.selection&&document.selection.empty){document.selection.empty()}else{if(s&&!s().isCollapsed){s().collapse()}}return false}function f(w,t,q,z,u){var v=u.plugins.cursor;v.onGrid=false;if(v.show){j(w.target).css("cursor",v.previousCursor);if(v.showTooltip&&!(v._zoom.zooming&&v.showTooltipOutsideZoom&&!v.constrainOutsideZoom)){v._tooltipElem.empty();v._tooltipElem.hide()}if(v.zoom){v._zoom.gridpos=t;v._zoom.datapos=q}if(v.showVerticalLine||v.showHorizontalLine){var B=v.cursorCanvas._ctx;B.clearRect(0,0,B.canvas.width,B.canvas.height);B=null}if(v.showCursorLegend){var A=j(u.targetId+" td.jqplot-cursor-legend-label");for(var s=0;s<A.length;s++){var y=j(A[s]).data("seriesIndex");var r=u.series[y];var x=r.label.toString();if(u.legend.escapeHtml){j(A[s]).text(j.jqplot.sprintf(v.cursorLegendFormatString,x,undefined,undefined))}else{j(A[s]).html(j.jqplot.sprintf(v.cursorLegendFormatString,x,undefined,undefined))}}}}}function b(r,q,u,t,s){var v=s.plugins.cursor;v.onGrid=true;if(v.show){v.previousCursor=r.target.style.cursor;r.target.style.cursor=v.style;if(v.showTooltip){e(q,u,s);if(v.followMouse){n(q,s)}else{m(s)}v._tooltipElem.show()}if(v.showVerticalLine||v.showHorizontalLine){g(q,s)}}}function i(r,q,u,t,s){var v=s.plugins.cursor;if(v.show){if(v.showTooltip){e(q,u,s);if(v.followMouse){n(q,s)}}if(v.showVerticalLine||v.showHorizontalLine){g(q,s)}}}function o(y){var x=y.data.plot;var t=x.eventCanvas._elem.offset();var w={x:y.pageX-t.left,y:y.pageY-t.top};var u={xaxis:null,yaxis:null,x2axis:null,y2axis:null,y3axis:null,y4axis:null,y5axis:null,y6axis:null,y7axis:null,y8axis:null,y9axis:null,yMidAxis:null};var v=["xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis","yMidAxis"];var q=x.axes;var r,s;for(r=11;r>0;r--){s=v[r-1];if(q[s].show){u[s]=q[s].series_p2u(w[s.charAt(0)])}}return{offsets:t,gridPos:w,dataPos:u}}function h(z){var x=z.data.plot;var y=x.plugins.cursor;if(y.show&&y.zoom&&y._zoom.started&&!y.zoomTarget){z.preventDefault();var B=y.zoomCanvas._ctx;var v=o(z);var w=v.gridPos;var t=v.dataPos;y._zoom.gridpos=w;y._zoom.datapos=t;y._zoom.zooming=true;var u=w.x;var s=w.y;var A=B.canvas.height;var q=B.canvas.width;if(y.showTooltip&&!y.onGrid&&y.showTooltipOutsideZoom){e(w,t,x);if(y.followMouse){n(w,x)}}if(y.constrainZoomTo=="x"){y._zoom.end=[u,A]}else{if(y.constrainZoomTo=="y"){y._zoom.end=[q,s]}else{y._zoom.end=[u,s]}}var r=window.getSelection;if(document.selection&&document.selection.empty){document.selection.empty()}else{if(r&&!r().isCollapsed){r().collapse()}}l.call(y);B=null}}function a(w,s,r,x,t){var v=t.plugins.cursor;if(t.plugins.mobile){j(document).one("vmouseup.jqplot_cursor",{plot:t},p)}else{j(document).one("mouseup.jqplot_cursor",{plot:t},p)}var u=t.axes;if(document.onselectstart!=undefined){v._oldHandlers.onselectstart=document.onselectstart;document.onselectstart=function(){return false}}if(document.ondrag!=undefined){v._oldHandlers.ondrag=document.ondrag;document.ondrag=function(){return false}}if(document.onmousedown!=undefined){v._oldHandlers.onmousedown=document.onmousedown;document.onmousedown=function(){return false}}if(v.zoom){if(!v.zoomProxy){var y=v.zoomCanvas._ctx;y.clearRect(0,0,y.canvas.width,y.canvas.height);y=null}if(v.constrainZoomTo=="x"){v._zoom.start=[s.x,0]}else{if(v.constrainZoomTo=="y"){v._zoom.start=[0,s.y]}else{v._zoom.start=[s.x,s.y]}}v._zoom.started=true;for(var q in r){v._zoom.axes.start[q]=r[q]}if(t.plugins.mobile){j(document).bind("vmousemove.jqplotCursor",{plot:t},h)}else{j(document).bind("mousemove.jqplotCursor",{plot:t},h)}}}function p(y){var v=y.data.plot;var x=v.plugins.cursor;if(x.zoom&&x._zoom.zooming&&!x.zoomTarget){var u=x._zoom.gridpos.x;var r=x._zoom.gridpos.y;var t=x._zoom.datapos;var z=x.zoomCanvas._ctx.canvas.height;var q=x.zoomCanvas._ctx.canvas.width;var w=v.axes;if(x.constrainOutsideZoom&&!x.onGrid){if(u<0){u=0}else{if(u>q){u=q}}if(r<0){r=0}else{if(r>z){r=z}}for(var s in t){if(t[s]){if(s.charAt(0)=="x"){t[s]=w[s].series_p2u(u)}else{t[s]=w[s].series_p2u(r)}}}}if(x.constrainZoomTo=="x"){r=z}else{if(x.constrainZoomTo=="y"){u=q}}x._zoom.end=[u,r];x._zoom.gridpos={x:u,y:r};x.doZoom(x._zoom.gridpos,t,v,x)}x._zoom.started=false;x._zoom.zooming=false;j(document).unbind("mousemove.jqplotCursor",h);if(document.onselectstart!=undefined&&x._oldHandlers.onselectstart!=null){document.onselectstart=x._oldHandlers.onselectstart;x._oldHandlers.onselectstart=null}if(document.ondrag!=undefined&&x._oldHandlers.ondrag!=null){document.ondrag=x._oldHandlers.ondrag;x._oldHandlers.ondrag=null}if(document.onmousedown!=undefined&&x._oldHandlers.onmousedown!=null){document.onmousedown=x._oldHandlers.onmousedown;x._oldHandlers.onmousedown=null}}function l(){var y=this._zoom.start;var u=this._zoom.end;var s=this.zoomCanvas._ctx;var r,v,x,q;if(u[0]>y[0]){r=y[0];q=u[0]-y[0]}else{r=u[0];q=y[0]-u[0]}if(u[1]>y[1]){v=y[1];x=u[1]-y[1]}else{v=u[1];x=y[1]-u[1]}s.fillStyle="rgba(0,0,0,0.2)";s.strokeStyle="#999999";s.lineWidth=1;s.clearRect(0,0,s.canvas.width,s.canvas.height);s.fillRect(0,0,s.canvas.width,s.canvas.height);s.clearRect(r,v,q,x);s.strokeRect(r,v,q,x);s=null}j.jqplot.CursorLegendRenderer=function(q){j.jqplot.TableLegendRenderer.call(this,q);this.formatString="%s"};j.jqplot.CursorLegendRenderer.prototype=new j.jqplot.TableLegendRenderer();j.jqplot.CursorLegendRenderer.prototype.constructor=j.jqplot.CursorLegendRenderer;j.jqplot.CursorLegendRenderer.prototype.draw=function(){if(this._elem){this._elem.emptyForce();this._elem=null}if(this.show){var w=this._series,A;var r=document.createElement("table");this._elem=j(r);r=null;this._elem.addClass("jqplot-legend jqplot-cursor-legend");this._elem.css("position","absolute");var q=false;for(var x=0;x<w.length;x++){A=w[x];if(A.show&&A.showLabel){var v=j.jqplot.sprintf(this.formatString,A.label.toString());if(v){var t=A.color;if(A._stack&&!A.fill){t=""}z.call(this,v,t,q,x);q=true}for(var u=0;u<j.jqplot.addLegendRowHooks.length;u++){var y=j.jqplot.addLegendRowHooks[u].call(this,A);if(y){z.call(this,y.label,y.color,q);q=true}}}}w=A=null;delete w;delete A}function z(D,C,F,s){var B=(F)?this.rowSpacing:"0";var E=j('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);E.data("seriesIndex",s);j('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+B+';"><div style="border:1px solid #cccccc;padding:0.2em;"><div class="jqplot-cursor-legend-swatch" style="background-color:'+C+';"></div></div></td>').appendTo(E);var G=j('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:'+B+';"></td>');G.appendTo(E);G.data("seriesIndex",s);if(this.escapeHtml){G.text(D)}else{G.html(D)}E=null;G=null}return this._elem}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {  
    /**
     * Class: $.jqplot.DateAxisRenderer
     * A plugin for a jqPlot to render an axis as a series of date values.
     * This renderer has no options beyond those supplied by the <Axis> class.
     * It supplies its own tick formatter, so the tickOptions.formatter option
     * should not be overridden.
     * 
     * Thanks to Ken Synder for his enhanced Date instance methods which are
     * included with this code <http://kendsnyder.com/sandbox/date/>.
     * 
     * To use this renderer, include the plugin in your source
     * > <script type="text/javascript" language="javascript" src="plugins/jqplot.dateAxisRenderer.js"></script>
     * 
     * and supply the appropriate options to your plot
     * 
     * > {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
     * 
     * Dates can be passed into the axis in almost any recognizable value and 
     * will be parsed.  They will be rendered on the axis in the format
     * specified by tickOptions.formatString.  e.g. tickOptions.formatString = '%Y-%m-%d'.
     * 
     * Accecptable format codes 
     * are:
     * 
     * > Code    Result                  Description
     * >             == Years ==
     * > %Y      2008                Four-digit year
     * > %y      08                  Two-digit year
     * >             == Months ==
     * > %m      09                  Two-digit month
     * > %#m     9                   One or two-digit month
     * > %B      September           Full month name
     * > %b      Sep                 Abbreviated month name
     * >             == Days ==
     * > %d      05                  Two-digit day of month
     * > %#d     5                   One or two-digit day of month
     * > %e      5                   One or two-digit day of month
     * > %A      Sunday              Full name of the day of the week
     * > %a      Sun                 Abbreviated name of the day of the week
     * > %w      0                   Number of the day of the week (0 = Sunday, 6 = Saturday)
     * > %o      th                  The ordinal suffix string following the day of the month
     * >             == Hours ==
     * > %H      23                  Hours in 24-hour format (two digits)
     * > %#H     3                   Hours in 24-hour integer format (one or two digits)
     * > %I      11                  Hours in 12-hour format (two digits)
     * > %#I     3                   Hours in 12-hour integer format (one or two digits)
     * > %p      PM                  AM or PM
     * >             == Minutes ==
     * > %M      09                  Minutes (two digits)
     * > %#M     9                   Minutes (one or two digits)
     * >             == Seconds ==
     * > %S      02                  Seconds (two digits)
     * > %#S     2                   Seconds (one or two digits)
     * > %s      1206567625723       Unix timestamp (Seconds past 1970-01-01 00:00:00)
     * >             == Milliseconds ==
     * > %N      008                 Milliseconds (three digits)
     * > %#N     8                   Milliseconds (one to three digits)
     * >             == Timezone ==
     * > %O      360                 difference in minutes between local time and GMT
     * > %Z      Mountain Standard Time  Name of timezone as reported by browser
     * > %G      -06:00              Hours and minutes between GMT
     * >             == Shortcuts ==
     * > %F      2008-03-26          %Y-%m-%d
     * > %T      05:06:30            %H:%M:%S
     * > %X      05:06:30            %H:%M:%S
     * > %x      03/26/08            %m/%d/%y
     * > %D      03/26/08            %m/%d/%y
     * > %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
     * > %v      3-Sep-2008          %e-%b-%Y
     * > %R      15:31               %H:%M
     * > %r      3:31:00 PM          %I:%M:%S %p
     * >             == Characters ==
     * > %n      \n                  Newline
     * > %t      \t                  Tab
     * > %%      %                   Percent Symbol 
     */
    $.jqplot.DateAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
        this.date = new $.jsDate();
    };

    var second = 1000;
    var minute = 60 * second;
    var hour = 60 * minute;
    var day = 24 * hour;
    var week = 7 * day;

    // these are less definitive
    var month = 30.4368499 * day;
    var year = 365.242199 * day;

    var daysInMonths = [31,28,31,30,31,30,31,30,31,30,31,30];
    // array of consistent nice intervals.  Longer intervals
    // will depend on days in month, days in year, etc.
    var niceFormatStrings = ['%M:%S.%#N', '%M:%S.%#N', '%M:%S.%#N', '%M:%S', '%M:%S', '%M:%S', '%M:%S', '%H:%M:%S', '%H:%M:%S', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%a %H:%M', '%a %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%v', '%v', '%v', '%v', '%v', '%v', '%v'];
    var niceIntervals = [0.1*second, 0.2*second, 0.5*second, second, 2*second, 5*second, 10*second, 15*second, 30*second, minute, 2*minute, 5*minute, 10*minute, 15*minute, 30*minute, hour, 2*hour, 4*hour, 6*hour, 8*hour, 12*hour, day, 2*day, 3*day, 4*day, 5*day, week, 2*week];

    var niceMonthlyIntervals = [];

    function bestDateInterval(min, max, titarget) {
        // iterate through niceIntervals to find one closest to titarget
        var badness = Number.MAX_VALUE;
        var temp, bestTi, bestfmt;
        for (var i=0, l=niceIntervals.length; i < l; i++) {
            temp = Math.abs(titarget - niceIntervals[i]);
            if (temp < badness) {
                badness = temp;
                bestTi = niceIntervals[i];
                bestfmt = niceFormatStrings[i];
            }
        }

        return [bestTi, bestfmt];
    }
    
    $.jqplot.DateAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.DateAxisRenderer.prototype.constructor = $.jqplot.DateAxisRenderer;
    
    $.jqplot.DateTickFormatter = function(format, val) {
        if (!format) {
            format = '%Y/%m/%d';
        }
        return $.jsDate.strftime(val, format);
    };
    
    $.jqplot.DateAxisRenderer.prototype.init = function(options){
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        this.tickOptions.formatter = $.jqplot.DateTickFormatter;
        // prop: tickInset
        // Controls the amount to inset the first and last ticks from 
        // the edges of the grid, in multiples of the tick interval.
        // 0 is no inset, 0.5 is one half a tick interval, 1 is a full
        // tick interval, etc.
        this.tickInset = 0;
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = true;
        // prop: baselineWidth
        // width of the baseline in pixels.
        this.baselineWidth = null;
        // prop: baselineColor
        // CSS color spec for the baseline.
        this.baselineColor = null;
        this.daTickInterval = null;
        this._daTickInterval = null;
        
        $.extend(true, this, options);
        
        var db = this._dataBounds,
            stats, 
            sum,
            s,
            d,
            pd,
            sd,
            intv;
        
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            stats = {intervals:[], frequencies:{}, sortedIntervals:[], min:null, max:null, mean:null};
            sum = 0;
            s = this._series[i];
            d = s.data;
            pd = s._plotData;
            sd = s._stackData;
            intv = 0;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    d[j][0] = new $.jsDate(d[j][0]).getTime();
                    pd[j][0] = new $.jsDate(d[j][0]).getTime();
                    sd[j][0] = new $.jsDate(d[j][0]).getTime();
                    if ((d[j][0] != null && d[j][0] < db.min) || db.min == null) {
                        db.min = d[j][0];
                    }
                    if ((d[j][0] != null && d[j][0] > db.max) || db.max == null) {
                        db.max = d[j][0];
                    }
                    if (j>0) {
                        intv = Math.abs(d[j][0] - d[j-1][0]);
                        stats.intervals.push(intv);
                        if (stats.frequencies.hasOwnProperty(intv)) {
                            stats.frequencies[intv] += 1;
                        }
                        else {
                            stats.frequencies[intv] = 1;
                        }
                    }
                    sum += intv;
                    
                }              
                else {
                    d[j][1] = new $.jsDate(d[j][1]).getTime();
                    pd[j][1] = new $.jsDate(d[j][1]).getTime();
                    sd[j][1] = new $.jsDate(d[j][1]).getTime();
                    if ((d[j][1] != null && d[j][1] < db.min) || db.min == null) {
                        db.min = d[j][1];
                    }
                    if ((d[j][1] != null && d[j][1] > db.max) || db.max == null) {
                        db.max = d[j][1];
                    }
                    if (j>0) {
                        intv = Math.abs(d[j][1] - d[j-1][1]);
                        stats.intervals.push(intv);
                        if (stats.frequencies.hasOwnProperty(intv)) {
                            stats.frequencies[intv] += 1;
                        }
                        else {
                            stats.frequencies[intv] = 1;
                        }
                    }
                }
                sum += intv;              
            }

            if (s.renderer.bands) {
                if (s.renderer.bands.hiData.length) {
                    var bd = s.renderer.bands.hiData;
                    for (var j=0, l=bd.length; j < l; j++) {
                        if (this.name === 'xaxis' || this.name === 'x2axis') {
                            bd[j][0] = new $.jsDate(bd[j][0]).getTime();
                            if ((bd[j][0] != null && bd[j][0] > db.max) || db.max == null) {
                                db.max = bd[j][0];
                            }                        
                        }              
                        else {
                            bd[j][1] = new $.jsDate(bd[j][1]).getTime();
                            if ((bd[j][1] != null && bd[j][1] > db.max) || db.max == null) {
                                db.max = bd[j][1];
                            }
                        }
                    }
                }
                if (s.renderer.bands.lowData.length) {
                    var bd = s.renderer.bands.lowData;
                    for (var j=0, l=bd.length; j < l; j++) {
                        if (this.name === 'xaxis' || this.name === 'x2axis') {
                            bd[j][0] = new $.jsDate(bd[j][0]).getTime();
                            if ((bd[j][0] != null && bd[j][0] < db.min) || db.min == null) {
                                db.min = bd[j][0];
                            }                       
                        }              
                        else {
                            bd[j][1] = new $.jsDate(bd[j][1]).getTime();
                            if ((bd[j][1] != null && bd[j][1] < db.min) || db.min == null) {
                                db.min = bd[j][1];
                            }
                        }
                    }
                }
            }
            
            var tempf = 0,
                tempn=0;
            for (var n in stats.frequencies) {
                stats.sortedIntervals.push({interval:n, frequency:stats.frequencies[n]});
            }
            stats.sortedIntervals.sort(function(a, b){
                return b.frequency - a.frequency;
            });
            
            stats.min = $.jqplot.arrayMin(stats.intervals);
            stats.max = $.jqplot.arrayMax(stats.intervals);
            stats.mean = sum/d.length;
            this._intervalStats.push(stats);
            stats = sum = s = d = pd = sd = null;
        }
        db = null;
        
    };
    
    // called with scope of an axis
    $.jqplot.DateAxisRenderer.prototype.reset = function() {
        this.min = this._options.min;
        this.max = this._options.max;
        this.tickInterval = this._options.tickInterval;
        this.numberTicks = this._options.numberTicks;
        this._autoFormatString = '';
        if (this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
            this.tickOptions.formatString = '';
        }
        this.daTickInterval = this._daTickInterval;
        // this._ticks = this.__ticks;
    };
    
    $.jqplot.DateAxisRenderer.prototype.createTicks = function(plot) {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var iv = this._intervalStats;
        var dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;
        var interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        var threshold = 30;
        var insetMult = 1;
        var daTickInterval = null;
        
        // if user specified a tick interval, convert to usable.
        if (this.tickInterval != null)
        {
            // if interval is a number or can be converted to one, use it.
            // Assume it is in SECONDS!!!
            if (Number(this.tickInterval)) {
                daTickInterval = [Number(this.tickInterval), 'seconds'];
            }
            // else, parse out something we can build from.
            else if (typeof this.tickInterval == "string") {
                var parts = this.tickInterval.split(' ');
                if (parts.length == 1) {
                    daTickInterval = [1, parts[0]];
                }
                else if (parts.length == 2) {
                    daTickInterval = [parts[0], parts[1]];
                }
            }
        }

        var tickInterval = this.tickInterval;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        min = new $.jsDate((this.min != null) ? this.min : db.min).getTime();
        max = new $.jsDate((this.max != null) ? this.max : db.max).getTime();

        // see if we're zooming.  if we are, don't use the min and max we're given,
        // but compute some nice ones.  They will be reset later.

        var cursor = plot.plugins.cursor;

        if (cursor && cursor._zoom && cursor._zoom.zooming) {
            this.min = null;
            this.max = null;
        }

        var range = max - min;

        if (this.tickOptions == null || !this.tickOptions.formatString) {
            this._overrideFormatString = true;
        }
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if (ut.constructor == Array) {
                    t.value = new $.jsDate(ut[0]).getTime();
                    t.label = ut[1];
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(t.value, this.name);
                    this._ticks.push(t);
                }
                
                else {
                    t.value = new $.jsDate(ut).getTime();
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(t.value, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
        }

        ////////
        // We don't have any ticks yet, let's make some!
        ////////

        // special case when there is only one point, make three tick marks to center the point
        else if (this.min == null && this.max == null && db.min == db.max)
        {
             var onePointOpts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});
             var delta = 300000;
             this.min = db.min - delta;
             this.max = db.max + delta;
             this.numberTicks = 3;

             for(var i=this.min;i<=this.max;i+= delta)
             {
                 onePointOpts.value = i;

                 var t = new this.tickRenderer(onePointOpts);

                 if (this._overrideFormatString && this._autoFormatString != '') {
                    t.formatString = this._autoFormatString;
                 }

                 t.showLabel = false;
                 t.showMark = false;

                 this._ticks.push(t);
             }

             if(this.showTicks) {
                 this._ticks[1].showLabel = true;
             }
             if(this.showTickMarks) {
                 this._ticks[1].showTickMarks = true;
             }                   
        }
        // if user specified min and max are null, we set those to make best ticks.
        else if (this.min == null && this.max == null) {

            var opts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});

            // want to find a nice interval 
            var nttarget,
                titarget;

            // if no tickInterval or numberTicks options specified,  make a good guess.
            if (!this.tickInterval && !this.numberTicks) {
                var tdim = Math.max(dim, threshold+1);
                // how many ticks to put on the axis?
                // date labels tend to be long.  If ticks not rotated,
                // don't use too many and have a high spacing factor.
                // If we are rotating ticks, use a lower factor.
                var spacingFactor = 115;
                if (this.tickRenderer === $.jqplot.CanvasAxisTickRenderer && this.tickOptions.angle) {
                    spacingFactor = 115 - 40 * Math.abs(Math.sin(this.tickOptions.angle/180*Math.PI));
                }

                nttarget =  Math.ceil((tdim-threshold)/spacingFactor + 1);
                titarget = (max - min) / (nttarget - 1);
            }

            // If tickInterval is specified, we'll try to honor it.
            // Not guaranteed to get this interval, but we'll get as close as
            // we can.
            // tickInterval will be used before numberTicks, that is if
            // both are specified, numberTicks will be ignored.
            else if (this.tickInterval) {
                titarget = new $.jsDate(0).add(daTickInterval[0], daTickInterval[1]).getTime();
            }

            // if numberTicks specified, try to honor it.
            // Not guaranteed, but will try to get close.
            else if (this.numberTicks) {
                nttarget = this.numberTicks;
                titarget = (max - min) / (nttarget - 1);
            }

            // If we can use an interval of 2 weeks or less, pick best one
            if (titarget <= 19*day) {
                var ret = bestDateInterval(min, max, titarget);
                var tempti = ret[0];
                this._autoFormatString = ret[1];

                min = new $.jsDate(min);
                min = Math.floor((min.getTime() - min.getUtcOffset())/tempti) * tempti + min.getUtcOffset();

                nttarget = Math.ceil((max - min) / tempti) + 1;
                this.min = min;
                this.max = min + (nttarget - 1) * tempti;

                // if max is less than max, add an interval
                if (this.max < max) {
                    this.max += tempti;
                    nttarget += 1;
                }
                this.tickInterval = tempti;
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    opts.value = this.min + i * tempti;
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = this.tickInterval;
            }

            // should we use a monthly interval?
            else if (titarget <= 9 * month) {

                this._autoFormatString = '%v';

                // how many months in an interval?
                var intv = Math.round(titarget/month);
                if (intv < 1) {
                    intv = 1;
                }
                else if (intv > 6) {
                    intv = 6;
                }

                // figure out the starting month and ending month.
                var mstart = new $.jsDate(min).setDate(1).setHours(0,0,0,0);

                // See if max ends exactly on a month
                var tempmend = new $.jsDate(max);
                var mend = new $.jsDate(max).setDate(1).setHours(0,0,0,0);

                if (tempmend.getTime() !== mend.getTime()) {
                    mend = mend.add(1, 'month');
                }

                var nmonths = mend.diff(mstart, 'month');

                nttarget = Math.ceil(nmonths/intv) + 1;

                this.min = mstart.getTime();
                this.max = mstart.clone().add((nttarget - 1) * intv, 'month').getTime();
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    if (i === 0) {
                        opts.value = mstart.getTime();
                    }
                    else {
                        opts.value = mstart.add(intv, 'month').getTime();
                    }
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = intv * month;
            }

            // use yearly intervals
            else {

                this._autoFormatString = '%v';

                // how many years in an interval?
                var intv = Math.round(titarget/year);
                if (intv < 1) {
                    intv = 1;
                }

                // figure out the starting and ending years.
                var mstart = new $.jsDate(min).setMonth(0, 1).setHours(0,0,0,0);
                var mend = new $.jsDate(max).add(1, 'year').setMonth(0, 1).setHours(0,0,0,0);

                var nyears = mend.diff(mstart, 'year');

                nttarget = Math.ceil(nyears/intv) + 1;

                this.min = mstart.getTime();
                this.max = mstart.clone().add((nttarget - 1) * intv, 'year').getTime();
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    if (i === 0) {
                        opts.value = mstart.getTime();
                    }
                    else {
                        opts.value = mstart.add(intv, 'year').getTime();
                    }
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = intv * year;
            }
        }

        ////////
        // Some option(s) specified, work around that.
        ////////
        
        else {      
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            if (this.tickInterval != null && daTickInterval != null) {
                this.daTickInterval = daTickInterval;
            }
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 24*60*60*500;  // 1/2 day
                min -= adj;
                max += adj;
            }

            range = max - min;
            
            var optNumTicks = 2 + parseInt(Math.max(0, dim-100)/100, 10);
            
            
            var rmin, rmax;
            
            rmin = (this.min != null) ? new $.jsDate(this.min).getTime() : min - range/2*(this.padMin - 1);
            rmax = (this.max != null) ? new $.jsDate(this.max).getTime() : max + range/2*(this.padMax - 1);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
            
            if (this.numberTicks == null){
                // if tickInterval is specified by user, we will ignore computed maximum.
                // max will be equal or greater to fit even # of ticks.
                if (this.daTickInterval != null) {
                    var nc = new $.jsDate(this.max).diff(this.min, this.daTickInterval[1], true);
                    this.numberTicks = Math.ceil(nc/this.daTickInterval[0]) +1;
                    // this.max = new $.jsDate(this.min).add(this.numberTicks-1, this.daTickInterval[1]).getTime();
                    this.max = new $.jsDate(this.min).add((this.numberTicks-1) * this.daTickInterval[0], this.daTickInterval[1]).getTime();
                }
                else if (dim > 200) {
                    this.numberTicks = parseInt(3+(dim-200)/100, 10);
                }
                else {
                    this.numberTicks = 2;
                }
            }
            
            insetMult = range / (this.numberTicks-1)/1000;

            if (this.daTickInterval == null) {
                this.daTickInterval = [insetMult, 'seconds'];
            }


            for (var i=0; i<this.numberTicks; i++){
                var min = new $.jsDate(this.min);
                tt = min.add(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
                var t = new this.tickRenderer(this.tickOptions);
                // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) {
                    t.showMark = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }

        if (this.tickInset) {
            this.min = this.min - this.tickInset * insetMult;
            this.max = this.max + this.tickInset * insetMult;
        }

        if (this._daTickInterval == null) {
            this._daTickInterval = this.daTickInterval;    
        }

        ticks = null;
    };
   
})(jQuery);


/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(h){h.jqplot.DateAxisRenderer=function(){h.jqplot.LinearAxisRenderer.call(this);this.date=new h.jsDate()};var c=1000;var e=60*c;var f=60*e;var l=24*f;var b=7*l;var j=30.4368499*l;var k=365.242199*l;var g=[31,28,31,30,31,30,31,30,31,30,31,30];var i=["%M:%S.%#N","%M:%S.%#N","%M:%S.%#N","%M:%S","%M:%S","%M:%S","%M:%S","%H:%M:%S","%H:%M:%S","%H:%M","%H:%M","%H:%M","%H:%M","%H:%M","%H:%M","%a %H:%M","%a %H:%M","%b %e %H:%M","%b %e %H:%M","%b %e %H:%M","%b %e %H:%M","%v","%v","%v","%v","%v","%v","%v"];var m=[0.1*c,0.2*c,0.5*c,c,2*c,5*c,10*c,15*c,30*c,e,2*e,5*e,10*e,15*e,30*e,f,2*f,4*f,6*f,8*f,12*f,l,2*l,3*l,4*l,5*l,b,2*b];var d=[];function a(p,s,t){var o=Number.MAX_VALUE;var u,r,v;for(var q=0,n=m.length;q<n;q++){u=Math.abs(t-m[q]);if(u<o){o=u;r=m[q];v=i[q]}}return[r,v]}h.jqplot.DateAxisRenderer.prototype=new h.jqplot.LinearAxisRenderer();h.jqplot.DateAxisRenderer.prototype.constructor=h.jqplot.DateAxisRenderer;h.jqplot.DateTickFormatter=function(n,o){if(!n){n="%Y/%m/%d"}return h.jsDate.strftime(o,n)};h.jqplot.DateAxisRenderer.prototype.init=function(E){this.tickOptions.formatter=h.jqplot.DateTickFormatter;this.tickInset=0;this.drawBaseline=true;this.baselineWidth=null;this.baselineColor=null;this.daTickInterval=null;this._daTickInterval=null;h.extend(true,this,E);var C=this._dataBounds,u,x,D,y,A,z,o;for(var t=0;t<this._series.length;t++){u={intervals:[],frequencies:{},sortedIntervals:[],min:null,max:null,mean:null};x=0;D=this._series[t];y=D.data;A=D._plotData;z=D._stackData;o=0;for(var r=0;r<y.length;r++){if(this.name=="xaxis"||this.name=="x2axis"){y[r][0]=new h.jsDate(y[r][0]).getTime();A[r][0]=new h.jsDate(y[r][0]).getTime();z[r][0]=new h.jsDate(y[r][0]).getTime();if((y[r][0]!=null&&y[r][0]<C.min)||C.min==null){C.min=y[r][0]}if((y[r][0]!=null&&y[r][0]>C.max)||C.max==null){C.max=y[r][0]}if(r>0){o=Math.abs(y[r][0]-y[r-1][0]);u.intervals.push(o);if(u.frequencies.hasOwnProperty(o)){u.frequencies[o]+=1}else{u.frequencies[o]=1}}x+=o}else{y[r][1]=new h.jsDate(y[r][1]).getTime();A[r][1]=new h.jsDate(y[r][1]).getTime();z[r][1]=new h.jsDate(y[r][1]).getTime();if((y[r][1]!=null&&y[r][1]<C.min)||C.min==null){C.min=y[r][1]}if((y[r][1]!=null&&y[r][1]>C.max)||C.max==null){C.max=y[r][1]}if(r>0){o=Math.abs(y[r][1]-y[r-1][1]);u.intervals.push(o);if(u.frequencies.hasOwnProperty(o)){u.frequencies[o]+=1}else{u.frequencies[o]=1}}}x+=o}if(D.renderer.bands){if(D.renderer.bands.hiData.length){var w=D.renderer.bands.hiData;for(var r=0,q=w.length;r<q;r++){if(this.name==="xaxis"||this.name==="x2axis"){w[r][0]=new h.jsDate(w[r][0]).getTime();if((w[r][0]!=null&&w[r][0]>C.max)||C.max==null){C.max=w[r][0]}}else{w[r][1]=new h.jsDate(w[r][1]).getTime();if((w[r][1]!=null&&w[r][1]>C.max)||C.max==null){C.max=w[r][1]}}}}if(D.renderer.bands.lowData.length){var w=D.renderer.bands.lowData;for(var r=0,q=w.length;r<q;r++){if(this.name==="xaxis"||this.name==="x2axis"){w[r][0]=new h.jsDate(w[r][0]).getTime();if((w[r][0]!=null&&w[r][0]<C.min)||C.min==null){C.min=w[r][0]}}else{w[r][1]=new h.jsDate(w[r][1]).getTime();if((w[r][1]!=null&&w[r][1]<C.min)||C.min==null){C.min=w[r][1]}}}}}var B=0,v=0;for(var p in u.frequencies){u.sortedIntervals.push({interval:p,frequency:u.frequencies[p]})}u.sortedIntervals.sort(function(s,n){return n.frequency-s.frequency});u.min=h.jqplot.arrayMin(u.intervals);u.max=h.jqplot.arrayMax(u.intervals);u.mean=x/y.length;this._intervalStats.push(u);u=x=D=y=A=z=null}C=null};h.jqplot.DateAxisRenderer.prototype.reset=function(){this.min=this._options.min;this.max=this._options.max;this.tickInterval=this._options.tickInterval;this.numberTicks=this._options.numberTicks;this._autoFormatString="";if(this._overrideFormatString&&this.tickOptions&&this.tickOptions.formatString){this.tickOptions.formatString=""}this.daTickInterval=this._daTickInterval};h.jqplot.DateAxisRenderer.prototype.createTicks=function(p){var X=this._ticks;var L=this.ticks;var F=this.name;var H=this._dataBounds;var M=this._intervalStats;var n=(this.name.charAt(0)==="x")?this._plotDimensions.width:this._plotDimensions.height;var w;var ae,J;var y,x;var ad,aa;var s=30;var O=1;var U=null;if(this.tickInterval!=null){if(Number(this.tickInterval)){U=[Number(this.tickInterval),"seconds"]}else{if(typeof this.tickInterval=="string"){var ac=this.tickInterval.split(" ");if(ac.length==1){U=[1,ac[0]]}else{if(ac.length==2){U=[ac[0],ac[1]]}}}}}var v=this.tickInterval;ae=new h.jsDate((this.min!=null)?this.min:H.min).getTime();J=new h.jsDate((this.max!=null)?this.max:H.max).getTime();var A=p.plugins.cursor;if(A&&A._zoom&&A._zoom.zooming){this.min=null;this.max=null}var B=J-ae;if(this.tickOptions==null||!this.tickOptions.formatString){this._overrideFormatString=true}if(L.length){for(aa=0;aa<L.length;aa++){var P=L[aa];var Y=new this.tickRenderer(this.tickOptions);if(P.constructor==Array){Y.value=new h.jsDate(P[0]).getTime();Y.label=P[1];if(!this.showTicks){Y.showLabel=false;Y.showMark=false}else{if(!this.showTickMarks){Y.showMark=false}}Y.setTick(Y.value,this.name);this._ticks.push(Y)}else{Y.value=new h.jsDate(P).getTime();if(!this.showTicks){Y.showLabel=false;Y.showMark=false}else{if(!this.showTickMarks){Y.showMark=false}}Y.setTick(Y.value,this.name);this._ticks.push(Y)}}this.numberTicks=L.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value;this.daTickInterval=[(this.max-this.min)/(this.numberTicks-1)/1000,"seconds"]}else{if(this.min==null&&this.max==null&&H.min==H.max){var E=h.extend(true,{},this.tickOptions,{name:this.name,value:null});var T=300000;this.min=H.min-T;this.max=H.max+T;this.numberTicks=3;for(var aa=this.min;aa<=this.max;aa+=T){E.value=aa;var Y=new this.tickRenderer(E);if(this._overrideFormatString&&this._autoFormatString!=""){Y.formatString=this._autoFormatString}Y.showLabel=false;Y.showMark=false;this._ticks.push(Y)}if(this.showTicks){this._ticks[1].showLabel=true}if(this.showTickMarks){this._ticks[1].showTickMarks=true}}else{if(this.min==null&&this.max==null){var N=h.extend(true,{},this.tickOptions,{name:this.name,value:null});var ab,I;if(!this.tickInterval&&!this.numberTicks){var R=Math.max(n,s+1);var Z=115;if(this.tickRenderer===h.jqplot.CanvasAxisTickRenderer&&this.tickOptions.angle){Z=115-40*Math.abs(Math.sin(this.tickOptions.angle/180*Math.PI))}ab=Math.ceil((R-s)/Z+1);I=(J-ae)/(ab-1)}else{if(this.tickInterval){I=new h.jsDate(0).add(U[0],U[1]).getTime()}else{if(this.numberTicks){ab=this.numberTicks;I=(J-ae)/(ab-1)}}}if(I<=19*l){var Q=a(ae,J,I);var r=Q[0];this._autoFormatString=Q[1];ae=new h.jsDate(ae);ae=Math.floor((ae.getTime()-ae.getUtcOffset())/r)*r+ae.getUtcOffset();ab=Math.ceil((J-ae)/r)+1;this.min=ae;this.max=ae+(ab-1)*r;if(this.max<J){this.max+=r;ab+=1}this.tickInterval=r;this.numberTicks=ab;for(var aa=0;aa<ab;aa++){N.value=this.min+aa*r;Y=new this.tickRenderer(N);if(this._overrideFormatString&&this._autoFormatString!=""){Y.formatString=this._autoFormatString}if(!this.showTicks){Y.showLabel=false;Y.showMark=false}else{if(!this.showTickMarks){Y.showMark=false}}this._ticks.push(Y)}O=this.tickInterval}else{if(I<=9*j){this._autoFormatString="%v";var D=Math.round(I/j);if(D<1){D=1}else{if(D>6){D=6}}var V=new h.jsDate(ae).setDate(1).setHours(0,0,0,0);var q=new h.jsDate(J);var z=new h.jsDate(J).setDate(1).setHours(0,0,0,0);if(q.getTime()!==z.getTime()){z=z.add(1,"month")}var S=z.diff(V,"month");ab=Math.ceil(S/D)+1;this.min=V.getTime();this.max=V.clone().add((ab-1)*D,"month").getTime();this.numberTicks=ab;for(var aa=0;aa<ab;aa++){if(aa===0){N.value=V.getTime()}else{N.value=V.add(D,"month").getTime()}Y=new this.tickRenderer(N);if(this._overrideFormatString&&this._autoFormatString!=""){Y.formatString=this._autoFormatString}if(!this.showTicks){Y.showLabel=false;Y.showMark=false}else{if(!this.showTickMarks){Y.showMark=false}}this._ticks.push(Y)}O=D*j}else{this._autoFormatString="%v";var D=Math.round(I/k);if(D<1){D=1}var V=new h.jsDate(ae).setMonth(0,1).setHours(0,0,0,0);var z=new h.jsDate(J).add(1,"year").setMonth(0,1).setHours(0,0,0,0);var K=z.diff(V,"year");ab=Math.ceil(K/D)+1;this.min=V.getTime();this.max=V.clone().add((ab-1)*D,"year").getTime();this.numberTicks=ab;for(var aa=0;aa<ab;aa++){if(aa===0){N.value=V.getTime()}else{N.value=V.add(D,"year").getTime()}Y=new this.tickRenderer(N);if(this._overrideFormatString&&this._autoFormatString!=""){Y.formatString=this._autoFormatString}if(!this.showTicks){Y.showLabel=false;Y.showMark=false}else{if(!this.showTickMarks){Y.showMark=false}}this._ticks.push(Y)}O=D*k}}}else{if(F=="xaxis"||F=="x2axis"){n=this._plotDimensions.width}else{n=this._plotDimensions.height}if(this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null}if(this.tickInterval!=null&&U!=null){this.daTickInterval=U}if(ae==J){var o=24*60*60*500;ae-=o;J+=o}B=J-ae;var G=2+parseInt(Math.max(0,n-100)/100,10);var W,C;W=(this.min!=null)?new h.jsDate(this.min).getTime():ae-B/2*(this.padMin-1);C=(this.max!=null)?new h.jsDate(this.max).getTime():J+B/2*(this.padMax-1);this.min=W;this.max=C;B=this.max-this.min;if(this.numberTicks==null){if(this.daTickInterval!=null){var u=new h.jsDate(this.max).diff(this.min,this.daTickInterval[1],true);this.numberTicks=Math.ceil(u/this.daTickInterval[0])+1;this.max=new h.jsDate(this.min).add((this.numberTicks-1)*this.daTickInterval[0],this.daTickInterval[1]).getTime()}else{if(n>200){this.numberTicks=parseInt(3+(n-200)/100,10)}else{this.numberTicks=2}}}O=B/(this.numberTicks-1)/1000;if(this.daTickInterval==null){this.daTickInterval=[O,"seconds"]}for(var aa=0;aa<this.numberTicks;aa++){var ae=new h.jsDate(this.min);ad=ae.add(aa*this.daTickInterval[0],this.daTickInterval[1]).getTime();var Y=new this.tickRenderer(this.tickOptions);if(!this.showTicks){Y.showLabel=false;Y.showMark=false}else{if(!this.showTickMarks){Y.showMark=false}}Y.setTick(ad,this.name);this._ticks.push(Y)}}}}if(this.tickInset){this.min=this.min-this.tickInset*O;this.max=this.max+this.tickInset*O}if(this._daTickInterval==null){this._daTickInterval=this.daTickInterval}X=null}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.DonutRenderer
     * Plugin renderer to draw a donut chart.
     * x values, if present, will be used as slice labels.
     * y values give slice size.
     * 
     * To use this renderer, you need to include the 
     * donut renderer plugin, for example:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.donutRenderer.js"></script>
     * 
     * Properties described here are passed into the $.jqplot function
     * as options on the series renderer.  For example:
     * 
     * > plot2 = $.jqplot('chart2', [s1, s2], {
     * >     seriesDefaults: {
     * >         renderer:$.jqplot.DonutRenderer,
     * >         rendererOptions:{
     * >              sliceMargin: 2,
     * >              innerDiameter: 110,
     * >              startAngle: -90
     * >          }
     * >      }
     * > });
     * 
     * A donut plot will trigger events on the plot target
     * according to user interaction.  All events return the event object,
     * the series index, the point (slice) index, and the point data for 
     * the appropriate slice.
     * 
     * 'jqplotDataMouseOver' - triggered when user mouseing over a slice.
     * 'jqplotDataHighlight' - triggered the first time user mouses over a slice,
     * if highlighting is enabled.
     * 'jqplotDataUnhighlight' - triggered when a user moves the mouse out of
     * a highlighted slice.
     * 'jqplotDataClick' - triggered when the user clicks on a slice.
     * 'jqplotDataRightClick' - tiggered when the user right clicks on a slice if
     * the "captureRightClick" option is set to true on the plot.
     */
    $.jqplot.DonutRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.DonutRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.DonutRenderer.prototype.constructor = $.jqplot.DonutRenderer;
    
    // called with scope of a series
    $.jqplot.DonutRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: diameter
        // Outer diameter of the donut, auto computed by default
        this.diameter = null;
        // prop: innerDiameter
        // Inner diameter of the donut, auto calculated by default.
        // If specified will override thickness value.
        this.innerDiameter = null;
        // prop: thickness
        // thickness of the donut, auto computed by default
        // Overridden by if innerDiameter is specified.
        this.thickness = null;
        // prop: padding
        // padding between the donut and plot edges, legend, etc.
        this.padding = 20;
        // prop: sliceMargin
        // angular spacing between donut slices in degrees.
        this.sliceMargin = 0;
        // prop: ringMargin
        // pixel distance between rings, or multiple series in a donut plot.
        // null will compute ringMargin based on sliceMargin.
        this.ringMargin = null;
        // prop: fill
        // true or false, whether to fil the slices.
        this.fill = true;
        // prop: shadowOffset
        // offset of the shadow from the slice and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a slice.
        this.highlightColors = [];
        // prop: dataLabels
        // Either 'label', 'value', 'percent' or an array of labels to place on the pie slices.
        // Defaults to percentage of each pie slice.
        this.dataLabels = 'percent';
        // prop: showDataLabels
        // true to show data labels on slices.
        this.showDataLabels = false;
        // prop: dataLabelFormatString
        // Format string for data labels.  If none, '%s' is used for "label" and for arrays, '%d' for value and '%d%%' for percentage.
        this.dataLabelFormatString = null;
        // prop: dataLabelThreshold
        // Threshhold in percentage (0 - 100) of pie area, below which no label will be displayed.
        // This applies to all label types, not just to percentage labels.
        this.dataLabelThreshold = 3;
        // prop: dataLabelPositionFactor
        // A Multiplier (0-1) of the pie radius which controls position of label on slice.
        // Increasing will slide label toward edge of pie, decreasing will slide label toward center of pie.
        this.dataLabelPositionFactor = 0.4;
        // prop: dataLabelNudge
        // Number of pixels to slide the label away from (+) or toward (-) the center of the pie.
        this.dataLabelNudge = 0;
        // prop: startAngle
        // Angle to start drawing donut in degrees.  
        // According to orientation of canvas coordinate system:
        // 0 = on the positive x axis
        // -90 = on the positive y axis.
        // 90 = on the negaive y axis.
        // 180 or - 180 = on the negative x axis.
        this.startAngle = 0;
        this.tickRenderer = $.jqplot.DonutTickRenderer;
        // Used as check for conditions where donut shouldn't be drawn.
        this._drawData = true;
        this._type = 'donut';
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);
        if (this.diameter != null) {
            this.diameter = this.diameter - this.sliceMargin;
        }
        this._diameter = null;
        this._innerDiameter = null;
        this._radius = null;
        this._innerRadius = null;
        this._thickness = null;
        // references to the previous series in the plot to properly calculate diameters
        // and thicknesses of nested rings.
        this._previousSeries = [];
        this._numberSeries = 1;
        // array of [start,end] angles arrays, one for each slice.  In radians.
        this._sliceAngles = [];
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
            }
        }
        
        plot.postParseOptionsHooks.addOnce(postParseOptions);
        plot.postInitHooks.addOnce(postInit);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);
        
        
    };
    
    $.jqplot.DonutRenderer.prototype.setGridData = function(plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var stack = [];
        var td = [];
        var sa = this.startAngle/180*Math.PI;
        var tot = 0;
        // don't know if we have any valid data yet, so set plot to not draw.
        this._drawData = false;
        for (var i=0; i<this.data.length; i++){
            if (this.data[i][1] != 0) {
                // we have data, O.K. to draw.
                this._drawData = true;
            }
            stack.push(this.data[i][1]);
            td.push([this.data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
            tot += this.data[i][1];
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
            td[i][2] = this.data[i][1]/tot;
        }
        this.gridData = td;
    };
    
    $.jqplot.DonutRenderer.prototype.makeGridData = function(data, plot) {
        var stack = [];
        var td = [];
        var tot = 0;
        var sa = this.startAngle/180*Math.PI;
        // don't know if we have any valid data yet, so set plot to not draw.
        this._drawData = false;
        for (var i=0; i<data.length; i++){
            if (this.data[i][1] != 0) {
                // we have data, O.K. to draw.
                this._drawData = true;
            }
            stack.push(data[i][1]);
            td.push([data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
            tot += data[i][1];
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
            td[i][2] = data[i][1]/tot;
        }
        return td;
    };
    
    $.jqplot.DonutRenderer.prototype.drawSlice = function (ctx, ang1, ang2, color, isShadow) {
        var r = this._diameter / 2;
        var ri = r - this._thickness;
        var fill = this.fill;
        // var lineWidth = this.lineWidth;
        ctx.save();
        ctx.translate(this._center[0], this._center[1]);
        // ctx.translate(this.sliceMargin*Math.cos((ang1+ang2)/2), this.sliceMargin*Math.sin((ang1+ang2)/2));
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.save();
                ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                doDraw();
            }
        }
        
        else {
            doDraw();
        }
        
        function doDraw () {
            // Fix for IE and Chrome that can't seem to draw circles correctly.
            // ang2 should always be <= 2 pi since that is the way the data is converted.
             if (ang2 > 6.282 + this.startAngle) {
                ang2 = 6.282 + this.startAngle;
                if (ang1 > ang2) {
                    ang1 = 6.281 + this.startAngle;
                }
            }
            // Fix for IE, where it can't seem to handle 0 degree angles.  Also avoids
            // ugly line on unfilled donuts.
            if (ang1 >= ang2) {
                return;
            }
            ctx.beginPath();  
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            // ctx.lineWidth = lineWidth;
            ctx.arc(0, 0, r, ang1, ang2, false);
            ctx.lineTo(ri*Math.cos(ang2), ri*Math.sin(ang2));
            ctx.arc(0,0, ri, ang2, ang1, true);
            ctx.closePath();
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.restore();
            }
        }
        
        ctx.restore();
    };
    
    // called with scope of series
    $.jqplot.DonutRenderer.prototype.draw = function (ctx, gd, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        // offset and direction of offset due to legend placement
        var offx = 0;
        var offy = 0;
        var trans = 1;
        // var colorGenerator = new this.colorGenerator(this.seriesColors);
        if (options.legendInfo && options.legendInfo.placement == 'insideGrid') {
            var li = options.legendInfo;
            switch (li.location) {
                case 'nw':
                    offx = li.width + li.xoffset;
                    break;
                case 'w':
                    offx = li.width + li.xoffset;
                    break;
                case 'sw':
                    offx = li.width + li.xoffset;
                    break;
                case 'ne':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'e':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'se':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'n':
                    offy = li.height + li.yoffset;
                    break;
                case 's':
                    offy = li.height + li.yoffset;
                    trans = -1;
                    break;
                default:
                    break;
            }
        }
        
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        var w = cw - offx - 2 * this.padding;
        var h = ch - offy - 2 * this.padding;
        var mindim = Math.min(w,h);
        var d = mindim;
        var ringmargin =  (this.ringMargin == null) ? this.sliceMargin * 2.0 : this.ringMargin;
        
        for (var i=0; i<this._previousSeries.length; i++) {
            d -= 2.0 * this._previousSeries[i]._thickness + 2.0 * ringmargin;
        }
        this._diameter = this.diameter || d;
        if (this.innerDiameter != null) {
            var od = (this._numberSeries > 1 && this.index > 0) ? this._previousSeries[0]._diameter : this._diameter;
            this._thickness = this.thickness || (od - this.innerDiameter - 2.0*ringmargin*this._numberSeries) / this._numberSeries/2.0;
        }
        else {
            this._thickness = this.thickness || mindim / 2 / (this._numberSeries + 1) * 0.85;
        }

        var r = this._radius = this._diameter/2;
        this._innerRadius = this._radius - this._thickness;
        var sa = this.startAngle / 180 * Math.PI;
        this._center = [(cw - trans * offx)/2 + trans * offx, (ch - trans*offy)/2 + trans * offy];
        
        if (this.shadow) {
            var shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
            for (var i=0; i<gd.length; i++) {
                var ang1 = (i == 0) ? sa : gd[i-1][1] + sa;
                // Adjust ang1 and ang2 for sliceMargin
                ang1 += this.sliceMargin/180*Math.PI;
                this.renderer.drawSlice.call (this, ctx, ang1, gd[i][1]+sa, shadowColor, true);
            }
            
        }
        for (var i=0; i<gd.length; i++) {
            var ang1 = (i == 0) ? sa : gd[i-1][1] + sa;
            // Adjust ang1 and ang2 for sliceMargin
            ang1 += this.sliceMargin/180*Math.PI;
            var ang2 = gd[i][1] + sa;
            this._sliceAngles.push([ang1, ang2]);
            this.renderer.drawSlice.call (this, ctx, ang1, ang2, this.seriesColors[i], false);
            
            if (this.showDataLabels && gd[i][2]*100 >= this.dataLabelThreshold) {
                var fstr, avgang = (ang1+ang2)/2, label;
                
                if (this.dataLabels == 'label') {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, gd[i][0]);
                }
                else if (this.dataLabels == 'value') {
                    fstr = this.dataLabelFormatString || '%d';
                    label = $.jqplot.sprintf(fstr, this.data[i][1]);
                }
                else if (this.dataLabels == 'percent') {
                    fstr = this.dataLabelFormatString || '%d%%';
                    label = $.jqplot.sprintf(fstr, gd[i][2]*100);
                }
                else if (this.dataLabels.constructor == Array) {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, this.dataLabels[i]);
                }
                
                var fact = this._innerRadius + this._thickness * this.dataLabelPositionFactor + this.sliceMargin + this.dataLabelNudge;
                
                var x = this._center[0] + Math.cos(avgang) * fact + this.canvas._offsets.left;
                var y = this._center[1] + Math.sin(avgang) * fact + this.canvas._offsets.top;
                
                var labelelem = $('<span class="jqplot-donut-series jqplot-data-label" style="position:absolute;">' + label + '</span>').insertBefore(plot.eventCanvas._elem);
                x -= labelelem.width()/2;
                y -= labelelem.height()/2;
                x = Math.round(x);
                y = Math.round(y);
                labelelem.css({left: x, top: y});
            }
        }
               
    };
    
    $.jqplot.DonutAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.DonutAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.DonutAxisRenderer.prototype.constructor = $.jqplot.DonutAxisRenderer;
        
    
    // There are no traditional axes on a donut chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.DonutAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.DonutTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false; 
    };
    
    
    
    
    $.jqplot.DonutLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.DonutLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.DonutLegendRenderer.prototype.constructor = $.jqplot.DonutLegendRenderer;
    
    /**
     * Class: $.jqplot.DonutLegendRenderer
     * Legend Renderer specific to donut plots.  Set by default
     * when user creates a donut plot.
     */
    $.jqplot.DonutLegendRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with context of legend
    $.jqplot.DonutLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            ss += (this.marginTop != null) ? 'margin-top:'+this.marginTop+';' : '';
            ss += (this.marginBottom != null) ? 'margin-bottom:'+this.marginBottom+';' : '';
            ss += (this.marginLeft != null) ? 'margin-left:'+this.marginLeft+';' : '';
            ss += (this.marginRight != null) ? 'margin-right:'+this.marginRight+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
            // Donut charts legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = false,
                nr, nc;
            var s = series[0];
            var colorGenerator = new $.jqplot.ColorGenerator(s.seriesColors);
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j, tr, td1, td2, lt, rs, color;
                var idx = 0;    
                
                for (i=0; i<nr; i++) {
                    if (reverse){
                        tr = $('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem);
                    }
                    else{
                        tr = $('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);
                    }
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length){
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = colorGenerator.next();
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';
                
                            td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                                '<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+
                                '</div></td>');
                            td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }
            }
        }
        return this._elem;                
    };
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a donut series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.DonutRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.DonutRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.DonutAxisRenderer;
            options.legend.renderer = $.jqplot.DonutLegendRenderer;
            options.legend.preDraw = true;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    
    // called with scope of plot.
    function postInit(target, data, options) {
        // if multiple series, add a reference to the previous one so that
        // donut rings can nest.
        for (var i=1; i<this.series.length; i++) {
            if (!this.series[i]._previousSeries.length){
                for (var j=0; j<i; j++) {
                    if (this.series[i].renderer.constructor == $.jqplot.DonutRenderer && this.series[j].renderer.constructor == $.jqplot.DonutRenderer) {
                        this.series[i]._previousSeries.push(this.series[j]);
                    }
                }
            }
        }
        for (i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.DonutRenderer) {
                this.series[i]._numberSeries = this.series.length;
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }
    
    var postParseOptionsRun = false;
    // called with scope of plot
    function postParseOptions(options) {
        for (var i=0; i<this.series.length; i++) {
            this.series[i].seriesColors = this.seriesColors;
            this.series[i].colorGenerator = $.jqplot.colorGenerator;
        }
    }
    
    function highlight (plot, sidx, pidx) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.donutRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.donutRenderer.highlightedSeriesIndex = sidx;
        s.renderer.drawSlice.call(s, canvas._ctx, s._sliceAngles[pidx][0], s._sliceAngles[pidx][1], s.highlightColors[pidx], false);
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.donutRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.donutRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
 
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.donutRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    } 
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.donutRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.donutRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.donutRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }    
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.donutRenderer && this.plugins.donutRenderer.highlightCanvas) {
            this.plugins.donutRenderer.highlightCanvas.resetCanvas();
            this.plugins.donutRenderer.highlightCanvas = null;
        }

        this.plugins.donutRenderer = {highlightedSeriesIndex:null};
        this.plugins.donutRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        // do we have any data labels?  if so, put highlight canvas before those
        // Fix for broken jquery :first selector with canvas (VML) elements.
        var labels = $(this.targetId+' .jqplot-data-label');
        if (labels.length) {
            $(labels[0]).before(this.plugins.donutRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-donutRenderer-highlight-canvas', this._plotDimensions, this));
        }
        // else put highlight canvas before event canvas.
        else {
            this.eventCanvas._elem.before(this.plugins.donutRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-donutRenderer-highlight-canvas', this._plotDimensions, this));
        }
        var hctx = this.plugins.donutRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
    $.jqplot.DonutTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.DonutTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.DonutTickRenderer.prototype.constructor = $.jqplot.DonutTickRenderer;
    
})(jQuery);
    
    
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(e){e.jqplot.DonutRenderer=function(){e.jqplot.LineRenderer.call(this)};e.jqplot.DonutRenderer.prototype=new e.jqplot.LineRenderer();e.jqplot.DonutRenderer.prototype.constructor=e.jqplot.DonutRenderer;e.jqplot.DonutRenderer.prototype.init=function(p,t){this.diameter=null;this.innerDiameter=null;this.thickness=null;this.padding=20;this.sliceMargin=0;this.ringMargin=null;this.fill=true;this.shadowOffset=2;this.shadowAlpha=0.07;this.shadowDepth=5;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.dataLabels="percent";this.showDataLabels=false;this.dataLabelFormatString=null;this.dataLabelThreshold=3;this.dataLabelPositionFactor=0.4;this.dataLabelNudge=0;this.startAngle=0;this.tickRenderer=e.jqplot.DonutTickRenderer;this._drawData=true;this._type="donut";if(p.highlightMouseDown&&p.highlightMouseOver==null){p.highlightMouseOver=false}e.extend(true,this,p);if(this.diameter!=null){this.diameter=this.diameter-this.sliceMargin}this._diameter=null;this._innerDiameter=null;this._radius=null;this._innerRadius=null;this._thickness=null;this._previousSeries=[];this._numberSeries=1;this._sliceAngles=[];this._highlightedPoint=null;if(this.highlightColors.length==0){for(var r=0;r<this.seriesColors.length;r++){var q=e.jqplot.getColorComponents(this.seriesColors[r]);var n=[q[0],q[1],q[2]];var s=n[0]+n[1]+n[2];for(var o=0;o<3;o++){n[o]=(s>570)?n[o]*0.8:n[o]+0.3*(255-n[o]);n[o]=parseInt(n[o],10)}this.highlightColors.push("rgb("+n[0]+","+n[1]+","+n[2]+")")}}t.postParseOptionsHooks.addOnce(l);t.postInitHooks.addOnce(g);t.eventListenerHooks.addOnce("jqplotMouseMove",b);t.eventListenerHooks.addOnce("jqplotMouseDown",a);t.eventListenerHooks.addOnce("jqplotMouseUp",j);t.eventListenerHooks.addOnce("jqplotClick",f);t.eventListenerHooks.addOnce("jqplotRightClick",m);t.postDrawHooks.addOnce(h)};e.jqplot.DonutRenderer.prototype.setGridData=function(s){var o=[];var t=[];var n=this.startAngle/180*Math.PI;var r=0;this._drawData=false;for(var q=0;q<this.data.length;q++){if(this.data[q][1]!=0){this._drawData=true}o.push(this.data[q][1]);t.push([this.data[q][0]]);if(q>0){o[q]+=o[q-1]}r+=this.data[q][1]}var p=Math.PI*2/o[o.length-1];for(var q=0;q<o.length;q++){t[q][1]=o[q]*p;t[q][2]=this.data[q][1]/r}this.gridData=t};e.jqplot.DonutRenderer.prototype.makeGridData=function(s,t){var o=[];var u=[];var r=0;var n=this.startAngle/180*Math.PI;this._drawData=false;for(var q=0;q<s.length;q++){if(this.data[q][1]!=0){this._drawData=true}o.push(s[q][1]);u.push([s[q][0]]);if(q>0){o[q]+=o[q-1]}r+=s[q][1]}var p=Math.PI*2/o[o.length-1];for(var q=0;q<o.length;q++){u[q][1]=o[q]*p;u[q][2]=s[q][1]/r}return u};e.jqplot.DonutRenderer.prototype.drawSlice=function(x,u,t,p,s){var n=this._diameter/2;var v=n-this._thickness;var w=this.fill;x.save();x.translate(this._center[0],this._center[1]);if(s){for(var q=0;q<this.shadowDepth;q++){x.save();x.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI),this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));o()}}else{o()}function o(){if(t>6.282+this.startAngle){t=6.282+this.startAngle;if(u>t){u=6.281+this.startAngle}}if(u>=t){return}x.beginPath();x.fillStyle=p;x.strokeStyle=p;x.arc(0,0,n,u,t,false);x.lineTo(v*Math.cos(t),v*Math.sin(t));x.arc(0,0,v,t,u,true);x.closePath();if(w){x.fill()}else{x.stroke()}}if(s){for(var q=0;q<this.shadowDepth;q++){x.restore()}}x.restore()};e.jqplot.DonutRenderer.prototype.draw=function(N,V,t,P){var Q;var J=(t!=undefined)?t:{};var q=0;var p=0;var u=1;if(t.legendInfo&&t.legendInfo.placement=="insideGrid"){var I=t.legendInfo;switch(I.location){case"nw":q=I.width+I.xoffset;break;case"w":q=I.width+I.xoffset;break;case"sw":q=I.width+I.xoffset;break;case"ne":q=I.width+I.xoffset;u=-1;break;case"e":q=I.width+I.xoffset;u=-1;break;case"se":q=I.width+I.xoffset;u=-1;break;case"n":p=I.height+I.yoffset;break;case"s":p=I.height+I.yoffset;u=-1;break;default:break}}var B=(J.shadow!=undefined)?J.shadow:this.shadow;var W=(J.showLine!=undefined)?J.showLine:this.showLine;var O=(J.fill!=undefined)?J.fill:this.fill;var s=N.canvas.width;var H=N.canvas.height;var G=s-q-2*this.padding;var R=H-p-2*this.padding;var v=Math.min(G,R);var T=v;var X=(this.ringMargin==null)?this.sliceMargin*2:this.ringMargin;for(var Q=0;Q<this._previousSeries.length;Q++){T-=2*this._previousSeries[Q]._thickness+2*X}this._diameter=this.diameter||T;if(this.innerDiameter!=null){var M=(this._numberSeries>1&&this.index>0)?this._previousSeries[0]._diameter:this._diameter;this._thickness=this.thickness||(M-this.innerDiameter-2*X*this._numberSeries)/this._numberSeries/2}else{this._thickness=this.thickness||v/2/(this._numberSeries+1)*0.85}var K=this._radius=this._diameter/2;this._innerRadius=this._radius-this._thickness;var o=this.startAngle/180*Math.PI;this._center=[(s-u*q)/2+u*q,(H-u*p)/2+u*p];if(this.shadow){var L="rgba(0,0,0,"+this.shadowAlpha+")";for(var Q=0;Q<V.length;Q++){var A=(Q==0)?o:V[Q-1][1]+o;A+=this.sliceMargin/180*Math.PI;this.renderer.drawSlice.call(this,N,A,V[Q][1]+o,L,true)}}for(var Q=0;Q<V.length;Q++){var A=(Q==0)?o:V[Q-1][1]+o;A+=this.sliceMargin/180*Math.PI;var z=V[Q][1]+o;this._sliceAngles.push([A,z]);this.renderer.drawSlice.call(this,N,A,z,this.seriesColors[Q],false);if(this.showDataLabels&&V[Q][2]*100>=this.dataLabelThreshold){var S,U=(A+z)/2,C;if(this.dataLabels=="label"){S=this.dataLabelFormatString||"%s";C=e.jqplot.sprintf(S,V[Q][0])}else{if(this.dataLabels=="value"){S=this.dataLabelFormatString||"%d";C=e.jqplot.sprintf(S,this.data[Q][1])}else{if(this.dataLabels=="percent"){S=this.dataLabelFormatString||"%d%%";C=e.jqplot.sprintf(S,V[Q][2]*100)}else{if(this.dataLabels.constructor==Array){S=this.dataLabelFormatString||"%s";C=e.jqplot.sprintf(S,this.dataLabels[Q])}}}}var n=this._innerRadius+this._thickness*this.dataLabelPositionFactor+this.sliceMargin+this.dataLabelNudge;var F=this._center[0]+Math.cos(U)*n+this.canvas._offsets.left;var E=this._center[1]+Math.sin(U)*n+this.canvas._offsets.top;var D=e('<span class="jqplot-donut-series jqplot-data-label" style="position:absolute;">'+C+"</span>").insertBefore(P.eventCanvas._elem);F-=D.width()/2;E-=D.height()/2;F=Math.round(F);E=Math.round(E);D.css({left:F,top:E})}}};e.jqplot.DonutAxisRenderer=function(){e.jqplot.LinearAxisRenderer.call(this)};e.jqplot.DonutAxisRenderer.prototype=new e.jqplot.LinearAxisRenderer();e.jqplot.DonutAxisRenderer.prototype.constructor=e.jqplot.DonutAxisRenderer;e.jqplot.DonutAxisRenderer.prototype.init=function(n){this.tickRenderer=e.jqplot.DonutTickRenderer;e.extend(true,this,n);this._dataBounds={min:0,max:100};this.min=0;this.max=100;this.showTicks=false;this.ticks=[];this.showMark=false;this.show=false};e.jqplot.DonutLegendRenderer=function(){e.jqplot.TableLegendRenderer.call(this)};e.jqplot.DonutLegendRenderer.prototype=new e.jqplot.TableLegendRenderer();e.jqplot.DonutLegendRenderer.prototype.constructor=e.jqplot.DonutLegendRenderer;e.jqplot.DonutLegendRenderer.prototype.init=function(n){this.numberRows=null;this.numberColumns=null;e.extend(true,this,n)};e.jqplot.DonutLegendRenderer.prototype.draw=function(){var q=this;if(this.show){var y=this._series;var B="position:absolute;";B+=(this.background)?"background:"+this.background+";":"";B+=(this.border)?"border:"+this.border+";":"";B+=(this.fontSize)?"font-size:"+this.fontSize+";":"";B+=(this.fontFamily)?"font-family:"+this.fontFamily+";":"";B+=(this.textColor)?"color:"+this.textColor+";":"";B+=(this.marginTop!=null)?"margin-top:"+this.marginTop+";":"";B+=(this.marginBottom!=null)?"margin-bottom:"+this.marginBottom+";":"";B+=(this.marginLeft!=null)?"margin-left:"+this.marginLeft+";":"";B+=(this.marginRight!=null)?"margin-right:"+this.marginRight+";":"";this._elem=e('<table class="jqplot-table-legend" style="'+B+'"></table>');var F=false,x=false,n,v;var z=y[0];var o=new e.jqplot.ColorGenerator(z.seriesColors);if(z.show){var G=z.data;if(this.numberRows){n=this.numberRows;if(!this.numberColumns){v=Math.ceil(G.length/n)}else{v=this.numberColumns}}else{if(this.numberColumns){v=this.numberColumns;n=Math.ceil(G.length/this.numberColumns)}else{n=G.length;v=1}}var E,D,p,t,r,u,w,C;var A=0;for(E=0;E<n;E++){if(x){p=e('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem)}else{p=e('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem)}for(D=0;D<v;D++){if(A<G.length){u=this.labels[A]||G[A][0].toString();C=o.next();if(!x){if(E>0){F=true}else{F=false}}else{if(E==n-1){F=false}else{F=true}}w=(F)?this.rowSpacing:"0";t=e('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+w+';"><div><div class="jqplot-table-legend-swatch" style="border-color:'+C+';"></div></div></td>');r=e('<td class="jqplot-table-legend" style="padding-top:'+w+';"></td>');if(this.escapeHtml){r.text(u)}else{r.html(u)}if(x){r.prependTo(p);t.prependTo(p)}else{t.appendTo(p);r.appendTo(p)}F=true}A++}}}}return this._elem};function c(r,q,o){o=o||{};o.axesDefaults=o.axesDefaults||{};o.legend=o.legend||{};o.seriesDefaults=o.seriesDefaults||{};var n=false;if(o.seriesDefaults.renderer==e.jqplot.DonutRenderer){n=true}else{if(o.series){for(var p=0;p<o.series.length;p++){if(o.series[p].renderer==e.jqplot.DonutRenderer){n=true}}}}if(n){o.axesDefaults.renderer=e.jqplot.DonutAxisRenderer;o.legend.renderer=e.jqplot.DonutLegendRenderer;o.legend.preDraw=true;o.seriesDefaults.pointLabels={show:false}}}function g(r,q,o){for(var p=1;p<this.series.length;p++){if(!this.series[p]._previousSeries.length){for(var n=0;n<p;n++){if(this.series[p].renderer.constructor==e.jqplot.DonutRenderer&&this.series[n].renderer.constructor==e.jqplot.DonutRenderer){this.series[p]._previousSeries.push(this.series[n])}}}}for(p=0;p<this.series.length;p++){if(this.series[p].renderer.constructor==e.jqplot.DonutRenderer){this.series[p]._numberSeries=this.series.length;if(this.series[p].highlightMouseOver){this.series[p].highlightMouseDown=false}}}}var k=false;function l(n){for(var o=0;o<this.series.length;o++){this.series[o].seriesColors=this.seriesColors;this.series[o].colorGenerator=e.jqplot.colorGenerator}}function d(r,q,p){var o=r.series[q];var n=r.plugins.donutRenderer.highlightCanvas;n._ctx.clearRect(0,0,n._ctx.canvas.width,n._ctx.canvas.height);o._highlightedPoint=p;r.plugins.donutRenderer.highlightedSeriesIndex=q;o.renderer.drawSlice.call(o,n._ctx,o._sliceAngles[p][0],o._sliceAngles[p][1],o.highlightColors[p],false)}function i(p){var n=p.plugins.donutRenderer.highlightCanvas;n._ctx.clearRect(0,0,n._ctx.canvas.width,n._ctx.canvas.height);for(var o=0;o<p.series.length;o++){p.series[o]._highlightedPoint=null}p.plugins.donutRenderer.highlightedSeriesIndex=null;p.target.trigger("jqplotDataUnhighlight")}function b(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var o=jQuery.Event("jqplotDataMouseOver");o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p);if(s.series[p[0]].highlightMouseOver&&!(p[0]==s.plugins.donutRenderer.highlightedSeriesIndex&&p[1]==s.series[p[0]]._highlightedPoint)){var n=jQuery.Event("jqplotDataHighlight");n.which=r.which;n.pageX=r.pageX;n.pageY=r.pageY;s.target.trigger(n,p);d(s,p[0],p[1])}}else{if(t==null){i(s)}}}function a(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];if(r.series[o[0]].highlightMouseDown&&!(o[0]==r.plugins.donutRenderer.highlightedSeriesIndex&&o[1]==r.series[o[0]]._highlightedPoint)){var n=jQuery.Event("jqplotDataHighlight");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o);d(r,o[0],o[1])}}else{if(s==null){i(r)}}}function j(p,o,s,r,q){var n=q.plugins.donutRenderer.highlightedSeriesIndex;if(n!=null&&q.series[n].highlightMouseDown){i(q)}}function f(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];var n=jQuery.Event("jqplotDataClick");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o)}}function m(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var n=s.plugins.donutRenderer.highlightedSeriesIndex;if(n!=null&&s.series[n].highlightMouseDown){i(s)}var o=jQuery.Event("jqplotDataRightClick");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p)}}function h(){if(this.plugins.donutRenderer&&this.plugins.donutRenderer.highlightCanvas){this.plugins.donutRenderer.highlightCanvas.resetCanvas();this.plugins.donutRenderer.highlightCanvas=null}this.plugins.donutRenderer={highlightedSeriesIndex:null};this.plugins.donutRenderer.highlightCanvas=new e.jqplot.GenericCanvas();var o=e(this.targetId+" .jqplot-data-label");if(o.length){e(o[0]).before(this.plugins.donutRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-donutRenderer-highlight-canvas",this._plotDimensions,this))}else{this.eventCanvas._elem.before(this.plugins.donutRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-donutRenderer-highlight-canvas",this._plotDimensions,this))}var n=this.plugins.donutRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(p){i(p.data.plot)})}e.jqplot.preInitHooks.push(c);e.jqplot.DonutTickRenderer=function(){e.jqplot.AxisTickRenderer.call(this)};e.jqplot.DonutTickRenderer.prototype=new e.jqplot.AxisTickRenderer();e.jqplot.DonutTickRenderer.prototype.constructor=e.jqplot.DonutTickRenderer})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    
    /**
     * Class: $.jqplot.Dragable
     * Plugin to make plotted points dragable by the user.
     */
    $.jqplot.Dragable = function(options) {
        // Group: Properties
        this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        this.isDragging = false;
        this.isOver = false;
        this._ctx;
        this._elem;
        this._point;
        this._gridData;
        // prop: color
        // CSS color spec for the dragged point (and adjacent line segment or bar).
        this.color;
        // prop: constrainTo
        // Constrain dragging motion to an axis or to none.
        // Allowable values are 'none', 'x', 'y'
        this.constrainTo = 'none';  // 'x', 'y', or 'none';
        $.extend(true, this, options);
    };
    
    function DragCanvas() {
        $.jqplot.GenericCanvas.call(this);
        this.isDragging = false;
        this.isOver = false;
        this._neighbor;
        this._cursors = [];
    }
    
    DragCanvas.prototype = new $.jqplot.GenericCanvas();
    DragCanvas.prototype.constructor = DragCanvas;
    
    
    // called within scope of series
    $.jqplot.Dragable.parseOptions = function (defaults, opts) {
        var options = opts || {};
        this.plugins.dragable = new $.jqplot.Dragable(options.dragable);
        // since this function is called before series options are parsed,
        // we can set this here and it will be overridden if needed.
        this.isDragable = $.jqplot.config.enablePlugins;
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    // add a new DragCanvas object to the plot plugins to handle drawing on this new canvas.
    $.jqplot.Dragable.postPlotDraw = function() {
        // Memory Leaks patch    
        if (this.plugins.dragable && this.plugins.dragable.highlightCanvas) {
            this.plugins.dragable.highlightCanvas.resetCanvas();
            this.plugins.dragable.highlightCanvas = null;
        }

        this.plugins.dragable = {previousCursor:'auto', isOver:false};
        this.plugins.dragable.dragCanvas = new DragCanvas();
        
        this.eventCanvas._elem.before(this.plugins.dragable.dragCanvas.createElement(this._gridPadding, 'jqplot-dragable-canvas', this._plotDimensions, this));
        var dctx = this.plugins.dragable.dragCanvas.setContext();
    };
    
    //$.jqplot.preInitHooks.push($.jqplot.Dragable.init);
    $.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Dragable.parseOptions);
    $.jqplot.postDrawHooks.push($.jqplot.Dragable.postPlotDraw);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
    $.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleDown]);
    $.jqplot.eventListenerHooks.push(['jqplotMouseUp', handleUp]);

    
    function initDragPoint(plot, neighbor) {
        var s = plot.series[neighbor.seriesIndex];
        var drag = s.plugins.dragable;
        
        // first, init the mark renderer for the dragged point
        var smr = s.markerRenderer;
        var mr = drag.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + 2.5;
        mr.size = smr.size + 5;
        if (!drag.color) {
            var rgba = $.jqplot.getColorComponents(smr.color);
            var newrgb = [rgba[0], rgba[1], rgba[2]];
            var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
            drag.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        }
        mr.color = drag.color;
        mr.init();

        var start = (neighbor.pointIndex > 0) ? neighbor.pointIndex - 1 : 0;
        var end = neighbor.pointIndex+2;
        drag._gridData = s.gridData.slice(start, end);
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (plot.plugins.dragable.dragCanvas.isDragging) {
            var dc = plot.plugins.dragable.dragCanvas;
            var dp = dc._neighbor;
            var s = plot.series[dp.seriesIndex];
            var drag = s.plugins.dragable;
            var gd = s.gridData;
            
            // compute the new grid position with any constraints.
            var x = (drag.constrainTo == 'y') ? dp.gridData[0] : gridpos.x;
            var y = (drag.constrainTo == 'x') ? dp.gridData[1] : gridpos.y;
            
            // compute data values for any listeners.
            var xu = s._xaxis.series_p2u(x);
            var yu = s._yaxis.series_p2u(y);
            
            // clear the canvas then redraw effect at new position.
            var ctx = dc._ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            // adjust our gridData for the new mouse position
            if (dp.pointIndex > 0) {
                drag._gridData[1] = [x, y];
            }
            else {
                drag._gridData[0] = [x, y];
            }
            plot.series[dp.seriesIndex].draw(dc._ctx, {gridData:drag._gridData, shadow:false, preventJqPlotSeriesDrawTrigger:true, color:drag.color, markerOptions:{color:drag.color, shadow:false}, trendline:{show:false}});
            plot.target.trigger('jqplotSeriesPointChange', [dp.seriesIndex, dp.pointIndex, [xu,yu], [x,y]]);
        }
        else if (neighbor != null) {
            var series = plot.series[neighbor.seriesIndex];
            if (series.isDragable) {
                var dc = plot.plugins.dragable.dragCanvas;
                if (!dc.isOver) {
                    dc._cursors.push(ev.target.style.cursor);
                    ev.target.style.cursor = "pointer";
                }
                dc.isOver = true;
            }
        }
        else if (neighbor == null) {
            var dc = plot.plugins.dragable.dragCanvas;
            if (dc.isOver) {
                ev.target.style.cursor = dc._cursors.pop();
                dc.isOver = false;
            }
        }
    }
    
    function handleDown(ev, gridpos, datapos, neighbor, plot) {
        var dc = plot.plugins.dragable.dragCanvas;
        dc._cursors.push(ev.target.style.cursor);
        if (neighbor != null) {
            var s = plot.series[neighbor.seriesIndex];
            var drag = s.plugins.dragable;
            if (s.isDragable && !dc.isDragging) {
                dc._neighbor = neighbor;
                dc.isDragging = true;
                initDragPoint(plot, neighbor);
                drag.markerRenderer.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], dc._ctx);
                ev.target.style.cursor = "move";
                plot.target.trigger('jqplotDragStart', [neighbor.seriesIndex, neighbor.pointIndex, gridpos, datapos]);
            }
        }
        // Just in case of a hickup, we'll clear the drag canvas and reset.
        else {
           var ctx = dc._ctx;
           ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
           dc.isDragging = false;
        }
    }
    
    function handleUp(ev, gridpos, datapos, neighbor, plot) {
        if (plot.plugins.dragable.dragCanvas.isDragging) {
            var dc = plot.plugins.dragable.dragCanvas;
            // clear the canvas
            var ctx = dc._ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            dc.isDragging = false;
            // redraw the series canvas at the new point.
            var dp = dc._neighbor;
            var s = plot.series[dp.seriesIndex];
            var drag = s.plugins.dragable;
            // compute the new grid position with any constraints.
            var x = (drag.constrainTo == 'y') ? dp.data[0] : datapos[s.xaxis];
            var y = (drag.constrainTo == 'x') ? dp.data[1] : datapos[s.yaxis];
            // var x = datapos[s.xaxis];
            // var y = datapos[s.yaxis];
            s.data[dp.pointIndex][0] = x;
            s.data[dp.pointIndex][1] = y;
            plot.drawSeries({preventJqPlotSeriesDrawTrigger:true}, dp.seriesIndex);
            dc._neighbor = null;
            ev.target.style.cursor = dc._cursors.pop();
            plot.target.trigger('jqplotDragStop', [gridpos, datapos]);
        }
    }
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(d){d.jqplot.Dragable=function(g){this.markerRenderer=new d.jqplot.MarkerRenderer({shadow:false});this.shapeRenderer=new d.jqplot.ShapeRenderer();this.isDragging=false;this.isOver=false;this._ctx;this._elem;this._point;this._gridData;this.color;this.constrainTo="none";d.extend(true,this,g)};function b(){d.jqplot.GenericCanvas.call(this);this.isDragging=false;this.isOver=false;this._neighbor;this._cursors=[]}b.prototype=new d.jqplot.GenericCanvas();b.prototype.constructor=b;d.jqplot.Dragable.parseOptions=function(i,h){var g=h||{};this.plugins.dragable=new d.jqplot.Dragable(g.dragable);this.isDragable=d.jqplot.config.enablePlugins};d.jqplot.Dragable.postPlotDraw=function(){if(this.plugins.dragable&&this.plugins.dragable.highlightCanvas){this.plugins.dragable.highlightCanvas.resetCanvas();this.plugins.dragable.highlightCanvas=null}this.plugins.dragable={previousCursor:"auto",isOver:false};this.plugins.dragable.dragCanvas=new b();this.eventCanvas._elem.before(this.plugins.dragable.dragCanvas.createElement(this._gridPadding,"jqplot-dragable-canvas",this._plotDimensions,this));var g=this.plugins.dragable.dragCanvas.setContext()};d.jqplot.preParseSeriesOptionsHooks.push(d.jqplot.Dragable.parseOptions);d.jqplot.postDrawHooks.push(d.jqplot.Dragable.postPlotDraw);d.jqplot.eventListenerHooks.push(["jqplotMouseMove",e]);d.jqplot.eventListenerHooks.push(["jqplotMouseDown",c]);d.jqplot.eventListenerHooks.push(["jqplotMouseUp",a]);function f(n,p){var q=n.series[p.seriesIndex];var m=q.plugins.dragable;var h=q.markerRenderer;var i=m.markerRenderer;i.style=h.style;i.lineWidth=h.lineWidth+2.5;i.size=h.size+5;if(!m.color){var l=d.jqplot.getColorComponents(h.color);var o=[l[0],l[1],l[2]];var k=(l[3]>=0.6)?l[3]*0.6:l[3]*(2-l[3]);m.color="rgba("+o[0]+","+o[1]+","+o[2]+","+k+")"}i.color=m.color;i.init();var g=(p.pointIndex>0)?p.pointIndex-1:0;var j=p.pointIndex+2;m._gridData=q.gridData.slice(g,j)}function e(o,l,h,t,m){if(m.plugins.dragable.dragCanvas.isDragging){var u=m.plugins.dragable.dragCanvas;var i=u._neighbor;var w=m.series[i.seriesIndex];var k=w.plugins.dragable;var r=w.gridData;var p=(k.constrainTo=="y")?i.gridData[0]:l.x;var n=(k.constrainTo=="x")?i.gridData[1]:l.y;var g=w._xaxis.series_p2u(p);var q=w._yaxis.series_p2u(n);var v=u._ctx;v.clearRect(0,0,v.canvas.width,v.canvas.height);if(i.pointIndex>0){k._gridData[1]=[p,n]}else{k._gridData[0]=[p,n]}m.series[i.seriesIndex].draw(u._ctx,{gridData:k._gridData,shadow:false,preventJqPlotSeriesDrawTrigger:true,color:k.color,markerOptions:{color:k.color,shadow:false},trendline:{show:false}});m.target.trigger("jqplotSeriesPointChange",[i.seriesIndex,i.pointIndex,[g,q],[p,n]])}else{if(t!=null){var j=m.series[t.seriesIndex];if(j.isDragable){var u=m.plugins.dragable.dragCanvas;if(!u.isOver){u._cursors.push(o.target.style.cursor);o.target.style.cursor="pointer"}u.isOver=true}}else{if(t==null){var u=m.plugins.dragable.dragCanvas;if(u.isOver){o.target.style.cursor=u._cursors.pop();u.isOver=false}}}}}function c(k,i,g,l,j){var m=j.plugins.dragable.dragCanvas;m._cursors.push(k.target.style.cursor);if(l!=null){var o=j.series[l.seriesIndex];var h=o.plugins.dragable;if(o.isDragable&&!m.isDragging){m._neighbor=l;m.isDragging=true;f(j,l);h.markerRenderer.draw(o.gridData[l.pointIndex][0],o.gridData[l.pointIndex][1],m._ctx);k.target.style.cursor="move";j.target.trigger("jqplotDragStart",[l.seriesIndex,l.pointIndex,i,g])}}else{var n=m._ctx;n.clearRect(0,0,n.canvas.width,n.canvas.height);m.isDragging=false}}function a(m,j,g,o,k){if(k.plugins.dragable.dragCanvas.isDragging){var p=k.plugins.dragable.dragCanvas;var q=p._ctx;q.clearRect(0,0,q.canvas.width,q.canvas.height);p.isDragging=false;var h=p._neighbor;var r=k.series[h.seriesIndex];var i=r.plugins.dragable;var n=(i.constrainTo=="y")?h.data[0]:g[r.xaxis];var l=(i.constrainTo=="x")?h.data[1]:g[r.yaxis];r.data[h.pointIndex][0]=n;r.data[h.pointIndex][1]=l;k.drawSeries({preventJqPlotSeriesDrawTrigger:true},h.seriesIndex);p._neighbor=null;m.target.style.cursor=p._cursors.pop();k.target.trigger("jqplotDragStop",[j,g])}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    // class $.jqplot.EnhancedLegendRenderer
    // Legend renderer which can specify the number of rows and/or columns in the legend.
    $.jqplot.EnhancedLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.EnhancedLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.EnhancedLegendRenderer.prototype.constructor = $.jqplot.EnhancedLegendRenderer;
    
    // called with scope of legend.
    $.jqplot.EnhancedLegendRenderer.prototype.init = function(options) {
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        // prop: seriesToggle
        // false to not enable series on/off toggling on the legend.
        // true or a fadein/fadeout speed (number of milliseconds or 'fast', 'normal', 'slow') 
        // to enable show/hide of series on click of legend item.
        this.seriesToggle = 'normal';
        // prop: seriesToggleReplot
        // True to replot the chart after toggling series on/off.
        // This will set the series show property to false.
        // This allows for rescaling or other maniplation of chart.
        // Set to an options object (e.g. {resetAxes: true}) for replot options.
        this.seriesToggleReplot = false;
        // prop: disableIEFading
        // true to toggle series with a show/hide method only and not allow fading in/out.  
        // This is to overcome poor performance of fade in some versions of IE.
        this.disableIEFading = true;
        $.extend(true, this, options);
        
        if (this.seriesToggle) {
            $.jqplot.postDrawHooks.push(postDraw);
        }
    };
    
    // called with scope of legend
    $.jqplot.EnhancedLegendRenderer.prototype.draw = function(offsets, plot) {
        var legend = this;
        if (this.show) {
            var series = this._series;
            var s;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            ss += (this.marginTop != null) ? 'margin-top:'+this.marginTop+';' : '';
            ss += (this.marginBottom != null) ? 'margin-bottom:'+this.marginBottom+';' : '';
            ss += (this.marginLeft != null) ? 'margin-left:'+this.marginLeft+';' : '';
            ss += (this.marginRight != null) ? 'margin-right:'+this.marginRight+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
            if (this.seriesToggle) {
                this._elem.css('z-index', '3');
            }
        
            var pad = false, 
                reverse = false,
                nr, nc;
            if (this.numberRows) {
                nr = this.numberRows;
                if (!this.numberColumns){
                    nc = Math.ceil(series.length/nr);
                }
                else{
                    nc = this.numberColumns;
                }
            }
            else if (this.numberColumns) {
                nc = this.numberColumns;
                nr = Math.ceil(series.length/this.numberColumns);
            }
            else {
                nr = series.length;
                nc = 1;
            }
                
            var i, j, tr, td1, td2, lt, rs, div, div0, div1;
            var idx = 0;
            // check to see if we need to reverse
            for (i=series.length-1; i>=0; i--) {
                if (nc == 1 && series[i]._stack || series[i].renderer.constructor == $.jqplot.BezierCurveRenderer){
                    reverse = true;
                }
            }    
                
            for (i=0; i<nr; i++) {
                tr = $(document.createElement('tr'));
                tr.addClass('jqplot-table-legend');
                if (reverse){
                    tr.prependTo(this._elem);
                }
                else{
                    tr.appendTo(this._elem);
                }
                for (j=0; j<nc; j++) {
                    if (idx < series.length && (series[idx].show || series[idx].showLabel)){
                        s = series[idx];
                        lt = this.labels[idx] || s.label.toString();
                        if (lt) {
                            var color = s.color;
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';

                            td1 = $(document.createElement('td'));
                            td1.addClass('jqplot-table-legend jqplot-table-legend-swatch');
                            td1.css({textAlign: 'center', paddingTop: rs});

                            div0 = $(document.createElement('div'));
                            div0.addClass('jqplot-table-legend-swatch-outline');
                            div1 = $(document.createElement('div'));
                            div1.addClass('jqplot-table-legend-swatch');
                            div1.css({backgroundColor: color, borderColor: color});

                            td1.append(div0.append(div1));

                            td2 = $(document.createElement('td'));
                            td2.addClass('jqplot-table-legend jqplot-table-legend-label');
                            td2.css('paddingTop', rs);
                    
                            // td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                            //     '<div><div class="jqplot-table-legend-swatch" style="background-color:'+color+';border-color:'+color+';"></div>'+
                            //     '</div></td>');
                            // td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                if (this.showLabels) {td2.prependTo(tr);}
                                if (this.showSwatches) {td1.prependTo(tr);}
                            }
                            else {
                                if (this.showSwatches) {td1.appendTo(tr);}
                                if (this.showLabels) {td2.appendTo(tr);}
                            }
                            
                            if (this.seriesToggle) {

                                // add an overlay for clicking series on/off
                                // div0 = $(document.createElement('div'));
                                // div0.addClass('jqplot-table-legend-overlay');
                                // div0.css({position:'relative', left:0, top:0, height:'100%', width:'100%'});
                                // tr.append(div0);

                                var speed;
                                if (typeof(this.seriesToggle) === 'string' || typeof(this.seriesToggle) === 'number') {
                                    if (!$.jqplot.use_excanvas || !this.disableIEFading) {
                                        speed = this.seriesToggle;
                                    }
                                } 
                                if (this.showSwatches) {
                                    td1.bind('click', {series:s, speed:speed, plot: plot, replot:this.seriesToggleReplot}, handleToggle);
                                    td1.addClass('jqplot-seriesToggle');
                                }
                                if (this.showLabels)  {
                                    td2.bind('click', {series:s, speed:speed, plot: plot, replot:this.seriesToggleReplot}, handleToggle);
                                    td2.addClass('jqplot-seriesToggle');
                                }

                                // for series that are already hidden, add the hidden class
                                if (!s.show && s.showLabel) {
                                    td1.addClass('jqplot-series-hidden');
                                    td2.addClass('jqplot-series-hidden');
                                }
                            }
                            
                            pad = true;
                        }
                    }
                    idx++;
                }
                
                td1 = td2 = div0 = div1 = null;   
            }
        }
        return this._elem;
    };

    var handleToggle = function (ev) {
        var d = ev.data,
            s = d.series,
            replot = d.replot,
            plot = d.plot,
            speed = d.speed,
            sidx = s.index,
            showing = false;

        if (s.canvas._elem.is(':hidden') || !s.show) {
            showing = true;
        }

        var doLegendToggle = function() {

            if (replot) {
                var opts = {};

                if ($.isPlainObject(replot)) {
                    $.extend(true, opts, replot);
                }

                plot.replot(opts);
                // if showing, there was no canvas element to fade in, so hide here
                // and then do a fade in.
                if (showing && speed) {
                    var s = plot.series[sidx];

                    if (s.shadowCanvas._elem) {
                        s.shadowCanvas._elem.hide().fadeIn(speed);
                    }
                    s.canvas._elem.hide().fadeIn(speed);
                    s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-'+s.index).hide().fadeIn(speed);
                }

            }

            else {
                var s = plot.series[sidx];

                if (s.canvas._elem.is(':hidden') || !s.show) {
                    // Not sure if there is a better way to check for showSwatches and showLabels === true.
                    // Test for "undefined" since default values for both showSwatches and showLables is true.
                    if (typeof plot.options.legend.showSwatches === 'undefined' || plot.options.legend.showSwatches === true) {
                        plot.legend._elem.find('td').eq(sidx * 2).addClass('jqplot-series-hidden');
                    }
                    if (typeof plot.options.legend.showLabels === 'undefined' || plot.options.legend.showLabels === true) {
                        plot.legend._elem.find('td').eq((sidx * 2) + 1).addClass('jqplot-series-hidden');
                    }
                }
                else {
                    if (typeof plot.options.legend.showSwatches === 'undefined' || plot.options.legend.showSwatches === true) {
                        plot.legend._elem.find('td').eq(sidx * 2).removeClass('jqplot-series-hidden');
                    }
                    if (typeof plot.options.legend.showLabels === 'undefined' || plot.options.legend.showLabels === true) {
                        plot.legend._elem.find('td').eq((sidx * 2) + 1).removeClass('jqplot-series-hidden');
                    }
                }

            }

        };

        s.toggleDisplay(ev, doLegendToggle);
    };
    
    // called with scope of plot.
    var postDraw = function () {
        if (this.legend.renderer.constructor == $.jqplot.EnhancedLegendRenderer && this.legend.seriesToggle){
            var e = this.legend._elem.detach();
            this.eventCanvas._elem.after(e);
        }
    };
})(jQuery);

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(c){c.jqplot.EnhancedLegendRenderer=function(){c.jqplot.TableLegendRenderer.call(this)};c.jqplot.EnhancedLegendRenderer.prototype=new c.jqplot.TableLegendRenderer();c.jqplot.EnhancedLegendRenderer.prototype.constructor=c.jqplot.EnhancedLegendRenderer;c.jqplot.EnhancedLegendRenderer.prototype.init=function(d){this.numberRows=null;this.numberColumns=null;this.seriesToggle="normal";this.seriesToggleReplot=false;this.disableIEFading=true;c.extend(true,this,d);if(this.seriesToggle){c.jqplot.postDrawHooks.push(b)}};c.jqplot.EnhancedLegendRenderer.prototype.draw=function(m,y){var f=this;if(this.show){var r=this._series;var u;var w="position:absolute;";w+=(this.background)?"background:"+this.background+";":"";w+=(this.border)?"border:"+this.border+";":"";w+=(this.fontSize)?"font-size:"+this.fontSize+";":"";w+=(this.fontFamily)?"font-family:"+this.fontFamily+";":"";w+=(this.textColor)?"color:"+this.textColor+";":"";w+=(this.marginTop!=null)?"margin-top:"+this.marginTop+";":"";w+=(this.marginBottom!=null)?"margin-bottom:"+this.marginBottom+";":"";w+=(this.marginLeft!=null)?"margin-left:"+this.marginLeft+";":"";w+=(this.marginRight!=null)?"margin-right:"+this.marginRight+";":"";this._elem=c('<table class="jqplot-table-legend" style="'+w+'"></table>');if(this.seriesToggle){this._elem.css("z-index","3")}var C=false,q=false,d,o;if(this.numberRows){d=this.numberRows;if(!this.numberColumns){o=Math.ceil(r.length/d)}else{o=this.numberColumns}}else{if(this.numberColumns){o=this.numberColumns;d=Math.ceil(r.length/this.numberColumns)}else{d=r.length;o=1}}var B,z,e,l,k,n,p,t,h,g;var v=0;for(B=r.length-1;B>=0;B--){if(o==1&&r[B]._stack||r[B].renderer.constructor==c.jqplot.BezierCurveRenderer){q=true}}for(B=0;B<d;B++){e=c(document.createElement("tr"));e.addClass("jqplot-table-legend");if(q){e.prependTo(this._elem)}else{e.appendTo(this._elem)}for(z=0;z<o;z++){if(v<r.length&&(r[v].show||r[v].showLabel)){u=r[v];n=this.labels[v]||u.label.toString();if(n){var x=u.color;if(!q){if(B>0){C=true}else{C=false}}else{if(B==d-1){C=false}else{C=true}}p=(C)?this.rowSpacing:"0";l=c(document.createElement("td"));l.addClass("jqplot-table-legend jqplot-table-legend-swatch");l.css({textAlign:"center",paddingTop:p});h=c(document.createElement("div"));h.addClass("jqplot-table-legend-swatch-outline");g=c(document.createElement("div"));g.addClass("jqplot-table-legend-swatch");g.css({backgroundColor:x,borderColor:x});l.append(h.append(g));k=c(document.createElement("td"));k.addClass("jqplot-table-legend jqplot-table-legend-label");k.css("paddingTop",p);if(this.escapeHtml){k.text(n)}else{k.html(n)}if(q){if(this.showLabels){k.prependTo(e)}if(this.showSwatches){l.prependTo(e)}}else{if(this.showSwatches){l.appendTo(e)}if(this.showLabels){k.appendTo(e)}}if(this.seriesToggle){var A;if(typeof(this.seriesToggle)==="string"||typeof(this.seriesToggle)==="number"){if(!c.jqplot.use_excanvas||!this.disableIEFading){A=this.seriesToggle}}if(this.showSwatches){l.bind("click",{series:u,speed:A,plot:y,replot:this.seriesToggleReplot},a);l.addClass("jqplot-seriesToggle")}if(this.showLabels){k.bind("click",{series:u,speed:A,plot:y,replot:this.seriesToggleReplot},a);k.addClass("jqplot-seriesToggle")}if(!u.show&&u.showLabel){l.addClass("jqplot-series-hidden");k.addClass("jqplot-series-hidden")}}C=true}}v++}l=k=h=g=null}}return this._elem};var a=function(j){var i=j.data,m=i.series,k=i.replot,h=i.plot,f=i.speed,l=m.index,g=false;if(m.canvas._elem.is(":hidden")||!m.show){g=true}var e=function(){if(k){var n={};if(c.isPlainObject(k)){c.extend(true,n,k)}h.replot(n);if(g&&f){var d=h.series[l];if(d.shadowCanvas._elem){d.shadowCanvas._elem.hide().fadeIn(f)}d.canvas._elem.hide().fadeIn(f);d.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+d.index).hide().fadeIn(f)}}else{var d=h.series[l];if(d.canvas._elem.is(":hidden")||!d.show){if(typeof h.options.legend.showSwatches==="undefined"||h.options.legend.showSwatches===true){h.legend._elem.find("td").eq(l*2).addClass("jqplot-series-hidden")}if(typeof h.options.legend.showLabels==="undefined"||h.options.legend.showLabels===true){h.legend._elem.find("td").eq((l*2)+1).addClass("jqplot-series-hidden")}}else{if(typeof h.options.legend.showSwatches==="undefined"||h.options.legend.showSwatches===true){h.legend._elem.find("td").eq(l*2).removeClass("jqplot-series-hidden")}if(typeof h.options.legend.showLabels==="undefined"||h.options.legend.showLabels===true){h.legend._elem.find("td").eq((l*2)+1).removeClass("jqplot-series-hidden")}}}};m.toggleDisplay(j,e)};var b=function(){if(this.legend.renderer.constructor==c.jqplot.EnhancedLegendRenderer&&this.legend.seriesToggle){var d=this.legend._elem.detach();this.eventCanvas._elem.after(d)}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.FunnelRenderer
     * Plugin renderer to draw a funnel chart.
     * x values, if present, will be used as labels.
     * y values give area size.
     * 
     * Funnel charts will draw a single series
     * only.
     * 
     * To use this renderer, you need to include the 
     * funnel renderer plugin, for example:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.funnelRenderer.js"></script>
     * 
     * Properties described here are passed into the $.jqplot function
     * as options on the series renderer.  For example:
     * 
     * > plot2 = $.jqplot('chart2', [s1, s2], {
     * >     seriesDefaults: {
     * >         renderer:$.jqplot.FunnelRenderer,
     * >         rendererOptions:{
     * >              sectionMargin: 12,
     * >              widthRatio: 0.3
     * >          }
     * >      }
     * > });
     * 
     * IMPORTANT
     * 
     * *The funnel renderer will reorder data in descending order* so the largest value in
     * the data set is first and displayed on top of the funnel.  Data will then
     * be displayed in descending order down the funnel.  The area of each funnel
     * section will correspond to the value of each data point relative to the sum
     * of all values.  That is section area is proportional to section value divided by 
     * sum of all section values.
     * 
     * If your data is not in descending order when passed into the plot, *it will be
     * reordered* when stored in the series.data property.  A copy of the unordered
     * data is kept in the series._unorderedData property.
     * 
     * A funnel plot will trigger events on the plot target
     * according to user interaction.  All events return the event object,
     * the series index, the point (section) index, and the point data for 
     * the appropriate section. *Note* the point index will referr to the ordered
     * data, not the original unordered data.
     * 
     * 'jqplotDataMouseOver' - triggered when mousing over a section.
     * 'jqplotDataHighlight' - triggered the first time user mouses over a section,
     * if highlighting is enabled.
     * 'jqplotDataUnhighlight' - triggered when a user moves the mouse out of
     * a highlighted section.
     * 'jqplotDataClick' - triggered when the user clicks on a section.
     * 'jqplotDataRightClick' - tiggered when the user right clicks on a section if
     * the "captureRightClick" option is set to true on the plot.
     */
    $.jqplot.FunnelRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.FunnelRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.FunnelRenderer.prototype.constructor = $.jqplot.FunnelRenderer;
    
    // called with scope of a series
    $.jqplot.FunnelRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: padding
        // padding between the funnel and plot edges, legend, etc.
        this.padding = {top: 20, right: 20, bottom: 20, left: 20};
        // prop: sectionMargin
        // spacing between funnel sections in pixels.
        this.sectionMargin = 6;
        // prop: fill
        // true or false, whether to fill the areas.
        this.fill = true;
        // prop: shadowOffset
        // offset of the shadow from the area and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: highlightMouseOver
        // True to highlight area when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a area.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a area.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // array of colors to use when highlighting an area.
        this.highlightColors = [];
        // prop: widthRatio
        // The ratio of the width of the top of the funnel to the bottom.
        // a ratio of 0 will make an upside down pyramid. 
        this.widthRatio = 0.2;
        // prop: lineWidth
        // width of line if areas are stroked and not filled.
        this.lineWidth = 2;
        // prop: dataLabels
        // Either 'label', 'value', 'percent' or an array of labels to place on the pie slices.
        // Defaults to percentage of each pie slice.
        this.dataLabels = 'percent';
        // prop: showDataLabels
        // true to show data labels on slices.
        this.showDataLabels = false;
        // prop: dataLabelFormatString
        // Format string for data labels.  If none, '%s' is used for "label" and for arrays, '%d' for value and '%d%%' for percentage.
        this.dataLabelFormatString = null;
        // prop: dataLabelThreshold
        // Threshhold in percentage (0 - 100) of pie area, below which no label will be displayed.
        // This applies to all label types, not just to percentage labels.
        this.dataLabelThreshold = 3;
        this._type = 'funnel';
        
        this.tickRenderer = $.jqplot.FunnelTickRenderer;
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);
        
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // lengths of bases, or horizontal sides of areas of trapezoid.
        this._bases = [];
        // total area
        this._atot;
        // areas of segments.
        this._areas = [];
        // vertical lengths of segments.
        this._lengths = [];
        // angle of the funnel to vertical.
        this._angle;
        this._dataIndices = [];
        
        // sort data
        this._unorderedData = $.extend(true, [], this.data);
        var idxs = $.extend(true, [], this.data);
        for (var i=0; i<idxs.length; i++) {
            idxs[i].push(i);
        }
        this.data.sort( function (a, b) { return b[1] - a[1]; } );
        idxs.sort( function (a, b) { return b[1] - a[1]; });
        for (var i=0; i<idxs.length; i++) {
            this._dataIndices.push(idxs[i][2]);
        }
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.4 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
            }
        }

        plot.postParseOptionsHooks.addOnce(postParseOptions);
        plot.postInitHooks.addOnce(postInit);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);        
        
    };
    
    // gridData will be of form [label, percentage of total]
    $.jqplot.FunnelRenderer.prototype.setGridData = function(plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var sum = 0;
        var td = [];
        for (var i=0; i<this.data.length; i++){
            sum += this.data[i][1];
            td.push([this.data[i][0], this.data[i][1]]);
        }
        
        // normalize y values, so areas are proportional.
        for (var i=0; i<td.length; i++) {
            td[i][1] = td[i][1]/sum;
        }
        
        this._bases = new Array(td.length + 1);
        this._lengths = new Array(td.length);
        
        this.gridData = td;
    };
    
    $.jqplot.FunnelRenderer.prototype.makeGridData = function(data, plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var sum = 0;
        var td = [];
        for (var i=0; i<this.data.length; i++){
            sum += this.data[i][1];
            td.push([this.data[i][0], this.data[i][1]]);
        }
        
        // normalize y values, so areas are proportional.
        for (var i=0; i<td.length; i++) {
            td[i][1] = td[i][1]/sum;
        }
        
        this._bases = new Array(td.length + 1);
        this._lengths = new Array(td.length);
        
        return td;
    };
    
    $.jqplot.FunnelRenderer.prototype.drawSection = function (ctx, vertices, color, isShadow) {
        var fill = this.fill;
        var lineWidth = this.lineWidth;
        ctx.save();
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.save();
                ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                doDraw();
            }
        }
        
        else {
            doDraw();
        }
        
        function doDraw () {
            ctx.beginPath();  
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(vertices[0][0], vertices[0][1]);
            for (var i=1; i<4; i++) {
                ctx.lineTo(vertices[i][0], vertices[i][1]);
            }
            ctx.closePath();
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.restore();
            }
        }
        
        ctx.restore();
    };
    
    // called with scope of series
    $.jqplot.FunnelRenderer.prototype.draw = function (ctx, gd, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        // offset and direction of offset due to legend placement
        var offx = 0;
        var offy = 0;
        var trans = 1;
        this._areas = [];
        // var colorGenerator = new this.colorGenerator(this.seriesColors);
        if (options.legendInfo && options.legendInfo.placement == 'insideGrid') {
            var li = options.legendInfo;
            switch (li.location) {
                case 'nw':
                    offx = li.width + li.xoffset;
                    break;
                case 'w':
                    offx = li.width + li.xoffset;
                    break;
                case 'sw':
                    offx = li.width + li.xoffset;
                    break;
                case 'ne':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'e':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'se':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'n':
                    offy = li.height + li.yoffset;
                    break;
                case 's':
                    offy = li.height + li.yoffset;
                    trans = -1;
                    break;
                default:
                    break;
            }
        }
        
        var loff = (trans==1) ? this.padding.left + offx : this.padding.left;
        var toff = (trans==1) ? this.padding.top + offy : this.padding.top;
        var roff = (trans==-1) ? this.padding.right + offx : this.padding.right;
        var boff = (trans==-1) ? this.padding.bottom + offy : this.padding.bottom;
        
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        this._bases[0] = cw - loff - roff;
        var ltot = this._length = ch - toff - boff;

        var hend = this._bases[0]*this.widthRatio;
        this._atot = ltot/2 * (this._bases[0] + this._bases[0]*this.widthRatio);

        this._angle = Math.atan((this._bases[0] - hend)/2/ltot);

        for (i=0; i<gd.length; i++) {
            this._areas.push(gd[i][1] * this._atot);
        }

        
        var guess, err, count, lsum=0;
        var tolerance = 0.0001;

        for (i=0; i<this._areas.length; i++) {
            guess = this._areas[i]/this._bases[i];
            err = 999999;
            this._lengths[i] = guess;
            count = 0;
            while (err > this._lengths[i]*tolerance && count < 100) {
                this._lengths[i] = this._areas[i]/(this._bases[i] - this._lengths[i] * Math.tan(this._angle));
                err = Math.abs(this._lengths[i] - guess);
                this._bases[i+1] = this._bases[i] - (2*this._lengths[i]*Math.tan(this._angle));
                guess = this._lengths[i];
                count++;
            }
            lsum += this._lengths[i];
        }
        
        // figure out vertices of each section
        this._vertices = new Array(gd.length);
        
        // these are 4 coners of entire trapezoid
        var p0 = [loff, toff],
            p1 = [loff+this._bases[0], toff],
            p2 = [loff + (this._bases[0] - this._bases[this._bases.length-1])/2, toff + this._length],
            p3 = [p2[0] + this._bases[this._bases.length-1], p2[1]];
            
        // equations of right and left sides, returns x, y values given height of section (y value)
        function findleft (l) {
            var m = (p0[1] - p2[1])/(p0[0] - p2[0]);
            var b = p0[1] - m*p0[0];
            var y = l + p0[1];
            
            return [(y - b)/m, y];
        }
        
        function findright (l) {
            var m = (p1[1] - p3[1])/(p1[0] - p3[0]);
            var b = p1[1] - m*p1[0];
            var y = l + p1[1];
            
            return [(y - b)/m, y];
        }
        
        var x = offx, y = offy;
        var h=0, adj=0;
        
        for (i=0; i<gd.length; i++) {
            this._vertices[i] = new Array();
            var v = this._vertices[i];
            var sm = this.sectionMargin;
            if (i == 0) {
                adj = 0;
            }
            if (i == 1) {
                adj = sm/3;
            }
            else if (i > 0 && i < gd.length-1) {
                adj = sm/2;
            }
            else if (i == gd.length -1) {
                adj = 2*sm/3;
            }
            v.push(findleft(h+adj));
            v.push(findright(h+adj));
            h += this._lengths[i];
            if (i == 0) {
                adj = -2*sm/3;
            }
            else if (i > 0 && i < gd.length-1) {
                adj = -sm/2;
            }
            else if (i == gd.length - 1) {
                adj = 0;
            }
            v.push(findright(h+adj));
            v.push(findleft(h+adj));
            
        }

        if (this.shadow) {
            var shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
            for (var i=0; i<gd.length; i++) {
                this.renderer.drawSection.call (this, ctx, this._vertices[i], shadowColor, true);
            }
            
        }
        for (var i=0; i<gd.length; i++) {
            var v = this._vertices[i];
            this.renderer.drawSection.call (this, ctx, v, this.seriesColors[i]);
            
            if (this.showDataLabels && gd[i][1]*100 >= this.dataLabelThreshold) {
                var fstr, label;
                
                if (this.dataLabels == 'label') {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, gd[i][0]);
                }
                else if (this.dataLabels == 'value') {
                    fstr = this.dataLabelFormatString || '%d';
                    label = $.jqplot.sprintf(fstr, this.data[i][1]);
                }
                else if (this.dataLabels == 'percent') {
                    fstr = this.dataLabelFormatString || '%d%%';
                    label = $.jqplot.sprintf(fstr, gd[i][1]*100);
                }
                else if (this.dataLabels.constructor == Array) {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, this.dataLabels[this._dataIndices[i]]);
                }
                
                var fact = (this._radius ) * this.dataLabelPositionFactor + this.sliceMargin + this.dataLabelNudge;
                
                var x = (v[0][0] + v[1][0])/2 + this.canvas._offsets.left;
                var y = (v[1][1] + v[2][1])/2 + this.canvas._offsets.top;
                
                var labelelem = $('<span class="jqplot-funnel-series jqplot-data-label" style="position:absolute;">' + label + '</span>').insertBefore(plot.eventCanvas._elem);
                x -= labelelem.width()/2;
                y -= labelelem.height()/2;
                x = Math.round(x);
                y = Math.round(y);
                labelelem.css({left: x, top: y});
            }
            
        }
               
    };
    
    $.jqplot.FunnelAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.FunnelAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.FunnelAxisRenderer.prototype.constructor = $.jqplot.FunnelAxisRenderer;
        
    
    // There are no traditional axes on a funnel chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.FunnelAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.FunnelTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false; 
    };
    
    
    
    /**
     * Class: $.jqplot.FunnelLegendRenderer
     * Legend Renderer specific to funnel plots.  Set by default
     * when the user creates a funnel plot.
     */
    $.jqplot.FunnelLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.FunnelLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.FunnelLegendRenderer.prototype.constructor = $.jqplot.FunnelLegendRenderer;
    
    $.jqplot.FunnelLegendRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with context of legend
    $.jqplot.FunnelLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            ss += (this.marginTop != null) ? 'margin-top:'+this.marginTop+';' : '';
            ss += (this.marginBottom != null) ? 'margin-bottom:'+this.marginBottom+';' : '';
            ss += (this.marginLeft != null) ? 'margin-left:'+this.marginLeft+';' : '';
            ss += (this.marginRight != null) ? 'margin-right:'+this.marginRight+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
            // Funnel charts legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = false,
                nr, nc;
            var s = series[0];
            var colorGenerator = new $.jqplot.ColorGenerator(s.seriesColors);
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j, tr, td1, td2, lt, rs, color;
                var idx = 0;    
                
                for (i=0; i<nr; i++) {
                    if (reverse){
                        tr = $('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem);
                    }
                    else{
                        tr = $('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);
                    }
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length){
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = colorGenerator.next();
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';
                
                            td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                                '<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+
                                '</div></td>');
                            td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }
            }
        }
        return this._elem;                
    };
    
    // $.jqplot.FunnelLegendRenderer.prototype.pack = function(offsets) {
    //     if (this.show) {
    //         // fake a grid for positioning
    //         var grid = {_top:offsets.top, _left:offsets.left, _right:offsets.right, _bottom:this._plotDimensions.height - offsets.bottom};        
    //         if (this.placement == 'insideGrid') {
    //             switch (this.location) {
    //                 case 'nw':
    //                     var a = grid._left + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css('left', a);
    //                     this._elem.css('top', b);
    //                     break;
    //                 case 'n':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css('left', a);
    //                     this._elem.css('top', b);
    //                     break;
    //                 case 'ne':
    //                     var a = offsets.right + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css({right:a, top:b});
    //                     break;
    //                 case 'e':
    //                     var a = offsets.right + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({right:a, top:b});
    //                     break;
    //                 case 'se':
    //                     var a = offsets.right + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //                 case 's':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, bottom:b});
    //                     break;
    //                 case 'sw':
    //                     var a = grid._left + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, bottom:b});
    //                     break;
    //                 case 'w':
    //                     var a = grid._left + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 default:  // same as 'se'
    //                     var a = grid._right - this.xoffset;
    //                     var b = grid._bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //             }
    //             
    //         }
    //         else {
    //             switch (this.location) {
    //                 case 'nw':
    //                     var a = this._plotDimensions.width - grid._left + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css('right', a);
    //                     this._elem.css('top', b);
    //                     break;
    //                 case 'n':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = this._plotDimensions.height - grid._top + this.yoffset;
    //                     this._elem.css('left', a);
    //                     this._elem.css('bottom', b);
    //                     break;
    //                 case 'ne':
    //                     var a = this._plotDimensions.width - offsets.right + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 case 'e':
    //                     var a = this._plotDimensions.width - offsets.right + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 case 'se':
    //                     var a = this._plotDimensions.width - offsets.right + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, bottom:b});
    //                     break;
    //                 case 's':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = this._plotDimensions.height - offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 case 'sw':
    //                     var a = this._plotDimensions.width - grid._left + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //                 case 'w':
    //                     var a = this._plotDimensions.width - grid._left + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({right:a, top:b});
    //                     break;
    //                 default:  // same as 'se'
    //                     var a = grid._right - this.xoffset;
    //                     var b = grid._bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //             }
    //         }
    //     } 
    // };
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a funnel series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.FunnelRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.FunnelRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.FunnelAxisRenderer;
            options.legend.renderer = $.jqplot.FunnelLegendRenderer;
            options.legend.preDraw = true;
            options.sortData = false;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    
    function postInit(target, data, options) {
        // if multiple series, add a reference to the previous one so that
        // funnel rings can nest.
        for (var i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.FunnelRenderer) {
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }
    
    // called with scope of plot
    function postParseOptions(options) {
        for (var i=0; i<this.series.length; i++) {
            this.series[i].seriesColors = this.seriesColors;
            this.series[i].colorGenerator = $.jqplot.colorGenerator;
        }
    }
    
    function highlight (plot, sidx, pidx) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.funnelRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.funnelRenderer.highlightedSeriesIndex = sidx;
        s.renderer.drawSection.call(s, canvas._ctx, s._vertices[pidx], s.highlightColors[pidx], false);
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.funnelRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.funnelRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.funnelRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.funnelRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.funnelRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.funnelRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.funnelRenderer && this.plugins.funnelRenderer.highlightCanvas) {
            this.plugins.funnelRenderer.highlightCanvas.resetCanvas();
            this.plugins.funnelRenderer.highlightCanvas = null;
        }

        this.plugins.funnelRenderer = {};
        this.plugins.funnelRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        // do we have any data labels?  if so, put highlight canvas before those
        var labels = $(this.targetId+' .jqplot-data-label');
        if (labels.length) {
            $(labels[0]).before(this.plugins.funnelRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-funnelRenderer-highlight-canvas', this._plotDimensions, this));
        }
        // else put highlight canvas before event canvas.
        else {
            this.eventCanvas._elem.before(this.plugins.funnelRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-funnelRenderer-highlight-canvas', this._plotDimensions, this));
        }
        var hctx = this.plugins.funnelRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
    $.jqplot.FunnelTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.FunnelTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.FunnelTickRenderer.prototype.constructor = $.jqplot.FunnelTickRenderer;
    
})(jQuery);
    
    
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(e){e.jqplot.FunnelRenderer=function(){e.jqplot.LineRenderer.call(this)};e.jqplot.FunnelRenderer.prototype=new e.jqplot.LineRenderer();e.jqplot.FunnelRenderer.prototype.constructor=e.jqplot.FunnelRenderer;e.jqplot.FunnelRenderer.prototype.init=function(p,t){this.padding={top:20,right:20,bottom:20,left:20};this.sectionMargin=6;this.fill=true;this.shadowOffset=2;this.shadowAlpha=0.07;this.shadowDepth=5;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.widthRatio=0.2;this.lineWidth=2;this.dataLabels="percent";this.showDataLabels=false;this.dataLabelFormatString=null;this.dataLabelThreshold=3;this._type="funnel";this.tickRenderer=e.jqplot.FunnelTickRenderer;if(p.highlightMouseDown&&p.highlightMouseOver==null){p.highlightMouseOver=false}e.extend(true,this,p);this._highlightedPoint=null;this._bases=[];this._atot;this._areas=[];this._lengths=[];this._angle;this._dataIndices=[];this._unorderedData=e.extend(true,[],this.data);var o=e.extend(true,[],this.data);for(var r=0;r<o.length;r++){o[r].push(r)}this.data.sort(function(v,u){return u[1]-v[1]});o.sort(function(v,u){return u[1]-v[1]});for(var r=0;r<o.length;r++){this._dataIndices.push(o[r][2])}if(this.highlightColors.length==0){for(var r=0;r<this.seriesColors.length;r++){var q=e.jqplot.getColorComponents(this.seriesColors[r]);var m=[q[0],q[1],q[2]];var s=m[0]+m[1]+m[2];for(var n=0;n<3;n++){m[n]=(s>570)?m[n]*0.8:m[n]+0.4*(255-m[n]);m[n]=parseInt(m[n],10)}this.highlightColors.push("rgb("+m[0]+","+m[1]+","+m[2]+")")}}t.postParseOptionsHooks.addOnce(k);t.postInitHooks.addOnce(g);t.eventListenerHooks.addOnce("jqplotMouseMove",a);t.eventListenerHooks.addOnce("jqplotMouseDown",b);t.eventListenerHooks.addOnce("jqplotMouseUp",j);t.eventListenerHooks.addOnce("jqplotClick",f);t.eventListenerHooks.addOnce("jqplotRightClick",l);t.postDrawHooks.addOnce(h)};e.jqplot.FunnelRenderer.prototype.setGridData=function(o){var n=0;var p=[];for(var m=0;m<this.data.length;m++){n+=this.data[m][1];p.push([this.data[m][0],this.data[m][1]])}for(var m=0;m<p.length;m++){p[m][1]=p[m][1]/n}this._bases=new Array(p.length+1);this._lengths=new Array(p.length);this.gridData=p};e.jqplot.FunnelRenderer.prototype.makeGridData=function(o,p){var n=0;var q=[];for(var m=0;m<this.data.length;m++){n+=this.data[m][1];q.push([this.data[m][0],this.data[m][1]])}for(var m=0;m<q.length;m++){q[m][1]=q[m][1]/n}this._bases=new Array(q.length+1);this._lengths=new Array(q.length);return q};e.jqplot.FunnelRenderer.prototype.drawSection=function(n,p,o,s){var t=this.fill;var m=this.lineWidth;n.save();if(s){for(var r=0;r<this.shadowDepth;r++){n.save();n.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI),this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));q()}}else{q()}function q(){n.beginPath();n.fillStyle=o;n.strokeStyle=o;n.lineWidth=m;n.moveTo(p[0][0],p[0][1]);for(var u=1;u<4;u++){n.lineTo(p[u][0],p[u][1])}n.closePath();if(t){n.fill()}else{n.stroke()}}if(s){for(var r=0;r<this.shadowDepth;r++){n.restore()}}n.restore()};e.jqplot.FunnelRenderer.prototype.draw=function(G,B,J,p){var Y;var L=(J!=undefined)?J:{};var w=0;var u=0;var R=1;this._areas=[];if(J.legendInfo&&J.legendInfo.placement=="insideGrid"){var O=J.legendInfo;switch(O.location){case"nw":w=O.width+O.xoffset;break;case"w":w=O.width+O.xoffset;break;case"sw":w=O.width+O.xoffset;break;case"ne":w=O.width+O.xoffset;R=-1;break;case"e":w=O.width+O.xoffset;R=-1;break;case"se":w=O.width+O.xoffset;R=-1;break;case"n":u=O.height+O.yoffset;break;case"s":u=O.height+O.yoffset;R=-1;break;default:break}}var t=(R==1)?this.padding.left+w:this.padding.left;var F=(R==1)?this.padding.top+u:this.padding.top;var M=(R==-1)?this.padding.right+w:this.padding.right;var o=(R==-1)?this.padding.bottom+u:this.padding.bottom;var P=(L.shadow!=undefined)?L.shadow:this.shadow;var q=(L.showLine!=undefined)?L.showLine:this.showLine;var C=(L.fill!=undefined)?L.fill:this.fill;var H=G.canvas.width;var N=G.canvas.height;this._bases[0]=H-t-M;var I=this._length=N-F-o;var r=this._bases[0]*this.widthRatio;this._atot=I/2*(this._bases[0]+this._bases[0]*this.widthRatio);this._angle=Math.atan((this._bases[0]-r)/2/I);for(Y=0;Y<B.length;Y++){this._areas.push(B[Y][1]*this._atot)}var E,aa,W,Q=0;var n=0.0001;for(Y=0;Y<this._areas.length;Y++){E=this._areas[Y]/this._bases[Y];aa=999999;this._lengths[Y]=E;W=0;while(aa>this._lengths[Y]*n&&W<100){this._lengths[Y]=this._areas[Y]/(this._bases[Y]-this._lengths[Y]*Math.tan(this._angle));aa=Math.abs(this._lengths[Y]-E);this._bases[Y+1]=this._bases[Y]-(2*this._lengths[Y]*Math.tan(this._angle));E=this._lengths[Y];W++}Q+=this._lengths[Y]}this._vertices=new Array(B.length);var ae=[t,F],ad=[t+this._bases[0],F],ac=[t+(this._bases[0]-this._bases[this._bases.length-1])/2,F+this._length],ab=[ac[0]+this._bases[this._bases.length-1],ac[1]];function V(ag){var x=(ae[1]-ac[1])/(ae[0]-ac[0]);var v=ae[1]-x*ae[0];var ah=ag+ae[1];return[(ah-v)/x,ah]}function D(ag){var x=(ad[1]-ab[1])/(ad[0]-ab[0]);var v=ad[1]-x*ad[0];var ah=ag+ad[1];return[(ah-v)/x,ah]}var T=w,S=u;var Z=0,m=0;for(Y=0;Y<B.length;Y++){this._vertices[Y]=new Array();var U=this._vertices[Y];var A=this.sectionMargin;if(Y==0){m=0}if(Y==1){m=A/3}else{if(Y>0&&Y<B.length-1){m=A/2}else{if(Y==B.length-1){m=2*A/3}}}U.push(V(Z+m));U.push(D(Z+m));Z+=this._lengths[Y];if(Y==0){m=-2*A/3}else{if(Y>0&&Y<B.length-1){m=-A/2}else{if(Y==B.length-1){m=0}}}U.push(D(Z+m));U.push(V(Z+m))}if(this.shadow){var af="rgba(0,0,0,"+this.shadowAlpha+")";for(var Y=0;Y<B.length;Y++){this.renderer.drawSection.call(this,G,this._vertices[Y],af,true)}}for(var Y=0;Y<B.length;Y++){var U=this._vertices[Y];this.renderer.drawSection.call(this,G,U,this.seriesColors[Y]);if(this.showDataLabels&&B[Y][1]*100>=this.dataLabelThreshold){var K,X;if(this.dataLabels=="label"){K=this.dataLabelFormatString||"%s";X=e.jqplot.sprintf(K,B[Y][0])}else{if(this.dataLabels=="value"){K=this.dataLabelFormatString||"%d";X=e.jqplot.sprintf(K,this.data[Y][1])}else{if(this.dataLabels=="percent"){K=this.dataLabelFormatString||"%d%%";X=e.jqplot.sprintf(K,B[Y][1]*100)}else{if(this.dataLabels.constructor==Array){K=this.dataLabelFormatString||"%s";X=e.jqplot.sprintf(K,this.dataLabels[this._dataIndices[Y]])}}}}var s=(this._radius)*this.dataLabelPositionFactor+this.sliceMargin+this.dataLabelNudge;var T=(U[0][0]+U[1][0])/2+this.canvas._offsets.left;var S=(U[1][1]+U[2][1])/2+this.canvas._offsets.top;var z=e('<span class="jqplot-funnel-series jqplot-data-label" style="position:absolute;">'+X+"</span>").insertBefore(p.eventCanvas._elem);T-=z.width()/2;S-=z.height()/2;T=Math.round(T);S=Math.round(S);z.css({left:T,top:S})}}};e.jqplot.FunnelAxisRenderer=function(){e.jqplot.LinearAxisRenderer.call(this)};e.jqplot.FunnelAxisRenderer.prototype=new e.jqplot.LinearAxisRenderer();e.jqplot.FunnelAxisRenderer.prototype.constructor=e.jqplot.FunnelAxisRenderer;e.jqplot.FunnelAxisRenderer.prototype.init=function(m){this.tickRenderer=e.jqplot.FunnelTickRenderer;e.extend(true,this,m);this._dataBounds={min:0,max:100};this.min=0;this.max=100;this.showTicks=false;this.ticks=[];this.showMark=false;this.show=false};e.jqplot.FunnelLegendRenderer=function(){e.jqplot.TableLegendRenderer.call(this)};e.jqplot.FunnelLegendRenderer.prototype=new e.jqplot.TableLegendRenderer();e.jqplot.FunnelLegendRenderer.prototype.constructor=e.jqplot.FunnelLegendRenderer;e.jqplot.FunnelLegendRenderer.prototype.init=function(m){this.numberRows=null;this.numberColumns=null;e.extend(true,this,m)};e.jqplot.FunnelLegendRenderer.prototype.draw=function(){var p=this;if(this.show){var x=this._series;var A="position:absolute;";A+=(this.background)?"background:"+this.background+";":"";A+=(this.border)?"border:"+this.border+";":"";A+=(this.fontSize)?"font-size:"+this.fontSize+";":"";A+=(this.fontFamily)?"font-family:"+this.fontFamily+";":"";A+=(this.textColor)?"color:"+this.textColor+";":"";A+=(this.marginTop!=null)?"margin-top:"+this.marginTop+";":"";A+=(this.marginBottom!=null)?"margin-bottom:"+this.marginBottom+";":"";A+=(this.marginLeft!=null)?"margin-left:"+this.marginLeft+";":"";A+=(this.marginRight!=null)?"margin-right:"+this.marginRight+";":"";this._elem=e('<table class="jqplot-table-legend" style="'+A+'"></table>');var E=false,w=false,m,u;var y=x[0];var n=new e.jqplot.ColorGenerator(y.seriesColors);if(y.show){var F=y.data;if(this.numberRows){m=this.numberRows;if(!this.numberColumns){u=Math.ceil(F.length/m)}else{u=this.numberColumns}}else{if(this.numberColumns){u=this.numberColumns;m=Math.ceil(F.length/this.numberColumns)}else{m=F.length;u=1}}var D,C,o,r,q,t,v,B;var z=0;for(D=0;D<m;D++){if(w){o=e('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem)}else{o=e('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem)}for(C=0;C<u;C++){if(z<F.length){t=this.labels[z]||F[z][0].toString();B=n.next();if(!w){if(D>0){E=true}else{E=false}}else{if(D==m-1){E=false}else{E=true}}v=(E)?this.rowSpacing:"0";r=e('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+v+';"><div><div class="jqplot-table-legend-swatch" style="border-color:'+B+';"></div></div></td>');q=e('<td class="jqplot-table-legend" style="padding-top:'+v+';"></td>');if(this.escapeHtml){q.text(t)}else{q.html(t)}if(w){q.prependTo(o);r.prependTo(o)}else{r.appendTo(o);q.appendTo(o)}E=true}z++}}}}return this._elem};function c(q,p,n){n=n||{};n.axesDefaults=n.axesDefaults||{};n.legend=n.legend||{};n.seriesDefaults=n.seriesDefaults||{};var m=false;if(n.seriesDefaults.renderer==e.jqplot.FunnelRenderer){m=true}else{if(n.series){for(var o=0;o<n.series.length;o++){if(n.series[o].renderer==e.jqplot.FunnelRenderer){m=true}}}}if(m){n.axesDefaults.renderer=e.jqplot.FunnelAxisRenderer;n.legend.renderer=e.jqplot.FunnelLegendRenderer;n.legend.preDraw=true;n.sortData=false;n.seriesDefaults.pointLabels={show:false}}}function g(p,o,m){for(var n=0;n<this.series.length;n++){if(this.series[n].renderer.constructor==e.jqplot.FunnelRenderer){if(this.series[n].highlightMouseOver){this.series[n].highlightMouseDown=false}}}}function k(m){for(var n=0;n<this.series.length;n++){this.series[n].seriesColors=this.seriesColors;this.series[n].colorGenerator=e.jqplot.colorGenerator}}function d(q,p,o){var n=q.series[p];var m=q.plugins.funnelRenderer.highlightCanvas;m._ctx.clearRect(0,0,m._ctx.canvas.width,m._ctx.canvas.height);n._highlightedPoint=o;q.plugins.funnelRenderer.highlightedSeriesIndex=p;n.renderer.drawSection.call(n,m._ctx,n._vertices[o],n.highlightColors[o],false)}function i(o){var m=o.plugins.funnelRenderer.highlightCanvas;m._ctx.clearRect(0,0,m._ctx.canvas.width,m._ctx.canvas.height);for(var n=0;n<o.series.length;n++){o.series[n]._highlightedPoint=null}o.plugins.funnelRenderer.highlightedSeriesIndex=null;o.target.trigger("jqplotDataUnhighlight")}function a(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];var n=jQuery.Event("jqplotDataMouseOver");n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o);if(r.series[o[0]].highlightMouseOver&&!(o[0]==r.plugins.funnelRenderer.highlightedSeriesIndex&&o[1]==r.series[o[0]]._highlightedPoint)){var m=jQuery.Event("jqplotDataHighlight");m.which=q.which;m.pageX=q.pageX;m.pageY=q.pageY;r.target.trigger(m,o);d(r,o[0],o[1])}}else{if(s==null){i(r)}}}function b(p,o,s,r,q){if(r){var n=[r.seriesIndex,r.pointIndex,r.data];if(q.series[n[0]].highlightMouseDown&&!(n[0]==q.plugins.funnelRenderer.highlightedSeriesIndex&&n[1]==q.series[n[0]]._highlightedPoint)){var m=jQuery.Event("jqplotDataHighlight");m.which=p.which;m.pageX=p.pageX;m.pageY=p.pageY;q.target.trigger(m,n);d(q,n[0],n[1])}}else{if(r==null){i(q)}}}function j(o,n,r,q,p){var m=p.plugins.funnelRenderer.highlightedSeriesIndex;if(m!=null&&p.series[m].highlightMouseDown){i(p)}}function f(p,o,s,r,q){if(r){var n=[r.seriesIndex,r.pointIndex,r.data];var m=jQuery.Event("jqplotDataClick");m.which=p.which;m.pageX=p.pageX;m.pageY=p.pageY;q.target.trigger(m,n)}}function l(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];var m=r.plugins.funnelRenderer.highlightedSeriesIndex;if(m!=null&&r.series[m].highlightMouseDown){i(r)}var n=jQuery.Event("jqplotDataRightClick");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o)}}function h(){if(this.plugins.funnelRenderer&&this.plugins.funnelRenderer.highlightCanvas){this.plugins.funnelRenderer.highlightCanvas.resetCanvas();this.plugins.funnelRenderer.highlightCanvas=null}this.plugins.funnelRenderer={};this.plugins.funnelRenderer.highlightCanvas=new e.jqplot.GenericCanvas();var n=e(this.targetId+" .jqplot-data-label");if(n.length){e(n[0]).before(this.plugins.funnelRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-funnelRenderer-highlight-canvas",this._plotDimensions,this))}else{this.eventCanvas._elem.before(this.plugins.funnelRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-funnelRenderer-highlight-canvas",this._plotDimensions,this))}var m=this.plugins.funnelRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(o){i(o.data.plot)})}e.jqplot.preInitHooks.push(c);e.jqplot.FunnelTickRenderer=function(){e.jqplot.AxisTickRenderer.call(this)};e.jqplot.FunnelTickRenderer.prototype=new e.jqplot.AxisTickRenderer();e.jqplot.FunnelTickRenderer.prototype.constructor=e.jqplot.FunnelTickRenderer})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
    
    /**
     * Class: $.jqplot.Highlighter
     * Plugin which will highlight data points when they are moused over.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.highlighter.js"></script>
     * 
     * A tooltip providing information about the data point is enabled by default.
     * To disable the tooltip, set "showTooltip" to false.
     * 
     * You can control what data is displayed in the tooltip with various
     * options.  The "tooltipAxes" option controls whether the x, y or both
     * data values are displayed.
     * 
     * Some chart types (e.g. hi-low-close) have more than one y value per
     * data point. To display the additional values in the tooltip, set the
     * "yvalues" option to the desired number of y values present (3 for a hlc chart).
     * 
     * By default, data values will be formatted with the same formatting
     * specifiers as used to format the axis ticks.  A custom format code
     * can be supplied with the tooltipFormatString option.  This will apply 
     * to all values in the tooltip.  
     * 
     * For more complete control, the "formatString" option can be set.  This
     * Allows conplete control over tooltip formatting.  Values are passed to
     * the format string in an order determined by the "tooltipAxes" and "yvalues"
     * options.  So, if you have a hi-low-close chart and you just want to display 
     * the hi-low-close values in the tooltip, you could set a formatString like:
     * 
     * > highlighter: {
     * >     tooltipAxes: 'y',
     * >     yvalues: 3,
     * >     formatString:'<table class="jqplot-highlighter">
     * >         <tr><td>hi:</td><td>%s</td></tr>
     * >         <tr><td>low:</td><td>%s</td></tr>
     * >         <tr><td>close:</td><td>%s</td></tr></table>'
     * > }
     * 
     */
    $.jqplot.Highlighter = function(options) {
        // Group: Properties
        //
        //prop: show
        // true to show the highlight.
        this.show = $.jqplot.config.enablePlugins;
        // prop: markerRenderer
        // Renderer used to draw the marker of the highlighted point.
        // Renderer will assimilate attributes from the data point being highlighted,
        // so no attributes need set on the renderer directly.
        // Default is to turn off shadow drawing on the highlighted point.
        this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
        // prop: showMarker
        // true to show the marker
        this.showMarker  = true;
        // prop: lineWidthAdjust
        // Pixels to add to the lineWidth of the highlight.
        this.lineWidthAdjust = 2.5;
        // prop: sizeAdjust
        // Pixels to add to the overall size of the highlight.
        this.sizeAdjust = 5;
        // prop: showTooltip
        // Show a tooltip with data point values.
        this.showTooltip = true;
        // prop: tooltipLocation
        // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.tooltipLocation = 'nw';
        // prop: fadeTooltip
        // true = fade in/out tooltip, flase = show/hide tooltip
        this.fadeTooltip = true;
        // prop: tooltipFadeSpeed
        // 'slow', 'def', 'fast', or number of milliseconds.
        this.tooltipFadeSpeed = "fast";
        // prop: tooltipOffset
        // Pixel offset of tooltip from the highlight.
        this.tooltipOffset = 2;
        // prop: tooltipAxes
        // Which axes to display in tooltip, 'x', 'y' or 'both', 'xy' or 'yx'
        // 'both' and 'xy' are equivalent, 'yx' reverses order of labels.
        this.tooltipAxes = 'both';
        // prop; tooltipSeparator
        // String to use to separate x and y axes in tooltip.
        this.tooltipSeparator = ', ';
        // prop; tooltipContentEditor
        // Function used to edit/augment/replace the formatted tooltip contents.
        // Called as str = tooltipContentEditor(str, seriesIndex, pointIndex)
        // where str is the generated tooltip html and seriesIndex and pointIndex identify
        // the data point being highlighted. Should return the html for the tooltip contents.
        this.tooltipContentEditor = null;
        // prop: useAxesFormatters
        // Use the x and y axes formatters to format the text in the tooltip.
        this.useAxesFormatters = true;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference.
        // Additional "p" and "P" format specifiers added by Chris Leonello.
        this.tooltipFormatString = '%.5P';
        // prop: formatString
        // alternative to tooltipFormatString
        // will format the whole tooltip text, populating with x, y values as
        // indicated by tooltipAxes option.  So, you could have a tooltip like:
        // 'Date: %s, number of cats: %d' to format the whole tooltip at one go.
        // If useAxesFormatters is true, values will be formatted according to
        // Axes formatters and you can populate your tooltip string with 
        // %s placeholders.
        this.formatString = null;
        // prop: yvalues
        // Number of y values to expect in the data point array.
        // Typically this is 1.  Certain plots, like OHLC, will
        // have more y values in each data point array.
        this.yvalues = 1;
        // prop: bringSeriesToFront
        // This option requires jQuery 1.4+
        // True to bring the series of the highlighted point to the front
        // of other series.
        this.bringSeriesToFront = false;
        this._tooltipElem;
        this.isHighlighting = false;
        this.currentNeighbor = null;

        $.extend(true, this, options);
    };
    
    var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    var locationIndicies = {'nw':0, 'n':1, 'ne':2, 'e':3, 'se':4, 's':5, 'sw':6, 'w':7};
    var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    
    // axis.renderer.tickrenderer.formatter
    
    // called with scope of plot
    $.jqplot.Highlighter.init = function (target, data, opts){
        var options = opts || {};
        // add a highlighter attribute to the plot
        this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
    };
    
    // called within scope of series
    $.jqplot.Highlighter.parseOptions = function (defaults, options) {
        // Add a showHighlight option to the series 
        // and set it to true by default.
        this.showHighlight = true;
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.Highlighter.postPlotDraw = function() {
        // Memory Leaks patch    
        if (this.plugins.highlighter && this.plugins.highlighter.highlightCanvas) {
            this.plugins.highlighter.highlightCanvas.resetCanvas();
            this.plugins.highlighter.highlightCanvas = null;
        }

        if (this.plugins.highlighter && this.plugins.highlighter._tooltipElem) {
            this.plugins.highlighter._tooltipElem.emptyForce();
            this.plugins.highlighter._tooltipElem = null;
        }

        this.plugins.highlighter.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions, this));
        this.plugins.highlighter.highlightCanvas.setContext();

        var elem = document.createElement('div');
        this.plugins.highlighter._tooltipElem = $(elem);
        elem = null;
        this.plugins.highlighter._tooltipElem.addClass('jqplot-highlighter-tooltip');
        this.plugins.highlighter._tooltipElem.css({position:'absolute', display:'none'});
        
        this.eventCanvas._elem.before(this.plugins.highlighter._tooltipElem);
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Highlighter.init);
    $.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);
    $.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);
    
    function draw(plot, neighbor) {
        var hl = plot.plugins.highlighter;
        var s = plot.series[neighbor.seriesIndex];
        var smr = s.markerRenderer;
        var mr = hl.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + hl.lineWidthAdjust;
        mr.size = smr.size + hl.sizeAdjust;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var newrgb = [rgba[0], rgba[1], rgba[2]];
        var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
        mr.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], hl.highlightCanvas._ctx);
    }
    
    function showTooltip(plot, series, neighbor) {
        // neighbor looks like: {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]}
        // gridData should be x,y pixel coords on the grid.
        // add the plot._gridPadding to that to get x,y in the target.
        var hl = plot.plugins.highlighter;
        var elem = hl._tooltipElem;
        var serieshl = series.highlighter || {};

        var opts = $.extend(true, {}, hl, serieshl);

        if (opts.useAxesFormatters) {
            var xf = series._xaxis._ticks[0].formatter;
            var yf = series._yaxis._ticks[0].formatter;
            var xfstr = series._xaxis._ticks[0].formatString;
            var yfstr = series._yaxis._ticks[0].formatString;
            var str;
            var xstr = xf(xfstr, neighbor.data[0]);
            var ystrs = [];
            for (var i=1; i<opts.yvalues+1; i++) {
                ystrs.push(yf(yfstr, neighbor.data[i]));
            }
            if (typeof opts.formatString === 'string') {
                switch (opts.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        ystrs.unshift(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'yx':
                        ystrs.push(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'x':
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, xstr]);
                        break;
                    case 'y':
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    default: // same as xy
                        ystrs.unshift(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                } 
            }
            else {
                switch (opts.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += opts.tooltipSeparator + ystrs[i];
                        }
                        break;
                    case 'yx':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + opts.tooltipSeparator;
                        }
                        str += xstr;
                        break;
                    case 'x':
                        str = xstr;
                        break;
                    case 'y':
                        str = ystrs.join(opts.tooltipSeparator);
                        break;
                    default: // same as 'xy'
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += opts.tooltipSeparator + ystrs[i];
                        }
                        break;
                    
                }                
            }
        }
        else {
            var str;
            if (typeof opts.formatString ===  'string') {
                str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString].concat(neighbor.data));
            }

            else {
                if (opts.tooltipAxes == 'both' || opts.tooltipAxes == 'xy') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]) + opts.tooltipSeparator + $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]);
                }
                else if (opts.tooltipAxes == 'yx') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]) + opts.tooltipSeparator + $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]);
                }
                else if (opts.tooltipAxes == 'x') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]);
                }
                else if (opts.tooltipAxes == 'y') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]);
                } 
            }
        }
        if ($.isFunction(opts.tooltipContentEditor)) {
            // args str, seriesIndex, pointIndex are essential so the hook can look up
            // extra data for the point.
            str = opts.tooltipContentEditor(str, neighbor.seriesIndex, neighbor.pointIndex, plot);
        }
        elem.html(str);
        var gridpos = {x:neighbor.gridData[0], y:neighbor.gridData[1]};
        var ms = 0;
        var fact = 0.707;
        if (series.markerRenderer.show == true) { 
            ms = (series.markerRenderer.size + opts.sizeAdjust)/2;
        }

        var loc = locations;
        if (series.fillToZero && series.fill && neighbor.data[1] < 0) {
          loc = oppositeLocations;
        }

        switch (loc[locationIndicies[opts.tooltipLocation]]) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - ms;
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + fact * ms;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + ms;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + fact * ms;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
        }
        elem.css('left', x);
        elem.css('top', y);
        if (opts.fadeTooltip) {
            // Fix for stacked up animations.  Thnanks Trevor!
            elem.stop(true,true).fadeIn(opts.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        elem = null;
        
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var hl = plot.plugins.highlighter;
        var c = plot.plugins.cursor;
        if (hl.show) {
            if (neighbor == null && hl.isHighlighting) {
                var evt = jQuery.Event('jqplotHighlighterUnhighlight');
                plot.target.trigger(evt);

                var ctx = hl.highlightCanvas._ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (hl.fadeTooltip) {
                    hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed);
                }
                else {
                    hl._tooltipElem.hide();
                }
                if (hl.bringSeriesToFront) {
                    plot.restorePreviousSeriesOrder();
                }
                hl.isHighlighting = false;
                hl.currentNeighbor = null;
                ctx = null;
            }
            else if (neighbor != null && plot.series[neighbor.seriesIndex].showHighlight && !hl.isHighlighting) {
                var evt = jQuery.Event('jqplotHighlighterHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data, plot];
                plot.target.trigger(evt, ins);

                hl.isHighlighting = true;
                hl.currentNeighbor = neighbor;
                if (hl.showMarker) {
                    draw(plot, neighbor);
                }
                if (plot.series[neighbor.seriesIndex].show && hl.showTooltip && (!c || !c._zoom.started)) {
                    showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
                }
                if (hl.bringSeriesToFront) {
                    plot.moveSeriesToFront(neighbor.seriesIndex);
                }
            }
            // check to see if we're highlighting the wrong point.
            else if (neighbor != null && hl.isHighlighting && hl.currentNeighbor != neighbor) {
                // highlighting the wrong point.

                // if new series allows highlighting, highlight new point.
                if (plot.series[neighbor.seriesIndex].showHighlight) {
                    var ctx = hl.highlightCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    hl.isHighlighting = true;
                    hl.currentNeighbor = neighbor;
                    if (hl.showMarker) {
                        draw(plot, neighbor);
                    }
                    if (plot.series[neighbor.seriesIndex].show && hl.showTooltip && (!c || !c._zoom.started)) {
                        showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
                    }
                    if (hl.bringSeriesToFront) {
                        plot.moveSeriesToFront(neighbor.seriesIndex);
                    }                    
                }                
            }
        }
    }
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(d){d.jqplot.eventListenerHooks.push(["jqplotMouseMove",f]);d.jqplot.Highlighter=function(h){this.show=d.jqplot.config.enablePlugins;this.markerRenderer=new d.jqplot.MarkerRenderer({shadow:false});this.showMarker=true;this.lineWidthAdjust=2.5;this.sizeAdjust=5;this.showTooltip=true;this.tooltipLocation="nw";this.fadeTooltip=true;this.tooltipFadeSpeed="fast";this.tooltipOffset=2;this.tooltipAxes="both";this.tooltipSeparator=", ";this.tooltipContentEditor=null;this.useAxesFormatters=true;this.tooltipFormatString="%.5P";this.formatString=null;this.yvalues=1;this.bringSeriesToFront=false;this._tooltipElem;this.isHighlighting=false;this.currentNeighbor=null;d.extend(true,this,h)};var b=["nw","n","ne","e","se","s","sw","w"];var e={nw:0,n:1,ne:2,e:3,se:4,s:5,sw:6,w:7};var c=["se","s","sw","w","nw","n","ne","e"];d.jqplot.Highlighter.init=function(k,j,i){var h=i||{};this.plugins.highlighter=new d.jqplot.Highlighter(h.highlighter)};d.jqplot.Highlighter.parseOptions=function(i,h){this.showHighlight=true};d.jqplot.Highlighter.postPlotDraw=function(){if(this.plugins.highlighter&&this.plugins.highlighter.highlightCanvas){this.plugins.highlighter.highlightCanvas.resetCanvas();this.plugins.highlighter.highlightCanvas=null}if(this.plugins.highlighter&&this.plugins.highlighter._tooltipElem){this.plugins.highlighter._tooltipElem.emptyForce();this.plugins.highlighter._tooltipElem=null}this.plugins.highlighter.highlightCanvas=new d.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding,"jqplot-highlight-canvas",this._plotDimensions,this));this.plugins.highlighter.highlightCanvas.setContext();var h=document.createElement("div");this.plugins.highlighter._tooltipElem=d(h);h=null;this.plugins.highlighter._tooltipElem.addClass("jqplot-highlighter-tooltip");this.plugins.highlighter._tooltipElem.css({position:"absolute",display:"none"});this.eventCanvas._elem.before(this.plugins.highlighter._tooltipElem)};d.jqplot.preInitHooks.push(d.jqplot.Highlighter.init);d.jqplot.preParseSeriesOptionsHooks.push(d.jqplot.Highlighter.parseOptions);d.jqplot.postDrawHooks.push(d.jqplot.Highlighter.postPlotDraw);function a(m,o){var j=m.plugins.highlighter;var p=m.series[o.seriesIndex];var h=p.markerRenderer;var i=j.markerRenderer;i.style=h.style;i.lineWidth=h.lineWidth+j.lineWidthAdjust;i.size=h.size+j.sizeAdjust;var l=d.jqplot.getColorComponents(h.color);var n=[l[0],l[1],l[2]];var k=(l[3]>=0.6)?l[3]*0.6:l[3]*(2-l[3]);i.color="rgba("+n[0]+","+n[1]+","+n[2]+","+k+")";i.init();i.draw(p.gridData[o.pointIndex][0],p.gridData[o.pointIndex][1],j.highlightCanvas._ctx)}function g(A,q,m){var k=A.plugins.highlighter;var D=k._tooltipElem;var r=q.highlighter||{};var t=d.extend(true,{},k,r);if(t.useAxesFormatters){var w=q._xaxis._ticks[0].formatter;var h=q._yaxis._ticks[0].formatter;var E=q._xaxis._ticks[0].formatString;var s=q._yaxis._ticks[0].formatString;var z;var u=w(E,m.data[0]);var l=[];for(var B=1;B<t.yvalues+1;B++){l.push(h(s,m.data[B]))}if(typeof t.formatString==="string"){switch(t.tooltipAxes){case"both":case"xy":l.unshift(u);l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break;case"yx":l.push(u);l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break;case"x":z=d.jqplot.sprintf.apply(d.jqplot.sprintf,[t.formatString,u]);break;case"y":l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break;default:l.unshift(u);l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break}}else{switch(t.tooltipAxes){case"both":case"xy":z=u;for(var B=0;B<l.length;B++){z+=t.tooltipSeparator+l[B]}break;case"yx":z="";for(var B=0;B<l.length;B++){z+=l[B]+t.tooltipSeparator}z+=u;break;case"x":z=u;break;case"y":z=l.join(t.tooltipSeparator);break;default:z=u;for(var B=0;B<l.length;B++){z+=t.tooltipSeparator+l[B]}break}}}else{var z;if(typeof t.formatString==="string"){z=d.jqplot.sprintf.apply(d.jqplot.sprintf,[t.formatString].concat(m.data))}else{if(t.tooltipAxes=="both"||t.tooltipAxes=="xy"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[0])+t.tooltipSeparator+d.jqplot.sprintf(t.tooltipFormatString,m.data[1])}else{if(t.tooltipAxes=="yx"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[1])+t.tooltipSeparator+d.jqplot.sprintf(t.tooltipFormatString,m.data[0])}else{if(t.tooltipAxes=="x"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[0])}else{if(t.tooltipAxes=="y"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[1])}}}}}}if(d.isFunction(t.tooltipContentEditor)){z=t.tooltipContentEditor(z,m.seriesIndex,m.pointIndex,A)}D.html(z);var C={x:m.gridData[0],y:m.gridData[1]};var v=0;var j=0.707;if(q.markerRenderer.show==true){v=(q.markerRenderer.size+t.sizeAdjust)/2}var o=b;if(q.fillToZero&&q.fill&&m.data[1]<0){o=c}switch(o[e[t.tooltipLocation]]){case"nw":var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-j*v;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-j*v;break;case"n":var p=C.x+A._gridPadding.left-D.outerWidth(true)/2;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-v;break;case"ne":var p=C.x+A._gridPadding.left+t.tooltipOffset+j*v;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-j*v;break;case"e":var p=C.x+A._gridPadding.left+t.tooltipOffset+v;var n=C.y+A._gridPadding.top-D.outerHeight(true)/2;break;case"se":var p=C.x+A._gridPadding.left+t.tooltipOffset+j*v;var n=C.y+A._gridPadding.top+t.tooltipOffset+j*v;break;case"s":var p=C.x+A._gridPadding.left-D.outerWidth(true)/2;var n=C.y+A._gridPadding.top+t.tooltipOffset+v;break;case"sw":var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-j*v;var n=C.y+A._gridPadding.top+t.tooltipOffset+j*v;break;case"w":var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-v;var n=C.y+A._gridPadding.top-D.outerHeight(true)/2;break;default:var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-j*v;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-j*v;break}D.css("left",p);D.css("top",n);if(t.fadeTooltip){D.stop(true,true).fadeIn(t.tooltipFadeSpeed)}else{D.show()}D=null}function f(n,j,i,p,l){var h=l.plugins.highlighter;var m=l.plugins.cursor;if(h.show){if(p==null&&h.isHighlighting){var o=jQuery.Event("jqplotHighlighterUnhighlight");l.target.trigger(o);var q=h.highlightCanvas._ctx;q.clearRect(0,0,q.canvas.width,q.canvas.height);if(h.fadeTooltip){h._tooltipElem.fadeOut(h.tooltipFadeSpeed)}else{h._tooltipElem.hide()}if(h.bringSeriesToFront){l.restorePreviousSeriesOrder()}h.isHighlighting=false;h.currentNeighbor=null;q=null}else{if(p!=null&&l.series[p.seriesIndex].showHighlight&&!h.isHighlighting){var o=jQuery.Event("jqplotHighlighterHighlight");o.which=n.which;o.pageX=n.pageX;o.pageY=n.pageY;var k=[p.seriesIndex,p.pointIndex,p.data,l];l.target.trigger(o,k);h.isHighlighting=true;h.currentNeighbor=p;if(h.showMarker){a(l,p)}if(l.series[p.seriesIndex].show&&h.showTooltip&&(!m||!m._zoom.started)){g(l,l.series[p.seriesIndex],p)}if(h.bringSeriesToFront){l.moveSeriesToFront(p.seriesIndex)}}else{if(p!=null&&h.isHighlighting&&h.currentNeighbor!=p){if(l.series[p.seriesIndex].showHighlight){var q=h.highlightCanvas._ctx;q.clearRect(0,0,q.canvas.width,q.canvas.height);h.isHighlighting=true;h.currentNeighbor=p;if(h.showMarker){a(l,p)}if(l.series[p.seriesIndex].show&&h.showTooltip&&(!m||!m._zoom.started)){g(l,l.series[p.seriesIndex],p)}if(h.bringSeriesToFront){l.moveSeriesToFront(p.seriesIndex)}}}}}}}})(jQuery);
/*
    2010-11-01 Chris Leonello
    
    Slightly modified version of the original json2.js to put JSON
    functions under the $.jqplot namespace.
    
    licensing and orignal comments follow:
    
    http://www.JSON.org/json2.js
    2010-08-25
    
    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        $.jqplot.JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            $.jqplot.JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = $.jqplot.JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = $.jqplot.JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = $.jqplot.JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        $.jqplot.JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = $.jqplot.JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = $.jqplot.JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

(function($) {

    $.jqplot.JSON = window.JSON;

    if (!window.JSON) {
        $.jqplot.JSON = {};
    }
    
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof $.jqplot.JSON.stringify !== 'function') {
        $.jqplot.JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('$.jqplot.JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof $.jqplot.JSON.parse !== 'function') {
        $.jqplot.JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('$.jqplot.JSON.parse');
        };
    }
})(jQuery);

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function($){$.jqplot.JSON=window.JSON;if(!window.JSON){$.jqplot.JSON={}}function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof $.jqplot.JSON.stringify!=="function"){$.jqplot.JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("$.jqplot.JSON.stringify")}return str("",{"":value})}}if(typeof $.jqplot.JSON.parse!=="function"){$.jqplot.JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("$.jqplot.JSON.parse")}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
    *  class: $.jqplot.LogAxisRenderer
    *  A plugin for a jqPlot to render a logarithmic axis.
    * 
    *  To use this renderer, include the plugin in your source
    *  > <script type="text/javascript" language="javascript" src="plugins/jqplot.logAxisRenderer.js"></script>
    *  
    *  and supply the appropriate options to your plot
    *  
    *  > {axes:{xaxis:{renderer:$.jqplot.LogAxisRenderer}}}
    **/ 
    $.jqplot.LogAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
        // prop: axisDefaults
        // Default properties which will be applied directly to the series.
        //
        // Group: Properties
        //
        // Properties
        //
        // base - the logarithmic base, commonly 2, 10 or Math.E
        // tickDistribution - Deprecated.  "power" distribution of ticks
        // always used.  Option has no effect.
        this.axisDefaults = {
            base : 10,
            tickDistribution :'power'
        };
    };
    
    $.jqplot.LogAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.LogAxisRenderer.prototype.constructor = $.jqplot.LogAxisRenderer;
    
    $.jqplot.LogAxisRenderer.prototype.init = function(options) {
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = true;
        // prop: minorTicks
        // Number of ticks to add between "major" ticks.
        // Major ticks are ticks supplied by user or auto computed.
        // Minor ticks cannot be created by user.
        this.minorTicks = 'auto';
        this._scalefact = 1.0;

        $.extend(true, this, options);

        this._autoFormatString = '%d';
        this._overrideFormatString = false;

        for (var d in this.renderer.axisDefaults) {
            if (this[d] == null) {
                this[d] = this.renderer.axisDefaults[d];
            }
        }

        this.resetDataBounds();
    };
    
    $.jqplot.LogAxisRenderer.prototype.createTicks = function(plot) {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        var db = this._dataBounds;
        var dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;
        var interval;
        var min, max;
        var pos1, pos2;
        var tt, i;

        var threshold = 30;
        // For some reason scalefactor is screwing up ticks.
        this._scalefact =  (Math.max(dim, threshold+1) - threshold)/300;

        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if (ut.constructor == Array) {
                    t.value = ut[0];
                    t.label = ut[1];
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(ut[0], this.name);
                    this._ticks.push(t);
                }

                else if ($.isPlainObject(ut)) {
                    $.extend(true, t, ut);
                    t.axis = this.name;
                    this._ticks.push(t);
                }
                
                else {
                    t.value = ut;
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(ut, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
        }
        
        // we don't have any ticks yet, let's make some!
        else if (this.min == null && this.max == null) {
            min = db.min * (2 - this.padMin);
            max = db.max * this.padMax;
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 0.05;
                min = min*(1-adj);
                max = max*(1+adj);
            }
            
            // perform some checks
            if (this.min != null && this.min <= 0) {
                throw new Error("Log axis minimum must be greater than 0");
            }
            if (this.max != null && this.max <= 0) {
                throw new Error("Log axis maximum must be greater than 0");
            }

            function findCeil (val) {
                var order = Math.pow(10, Math.floor(Math.log(val)/Math.LN10));
                return Math.ceil(val/order) * order;
            }

            function findFloor(val) {
                var order = Math.pow(10, Math.floor(Math.log(val)/Math.LN10));
                return Math.floor(val/order) * order;
            }

            // var range = max - min;
            var rmin, rmax;

            // for power distribution, open up range to get a nice power of axis.renderer.base.
            // power distribution won't respect the user's min/max settings.
            rmin = Math.pow(this.base, Math.floor(Math.log(min)/Math.log(this.base)));
            rmax = Math.pow(this.base, Math.ceil(Math.log(max)/Math.log(this.base)));

            // // if min and max are same, space them out a bit
            // if (rmin === rmax) {
            //     var adj = 0.05;
            //     rmin = rmin*(1-adj);
            //     rmax = rmax*(1+adj);
            // }

            // Handle case where a data value was zero
            if (rmin === 0) {
              rmin = 1;
            }

            var order = Math.round(Math.log(rmin)/Math.LN10);

            if (this.tickOptions == null || !this.tickOptions.formatString) {
                this._overrideFormatString = true;
            }

            this.min = rmin;
            this.max = rmax;
            var range = this.max - this.min;            

            var minorTicks = (this.minorTicks === 'auto') ? 0 : this.minorTicks;
            var numberTicks;
            if (this.numberTicks == null){
                if (dim > 140) {
                    numberTicks = Math.round(Math.log(this.max/this.min)/Math.log(this.base) + 1);
                    if (numberTicks < 2) {
                        numberTicks = 2;
                    }
                    if (minorTicks === 0) {
                        var temp = dim/(numberTicks - 1);
                        if (temp < 100) {
                            minorTicks = 0;
                        }
                        else if (temp < 190) {
                            minorTicks = 1;
                        }
                        else if (temp < 250) {
                            minorTicks = 3;
                        }
                        else if (temp < 600) {
                            minorTicks = 4;
                        }
                        else {
                            minorTicks = 9;
                        }
                    }
                }
                else {
                    numberTicks = 2;
                    if (minorTicks === 0) {
                        minorTicks = 1;
                    }
                    minorTicks = 0;
                }
            }
            else {
                numberTicks = this.numberTicks;
            }

            if (order >= 0 && minorTicks !== 3) {
                this._autoFormatString = '%d';
            }
            // Adjust format string for case with 3 ticks where we'll have like 1, 2.5, 5, 7.5, 10
            else if (order <= 0 && minorTicks === 3) {
                var temp = -(order - 1);
                this._autoFormatString = '%.'+ Math.abs(order-1) + 'f';
            }

            // Adjust format string for values less than 1.
            else if (order < 0) {
                var temp = -order;
                this._autoFormatString = '%.'+ Math.abs(order) + 'f';
            }

            else {
                this._autoFormatString = '%d';
            }

            var to, t, val, tt1, spread, interval;
            for (var i=0; i<numberTicks; i++){
                tt = Math.pow(this.base, i - numberTicks + 1) * this.max;

                t = new this.tickRenderer(this.tickOptions);
            
                if (this._overrideFormatString) {
                    t.formatString = this._autoFormatString;
                }
                
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) {
                    t.showMark = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);

                if (minorTicks && i<numberTicks-1) {
                    tt1 = Math.pow(this.base, i - numberTicks + 2) * this.max;
                    spread = tt1 - tt;
                    interval = tt1 / (minorTicks+1);
                    for (var j=minorTicks-1; j>=0; j--) {
                        val = tt1-interval*(j+1);
                        t = new this.tickRenderer(this.tickOptions);
            
                        if (this._overrideFormatString && this._autoFormatString != '') {
                            t.formatString = this._autoFormatString;
                        }
                        if (!this.showTicks) {
                            t.showLabel = false;
                            t.showMark = false;
                        }
                        else if (!this.showTickMarks) {
                            t.showMark = false;
                        }
                        t.setTick(val, this.name);
                        this._ticks.push(t);
                    }
                }       
            }     
        }

        // min and max are set as would be the case with zooming
        else if (this.min != null && this.max != null) {
            var opts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});
            var nt, ti;
            // don't have an interval yet, pick one that gives the most
            // "round" ticks we can get.
            if (this.numberTicks == null && this.tickInterval == null) {
                // var threshold = 30;
                var tdim = Math.max(dim, threshold+1);
                var nttarget =  Math.ceil((tdim-threshold)/35 + 1);

                var ret = $.jqplot.LinearTickGenerator.bestConstrainedInterval(this.min, this.max, nttarget);

                this._autoFormatString = ret[3];
                nt = ret[2];
                ti = ret[4];

                for (var i=0; i<nt; i++) {
                    opts.value = this.min + i * ti;
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }
            }

            // for loose zoom, number ticks and interval are also set.
            else if (this.numberTicks != null && this.tickInterval != null) {
                nt = this.numberTicks;
                for (var i=0; i<nt; i++) {
                    opts.value = this.min + i * this.tickInterval;
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }
            }
        }
    };
    
    $.jqplot.LogAxisRenderer.prototype.pack = function(pos, offsets) {
        var lb = parseInt(this.base, 10);
        var ticks = this._ticks;
        var trans = function (v) { return Math.log(v)/Math.log(lb); };
        var invtrans = function (v) { return Math.pow(Math.E, (Math.log(lb)*v)); };
        var max = trans(this.max);
        var min = trans(this.min);
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        
        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner.
        this.p2u = function(p){
            return invtrans((p - offmin) * unitlength / pixellength + min);
        };
        
        this.u2p = function(u){
            return (trans(u) - min) * pixellength / unitlength + offmin;
        };
        
        if (this.name == 'xaxis' || this.name == 'x2axis'){
            this.series_u2p = function(u){
                return (trans(u) - min) * pixellength / unitlength;
            };
            this.series_p2u = function(p){
                return invtrans(p * unitlength / pixellength + min);
            };
        }
        // yaxis is max at top of canvas.
        else {
            this.series_u2p = function(u){
                return (trans(u) - max) * pixellength / unitlength;
            };
            this.series_p2u = function(p){
                return invtrans(p * unitlength / pixellength + max);
            };
        }
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'end':
                                    shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                case 'start':
                                    shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    break;
                                case 'middle':
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        // var shim = t.getWidth()/2;
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                    }
                    else {
                        this._label._elem.css('top', '0px');
                    }
                    this._label.pack();
                }
            }
            else {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    // if (t.angle > 0) {
                                    //     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    // }
                                    // else {
                                    //     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    // }
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                    }
                    else {
                        this._label._elem.css('right', '0px');
                    }   
                    this._label.pack();
                }
            }
        }        
    };
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.LogAxisRenderer=function(){a.jqplot.LinearAxisRenderer.call(this);this.axisDefaults={base:10,tickDistribution:"power"}};a.jqplot.LogAxisRenderer.prototype=new a.jqplot.LinearAxisRenderer();a.jqplot.LogAxisRenderer.prototype.constructor=a.jqplot.LogAxisRenderer;a.jqplot.LogAxisRenderer.prototype.init=function(b){this.drawBaseline=true;this.minorTicks="auto";this._scalefact=1;a.extend(true,this,b);this._autoFormatString="%d";this._overrideFormatString=false;for(var c in this.renderer.axisDefaults){if(this[c]==null){this[c]=this.renderer.axisDefaults[c]}}this.resetDataBounds()};a.jqplot.LogAxisRenderer.prototype.createTicks=function(d){var G=this._ticks;var w=this.ticks;var s=this.name;var u=this._dataBounds;var b=(this.name.charAt(0)==="x")?this._plotDimensions.width:this._plotDimensions.height;var k;var N,v;var m,l;var M,K;var g=30;this._scalefact=(Math.max(b,g+1)-g)/300;if(w.length){for(K=0;K<w.length;K++){var A=w[K];var H=new this.tickRenderer(this.tickOptions);if(A.constructor==Array){H.value=A[0];H.label=A[1];if(!this.showTicks){H.showLabel=false;H.showMark=false}else{if(!this.showTickMarks){H.showMark=false}}H.setTick(A[0],this.name);this._ticks.push(H)}else{if(a.isPlainObject(A)){a.extend(true,H,A);H.axis=this.name;this._ticks.push(H)}else{H.value=A;if(!this.showTicks){H.showLabel=false;H.showMark=false}else{if(!this.showTickMarks){H.showMark=false}}H.setTick(A,this.name);this._ticks.push(H)}}}this.numberTicks=w.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value}else{if(this.min==null&&this.max==null){N=u.min*(2-this.padMin);v=u.max*this.padMax;if(N==v){var c=0.05;N=N*(1-c);v=v*(1+c)}if(this.min!=null&&this.min<=0){throw new Error("Log axis minimum must be greater than 0")}if(this.max!=null&&this.max<=0){throw new Error("Log axis maximum must be greater than 0")}function f(j){var i=Math.pow(10,Math.floor(Math.log(j)/Math.LN10));return Math.ceil(j/i)*i}function x(j){var i=Math.pow(10,Math.floor(Math.log(j)/Math.LN10));return Math.floor(j/i)*i}var F,r;F=Math.pow(this.base,Math.floor(Math.log(N)/Math.log(this.base)));r=Math.pow(this.base,Math.ceil(Math.log(v)/Math.log(this.base)));if(F===0){F=1}var E=Math.round(Math.log(F)/Math.LN10);if(this.tickOptions==null||!this.tickOptions.formatString){this._overrideFormatString=true}this.min=F;this.max=r;var q=this.max-this.min;var C=(this.minorTicks==="auto")?0:this.minorTicks;var h;if(this.numberTicks==null){if(b>140){h=Math.round(Math.log(this.max/this.min)/Math.log(this.base)+1);if(h<2){h=2}if(C===0){var o=b/(h-1);if(o<100){C=0}else{if(o<190){C=1}else{if(o<250){C=3}else{if(o<600){C=4}else{C=9}}}}}}else{h=2;if(C===0){C=1}C=0}}else{h=this.numberTicks}if(E>=0&&C!==3){this._autoFormatString="%d"}else{if(E<=0&&C===3){var o=-(E-1);this._autoFormatString="%."+Math.abs(E-1)+"f"}else{if(E<0){var o=-E;this._autoFormatString="%."+Math.abs(E)+"f"}else{this._autoFormatString="%d"}}}var O,H,z,p,n,k;for(var K=0;K<h;K++){M=Math.pow(this.base,K-h+1)*this.max;H=new this.tickRenderer(this.tickOptions);if(this._overrideFormatString){H.formatString=this._autoFormatString}if(!this.showTicks){H.showLabel=false;H.showMark=false}else{if(!this.showTickMarks){H.showMark=false}}H.setTick(M,this.name);this._ticks.push(H);if(C&&K<h-1){p=Math.pow(this.base,K-h+2)*this.max;n=p-M;k=p/(C+1);for(var J=C-1;J>=0;J--){z=p-k*(J+1);H=new this.tickRenderer(this.tickOptions);if(this._overrideFormatString&&this._autoFormatString!=""){H.formatString=this._autoFormatString}if(!this.showTicks){H.showLabel=false;H.showMark=false}else{if(!this.showTickMarks){H.showMark=false}}H.setTick(z,this.name);this._ticks.push(H)}}}}else{if(this.min!=null&&this.max!=null){var y=a.extend(true,{},this.tickOptions,{name:this.name,value:null});var I,e;if(this.numberTicks==null&&this.tickInterval==null){var D=Math.max(b,g+1);var L=Math.ceil((D-g)/35+1);var B=a.jqplot.LinearTickGenerator.bestConstrainedInterval(this.min,this.max,L);this._autoFormatString=B[3];I=B[2];e=B[4];for(var K=0;K<I;K++){y.value=this.min+K*e;H=new this.tickRenderer(y);if(this._overrideFormatString&&this._autoFormatString!=""){H.formatString=this._autoFormatString}if(!this.showTicks){H.showLabel=false;H.showMark=false}else{if(!this.showTickMarks){H.showMark=false}}this._ticks.push(H)}}else{if(this.numberTicks!=null&&this.tickInterval!=null){I=this.numberTicks;for(var K=0;K<I;K++){y.value=this.min+K*this.tickInterval;H=new this.tickRenderer(y);if(this._overrideFormatString&&this._autoFormatString!=""){H.formatString=this._autoFormatString}if(!this.showTicks){H.showLabel=false;H.showMark=false}else{if(!this.showTickMarks){H.showMark=false}}this._ticks.push(H)}}}}}}};a.jqplot.LogAxisRenderer.prototype.pack=function(f,e){var r=parseInt(this.base,10);var y=this._ticks;var d=function(h){return Math.log(h)/Math.log(r)};var b=function(h){return Math.pow(Math.E,(Math.log(r)*h))};var u=d(this.max);var s=d(this.min);var m=e.max;var k=e.min;var o=(this._label==null)?false:this._label.show;for(var q in f){this._elem.css(q,f[q])}this._offsets=e;var g=m-k;var j=u-s;this.p2u=function(h){return b((h-k)*j/g+s)};this.u2p=function(h){return(d(h)-s)*g/j+k};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(h){return(d(h)-s)*g/j};this.series_p2u=function(h){return b(h*j/g+s)}}else{this.series_u2p=function(h){return(d(h)-u)*g/j};this.series_p2u=function(h){return b(h*j/g+u)}}if(this.show){if(this.name=="xaxis"||this.name=="x2axis"){for(var v=0;v<y.length;v++){var n=y[v];if(n.show&&n.showLabel){var c;if(n.constructor==a.jqplot.CanvasAxisTickRenderer&&n.angle){switch(n.labelPosition){case"auto":if(n.angle<0){c=-n.getWidth()+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2}else{c=-n._textRenderer.height*Math.sin(n._textRenderer.angle)/2}break;case"end":c=-n.getWidth()+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2;break;case"start":c=-n._textRenderer.height*Math.sin(n._textRenderer.angle)/2;break;case"middle":c=-n.getWidth()/2+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2;break;default:c=-n.getWidth()/2+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2;break}}else{c=-n.getWidth()/2}var z=this.u2p(n.value)+c+"px";n._elem.css("left",z);n.pack()}}if(o){var l=this._label._elem.outerWidth(true);this._label._elem.css("left",k+g/2-l/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px")}else{this._label._elem.css("top","0px")}this._label.pack()}}else{for(var v=0;v<y.length;v++){var n=y[v];if(n.show&&n.showLabel){var c;if(n.constructor==a.jqplot.CanvasAxisTickRenderer&&n.angle){switch(n.labelPosition){case"auto":case"end":if(n.angle<0){c=-n._textRenderer.height*Math.cos(-n._textRenderer.angle)/2}else{c=-n.getHeight()+n._textRenderer.height*Math.cos(n._textRenderer.angle)/2}break;case"start":if(n.angle>0){c=-n._textRenderer.height*Math.cos(-n._textRenderer.angle)/2}else{c=-n.getHeight()+n._textRenderer.height*Math.cos(n._textRenderer.angle)/2}break;case"middle":c=-n.getHeight()/2;break;default:c=-n.getHeight()/2;break}}else{c=-n.getHeight()/2}var z=this.u2p(n.value)+c+"px";n._elem.css("top",z);n.pack()}}if(o){var x=this._label._elem.outerHeight(true);this._label._elem.css("top",m-g/2-x/2+"px");if(this.name=="yaxis"){this._label._elem.css("left","0px")}else{this._label._elem.css("right","0px")}this._label.pack()}}}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    // class: $.jqplot.MekkoAxisRenderer
    // An axis renderer for a Mekko chart.
    // Should be used with a Mekko chart where the mekkoRenderer is used on the series.
    // Displays the Y axis as a range from 0 to 1 (0 to 100%) and the x axis with a tick
    // for each series scaled to the sum of all the y values.
    $.jqplot.MekkoAxisRenderer = function() {
    };
    
    // called with scope of axis object.
    $.jqplot.MekkoAxisRenderer.prototype.init = function(options){
        // prop: tickMode
        // How to space the ticks on the axis.
        // 'bar' will place a tick at the width of each bar.  
        // This is the default for the x axis.
        // 'even' will place ticks at even intervals.  This is
        // the default for x2 axis and y axis.  y axis cannot be changed.
        this.tickMode;
        // prop: barLabelRenderer
        // renderer to use to draw labels under each bar.
        this.barLabelRenderer = $.jqplot.AxisLabelRenderer;
        // prop: barLabels
        // array of labels to put under each bar.
        this.barLabels = this.barLabels || [];
        // prop: barLabelOptions
        // options object to pass to the bar label renderer.
        this.barLabelOptions = {};
        this.tickOptions = $.extend(true, {showGridline:false}, this.tickOptions);
        this._barLabels = [];
        $.extend(true, this, options);
        if (this.name == 'yaxis') {
            this.tickOptions.formatString = this.tickOptions.formatString || "%d\%";
        }
        var db = this._dataBounds;
        db.min = 0;
        // for y axes, scale always go from 0 to 1 (0 to 100%)
        if (this.name == 'yaxis' || this.name == 'y2axis') {
            db.max = 100;
            this.tickMode = 'even';
        }
        // For x axes, scale goes from 0 to sum of all y values.
        else if (this.name == 'xaxis'){
            this.tickMode = (this.tickMode == null) ? 'bar' : this.tickMode;
            for (var i=0; i<this._series.length; i++) {
                db.max += this._series[i]._sumy;
            }
        }
        else if (this.name == 'x2axis'){
            this.tickMode = (this.tickMode == null) ? 'even' : this.tickMode;
            for (var i=0; i<this._series.length; i++) {
                db.max += this._series[i]._sumy;
            }
        }
    };
    
    // called with scope of axis
    $.jqplot.MekkoAxisRenderer.prototype.draw = function(ctx, plot) {
        if (this.show) {
            // populate the axis label and value properties.
            // createTicks is a method on the renderer, but
            // call it within the scope of the axis.
            this.renderer.createTicks.call(this);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get its bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            
            var elem = document.createElement('div');
            this._elem = $(elem);
            this._elem.addClass('jqplot-axis jqplot-'+this.name);
            this._elem.css('position', 'absolute');
            elem = null;
            
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                this._elem.width(this._plotDimensions.width);
            }
            else {
                this._elem.height(this._plotDimensions.height);
            }
            
            // draw the axis label
            // create a _label object.
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                this._elem.append(this._label.draw(ctx));
            }
            
            var t, tick, elem;
            if (this.showTicks) {
                t = this._ticks;
                for (var i=0; i<t.length; i++) {
                    tick = t[i];
                    if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                        this._elem.append(tick.draw(ctx));
                    }
                }
            }
            
            // draw the series labels
            for (i=0; i<this.barLabels.length; i++) {
                this.barLabelOptions.axis = this.name;
                this.barLabelOptions.label = this.barLabels[i];
                this._barLabels.push(new this.barLabelRenderer(this.barLabelOptions));
                if (this.tickMode != 'bar') {
                    this._barLabels[i].show = false;
                }
                if (this._barLabels[i].show) {
                    var elem = this._barLabels[i].draw(ctx, plot);
                    elem.removeClass('jqplot-'+this.name+'-label');
                    elem.addClass('jqplot-'+this.name+'-tick');
                    elem.addClass('jqplot-mekko-barLabel');
                    elem.appendTo(this._elem);
                    elem = null;
                }   
            }
            
        }
        return this._elem;
    };
    
    // called with scope of an axis
    $.jqplot.MekkoAxisRenderer.prototype.reset = function() {
        this.min = this._min;
        this.max = this._max;
        this.tickInterval = this._tickInterval;
        this.numberTicks = this._numberTicks;
        // this._ticks = this.__ticks;
    };
    
    // called with scope of axis
    $.jqplot.MekkoAxisRenderer.prototype.set = function() { 
        var dim = 0;
        var temp;
        var w = 0;
        var h = 0;
        var lshow = (this._label == null) ? false : this._label.show;
        if (this.show && this.showTicks) {
            var t = this._ticks;
            for (var i=0; i<t.length; i++) {
                var tick = t[i];
                if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        temp = tick._elem.outerHeight(true);
                    }
                    else {
                        temp = tick._elem.outerWidth(true);
                    }
                    if (temp > dim) {
                        dim = temp;
                    }
                }
            }
            
            if (lshow) {
                w = this._label._elem.outerWidth(true);
                h = this._label._elem.outerHeight(true); 
            }
            if (this.name == 'xaxis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            }
            else if (this.name == 'x2axis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            }
            else if (this.name == 'yaxis') {
                dim = dim + w;
                this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
            else {
                dim = dim + w;
                this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
        }  
    };    
    
    // called with scope of axis
    $.jqplot.MekkoAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var t, tt, i, j;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if (ut.constructor == Array) {
                    t.value = ut[0];
                    t.label = ut[1];
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(ut[0], this.name);
                    this._ticks.push(t);
                }
                
                else {
                    t.value = ut;
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(ut, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);
        }
        
        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
        
            min = (this.min != null) ? this.min : db.min;
            max = (this.max != null) ? this.max : db.max;
            
            // if min and max are same, space them out a bit.+
            if (min == max) {
                var adj = 0.05;
                if (min > 0) {
                    adj = Math.max(Math.log(min)/Math.LN10, 0.05);
                }
                min -= adj;
                max += adj;
            }

            var range = max - min;
            var rmin, rmax;
            var temp, prev, curr;
            var ynumticks = [3,5,6,11,21];
            
            // yaxis divide ticks in nice intervals from 0 to 1.
            if (this.name == 'yaxis' || this.name == 'y2axis') { 
                this.min = 0;
                this.max = 100; 
                // user didn't specify number of ticks.
                if (!this.numberTicks){
                    if (this.tickInterval) {
                        this.numberTicks = 3 + Math.ceil(range / this.tickInterval);
                    }
                    else {
                        temp = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                        for (i=0; i<ynumticks.length; i++) {
                            curr = temp/ynumticks[i];
                            if (curr == 1) {
                                this.numberTicks = ynumticks[i];
                                break;
                            }
                            else if (curr > 1) {
                                prev = curr;
                                continue;
                            }
                            else if (curr < 1) {
                                // was prev or is curr closer to one?
                                if (Math.abs(prev - 1) < Math.abs(curr - 1)) {
                                    this.numberTicks = ynumticks[i-1];
                                    break;
                                }
                                else {
                                    this.numberTicks = ynumticks[i];
                                    break;
                                }
                            }
                            else if (i == ynumticks.length -1) {
                                this.numberTicks = ynumticks[i];
                            }
                        }
                        this.tickInterval = range / (this.numberTicks - 1);
                    }
                }
                
                // user did specify number of ticks.
                else {
                    this.tickInterval = range / (this.numberTicks - 1);
                }

                for (var i=0; i<this.numberTicks; i++){
                    tt = this.min + i * this.tickInterval;
                    t = new this.tickRenderer(this.tickOptions);
                    // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(tt, this.name);
                    this._ticks.push(t);
                }
            }
            
            // for x axes, have number ot ticks equal to number of series and ticks placed
            // at sum of y values for each series.
            else if (this.tickMode == 'bar') {
                this.min = 0;
                this.numberTicks = this._series.length + 1;
                t = new this.tickRenderer(this.tickOptions);
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) {
                    t.showMark = false;
                }
                t.setTick(0, this.name);
                this._ticks.push(t);
                
                temp = 0;

                for (i=1; i<this.numberTicks; i++){
                    temp += this._series[i-1]._sumy;
                    t = new this.tickRenderer(this.tickOptions);
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(temp, this.name);
                    this._ticks.push(t);
                }
                this.max = this.max || temp;
                
                // if user specified a max and it is greater than sum, add a tick
                if (this.max > temp) {
                     t = new this.tickRenderer(this.tickOptions);
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(this.max, this.name);
                    this._ticks.push(t);
                    
                }
            }
            
            else if (this.tickMode == 'even') {
                this.min = 0;
                this.max = this.max || db.max;
                // get a desired number of ticks
                var nt = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                range = this.max - this.min;
                this.numberTicks = nt;
                this.tickInterval = range / (this.numberTicks - 1);

                for (i=0; i<this.numberTicks; i++){
                    tt = this.min + i * this.tickInterval;
                    t = new this.tickRenderer(this.tickOptions);
                    // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(tt, this.name);
                    this._ticks.push(t);
                }
                
            }
        }
    };
    
    // called with scope of axis
    $.jqplot.MekkoAxisRenderer.prototype.pack = function(pos, offsets) {
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        
        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner.
        this.p2u = function(p){
            return (p - offmin) * unitlength / pixellength + min;
        };
        
        this.u2p = function(u){
            return (u - min) * pixellength / unitlength + offmin;
        };
                
        if (this.name == 'xaxis' || this.name == 'x2axis'){
            this.series_u2p = function(u){
                return (u - min) * pixellength / unitlength;
            };
            this.series_p2u = function(p){
                return p * unitlength / pixellength + min;
            };
        }
        
        else {
            this.series_u2p = function(u){
                return (u - max) * pixellength / unitlength;
            };
            this.series_p2u = function(p){
                return p * unitlength / pixellength + max;
            };
        }
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'xaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (temp * t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'end':
                                    shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                case 'start':
                                    shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    break;
                                case 'middle':
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                var w;
                if (lshow) {
                    w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                    }
                    else {
                        this._label._elem.css('top', '0px');
                    }
                    this._label.pack();
                }
                // now show the labels under the bars.
                var b, l, r;
                for (var i=0; i<this.barLabels.length; i++) {
                    b = this._barLabels[i];
                    if (b.show) {
                        w = b.getWidth();
                        l = this._ticks[i].getLeft() + this._ticks[i].getWidth();
                        r = this._ticks[i+1].getLeft();
                        b._elem.css('left', (r+l-w)/2+'px');
                        b._elem.css('top', this._ticks[i]._elem.css('top'));
                        b.pack();
                    }
                }
            }
            else {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'yaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (temp * t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                    }
                    else {
                        this._label._elem.css('right', '0px');
                    }   
                    this._label.pack();
                }
            }
        }
    };
})(jQuery);

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.MekkoAxisRenderer=function(){};a.jqplot.MekkoAxisRenderer.prototype.init=function(c){this.tickMode;this.barLabelRenderer=a.jqplot.AxisLabelRenderer;this.barLabels=this.barLabels||[];this.barLabelOptions={};this.tickOptions=a.extend(true,{showGridline:false},this.tickOptions);this._barLabels=[];a.extend(true,this,c);if(this.name=="yaxis"){this.tickOptions.formatString=this.tickOptions.formatString||"%d%"}var b=this._dataBounds;b.min=0;if(this.name=="yaxis"||this.name=="y2axis"){b.max=100;this.tickMode="even"}else{if(this.name=="xaxis"){this.tickMode=(this.tickMode==null)?"bar":this.tickMode;for(var d=0;d<this._series.length;d++){b.max+=this._series[d]._sumy}}else{if(this.name=="x2axis"){this.tickMode=(this.tickMode==null)?"even":this.tickMode;for(var d=0;d<this._series.length;d++){b.max+=this._series[d]._sumy}}}}};a.jqplot.MekkoAxisRenderer.prototype.draw=function(b,j){if(this.show){this.renderer.createTicks.call(this);var h=0;var c;var g=document.createElement("div");this._elem=a(g);this._elem.addClass("jqplot-axis jqplot-"+this.name);this._elem.css("position","absolute");g=null;if(this.name=="xaxis"||this.name=="x2axis"){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){this._elem.append(this._label.draw(b))}var f,e,g;if(this.showTicks){f=this._ticks;for(var d=0;d<f.length;d++){e=f[d];if(e.showLabel&&(!e.isMinorTick||this.showMinorTicks)){this._elem.append(e.draw(b))}}}for(d=0;d<this.barLabels.length;d++){this.barLabelOptions.axis=this.name;this.barLabelOptions.label=this.barLabels[d];this._barLabels.push(new this.barLabelRenderer(this.barLabelOptions));if(this.tickMode!="bar"){this._barLabels[d].show=false}if(this._barLabels[d].show){var g=this._barLabels[d].draw(b,j);g.removeClass("jqplot-"+this.name+"-label");g.addClass("jqplot-"+this.name+"-tick");g.addClass("jqplot-mekko-barLabel");g.appendTo(this._elem);g=null}}}return this._elem};a.jqplot.MekkoAxisRenderer.prototype.reset=function(){this.min=this._min;this.max=this._max;this.tickInterval=this._tickInterval;this.numberTicks=this._numberTicks};a.jqplot.MekkoAxisRenderer.prototype.set=function(){var k=0;var d;var c=0;var j=0;var b=(this._label==null)?false:this._label.show;if(this.show&&this.showTicks){var g=this._ticks;for(var f=0;f<g.length;f++){var e=g[f];if(e.showLabel&&(!e.isMinorTick||this.showMinorTicks)){if(this.name=="xaxis"||this.name=="x2axis"){d=e._elem.outerHeight(true)}else{d=e._elem.outerWidth(true)}if(d>k){k=d}}}if(b){c=this._label._elem.outerWidth(true);j=this._label._elem.outerHeight(true)}if(this.name=="xaxis"){k=k+j;this._elem.css({height:k+"px",left:"0px",bottom:"0px"})}else{if(this.name=="x2axis"){k=k+j;this._elem.css({height:k+"px",left:"0px",top:"0px"})}else{if(this.name=="yaxis"){k=k+c;this._elem.css({width:k+"px",left:"0px",top:"0px"});if(b&&this._label.constructor==a.jqplot.AxisLabelRenderer){this._label._elem.css("width",c+"px")}}else{k=k+c;this._elem.css({width:k+"px",right:"0px",top:"0px"});if(b&&this._label.constructor==a.jqplot.AxisLabelRenderer){this._label._elem.css("width",c+"px")}}}}}};a.jqplot.MekkoAxisRenderer.prototype.createTicks=function(){var z=this._ticks;var w=this.ticks;var B=this.name;var y=this._dataBounds;var p,x;var n,r;var d,c;var h,b,s,q;if(w.length){for(s=0;s<w.length;s++){var e=w[s];var h=new this.tickRenderer(this.tickOptions);if(e.constructor==Array){h.value=e[0];h.label=e[1];if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(e[0],this.name);this._ticks.push(h)}else{h.value=e;if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(e,this.name);this._ticks.push(h)}}this.numberTicks=w.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value;this.tickInterval=(this.max-this.min)/(this.numberTicks-1)}else{if(B=="xaxis"||B=="x2axis"){p=this._plotDimensions.width}else{p=this._plotDimensions.height}if(this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null}n=(this.min!=null)?this.min:y.min;r=(this.max!=null)?this.max:y.max;if(n==r){var g=0.05;if(n>0){g=Math.max(Math.log(n)/Math.LN10,0.05)}n-=g;r+=g}var k=r-n;var m,o;var v,l,u;var f=[3,5,6,11,21];if(this.name=="yaxis"||this.name=="y2axis"){this.min=0;this.max=100;if(!this.numberTicks){if(this.tickInterval){this.numberTicks=3+Math.ceil(k/this.tickInterval)}else{v=2+Math.ceil((p-(this.tickSpacing-1))/this.tickSpacing);for(s=0;s<f.length;s++){u=v/f[s];if(u==1){this.numberTicks=f[s];break}else{if(u>1){l=u;continue}else{if(u<1){if(Math.abs(l-1)<Math.abs(u-1)){this.numberTicks=f[s-1];break}else{this.numberTicks=f[s];break}}else{if(s==f.length-1){this.numberTicks=f[s]}}}}}this.tickInterval=k/(this.numberTicks-1)}}else{this.tickInterval=k/(this.numberTicks-1)}for(var s=0;s<this.numberTicks;s++){b=this.min+s*this.tickInterval;h=new this.tickRenderer(this.tickOptions);if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(b,this.name);this._ticks.push(h)}}else{if(this.tickMode=="bar"){this.min=0;this.numberTicks=this._series.length+1;h=new this.tickRenderer(this.tickOptions);if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(0,this.name);this._ticks.push(h);v=0;for(s=1;s<this.numberTicks;s++){v+=this._series[s-1]._sumy;h=new this.tickRenderer(this.tickOptions);if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(v,this.name);this._ticks.push(h)}this.max=this.max||v;if(this.max>v){h=new this.tickRenderer(this.tickOptions);if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(this.max,this.name);this._ticks.push(h)}}else{if(this.tickMode=="even"){this.min=0;this.max=this.max||y.max;var A=2+Math.ceil((p-(this.tickSpacing-1))/this.tickSpacing);k=this.max-this.min;this.numberTicks=A;this.tickInterval=k/(this.numberTicks-1);for(s=0;s<this.numberTicks;s++){b=this.min+s*this.tickInterval;h=new this.tickRenderer(this.tickOptions);if(!this.showTicks){h.showLabel=false;h.showMark=false}else{if(!this.showTickMarks){h.showMark=false}}h.setTick(b,this.name);this._ticks.push(h)}}}}}};a.jqplot.MekkoAxisRenderer.prototype.pack=function(e,d){var C=this._ticks;var x=this.max;var v=this.min;var m=d.max;var j=d.min;var o=(this._label==null)?false:this._label.show;for(var s in e){this._elem.css(s,e[s])}this._offsets=d;var f=m-j;var g=x-v;this.p2u=function(b){return(b-j)*g/f+v};this.u2p=function(b){return(b-v)*f/g+j};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(b){return(b-v)*f/g};this.series_p2u=function(b){return b*g/f+v}}else{this.series_u2p=function(b){return(b-x)*f/g};this.series_p2u=function(b){return b*g/f+x}}if(this.show){if(this.name=="xaxis"||this.name=="x2axis"){for(var y=0;y<C.length;y++){var n=C[y];if(n.show&&n.showLabel){var c;if(n.constructor==a.jqplot.CanvasAxisTickRenderer&&n.angle){var A=(this.name=="xaxis")?1:-1;switch(n.labelPosition){case"auto":if(A*n.angle<0){c=-n.getWidth()+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2}else{c=-n._textRenderer.height*Math.sin(n._textRenderer.angle)/2}break;case"end":c=-n.getWidth()+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2;break;case"start":c=-n._textRenderer.height*Math.sin(n._textRenderer.angle)/2;break;case"middle":c=-n.getWidth()/2+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2;break;default:c=-n.getWidth()/2+n._textRenderer.height*Math.sin(-n._textRenderer.angle)/2;break}}else{c=-n.getWidth()/2}var D=this.u2p(n.value)+c+"px";n._elem.css("left",D);n.pack()}}var k;if(o){k=this._label._elem.outerWidth(true);this._label._elem.css("left",j+f/2-k/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px")}else{this._label._elem.css("top","0px")}this._label.pack()}var B,u,q;for(var y=0;y<this.barLabels.length;y++){B=this._barLabels[y];if(B.show){k=B.getWidth();u=this._ticks[y].getLeft()+this._ticks[y].getWidth();q=this._ticks[y+1].getLeft();B._elem.css("left",(q+u-k)/2+"px");B._elem.css("top",this._ticks[y]._elem.css("top"));B.pack()}}}else{for(var y=0;y<C.length;y++){var n=C[y];if(n.show&&n.showLabel){var c;if(n.constructor==a.jqplot.CanvasAxisTickRenderer&&n.angle){var A=(this.name=="yaxis")?1:-1;switch(n.labelPosition){case"auto":case"end":if(A*n.angle<0){c=-n._textRenderer.height*Math.cos(-n._textRenderer.angle)/2}else{c=-n.getHeight()+n._textRenderer.height*Math.cos(n._textRenderer.angle)/2}break;case"start":if(n.angle>0){c=-n._textRenderer.height*Math.cos(-n._textRenderer.angle)/2}else{c=-n.getHeight()+n._textRenderer.height*Math.cos(n._textRenderer.angle)/2}break;case"middle":c=-n.getHeight()/2;break;default:c=-n.getHeight()/2;break}}else{c=-n.getHeight()/2}var D=this.u2p(n.value)+c+"px";n._elem.css("top",D);n.pack()}}if(o){var z=this._label._elem.outerHeight(true);this._label._elem.css("top",m-f/2-z/2+"px");if(this.name=="yaxis"){this._label._elem.css("left","0px")}else{this._label._elem.css("right","0px")}this._label.pack()}}}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.MekkoRenderer
     * Draws a Mekko style chart which shows 3 dimensional data on a 2 dimensional graph.
     * the <$.jqplot.MekkoAxisRenderer> should be used with mekko charts.  The mekko renderer
     * overrides the default legend renderer with its own $.jqplot.MekkoLegendRenderer
     * which allows more flexibility to specify number of rows and columns in the legend.
     * 
     * Data is specified per bar in the chart.  You can specify data as an array of y values, or as 
     * an array of [label, value] pairs.  Note that labels are used only on the first series.  
     * Labels on subsequent series are ignored:
     * 
     * > bar1 = [['shirts', 8],['hats', 14],['shoes', 6],['gloves', 16],['dolls', 12]];
     * > bar2 = [15,6,9,13,6];
     * > bar3 = [['grumpy',4],['sneezy',2],['happy',7],['sleepy',9],['doc',7]];
     * 
     * If you want to place labels for each bar under the axis, you use the barLabels option on 
     * the axes.  The bar labels can be styled with the ".jqplot-mekko-barLabel" css class.
     * 
     * > barLabels = ['Mickey Mouse', 'Donald Duck', 'Goofy'];
     * > axes:{xaxis:{barLabels:barLabels}}
     * 
     */
    
    
    $.jqplot.MekkoRenderer = function(){
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        // prop: borderColor
        // color of the borders between areas on the chart
        this.borderColor = null;
        // prop: showBorders
        // True to draw borders lines between areas on the chart.
        // False will draw borders lines with the same color as the area.
        this.showBorders = true;
    };
    
    // called with scope of series.
    $.jqplot.MekkoRenderer.prototype.init = function(options, plot) {
        this.fill = false;
        this.fillRect = true;
        this.strokeRect = true;
        this.shadow = false;
        // width of bar on x axis.
        this._xwidth = 0;
        this._xstart = 0;
        $.extend(true, this.renderer, options);
        // set the shape renderer options
        var opts = {lineJoin:'miter', lineCap:'butt', isarc:false, fillRect:this.fillRect, strokeRect:this.strokeRect};
        this.renderer.shapeRenderer.init(opts);
        plot.axes.x2axis._series.push(this);
        this._type = 'mekko';
    };
    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.  Will convert user data into appropriate
    // rectangles.
    // Called with scope of a series.
    $.jqplot.MekkoRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        this.gridData = [];
        // figure out width on x axis.
        // this._xwidth = this._sumy / plot._sumy * this.canvas.getWidth();
        this._xwidth = xp(this._sumy) - xp(0);
        if (this.index>0) {
            this._xstart = plot.series[this.index-1]._xstart + plot.series[this.index-1]._xwidth;
        }
        var totheight = this.canvas.getHeight();
        var sumy = 0;
        var cury;
        var curheight;
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                sumy += data[i][1];
                cury = totheight - (sumy / this._sumy * totheight);
                curheight = data[i][1] / this._sumy * totheight;
                this.gridData.push([this._xstart, cury, this._xwidth, curheight]);
            }
        }
    };
    
    // Method: makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.MekkoRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        // figure out width on x axis.
        var xp = this._xaxis.series_u2p;
        var totheight = this.canvas.getHeight();
        var sumy = 0;
        var cury;
        var curheight;
        var gd = [];
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                sumy += data[i][1];
                cury = totheight - (sumy / this._sumy * totheight);
                curheight = data[i][1] / this._sumy * totheight;
                gd.push([this._xstart, cury, this._xwidth, curheight]);
            }
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.MekkoRenderer.prototype.draw = function(ctx, gd, options) {
        var i;
        var opts = (options != undefined) ? options : {};
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        ctx.save();
        if (gd.length) {
            if (showLine) {
                for (i=0; i<gd.length; i++){
                    opts.fillStyle = colorGenerator.next();
                    if (this.renderer.showBorders) {
                        opts.strokeStyle = this.renderer.borderColor;
                    }
                    else {
                        opts.strokeStyle = opts.fillStyle;
                    }
                    this.renderer.shapeRenderer.draw(ctx, gd[i], opts);
                }
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.MekkoRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, no shadows on mekko charts.
    };
    
    /**
     * Class: $.jqplot.MekkoLegendRenderer
     * Legend renderer used by mekko charts with options for 
     * controlling number or rows and columns as well as placement
     * outside of plot area.
     * 
     */
    $.jqplot.MekkoLegendRenderer = function(){
        //
    };
    
    $.jqplot.MekkoLegendRenderer.prototype.init = function(options) {
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        // this will override the placement option on the Legend object
        this.placement = "outside";
        $.extend(true, this, options);
    };
    
    // called with scope of legend
    $.jqplot.MekkoLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
            // Mekko charts  legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = true,    // mekko charts are always stacked, so reverse
                nr, nc;
            var s = series[0];
            var colorGenerator = new $.jqplot.ColorGenerator(s.seriesColors);
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j, tr, td1, td2, lt, rs, color;
                var idx = 0;    
                
                for (i=0; i<nr; i++) {
                    if (reverse){
                        tr = $('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem);
                    }
                    else{
                        tr = $('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);
                    }
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length) {
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = colorGenerator.next();
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';
                
                            td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                                '<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+
                                '</div></td>');
                            td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }

                tr = null;
                td1 = null;
                td2 = null;
            }
        }
        return this._elem;
    };
    
    $.jqplot.MekkoLegendRenderer.prototype.pack = function(offsets) {
        if (this.show) {
            // fake a grid for positioning
            var grid = {_top:offsets.top, _left:offsets.left, _right:offsets.right, _bottom:this._plotDimensions.height - offsets.bottom};        
            if (this.placement == 'insideGrid') {
                switch (this.location) {
                    case 'nw':
                        var a = grid._left + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css('left', a);
                        this._elem.css('top', b);
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = grid._top + this.yoffset;
                        this._elem.css('left', a);
                        this._elem.css('top', b);
                        break;
                    case 'ne':
                        var a = offsets.right + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css({right:a, top:b});
                        break;
                    case 'e':
                        var a = offsets.right + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:a, top:b});
                        break;
                    case 'se':
                        var a = offsets.right + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 'sw':
                        var a = grid._left + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 'w':
                        var a = grid._left + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:a, top:b});
                        break;
                    default:  // same as 'se'
                        var a = grid._right - this.xoffset;
                        var b = grid._bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                }
                
            }
            else {
                switch (this.location) {
                    case 'nw':
                        var a = this._plotDimensions.width - grid._left + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css('right', a);
                        this._elem.css('top', b);
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = this._plotDimensions.height - grid._top + this.yoffset;
                        this._elem.css('left', a);
                        this._elem.css('bottom', b);
                        break;
                    case 'ne':
                        var a = this._plotDimensions.width - offsets.right + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'e':
                        var a = this._plotDimensions.width - offsets.right + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'se':
                        var a = this._plotDimensions.width - offsets.right + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = this._plotDimensions.height - offsets.bottom + this.yoffset;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'sw':
                        var a = this._plotDimensions.width - grid._left + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                    case 'w':
                        var a = this._plotDimensions.width - grid._left + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:a, top:b});
                        break;
                    default:  // same as 'se'
                        var a = grid._right - this.xoffset;
                        var b = grid._bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                }
            }
        } 
    };
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.MekkoRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.MekkoRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.MekkoAxisRenderer;
            options.legend.renderer = $.jqplot.MekkoLegendRenderer;
            options.legend.preDraw = true;
        }
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
})(jQuery);    

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(b){b.jqplot.MekkoRenderer=function(){this.shapeRenderer=new b.jqplot.ShapeRenderer();this.borderColor=null;this.showBorders=true};b.jqplot.MekkoRenderer.prototype.init=function(c,e){this.fill=false;this.fillRect=true;this.strokeRect=true;this.shadow=false;this._xwidth=0;this._xstart=0;b.extend(true,this.renderer,c);var d={lineJoin:"miter",lineCap:"butt",isarc:false,fillRect:this.fillRect,strokeRect:this.strokeRect};this.renderer.shapeRenderer.init(d);e.axes.x2axis._series.push(this);this._type="mekko"};b.jqplot.MekkoRenderer.prototype.setGridData=function(h){var e=this._xaxis.series_u2p;var c=this._yaxis.series_u2p;var g=this._plotData;this.gridData=[];this._xwidth=e(this._sumy)-e(0);if(this.index>0){this._xstart=h.series[this.index-1]._xstart+h.series[this.index-1]._xwidth}var l=this.canvas.getHeight();var d=0;var k;var j;for(var f=0;f<g.length;f++){if(g[f]!=null){d+=g[f][1];k=l-(d/this._sumy*l);j=g[f][1]/this._sumy*l;this.gridData.push([this._xstart,k,this._xwidth,j])}}};b.jqplot.MekkoRenderer.prototype.makeGridData=function(f,g){var d=this._xaxis.series_u2p;var l=this.canvas.getHeight();var c=0;var j;var h;var k=[];for(var e=0;e<f.length;e++){if(f[e]!=null){c+=f[e][1];j=l-(c/this._sumy*l);h=f[e][1]/this._sumy*l;k.push([this._xstart,j,this._xwidth,h])}}return k};b.jqplot.MekkoRenderer.prototype.draw=function(c,h,d){var e;var g=(d!=undefined)?d:{};var f=(g.showLine!=undefined)?g.showLine:this.showLine;var j=new b.jqplot.ColorGenerator(this.seriesColors);c.save();if(h.length){if(f){for(e=0;e<h.length;e++){g.fillStyle=j.next();if(this.renderer.showBorders){g.strokeStyle=this.renderer.borderColor}else{g.strokeStyle=g.fillStyle}this.renderer.shapeRenderer.draw(c,h[e],g)}}}c.restore()};b.jqplot.MekkoRenderer.prototype.drawShadow=function(c,e,d){};b.jqplot.MekkoLegendRenderer=function(){};b.jqplot.MekkoLegendRenderer.prototype.init=function(c){this.numberRows=null;this.numberColumns=null;this.placement="outside";b.extend(true,this,c)};b.jqplot.MekkoLegendRenderer.prototype.draw=function(){var f=this;if(this.show){var o=this._series;var r="position:absolute;";r+=(this.background)?"background:"+this.background+";":"";r+=(this.border)?"border:"+this.border+";":"";r+=(this.fontSize)?"font-size:"+this.fontSize+";":"";r+=(this.fontFamily)?"font-family:"+this.fontFamily+";":"";r+=(this.textColor)?"color:"+this.textColor+";":"";this._elem=b('<table class="jqplot-table-legend" style="'+r+'"></table>');var w=false,n=true,c,l;var p=o[0];var d=new b.jqplot.ColorGenerator(p.seriesColors);if(p.show){var x=p.data;if(this.numberRows){c=this.numberRows;if(!this.numberColumns){l=Math.ceil(x.length/c)}else{l=this.numberColumns}}else{if(this.numberColumns){l=this.numberColumns;c=Math.ceil(x.length/this.numberColumns)}else{c=x.length;l=1}}var v,u,e,h,g,k,m,t;var q=0;for(v=0;v<c;v++){if(n){e=b('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem)}else{e=b('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem)}for(u=0;u<l;u++){if(q<x.length){k=this.labels[q]||x[q][0].toString();t=d.next();if(!n){if(v>0){w=true}else{w=false}}else{if(v==c-1){w=false}else{w=true}}m=(w)?this.rowSpacing:"0";h=b('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+m+';"><div><div class="jqplot-table-legend-swatch" style="border-color:'+t+';"></div></div></td>');g=b('<td class="jqplot-table-legend" style="padding-top:'+m+';"></td>');if(this.escapeHtml){g.text(k)}else{g.html(k)}if(n){g.prependTo(e);h.prependTo(e)}else{h.appendTo(e);g.appendTo(e)}w=true}q++}}e=null;h=null;g=null}}return this._elem};b.jqplot.MekkoLegendRenderer.prototype.pack=function(f){if(this.show){var e={_top:f.top,_left:f.left,_right:f.right,_bottom:this._plotDimensions.height-f.bottom};if(this.placement=="insideGrid"){switch(this.location){case"nw":var d=e._left+this.xoffset;var c=e._top+this.yoffset;this._elem.css("left",d);this._elem.css("top",c);break;case"n":var d=(f.left+(this._plotDimensions.width-f.right))/2-this.getWidth()/2;var c=e._top+this.yoffset;this._elem.css("left",d);this._elem.css("top",c);break;case"ne":var d=f.right+this.xoffset;var c=e._top+this.yoffset;this._elem.css({right:d,top:c});break;case"e":var d=f.right+this.xoffset;var c=(f.top+(this._plotDimensions.height-f.bottom))/2-this.getHeight()/2;this._elem.css({right:d,top:c});break;case"se":var d=f.right+this.xoffset;var c=f.bottom+this.yoffset;this._elem.css({right:d,bottom:c});break;case"s":var d=(f.left+(this._plotDimensions.width-f.right))/2-this.getWidth()/2;var c=f.bottom+this.yoffset;this._elem.css({left:d,bottom:c});break;case"sw":var d=e._left+this.xoffset;var c=f.bottom+this.yoffset;this._elem.css({left:d,bottom:c});break;case"w":var d=e._left+this.xoffset;var c=(f.top+(this._plotDimensions.height-f.bottom))/2-this.getHeight()/2;this._elem.css({left:d,top:c});break;default:var d=e._right-this.xoffset;var c=e._bottom+this.yoffset;this._elem.css({right:d,bottom:c});break}}else{switch(this.location){case"nw":var d=this._plotDimensions.width-e._left+this.xoffset;var c=e._top+this.yoffset;this._elem.css("right",d);this._elem.css("top",c);break;case"n":var d=(f.left+(this._plotDimensions.width-f.right))/2-this.getWidth()/2;var c=this._plotDimensions.height-e._top+this.yoffset;this._elem.css("left",d);this._elem.css("bottom",c);break;case"ne":var d=this._plotDimensions.width-f.right+this.xoffset;var c=e._top+this.yoffset;this._elem.css({left:d,top:c});break;case"e":var d=this._plotDimensions.width-f.right+this.xoffset;var c=(f.top+(this._plotDimensions.height-f.bottom))/2-this.getHeight()/2;this._elem.css({left:d,top:c});break;case"se":var d=this._plotDimensions.width-f.right+this.xoffset;var c=f.bottom+this.yoffset;this._elem.css({left:d,bottom:c});break;case"s":var d=(f.left+(this._plotDimensions.width-f.right))/2-this.getWidth()/2;var c=this._plotDimensions.height-f.bottom+this.yoffset;this._elem.css({left:d,top:c});break;case"sw":var d=this._plotDimensions.width-e._left+this.xoffset;var c=f.bottom+this.yoffset;this._elem.css({right:d,bottom:c});break;case"w":var d=this._plotDimensions.width-e._left+this.xoffset;var c=(f.top+(this._plotDimensions.height-f.bottom))/2-this.getHeight()/2;this._elem.css({right:d,top:c});break;default:var d=e._right-this.xoffset;var c=e._bottom+this.yoffset;this._elem.css({right:d,bottom:c});break}}}};function a(g,f,d){d=d||{};d.axesDefaults=d.axesDefaults||{};d.legend=d.legend||{};d.seriesDefaults=d.seriesDefaults||{};var c=false;if(d.seriesDefaults.renderer==b.jqplot.MekkoRenderer){c=true}else{if(d.series){for(var e=0;e<d.series.length;e++){if(d.series[e].renderer==b.jqplot.MekkoRenderer){c=true}}}}if(c){d.axesDefaults.renderer=b.jqplot.MekkoAxisRenderer;d.legend.renderer=b.jqplot.MekkoLegendRenderer;d.legend.preDraw=true}}b.jqplot.preInitHooks.push(a)})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.MeterGaugeRenderer
     * Plugin renderer to draw a meter gauge chart.
     * 
     * Data consists of a single series with 1 data point to position the gauge needle.
     * 
     * To use this renderer, you need to include the 
     * meter gauge renderer plugin, for example:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.meterGaugeRenderer.js"></script>
     * 
     * Properties described here are passed into the $.jqplot function
     * as options on the series renderer.  For example:
     * 
     * > plot0 = $.jqplot('chart0',[[18]],{
     * >     title: 'Network Speed',
     * >     seriesDefaults: {
     * >         renderer: $.jqplot.MeterGaugeRenderer,
     * >         rendererOptions: {
     * >             label: 'MB/s'
     * >         }
     * >     }
     * > });
     * 
     * A meterGauge plot does not support events.
     */
    $.jqplot.MeterGaugeRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.MeterGaugeRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.MeterGaugeRenderer.prototype.constructor = $.jqplot.MeterGaugeRenderer;
    
    // called with scope of a series
    $.jqplot.MeterGaugeRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: diameter
        // Outer diameter of the meterGauge, auto computed by default
        this.diameter = null;
        // prop: padding
        // padding between the meterGauge and plot edges, auto
        // calculated by default.
        this.padding = null;
        // prop: shadowOffset
        // offset of the shadow from the gauge ring and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 4;
        // prop: background
        // background color of the inside of the gauge.
        this.background = "#efefef";
        // prop: ringColor
        // color of the outer ring, hub, and needle of the gauge.
        this.ringColor = "#BBC6D0";
        // needle color not implemented yet.
        this.needleColor = "#C3D3E5";
        // prop: tickColor
        // color of the tick marks around the gauge.
        this.tickColor = "#989898";
        // prop: ringWidth
        // width of the ring around the gauge.  Auto computed by default.
        this.ringWidth = null;
        // prop: min
        // Minimum value on the gauge.  Auto computed by default
        this.min;
        // prop: max
        // Maximum value on the gauge. Auto computed by default
        this.max;
        // prop: ticks
        // Array of tick values. Auto computed by default.
        this.ticks = [];
        // prop: showTicks
        // true to show ticks around gauge.
        this.showTicks = true;
        // prop: showTickLabels
        // true to show tick labels next to ticks.
        this.showTickLabels = true;
        // prop: label
        // A gauge label like 'kph' or 'Volts'
        this.label = null;
        // prop: labelHeightAdjust
        // Number of Pixels to offset the label up (-) or down (+) from its default position.
        this.labelHeightAdjust = 0;
        // prop: labelPosition
        // Where to position the label, either 'inside' or 'bottom'.
        this.labelPosition = 'inside';
        // prop: intervals
        // Array of ranges to be drawn around the gauge.
        // Array of form:
        // > [value1, value2, ...]
        // indicating the values for the first, second, ... intervals.
        this.intervals = [];
        // prop: intervalColors
        // Array of colors to use for the intervals.
        this.intervalColors = [ "#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"];
        // prop: intervalInnerRadius
        // Radius of the inner circle of the interval ring.
        this.intervalInnerRadius =  null;
        // prop: intervalOuterRadius
        // Radius of the outer circle of the interval ring.
        this.intervalOuterRadius = null;
        this.tickRenderer = $.jqplot.MeterGaugeTickRenderer;
        // ticks spaced every 1, 2, 2.5, 5, 10, 20, .1, .2, .25, .5, etc.
        this.tickPositions = [1, 2, 2.5, 5, 10];
        // prop: tickSpacing
        // Degrees between ticks.  This is a target number, if 
        // incompatible span and ticks are supplied, a suitable
        // spacing close to this value will be computed.
        this.tickSpacing = 30;
        this.numberMinorTicks = null;
        // prop: hubRadius
        // Radius of the hub at the bottom center of gauge which the needle attaches to.
        // Auto computed by default
        this.hubRadius = null;
        // prop: tickPadding
        // padding of the tick marks to the outer ring and the tick labels to marks.
        // Auto computed by default.
        this.tickPadding = null;
        // prop: needleThickness
        // Maximum thickness the needle.  Auto computed by default.
        this.needleThickness = null;
        // prop: needlePad
        // Padding between needle and inner edge of the ring when the needle is at the min or max gauge value.
        this.needlePad = 6;
        // prop: pegNeedle
        // True will stop needle just below/above the  min/max values if data is below/above min/max,
        // as if the meter is "pegged".
        this.pegNeedle = true;
        this._type = 'meterGauge';
        
        $.extend(true, this, options);
        this.type = null;
        this.numberTicks = null;
        this.tickInterval = null;
        // span, the sweep (in degrees) from min to max.  This gauge is 
        // a semi-circle.
        this.span = 180;
        // get rid of this nonsense
        // this.innerSpan = this.span;
        if (this.type == 'circular') {
            this.semiCircular = false;
        }
        else if (this.type != 'circular') {
            this.semiCircular = true;
        }
        else {
            this.semiCircular = (this.span <= 180) ? true : false;
        }
        this._tickPoints = [];
        // reference to label element.
        this._labelElem = null;
        
        // start the gauge at the beginning of the span
        this.startAngle = (90 + (360 - this.span)/2) * Math.PI/180;
        this.endAngle = (90 - (360 - this.span)/2) * Math.PI/180;
        
        this.setmin = !!(this.min == null);
        this.setmax = !!(this.max == null);
        
        // if given intervals and is an array of values, create labels and colors.
        if (this.intervals.length) {
            if (this.intervals[0].length == null || this.intervals.length == 1) {
                for (var i=0; i<this.intervals.length; i++) {
                    this.intervals[i] = [this.intervals[i], this.intervals[i], this.intervalColors[i]];
                }
            }
            else if (this.intervals[0].length == 2) {
                for (i=0; i<this.intervals.length; i++) {
                    this.intervals[i] = [this.intervals[i][0], this.intervals[i][1], this.intervalColors[i]];
                }
            }
        }
        
        // compute min, max and ticks if not supplied:
        if (this.ticks.length) {
            if (this.ticks[0].length == null || this.ticks[0].length == 1) {
                for (var i=0; i<this.ticks.length; i++) {
                    this.ticks[i] = [this.ticks[i], this.ticks[i]];
                }
            }
            this.min = (this.min == null) ? this.ticks[0][0] : this.min;
            this.max = (this.max == null) ? this.ticks[this.ticks.length-1][0] : this.max;
            this.setmin = false;
            this.setmax = false;
            this.numberTicks = this.ticks.length;
            this.tickInterval = this.ticks[1][0] - this.ticks[0][0];
            this.tickFactor = Math.floor(parseFloat((Math.log(this.tickInterval)/Math.log(10)).toFixed(11)));
            // use the first interal to calculate minor ticks;
            this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor);
            if (!this.numberMinorTicks) {
                this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor-1);
            }
            if (!this.numberMinorTicks) {
                this.numberMinorTicks = 1;
            }
        }
        
        else if (this.intervals.length) {
            this.min = (this.min == null) ? 0 : this.min;
            this.setmin = false;
            if (this.max == null) {
                if (this.intervals[this.intervals.length-1][0] >= this.data[0][1]) {
                    this.max = this.intervals[this.intervals.length-1][0];
                    this.setmax = false;
                }
            }
            else {
                this.setmax = false;
            }
        }
        
        else {
            // no ticks and no intervals supplied, put needle in middle
            this.min = (this.min == null) ? 0 : this.min;
            this.setmin = false;
            if (this.max == null) {
                this.max = this.data[0][1] * 1.25;
                this.setmax = true;
            }
            else {
                this.setmax = false;
            }
        }
    };
    
    $.jqplot.MeterGaugeRenderer.prototype.setGridData = function(plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var stack = [];
        var td = [];
        var sa = this.startAngle;
        for (var i=0; i<this.data.length; i++){
            stack.push(this.data[i][1]);
            td.push([this.data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
        }
        this.gridData = td;
    };
    
    $.jqplot.MeterGaugeRenderer.prototype.makeGridData = function(data, plot) {
        var stack = [];
        var td = [];
        var sa = this.startAngle;
        for (var i=0; i<data.length; i++){
            stack.push(data[i][1]);
            td.push([data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
        }
        return td;
    };

        
    function getnmt(pos, interval, fact) {
        var temp;
        for (var i=pos.length-1; i>=0; i--) {
            temp = interval/(pos[i] * Math.pow(10, fact));
            if (temp == 4 || temp == 5) {
                return temp - 1;
            }
        }
        return null;
    }
    
    // called with scope of series
    $.jqplot.MeterGaugeRenderer.prototype.draw = function (ctx, gd, options) {
        var i;
        var opts = (options != undefined) ? options : {};
        // offset and direction of offset due to legend placement
        var offx = 0;
        var offy = 0;
        var trans = 1;
        if (options.legendInfo && options.legendInfo.placement == 'inside') {
            var li = options.legendInfo;
            switch (li.location) {
                case 'nw':
                    offx = li.width + li.xoffset;
                    break;
                case 'w':
                    offx = li.width + li.xoffset;
                    break;
                case 'sw':
                    offx = li.width + li.xoffset;
                    break;
                case 'ne':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'e':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'se':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'n':
                    offy = li.height + li.yoffset;
                    break;
                case 's':
                    offy = li.height + li.yoffset;
                    trans = -1;
                    break;
                default:
                    break;
            }
        }
        
        
            
        // pre-draw so can get its dimensions.
        if (this.label) {
            this._labelElem = $('<div class="jqplot-meterGauge-label" style="position:absolute;">'+this.label+'</div>');
            this.canvas._elem.after(this._labelElem);
        }
        
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        if (this.padding == null) {
            this.padding = Math.round(Math.min(cw, ch)/30);
        }
        var w = cw - offx - 2 * this.padding;
        var h = ch - offy - 2 * this.padding;
        if (this.labelPosition == 'bottom' && this.label) {
            h -= this._labelElem.outerHeight(true);
        }
        var mindim = Math.min(w,h);
        var d = mindim;
            
        if (!this.diameter) {
            if (this.semiCircular) {
                if ( w >= 2*h) {
                    if (!this.ringWidth) {
                        this.ringWidth = 2*h/35;
                    }
                    this.needleThickness = this.needleThickness || 2+Math.pow(this.ringWidth, 0.8);
                    this.innerPad = this.ringWidth/2 + this.needleThickness/2 + this.needlePad;
                    this.diameter = 2 * (h - 2*this.innerPad);
                }
                else {
                    if (!this.ringWidth) {
                        this.ringWidth = w/35;
                    }
                    this.needleThickness = this.needleThickness || 2+Math.pow(this.ringWidth, 0.8);
                    this.innerPad = this.ringWidth/2 + this.needleThickness/2 + this.needlePad;
                    this.diameter = w - 2*this.innerPad - this.ringWidth - this.padding;
                }
                // center taking into account legend and over draw for gauge bottom below hub.
                // this will be center of hub.
                this._center = [(cw - trans * offx)/2 + trans * offx,  (ch + trans*offy - this.padding - this.ringWidth - this.innerPad)];
            }
            else {
                if (!this.ringWidth) {
                    this.ringWidth = d/35;
                }
                this.needleThickness = this.needleThickness || 2+Math.pow(this.ringWidth, 0.8);
                this.innerPad = 0;
                this.diameter = d - this.ringWidth;
                // center in middle of canvas taking into account legend.
                // will be center of hub.
                this._center = [(cw-trans*offx)/2 + trans * offx, (ch-trans*offy)/2 + trans * offy];
            }
            if (this._labelElem && this.labelPosition == 'bottom') {
                this._center[1] -= this._labelElem.outerHeight(true);
            }
            
        }

        this._radius = this.diameter/2;
        
        this.tickSpacing = 6000/this.diameter;
        
        if (!this.hubRadius) {
            this.hubRadius = this.diameter/18;
        }
        
        this.shadowOffset = 0.5 + this.ringWidth/9;
        this.shadowWidth = this.ringWidth*1;
        
        this.tickPadding = 3 + Math.pow(this.diameter/20, 0.7);
        this.tickOuterRadius = this._radius - this.ringWidth/2 - this.tickPadding;
        this.tickLength = (this.showTicks) ? this._radius/13 : 0;
        
        if (this.ticks.length == 0) {
            // no ticks, lets make some.
            var max = this.max,
                min = this.min,
                setmax = this.setmax,
                setmin = this.setmin,
                ti = (max - min) * this.tickSpacing / this.span;
            var tf = Math.floor(parseFloat((Math.log(ti)/Math.log(10)).toFixed(11)));
            var tp = (ti/Math.pow(10, tf));
            (tp > 2 && tp <= 2.5) ? tp = 2.5 : tp = Math.ceil(tp);
            var t = this.tickPositions;
            var tpindex, nt;
    
            for (i=0; i<t.length; i++) {
                if (tp == t[i] || i && t[i-1] < tp && tp < t[i]) { 
                    ti = t[i]*Math.pow(10, tf);
                    tpindex = i;
                }
            }
        
            for (i=0; i<t.length; i++) {
                if (tp == t[i] || i && t[i-1] < tp && tp < t[i]) { 
                    ti = t[i]*Math.pow(10, tf);
                    nt = Math.ceil((max - min) / ti);
                }
            }
        
            // both max and min are free
            if (setmax && setmin) {
                var tmin = (min > 0) ? min - min % ti : min - min % ti - ti;
                if (!this.forceZero) {
                    var diff = Math.min(min - tmin, 0.8*ti);
                    var ntp = Math.floor(diff/t[tpindex]);
                    if (ntp > 1) {
                        tmin = tmin + t[tpindex] * (ntp-1);
                        if (parseInt(tmin, 10) != tmin && parseInt(tmin-t[tpindex], 10) == tmin-t[tpindex]) {
                            tmin = tmin - t[tpindex];
                        }
                    }
                }
                if (min == tmin) {
                    min -= ti;
                }
                else {
                    // tmin should always be lower than dataMin
                    if (min - tmin > 0.23*ti) {
                        min = tmin;
                    }
                    else {
                        min = tmin -ti;
                        nt += 1;
                    }
                }
                nt += 1;
                var tmax = min + (nt - 1) * ti;
                if (max >= tmax) { 
                    tmax += ti;
                    nt += 1;
                }
                // now tmax should always be mroe than dataMax
                if (tmax - max < 0.23*ti) { 
                    tmax += ti;
                    nt += 1;
                }
                this.max = max = tmax;
                this.min = min;    

                this.tickInterval = ti;
                this.numberTicks = nt;
                var it;
                for (i=0; i<nt; i++) {
                    it = parseFloat((min+i*ti).toFixed(11));
                    this.ticks.push([it, it]);
                }
                this.max = this.ticks[nt-1][1];
            
                this.tickFactor = tf;      
                // determine number of minor ticks

                this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor);     
        
                if (!this.numberMinorTicks) {
                    this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor-1);
                }
            }
            // max is free, min is fixed
            else if (setmax) {
                var tmax = min + (nt - 1) * ti;
                if (max >= tmax) {
                    max = tmax + ti;
                    nt += 1;
                }
                else {
                    max = tmax;
                }

                this.tickInterval = this.tickInterval || ti;
                this.numberTicks = this.numberTicks || nt;
                var it;
                for (i=0; i<this.numberTicks; i++) {
                    it = parseFloat((min+i*this.tickInterval).toFixed(11));
                    this.ticks.push([it, it]);
                }
                this.max = this.ticks[this.numberTicks-1][1];
            
                this.tickFactor = tf;
                // determine number of minor ticks
                this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor);
        
                if (!this.numberMinorTicks) {
                    this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor-1);
                }
            }
            
            // not setting max or min
            if (!setmax && !setmin) {
                var range = this.max - this.min;
                tf = Math.floor(parseFloat((Math.log(range)/Math.log(10)).toFixed(11))) - 1;
                var nticks = [5,6,4,7,3,8,9,10,2], res, numticks, nonSigDigits=0, sigRange;
                // check to see how many zeros are at the end of the range
                if (range > 1) {
                    var rstr = String(range);
                    if (rstr.search(/\./) == -1) {
                         var pos = rstr.search(/0+$/);
                         nonSigDigits = (pos > 0) ? rstr.length - pos - 1 : 0;
                    }
                }
                sigRange = range/Math.pow(10, nonSigDigits);
                for (i=0; i<nticks.length; i++) {
                    res = sigRange/(nticks[i]-1);
                    if (res == parseInt(res, 10)) {
                        this.numberTicks = nticks[i];
                        this.tickInterval = range/(this.numberTicks-1);
                        this.tickFactor = tf+1;
                        break;
                    }
                }
                var it;
                for (i=0; i<this.numberTicks; i++) {
                    it = parseFloat((this.min+i*this.tickInterval).toFixed(11));
                    this.ticks.push([it, it]);
                }
                // determine number of minor ticks
                this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor);
        
                if (!this.numberMinorTicks) {
                    this.numberMinorTicks = getnmt(this.tickPositions, this.tickInterval, this.tickFactor-1);
                }
                
                if (!this.numberMinorTicks) {
                    this.numberMinorTicks = 1;
                    var nums = [4, 5, 3, 6, 2];
                    for (i=0; i<5; i++) {
                        var temp = this.tickInterval/nums[i];
                        if (temp == parseInt(temp, 10)) {
                            this.numberMinorTicks = nums[i]-1;
                            break;
                        }
                    }
                }
            }
        }
        

        var r = this._radius,
            sa = this.startAngle,
            ea = this.endAngle,       
            pi = Math.PI,
            hpi = Math.PI/2;
            
        if (this.semiCircular) {
            var overAngle = Math.atan(this.innerPad/r),
                outersa = this.outerStartAngle = sa - overAngle,
                outerea = this.outerEndAngle = ea + overAngle,
                hubsa = this.hubStartAngle = sa - Math.atan(this.innerPad/this.hubRadius*2),
                hubea = this.hubEndAngle = ea + Math.atan(this.innerPad/this.hubRadius*2);

            ctx.save();            
            
            ctx.translate(this._center[0], this._center[1]);
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            
            // draw the innerbackground
            ctx.save();
            ctx.beginPath();  
            ctx.fillStyle = this.background;
            ctx.arc(0, 0, r, outersa, outerea, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // draw the shadow
            // the outer ring.
            var shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
            ctx.save();
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                ctx.beginPath();  
                ctx.strokeStyle = shadowColor;
                ctx.lineWidth = this.shadowWidth;
                ctx.arc(0 ,0, r, outersa, outerea, false);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
            
            // the inner hub.
            ctx.save();
            var tempd = parseInt((this.shadowDepth+1)/2, 10);
            for (var i=0; i<tempd; i++) {
                ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                ctx.beginPath();  
                ctx.fillStyle = shadowColor;
                ctx.arc(0 ,0, this.hubRadius, hubsa, hubea, false);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            
            // draw the outer ring.
            ctx.save();
            ctx.beginPath();  
            ctx.strokeStyle = this.ringColor;
            ctx.lineWidth = this.ringWidth;
            ctx.arc(0 ,0, r, outersa, outerea, false);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            
            // draw the hub
            
            ctx.save();
            ctx.beginPath();  
            ctx.fillStyle = this.ringColor;
            ctx.arc(0 ,0, this.hubRadius,hubsa, hubea, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // draw the ticks
            if (this.showTicks) {
                ctx.save();
                var orad = this.tickOuterRadius,
                    tl = this.tickLength,
                    mtl = tl/2,
                    nmt = this.numberMinorTicks,
                    ts = this.span * Math.PI / 180 / (this.ticks.length-1),
                    mts = ts/(nmt + 1);
                
                for (i = 0; i<this.ticks.length; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1.5 + this.diameter/360;
                    ctx.strokeStyle = this.ringColor;
                    var wps = ts*i+sa;
                    ctx.moveTo(-orad * Math.cos(ts*i+sa), orad * Math.sin(ts*i+sa));
                    ctx.lineTo(-(orad-tl) * Math.cos(ts*i+sa), (orad - tl) * Math.sin(ts*i+sa));
                    this._tickPoints.push([(orad-tl) * Math.cos(ts*i+sa) + this._center[0] + this.canvas._offsets.left, (orad - tl) * Math.sin(ts*i+sa) + this._center[1] + this.canvas._offsets.top, ts*i+sa]);
                    ctx.stroke();
                    ctx.lineWidth = 1.0 + this.diameter/440;
                    if (i<this.ticks.length-1) {
                        for (var j=1; j<=nmt; j++) {
                            ctx.beginPath();
                            ctx.moveTo(-orad * Math.cos(ts*i+mts*j+sa), orad * Math.sin(ts*i+mts*j+sa));
                            ctx.lineTo(-(orad-mtl) * Math.cos(ts*i+mts*j+sa), (orad-mtl) * Math.sin(ts*i+mts*j+sa));
                            ctx.stroke();
                        }   
                    }
                }
                ctx.restore();
            }
            
            // draw the tick labels
            if (this.showTickLabels) {
                var elem, l, t, ew, eh, dim, maxdim=0;
                var tp = this.tickPadding * (1 - 1/(this.diameter/80+1));
                for (i=0; i<this.ticks.length; i++) {
                    elem = $('<div class="jqplot-meterGauge-tick" style="position:absolute;">'+this.ticks[i][1]+'</div>');
                    this.canvas._elem.after(elem);
                    ew = elem.outerWidth(true);
                    eh = elem.outerHeight(true);
                    l = this._tickPoints[i][0] - ew * (this._tickPoints[i][2]-Math.PI)/Math.PI - tp * Math.cos(this._tickPoints[i][2]);
                    t = this._tickPoints[i][1] - eh/2 + eh/2 * Math.pow(Math.abs((Math.sin(this._tickPoints[i][2]))), 0.5) + tp/3 * Math.pow(Math.abs((Math.sin(this._tickPoints[i][2]))), 0.5) ;
                    // t = this._tickPoints[i][1] - eh/2 - eh/2 * Math.sin(this._tickPoints[i][2]) - tp/2 * Math.sin(this._tickPoints[i][2]);
                    elem.css({left:l, top:t, color: this.tickColor});
                    dim  = ew*Math.cos(this._tickPoints[i][2]) + eh*Math.sin(Math.PI/2+this._tickPoints[i][2]/2);
                    maxdim = (dim > maxdim) ? dim : maxdim;
                }
            }
            
            // draw the gauge label
            if (this.label && this.labelPosition == 'inside') {
                var l = this._center[0] + this.canvas._offsets.left;
                var tp = this.tickPadding * (1 - 1/(this.diameter/80+1));
                var t = 0.5*(this._center[1] + this.canvas._offsets.top - this.hubRadius) + 0.5*(this._center[1] + this.canvas._offsets.top - this.tickOuterRadius + this.tickLength + tp) + this.labelHeightAdjust;
                // this._labelElem = $('<div class="jqplot-meterGauge-label" style="position:absolute;">'+this.label+'</div>');
                // this.canvas._elem.after(this._labelElem);
                l -= this._labelElem.outerWidth(true)/2;
                t -= this._labelElem.outerHeight(true)/2;
                this._labelElem.css({left:l, top:t});
            }
            
            else if (this.label && this.labelPosition == 'bottom') {
                var l = this._center[0] + this.canvas._offsets.left - this._labelElem.outerWidth(true)/2;
                var t = this._center[1] + this.canvas._offsets.top + this.innerPad + this.ringWidth + this.padding + this.labelHeightAdjust;
                this._labelElem.css({left:l, top:t});
                
            }
            
            // draw the intervals
            
            ctx.save();
            var inner = this.intervalInnerRadius || this.hubRadius * 1.5;
            if (this.intervalOuterRadius == null) {
                if (this.showTickLabels) {
                    var outer = (this.tickOuterRadius - this.tickLength - this.tickPadding - this.diameter/8);
                }
                else {
                    var outer = (this.tickOuterRadius - this.tickLength - this.diameter/16);
                }
            }
            else {
                var outer = this.intervalOuterRadius;
            }
            var range = this.max - this.min;
            var intrange = this.intervals[this.intervals.length-1] - this.min;
            var start, end, span = this.span*Math.PI/180;
            for (i=0; i<this.intervals.length; i++) {
                start = (i == 0) ? sa : sa + (this.intervals[i-1][0] - this.min)*span/range;
                if (start < 0) {
                    start = 0;
                }
                end = sa + (this.intervals[i][0] - this.min)*span/range;
                if (end < 0) {
                    end = 0;
                }
                ctx.beginPath();
                ctx.fillStyle = this.intervals[i][2];
                ctx.arc(0, 0, inner, start, end, false);
                ctx.lineTo(outer*Math.cos(end), outer*Math.sin(end));
                ctx.arc(0, 0, outer, end, start, true);
                ctx.lineTo(inner*Math.cos(start), inner*Math.sin(start));
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            
            // draw the needle
            var datapoint = this.data[0][1];
            var dataspan = this.max - this.min;
            if (this.pegNeedle) {
                if (this.data[0][1] > this.max + dataspan*3/this.span) {
                    datapoint = this.max + dataspan*3/this.span;
                }
                if (this.data[0][1] < this.min - dataspan*3/this.span) {
                    datapoint = this.min - dataspan*3/this.span;
                }
            }
            var dataang = (datapoint - this.min)/dataspan * this.span * Math.PI/180 + this.startAngle;
            
            
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.ringColor;
            ctx.strokeStyle = this.ringColor;
            this.needleLength = (this.tickOuterRadius - this.tickLength) * 0.85;
            this.needleThickness = (this.needleThickness < 2) ? 2 : this.needleThickness;
            var endwidth = this.needleThickness * 0.4;

            
            var dl = this.needleLength/10;
            var dt = (this.needleThickness - endwidth)/10;
            var templ;
            for (var i=0; i<10; i++) {
                templ = this.needleThickness - i*dt;
                ctx.moveTo(dl*i*Math.cos(dataang), dl*i*Math.sin(dataang));
                ctx.lineWidth = templ;
                ctx.lineTo(dl*(i+1)*Math.cos(dataang), dl*(i+1)*Math.sin(dataang));
                ctx.stroke();
            }
            
            ctx.restore();
        }
        else {
            this._center = [(cw - trans * offx)/2 + trans * offx, (ch - trans*offy)/2 + trans * offy];
        }               
    };
    
    $.jqplot.MeterGaugeAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.MeterGaugeAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.MeterGaugeAxisRenderer.prototype.constructor = $.jqplot.MeterGaugeAxisRenderer;
        
    
    // There are no traditional axes on a gauge chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.MeterGaugeAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.MeterGaugeTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false; 
    };
    
    $.jqplot.MeterGaugeLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.MeterGaugeLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.MeterGaugeLegendRenderer.prototype.constructor = $.jqplot.MeterGaugeLegendRenderer;
    
    /**
     * Class: $.jqplot.MeterGaugeLegendRenderer
     *Meter gauges don't typically have a legend, this overrides the default legend renderer.
     */
    $.jqplot.MeterGaugeLegendRenderer.prototype.init = function(options) {
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with context of legend
    $.jqplot.MeterGaugeLegendRenderer.prototype.draw = function() {
        if (this.show) {
            var series = this._series;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            ss += (this.marginTop != null) ? 'margin-top:'+this.marginTop+';' : '';
            ss += (this.marginBottom != null) ? 'margin-bottom:'+this.marginBottom+';' : '';
            ss += (this.marginLeft != null) ? 'margin-left:'+this.marginLeft+';' : '';
            ss += (this.marginRight != null) ? 'margin-right:'+this.marginRight+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
            // MeterGauge charts legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = false,
                nr, nc;
            var s = series[0];
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j, tr, td1, td2, lt, rs, color;
                var idx = 0;    
                
                for (i=0; i<nr; i++) {
                    if (reverse){
                        tr = $('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem);
                    }
                    else{
                        tr = $('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);
                    }
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length){
                            // debugger
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = s.color;
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';
                
                            td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                                '<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+
                                '</div></td>');
                            td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }
            }
        }
        return this._elem;                
    };
    
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        // debugger
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        options.grid = options.grid || {};
           
        // only set these if there is a gauge series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.MeterGaugeRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.MeterGaugeRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.MeterGaugeAxisRenderer;
            options.legend.renderer = $.jqplot.MeterGaugeLegendRenderer;
            options.legend.preDraw = true;
            options.grid.background = options.grid.background || 'white';
            options.grid.drawGridlines = false;
            options.grid.borderWidth = (options.grid.borderWidth != null) ? options.grid.borderWidth : 0;
            options.grid.shadow = (options.grid.shadow != null) ? options.grid.shadow : false;
        }
    }
    
    // called with scope of plot
    function postParseOptions(options) {
        //
    }
    
    $.jqplot.preInitHooks.push(preInit);
    $.jqplot.postParseOptionsHooks.push(postParseOptions);
    
    $.jqplot.MeterGaugeTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.MeterGaugeTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.MeterGaugeTickRenderer.prototype.constructor = $.jqplot.MeterGaugeTickRenderer;
    
})(jQuery);
    
    

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(c){c.jqplot.MeterGaugeRenderer=function(){c.jqplot.LineRenderer.call(this)};c.jqplot.MeterGaugeRenderer.prototype=new c.jqplot.LineRenderer();c.jqplot.MeterGaugeRenderer.prototype.constructor=c.jqplot.MeterGaugeRenderer;c.jqplot.MeterGaugeRenderer.prototype.init=function(e){this.diameter=null;this.padding=null;this.shadowOffset=2;this.shadowAlpha=0.07;this.shadowDepth=4;this.background="#efefef";this.ringColor="#BBC6D0";this.needleColor="#C3D3E5";this.tickColor="#989898";this.ringWidth=null;this.min;this.max;this.ticks=[];this.showTicks=true;this.showTickLabels=true;this.label=null;this.labelHeightAdjust=0;this.labelPosition="inside";this.intervals=[];this.intervalColors=["#4bb2c5","#EAA228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3","#bd70c7"];this.intervalInnerRadius=null;this.intervalOuterRadius=null;this.tickRenderer=c.jqplot.MeterGaugeTickRenderer;this.tickPositions=[1,2,2.5,5,10];this.tickSpacing=30;this.numberMinorTicks=null;this.hubRadius=null;this.tickPadding=null;this.needleThickness=null;this.needlePad=6;this.pegNeedle=true;this._type="meterGauge";c.extend(true,this,e);this.type=null;this.numberTicks=null;this.tickInterval=null;this.span=180;if(this.type=="circular"){this.semiCircular=false}else{if(this.type!="circular"){this.semiCircular=true}else{this.semiCircular=(this.span<=180)?true:false}}this._tickPoints=[];this._labelElem=null;this.startAngle=(90+(360-this.span)/2)*Math.PI/180;this.endAngle=(90-(360-this.span)/2)*Math.PI/180;this.setmin=!!(this.min==null);this.setmax=!!(this.max==null);if(this.intervals.length){if(this.intervals[0].length==null||this.intervals.length==1){for(var f=0;f<this.intervals.length;f++){this.intervals[f]=[this.intervals[f],this.intervals[f],this.intervalColors[f]]}}else{if(this.intervals[0].length==2){for(f=0;f<this.intervals.length;f++){this.intervals[f]=[this.intervals[f][0],this.intervals[f][1],this.intervalColors[f]]}}}}if(this.ticks.length){if(this.ticks[0].length==null||this.ticks[0].length==1){for(var f=0;f<this.ticks.length;f++){this.ticks[f]=[this.ticks[f],this.ticks[f]]}}this.min=(this.min==null)?this.ticks[0][0]:this.min;this.max=(this.max==null)?this.ticks[this.ticks.length-1][0]:this.max;this.setmin=false;this.setmax=false;this.numberTicks=this.ticks.length;this.tickInterval=this.ticks[1][0]-this.ticks[0][0];this.tickFactor=Math.floor(parseFloat((Math.log(this.tickInterval)/Math.log(10)).toFixed(11)));this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor);if(!this.numberMinorTicks){this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor-1)}if(!this.numberMinorTicks){this.numberMinorTicks=1}}else{if(this.intervals.length){this.min=(this.min==null)?0:this.min;this.setmin=false;if(this.max==null){if(this.intervals[this.intervals.length-1][0]>=this.data[0][1]){this.max=this.intervals[this.intervals.length-1][0];this.setmax=false}}else{this.setmax=false}}else{this.min=(this.min==null)?0:this.min;this.setmin=false;if(this.max==null){this.max=this.data[0][1]*1.25;this.setmax=true}else{this.setmax=false}}}};c.jqplot.MeterGaugeRenderer.prototype.setGridData=function(j){var f=[];var k=[];var e=this.startAngle;for(var h=0;h<this.data.length;h++){f.push(this.data[h][1]);k.push([this.data[h][0]]);if(h>0){f[h]+=f[h-1]}}var g=Math.PI*2/f[f.length-1];for(var h=0;h<f.length;h++){k[h][1]=f[h]*g}this.gridData=k};c.jqplot.MeterGaugeRenderer.prototype.makeGridData=function(j,k){var f=[];var l=[];var e=this.startAngle;for(var h=0;h<j.length;h++){f.push(j[h][1]);l.push([j[h][0]]);if(h>0){f[h]+=f[h-1]}}var g=Math.PI*2/f[f.length-1];for(var h=0;h<f.length;h++){l[h][1]=f[h]*g}return l};function b(j,f,g){var e;for(var h=j.length-1;h>=0;h--){e=f/(j[h]*Math.pow(10,g));if(e==4||e==5){return e-1}}return null}c.jqplot.MeterGaugeRenderer.prototype.draw=function(X,aC,ap){var aa;var aM=(ap!=undefined)?ap:{};var ai=0;var ah=0;var at=1;if(ap.legendInfo&&ap.legendInfo.placement=="inside"){var aI=ap.legendInfo;switch(aI.location){case"nw":ai=aI.width+aI.xoffset;break;case"w":ai=aI.width+aI.xoffset;break;case"sw":ai=aI.width+aI.xoffset;break;case"ne":ai=aI.width+aI.xoffset;at=-1;break;case"e":ai=aI.width+aI.xoffset;at=-1;break;case"se":ai=aI.width+aI.xoffset;at=-1;break;case"n":ah=aI.height+aI.yoffset;break;case"s":ah=aI.height+aI.yoffset;at=-1;break;default:break}}if(this.label){this._labelElem=c('<div class="jqplot-meterGauge-label" style="position:absolute;">'+this.label+"</div>");this.canvas._elem.after(this._labelElem)}var m=(aM.shadow!=undefined)?aM.shadow:this.shadow;var N=(aM.showLine!=undefined)?aM.showLine:this.showLine;var I=(aM.fill!=undefined)?aM.fill:this.fill;var K=X.canvas.width;var S=X.canvas.height;if(this.padding==null){this.padding=Math.round(Math.min(K,S)/30)}var Q=K-ai-2*this.padding;var ab=S-ah-2*this.padding;if(this.labelPosition=="bottom"&&this.label){ab-=this._labelElem.outerHeight(true)}var L=Math.min(Q,ab);var ad=L;if(!this.diameter){if(this.semiCircular){if(Q>=2*ab){if(!this.ringWidth){this.ringWidth=2*ab/35}this.needleThickness=this.needleThickness||2+Math.pow(this.ringWidth,0.8);this.innerPad=this.ringWidth/2+this.needleThickness/2+this.needlePad;this.diameter=2*(ab-2*this.innerPad)}else{if(!this.ringWidth){this.ringWidth=Q/35}this.needleThickness=this.needleThickness||2+Math.pow(this.ringWidth,0.8);this.innerPad=this.ringWidth/2+this.needleThickness/2+this.needlePad;this.diameter=Q-2*this.innerPad-this.ringWidth-this.padding}this._center=[(K-at*ai)/2+at*ai,(S+at*ah-this.padding-this.ringWidth-this.innerPad)]}else{if(!this.ringWidth){this.ringWidth=ad/35}this.needleThickness=this.needleThickness||2+Math.pow(this.ringWidth,0.8);this.innerPad=0;this.diameter=ad-this.ringWidth;this._center=[(K-at*ai)/2+at*ai,(S-at*ah)/2+at*ah]}if(this._labelElem&&this.labelPosition=="bottom"){this._center[1]-=this._labelElem.outerHeight(true)}}this._radius=this.diameter/2;this.tickSpacing=6000/this.diameter;if(!this.hubRadius){this.hubRadius=this.diameter/18}this.shadowOffset=0.5+this.ringWidth/9;this.shadowWidth=this.ringWidth*1;this.tickPadding=3+Math.pow(this.diameter/20,0.7);this.tickOuterRadius=this._radius-this.ringWidth/2-this.tickPadding;this.tickLength=(this.showTicks)?this._radius/13:0;if(this.ticks.length==0){var A=this.max,aL=this.min,q=this.setmax,aG=this.setmin,au=(A-aL)*this.tickSpacing/this.span;var aw=Math.floor(parseFloat((Math.log(au)/Math.log(10)).toFixed(11)));var an=(au/Math.pow(10,aw));(an>2&&an<=2.5)?an=2.5:an=Math.ceil(an);var T=this.tickPositions;var aA,ak;for(aa=0;aa<T.length;aa++){if(an==T[aa]||aa&&T[aa-1]<an&&an<T[aa]){au=T[aa]*Math.pow(10,aw);aA=aa}}for(aa=0;aa<T.length;aa++){if(an==T[aa]||aa&&T[aa-1]<an&&an<T[aa]){au=T[aa]*Math.pow(10,aw);ak=Math.ceil((A-aL)/au)}}if(q&&aG){var aP=(aL>0)?aL-aL%au:aL-aL%au-au;if(!this.forceZero){var D=Math.min(aL-aP,0.8*au);var o=Math.floor(D/T[aA]);if(o>1){aP=aP+T[aA]*(o-1);if(parseInt(aP,10)!=aP&&parseInt(aP-T[aA],10)==aP-T[aA]){aP=aP-T[aA]}}}if(aL==aP){aL-=au}else{if(aL-aP>0.23*au){aL=aP}else{aL=aP-au;ak+=1}}ak+=1;var E=aL+(ak-1)*au;if(A>=E){E+=au;ak+=1}if(E-A<0.23*au){E+=au;ak+=1}this.max=A=E;this.min=aL;this.tickInterval=au;this.numberTicks=ak;var O;for(aa=0;aa<ak;aa++){O=parseFloat((aL+aa*au).toFixed(11));this.ticks.push([O,O])}this.max=this.ticks[ak-1][1];this.tickFactor=aw;this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor);if(!this.numberMinorTicks){this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor-1)}}else{if(q){var E=aL+(ak-1)*au;if(A>=E){A=E+au;ak+=1}else{A=E}this.tickInterval=this.tickInterval||au;this.numberTicks=this.numberTicks||ak;var O;for(aa=0;aa<this.numberTicks;aa++){O=parseFloat((aL+aa*this.tickInterval).toFixed(11));this.ticks.push([O,O])}this.max=this.ticks[this.numberTicks-1][1];this.tickFactor=aw;this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor);if(!this.numberMinorTicks){this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor-1)}}}if(!q&&!aG){var P=this.max-this.min;aw=Math.floor(parseFloat((Math.log(P)/Math.log(10)).toFixed(11)))-1;var aN=[5,6,4,7,3,8,9,10,2],V,C,av=0,M;if(P>1){var aJ=String(P);if(aJ.search(/\./)==-1){var aF=aJ.search(/0+$/);av=(aF>0)?aJ.length-aF-1:0}}M=P/Math.pow(10,av);for(aa=0;aa<aN.length;aa++){V=M/(aN[aa]-1);if(V==parseInt(V,10)){this.numberTicks=aN[aa];this.tickInterval=P/(this.numberTicks-1);this.tickFactor=aw+1;break}}var O;for(aa=0;aa<this.numberTicks;aa++){O=parseFloat((this.min+aa*this.tickInterval).toFixed(11));this.ticks.push([O,O])}this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor);if(!this.numberMinorTicks){this.numberMinorTicks=b(this.tickPositions,this.tickInterval,this.tickFactor-1)}if(!this.numberMinorTicks){this.numberMinorTicks=1;var aH=[4,5,3,6,2];for(aa=0;aa<5;aa++){var ao=this.tickInterval/aH[aa];if(ao==parseInt(ao,10)){this.numberMinorTicks=aH[aa]-1;break}}}}}var U=this._radius,aE=this.startAngle,k=this.endAngle,H=Math.PI,e=Math.PI/2;if(this.semiCircular){var z=Math.atan(this.innerPad/U),ac=this.outerStartAngle=aE-z,aB=this.outerEndAngle=k+z,B=this.hubStartAngle=aE-Math.atan(this.innerPad/this.hubRadius*2),af=this.hubEndAngle=k+Math.atan(this.innerPad/this.hubRadius*2);X.save();X.translate(this._center[0],this._center[1]);X.lineJoin="round";X.lineCap="round";X.save();X.beginPath();X.fillStyle=this.background;X.arc(0,0,U,ac,aB,false);X.closePath();X.fill();X.restore();var aj="rgba(0,0,0,"+this.shadowAlpha+")";X.save();for(var aa=0;aa<this.shadowDepth;aa++){X.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI),this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));X.beginPath();X.strokeStyle=aj;X.lineWidth=this.shadowWidth;X.arc(0,0,U,ac,aB,false);X.closePath();X.stroke()}X.restore();X.save();var az=parseInt((this.shadowDepth+1)/2,10);for(var aa=0;aa<az;aa++){X.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI),this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));X.beginPath();X.fillStyle=aj;X.arc(0,0,this.hubRadius,B,af,false);X.closePath();X.fill()}X.restore();X.save();X.beginPath();X.strokeStyle=this.ringColor;X.lineWidth=this.ringWidth;X.arc(0,0,U,ac,aB,false);X.closePath();X.stroke();X.restore();X.save();X.beginPath();X.fillStyle=this.ringColor;X.arc(0,0,this.hubRadius,B,af,false);X.closePath();X.fill();X.restore();if(this.showTicks){X.save();var f=this.tickOuterRadius,aq=this.tickLength,v=aq/2,F=this.numberMinorTicks,am=this.span*Math.PI/180/(this.ticks.length-1),p=am/(F+1);for(aa=0;aa<this.ticks.length;aa++){X.beginPath();X.lineWidth=1.5+this.diameter/360;X.strokeStyle=this.ringColor;var ae=am*aa+aE;X.moveTo(-f*Math.cos(am*aa+aE),f*Math.sin(am*aa+aE));X.lineTo(-(f-aq)*Math.cos(am*aa+aE),(f-aq)*Math.sin(am*aa+aE));this._tickPoints.push([(f-aq)*Math.cos(am*aa+aE)+this._center[0]+this.canvas._offsets.left,(f-aq)*Math.sin(am*aa+aE)+this._center[1]+this.canvas._offsets.top,am*aa+aE]);X.stroke();X.lineWidth=1+this.diameter/440;if(aa<this.ticks.length-1){for(var Y=1;Y<=F;Y++){X.beginPath();X.moveTo(-f*Math.cos(am*aa+p*Y+aE),f*Math.sin(am*aa+p*Y+aE));X.lineTo(-(f-v)*Math.cos(am*aa+p*Y+aE),(f-v)*Math.sin(am*aa+p*Y+aE));X.stroke()}}}X.restore()}if(this.showTickLabels){var J,W,T,aO,g,G,n=0;var an=this.tickPadding*(1-1/(this.diameter/80+1));for(aa=0;aa<this.ticks.length;aa++){J=c('<div class="jqplot-meterGauge-tick" style="position:absolute;">'+this.ticks[aa][1]+"</div>");this.canvas._elem.after(J);aO=J.outerWidth(true);g=J.outerHeight(true);W=this._tickPoints[aa][0]-aO*(this._tickPoints[aa][2]-Math.PI)/Math.PI-an*Math.cos(this._tickPoints[aa][2]);T=this._tickPoints[aa][1]-g/2+g/2*Math.pow(Math.abs((Math.sin(this._tickPoints[aa][2]))),0.5)+an/3*Math.pow(Math.abs((Math.sin(this._tickPoints[aa][2]))),0.5);J.css({left:W,top:T,color:this.tickColor});G=aO*Math.cos(this._tickPoints[aa][2])+g*Math.sin(Math.PI/2+this._tickPoints[aa][2]/2);n=(G>n)?G:n}}if(this.label&&this.labelPosition=="inside"){var W=this._center[0]+this.canvas._offsets.left;var an=this.tickPadding*(1-1/(this.diameter/80+1));var T=0.5*(this._center[1]+this.canvas._offsets.top-this.hubRadius)+0.5*(this._center[1]+this.canvas._offsets.top-this.tickOuterRadius+this.tickLength+an)+this.labelHeightAdjust;W-=this._labelElem.outerWidth(true)/2;T-=this._labelElem.outerHeight(true)/2;this._labelElem.css({left:W,top:T})}else{if(this.label&&this.labelPosition=="bottom"){var W=this._center[0]+this.canvas._offsets.left-this._labelElem.outerWidth(true)/2;var T=this._center[1]+this.canvas._offsets.top+this.innerPad+this.ringWidth+this.padding+this.labelHeightAdjust;this._labelElem.css({left:W,top:T})}}X.save();var ax=this.intervalInnerRadius||this.hubRadius*1.5;if(this.intervalOuterRadius==null){if(this.showTickLabels){var ag=(this.tickOuterRadius-this.tickLength-this.tickPadding-this.diameter/8)}else{var ag=(this.tickOuterRadius-this.tickLength-this.diameter/16)}}else{var ag=this.intervalOuterRadius}var P=this.max-this.min;var aD=this.intervals[this.intervals.length-1]-this.min;var y,Z,u=this.span*Math.PI/180;for(aa=0;aa<this.intervals.length;aa++){y=(aa==0)?aE:aE+(this.intervals[aa-1][0]-this.min)*u/P;if(y<0){y=0}Z=aE+(this.intervals[aa][0]-this.min)*u/P;if(Z<0){Z=0}X.beginPath();X.fillStyle=this.intervals[aa][2];X.arc(0,0,ax,y,Z,false);X.lineTo(ag*Math.cos(Z),ag*Math.sin(Z));X.arc(0,0,ag,Z,y,true);X.lineTo(ax*Math.cos(y),ax*Math.sin(y));X.closePath();X.fill()}X.restore();var ay=this.data[0][1];var R=this.max-this.min;if(this.pegNeedle){if(this.data[0][1]>this.max+R*3/this.span){ay=this.max+R*3/this.span}if(this.data[0][1]<this.min-R*3/this.span){ay=this.min-R*3/this.span}}var al=(ay-this.min)/R*this.span*Math.PI/180+this.startAngle;X.save();X.beginPath();X.fillStyle=this.ringColor;X.strokeStyle=this.ringColor;this.needleLength=(this.tickOuterRadius-this.tickLength)*0.85;this.needleThickness=(this.needleThickness<2)?2:this.needleThickness;var aK=this.needleThickness*0.4;var x=this.needleLength/10;var s=(this.needleThickness-aK)/10;var ar;for(var aa=0;aa<10;aa++){ar=this.needleThickness-aa*s;X.moveTo(x*aa*Math.cos(al),x*aa*Math.sin(al));X.lineWidth=ar;X.lineTo(x*(aa+1)*Math.cos(al),x*(aa+1)*Math.sin(al));X.stroke()}X.restore()}else{this._center=[(K-at*ai)/2+at*ai,(S-at*ah)/2+at*ah]}};c.jqplot.MeterGaugeAxisRenderer=function(){c.jqplot.LinearAxisRenderer.call(this)};c.jqplot.MeterGaugeAxisRenderer.prototype=new c.jqplot.LinearAxisRenderer();c.jqplot.MeterGaugeAxisRenderer.prototype.constructor=c.jqplot.MeterGaugeAxisRenderer;c.jqplot.MeterGaugeAxisRenderer.prototype.init=function(e){this.tickRenderer=c.jqplot.MeterGaugeTickRenderer;c.extend(true,this,e);this._dataBounds={min:0,max:100};this.min=0;this.max=100;this.showTicks=false;this.ticks=[];this.showMark=false;this.show=false};c.jqplot.MeterGaugeLegendRenderer=function(){c.jqplot.TableLegendRenderer.call(this)};c.jqplot.MeterGaugeLegendRenderer.prototype=new c.jqplot.TableLegendRenderer();c.jqplot.MeterGaugeLegendRenderer.prototype.constructor=c.jqplot.MeterGaugeLegendRenderer;c.jqplot.MeterGaugeLegendRenderer.prototype.init=function(e){this.numberRows=null;this.numberColumns=null;c.extend(true,this,e)};c.jqplot.MeterGaugeLegendRenderer.prototype.draw=function(){if(this.show){var p=this._series;var x="position:absolute;";x+=(this.background)?"background:"+this.background+";":"";x+=(this.border)?"border:"+this.border+";":"";x+=(this.fontSize)?"font-size:"+this.fontSize+";":"";x+=(this.fontFamily)?"font-family:"+this.fontFamily+";":"";x+=(this.textColor)?"color:"+this.textColor+";":"";x+=(this.marginTop!=null)?"margin-top:"+this.marginTop+";":"";x+=(this.marginBottom!=null)?"margin-bottom:"+this.marginBottom+";":"";x+=(this.marginLeft!=null)?"margin-left:"+this.marginLeft+";":"";x+=(this.marginRight!=null)?"margin-right:"+this.marginRight+";":"";this._elem=c('<table class="jqplot-table-legend" style="'+x+'"></table>');var f=false,q=false,u,o;var w=p[0];if(w.show){var t=w.data;if(this.numberRows){u=this.numberRows;if(!this.numberColumns){o=Math.ceil(t.length/u)}else{o=this.numberColumns}}else{if(this.numberColumns){o=this.numberColumns;u=Math.ceil(t.length/this.numberColumns)}else{u=t.length;o=1}}var n,m,r,g,e,l,k,h;var v=0;for(n=0;n<u;n++){if(q){r=c('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem)}else{r=c('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem)}for(m=0;m<o;m++){if(v<t.length){l=this.labels[v]||t[v][0].toString();h=w.color;if(!q){if(n>0){f=true}else{f=false}}else{if(n==u-1){f=false}else{f=true}}k=(f)?this.rowSpacing:"0";g=c('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+k+';"><div><div class="jqplot-table-legend-swatch" style="border-color:'+h+';"></div></div></td>');e=c('<td class="jqplot-table-legend" style="padding-top:'+k+';"></td>');if(this.escapeHtml){e.text(l)}else{e.html(l)}if(q){e.prependTo(r);g.prependTo(r)}else{g.appendTo(r);e.appendTo(r)}f=true}v++}}}}return this._elem};function a(j,h,f){f=f||{};f.axesDefaults=f.axesDefaults||{};f.legend=f.legend||{};f.seriesDefaults=f.seriesDefaults||{};f.grid=f.grid||{};var e=false;if(f.seriesDefaults.renderer==c.jqplot.MeterGaugeRenderer){e=true}else{if(f.series){for(var g=0;g<f.series.length;g++){if(f.series[g].renderer==c.jqplot.MeterGaugeRenderer){e=true}}}}if(e){f.axesDefaults.renderer=c.jqplot.MeterGaugeAxisRenderer;f.legend.renderer=c.jqplot.MeterGaugeLegendRenderer;f.legend.preDraw=true;f.grid.background=f.grid.background||"white";f.grid.drawGridlines=false;f.grid.borderWidth=(f.grid.borderWidth!=null)?f.grid.borderWidth:0;f.grid.shadow=(f.grid.shadow!=null)?f.grid.shadow:false}}function d(e){}c.jqplot.preInitHooks.push(a);c.jqplot.postParseOptionsHooks.push(d);c.jqplot.MeterGaugeTickRenderer=function(){c.jqplot.AxisTickRenderer.call(this)};c.jqplot.MeterGaugeTickRenderer.prototype=new c.jqplot.AxisTickRenderer();c.jqplot.MeterGaugeTickRenderer.prototype.constructor=c.jqplot.MeterGaugeTickRenderer})(jQuery);
/**
 * jqplot.jquerymobile plugin
 * jQuery Mobile virtual event support.
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2011 Takashi Okamoto
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 */
(function($) {
    function postInit(target, data, options){
        this.bindCustomEvents = function() {
            this.eventCanvas._elem.bind('vclick', {plot:this}, this.onClick);
            this.eventCanvas._elem.bind('dblclick', {plot:this}, this.onDblClick);
            this.eventCanvas._elem.bind('taphold', {plot:this}, this.onDblClick);
            this.eventCanvas._elem.bind('vmousedown', {plot:this}, this.onMouseDown);
            this.eventCanvas._elem.bind('vmousemove', {plot:this}, this.onMouseMove);
            this.eventCanvas._elem.bind('mouseenter', {plot:this}, this.onMouseEnter);
            this.eventCanvas._elem.bind('mouseleave', {plot:this}, this.onMouseLeave);
            if (this.captureRightClick) {
                this.eventCanvas._elem.bind('vmouseup', {plot:this}, this.onRightClick);
                this.eventCanvas._elem.get(0).oncontextmenu = function() {
                    return false;
                };
            }
            else {
                this.eventCanvas._elem.bind('vmouseup', {plot:this}, this.onMouseUp);
            }
        };
        this.plugins.mobile = true;
    }
    $.jqplot.postInitHooks.push(postInit);
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(b){function a(e,d,c){this.bindCustomEvents=function(){this.eventCanvas._elem.bind("vclick",{plot:this},this.onClick);this.eventCanvas._elem.bind("dblclick",{plot:this},this.onDblClick);this.eventCanvas._elem.bind("taphold",{plot:this},this.onDblClick);this.eventCanvas._elem.bind("vmousedown",{plot:this},this.onMouseDown);this.eventCanvas._elem.bind("vmousemove",{plot:this},this.onMouseMove);this.eventCanvas._elem.bind("mouseenter",{plot:this},this.onMouseEnter);this.eventCanvas._elem.bind("mouseleave",{plot:this},this.onMouseLeave);if(this.captureRightClick){this.eventCanvas._elem.bind("vmouseup",{plot:this},this.onRightClick);this.eventCanvas._elem.get(0).oncontextmenu=function(){return false}}else{this.eventCanvas._elem.bind("vmouseup",{plot:this},this.onMouseUp)}};this.plugins.mobile=true}b.jqplot.postInitHooks.push(a)})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.OHLCRenderer
     * jqPlot Plugin to draw Open Hi Low Close, Candlestick and Hi Low Close charts.
     * 
     * To use this plugin, include the renderer js file in 
     * your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.ohlcRenderer.js"></script>
     * 
     * You will most likely want to use a date axis renderer
     * for the x axis also, so include the date axis render js file also:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.dateAxisRenderer.js"></script>
     * 
     * Then you set the renderer in the series options on your plot:
     * 
     * > series: [{renderer:$.jqplot.OHLCRenderer}]
     * 
     * For OHLC and candlestick charts, data should be specified
     * like so:
     * 
     * > dat = [['07/06/2009',138.7,139.68,135.18,135.4], ['06/29/2009',143.46,144.66,139.79,140.02], ...]
     * 
     * If the data array has only 4 values per point instead of 5,
     * the renderer will create a Hi Low Close chart instead.  In that case,
     * data should be supplied like:
     * 
     * > dat = [['07/06/2009',139.68,135.18,135.4], ['06/29/2009',144.66,139.79,140.02], ...]
     * 
     * To generate a candlestick chart instead of an OHLC chart,
     * set the "candlestick" option to true:
     * 
     * > series: [{renderer:$.jqplot.OHLCRenderer, rendererOptions:{candleStick:true}}],
     * 
     */
    $.jqplot.OHLCRenderer = function(){
        // subclass line renderer to make use of some of its methods.
        $.jqplot.LineRenderer.call(this);
        // prop: candleStick
        // true to render chart as candleStick.
        // Must have an open price, cannot be a hlc chart.
        this.candleStick = false;
        // prop: tickLength
        // length of the line in pixels indicating open and close price.
        // Default will auto calculate based on plot width and 
        // number of points displayed.
        this.tickLength = 'auto';
        // prop: bodyWidth
        // width of the candlestick body in pixels.  Default will auto calculate
        // based on plot width and number of candlesticks displayed.
        this.bodyWidth = 'auto';
        // prop: openColor
        // color of the open price tick mark.  Default is series color.
        this.openColor = null;
        // prop: closeColor
        // color of the close price tick mark.  Default is series color.
        this.closeColor = null;
        // prop: wickColor
        // color of the hi-lo line thorugh the candlestick body.
        // Default is the series color.
        this.wickColor = null;
        // prop: fillUpBody
        // true to render an "up" day (close price greater than open price)
        // with a filled candlestick body.
        this.fillUpBody = false;
        // prop: fillDownBody
        // true to render a "down" day (close price lower than open price)
        // with a filled candlestick body.
        this.fillDownBody = true;
        // prop: upBodyColor
        // Color of candlestick body of an "up" day.  Default is series color.
        this.upBodyColor = null;
        // prop: downBodyColor
        // Color of candlestick body on a "down" day.  Default is series color.
        this.downBodyColor = null;
        // prop: hlc
        // true if is a hi-low-close chart (no open price).
        // This is determined automatically from the series data.
        this.hlc = false;
        // prop: lineWidth
        // Width of the hi-low line and open/close ticks.
        // Must be set in the rendererOptions for the series.
        this.lineWidth = 1.5;
        this._tickLength;
        this._bodyWidth;
    };
    
    $.jqplot.OHLCRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.OHLCRenderer.prototype.constructor = $.jqplot.OHLCRenderer;
    
    // called with scope of series.
    $.jqplot.OHLCRenderer.prototype.init = function(options) {
        options = options || {};
        // lineWidth has to be set on the series, changes in renderer
        // constructor have no effect.  set the default here
        // if no renderer option for lineWidth is specified.
        this.lineWidth = options.lineWidth || 1.5;
        $.jqplot.LineRenderer.prototype.init.call(this, options);
        this._type = 'ohlc';
        // set the yaxis data bounds here to account for hi and low values
        var db = this._yaxis._dataBounds;
        var d = this._plotData;
        // if data points have less than 5 values, force a hlc chart.
        if (d[0].length < 5) {
            this.renderer.hlc = true;

            for (var j=0; j<d.length; j++) { 
                if (d[j][2] < db.min || db.min == null) {
                    db.min = d[j][2];
                }
                if (d[j][1] > db.max || db.max == null) {
                    db.max = d[j][1];
                }             
            }
        }
        else {
            for (var j=0; j<d.length; j++) { 
                if (d[j][3] < db.min || db.min == null) {
                    db.min = d[j][3];
                }
                if (d[j][2] > db.max || db.max == null) {
                    db.max = d[j][2];
                }             
            }
        }
        
    };
    
    // called within scope of series.
    $.jqplot.OHLCRenderer.prototype.draw = function(ctx, gd, options) {
        var d = this.data;
        var xmin = this._xaxis.min;
        var xmax = this._xaxis.max;
        // index of last value below range of plot.
        var xminidx = 0;
        // index of first value above range of plot.
        var xmaxidx = d.length;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var i, prevColor, ops, b, h, w, a, points;
        var o;
        var r = this.renderer;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        r.bodyWidth = (opts.bodyWidth != undefined) ? opts.bodyWidth : r.bodyWidth;
        r.tickLength = (opts.tickLength != undefined) ? opts.tickLength : r.tickLength;
        ctx.save();
        if (this.show) {
            var x, open, hi, low, close;
            // need to get widths based on number of points shown,
            // not on total number of points.  Use the results 
            // to speed up drawing in next step.
            for (var i=0; i<d.length; i++) {
                if (d[i][0] < xmin) {
                    xminidx = i;
                }
                else if (d[i][0] < xmax) {
                    xmaxidx = i+1;
                }
            }

            var dwidth = this.gridData[xmaxidx-1][0] - this.gridData[xminidx][0];
            var nvisiblePoints = xmaxidx - xminidx;
            try {
                var dinterval = Math.abs(this._xaxis.series_u2p(parseInt(this._xaxis._intervalStats[0].sortedIntervals[0].interval, 10)) - this._xaxis.series_u2p(0)); 
            }

            catch (e) {
                var dinterval = dwidth / nvisiblePoints;
            }
            
            if (r.candleStick) {
                if (typeof(r.bodyWidth) == 'number') {
                    r._bodyWidth = r.bodyWidth;
                }
                else {
                    r._bodyWidth = Math.min(20, dinterval/1.65);
                }
            }
            else {
                if (typeof(r.tickLength) == 'number') {
                    r._tickLength = r.tickLength;
                }
                else {
                    r._tickLength = Math.min(10, dinterval/3.5);
                }
            }
            
            for (var i=xminidx; i<xmaxidx; i++) {
                x = xp(d[i][0]);
                if (r.hlc) {
                    open = null;
                    hi = yp(d[i][1]);
                    low = yp(d[i][2]);
                    close = yp(d[i][3]);
                }
                else {
                    open = yp(d[i][1]);
                    hi = yp(d[i][2]);
                    low = yp(d[i][3]);
                    close = yp(d[i][4]);
                }
                o = {};
                if (r.candleStick && !r.hlc) {
                    w = r._bodyWidth;
                    a = x - w/2;
                    // draw candle
                    // determine if candle up or down
                    // up, remember grid coordinates increase downward
                    if (close < open) {
                        // draw wick
                        if (r.wickColor) {
                            o.color = r.wickColor;
                        }
                        else if (r.downBodyColor) {
                            o.color = r.upBodyColor;
                        }
                        ops = $.extend(true, {}, opts, o);
                        r.shapeRenderer.draw(ctx, [[x, hi], [x, close]], ops); 
                        r.shapeRenderer.draw(ctx, [[x, open], [x, low]], ops); 
                        o = {};
                        b = close;
                        h = open - close;
                        // if color specified, use it
                        if (r.fillUpBody) {
                            o.fillRect = true;
                        }
                        else {
                            o.strokeRect = true;
                            w = w - this.lineWidth;
                            a = x - w/2;
                        }
                        if (r.upBodyColor) {
                            o.color = r.upBodyColor;
                            o.fillStyle = r.upBodyColor;
                        }
                        points = [a, b, w, h];
                    }
                    // down
                    else if (close >  open) {
                        // draw wick
                        if (r.wickColor) {
                            o.color = r.wickColor;
                        }
                        else if (r.downBodyColor) {
                            o.color = r.downBodyColor;
                        }
                        ops = $.extend(true, {}, opts, o);
                        r.shapeRenderer.draw(ctx, [[x, hi], [x, open]], ops); 
                        r.shapeRenderer.draw(ctx, [[x, close], [x, low]], ops);
                         
                        o = {};
                        
                        b = open;
                        h = close - open;
                        // if color specified, use it
                        if (r.fillDownBody) {
                            o.fillRect = true;
                        }
                        else {
                            o.strokeRect = true;
                            w = w - this.lineWidth;
                            a = x - w/2;
                        }
                        if (r.downBodyColor) {
                            o.color = r.downBodyColor;
                            o.fillStyle = r.downBodyColor;
                        }
                        points = [a, b, w, h];
                    }
                    // even, open = close
                    else  {
                        // draw wick
                        if (r.wickColor) {
                            o.color = r.wickColor;
                        }
                        ops = $.extend(true, {}, opts, o);
                        r.shapeRenderer.draw(ctx, [[x, hi], [x, low]], ops); 
                        o = {};
                        o.fillRect = false;
                        o.strokeRect = false;
                        a = [x - w/2, open];
                        b = [x + w/2, close];
                        w = null;
                        h = null;
                        points = [a, b];
                    }
                    ops = $.extend(true, {}, opts, o);
                    r.shapeRenderer.draw(ctx, points, ops);
                }
                else {
                    prevColor = opts.color;
                    if (r.openColor) {
                        opts.color = r.openColor;
                    }
                    // draw open tick
                    if (!r.hlc) {
                        r.shapeRenderer.draw(ctx, [[x-r._tickLength, open], [x, open]], opts);    
                    }
                    opts.color = prevColor;
                    // draw wick
                    if (r.wickColor) {
                        opts.color = r.wickColor;
                    }
                    r.shapeRenderer.draw(ctx, [[x, hi], [x, low]], opts); 
                    opts.color  = prevColor;
                    // draw close tick
                    if (r.closeColor) {
                        opts.color = r.closeColor;
                    }
                    r.shapeRenderer.draw(ctx, [[x, close], [x+r._tickLength, close]], opts); 
                    opts.color = prevColor;
                }
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.OHLCRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, shadows drawn with lines.
    };
    
    // called with scope of plot.
    $.jqplot.OHLCRenderer.checkOptions = function(target, data, options) {
        // provide some sensible highlighter options by default
        // These aren't good for hlc, only for ohlc or candlestick
        if (!options.highlighter) {
            options.highlighter = {
                showMarker:false,
                tooltipAxes: 'y',
                yvalues: 4,
                formatString:'<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>open:</td><td>%s</td></tr><tr><td>hi:</td><td>%s</td></tr><tr><td>low:</td><td>%s</td></tr><tr><td>close:</td><td>%s</td></tr></table>'
            };
        }
    };
    
    //$.jqplot.preInitHooks.push($.jqplot.OHLCRenderer.checkOptions);
    
})(jQuery);    

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.OHLCRenderer=function(){a.jqplot.LineRenderer.call(this);this.candleStick=false;this.tickLength="auto";this.bodyWidth="auto";this.openColor=null;this.closeColor=null;this.wickColor=null;this.fillUpBody=false;this.fillDownBody=true;this.upBodyColor=null;this.downBodyColor=null;this.hlc=false;this.lineWidth=1.5;this._tickLength;this._bodyWidth};a.jqplot.OHLCRenderer.prototype=new a.jqplot.LineRenderer();a.jqplot.OHLCRenderer.prototype.constructor=a.jqplot.OHLCRenderer;a.jqplot.OHLCRenderer.prototype.init=function(e){e=e||{};this.lineWidth=e.lineWidth||1.5;a.jqplot.LineRenderer.prototype.init.call(this,e);this._type="ohlc";var b=this._yaxis._dataBounds;var f=this._plotData;if(f[0].length<5){this.renderer.hlc=true;for(var c=0;c<f.length;c++){if(f[c][2]<b.min||b.min==null){b.min=f[c][2]}if(f[c][1]>b.max||b.max==null){b.max=f[c][1]}}}else{for(var c=0;c<f.length;c++){if(f[c][3]<b.min||b.min==null){b.min=f[c][3]}if(f[c][2]>b.max||b.max==null){b.max=f[c][2]}}}};a.jqplot.OHLCRenderer.prototype.draw=function(A,N,j){var J=this.data;var v=this._xaxis.min;var z=this._xaxis.max;var l=0;var K=J.length;var p=this._xaxis.series_u2p;var G=this._yaxis.series_u2p;var D,E,f,M,F,n,O,C;var y;var u=this.renderer;var s=(j!=undefined)?j:{};var k=(s.shadow!=undefined)?s.shadow:this.shadow;var B=(s.fill!=undefined)?s.fill:this.fill;var c=(s.fillAndStroke!=undefined)?s.fillAndStroke:this.fillAndStroke;u.bodyWidth=(s.bodyWidth!=undefined)?s.bodyWidth:u.bodyWidth;u.tickLength=(s.tickLength!=undefined)?s.tickLength:u.tickLength;A.save();if(this.show){var m,q,g,Q,t;for(var D=0;D<J.length;D++){if(J[D][0]<v){l=D}else{if(J[D][0]<z){K=D+1}}}var I=this.gridData[K-1][0]-this.gridData[l][0];var L=K-l;try{var P=Math.abs(this._xaxis.series_u2p(parseInt(this._xaxis._intervalStats[0].sortedIntervals[0].interval,10))-this._xaxis.series_u2p(0))}catch(H){var P=I/L}if(u.candleStick){if(typeof(u.bodyWidth)=="number"){u._bodyWidth=u.bodyWidth}else{u._bodyWidth=Math.min(20,P/1.65)}}else{if(typeof(u.tickLength)=="number"){u._tickLength=u.tickLength}else{u._tickLength=Math.min(10,P/3.5)}}for(var D=l;D<K;D++){m=p(J[D][0]);if(u.hlc){q=null;g=G(J[D][1]);Q=G(J[D][2]);t=G(J[D][3])}else{q=G(J[D][1]);g=G(J[D][2]);Q=G(J[D][3]);t=G(J[D][4])}y={};if(u.candleStick&&!u.hlc){n=u._bodyWidth;O=m-n/2;if(t<q){if(u.wickColor){y.color=u.wickColor}else{if(u.downBodyColor){y.color=u.upBodyColor}}f=a.extend(true,{},s,y);u.shapeRenderer.draw(A,[[m,g],[m,t]],f);u.shapeRenderer.draw(A,[[m,q],[m,Q]],f);y={};M=t;F=q-t;if(u.fillUpBody){y.fillRect=true}else{y.strokeRect=true;n=n-this.lineWidth;O=m-n/2}if(u.upBodyColor){y.color=u.upBodyColor;y.fillStyle=u.upBodyColor}C=[O,M,n,F]}else{if(t>q){if(u.wickColor){y.color=u.wickColor}else{if(u.downBodyColor){y.color=u.downBodyColor}}f=a.extend(true,{},s,y);u.shapeRenderer.draw(A,[[m,g],[m,q]],f);u.shapeRenderer.draw(A,[[m,t],[m,Q]],f);y={};M=q;F=t-q;if(u.fillDownBody){y.fillRect=true}else{y.strokeRect=true;n=n-this.lineWidth;O=m-n/2}if(u.downBodyColor){y.color=u.downBodyColor;y.fillStyle=u.downBodyColor}C=[O,M,n,F]}else{if(u.wickColor){y.color=u.wickColor}f=a.extend(true,{},s,y);u.shapeRenderer.draw(A,[[m,g],[m,Q]],f);y={};y.fillRect=false;y.strokeRect=false;O=[m-n/2,q];M=[m+n/2,t];n=null;F=null;C=[O,M]}}f=a.extend(true,{},s,y);u.shapeRenderer.draw(A,C,f)}else{E=s.color;if(u.openColor){s.color=u.openColor}if(!u.hlc){u.shapeRenderer.draw(A,[[m-u._tickLength,q],[m,q]],s)}s.color=E;if(u.wickColor){s.color=u.wickColor}u.shapeRenderer.draw(A,[[m,g],[m,Q]],s);s.color=E;if(u.closeColor){s.color=u.closeColor}u.shapeRenderer.draw(A,[[m,t],[m+u._tickLength,t]],s);s.color=E}}}A.restore()};a.jqplot.OHLCRenderer.prototype.drawShadow=function(b,d,c){};a.jqplot.OHLCRenderer.checkOptions=function(d,c,b){if(!b.highlighter){b.highlighter={showMarker:false,tooltipAxes:"y",yvalues:4,formatString:'<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>open:</td><td>%s</td></tr><tr><td>hi:</td><td>%s</td></tr><tr><td>low:</td><td>%s</td></tr><tr><td>close:</td><td>%s</td></tr></table>'}}}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.PieRenderer
     * Plugin renderer to draw a pie chart.
     * x values, if present, will be used as slice labels.
     * y values give slice size.
     * 
     * To use this renderer, you need to include the 
     * pie renderer plugin, for example:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.pieRenderer.js"></script>
     * 
     * Properties described here are passed into the $.jqplot function
     * as options on the series renderer.  For example:
     * 
     * > plot2 = $.jqplot('chart2', [s1, s2], {
     * >     seriesDefaults: {
     * >         renderer:$.jqplot.PieRenderer,
     * >         rendererOptions:{
     * >              sliceMargin: 2,
     * >              startAngle: -90
     * >          }
     * >      }
     * > });
     * 
     * A pie plot will trigger events on the plot target
     * according to user interaction.  All events return the event object,
     * the series index, the point (slice) index, and the point data for 
     * the appropriate slice.
     * 
     * 'jqplotDataMouseOver' - triggered when user mouseing over a slice.
     * 'jqplotDataHighlight' - triggered the first time user mouses over a slice,
     * if highlighting is enabled.
     * 'jqplotDataUnhighlight' - triggered when a user moves the mouse out of
     * a highlighted slice.
     * 'jqplotDataClick' - triggered when the user clicks on a slice.
     * 'jqplotDataRightClick' - tiggered when the user right clicks on a slice if
     * the "captureRightClick" option is set to true on the plot.
     */
    $.jqplot.PieRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.PieRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.PieRenderer.prototype.constructor = $.jqplot.PieRenderer;
    
    // called with scope of a series
    $.jqplot.PieRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: diameter
        // Outer diameter of the pie, auto computed by default
        this.diameter = null;
        // prop: padding
        // padding between the pie and plot edges, legend, etc.
        this.padding = 20;
        // prop: sliceMargin
        // angular spacing between pie slices in degrees.
        this.sliceMargin = 0;
        // prop: fill
        // true or false, whether to fil the slices.
        this.fill = true;
        // prop: shadowOffset
        // offset of the shadow from the slice and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a slice.
        this.highlightColors = [];
        // prop: dataLabels
        // Either 'label', 'value', 'percent' or an array of labels to place on the pie slices.
        // Defaults to percentage of each pie slice.
        this.dataLabels = 'percent';
        // prop: showDataLabels
        // true to show data labels on slices.
        this.showDataLabels = false;
        // prop: dataLabelFormatString
        // Format string for data labels.  If none, '%s' is used for "label" and for arrays, '%d' for value and '%d%%' for percentage.
        this.dataLabelFormatString = null;
        // prop: dataLabelThreshold
        // Threshhold in percentage (0-100) of pie area, below which no label will be displayed.
        // This applies to all label types, not just to percentage labels.
        this.dataLabelThreshold = 3;
        // prop: dataLabelPositionFactor
        // A Multiplier (0-1) of the pie radius which controls position of label on slice.
        // Increasing will slide label toward edge of pie, decreasing will slide label toward center of pie.
        this.dataLabelPositionFactor = 0.52;
        // prop: dataLabelNudge
        // Number of pixels to slide the label away from (+) or toward (-) the center of the pie.
        this.dataLabelNudge = 2;
        // prop: dataLabelCenterOn
        // True to center the data label at its position.
        // False to set the inside facing edge of the label at its position.
        this.dataLabelCenterOn = true;
        // prop: startAngle
        // Angle to start drawing pie in degrees.  
        // According to orientation of canvas coordinate system:
        // 0 = on the positive x axis
        // -90 = on the positive y axis.
        // 90 = on the negaive y axis.
        // 180 or - 180 = on the negative x axis.
        this.startAngle = 0;
        this.tickRenderer = $.jqplot.PieTickRenderer;
        // Used as check for conditions where pie shouldn't be drawn.
        this._drawData = true;
        this._type = 'pie';
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);

        if (this.sliceMargin < 0) {
            this.sliceMargin = 0;
        }

        this._diameter = null;
        this._radius = null;
        // array of [start,end] angles arrays, one for each slice.  In radians.
        this._sliceAngles = [];
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
            }
        }
        
        this.highlightColorGenerator = new $.jqplot.ColorGenerator(this.highlightColors);
        
        plot.postParseOptionsHooks.addOnce(postParseOptions);
        plot.postInitHooks.addOnce(postInit);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);
    };
    
    $.jqplot.PieRenderer.prototype.setGridData = function(plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var stack = [];
        var td = [];
        var sa = this.startAngle/180*Math.PI;
        var tot = 0;
        // don't know if we have any valid data yet, so set plot to not draw.
        this._drawData = false;
        for (var i=0; i<this.data.length; i++){
            if (this.data[i][1] != 0) {
                // we have data, O.K. to draw.
                this._drawData = true;
            }
            stack.push(this.data[i][1]);
            td.push([this.data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
            tot += this.data[i][1];
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
            td[i][2] = this.data[i][1]/tot;
        }
        this.gridData = td;
    };
    
    $.jqplot.PieRenderer.prototype.makeGridData = function(data, plot) {
        var stack = [];
        var td = [];
        var tot = 0;
        var sa = this.startAngle/180*Math.PI;
        // don't know if we have any valid data yet, so set plot to not draw.
        this._drawData = false;
        for (var i=0; i<data.length; i++){
            if (this.data[i][1] != 0) {
                // we have data, O.K. to draw.
                this._drawData = true;
            }
            stack.push(data[i][1]);
            td.push([data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
            tot += data[i][1];
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
            td[i][2] = data[i][1]/tot;
        }
        return td;
    };

    function calcRadiusAdjustment(ang) {
        return Math.sin((ang - (ang-Math.PI) / 8 / Math.PI )/2.0);
    }

    function calcRPrime(ang1, ang2, sliceMargin, fill, lineWidth) {
        var rprime = 0;
        var ang = ang2 - ang1;
        var absang = Math.abs(ang);
        var sm = sliceMargin;
        if (fill == false) {
            sm += lineWidth;
        }

        if (sm > 0 && absang > 0.01 && absang < 6.282) {
            rprime = parseFloat(sm) / 2.0 / calcRadiusAdjustment(ang);
        }

        return rprime;
    }
    
    $.jqplot.PieRenderer.prototype.drawSlice = function (ctx, ang1, ang2, color, isShadow) {
        if (this._drawData) {
            var r = this._radius;
            var fill = this.fill;
            var lineWidth = this.lineWidth;
            var sm = this.sliceMargin;
            if (this.fill == false) {
                sm += this.lineWidth;
            }
            ctx.save();
            ctx.translate(this._center[0], this._center[1]);
            
            var rprime = calcRPrime(ang1, ang2, this.sliceMargin, this.fill, this.lineWidth);

            var transx = rprime * Math.cos((ang1 + ang2) / 2.0);
            var transy = rprime * Math.sin((ang1 + ang2) / 2.0);

            if ((ang2 - ang1) <= Math.PI) {
                r -= rprime;  
            }
            else {
                r += rprime;
            }

            ctx.translate(transx, transy);
            
            if (isShadow) {
                for (var i=0, l=this.shadowDepth; i<l; i++) {
                    ctx.save();
                    ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                    doDraw(r);
                }
                for (var i=0, l=this.shadowDepth; i<l; i++) {
                    ctx.restore();
                }
            }
    
            else {
                doDraw(r);
            }
            ctx.restore();
        }
    
        function doDraw (rad) {
            // Fix for IE and Chrome that can't seem to draw circles correctly.
            // ang2 should always be <= 2 pi since that is the way the data is converted.
            // 2Pi = 6.2831853, Pi = 3.1415927
             if (ang2 > 6.282 + this.startAngle) {
                ang2 = 6.282 + this.startAngle;
                if (ang1 > ang2) {
                    ang1 = 6.281 + this.startAngle;
                }
            }
            // Fix for IE, where it can't seem to handle 0 degree angles.  Also avoids
            // ugly line on unfilled pies.
            if (ang1 >= ang2) {
                return;
            }            
        
            ctx.beginPath();  
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.arc(0, 0, rad, ang1, ang2, false);
            ctx.lineTo(0,0);
            ctx.closePath();
        
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
    };
    
    // called with scope of series
    $.jqplot.PieRenderer.prototype.draw = function (ctx, gd, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        // offset and direction of offset due to legend placement
        var offx = 0;
        var offy = 0;
        var trans = 1;
        var colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        if (options.legendInfo && options.legendInfo.placement == 'insideGrid') {
            var li = options.legendInfo;
            switch (li.location) {
                case 'nw':
                    offx = li.width + li.xoffset;
                    break;
                case 'w':
                    offx = li.width + li.xoffset;
                    break;
                case 'sw':
                    offx = li.width + li.xoffset;
                    break;
                case 'ne':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'e':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'se':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'n':
                    offy = li.height + li.yoffset;
                    break;
                case 's':
                    offy = li.height + li.yoffset;
                    trans = -1;
                    break;
                default:
                    break;
            }
        }
        
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        var w = cw - offx - 2 * this.padding;
        var h = ch - offy - 2 * this.padding;
        var mindim = Math.min(w,h);
        var d = mindim;
        
        // Fixes issue #272.  Thanks hugwijst!
        // reset slice angles array.
        this._sliceAngles = [];

        var sm = this.sliceMargin;
        if (this.fill == false) {
            sm += this.lineWidth;
        }
        
        var rprime;
        var maxrprime = 0;

        var ang, ang1, ang2, shadowColor;
        var sa = this.startAngle / 180 * Math.PI;

        // have to pre-draw shadows, so loop throgh here and calculate some values also.
        for (var i=0, l=gd.length; i<l; i++) {
            ang1 = (i == 0) ? sa : gd[i-1][1] + sa;
            ang2 = gd[i][1] + sa;

            this._sliceAngles.push([ang1, ang2]);

            rprime = calcRPrime(ang1, ang2, this.sliceMargin, this.fill, this.lineWidth);

            if (Math.abs(ang2-ang1) > Math.PI) {
                maxrprime = Math.max(rprime, maxrprime);  
            }
        }

        if (this.diameter != null && this.diameter > 0) {
            this._diameter = this.diameter - 2*maxrprime;
        }
        else {
            this._diameter = d - 2*maxrprime;
        }

        // Need to check for undersized pie.  This can happen if
        // plot area too small and legend is too big.
        if (this._diameter < 6) {
            $.jqplot.log('Diameter of pie too small, not rendering.');
            return;
        }

        var r = this._radius = this._diameter/2;

        this._center = [(cw - trans * offx)/2 + trans * offx + maxrprime * Math.cos(sa), (ch - trans*offy)/2 + trans * offy + maxrprime * Math.sin(sa)];

        if (this.shadow) {
            for (var i=0, l=gd.length; i<l; i++) {
                shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
                this.renderer.drawSlice.call (this, ctx, this._sliceAngles[i][0], this._sliceAngles[i][1], shadowColor, true);
            }
        }
        
        for (var i=0; i<gd.length; i++) {
                      
            this.renderer.drawSlice.call (this, ctx, this._sliceAngles[i][0], this._sliceAngles[i][1], colorGenerator.next(), false);
        
            if (this.showDataLabels && gd[i][2]*100 >= this.dataLabelThreshold) {
                var fstr, avgang = (this._sliceAngles[i][0] + this._sliceAngles[i][1])/2, label;
            
                if (this.dataLabels == 'label') {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, gd[i][0]);
                }
                else if (this.dataLabels == 'value') {
                    fstr = this.dataLabelFormatString || '%d';
                    label = $.jqplot.sprintf(fstr, this.data[i][1]);
                }
                else if (this.dataLabels == 'percent') {
                    fstr = this.dataLabelFormatString || '%d%%';
                    label = $.jqplot.sprintf(fstr, gd[i][2]*100);
                }
                else if (this.dataLabels.constructor == Array) {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, this.dataLabels[i]);
                }
            
                var fact = (this._radius ) * this.dataLabelPositionFactor + this.sliceMargin + this.dataLabelNudge;
            
                var x = this._center[0] + Math.cos(avgang) * fact + this.canvas._offsets.left;
                var y = this._center[1] + Math.sin(avgang) * fact + this.canvas._offsets.top;
            
                var labelelem = $('<div class="jqplot-pie-series jqplot-data-label" style="position:absolute;">' + label + '</div>').insertBefore(plot.eventCanvas._elem);
                if (this.dataLabelCenterOn) {
                    x -= labelelem.width()/2;
                    y -= labelelem.height()/2;
                }
                else {
                    x -= labelelem.width() * Math.sin(avgang/2);
                    y -= labelelem.height()/2;
                }
                x = Math.round(x);
                y = Math.round(y);
                labelelem.css({left: x, top: y});
            }
        }            
    };
    
    $.jqplot.PieAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PieAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PieAxisRenderer.prototype.constructor = $.jqplot.PieAxisRenderer;
        
    
    // There are no traditional axes on a pie chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.PieAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.PieTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false; 
    };
    
    
    
    
    $.jqplot.PieLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.PieLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.PieLegendRenderer.prototype.constructor = $.jqplot.PieLegendRenderer;
    
    /**
     * Class: $.jqplot.PieLegendRenderer
     * Legend Renderer specific to pie plots.  Set by default
     * when user creates a pie plot.
     */
    $.jqplot.PieLegendRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with context of legend
    $.jqplot.PieLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;


            this._elem = $(document.createElement('table'));
            this._elem.addClass('jqplot-table-legend');

            var ss = {position:'absolute'};
            if (this.background) {
                ss['background'] = this.background;
            }
            if (this.border) {
                ss['border'] = this.border;
            }
            if (this.fontSize) {
                ss['fontSize'] = this.fontSize;
            }
            if (this.fontFamily) {
                ss['fontFamily'] = this.fontFamily;
            }
            if (this.textColor) {
                ss['textColor'] = this.textColor;
            }
            if (this.marginTop != null) {
                ss['marginTop'] = this.marginTop;
            }
            if (this.marginBottom != null) {
                ss['marginBottom'] = this.marginBottom;
            }
            if (this.marginLeft != null) {
                ss['marginLeft'] = this.marginLeft;
            }
            if (this.marginRight != null) {
                ss['marginRight'] = this.marginRight;
            }

            this._elem.css(ss);

            // Pie charts legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = false,
                nr, 
                nc;
            var s = series[0];
            var colorGenerator = new $.jqplot.ColorGenerator(s.seriesColors);
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j;
                var tr, td1, td2; 
                var lt, rs, color;
                var idx = 0; 
                var div0, div1;   
                
                for (i=0; i<nr; i++) {
                    tr = $(document.createElement('tr'));
                    tr.addClass('jqplot-table-legend');
                    
                    if (reverse){
                        tr.prependTo(this._elem);
                    }
                    
                    else{
                        tr.appendTo(this._elem);
                    }
                    
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length){
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = colorGenerator.next();
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';



                            td1 = $(document.createElement('td'));
                            td1.addClass('jqplot-table-legend jqplot-table-legend-swatch');
                            td1.css({textAlign: 'center', paddingTop: rs});

                            div0 = $(document.createElement('div'));
                            div0.addClass('jqplot-table-legend-swatch-outline');
                            div1 = $(document.createElement('div'));
                            div1.addClass('jqplot-table-legend-swatch');
                            div1.css({backgroundColor: color, borderColor: color});
                            td1.append(div0.append(div1));

                            td2 = $(document.createElement('td'));
                            td2.addClass('jqplot-table-legend jqplot-table-legend-label');
                            td2.css('paddingTop', rs);

                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }
            }
        }
        return this._elem;                
    };
    
    $.jqplot.PieRenderer.prototype.handleMove = function(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            plot.target.trigger('jqplotDataMouseOver', ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.pieRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                plot.target.trigger('jqplotDataHighlight', ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    };
    
    
    // this.eventCanvas._elem.bind($.jqplot.eventListenerHooks[i][0], {plot:this}, $.jqplot.eventListenerHooks[i][1]);
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a pie series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.PieRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.PieRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.PieAxisRenderer;
            options.legend.renderer = $.jqplot.PieLegendRenderer;
            options.legend.preDraw = true;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    
    function postInit(target, data, options) {
        for (var i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.PieRenderer) {
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }
    
    // called with scope of plot
    function postParseOptions(options) {
        for (var i=0; i<this.series.length; i++) {
            this.series[i].seriesColors = this.seriesColors;
            this.series[i].colorGenerator = $.jqplot.colorGenerator;
        }
    }
    
    function highlight (plot, sidx, pidx) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.pieRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.pieRenderer.highlightedSeriesIndex = sidx;
        s.renderer.drawSlice.call(s, canvas._ctx, s._sliceAngles[pidx][0], s._sliceAngles[pidx][1], s.highlightColorGenerator.get(pidx), false);
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.pieRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.pieRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
 
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.pieRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    } 
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.pieRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.pieRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.pieRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }    
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.pieRenderer && this.plugins.pieRenderer.highlightCanvas) {
            this.plugins.pieRenderer.highlightCanvas.resetCanvas();
            this.plugins.pieRenderer.highlightCanvas = null;
        }

        this.plugins.pieRenderer = {highlightedSeriesIndex:null};
        this.plugins.pieRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        // do we have any data labels?  if so, put highlight canvas before those
        var labels = $(this.targetId+' .jqplot-data-label');
        if (labels.length) {
            $(labels[0]).before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-pieRenderer-highlight-canvas', this._plotDimensions, this));
        }
        // else put highlight canvas before event canvas.
        else {
            this.eventCanvas._elem.before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-pieRenderer-highlight-canvas', this._plotDimensions, this));
        }
        
        var hctx = this.plugins.pieRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
    $.jqplot.PieTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.PieTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.PieTickRenderer.prototype.constructor = $.jqplot.PieTickRenderer;
    
})(jQuery);
    
    
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(e){e.jqplot.PieRenderer=function(){e.jqplot.LineRenderer.call(this)};e.jqplot.PieRenderer.prototype=new e.jqplot.LineRenderer();e.jqplot.PieRenderer.prototype.constructor=e.jqplot.PieRenderer;e.jqplot.PieRenderer.prototype.init=function(q,u){this.diameter=null;this.padding=20;this.sliceMargin=0;this.fill=true;this.shadowOffset=2;this.shadowAlpha=0.07;this.shadowDepth=5;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.dataLabels="percent";this.showDataLabels=false;this.dataLabelFormatString=null;this.dataLabelThreshold=3;this.dataLabelPositionFactor=0.52;this.dataLabelNudge=2;this.dataLabelCenterOn=true;this.startAngle=0;this.tickRenderer=e.jqplot.PieTickRenderer;this._drawData=true;this._type="pie";if(q.highlightMouseDown&&q.highlightMouseOver==null){q.highlightMouseOver=false}e.extend(true,this,q);if(this.sliceMargin<0){this.sliceMargin=0}this._diameter=null;this._radius=null;this._sliceAngles=[];this._highlightedPoint=null;if(this.highlightColors.length==0){for(var s=0;s<this.seriesColors.length;s++){var r=e.jqplot.getColorComponents(this.seriesColors[s]);var o=[r[0],r[1],r[2]];var t=o[0]+o[1]+o[2];for(var p=0;p<3;p++){o[p]=(t>570)?o[p]*0.8:o[p]+0.3*(255-o[p]);o[p]=parseInt(o[p],10)}this.highlightColors.push("rgb("+o[0]+","+o[1]+","+o[2]+")")}}this.highlightColorGenerator=new e.jqplot.ColorGenerator(this.highlightColors);u.postParseOptionsHooks.addOnce(m);u.postInitHooks.addOnce(g);u.eventListenerHooks.addOnce("jqplotMouseMove",b);u.eventListenerHooks.addOnce("jqplotMouseDown",a);u.eventListenerHooks.addOnce("jqplotMouseUp",l);u.eventListenerHooks.addOnce("jqplotClick",f);u.eventListenerHooks.addOnce("jqplotRightClick",n);u.postDrawHooks.addOnce(i)};e.jqplot.PieRenderer.prototype.setGridData=function(t){var p=[];var u=[];var o=this.startAngle/180*Math.PI;var s=0;this._drawData=false;for(var r=0;r<this.data.length;r++){if(this.data[r][1]!=0){this._drawData=true}p.push(this.data[r][1]);u.push([this.data[r][0]]);if(r>0){p[r]+=p[r-1]}s+=this.data[r][1]}var q=Math.PI*2/p[p.length-1];for(var r=0;r<p.length;r++){u[r][1]=p[r]*q;u[r][2]=this.data[r][1]/s}this.gridData=u};e.jqplot.PieRenderer.prototype.makeGridData=function(t,u){var p=[];var v=[];var s=0;var o=this.startAngle/180*Math.PI;this._drawData=false;for(var r=0;r<t.length;r++){if(this.data[r][1]!=0){this._drawData=true}p.push(t[r][1]);v.push([t[r][0]]);if(r>0){p[r]+=p[r-1]}s+=t[r][1]}var q=Math.PI*2/p[p.length-1];for(var r=0;r<p.length;r++){v[r][1]=p[r]*q;v[r][2]=t[r][1]/s}return v};function h(o){return Math.sin((o-(o-Math.PI)/8/Math.PI)/2)}function j(u,t,o,v,r){var w=0;var q=t-u;var s=Math.abs(q);var p=o;if(v==false){p+=r}if(p>0&&s>0.01&&s<6.282){w=parseFloat(p)/2/h(q)}return w}e.jqplot.PieRenderer.prototype.drawSlice=function(B,z,y,u,w){if(this._drawData){var p=this._radius;var A=this.fill;var x=this.lineWidth;var s=this.sliceMargin;if(this.fill==false){s+=this.lineWidth}B.save();B.translate(this._center[0],this._center[1]);var D=j(z,y,this.sliceMargin,this.fill,this.lineWidth);var o=D*Math.cos((z+y)/2);var C=D*Math.sin((z+y)/2);if((y-z)<=Math.PI){p-=D}else{p+=D}B.translate(o,C);if(w){for(var v=0,t=this.shadowDepth;v<t;v++){B.save();B.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI),this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));q(p)}for(var v=0,t=this.shadowDepth;v<t;v++){B.restore()}}else{q(p)}B.restore()}function q(r){if(y>6.282+this.startAngle){y=6.282+this.startAngle;if(z>y){z=6.281+this.startAngle}}if(z>=y){return}B.beginPath();B.fillStyle=u;B.strokeStyle=u;B.lineWidth=x;B.arc(0,0,r,z,y,false);B.lineTo(0,0);B.closePath();if(A){B.fill()}else{B.stroke()}}};e.jqplot.PieRenderer.prototype.draw=function(B,z,E,o){var W;var H=(E!=undefined)?E:{};var t=0;var s=0;var N=1;var L=new e.jqplot.ColorGenerator(this.seriesColors);if(E.legendInfo&&E.legendInfo.placement=="insideGrid"){var J=E.legendInfo;switch(J.location){case"nw":t=J.width+J.xoffset;break;case"w":t=J.width+J.xoffset;break;case"sw":t=J.width+J.xoffset;break;case"ne":t=J.width+J.xoffset;N=-1;break;case"e":t=J.width+J.xoffset;N=-1;break;case"se":t=J.width+J.xoffset;N=-1;break;case"n":s=J.height+J.yoffset;break;case"s":s=J.height+J.yoffset;N=-1;break;default:break}}var K=(H.shadow!=undefined)?H.shadow:this.shadow;var A=(H.fill!=undefined)?H.fill:this.fill;var C=B.canvas.width;var I=B.canvas.height;var Q=C-t-2*this.padding;var X=I-s-2*this.padding;var M=Math.min(Q,X);var Y=M;this._sliceAngles=[];var v=this.sliceMargin;if(this.fill==false){v+=this.lineWidth}var q;var G=0;var R,aa,Z,ab;var D=this.startAngle/180*Math.PI;for(var W=0,V=z.length;W<V;W++){aa=(W==0)?D:z[W-1][1]+D;Z=z[W][1]+D;this._sliceAngles.push([aa,Z]);q=j(aa,Z,this.sliceMargin,this.fill,this.lineWidth);if(Math.abs(Z-aa)>Math.PI){G=Math.max(q,G)}}if(this.diameter!=null&&this.diameter>0){this._diameter=this.diameter-2*G}else{this._diameter=Y-2*G}if(this._diameter<6){e.jqplot.log("Diameter of pie too small, not rendering.");return}var S=this._radius=this._diameter/2;this._center=[(C-N*t)/2+N*t+G*Math.cos(D),(I-N*s)/2+N*s+G*Math.sin(D)];if(this.shadow){for(var W=0,V=z.length;W<V;W++){ab="rgba(0,0,0,"+this.shadowAlpha+")";this.renderer.drawSlice.call(this,B,this._sliceAngles[W][0],this._sliceAngles[W][1],ab,true)}}for(var W=0;W<z.length;W++){this.renderer.drawSlice.call(this,B,this._sliceAngles[W][0],this._sliceAngles[W][1],L.next(),false);if(this.showDataLabels&&z[W][2]*100>=this.dataLabelThreshold){var F,U=(this._sliceAngles[W][0]+this._sliceAngles[W][1])/2,T;if(this.dataLabels=="label"){F=this.dataLabelFormatString||"%s";T=e.jqplot.sprintf(F,z[W][0])}else{if(this.dataLabels=="value"){F=this.dataLabelFormatString||"%d";T=e.jqplot.sprintf(F,this.data[W][1])}else{if(this.dataLabels=="percent"){F=this.dataLabelFormatString||"%d%%";T=e.jqplot.sprintf(F,z[W][2]*100)}else{if(this.dataLabels.constructor==Array){F=this.dataLabelFormatString||"%s";T=e.jqplot.sprintf(F,this.dataLabels[W])}}}}var p=(this._radius)*this.dataLabelPositionFactor+this.sliceMargin+this.dataLabelNudge;var P=this._center[0]+Math.cos(U)*p+this.canvas._offsets.left;var O=this._center[1]+Math.sin(U)*p+this.canvas._offsets.top;var u=e('<div class="jqplot-pie-series jqplot-data-label" style="position:absolute;">'+T+"</div>").insertBefore(o.eventCanvas._elem);if(this.dataLabelCenterOn){P-=u.width()/2;O-=u.height()/2}else{P-=u.width()*Math.sin(U/2);O-=u.height()/2}P=Math.round(P);O=Math.round(O);u.css({left:P,top:O})}}};e.jqplot.PieAxisRenderer=function(){e.jqplot.LinearAxisRenderer.call(this)};e.jqplot.PieAxisRenderer.prototype=new e.jqplot.LinearAxisRenderer();e.jqplot.PieAxisRenderer.prototype.constructor=e.jqplot.PieAxisRenderer;e.jqplot.PieAxisRenderer.prototype.init=function(o){this.tickRenderer=e.jqplot.PieTickRenderer;e.extend(true,this,o);this._dataBounds={min:0,max:100};this.min=0;this.max=100;this.showTicks=false;this.ticks=[];this.showMark=false;this.show=false};e.jqplot.PieLegendRenderer=function(){e.jqplot.TableLegendRenderer.call(this)};e.jqplot.PieLegendRenderer.prototype=new e.jqplot.TableLegendRenderer();e.jqplot.PieLegendRenderer.prototype.constructor=e.jqplot.PieLegendRenderer;e.jqplot.PieLegendRenderer.prototype.init=function(o){this.numberRows=null;this.numberColumns=null;e.extend(true,this,o)};e.jqplot.PieLegendRenderer.prototype.draw=function(){var r=this;if(this.show){var B=this._series;this._elem=e(document.createElement("table"));this._elem.addClass("jqplot-table-legend");var E={position:"absolute"};if(this.background){E.background=this.background}if(this.border){E.border=this.border}if(this.fontSize){E.fontSize=this.fontSize}if(this.fontFamily){E.fontFamily=this.fontFamily}if(this.textColor){E.textColor=this.textColor}if(this.marginTop!=null){E.marginTop=this.marginTop}if(this.marginBottom!=null){E.marginBottom=this.marginBottom}if(this.marginLeft!=null){E.marginLeft=this.marginLeft}if(this.marginRight!=null){E.marginRight=this.marginRight}this._elem.css(E);var I=false,A=false,o,y;var C=B[0];var p=new e.jqplot.ColorGenerator(C.seriesColors);if(C.show){var J=C.data;if(this.numberRows){o=this.numberRows;if(!this.numberColumns){y=Math.ceil(J.length/o)}else{y=this.numberColumns}}else{if(this.numberColumns){y=this.numberColumns;o=Math.ceil(J.length/this.numberColumns)}else{o=J.length;y=1}}var H,G;var q,w,v;var x,z,F;var D=0;var u,t;for(H=0;H<o;H++){q=e(document.createElement("tr"));q.addClass("jqplot-table-legend");if(A){q.prependTo(this._elem)}else{q.appendTo(this._elem)}for(G=0;G<y;G++){if(D<J.length){x=this.labels[D]||J[D][0].toString();F=p.next();if(!A){if(H>0){I=true}else{I=false}}else{if(H==o-1){I=false}else{I=true}}z=(I)?this.rowSpacing:"0";w=e(document.createElement("td"));w.addClass("jqplot-table-legend jqplot-table-legend-swatch");w.css({textAlign:"center",paddingTop:z});u=e(document.createElement("div"));u.addClass("jqplot-table-legend-swatch-outline");t=e(document.createElement("div"));t.addClass("jqplot-table-legend-swatch");t.css({backgroundColor:F,borderColor:F});w.append(u.append(t));v=e(document.createElement("td"));v.addClass("jqplot-table-legend jqplot-table-legend-label");v.css("paddingTop",z);if(this.escapeHtml){v.text(x)}else{v.html(x)}if(A){v.prependTo(q);w.prependTo(q)}else{w.appendTo(q);v.appendTo(q)}I=true}D++}}}}return this._elem};e.jqplot.PieRenderer.prototype.handleMove=function(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];r.target.trigger("jqplotDataMouseOver",o);if(r.series[o[0]].highlightMouseOver&&!(o[0]==r.plugins.pieRenderer.highlightedSeriesIndex&&o[1]==r.series[o[0]]._highlightedPoint)){r.target.trigger("jqplotDataHighlight",o);d(r,o[0],o[1])}}else{if(s==null){k(r)}}};function c(s,r,p){p=p||{};p.axesDefaults=p.axesDefaults||{};p.legend=p.legend||{};p.seriesDefaults=p.seriesDefaults||{};var o=false;if(p.seriesDefaults.renderer==e.jqplot.PieRenderer){o=true}else{if(p.series){for(var q=0;q<p.series.length;q++){if(p.series[q].renderer==e.jqplot.PieRenderer){o=true}}}}if(o){p.axesDefaults.renderer=e.jqplot.PieAxisRenderer;p.legend.renderer=e.jqplot.PieLegendRenderer;p.legend.preDraw=true;p.seriesDefaults.pointLabels={show:false}}}function g(r,q,o){for(var p=0;p<this.series.length;p++){if(this.series[p].renderer.constructor==e.jqplot.PieRenderer){if(this.series[p].highlightMouseOver){this.series[p].highlightMouseDown=false}}}}function m(o){for(var p=0;p<this.series.length;p++){this.series[p].seriesColors=this.seriesColors;this.series[p].colorGenerator=e.jqplot.colorGenerator}}function d(t,r,q){var p=t.series[r];var o=t.plugins.pieRenderer.highlightCanvas;o._ctx.clearRect(0,0,o._ctx.canvas.width,o._ctx.canvas.height);p._highlightedPoint=q;t.plugins.pieRenderer.highlightedSeriesIndex=r;p.renderer.drawSlice.call(p,o._ctx,p._sliceAngles[q][0],p._sliceAngles[q][1],p.highlightColorGenerator.get(q),false)}function k(q){var o=q.plugins.pieRenderer.highlightCanvas;o._ctx.clearRect(0,0,o._ctx.canvas.width,o._ctx.canvas.height);for(var p=0;p<q.series.length;p++){q.series[p]._highlightedPoint=null}q.plugins.pieRenderer.highlightedSeriesIndex=null;q.target.trigger("jqplotDataUnhighlight")}function b(s,r,v,u,t){if(u){var q=[u.seriesIndex,u.pointIndex,u.data];var p=jQuery.Event("jqplotDataMouseOver");p.pageX=s.pageX;p.pageY=s.pageY;t.target.trigger(p,q);if(t.series[q[0]].highlightMouseOver&&!(q[0]==t.plugins.pieRenderer.highlightedSeriesIndex&&q[1]==t.series[q[0]]._highlightedPoint)){var o=jQuery.Event("jqplotDataHighlight");o.which=s.which;o.pageX=s.pageX;o.pageY=s.pageY;t.target.trigger(o,q);d(t,q[0],q[1])}}else{if(u==null){k(t)}}}function a(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];if(s.series[p[0]].highlightMouseDown&&!(p[0]==s.plugins.pieRenderer.highlightedSeriesIndex&&p[1]==s.series[p[0]]._highlightedPoint)){var o=jQuery.Event("jqplotDataHighlight");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p);d(s,p[0],p[1])}}else{if(t==null){k(s)}}}function l(q,p,t,s,r){var o=r.plugins.pieRenderer.highlightedSeriesIndex;if(o!=null&&r.series[o].highlightMouseDown){k(r)}}function f(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var o=jQuery.Event("jqplotDataClick");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p)}}function n(s,r,v,u,t){if(u){var q=[u.seriesIndex,u.pointIndex,u.data];var o=t.plugins.pieRenderer.highlightedSeriesIndex;if(o!=null&&t.series[o].highlightMouseDown){k(t)}var p=jQuery.Event("jqplotDataRightClick");p.which=s.which;p.pageX=s.pageX;p.pageY=s.pageY;t.target.trigger(p,q)}}function i(){if(this.plugins.pieRenderer&&this.plugins.pieRenderer.highlightCanvas){this.plugins.pieRenderer.highlightCanvas.resetCanvas();this.plugins.pieRenderer.highlightCanvas=null}this.plugins.pieRenderer={highlightedSeriesIndex:null};this.plugins.pieRenderer.highlightCanvas=new e.jqplot.GenericCanvas();var p=e(this.targetId+" .jqplot-data-label");if(p.length){e(p[0]).before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-pieRenderer-highlight-canvas",this._plotDimensions,this))}else{this.eventCanvas._elem.before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-pieRenderer-highlight-canvas",this._plotDimensions,this))}var o=this.plugins.pieRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(q){k(q.data.plot)})}e.jqplot.preInitHooks.push(c);e.jqplot.PieTickRenderer=function(){e.jqplot.AxisTickRenderer.call(this)};e.jqplot.PieTickRenderer.prototype=new e.jqplot.AxisTickRenderer();e.jqplot.PieTickRenderer.prototype.constructor=e.jqplot.PieTickRenderer})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    
    /**
     * Class: $.jqplot.PointLabels
     * Plugin for putting labels at the data points.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.pointLabels.js"></script>
     * 
     * By default, the last value in the data ponit array in the data series is used
     * for the label.  For most series renderers, extra data can be added to the 
     * data point arrays and the last value will be used as the label.
     * 
     * For instance, 
     * this series:
     * 
     * > [[1,4], [3,5], [7,2]]
     * 
     * Would, by default, use the y values in the labels.
     * Extra data can be added to the series like so:
     * 
     * > [[1,4,'mid'], [3 5,'hi'], [7,2,'low']]
     * 
     * And now the point labels would be 'mid', 'low', and 'hi'.
     * 
     * Options to the point labels and a custom labels array can be passed into the
     * "pointLabels" option on the series option like so:
     * 
     * > series:[{pointLabels:{
     * >    labels:['mid', 'hi', 'low'],
     * >    location:'se',
     * >    ypadding: 12
     * >    }
     * > }]
     * 
     * A custom labels array in the options takes precendence over any labels
     * in the series data.  If you have a custom labels array in the options,
     * but still want to use values from the series array as labels, set the
     * "labelsFromSeries" option to true.
     * 
     * By default, html entities (<, >, etc.) are escaped in point labels.  
     * If you want to include actual html markup in the labels, 
     * set the "escapeHTML" option to false.
     * 
     */
    $.jqplot.PointLabels = function(options) {
        // Group: Properties
        //
        // prop: show
        // show the labels or not.
        this.show = $.jqplot.config.enablePlugins;
        // prop: location
        // compass location where to position the label around the point.
        // 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.location = 'n';
        // prop: labelsFromSeries
        // true to use labels within data point arrays.
        this.labelsFromSeries = false;
        // prop: seriesLabelIndex
        // array index for location of labels within data point arrays.
        // if null, will use the last element of the data point array.
        this.seriesLabelIndex = null;
        // prop: labels
        // array of arrays of labels, one array for each series.
        this.labels = [];
        // actual labels that will get displayed.
        // needed to preserve user specified labels in labels array.
        this._labels = [];
        // prop: stackedValue
        // true to display value as stacked in a stacked plot.
        // no effect if labels is specified.
        this.stackedValue = false;
        // prop: ypadding
        // vertical padding in pixels between point and label
        this.ypadding = 6;
        // prop: xpadding
        // horizontal padding in pixels between point and label
        this.xpadding = 6;
        // prop: escapeHTML
        // true to escape html entities in the labels.
        // If you want to include markup in the labels, set to false.
        this.escapeHTML = true;
        // prop: edgeTolerance
        // Number of pixels that the label must be away from an axis
        // boundary in order to be drawn.  Negative values will allow overlap
        // with the grid boundaries.
        this.edgeTolerance = -5;
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: hideZeros
        // true to not show a label for a value which is 0.
        this.hideZeros = false;
        this._elems = [];
        
        $.extend(true, this, options);
    };
    
    var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    var locationIndicies = {'nw':0, 'n':1, 'ne':2, 'e':3, 'se':4, 's':5, 'sw':6, 'w':7};
    var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    
    // called with scope of a series
    $.jqplot.PointLabels.init = function (target, data, seriesDefaults, opts, plot){
        var options = $.extend(true, {}, seriesDefaults, opts);
        options.pointLabels = options.pointLabels || {};
        if (this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal' && !options.pointLabels.location) {
            options.pointLabels.location = 'e';
        }
        // add a pointLabels attribute to the series plugins
        this.plugins.pointLabels = new $.jqplot.PointLabels(options.pointLabels);
        this.plugins.pointLabels.setLabels.call(this);
    };
    
    // called with scope of series
    $.jqplot.PointLabels.prototype.setLabels = function() {   
        var p = this.plugins.pointLabels; 
        var labelIdx;
        if (p.seriesLabelIndex != null) {
            labelIdx = p.seriesLabelIndex;
        }
        else if (this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal') {
           labelIdx = (this._plotData[0].length < 3) ? 0 : this._plotData[0].length -1;
        }
        else {
            labelIdx = (this._plotData.length === 0) ? 0 : this._plotData[0].length -1;
        }
        p._labels = [];
        if (p.labels.length === 0 || p.labelsFromSeries) {    
            if (p.stackedValue) {
                if (this._plotData.length && this._plotData[0].length){
                    // var idx = p.seriesLabelIndex || this._plotData[0].length -1;
                    for (var i=0; i<this._plotData.length; i++) {
                        p._labels.push(this._plotData[i][labelIdx]);
                    }
                }
            }
            else {
                // var d = this._plotData;
                var d = this.data;
                if (this.renderer.constructor === $.jqplot.BarRenderer && this.waterfall) {
                    d = this._data;
                }
                if (d.length && d[0].length) {
                    // var idx = p.seriesLabelIndex || d[0].length -1;
                    for (var i=0; i<d.length; i++) {
                        p._labels.push(d[i][labelIdx]);
                    }
                }
                d = null;
            }
        }
        else if (p.labels.length){
            p._labels = p.labels;
        }
    };
    
    $.jqplot.PointLabels.prototype.xOffset = function(elem, location, padding) {
        location = location || this.location;
        padding = padding || this.xpadding;
        var offset;
        
        switch (location) {
            case 'nw':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            case 'n':
                offset = -elem.outerWidth(true)/2;
                break;
            case 'ne':
                offset =  this.xpadding;
                break;
            case 'e':
                offset = this.xpadding;
                break;
            case 'se':
                offset = this.xpadding;
                break;
            case 's':
                offset = -elem.outerWidth(true)/2;
                break;
            case 'sw':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            case 'w':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            default: // same as 'nw'
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
        }
        return offset; 
    };
    
    $.jqplot.PointLabels.prototype.yOffset = function(elem, location, padding) {
        location = location || this.location;
        padding = padding || this.xpadding;
        var offset;
        
        switch (location) {
            case 'nw':
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
            case 'n':
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
            case 'ne':
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
            case 'e':
                offset = -elem.outerHeight(true)/2;
                break;
            case 'se':
                offset = this.ypadding;
                break;
            case 's':
                offset = this.ypadding;
                break;
            case 'sw':
                offset = this.ypadding;
                break;
            case 'w':
                offset = -elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
        }
        return offset; 
    };
    
    // called with scope of series
    $.jqplot.PointLabels.draw = function (sctx, options, plot) {
        var p = this.plugins.pointLabels;
        // set labels again in case they have changed.
        p.setLabels.call(this);
        // remove any previous labels
        for (var i=0; i<p._elems.length; i++) {
            // Memory Leaks patch
            // p._elems[i].remove();
            p._elems[i].emptyForce();
        }
        p._elems.splice(0, p._elems.length);

        if (p.show) {
            var ax = '_'+this._stackAxis+'axis';
        
            if (!p.formatString) {
                p.formatString = this[ax]._ticks[0].formatString;
                p.formatter = this[ax]._ticks[0].formatter;
            }
        
            var pd = this._plotData;
            var ppd = this._prevPlotData;
            var xax = this._xaxis;
            var yax = this._yaxis;
            var elem, helem;

            for (var i=0, l=p._labels.length; i < l; i++) {
                var label = p._labels[i];
                
                if (label == null || (p.hideZeros && parseInt(label, 10) == 0)) {
                    continue;
                }
                
                label = p.formatter(p.formatString, label);

                helem = document.createElement('div');
                p._elems[i] = $(helem);

                elem = p._elems[i];


                elem.addClass('jqplot-point-label jqplot-series-'+this.index+' jqplot-point-'+i);
                elem.css('position', 'absolute');
                elem.insertAfter(sctx.canvas);

                if (p.escapeHTML) {
                    elem.text(label);
                }
                else {
                    elem.html(label);
                }
                var location = p.location;
                if ((this.fillToZero && pd[i][1] < 0) || (this.fillToZero && this._type === 'bar' && this.barDirection === 'horizontal' && pd[i][0] < 0) || (this.waterfall && parseInt(label, 10)) < 0) {
                    location = oppositeLocations[locationIndicies[location]];
                }


                var ell = xax.u2p(pd[i][0]) + p.xOffset(elem, location);
                var elt = yax.u2p(pd[i][1]) + p.yOffset(elem, location);

                // we have stacked chart but are not showing stacked values,
                // place labels in center.
                if (this._stack && !p.stackedValue) {
                    if (this.barDirection === "vertical") {
                        elt = (this._barPoints[i][0][1] + this._barPoints[i][1][1]) / 2 + plot._gridPadding.top - 0.5 * elem.outerHeight(true);
                    }
                    else {
                        ell = (this._barPoints[i][2][0] + this._barPoints[i][0][0]) / 2 + plot._gridPadding.left - 0.5 * elem.outerWidth(true);
                    }
                }

                if (this.renderer.constructor == $.jqplot.BarRenderer) {
                    if (this.barDirection == "vertical") {
                        ell += this._barNudge;
                    }
                    else {
                        elt -= this._barNudge;
                    }
                }
                elem.css('left', ell);
                elem.css('top', elt);
                var elr = ell + elem.width();
                var elb = elt + elem.height();
                var et = p.edgeTolerance;
                var scl = $(sctx.canvas).position().left;
                var sct = $(sctx.canvas).position().top;
                var scr = sctx.canvas.width + scl;
                var scb = sctx.canvas.height + sct;
                // if label is outside of allowed area, remove it
                if (ell - et < scl || elt - et < sct || elr + et > scr || elb + et > scb) {
                    elem.remove();
                }

                elem = null;
                helem = null;
            }

            // finally, animate them if the series is animated
            // if (this.renderer.animation && this.renderer.animation._supported && this.renderer.animation.show && plot._drawCount < 2) {
            //     var sel = '.jqplot-point-label.jqplot-series-'+this.index;
            //     $(sel).hide();
            //     $(sel).fadeIn(1000);
            // }

        }
    };
    
    $.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
    $.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(c){c.jqplot.PointLabels=function(e){this.show=c.jqplot.config.enablePlugins;this.location="n";this.labelsFromSeries=false;this.seriesLabelIndex=null;this.labels=[];this._labels=[];this.stackedValue=false;this.ypadding=6;this.xpadding=6;this.escapeHTML=true;this.edgeTolerance=-5;this.formatter=c.jqplot.DefaultTickFormatter;this.formatString="";this.hideZeros=false;this._elems=[];c.extend(true,this,e)};var a=["nw","n","ne","e","se","s","sw","w"];var d={nw:0,n:1,ne:2,e:3,se:4,s:5,sw:6,w:7};var b=["se","s","sw","w","nw","n","ne","e"];c.jqplot.PointLabels.init=function(j,h,f,g,i){var e=c.extend(true,{},f,g);e.pointLabels=e.pointLabels||{};if(this.renderer.constructor===c.jqplot.BarRenderer&&this.barDirection==="horizontal"&&!e.pointLabels.location){e.pointLabels.location="e"}this.plugins.pointLabels=new c.jqplot.PointLabels(e.pointLabels);this.plugins.pointLabels.setLabels.call(this)};c.jqplot.PointLabels.prototype.setLabels=function(){var f=this.plugins.pointLabels;var h;if(f.seriesLabelIndex!=null){h=f.seriesLabelIndex}else{if(this.renderer.constructor===c.jqplot.BarRenderer&&this.barDirection==="horizontal"){h=(this._plotData[0].length<3)?0:this._plotData[0].length-1}else{h=(this._plotData.length===0)?0:this._plotData[0].length-1}}f._labels=[];if(f.labels.length===0||f.labelsFromSeries){if(f.stackedValue){if(this._plotData.length&&this._plotData[0].length){for(var e=0;e<this._plotData.length;e++){f._labels.push(this._plotData[e][h])}}}else{var g=this.data;if(this.renderer.constructor===c.jqplot.BarRenderer&&this.waterfall){g=this._data}if(g.length&&g[0].length){for(var e=0;e<g.length;e++){f._labels.push(g[e][h])}}g=null}}else{if(f.labels.length){f._labels=f.labels}}};c.jqplot.PointLabels.prototype.xOffset=function(f,e,g){e=e||this.location;g=g||this.xpadding;var h;switch(e){case"nw":h=-f.outerWidth(true)-this.xpadding;break;case"n":h=-f.outerWidth(true)/2;break;case"ne":h=this.xpadding;break;case"e":h=this.xpadding;break;case"se":h=this.xpadding;break;case"s":h=-f.outerWidth(true)/2;break;case"sw":h=-f.outerWidth(true)-this.xpadding;break;case"w":h=-f.outerWidth(true)-this.xpadding;break;default:h=-f.outerWidth(true)-this.xpadding;break}return h};c.jqplot.PointLabels.prototype.yOffset=function(f,e,g){e=e||this.location;g=g||this.xpadding;var h;switch(e){case"nw":h=-f.outerHeight(true)-this.ypadding;break;case"n":h=-f.outerHeight(true)-this.ypadding;break;case"ne":h=-f.outerHeight(true)-this.ypadding;break;case"e":h=-f.outerHeight(true)/2;break;case"se":h=this.ypadding;break;case"s":h=this.ypadding;break;case"sw":h=this.ypadding;break;case"w":h=-f.outerHeight(true)/2;break;default:h=-f.outerHeight(true)-this.ypadding;break}return h};c.jqplot.PointLabels.draw=function(x,j,v){var t=this.plugins.pointLabels;t.setLabels.call(this);for(var w=0;w<t._elems.length;w++){t._elems[w].emptyForce()}t._elems.splice(0,t._elems.length);if(t.show){var r="_"+this._stackAxis+"axis";if(!t.formatString){t.formatString=this[r]._ticks[0].formatString;t.formatter=this[r]._ticks[0].formatter}var E=this._plotData;var D=this._prevPlotData;var A=this._xaxis;var q=this._yaxis;var z,f;for(var w=0,u=t._labels.length;w<u;w++){var o=t._labels[w];if(o==null||(t.hideZeros&&parseInt(o,10)==0)){continue}o=t.formatter(t.formatString,o);f=document.createElement("div");t._elems[w]=c(f);z=t._elems[w];z.addClass("jqplot-point-label jqplot-series-"+this.index+" jqplot-point-"+w);z.css("position","absolute");z.insertAfter(x.canvas);if(t.escapeHTML){z.text(o)}else{z.html(o)}var g=t.location;if((this.fillToZero&&E[w][1]<0)||(this.fillToZero&&this._type==="bar"&&this.barDirection==="horizontal"&&E[w][0]<0)||(this.waterfall&&parseInt(o,10))<0){g=b[d[g]]}var n=A.u2p(E[w][0])+t.xOffset(z,g);var h=q.u2p(E[w][1])+t.yOffset(z,g);if(this._stack&&!t.stackedValue){if(this.barDirection==="vertical"){h=(this._barPoints[w][0][1]+this._barPoints[w][1][1])/2+v._gridPadding.top-0.5*z.outerHeight(true)}else{n=(this._barPoints[w][2][0]+this._barPoints[w][0][0])/2+v._gridPadding.left-0.5*z.outerWidth(true)}}if(this.renderer.constructor==c.jqplot.BarRenderer){if(this.barDirection=="vertical"){n+=this._barNudge}else{h-=this._barNudge}}z.css("left",n);z.css("top",h);var k=n+z.width();var s=h+z.height();var C=t.edgeTolerance;var e=c(x.canvas).position().left;var y=c(x.canvas).position().top;var B=x.canvas.width+e;var m=x.canvas.height+y;if(n-C<e||h-C<y||k+C>B||s+C>m){z.remove()}z=null;f=null}}};c.jqplot.postSeriesInitHooks.push(c.jqplot.PointLabels.init);c.jqplot.postDrawSeriesHooks.push(c.jqplot.PointLabels.draw)})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    $.jqplot.PyramidAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PyramidAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PyramidAxisRenderer.prototype.constructor = $.jqplot.PyramidAxisRenderer;
        
    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.init = function(options){
        // Group: Properties
        //
        // prop: position
        // Position of axis.  Values are: top, bottom , left, center, right.
        // By default, x and x2 axes are bottom, y axis is center.
        this.position = null;
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = true;
        // prop: baselineWidth
        // width of the baseline in pixels.
        this.baselineWidth = null;
        // prop: baselineColor
        // CSS color spec for the baseline.
        this.baselineColor = null;
        this.tickSpacingFactor = 25;
        this._type = 'pyramid';
        this._splitAxis = false;
        this._splitLength = null;
        this.category = false;
        this._autoFormatString = '';
        this._overrideFormatString = false;
        
        $.extend(true, this, options);
        this.renderer.options = options;

        this.resetDataBounds = this.renderer.resetDataBounds;
        this.resetDataBounds();

    };

    $.jqplot.PyramidAxisRenderer.prototype.resetDataBounds = function() {
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        var db = this._dataBounds;
        db.min = null;
        db.max = null;
        var temp;
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            
            for (var j=0, l=d.length; j<l; j++) { 
                if (this.name.charAt(0) === 'x') {
                    temp = d[j][1];
                    if ((temp !== null && temp < db.min) || db.min === null) {
                        db.min = temp;
                    }
                    if ((temp !== null && temp > db.max) || db.max === null) {
                        db.max = temp;
                    }
                }              
                else {
                    temp = d[j][0];
                    if ((temp !== null && temp < db.min) || db.min === null) {
                        db.min = temp;
                    }
                    if ((temp !== null && temp > db.max) || db.max === null) {
                        db.max = temp;
                    }
                }              
            }
        }
    };
    
    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.draw = function(ctx, plot) {
        if (this.show) {
            // populate the axis label and value properties.
            // createTicks is a method on the renderer, but
            // call it within the scope of the axis.
            this.renderer.createTicks.call(this, plot);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get its bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            // Added for theming.
            if (this._elem) {
                // Memory Leaks patch
                //this._elem.empty();
                this._elem.emptyForce();
                this._elem = null;
            }
            
            this._elem = $(document.createElement('div'));
            this._elem.addClass('jqplot-axis jqplot-'+this.name);
            this._elem.css('position', 'absolute');

            
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                this._elem.width(this._plotDimensions.width);
            }
            else {
                this._elem.height(this._plotDimensions.height);
            }
            
            // create a _label object.
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var elem = this._label.draw(ctx, plot);
                elem.appendTo(this._elem);
                elem = null;
            }
    
            var t = this._ticks;
            var tick;
            for (var i=0; i<t.length; i++) {
                tick = t[i];
                if (tick.show && tick.showLabel && (!tick.isMinorTick)) {
                    this._elem.append(tick.draw(ctx, plot));
                }
            }
            tick = null;
            t = null;
        }
        return this._elem;
    };   

    // Note, primes can be found on http://primes.utm.edu/
    var _primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];


    var _primesHash = {};

    for (var i =0, l = _primes.length; i < l; i++) {
        _primesHash[_primes[i]] = _primes[i];
    }

    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.createTicks = function(plot) {
        // we're are operating on an axis here
        var userTicks = this.ticks;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim;
        var interval;
        var min;
        var max;
        var range;
        var pos1;
        var pos2;
        var tt;
        var i;
        var l;
        var s;
        // get a copy of user's settings for min/max.
        var userMin = this.min;
        var userMax = this.max;
        var ut;
        var t;
        var threshold;
        var tdim;
        var scalefact;
        var ret;
        var tumin;
        var tumax;
        var maxVisibleTicks;
        var val;
        var skip = null;
        var temp;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.

        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0, l=userTicks.length; i<l; i++){
                ut = userTicks[i];
                t = new this.tickRenderer(this.tickOptions);
                if ($.isArray(ut)) {
                    t.value = ut[0];
                    t.label = ut[1];
                    t.setTick(ut[0], this.name);
                    this._ticks.push(t);
                }

                else if ($.isPlainObject(ut)) {
                    $.extend(true, t, ut);
                    t.axis = this.name;
                    this._ticks.push(t);
                }
                
                else {
                    if (typeof ut === 'string') {
                        val = i + plot.defaultAxisStart;
                    }
                    else {
                        val = ut;
                    }
                    t.value = val;
                    t.label = ut;
                    t.axis = this.name;
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);

            // use user specified tickInterval if there is one
            if (this._options.tickInterval) {
                // hide every tick except for ticks on interval
                var ti = this._options.tickInterval;
                for (i=0; i<this.numberTicks; i++) {
                    if (i%ti !== 0) {
                        // this._ticks[i].show = false;
                        this._ticks[i].isMinorTick = true;
                    }
                }
            }

            else {
                // check if we have too many ticks
                dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;
                maxVisibleTicks = Math.round(2.0 + dim/this.tickSpacingFactor);

                if (this.numberTicks > maxVisibleTicks) {
                    // check for number of ticks we can skip
                    temp = this.numberTicks - 1;
                    for (i=2; i<temp; i++) {
                        if (temp % i === 0 && temp/i < maxVisibleTicks) {
                            skip = i-1;
                            break;
                        }
                    }

                    if (skip !== null) {
                        var count = 1;
                        for (i=1, l=this._ticks.length; i<l; i++) {
                            if (count <= skip) {
                                this._ticks[i].show = false;
                                count += 1;
                            }
                            else {
                                count = 1;
                            }
                        }
                    }
                }
            }

            // if category style, add minor ticks in between
            temp = [];
            if (this.category) {
                // turn off gridline and mark on first tick
                this._ticks[0].showGridline = false;
                this._ticks[0].showMark = false;

                for (i=this._ticks.length-1; i>0; i--) {
                    t = new this.tickRenderer(this.tickOptions);
                    t.value = this._ticks[i-1].value + this.tickInterval/2.0;
                    t.label = '';
                    t.showLabel = false;
                    t.axis = this.name;
                    this._ticks[i].showGridline = false;
                    this._ticks[i].showMark = false;
                    this._ticks.splice(i, 0, t);
                    // temp.push(t);
                }

                // merge in the new ticks
                // for (i=1, l=temp.length; i<l; i++) {
                //     this._ticks.splice(i, 0, temp[i]);
                // }

                // now add a tick at beginning and end
                t = new this.tickRenderer(this.tickOptions);
                t.value = this._ticks[0].value - this.tickInterval/2.0;
                t.label = '';
                t.showLabel = false;
                t.axis = this.name;
                this._ticks.unshift(t);

                t = new this.tickRenderer(this.tickOptions);
                t.value = this._ticks[this._ticks.length-1].value + this.tickInterval/2.0;
                t.label = '';
                t.showLabel = false;
                t.axis = this.name;
                this._ticks.push(t);

                this.tickInterval = this.tickInterval / 2.0;
                this.numberTicks = this._ticks.length;
                this.min = this._ticks[0].value;
                this.max = this._ticks[this._ticks.length-1].value;
            }
        }

        // we don't have any ticks yet, let's make some!
        else {
            if (this.name.charAt(0) === 'x') {
                dim = this._plotDimensions.width;
                // make sure x axis is symetric about 0.
                var tempmax = Math.max(db.max, Math.abs(db.min));
                var tempmin = Math.min(db.min, -tempmax);
                // min = ((this.min != null) ? this.min : tempmin);
                // max = ((this.max != null) ? this.max : tempmax);
                min = tempmin;
                max = tempmax;
                range = max - min;

                if (this.tickOptions == null || !this.tickOptions.formatString) {
                    this._overrideFormatString = true;
                }

                threshold = 30;
                tdim = Math.max(dim, threshold+1);
                scalefact =  (tdim-threshold)/300.0;
                ret = $.jqplot.LinearTickGenerator(min, max, scalefact); 
                // calculate a padded max and min, points should be less than these
                // so that they aren't too close to the edges of the plot.
                // User can adjust how much padding is allowed with pad, padMin and PadMax options. 
                tumin = min + range*(this.padMin - 1);
                tumax = max - range*(this.padMax - 1);

                if (min < tumin || max > tumax) {
                    tumin = min - range*(this.padMin - 1);
                    tumax = max + range*(this.padMax - 1);
                    ret = $.jqplot.LinearTickGenerator(tumin, tumax, scalefact);
                }

                this.min = ret[0];
                this.max = ret[1];
                this.numberTicks = ret[2];
                this._autoFormatString = ret[3];
                this.tickInterval = ret[4];
            }
            else {
                dim = this._plotDimensions.height;

                // ticks will be on whole integers like 1, 2, 3, ... or 1, 4, 7, ...
                min = db.min;
                max = db.max;
                s = this._series[0];
                this._ticks = [];

                range = max - min;

                // if range is a prime, will get only 2 ticks, expand range in that case.
                if (_primesHash[range]) {
                    range += 1;
                    max += 1;
                }

                this.max = max;
                this.min = min;
                
                maxVisibleTicks = Math.round(2.0 + dim/this.tickSpacingFactor);

                if (range + 1 <= maxVisibleTicks) {
                    this.numberTicks = range + 1;
                    this.tickInterval = 1.0;
                }

                else {
                    // figure out a round number of ticks to skip in every interval
                    // range / ti + 1 = nt
                    // ti = range / (nt - 1)
                    for (var i=maxVisibleTicks; i>1; i--) {
                        if (range/(i - 1) === Math.round(range/(i - 1))) {
                            this.numberTicks = i;
                            this.tickInterval = range/(i - 1);
                            break;
                        }
                        
                    }
                }
            }
            
            if (this._overrideFormatString && this._autoFormatString != '') {
                this.tickOptions = this.tickOptions || {};
                this.tickOptions.formatString = this._autoFormatString;
            }

            var labelval;
            for (i=0; i<this.numberTicks; i++) {
                this.tickOptions.axis = this.name;
                labelval = this.min + this.tickInterval * i;
                if (this.name.charAt(0) === 'x') {
                    labelval = Math.abs(labelval);
                }
                // this.tickOptions.label = String (labelval);
                this.tickOptions.value = this.min + this.tickInterval * i;
                t = new this.tickRenderer(this.tickOptions);

                t.label = t.prefix + t.formatter(t.formatString, labelval);

                this._ticks.push(t);
                // for x axis, if y axis is in middle, add a symetrical 0 tick
                if (this.name.charAt(0) === 'x' && plot.axes.yMidAxis.show && this.tickOptions.value === 0) {
                    this._splitAxis = true;
                    this._splitLength = plot.axes.yMidAxis.getWidth();
                    // t.value = -this.max/2000.0;
                    t = new this.tickRenderer(this.tickOptions);
                    this._ticks.push(t);
                    t.value = this.max/2000.0;
                }
            }
            t = null;
        }
    };
    
    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.set = function() { 
        var dim = 0;
        var temp;
        var w = 0;
        var h = 0;
        var i;
        var t;
        var tick;
        var lshow = (this._label == null) ? false : this._label.show;
        if (this.show) {
            t = this._ticks;
            l = t.length;
            for (i=0; i<l; i++) {
                tick = t[i];
                if (!tick._breakTick && tick.show && tick.showLabel && !tick.isMinorTick) {
                    if (this.name.charAt(0) === 'x') {
                        temp = tick._elem.outerHeight(true);
                    }
                    else {
                        temp = tick._elem.outerWidth(true);
                    }
                    if (temp > dim) {
                        dim = temp;
                    }
                }
            }

            if (this.name === 'yMidAxis') {
                for (i=0; i<l; i++) {
                    tick = t[i];
                    if (tick._elem) {
                        temp = (dim - tick._elem.outerWidth(true))/2.0;
                        tick._elem.css('left', temp);
                    }
                }
            }
            tick = null;
            t = null;
            
            if (lshow) {
                w = this._label._elem.outerWidth(true);
                h = this._label._elem.outerHeight(true); 
            }
            if (this.name === 'xaxis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            }
            else if (this.name === 'x2axis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            }
            else if (this.name === 'yaxis') {
                dim = dim + w;
                this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
            else if (this.name === 'yMidAxis') {
                // don't include width of label at all in width of axis?
                // dim = (dim > w) ? dim : w;
                var temp = dim/2.0 - w/2.0;
                this._elem.css({'width':dim+'px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css({width: w, left: temp, top: 0});
                }
            }
            else {
                dim = dim + w;
                this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
        }  
    };
    
    $.jqplot.PyramidAxisRenderer.prototype.pack = function(pos, offsets) { 
        // Add defaults for repacking from resetTickValues function.
        pos = pos || {};
        offsets = offsets || this._offsets;
        
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        
        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        var sl = this._splitLength;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner.
        if (this._splitAxis) {
            pixellength -= this._splitLength;
            
            // don't know that this one is correct.
            this.p2u = function(p){
                return (p - offmin) * unitlength / pixellength + min;
            };
        
            this.u2p = function(u){
                if (u <= 0) {
                    return (u - min) * pixellength / unitlength + offmin;
                }
                else {
                    return (u - min) * pixellength / unitlength + offmin + sl;
                }
            };
                
            this.series_u2p = function(u){
                if (u <= 0) {
                    return (u - min) * pixellength / unitlength;
                }
                else {
                    return (u - min) * pixellength / unitlength + sl;
                }
            };

            // don't know that this one is correct.
            this.series_p2u = function(p){
                return p * unitlength / pixellength + min;
            };
        }
        else {
            this.p2u = function(p){
                return (p - offmin) * unitlength / pixellength + min;
            };
        
            this.u2p = function(u){
                return (u - min) * pixellength / unitlength + offmin;
            };
                
            if (this.name.charAt(0) === 'x'){
                this.series_u2p = function(u){
                    return (u - min) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }
        
            else {
                this.series_u2p = function(u){
                    return (u - max) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
        }
        
        if (this.show) {
            if (this.name.charAt(0) === 'x') {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'xaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (temp * t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'end':
                                    shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                case 'start':
                                    shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    break;
                                case 'middle':
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                    }
                    else {
                        this._label._elem.css('top', '0px');
                    }
                    this._label.pack();
                }
            }
            else {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel && !t.isMinorTick) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'yaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (temp * t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    // if (t.angle > 0) {
                                    //     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    // }
                                    // else {
                                    //     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    // }
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    if (this.name !== 'yMidAxis') {
                        this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    }
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                    }
                    else if (this.name !== 'yMidAxis') {
                        this._label._elem.css('right', '0px');
                    }   
                    this._label.pack();
                }
            }
        }

        ticks = null;
    };
})(jQuery);

/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(e){e.jqplot.PyramidAxisRenderer=function(){e.jqplot.LinearAxisRenderer.call(this)};e.jqplot.PyramidAxisRenderer.prototype=new e.jqplot.LinearAxisRenderer();e.jqplot.PyramidAxisRenderer.prototype.constructor=e.jqplot.PyramidAxisRenderer;e.jqplot.PyramidAxisRenderer.prototype.init=function(f){this.position=null;this.drawBaseline=true;this.baselineWidth=null;this.baselineColor=null;this.tickSpacingFactor=25;this._type="pyramid";this._splitAxis=false;this._splitLength=null;this.category=false;this._autoFormatString="";this._overrideFormatString=false;e.extend(true,this,f);this.renderer.options=f;this.resetDataBounds=this.renderer.resetDataBounds;this.resetDataBounds()};e.jqplot.PyramidAxisRenderer.prototype.resetDataBounds=function(){var h=this._dataBounds;h.min=null;h.max=null;var g;for(var m=0;m<this._series.length;m++){var n=this._series[m];var o=n._plotData;for(var k=0,f=o.length;k<f;k++){if(this.name.charAt(0)==="x"){g=o[k][1];if((g!==null&&g<h.min)||h.min===null){h.min=g}if((g!==null&&g>h.max)||h.max===null){h.max=g}}else{g=o[k][0];if((g!==null&&g<h.min)||h.min===null){h.min=g}if((g!==null&&g>h.max)||h.max===null){h.max=g}}}}};e.jqplot.PyramidAxisRenderer.prototype.draw=function(f,n){if(this.show){this.renderer.createTicks.call(this,n);var m=0;var g;if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=e(document.createElement("div"));this._elem.addClass("jqplot-axis jqplot-"+this.name);this._elem.css("position","absolute");if(this.name=="xaxis"||this.name=="x2axis"){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var l=this._label.draw(f,n);l.appendTo(this._elem);l=null}var k=this._ticks;var j;for(var h=0;h<k.length;h++){j=k[h];if(j.show&&j.showLabel&&(!j.isMinorTick)){this._elem.append(j.draw(f,n))}}j=null;k=null}return this._elem};var b=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];var d={};for(var c=0,a=b.length;c<a;c++){d[b[c]]=b[c]}e.jqplot.PyramidAxisRenderer.prototype.createTicks=function(D){var J=this.ticks;var M=this._dataBounds;var E;var K;var B;var G;var y;var n;var k;var h;var H;var C;var x;var L=this.min;var N=this.max;var q;var v;var m;var g;var j;var O;var A;var F;var r;var P;var z=null;var I;if(J.length){for(H=0,C=J.length;H<C;H++){q=J[H];v=new this.tickRenderer(this.tickOptions);if(e.isArray(q)){v.value=q[0];v.label=q[1];v.setTick(q[0],this.name);this._ticks.push(v)}else{if(e.isPlainObject(q)){e.extend(true,v,q);v.axis=this.name;this._ticks.push(v)}else{if(typeof q==="string"){P=H+D.defaultAxisStart}else{P=q}v.value=P;v.label=q;v.axis=this.name;this._ticks.push(v)}}}this.numberTicks=J.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value;this.tickInterval=(this.max-this.min)/(this.numberTicks-1);if(this._options.tickInterval){var o=this._options.tickInterval;for(H=0;H<this.numberTicks;H++){if(H%o!==0){this._ticks[H].isMinorTick=true}}}else{E=(this.name.charAt(0)==="x")?this._plotDimensions.width:this._plotDimensions.height;r=Math.round(2+E/this.tickSpacingFactor);if(this.numberTicks>r){I=this.numberTicks-1;for(H=2;H<I;H++){if(I%H===0&&I/H<r){z=H-1;break}}if(z!==null){var p=1;for(H=1,C=this._ticks.length;H<C;H++){if(p<=z){this._ticks[H].show=false;p+=1}else{p=1}}}}}I=[];if(this.category){this._ticks[0].showGridline=false;this._ticks[0].showMark=false;for(H=this._ticks.length-1;H>0;H--){v=new this.tickRenderer(this.tickOptions);v.value=this._ticks[H-1].value+this.tickInterval/2;v.label="";v.showLabel=false;v.axis=this.name;this._ticks[H].showGridline=false;this._ticks[H].showMark=false;this._ticks.splice(H,0,v)}v=new this.tickRenderer(this.tickOptions);v.value=this._ticks[0].value-this.tickInterval/2;v.label="";v.showLabel=false;v.axis=this.name;this._ticks.unshift(v);v=new this.tickRenderer(this.tickOptions);v.value=this._ticks[this._ticks.length-1].value+this.tickInterval/2;v.label="";v.showLabel=false;v.axis=this.name;this._ticks.push(v);this.tickInterval=this.tickInterval/2;this.numberTicks=this._ticks.length;this.min=this._ticks[0].value;this.max=this._ticks[this._ticks.length-1].value}}else{if(this.name.charAt(0)==="x"){E=this._plotDimensions.width;var w=Math.max(M.max,Math.abs(M.min));var u=Math.min(M.min,-w);B=u;G=w;y=G-B;if(this.tickOptions==null||!this.tickOptions.formatString){this._overrideFormatString=true}m=30;g=Math.max(E,m+1);j=(g-m)/300;O=e.jqplot.LinearTickGenerator(B,G,j);A=B+y*(this.padMin-1);F=G-y*(this.padMax-1);if(B<A||G>F){A=B-y*(this.padMin-1);F=G+y*(this.padMax-1);O=e.jqplot.LinearTickGenerator(A,F,j)}this.min=O[0];this.max=O[1];this.numberTicks=O[2];this._autoFormatString=O[3];this.tickInterval=O[4]}else{E=this._plotDimensions.height;B=M.min;G=M.max;x=this._series[0];this._ticks=[];y=G-B;if(d[y]){y+=1;G+=1}this.max=G;this.min=B;r=Math.round(2+E/this.tickSpacingFactor);if(y+1<=r){this.numberTicks=y+1;this.tickInterval=1}else{for(var H=r;H>1;H--){if(y/(H-1)===Math.round(y/(H-1))){this.numberTicks=H;this.tickInterval=y/(H-1);break}}}}if(this._overrideFormatString&&this._autoFormatString!=""){this.tickOptions=this.tickOptions||{};this.tickOptions.formatString=this._autoFormatString}var f;for(H=0;H<this.numberTicks;H++){this.tickOptions.axis=this.name;f=this.min+this.tickInterval*H;if(this.name.charAt(0)==="x"){f=Math.abs(f)}this.tickOptions.value=this.min+this.tickInterval*H;v=new this.tickRenderer(this.tickOptions);v.label=v.prefix+v.formatter(v.formatString,f);this._ticks.push(v);if(this.name.charAt(0)==="x"&&D.axes.yMidAxis.show&&this.tickOptions.value===0){this._splitAxis=true;this._splitLength=D.axes.yMidAxis.getWidth();v=new this.tickRenderer(this.tickOptions);this._ticks.push(v);v.value=this.max/2000}}v=null}};e.jqplot.PyramidAxisRenderer.prototype.set=function(){var o=0;var j;var g=0;var n=0;var m;var l;var k;var f=(this._label==null)?false:this._label.show;if(this.show){l=this._ticks;a=l.length;for(m=0;m<a;m++){k=l[m];if(!k._breakTick&&k.show&&k.showLabel&&!k.isMinorTick){if(this.name.charAt(0)==="x"){j=k._elem.outerHeight(true)}else{j=k._elem.outerWidth(true)}if(j>o){o=j}}}if(this.name==="yMidAxis"){for(m=0;m<a;m++){k=l[m];if(k._elem){j=(o-k._elem.outerWidth(true))/2;k._elem.css("left",j)}}}k=null;l=null;if(f){g=this._label._elem.outerWidth(true);n=this._label._elem.outerHeight(true)}if(this.name==="xaxis"){o=o+n;this._elem.css({height:o+"px",left:"0px",bottom:"0px"})}else{if(this.name==="x2axis"){o=o+n;this._elem.css({height:o+"px",left:"0px",top:"0px"})}else{if(this.name==="yaxis"){o=o+g;this._elem.css({width:o+"px",left:"0px",top:"0px"});if(f&&this._label.constructor==e.jqplot.AxisLabelRenderer){this._label._elem.css("width",g+"px")}}else{if(this.name==="yMidAxis"){var j=o/2-g/2;this._elem.css({width:o+"px",top:"0px"});if(f&&this._label.constructor==e.jqplot.AxisLabelRenderer){this._label._elem.css({width:g,left:j,top:0})}}else{o=o+g;this._elem.css({width:o+"px",right:"0px",top:"0px"});if(f&&this._label.constructor==e.jqplot.AxisLabelRenderer){this._label._elem.css("width",g+"px")}}}}}}};e.jqplot.PyramidAxisRenderer.prototype.pack=function(j,g){j=j||{};g=g||this._offsets;var B=this._ticks;var v=this.max;var u=this.min;var o=g.max;var m=g.min;var r=(this._label==null)?false:this._label.show;for(var s in j){this._elem.css(s,j[s])}this._offsets=g;var k=o-m;var l=v-u;var z=this._splitLength;if(this._splitAxis){k-=this._splitLength;this.p2u=function(h){return(h-m)*l/k+u};this.u2p=function(h){if(h<=0){return(h-u)*k/l+m}else{return(h-u)*k/l+m+z}};this.series_u2p=function(h){if(h<=0){return(h-u)*k/l}else{return(h-u)*k/l+z}};this.series_p2u=function(h){return h*l/k+u}}else{this.p2u=function(h){return(h-m)*l/k+u};this.u2p=function(h){return(h-u)*k/l+m};if(this.name.charAt(0)==="x"){this.series_u2p=function(h){return(h-u)*k/l};this.series_p2u=function(h){return h*l/k+u}}else{this.series_u2p=function(h){return(h-v)*k/l};this.series_p2u=function(h){return h*l/k+v}}}if(this.show){if(this.name.charAt(0)==="x"){for(var x=0;x<B.length;x++){var q=B[x];if(q.show&&q.showLabel){var f;if(q.constructor==e.jqplot.CanvasAxisTickRenderer&&q.angle){var A=(this.name=="xaxis")?1:-1;switch(q.labelPosition){case"auto":if(A*q.angle<0){f=-q.getWidth()+q._textRenderer.height*Math.sin(-q._textRenderer.angle)/2}else{f=-q._textRenderer.height*Math.sin(q._textRenderer.angle)/2}break;case"end":f=-q.getWidth()+q._textRenderer.height*Math.sin(-q._textRenderer.angle)/2;break;case"start":f=-q._textRenderer.height*Math.sin(q._textRenderer.angle)/2;break;case"middle":f=-q.getWidth()/2+q._textRenderer.height*Math.sin(-q._textRenderer.angle)/2;break;default:f=-q.getWidth()/2+q._textRenderer.height*Math.sin(-q._textRenderer.angle)/2;break}}else{f=-q.getWidth()/2}var C=this.u2p(q.value)+f+"px";q._elem.css("left",C);q.pack()}}if(r){var n=this._label._elem.outerWidth(true);this._label._elem.css("left",m+k/2-n/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px")}else{this._label._elem.css("top","0px")}this._label.pack()}}else{for(var x=0;x<B.length;x++){var q=B[x];if(q.show&&q.showLabel&&!q.isMinorTick){var f;if(q.constructor==e.jqplot.CanvasAxisTickRenderer&&q.angle){var A=(this.name=="yaxis")?1:-1;switch(q.labelPosition){case"auto":case"end":if(A*q.angle<0){f=-q._textRenderer.height*Math.cos(-q._textRenderer.angle)/2}else{f=-q.getHeight()+q._textRenderer.height*Math.cos(q._textRenderer.angle)/2}break;case"start":if(q.angle>0){f=-q._textRenderer.height*Math.cos(-q._textRenderer.angle)/2}else{f=-q.getHeight()+q._textRenderer.height*Math.cos(q._textRenderer.angle)/2}break;case"middle":f=-q.getHeight()/2;break;default:f=-q.getHeight()/2;break}}else{f=-q.getHeight()/2}var C=this.u2p(q.value)+f+"px";q._elem.css("top",C);q.pack()}}if(r){var y=this._label._elem.outerHeight(true);if(this.name!=="yMidAxis"){this._label._elem.css("top",o-k/2-y/2+"px")}if(this.name=="yaxis"){this._label._elem.css("left","0px")}else{if(this.name!=="yMidAxis"){this._label._elem.css("right","0px")}}this._label.pack()}}}B=null}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {     
    // Class: $.jqplot.CanvasGridRenderer
    // The default jqPlot grid renderer, creating a grid on a canvas element.
    // The renderer has no additional options beyond the <Grid> class.
    $.jqplot.PyramidGridRenderer = function(){
        $.jqplot.CanvasGridRenderer.call(this);
    };

    $.jqplot.PyramidGridRenderer.prototype = new $.jqplot.CanvasGridRenderer();
    $.jqplot.PyramidGridRenderer.prototype.constructor = $.jqplot.PyramidGridRenderer;
    
    // called with context of Grid object
    $.jqplot.CanvasGridRenderer.prototype.init = function(options) {
        this._ctx;
        this.plotBands = {
            show: false,
            color: 'rgb(230, 219, 179)',
            axis: 'y',
            start: null,
            interval: 10
        };
        $.extend(true, this, options);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:false, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.shadowWidth, closePath:false, strokeStyle:this.shadowColor};
        this.renderer.shadowRenderer.init(sopts);
    };
    
    $.jqplot.PyramidGridRenderer.prototype.draw = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        var ctx = this._ctx;
        var axes = this._axes;
        var xp = axes.xaxis.u2p;
        var yp = axes.yMidAxis.u2p;
        var xnudge = axes.xaxis.max/1000.0;
        var xp0 = xp(0);
        var xpn = xp(xnudge);
        var ax = ['xaxis', 'yaxis', 'x2axis', 'y2axis','yMidAxis'];
        // Add the grid onto the grid canvas.  This is the bottom most layer.
        ctx.save();
        ctx.clearRect(0, 0, this._plotDimensions.width, this._plotDimensions.height);
        ctx.fillStyle = this.backgroundColor || this.background;

        ctx.fillRect(this._left, this._top, this._width, this._height);

        if (this.plotBands.show) {
            ctx.save();
            var pb = this.plotBands;
            ctx.fillStyle = pb.color;
            var axis;
            var x, y, w, h;
            // find axis to work with
            if (pb.axis.charAt(0) === 'x') {
                if (axes.xaxis.show) {
                    axis = axes.xaxis;
                }
            }
            else if (pb.axis.charAt(0) === 'y') {
                if (axes.yaxis.show) {
                    axis = axes.yaxis;
                }
                else if (axes.y2axis.show) {
                    axis = axes.y2axis;
                }
                else if (axes.yMidAxis.show) {
                    axis = axes.yMidAxis;
                }
            }

            if (axis !== undefined) {
                // draw some rectangles
                var start = pb.start;
                if (start === null) {
                    start = axis.min;
                }
                for (var i = start; i < axis.max; i += 2 * pb.interval) {
                    if (axis.name.charAt(0) === 'y') {
                        x = this._left;
                        if ((i + pb.interval) < axis.max) {
                            y = axis.series_u2p(i + pb.interval) + this._top;
                        }
                        else {
                            y = axis.series_u2p(axis.max) + this._top;
                        }
                        w = this._right - this._left;
                        h = axis.series_u2p(start) - axis.series_u2p(start + pb.interval);
                        ctx.fillRect(x, y, w, h);
                    }
                    // else {
                    //     y = 0;
                    //     x = axis.series_u2p(i);
                    //     h = this._height;
                    //     w = axis.series_u2p(start + pb.interval) - axis.series_u2p(start);
                    // }

                }
            }
            ctx.restore();
        }
        
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'butt';
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = this.gridLineColor;
        var b, e, s, m;
        for (var i=5; i>0; i--) {
            var name = ax[i-1];
            var axis = axes[name];
            var ticks = axis._ticks;
            var numticks = ticks.length;
            if (axis.show) {
                if (axis.drawBaseline) {
                    var bopts = {};
                    if (axis.baselineWidth !== null) {
                        bopts.lineWidth = axis.baselineWidth;
                    }
                    if (axis.baselineColor !== null) {
                        bopts.strokeStyle = axis.baselineColor;
                    }
                    switch (name) {
                        case 'xaxis':
                            if (axes.yMidAxis.show) {
                                drawLine (this._left, this._bottom, xp0, this._bottom, bopts);
                                drawLine (xpn, this._bottom, this._right, this._bottom, bopts);
                            }
                            else {
                                drawLine (this._left, this._bottom, this._right, this._bottom, bopts);
                            }
                            break;
                        case 'yaxis':
                            drawLine (this._left, this._bottom, this._left, this._top, bopts);
                            break;
                        case 'yMidAxis':               
                            drawLine(xp0, this._bottom, xp0, this._top, bopts);
                            drawLine(xpn, this._bottom, xpn, this._top, bopts);
                            break;
                        case 'x2axis':
                            if (axes.yMidAxis.show) {
                                drawLine (this._left, this._top, xp0, this._top, bopts);
                                drawLine (xpn, this._top, this._right, this._top, bopts);
                            }
                            else {
                                drawLine (this._left, this._bottom, this._right, this._bottom, bopts);
                            }
                            break;
                        case 'y2axis':
                            drawLine (this._right, this._bottom, this._right, this._top, bopts);
                            break;

                    }
                }
                for (var j=numticks; j>0; j--) {
                    var t = ticks[j-1];
                    if (t.show) {
                        var pos = Math.round(axis.u2p(t.value)) + 0.5;
                        switch (name) {
                            case 'xaxis':
                                // draw the grid line if we should
                                if (t.showGridline && this.drawGridlines && (!t.isMinorTick || axis.showMinorTicks)) {
                                    drawLine(pos, this._top, pos, this._bottom);
                                }
                                
                                // draw the mark
                                if (t.showMark && t.mark && (!t.isMinorTick || axis.showMinorTicks)) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._bottom;
                                            e = this._bottom+s;
                                            break;
                                        case 'inside':
                                            b = this._bottom-s;
                                            e = this._bottom;
                                            break;
                                        case 'cross':
                                            b = this._bottom-s;
                                            e = this._bottom+s;
                                            break;
                                        default:
                                            b = this._bottom;
                                            e = this._bottom+s;
                                            break;
                                    }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[pos,b],[pos,e]], {lineCap:'butt', lineWidth:this.gridLineWidth, offset:this.gridLineWidth*0.75, depth:2, fill:false, closePath:false});
                                    }
                                    // draw the line
                                    drawLine(pos, b, pos, e);
                                }
                                break;
                            case 'yaxis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && (!t.isMinorTick || axis.showMinorTicks)) {
                                    drawLine(this._right, pos, this._left, pos);
                                }

                                // draw the mark
                                if (t.showMark && t.mark && (!t.isMinorTick || axis.showMinorTicks)) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._left-s;
                                            e = this._left;
                                            break;
                                        case 'inside':
                                            b = this._left;
                                            e = this._left+s;
                                            break;
                                        case 'cross':
                                            b = this._left-s;
                                            e = this._left+s;
                                            break;
                                        default:
                                            b = this._left-s;
                                            e = this._left;
                                            break;
                                            }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                                    }
                                    drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});
                                }
                                break;
                            case 'yMidAxis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && (!t.isMinorTick || axis.showMinorTicks)) {
                                    drawLine(this._left, pos, xp0, pos);
                                    drawLine(xpn, pos, this._right, pos);
                                }
                                // draw the mark
                                if (t.showMark && t.mark && (!t.isMinorTick || axis.showMinorTicks)) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;

                                    b = xp0;
                                    e = xp0 + s;
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                                    }
                                    drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});

                                    b = xpn - s;
                                    e = xpn;
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                                    }
                                    drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});
                                }
                                break;
                            case 'x2axis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && (!t.isMinorTick || axis.showMinorTicks)) {
                                    drawLine(pos, this._bottom, pos, this._top);
                                }

                                // draw the mark
                                if (t.showMark && t.mark && (!t.isMinorTick || axis.showMinorTicks)) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._top-s;
                                            e = this._top;
                                            break;
                                        case 'inside':
                                            b = this._top;
                                            e = this._top+s;
                                            break;
                                        case 'cross':
                                            b = this._top-s;
                                            e = this._top+s;
                                            break;
                                        default:
                                            b = this._top-s;
                                            e = this._top;
                                            break;
                                            }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[pos,b],[pos,e]], {lineCap:'butt', lineWidth:this.gridLineWidth, offset:this.gridLineWidth*0.75, depth:2, fill:false, closePath:false});
                                    }
                                    drawLine(pos, b, pos, e);
                                }
                                break;
                            case 'y2axis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && (!t.isMinorTick || axis.showMinorTicks)) {
                                    drawLine(this._left, pos, this._right, pos);
                                }

                                // draw the mark
                                if (t.showMark && t.mark && (!t.isMinorTick || axis.showMinorTicks)) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._right;
                                            e = this._right+s;
                                            break;
                                        case 'inside':
                                            b = this._right-s;
                                            e = this._right;
                                            break;
                                        case 'cross':
                                            b = this._right-s;
                                            e = this._right+s;
                                            break;
                                        default:
                                            b = this._right;
                                            e = this._right+s;
                                            break;
                                            }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                                    }
                                    drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                t = null;
            }
            axis = null;
            ticks = null;
        }
        
        ctx.restore();
        
        function drawLine(bx, by, ex, ey, opts) {
            ctx.save();
            opts = opts || {};
            if (opts.lineWidth == null || opts.lineWidth != 0){
                $.extend(true, ctx, opts);
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            }
            ctx.restore();
        }
        
        if (this.shadow) {
            if (axes.yMidAxis.show) {
                var points = [[this._left, this._bottom], [xp0, this._bottom]];
                this.renderer.shadowRenderer.draw(ctx, points);
                var points = [[xpn, this._bottom], [this._right, this._bottom], [this._right, this._top]];
                this.renderer.shadowRenderer.draw(ctx, points);
                var points = [[xp0, this._bottom], [xp0, this._top]];
                this.renderer.shadowRenderer.draw(ctx, points);
            }
            else {
                var points = [[this._left, this._bottom], [this._right, this._bottom], [this._right, this._top]];
                this.renderer.shadowRenderer.draw(ctx, points);
            }
        }
        // Now draw border around grid.  Use axis border definitions. start at
        // upper left and go clockwise.
        if (this.borderWidth != 0 && this.drawBorder) {
            if (axes.yMidAxis.show) {
                drawLine (this._left, this._top, xp0, this._top, {lineCap:'round', strokeStyle:axes.x2axis.borderColor, lineWidth:axes.x2axis.borderWidth});
                drawLine (xpn, this._top, this._right, this._top, {lineCap:'round', strokeStyle:axes.x2axis.borderColor, lineWidth:axes.x2axis.borderWidth});
                drawLine (this._right, this._top, this._right, this._bottom, {lineCap:'round', strokeStyle:axes.y2axis.borderColor, lineWidth:axes.y2axis.borderWidth});
                drawLine (this._right, this._bottom, xpn, this._bottom, {lineCap:'round', strokeStyle:axes.xaxis.borderColor, lineWidth:axes.xaxis.borderWidth});
                drawLine (xp0, this._bottom, this._left, this._bottom, {lineCap:'round', strokeStyle:axes.xaxis.borderColor, lineWidth:axes.xaxis.borderWidth});
                drawLine (this._left, this._bottom, this._left, this._top, {lineCap:'round', strokeStyle:axes.yaxis.borderColor, lineWidth:axes.yaxis.borderWidth});
                drawLine (xp0, this._bottom, xp0, this._top, {lineCap:'round', strokeStyle:axes.yaxis.borderColor, lineWidth:axes.yaxis.borderWidth});
                drawLine (xpn, this._bottom, xpn, this._top, {lineCap:'round', strokeStyle:axes.yaxis.borderColor, lineWidth:axes.yaxis.borderWidth});
            }
            else {
                drawLine (this._left, this._top, this._right, this._top, {lineCap:'round', strokeStyle:axes.x2axis.borderColor, lineWidth:axes.x2axis.borderWidth});
                drawLine (this._right, this._top, this._right, this._bottom, {lineCap:'round', strokeStyle:axes.y2axis.borderColor, lineWidth:axes.y2axis.borderWidth});
                drawLine (this._right, this._bottom, this._left, this._bottom, {lineCap:'round', strokeStyle:axes.xaxis.borderColor, lineWidth:axes.xaxis.borderWidth});
                drawLine (this._left, this._bottom, this._left, this._top, {lineCap:'round', strokeStyle:axes.yaxis.borderColor, lineWidth:axes.yaxis.borderWidth});
            }
        }
        // ctx.lineWidth = this.borderWidth;
        // ctx.strokeStyle = this.borderColor;
        // ctx.strokeRect(this._left, this._top, this._width, this._height);
        
        ctx.restore();
        ctx =  null;
        axes = null;
    };
})(jQuery); 
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(a){a.jqplot.PyramidGridRenderer=function(){a.jqplot.CanvasGridRenderer.call(this)};a.jqplot.PyramidGridRenderer.prototype=new a.jqplot.CanvasGridRenderer();a.jqplot.PyramidGridRenderer.prototype.constructor=a.jqplot.PyramidGridRenderer;a.jqplot.CanvasGridRenderer.prototype.init=function(c){this._ctx;this.plotBands={show:false,color:"rgb(230, 219, 179)",axis:"y",start:null,interval:10};a.extend(true,this,c);var b={lineJoin:"miter",lineCap:"round",fill:false,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.shadowWidth,closePath:false,strokeStyle:this.shadowColor};this.renderer.shadowRenderer.init(b)};a.jqplot.PyramidGridRenderer.prototype.draw=function(){this._ctx=this._elem.get(0).getContext("2d");var D=this._ctx;var G=this._axes;var q=G.xaxis.u2p;var J=G.yMidAxis.u2p;var l=G.xaxis.max/1000;var u=q(0);var f=q(l);var r=["xaxis","yaxis","x2axis","y2axis","yMidAxis"];D.save();D.clearRect(0,0,this._plotDimensions.width,this._plotDimensions.height);D.fillStyle=this.backgroundColor||this.background;D.fillRect(this._left,this._top,this._width,this._height);if(this.plotBands.show){D.save();var c=this.plotBands;D.fillStyle=c.color;var d;var o,n,p,I;if(c.axis.charAt(0)==="x"){if(G.xaxis.show){d=G.xaxis}}else{if(c.axis.charAt(0)==="y"){if(G.yaxis.show){d=G.yaxis}else{if(G.y2axis.show){d=G.y2axis}else{if(G.yMidAxis.show){d=G.yMidAxis}}}}}if(d!==undefined){var g=c.start;if(g===null){g=d.min}for(var H=g;H<d.max;H+=2*c.interval){if(d.name.charAt(0)==="y"){o=this._left;if((H+c.interval)<d.max){n=d.series_u2p(H+c.interval)+this._top}else{n=d.series_u2p(d.max)+this._top}p=this._right-this._left;I=d.series_u2p(g)-d.series_u2p(g+c.interval);D.fillRect(o,n,p,I)}}}D.restore()}D.save();D.lineJoin="miter";D.lineCap="butt";D.lineWidth=this.gridLineWidth;D.strokeStyle=this.gridLineColor;var L,K,A,C;for(var H=5;H>0;H--){var O=r[H-1];var d=G[O];var M=d._ticks;var B=M.length;if(d.show){if(d.drawBaseline){var N={};if(d.baselineWidth!==null){N.lineWidth=d.baselineWidth}if(d.baselineColor!==null){N.strokeStyle=d.baselineColor}switch(O){case"xaxis":if(G.yMidAxis.show){z(this._left,this._bottom,u,this._bottom,N);z(f,this._bottom,this._right,this._bottom,N)}else{z(this._left,this._bottom,this._right,this._bottom,N)}break;case"yaxis":z(this._left,this._bottom,this._left,this._top,N);break;case"yMidAxis":z(u,this._bottom,u,this._top,N);z(f,this._bottom,f,this._top,N);break;case"x2axis":if(G.yMidAxis.show){z(this._left,this._top,u,this._top,N);z(f,this._top,this._right,this._top,N)}else{z(this._left,this._bottom,this._right,this._bottom,N)}break;case"y2axis":z(this._right,this._bottom,this._right,this._top,N);break}}for(var E=B;E>0;E--){var v=M[E-1];if(v.show){var k=Math.round(d.u2p(v.value))+0.5;switch(O){case"xaxis":if(v.showGridline&&this.drawGridlines&&(!v.isMinorTick||d.showMinorTicks)){z(k,this._top,k,this._bottom)}if(v.showMark&&v.mark&&(!v.isMinorTick||d.showMinorTicks)){A=v.markSize;C=v.mark;var k=Math.round(d.u2p(v.value))+0.5;switch(C){case"outside":L=this._bottom;K=this._bottom+A;break;case"inside":L=this._bottom-A;K=this._bottom;break;case"cross":L=this._bottom-A;K=this._bottom+A;break;default:L=this._bottom;K=this._bottom+A;break}if(this.shadow){this.renderer.shadowRenderer.draw(D,[[k,L],[k,K]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}z(k,L,k,K)}break;case"yaxis":if(v.showGridline&&this.drawGridlines&&(!v.isMinorTick||d.showMinorTicks)){z(this._right,k,this._left,k)}if(v.showMark&&v.mark&&(!v.isMinorTick||d.showMinorTicks)){A=v.markSize;C=v.mark;var k=Math.round(d.u2p(v.value))+0.5;switch(C){case"outside":L=this._left-A;K=this._left;break;case"inside":L=this._left;K=this._left+A;break;case"cross":L=this._left-A;K=this._left+A;break;default:L=this._left-A;K=this._left;break}if(this.shadow){this.renderer.shadowRenderer.draw(D,[[L,k],[K,k]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}z(L,k,K,k,{strokeStyle:d.borderColor})}break;case"yMidAxis":if(v.showGridline&&this.drawGridlines&&(!v.isMinorTick||d.showMinorTicks)){z(this._left,k,u,k);z(f,k,this._right,k)}if(v.showMark&&v.mark&&(!v.isMinorTick||d.showMinorTicks)){A=v.markSize;C=v.mark;var k=Math.round(d.u2p(v.value))+0.5;L=u;K=u+A;if(this.shadow){this.renderer.shadowRenderer.draw(D,[[L,k],[K,k]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}z(L,k,K,k,{strokeStyle:d.borderColor});L=f-A;K=f;if(this.shadow){this.renderer.shadowRenderer.draw(D,[[L,k],[K,k]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}z(L,k,K,k,{strokeStyle:d.borderColor})}break;case"x2axis":if(v.showGridline&&this.drawGridlines&&(!v.isMinorTick||d.showMinorTicks)){z(k,this._bottom,k,this._top)}if(v.showMark&&v.mark&&(!v.isMinorTick||d.showMinorTicks)){A=v.markSize;C=v.mark;var k=Math.round(d.u2p(v.value))+0.5;switch(C){case"outside":L=this._top-A;K=this._top;break;case"inside":L=this._top;K=this._top+A;break;case"cross":L=this._top-A;K=this._top+A;break;default:L=this._top-A;K=this._top;break}if(this.shadow){this.renderer.shadowRenderer.draw(D,[[k,L],[k,K]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}z(k,L,k,K)}break;case"y2axis":if(v.showGridline&&this.drawGridlines&&(!v.isMinorTick||d.showMinorTicks)){z(this._left,k,this._right,k)}if(v.showMark&&v.mark&&(!v.isMinorTick||d.showMinorTicks)){A=v.markSize;C=v.mark;var k=Math.round(d.u2p(v.value))+0.5;switch(C){case"outside":L=this._right;K=this._right+A;break;case"inside":L=this._right-A;K=this._right;break;case"cross":L=this._right-A;K=this._right+A;break;default:L=this._right;K=this._right+A;break}if(this.shadow){this.renderer.shadowRenderer.draw(D,[[L,k],[K,k]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}z(L,k,K,k,{strokeStyle:d.borderColor})}break;default:break}}}v=null}d=null;M=null}D.restore();function z(j,i,e,b,h){D.save();h=h||{};if(h.lineWidth==null||h.lineWidth!=0){a.extend(true,D,h);D.beginPath();D.moveTo(j,i);D.lineTo(e,b);D.stroke()}D.restore()}if(this.shadow){if(G.yMidAxis.show){var F=[[this._left,this._bottom],[u,this._bottom]];this.renderer.shadowRenderer.draw(D,F);var F=[[f,this._bottom],[this._right,this._bottom],[this._right,this._top]];this.renderer.shadowRenderer.draw(D,F);var F=[[u,this._bottom],[u,this._top]];this.renderer.shadowRenderer.draw(D,F)}else{var F=[[this._left,this._bottom],[this._right,this._bottom],[this._right,this._top]];this.renderer.shadowRenderer.draw(D,F)}}if(this.borderWidth!=0&&this.drawBorder){if(G.yMidAxis.show){z(this._left,this._top,u,this._top,{lineCap:"round",strokeStyle:G.x2axis.borderColor,lineWidth:G.x2axis.borderWidth});z(f,this._top,this._right,this._top,{lineCap:"round",strokeStyle:G.x2axis.borderColor,lineWidth:G.x2axis.borderWidth});z(this._right,this._top,this._right,this._bottom,{lineCap:"round",strokeStyle:G.y2axis.borderColor,lineWidth:G.y2axis.borderWidth});z(this._right,this._bottom,f,this._bottom,{lineCap:"round",strokeStyle:G.xaxis.borderColor,lineWidth:G.xaxis.borderWidth});z(u,this._bottom,this._left,this._bottom,{lineCap:"round",strokeStyle:G.xaxis.borderColor,lineWidth:G.xaxis.borderWidth});z(this._left,this._bottom,this._left,this._top,{lineCap:"round",strokeStyle:G.yaxis.borderColor,lineWidth:G.yaxis.borderWidth});z(u,this._bottom,u,this._top,{lineCap:"round",strokeStyle:G.yaxis.borderColor,lineWidth:G.yaxis.borderWidth});z(f,this._bottom,f,this._top,{lineCap:"round",strokeStyle:G.yaxis.borderColor,lineWidth:G.yaxis.borderWidth})}else{z(this._left,this._top,this._right,this._top,{lineCap:"round",strokeStyle:G.x2axis.borderColor,lineWidth:G.x2axis.borderWidth});z(this._right,this._top,this._right,this._bottom,{lineCap:"round",strokeStyle:G.y2axis.borderColor,lineWidth:G.y2axis.borderWidth});z(this._right,this._bottom,this._left,this._bottom,{lineCap:"round",strokeStyle:G.xaxis.borderColor,lineWidth:G.xaxis.borderWidth});z(this._left,this._bottom,this._left,this._top,{lineCap:"round",strokeStyle:G.yaxis.borderColor,lineWidth:G.yaxis.borderWidth})}}D.restore();D=null;G=null}})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {

    // Need to ensure pyramid axis and grid renderers are loaded.
    // You should load these with script tags in the html head, that is more efficient
    // as the browser will cache the request.
    // Note, have to block with synchronous request in order to execute bar renderer code.
    if ($.jqplot.PyramidAxisRenderer === undefined) {
        $.ajax({
            url: $.jqplot.pluginLocation + 'jqplot.pyramidAxisRenderer.js',
            dataType: "script",
            async: false
        });
    }
    
    if ($.jqplot.PyramidGridRenderer === undefined) {
        $.ajax({
            url: $.jqplot.pluginLocation + 'jqplot.pyramidGridRenderer.js',
            dataType: "script",
            async: false
        });
    }

    $.jqplot.PyramidRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.PyramidRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.PyramidRenderer.prototype.constructor = $.jqplot.PyramidRenderer;
    
    // called with scope of a series
    $.jqplot.PyramidRenderer.prototype.init = function(options, plot) {
        options = options || {};
        this._type = 'pyramid';
        // Group: Properties
        //
        // prop: barPadding
        this.barPadding = 10;
        this.barWidth = null;
        // prop: fill
        // True to fill the bars.
        this.fill = true;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a slice.
        this.highlightColors = [];
        // prop highlightThreshold
        // Expand the highlightable region in the x direction.
        // E.g. a value of 3 will highlight a bar when the mouse is
        // within 3 pixels of the bar in the x direction.
        this.highlightThreshold = 2;
        // prop: synchronizeHighlight
        // Index of another series to highlight when this series is highlighted.
        // null or false to not synchronize.
        this.synchronizeHighlight = false;
        // prop: offsetBars
        // False will center bars on their y value.
        // True will push bars up by 1/2 bar width to fill between their y values.
        // If true, there needs to be 1 more tick than there are bars.
        this.offsetBars = false;
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }

        this.side = 'right';
        
        $.extend(true, this, options);

        // if (this.fill === false) {
        //     this.shadow = false;
        // }

        if (this.side === 'left') {
            this._highlightThreshold = [[-this.highlightThreshold, 0], [-this.highlightThreshold, 0], [0,0], [0,0]];
        }

        else {
            this._highlightThreshold = [[0,0], [0,0], [this.highlightThreshold, 0], [this.highlightThreshold, 0]];
        }
        
        this.renderer.options = options;
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        // Array of actual data colors used for each data point.
        this._dataColors = [];
        this._barPoints = [];
        this.fillAxis = 'y';
        this._primaryAxis = '_yaxis';
        this._xnudge = 0;
        
        // set the shape renderer options
        var opts = {lineJoin:'miter', lineCap:'butt', fill:this.fill, fillRect:this.fill, isarc:false, strokeStyle:this.color, fillStyle:this.color, closePath:this.fill, lineWidth: this.lineWidth};
        this.renderer.shapeRenderer.init(opts);
        // set the shadow renderer options
        var shadow_offset = options.shadowOffset;
        // set the shadow renderer options
        if (shadow_offset == null) {
            // scale the shadowOffset to the width of the line.
            if (this.lineWidth > 2.5) {
                shadow_offset = 1.25 * (1 + (Math.atan((this.lineWidth/2.5))/0.785398163 - 1)*0.6);
                // var shadow_offset = this.shadowOffset;
            }
            // for skinny lines, don't make such a big shadow.
            else {
                shadow_offset = 1.25 * Math.atan((this.lineWidth/2.5))/0.785398163;
            }
        }
        var sopts = {lineJoin:'miter', lineCap:'butt', fill:this.fill, fillRect:this.fill, isarc:false, angle:this.shadowAngle, offset:shadow_offset, alpha:this.shadowAlpha, depth:this.shadowDepth, closePath:this.fill, lineWidth: this.lineWidth};
        this.renderer.shadowRenderer.init(sopts);

        plot.postDrawHooks.addOnce(postPlotDraw);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);

        // if this is the left side of pyramid, set y values to negative.
        if (this.side === 'left') {
            for (var i=0, l=this.data.length; i<l; i++) {
                this.data[i][1] = -Math.abs(this.data[i][1]);
            }
        }
    };
    
    // setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.PyramidRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        var pdata = this._prevPlotData;
        this.gridData = [];
        this._prevGridData = [];
        var l = data.length;
        var adjust = false;
        var i;

        // if any data values are < 0,  consider this a negative series
        for (i = 0; i < l; i++) {
            if (data[i][1] < 0) {
                this.side = 'left';
            }
        }

        if (this._yaxis.name === 'yMidAxis' && this.side === 'right') {
            this._xnudge = this._xaxis.max/2000.0;
            adjust = true;
        }

        for (i = 0; i < l; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                this.gridData.push([xp(data[i][1]), yp(data[i][0])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                this.gridData.push([xp(data[i][1]), null]);
            }
            else if (data[i][1] == null) {
                this.gridData.push(null, [yp(data[i][0])]);
            }
            // finally, adjust x grid data if have to
            if (data[i][1] === 0 && adjust) {
                this.gridData[i][0] = xp(this._xnudge);
            }
        }
    };
    
    // makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.PyramidRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var l = data.length;
        var adjust = false;
        var i;

        // if any data values are < 0,  consider this a negative series
        for (i = 0; i < l; i++) {
            if (data[i][1] < 0) {
                this.side = 'left';
            }
        }

        if (this._yaxis.name === 'yMidAxis' && this.side === 'right') {
            this._xnudge = this._xaxis.max/2000.0;
            adjust = true;
        }

        for (i = 0; i < l; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                gd.push([xp(data[i][1]), yp(data[i][0])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                gd.push([xp(data[i][1]), null]);
            }
            else if (data[i][1] == null) {
                gd.push([null, yp(data[i][0])]);
            }
            // finally, adjust x grid data if have to
            if (data[i][1] === 0 && adjust) {
                gd[i][0] = xp(this._xnudge);
            }
        }

        return gd;
    };

    $.jqplot.PyramidRenderer.prototype.setBarWidth = function() {
        // need to know how many data values we have on the approprate axis and figure it out.
        var i;
        var nvals = 0;
        var nseries = 0;
        var paxis = this[this._primaryAxis];
        var s, series, pos;
        nvals = paxis.max - paxis.min;
        var nticks = paxis.numberTicks;
        var nbins = (nticks-1)/2;
        // so, now we have total number of axis values.
        var temp = (this.barPadding === 0) ? 1.0 : 0;
        if (paxis.name == 'xaxis' || paxis.name == 'x2axis') {
            this.barWidth = (paxis._offsets.max - paxis._offsets.min) / nvals - this.barPadding + temp;
        }
        else {
            if (this.fill) {
                this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals - this.barPadding + temp;
            }
            else {
                this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals;
            }
        }
    };
    
    $.jqplot.PyramidRenderer.prototype.draw = function(ctx, gridData, options) {
        var i;
        // Ughhh, have to make a copy of options b/c it may be modified later.
        var opts = $.extend({}, options);
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, pointy;
        // clear out data colors.
        this._dataColors = [];
        this._barPoints = [];
        
        if (this.renderer.options.barWidth == null) {
            this.renderer.setBarWidth.call(this);
        }
        
        // var temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        // var nvals = temp[0];
        // var nseries = temp[1];
        // var pos = temp[2];
        var points = [],
            w,
            h;
        
        // this._barNudge = 0;

        if (showLine) {
            var negativeColors = new $.jqplot.ColorGenerator(this.negativeSeriesColors);
            var positiveColors = new $.jqplot.ColorGenerator(this.seriesColors);
            var negativeColor = negativeColors.get(this.index);
            if (! this.useNegativeColors) {
                negativeColor = opts.fillStyle;
            }
            var positiveColor = opts.fillStyle;
            var base;
            var xstart = this._xaxis.series_u2p(this._xnudge);
            var ystart = this._yaxis.series_u2p(this._yaxis.min);
            var yend = this._yaxis.series_u2p(this._yaxis.max);
            var bw = this.barWidth;
            var bw2 = bw/2.0;
            var points = [];
            var yadj = this.offsetBars ? bw2 : 0;
            
            for (var i=0, l=gridData.length; i<l; i++) {
                if (this.data[i][0] == null) {
                    continue;
                }
                base = gridData[i][1];
                // not stacked and first series in stack

                if (this._plotData[i][1] < 0) {
                    if (this.varyBarColor && !this._stack) {
                        if (this.useNegativeColors) {
                            opts.fillStyle = negativeColors.next();
                        }
                        else {
                            opts.fillStyle = positiveColors.next();
                        }
                    }
                }
                else {
                    if (this.varyBarColor && !this._stack) {
                        opts.fillStyle = positiveColors.next();
                    }
                    else {
                        opts.fillStyle = positiveColor;
                    }                    
                }
                
                if (this.fill) {

                    if (this._plotData[i][1] >= 0) {
                        // xstart = this._xaxis.series_u2p(this._xnudge);
                        w = gridData[i][0] - xstart;
                        h = this.barWidth;
                        points = [xstart, base - bw2 - yadj, w, h];
                    }
                    else {
                        // xstart = this._xaxis.series_u2p(0);
                        w = xstart - gridData[i][0];
                        h = this.barWidth;
                        points = [gridData[i][0], base - bw2 - yadj, w, h];
                    }

                    this._barPoints.push([[points[0], points[1] + h], [points[0], points[1]], [points[0] + w, points[1]], [points[0] + w, points[1] + h]]);

                    if (shadow) {
                        this.renderer.shadowRenderer.draw(ctx, points);
                    }
                    var clr = opts.fillStyle || this.color;
                    this._dataColors.push(clr);
                    this.renderer.shapeRenderer.draw(ctx, points, opts); 
                }

                else {
                    if (i === 0) {
                        points =[[xstart, ystart], [gridData[i][0], ystart], [gridData[i][0], gridData[i][1] - bw2 - yadj]];
                    }

                    else if (i < l-1) {
                        points = points.concat([[gridData[i-1][0], gridData[i-1][1] - bw2 - yadj], [gridData[i][0], gridData[i][1] + bw2 - yadj], [gridData[i][0], gridData[i][1] - bw2 - yadj]]);
                    } 

                    // finally, draw the line
                    else {
                        points = points.concat([[gridData[i-1][0], gridData[i-1][1] - bw2 - yadj], [gridData[i][0], gridData[i][1] + bw2 - yadj], [gridData[i][0], yend], [xstart, yend]]);
                    
                        if (shadow) {
                            this.renderer.shadowRenderer.draw(ctx, points);
                        }
                        var clr = opts.fillStyle || this.color;
                        this._dataColors.push(clr);
                        this.renderer.shapeRenderer.draw(ctx, points, opts);
                    }
                }
            }  
        }        
        
        if (this.highlightColors.length == 0) {
            this.highlightColors = $.jqplot.computeHighlightColors(this._dataColors);
        }
        
        else if (typeof(this.highlightColors) == 'string') {
            this.highlightColors = [];
            for (var i=0; i<this._dataColors.length; i++) {
                this.highlightColors.push(this.highlightColors);
            }
        }
        
    };

        
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.grid = options.grid || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a pie series
        var setopts = false;
        if (options.seriesDefaults.renderer === $.jqplot.PyramidRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer === $.jqplot.PyramidRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.PyramidAxisRenderer;
            options.grid.renderer = $.jqplot.PyramidGridRenderer;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.pyramidRenderer && this.plugins.pyramidRenderer.highlightCanvas) {

            this.plugins.pyramidRenderer.highlightCanvas.resetCanvas();
            this.plugins.pyramidRenderer.highlightCanvas = null;
        }
         
        this.plugins.pyramidRenderer = {highlightedSeriesIndex:null};
        this.plugins.pyramidRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.pyramidRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-pyramidRenderer-highlight-canvas', this._plotDimensions, this));
        this.plugins.pyramidRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }  
    
    function highlight (plot, sidx, pidx, points) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.pyramidRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.pyramidRenderer.highlightedSeriesIndex = sidx;
        var opts = {fillStyle: s.highlightColors[pidx], fillRect: false};
        s.renderer.shapeRenderer.draw(canvas._ctx, points, opts);
        if (s.synchronizeHighlight !== false && plot.series.length >= s.synchronizeHighlight && s.synchronizeHighlight !== sidx) {
            s = plot.series[s.synchronizeHighlight];
            opts = {fillStyle: s.highlightColors[pidx], fillRect: false};
            s.renderer.shapeRenderer.draw(canvas._ctx, s._barPoints[pidx], opts);
        }
        canvas = null;
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.pyramidRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.pyramidRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
        canvas =  null;
    }
    
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.pyramidRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }

    // Have to add hook here, becuase it needs called before series is inited.
    $.jqplot.preInitHooks.push(preInit);
    

})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(c){if(c.jqplot.PyramidAxisRenderer===undefined){c.ajax({url:c.jqplot.pluginLocation+"jqplot.pyramidAxisRenderer.js",dataType:"script",async:false})}if(c.jqplot.PyramidGridRenderer===undefined){c.ajax({url:c.jqplot.pluginLocation+"jqplot.pyramidGridRenderer.js",dataType:"script",async:false})}c.jqplot.PyramidRenderer=function(){c.jqplot.LineRenderer.call(this)};c.jqplot.PyramidRenderer.prototype=new c.jqplot.LineRenderer();c.jqplot.PyramidRenderer.prototype.constructor=c.jqplot.PyramidRenderer;c.jqplot.PyramidRenderer.prototype.init=function(j,o){j=j||{};this._type="pyramid";this.barPadding=10;this.barWidth=null;this.fill=true;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.highlightThreshold=2;this.synchronizeHighlight=false;this.offsetBars=false;if(j.highlightMouseDown&&j.highlightMouseOver==null){j.highlightMouseOver=false}this.side="right";c.extend(true,this,j);if(this.side==="left"){this._highlightThreshold=[[-this.highlightThreshold,0],[-this.highlightThreshold,0],[0,0],[0,0]]}else{this._highlightThreshold=[[0,0],[0,0],[this.highlightThreshold,0],[this.highlightThreshold,0]]}this.renderer.options=j;this._highlightedPoint=null;this._dataColors=[];this._barPoints=[];this.fillAxis="y";this._primaryAxis="_yaxis";this._xnudge=0;var n={lineJoin:"miter",lineCap:"butt",fill:this.fill,fillRect:this.fill,isarc:false,strokeStyle:this.color,fillStyle:this.color,closePath:this.fill,lineWidth:this.lineWidth};this.renderer.shapeRenderer.init(n);var m=j.shadowOffset;if(m==null){if(this.lineWidth>2.5){m=1.25*(1+(Math.atan((this.lineWidth/2.5))/0.785398163-1)*0.6)}else{m=1.25*Math.atan((this.lineWidth/2.5))/0.785398163}}var h={lineJoin:"miter",lineCap:"butt",fill:this.fill,fillRect:this.fill,isarc:false,angle:this.shadowAngle,offset:m,alpha:this.shadowAlpha,depth:this.shadowDepth,closePath:this.fill,lineWidth:this.lineWidth};this.renderer.shadowRenderer.init(h);o.postDrawHooks.addOnce(f);o.eventListenerHooks.addOnce("jqplotMouseMove",e);if(this.side==="left"){for(var k=0,g=this.data.length;k<g;k++){this.data[k][1]=-Math.abs(this.data[k][1])}}};c.jqplot.PyramidRenderer.prototype.setGridData=function(p){var j=this._xaxis.series_u2p;var o=this._yaxis.series_u2p;var k=this._plotData;var n=this._prevPlotData;this.gridData=[];this._prevGridData=[];var g=k.length;var m=false;var h;for(h=0;h<g;h++){if(k[h][1]<0){this.side="left"}}if(this._yaxis.name==="yMidAxis"&&this.side==="right"){this._xnudge=this._xaxis.max/2000;m=true}for(h=0;h<g;h++){if(k[h][0]!=null&&k[h][1]!=null){this.gridData.push([j(k[h][1]),o(k[h][0])])}else{if(k[h][0]==null){this.gridData.push([j(k[h][1]),null])}else{if(k[h][1]==null){this.gridData.push(null,[o(k[h][0])])}}}if(k[h][1]===0&&m){this.gridData[h][0]=j(this._xnudge)}}};c.jqplot.PyramidRenderer.prototype.makeGridData=function(m,p){var k=this._xaxis.series_u2p;var o=this._yaxis.series_u2p;var j=[];var g=m.length;var n=false;var h;for(h=0;h<g;h++){if(m[h][1]<0){this.side="left"}}if(this._yaxis.name==="yMidAxis"&&this.side==="right"){this._xnudge=this._xaxis.max/2000;n=true}for(h=0;h<g;h++){if(m[h][0]!=null&&m[h][1]!=null){j.push([k(m[h][1]),o(m[h][0])])}else{if(m[h][0]==null){j.push([k(m[h][1]),null])}else{if(m[h][1]==null){j.push([null,o(m[h][0])])}}}if(m[h][1]===0&&n){j[h][0]=k(this._xnudge)}}return j};c.jqplot.PyramidRenderer.prototype.setBarWidth=function(){var k;var g=0;var h=0;var m=this[this._primaryAxis];var q,l,o;g=m.max-m.min;var n=m.numberTicks;var j=(n-1)/2;var p=(this.barPadding===0)?1:0;if(m.name=="xaxis"||m.name=="x2axis"){this.barWidth=(m._offsets.max-m._offsets.min)/g-this.barPadding+p}else{if(this.fill){this.barWidth=(m._offsets.min-m._offsets.max)/g-this.barPadding+p}else{this.barWidth=(m._offsets.min-m._offsets.max)/g}}};c.jqplot.PyramidRenderer.prototype.draw=function(B,I,k){var E;var u=c.extend({},k);var p=(u.shadow!=undefined)?u.shadow:this.shadow;var K=(u.showLine!=undefined)?u.showLine:this.showLine;var C=(u.fill!=undefined)?u.fill:this.fill;var t=this._xaxis.series_u2p;var G=this._yaxis.series_u2p;var z,x;this._dataColors=[];this._barPoints=[];if(this.renderer.options.barWidth==null){this.renderer.setBarWidth.call(this)}var D=[],s,F;if(K){var q=new c.jqplot.ColorGenerator(this.negativeSeriesColors);var v=new c.jqplot.ColorGenerator(this.seriesColors);var J=q.get(this.index);if(!this.useNegativeColors){J=u.fillStyle}var o=u.fillStyle;var n;var L=this._xaxis.series_u2p(this._xnudge);var j=this._yaxis.series_u2p(this._yaxis.min);var m=this._yaxis.series_u2p(this._yaxis.max);var H=this.barWidth;var y=H/2;var D=[];var r=this.offsetBars?y:0;for(var E=0,A=I.length;E<A;E++){if(this.data[E][0]==null){continue}n=I[E][1];if(this._plotData[E][1]<0){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){u.fillStyle=q.next()}else{u.fillStyle=v.next()}}}else{if(this.varyBarColor&&!this._stack){u.fillStyle=v.next()}else{u.fillStyle=o}}if(this.fill){if(this._plotData[E][1]>=0){s=I[E][0]-L;F=this.barWidth;D=[L,n-y-r,s,F]}else{s=L-I[E][0];F=this.barWidth;D=[I[E][0],n-y-r,s,F]}this._barPoints.push([[D[0],D[1]+F],[D[0],D[1]],[D[0]+s,D[1]],[D[0]+s,D[1]+F]]);if(p){this.renderer.shadowRenderer.draw(B,D)}var g=u.fillStyle||this.color;this._dataColors.push(g);this.renderer.shapeRenderer.draw(B,D,u)}else{if(E===0){D=[[L,j],[I[E][0],j],[I[E][0],I[E][1]-y-r]]}else{if(E<A-1){D=D.concat([[I[E-1][0],I[E-1][1]-y-r],[I[E][0],I[E][1]+y-r],[I[E][0],I[E][1]-y-r]])}else{D=D.concat([[I[E-1][0],I[E-1][1]-y-r],[I[E][0],I[E][1]+y-r],[I[E][0],m],[L,m]]);if(p){this.renderer.shadowRenderer.draw(B,D)}var g=u.fillStyle||this.color;this._dataColors.push(g);this.renderer.shapeRenderer.draw(B,D,u)}}}}}if(this.highlightColors.length==0){this.highlightColors=c.jqplot.computeHighlightColors(this._dataColors)}else{if(typeof(this.highlightColors)=="string"){this.highlightColors=[];for(var E=0;E<this._dataColors.length;E++){this.highlightColors.push(this.highlightColors)}}}};function b(l,k,h){h=h||{};h.axesDefaults=h.axesDefaults||{};h.grid=h.grid||{};h.legend=h.legend||{};h.seriesDefaults=h.seriesDefaults||{};var g=false;if(h.seriesDefaults.renderer===c.jqplot.PyramidRenderer){g=true}else{if(h.series){for(var j=0;j<h.series.length;j++){if(h.series[j].renderer===c.jqplot.PyramidRenderer){g=true}}}}if(g){h.axesDefaults.renderer=c.jqplot.PyramidAxisRenderer;h.grid.renderer=c.jqplot.PyramidGridRenderer;h.seriesDefaults.pointLabels={show:false}}}function f(){if(this.plugins.pyramidRenderer&&this.plugins.pyramidRenderer.highlightCanvas){this.plugins.pyramidRenderer.highlightCanvas.resetCanvas();this.plugins.pyramidRenderer.highlightCanvas=null}this.plugins.pyramidRenderer={highlightedSeriesIndex:null};this.plugins.pyramidRenderer.highlightCanvas=new c.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.pyramidRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-pyramidRenderer-highlight-canvas",this._plotDimensions,this));this.plugins.pyramidRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(g){d(g.data.plot)})}function a(m,l,j,i){var h=m.series[l];var g=m.plugins.pyramidRenderer.highlightCanvas;g._ctx.clearRect(0,0,g._ctx.canvas.width,g._ctx.canvas.height);h._highlightedPoint=j;m.plugins.pyramidRenderer.highlightedSeriesIndex=l;var k={fillStyle:h.highlightColors[j],fillRect:false};h.renderer.shapeRenderer.draw(g._ctx,i,k);if(h.synchronizeHighlight!==false&&m.series.length>=h.synchronizeHighlight&&h.synchronizeHighlight!==l){h=m.series[h.synchronizeHighlight];k={fillStyle:h.highlightColors[j],fillRect:false};h.renderer.shapeRenderer.draw(g._ctx,h._barPoints[j],k)}g=null}function d(j){var g=j.plugins.pyramidRenderer.highlightCanvas;g._ctx.clearRect(0,0,g._ctx.canvas.width,g._ctx.canvas.height);for(var h=0;h<j.series.length;h++){j.series[h]._highlightedPoint=null}j.plugins.pyramidRenderer.highlightedSeriesIndex=null;j.target.trigger("jqplotDataUnhighlight");g=null}function e(k,j,n,m,l){if(m){var i=[m.seriesIndex,m.pointIndex,m.data];var h=jQuery.Event("jqplotDataMouseOver");h.pageX=k.pageX;h.pageY=k.pageY;l.target.trigger(h,i);if(l.series[i[0]].highlightMouseOver&&!(i[0]==l.plugins.pyramidRenderer.highlightedSeriesIndex&&i[1]==l.series[i[0]]._highlightedPoint)){var g=jQuery.Event("jqplotDataHighlight");g.which=k.which;g.pageX=k.pageX;g.pageY=k.pageY;l.target.trigger(g,i);a(l,m.seriesIndex,m.pointIndex,m.points)}}else{if(m==null){d(l)}}}c.jqplot.preInitHooks.push(b)})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    
    /**
     * Class: $.jqplot.Trendline
     * Plugin which will automatically compute and draw trendlines for plotted data.
     */
    $.jqplot.Trendline = function() {
        // Group: Properties
        
        // prop: show
        // Wether or not to show the trend line.
        this.show = $.jqplot.config.enablePlugins;
        // prop: color
        // CSS color spec for the trend line.
        // By default this wil be the same color as the primary line.
        this.color = '#666666';
        // prop: renderer
        // Renderer to use to draw the trend line.
        // The data series that is plotted may not be rendered as a line.
        // Therefore, we use our own line renderer here to draw a trend line.
        this.renderer = new $.jqplot.LineRenderer();
        // prop: rendererOptions
        // Options to pass to the line renderer.
        // By default, markers are not shown on trend lines.
        this.rendererOptions = {marker:{show:false}};
        // prop: label
        // Label for the trend line to use in the legend.
        this.label = '';
        // prop: type
        // Either 'exponential', 'exp', or 'linear'.
        this.type = 'linear';
        // prop: shadow
        // true or false, whether or not to show the shadow.
        this.shadow = true;
        // prop: markerRenderer
        // Renderer to use to draw markers on the line.
        // I think this is wrong.
        this.markerRenderer = {show:false};
        // prop: lineWidth
        // Width of the trend line.
        this.lineWidth = 1.5;
        // prop: shadowAngle
        // Angle of the shadow on the trend line.
        this.shadowAngle = 45;
        // prop: shadowOffset
        // pixel offset for each stroke of the shadow.
        this.shadowOffset = 1.0;
        // prop: shadowAlpha
        // Alpha transparency of the shadow.
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to make of the shadow.
        this.shadowDepth = 3;
        this.isTrendline = true;
        
    };
    
    $.jqplot.postSeriesInitHooks.push(parseTrendLineOptions);
    $.jqplot.postDrawSeriesHooks.push(drawTrendline);
    $.jqplot.addLegendRowHooks.push(addTrendlineLegend);
    
    // called witin scope of the legend object
    // current series passed in
    // must return null or an object {label:label, color:color}
    function addTrendlineLegend(series) {
        var ret = null;
        if (series.trendline && series.trendline.show) {
            var lt = series.trendline.label.toString();
            if (lt) {
                ret = {label:lt, color:series.trendline.color};
            }
        }
        return ret;
    }

    // called within scope of a series
    function parseTrendLineOptions (target, data, seriesDefaults, options, plot) {
        if (this._type && (this._type === 'line' || this._type == 'bar')) {
            this.trendline = new $.jqplot.Trendline();
            options = options || {};
            $.extend(true, this.trendline, {color:this.color}, seriesDefaults.trendline, options.trendline);
            this.trendline.renderer.init.call(this.trendline, null);
        }
    }
    
    // called within scope of series object
    function drawTrendline(sctx, options) {
        // if we have options, merge trendline options in with precedence
        options = $.extend(true, {}, this.trendline, options);

        if (this.trendline && options.show) {
            var fit;
            // this.renderer.setGridData.call(this);
            var data = options.data || this.data;
            fit = fitData(data, this.trendline.type);
            var gridData = options.gridData || this.renderer.makeGridData.call(this, fit.data);
            this.trendline.renderer.draw.call(this.trendline, sctx, gridData, {showLine:true, shadow:this.trendline.shadow});
        }
    }
    
    function regression(x, y, typ)  {
        var type = (typ == null) ? 'linear' : typ;
        var N = x.length;
        var slope;
        var intercept;  
        var SX = 0;
        var SY = 0;
        var SXX = 0;
        var SXY = 0;
        var SYY = 0;
        var Y = [];
        var X = [];
    
        if (type == 'linear') {
            X = x;
            Y = y;
        }
        else if (type == 'exp' || type == 'exponential') {
            for ( var i=0; i<y.length; i++) {
                // ignore points <= 0, log undefined.
                if (y[i] <= 0) {
                    N--;
                }
                else {
                    X.push(x[i]);
                    Y.push(Math.log(y[i]));
                }
            }
        }

        for ( var i = 0; i < N; i++) {
            SX = SX + X[i];
            SY = SY + Y[i];
            SXY = SXY + X[i]* Y[i];
            SXX = SXX + X[i]* X[i];
            SYY = SYY + Y[i]* Y[i];
        }

        slope = (N*SXY - SX*SY)/(N*SXX - SX*SX);
        intercept = (SY - slope*SX)/N;

        return [slope, intercept];
    }

    function linearRegression(X,Y) {
        var ret;
        ret = regression(X,Y,'linear');
        return [ret[0],ret[1]];
    }

    function expRegression(X,Y) {
        var ret;
        var x = X;
        var y = Y;
        ret = regression(x, y,'exp');
        var base = Math.exp(ret[0]);
        var coeff = Math.exp(ret[1]);
        return [base, coeff];
    }

    function fitData(data, typ) {
        var type = (typ == null) ?  'linear' : typ;
        var ret;
        var res;
        var x = [];
        var y = [];
        var ypred = [];
        
        for (i=0; i<data.length; i++){
            if (data[i] != null && data[i][0] != null && data[i][1] != null) {
                x.push(data[i][0]);
                y.push(data[i][1]);
            }
        }
        
        if (type == 'linear') {
            ret = linearRegression(x,y);
            for ( var i=0; i<x.length; i++){
                res = ret[0]*x[i] + ret[1];
                ypred.push([x[i], res]);
            }
        }
        else if (type == 'exp' || type == 'exponential') {
            ret = expRegression(x,y);
            for ( var i=0; i<x.length; i++){
                res = ret[1]*Math.pow(ret[0],x[i]);
                ypred.push([x[i], res]);
            }
        }
        return {data: ypred, slope: ret[0], intercept: ret[1]};
    } 

})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */(function(f){f.jqplot.Trendline=function(){this.show=f.jqplot.config.enablePlugins;this.color="#666666";this.renderer=new f.jqplot.LineRenderer();this.rendererOptions={marker:{show:false}};this.label="";this.type="linear";this.shadow=true;this.markerRenderer={show:false};this.lineWidth=1.5;this.shadowAngle=45;this.shadowOffset=1;this.shadowAlpha=0.07;this.shadowDepth=3;this.isTrendline=true};f.jqplot.postSeriesInitHooks.push(e);f.jqplot.postDrawSeriesHooks.push(g);f.jqplot.addLegendRowHooks.push(a);function a(k){var j=null;if(k.trendline&&k.trendline.show){var i=k.trendline.label.toString();if(i){j={label:i,color:k.trendline.color}}}return j}function e(m,k,j,i,l){if(this._type&&(this._type==="line"||this._type=="bar")){this.trendline=new f.jqplot.Trendline();i=i||{};f.extend(true,this.trendline,{color:this.color},j.trendline,i.trendline);this.trendline.renderer.init.call(this.trendline,null)}}function g(m,i){i=f.extend(true,{},this.trendline,i);if(this.trendline&&i.show){var k;var l=i.data||this.data;k=c(l,this.trendline.type);var j=i.gridData||this.renderer.makeGridData.call(this,k.data);this.trendline.renderer.draw.call(this.trendline,m,j,{showLine:true,shadow:this.trendline.shadow})}}function b(w,v,n){var u=(n==null)?"linear":n;var s=w.length;var t;var z;var o=0;var m=0;var r=0;var q=0;var l=0;var j=[];var k=[];if(u=="linear"){k=w;j=v}else{if(u=="exp"||u=="exponential"){for(var p=0;p<v.length;p++){if(v[p]<=0){s--}else{k.push(w[p]);j.push(Math.log(v[p]))}}}}for(var p=0;p<s;p++){o=o+k[p];m=m+j[p];q=q+k[p]*j[p];r=r+k[p]*k[p];l=l+j[p]*j[p]}t=(s*q-o*m)/(s*r-o*o);z=(m-t*o)/s;return[t,z]}function h(k,j){var i;i=b(k,j,"linear");return[i[0],i[1]]}function d(o,m){var k;var i=o;var n=m;k=b(i,n,"exp");var l=Math.exp(k[0]);var j=Math.exp(k[1]);return[l,j]}function c(l,j){var p=(j==null)?"linear":j;var n;var o;var r=[];var q=[];var m=[];for(k=0;k<l.length;k++){if(l[k]!=null&&l[k][0]!=null&&l[k][1]!=null){r.push(l[k][0]);q.push(l[k][1])}}if(p=="linear"){n=h(r,q);for(var k=0;k<r.length;k++){o=n[0]*r[k]+n[1];m.push([r[k],o])}}else{if(p=="exp"||p=="exponential"){n=d(r,q);for(var k=0;k<r.length;k++){o=n[1]*Math.pow(n[0],r[k]);m.push([r[k],o])}}}return{data:m,slope:n[0],intercept:n[1]}}})(jQuery);