$(document).ready(function(){
	
  $("#execute_simulation_button").click(function(){
		var char_div_elt = $("#chart_div");

		var sub_spots =  [
			[9,40,45],
			[6,10,15],
			[3,10,15],
			[1,20,25],
			[0,20,25]
		]

		var values_array = [
			['Director (Year)',  'Spot']
		]

		max_benef_cumulated_value = 0;
		$.each(sub_spots, function(key, spot) {
			spot_id = spot[0]
			spot_duration = spot[1]
			spot_value = spot[2]
			
			max_benef_cumulated_value += spot_value

			for (i = 0; i < spot_duration; i++) { 
				spot_label = ''
				if(spot_duration/2 == i+1)
					spot_label += spot_id
			    values_array.push([spot_label,max_benef_cumulated_value])
			}
		}); 

        var data = google.visualization.arrayToDataTable(values_array);

        var options = {
			title: 'Bénéfices maximums',
			vAxis: {title: 'Accumulation des bénéfices'},
			isStacked: true
        };

        var chart = new google.visualization.SteppedAreaChart(char_div_elt[0]);

        chart.draw(data, options);
      
  });
});