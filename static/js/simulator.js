(function($, Simulator){
	$("#slot_form").submit(function(event){

		event.preventDefault();

		// get some values from elements on the page: 
        var $form = $(this),
            term = $form.find("input[name='slot_duration_input']").val(),
            spots = Simulator.data_manager.current_data
            sim_url = $form.attr('action');

        $.ajax({
            type: 'POST',
            // Provide correct Content-Type, so that Flask will know how to process it.
            contentType: 'application/json',
            // Encode data as JSON.
            data: JSON.stringify({
            	slot_duration: term,
				data_spots : spots
            }),
            // This is the type of data expected back from the server.
            dataType: 'json',
            url: sim_url,
            success: function (ret) {
              console.log(ret.sub_spots);

				var char_div_elt = $("#chart_div");
				var res_div_elt = $("#result_div");

				var sub_spots = ret.sub_spots;

				var values_array = [];
				var max_benef_cumulated_value = 0;
				var j = 1;
				$.each(sub_spots, function(key, spot) {
					max_benef_cumulated_value += spot.value;
					for (var i = 0; i < spot.duration; i++) { 
					    values_array.push([j, max_benef_cumulated_value]);
					    j++;
					}
				}); 

				var data = new  google.visualization.DataTable();
				data.addColumn('number', 'Secondes');
				data.addColumn('number', 'Bénéfice');
				data.addRows(values_array);

				var options = {
					chart:{
						title: 'Accumulation des bénéfices'
					},
					height: 500,
				};

				var chart = new google.charts.Line(char_div_elt[0]);

				chart.draw(data, options);
				res_div_elt.show();
            }
          });
        
	});
}(window.jQuery, window.Simulator = window.Simulator || {}));