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
			$("#treemap_container").addClass("chart");

			var line_chart = this.generate_line_result(
				ret.max_benef, 
				ret.sub_spots, 
				$("#linechart_container"));

			var levelbox_chart = this.generate_levelbox_result(
				ret.max_benef, 
				ret.sub_spots, 
				$("#levelbox_container"));

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
		generate_line_result : function(max_benef, sub_spots, $div_elt){
			var values_array = [];
			var max_benef_cumulated_value = 0;
			var j = 1;

			var sub_spots = sub_spots.slice(0).sort(function(a, b) {
			   return a.value - b.value;
			});

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
				height: 500,
			};

			var chart = new google.charts.Line($div_elt[0]);
			chart.draw(data, options);

			return $div_elt[0];
		},
		generate_treemap_result : function(max_benef, sub_spots, $div_elt){
			var values_array = [
				['Spot', 'Parent', 'Duration (size)', 'Value (color)'],
				['Répartition des valeurs', null, 0, 0],
			];
			$.each(sub_spots, function(key, spot) {
				values_array.push(['spot ' + spot.id, 'Répartition des valeurs', spot.duration, spot.value]);
			}); 

			var data = new  google.visualization.arrayToDataTable(values_array);
			var tree = new google.visualization.TreeMap($div_elt[0]);
			tree.draw(data, {
				minColor: '#a2e3ff',
				midColor: '#55ccff',
				maxColor: '#08b5ff',
				headerHeight: 0,
				fontColor: '#112833',
				showScale: true
			});

			return $div_elt[0];
		},
		generate_levelbox_result : function(max_benef, sub_spots, $div_elt){
			var total_spots_duration = 0;
			var spot_max_value = 0;
			var max_spot_px_height_representation = 50.0;

			var sub_spots = sub_spots.slice(0).sort(function(a, b) {
			   return b.value - a.value;
			});

			$.each(sub_spots, function(key, spot) {
				total_spots_duration += spot.duration;
				if(spot.value > spot_max_value)
					spot_max_value = spot.value;
			});

			var $title = $("<h4>Répartition durée/valeur</h4>")
			$div_elt.append($title);

			$.each(sub_spots, function(key, spot) {
				var spot_duration_percent = 100.0 * spot.duration / total_spots_duration;
				var spot_relative_max_val_ratio = spot.value / spot_max_value;
				var spot_color_hexa = tinycolor("hsv 210 "+ spot_relative_max_val_ratio + " 1").toHex();

				

				var $wrapper = $("<div></div>")
					.addClass("pull-left text-center")
					.css("width", spot_duration_percent + "%")
					.css("margin-left", "-1px");

				var $label = $("<p></p>")
					.html(spot.id);

				var $tmpspot = $("<div></div>")
					.addClass("levelbox_spot")
					.css("width", "100%")
					.css("height", (spot_relative_max_val_ratio * max_spot_px_height_representation) + "px")
					.css("background", "#" + spot_color_hexa);

				$wrapper.append($label).append($tmpspot);
						
				$div_elt.append($wrapper);
			}); 
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