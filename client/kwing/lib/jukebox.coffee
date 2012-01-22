class Jukebox
  @_sounds : []
  @root : ''
  @load : () ->
    sounds = Array::slice.call(arguments)
    for sound in sounds
      Jukebox._loadSound sound
  @play : (sound) ->
    if not Jukebox._sounds[sound]?
      Jukebox._loadSound sound
    Jukebox.stop sound
    Jukebox._sounds[sound].play()
  @pause : (sound) ->
    if sound?
      Jukebox._sounds[sound].pause()
  @stop : (sound) ->
    if sound?
      Jukebox._sounds[sound].stop()
  @_loadSound : (sound, mimetype) ->
    if not Jukebox._sounds[sound]?
      if mimetype?
        Jukebox._sounds[sound] = Sound.load "#{Jukebox.root}#{sound}", mimetype
      else
        Jukebox._sounds[sound] = Sound.load "#{Jukebox.root}#{sound}"
