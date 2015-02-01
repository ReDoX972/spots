(function(TwitViz, $, d3) {
    "use strict";

    TwitViz.StackAreaView = function(container, type) {
/*        if (TwitViz.StackAreaView[type]) {
            $.extend(TwitViz.StackAreaView.prototype, TwitViz.StackAreaView[type]);
        }
        this.init(container.id, $(container).data());*/

        this.init(container, {});
    };

    TwitViz.StackAreaView.prototype = {
        svg: null,
        svgGroup: null,
        settings: {
            widthAuto: true,
            width: 640,
            height: 200,

            margin: {
                top: 5,
                right: 50,
                bottom: 20,
                left: 50
            },

            numberTicksX: 8,
            numberTicksY: 6,
            languagesToShow: 3,
            othersLanguagesName: "others"
        },
        numberOfTimestamps: 0,
        yValuesFormat: d3.format(".0%"),
        focusValuesFormat: d3.format(",.2%"),
        topLanguages: null, //["en", "fr", ...]

        init: function(containerId, options) {
            $.extend(this.settings, options);
           
            if (this.settings.widthAuto) {
                this.settings.width = $('#' + containerId).width();
            }

            this.innerWidth = this.settings.width - this.settings.margin.left - this.settings.margin.right;
            this.innerHeight = this.settings.height - this.settings.margin.top - this.settings.margin.bottom;

            this.containerId = containerId;
        }
    };

}(window.TwitViz = window.TwitViz || {}, window.jQuery, window.d3));