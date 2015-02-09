(function($, Simulator){
	"use strict";

	Simulator.StocksDataManager = function() {
	    this.init();
	};

	Simulator.StocksDataManager.prototype = {
		
		// ******* CONSTRUCTOR ********
		init : function(){
		}

	};

	Simulator.stocks_data_manager = new Simulator.StocksDataManager();

	$("#stocks_form").submit(function(event){
		event.preventDefault();
		
		var data = google.visualization.arrayToDataTable([
          ['Stock', 'k0', 'k1', 'k2', 'k3'],
          ['0',  0, 0,	0, 0],
          ['1',  0, 20,	0, 0],
          ['2',  0, 20,	15, 0],
          ['3',  0, 20,	15, 15],
          ['4',  0, 20,	15, 20],
          ['5',  0, 20,	15, 30],
          ['6',  0, 20,	40, 15],
          ['7',  0, 20,	50, 15],
        ]);

        var options = {
          hAxis: {title: 'Stock',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          isStacked : true
        };

        var chart = new google.visualization.AreaChart(document.getElementById('areachart_container'));
        chart.draw(data, options);

		$("#result_div").show();
	});

}(window.jQuery, window.Simulator = window.Simulator || {}));