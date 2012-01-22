class Timer
  constructor : (max, repeat=false, time=0, active=false, complete=undefined) ->
    @set(max)
    @_time = time
    @_active = active
    @_complete = complete
    @_repeat = repeat
  set : (max=0) ->
    @_max = max
    @
  play : ->
    @_active = true
    @
  stop : ->
    @_active = false
    @_time = 0
    @
  pause : ->
    @_active = false
    @
  reset : ->
    @_time = 0
    @
  tick : ->
    if @_time < @_max and @_active
      ++@_time
      if @_time is @_max
        if @_complete?
          @_complete()
        if @_repeat
          @_time = 0
    @
  now : ->
    @_time
  max : ->
    @_max
  setNow : (@_time) ->
    @
  setComplete : (func) ->
    @_complete = func
    @
  setRepeat : (repeat) ->
    @_repeat = repeat
    @
  isActive : ->
    @_active
  isOver : ->
    @_time >= @_max
