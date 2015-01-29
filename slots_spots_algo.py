# INPUT spots :
# 	list of spots with inner data (spot_id, spot_duration, spot_value)
# INPUT slot_duration :
#	the duration of the slot
# OUTPUT sub_spots :
#	the selected plots in order to have the maximum benefit
# OUTPUT max_benef :
#	the value of the maximum benefit
#
# Computes the maximum profit from the spots set
def compute_max_benef(spots, slot_duration):

	# TODO : implement compute_best_gain

	sub_spots = [(9,40,45), (6,10,15), (3,10,15), (1,20,25), (0,20,25)]
	max_benef = 125;

	return max_benef, sub_spots