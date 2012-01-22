class MapAreaSizeStruct
  constructor : >
	  @width = 32
	  @height = 32

class Map
  constructor : ->
	  @map_data = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
	  @area_size = new MapAreaSizeStruct()

class MapObject
  constructor : ->
	@setImage "bullet1.png"
	@size = new MapAreaSizeStruct()

