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

		// ******* HTML ********
		add_spot_row : function(spot_id, spot_duration, spot_value){
			var $spot_row_id = $("<th></th>").html(spot_id)
					.addClass( "hidden-xs" )
				.attr("scope", "row");

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
		load_treemap_result : function(){

		}
	};

	Simulator.data_manager = new Simulator.DataManager();

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

}(window.jQuery, window.Simulator = window.Simulator || {}));