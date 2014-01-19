SELECT i.nombreIngrediente
FROM IngredientesMenus as im
INNER JOIN Menus as m
ON im.Menus_idMenu = m.idMenu 
AND m.idMenu = 1
INNER JOIN Ingredientes as i
ON im.Ingredientes_idIngrediente = i.idIngrediente