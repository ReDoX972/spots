# INPUT spots :
#   list of spots with inner data (spot_id, spot_duration, spot_value)
# INPUT slot_duration :
#   the duration of the slot
# OUTPUT sub_spots :
#   the selected plots in order to have the maximum benefit
# OUTPUT max_benef :
#   the value of the maximum benefit
#
# Computes the maximum profit from the spots set
def compute_max_benef(spots, slot_duration):
    N = len(spots)
    M = computeM(spots, slot_duration)

    sub_spots = getBestSet(N, slot_duration, M, spots)
    max_benef = M[N][slot_duration];

    return max_benef, sub_spots

def getBestSet(k, t, M, spots):
    if k==0: 
        return []
    elif M[k][t] ==  M[k-1][t] :
        return getBestSet(k-1,t,M,spots) 
    else :
        id, d, v = spots[k-1]
        return getBestSet(k-1,t-d,M,spots) + [(id,d,v)]

def computeM(spots, T):
    N = len(spots)
    M = [[0 for t in range(T+1)] for k in range(N+1)]

    # BASE
    for t in range(T+1): M[0][t] = 0
    
    for k in range(1, N+1):
        for t in range(T+1):
            M[k][t] = M[k - 1][t]
            if t - spots[k-1][1] >= 0:
                if M[k - 1][t - spots[k-1][1]] + spots[k-1][2] > M[k][t]:
                    M[k][t] = M[k - 1][t - spots[k-1][1]] + spots[k-1][2]

    return M