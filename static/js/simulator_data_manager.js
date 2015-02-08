(function($, Simulator){
	"use strict";

	Simulator.DataManager = function() {
	    this.init();
	};
	Simulator.DataManager.prototype = {
		next_id : 0,
		default_slot_duration : 100,
		current_data : [],
		default_data : [
			{
				id : 0,
				duration : 20,
				value : 25
			},
			{
				id : 1,
				duration : 20,
				value : 25
			},
			{
				id : 2,
				duration : 70,
				value : 65
			},
			{
				id : 3,
				duration : 10,
				value : 15
			},
			{
				id : 4,
				duration : 10,
				value : 5
			},
			{
				id : 5,
				duration : 40,
				value : 35
			},
			{
				id : 6,
				duration : 10,
				value : 15
			},
			{
				id : 7,
				duration : 80,
				value : 75
			},
			{
				id : 8,
				duration : 10,
				value : 15
			},
			{
				id : 9,
				duration : 40,
				value : 45
			}
		],

		// ******* CONSTRUCTOR ********
		init : function(){
			this.load_default();
		},

		// ******* DATASETS ********
		add_spot : function(spot_duration, spot_value){
			var new_spot = {
				id : this.next_id, 
				duration : spot_duration, 
				value : spot_value
			};
			this.current_data.push(new_spot) ;
			this.add_spot_row(this.next_id, spot_duration, spot_value);
			this.next_id++;
		},
		delete_spot : function(spot_id){
			this.current_data = $.grep( this.current_data, function( spot, i ) {
			  return spot.id != spot_id;
			});
		},
		empty_table : function(){
			this.current_data = [];
			this.next_id = 0;
			$(".spot_row").remove();
		},
		load_default : function(){
			this.empty_table();

			this.current_data = this.default_data.slice();
			this.current_slot_duration = this.default_slot_duration;
			this.next_id = this.default_data.length;
			$("input[name='slot_duration_input']").val(this.current_slot_duration);

			for(var i=0; i < this.current_data.length; i++)
			{
				this.add_spot_row(i, this.current_data[i].duration, this.current_data[i].value)
			}
		},

		// ******* AJAX ********
		submit_data : function(action_url, slot_duration, spots){
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					slot_duration: slot_duration,
					data_spots : spots
				}),
				dataType: 'json',
				url: action_url,
				success: function (ret) { Simulator.data_manager.receive_result(ret) }
			});
		},
		receive_result : function(ret){
			var B = ret.max_benef;
			var P = ret.sub_spots;
			
            $("#max_benef_container").empty();
            $("#subplots_container").empty();
            $("#scatterchart_container").empty();

            this.generate_benef_text(B, P, $("#max_benef_container"));
			this.generate_subplots_result(B, P, $("#subplots_container"));
			this.generate_scatterchart(B, P, $("#scatterchart_container"));

			$("#result_div").show();
		},

		// ******* HTML ********
		add_spot_row : function(spot_id, spot_duration, spot_value){
			var $spot_row_id = $("<th></th>").html(spot_id)
					.addClass( "hidden-xs" )
				.attr("scope", "row");8

			var $spot_row_duration = $("<td></td>").html(spot_duration)
			.addClass( "text-right" );

			var $spot_row_value = $("<td></td>").html(spot_value)
			.addClass( "text-right" );

			var $spot_row_del_button = $("<button></button>")
				.addClass("btn glyphicon glyphicon-minus btn-xs")
				.attr("type", "button")
				.attr("spot_id", spot_id)
				.click(function() {
					var spot_id_to_del = $(this).attr("spot_id");
					Simulator.data_manager.delete_spot(spot_id_to_del);
					$(this).parent().parent().hide().remove();
				});
				

			var $spot_row_del_cell = $("<td></td>")
				.addClass(" text-center")
				.append($spot_row_del_button);

			var $spot_row = $("<tr></tr>")
				.addClass( "spot_row" )
				.append($spot_row_id)
				.append($spot_row_duration)
				.append($spot_row_value)
				.append($spot_row_del_cell);

			$("#new_spot_row").before($spot_row);
		},

		// ******* CHARTS ********
		generate_benef_text : function(max_benef, sub_spots, $div_elt){
			var total_duration = 0;

			$.each(sub_spots, function(key, spot) {
				total_duration += spot.duration;
			}); 

			var $text_p = $('<p></p>');
			$text_p.html('<p>Le gain maximal du sous ensemble est de '+ max_benef +' pour une durée totale de ' + total_duration + '</p>');

			return $div_elt.append($text_p);
		},
		generate_subplots_result : function(max_benef, sub_spots, $div_elt){
			var values_array = [];
			var max_benef_cumulated_value = 0;
			var j = 1;

			var sub_spots = sub_spots.slice(0).sort(function(a, b) {
			   return a.id - b.id;
			});

			$.each(sub_spots, function(key, spot) {
				var $spot_div = $('<div class="panel panel-default spot pull-left"></div>');
				$spot_div.html('<div class="panel-heading"><h3 class="panel-title">' + spot.id + '</h3></div><div class="panel-body"><p>durée ' + spot.duration + '<p><p>valeur ' + spot.value + '<p></div>');

				$div_elt.append($spot_div);
			}); 

			return $div_elt;
		},
		generate_scatterchart : function(max_benef, sub_spots, $div_elt){
			var values_array = [['Duration', 'Value']];
			var max_value = 0;

			$.each(sub_spots, function(key, spot) {
				values_array.push([spot.duration, spot.value]);
				if(spot.value > max_value)
				max_value = spot.value;
			});

			var data = google.visualization.arrayToDataTable(values_array);

	        var options = {
	          hAxis: {title: 'Durée', minValue: 0, maxValue: 100},
	          vAxis: {title: 'Valeur', minValue: 0, maxValue: max_value},
	          legend: 'none'
	        };

	        var chart = new google.visualization.ScatterChart($div_elt[0]);

	        chart.draw(data, options);
		}
	};

	Simulator.data_manager = new Simulator.DataManager();

	// ******* FORM BUTTONS ********
	$("#empty_button").click(function(){
		Simulator.data_manager.empty_table();
	});

	$("#add_spot_button").click(function(){
		var spot_duration = parseInt($("input[name='new_spot_duration']").val());
		var spot_value = parseInt($("input[name='new_spot_value']").val());
		
		if(!isNaN(spot_duration) && !isNaN(spot_value) && spot_duration > 0 && spot_value >0){
			Simulator.data_manager.add_spot(spot_duration, spot_value);
			$("input[name='new_spot_duration']").focus(); 
		}

		$("input[name='new_spot_duration']").val("");
		$("input[name='new_spot_value']").val("");
	});

	$("#load_default_button").click(function(){
		Simulator.data_manager.load_default();
	});

	$("#slot_form").submit(function(event){
		event.preventDefault();
		Simulator.data_manager.submit_data(
			$(this).attr('action'), 
			$(this).find("input[name='slot_duration_input']").val(),
			Simulator.data_manager.current_data
		);
	});
}(window.jQuery, window.Simulator = window.Simulator || {}));