$(document).ready(function(){
	$("#execute_simulation_button").click(function(){
		var char_div_elt = $("#chart_div");
		var res_div_elt = $("#result_div");

		var sub_spots =  [
			[9,40,45],
			[6,10,15],
			[3,10,15],
			[1,20,25],
			[0,20,25]
		]

		var values_array = []
		max_benef_cumulated_value = 0;
		j = 1
		$.each(sub_spots, function(key, spot) {
			spot_id = spot[0]
			spot_duration = spot[1]
			spot_value = spot[2]
			
			max_benef_cumulated_value += spot_value
			for (i = 0; i < spot_duration; i++) { 
			    values_array.push([j, max_benef_cumulated_value])
			    j++
			}
		}); 

		var data = new  google.visualization.DataTable();
			data.addColumn('number', 'Secondes');
			data.addColumn('number', 'Bénéfice');
	    data.addRows(values_array)

	    var options = {
	    	chart:{
	    		title: 'Accumulation des bénéfices'
	    	},
	    	height: 500
	    };

	    var chart = new google.charts.Line(char_div_elt[0]);

	    chart.draw(data, options);
	    res_div_elt.show()
	  
	});
});