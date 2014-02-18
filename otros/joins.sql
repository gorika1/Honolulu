SELECT i.nombreIngrediente
FROM IngredientesMenus as im
INNER JOIN Menus as m
ON im.Menus_idMenu = m.idMenu 
AND m.idMenu = 1
INNER JOIN Ingredientes as i
ON im.Ingredientes_idIngrediente = i.idIngrediente;

SELECT m.nombreMenu, m.precio, m.idMenu
FROM Menus as m
INNER JOIN PedidosMenus as pm
ON m.idMenu = pm.Menus_idMenu
AND pm.Pedidos_nroMesa = 1;