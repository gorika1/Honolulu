-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 27-01-2014 a las 21:06:34
-- Versión del servidor: 5.6.12
-- Versión de PHP: 5.5.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `honolulu-db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Bebidas`
--

CREATE TABLE IF NOT EXISTS `Bebidas` (
  `idBebida` int(11) NOT NULL AUTO_INCREMENT,
  `nombreBebida` varchar(45) NOT NULL,
  PRIMARY KEY (`idBebida`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Ingredientes`
--

CREATE TABLE IF NOT EXISTS `Ingredientes` (
  `idIngrediente` int(11) NOT NULL AUTO_INCREMENT,
  `nombreIngrediente` varchar(45) NOT NULL,
  PRIMARY KEY (`idIngrediente`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Volcado de datos para la tabla `Ingredientes`
--

INSERT INTO `Ingredientes` (`idIngrediente`, `nombreIngrediente`) VALUES
(1, 'Ingrediente 1'),
(2, 'Ingrediente 2'),
(3, 'Ingrediente 3'),
(4, 'Ingrediente 4'),
(5, 'Ingrediente 5'),
(6, 'Ingrediente 6'),
(7, 'Ingrediente 7');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `IngredientesExcluidos`
--

CREATE TABLE IF NOT EXISTS `IngredientesExcluidos` (
  `PedidosMenus_Pedidos_nroMesa` int(11) NOT NULL,
  `PedidosMenus_Menus_idMenu` int(11) NOT NULL,
  `Ingredientes_idIngrediente` int(11) NOT NULL,
  PRIMARY KEY (`PedidosMenus_Pedidos_nroMesa`,`PedidosMenus_Menus_idMenu`,`Ingredientes_idIngrediente`),
  KEY `fk_PedidosMenus_has_Ingredientes_Ingredientes1_idx` (`Ingredientes_idIngrediente`),
  KEY `fk_PedidosMenus_has_Ingredientes_PedidosMenus1_idx` (`PedidosMenus_Pedidos_nroMesa`,`PedidosMenus_Menus_idMenu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `IngredientesExcluidosPizzas`
--

CREATE TABLE IF NOT EXISTS `IngredientesExcluidosPizzas` (
  `Pedidos_has_Pizzas_Pedidos_nroMesa` int(11) NOT NULL,
  `Pedidos_has_Pizzas_Pizzas_idPizza` int(11) NOT NULL,
  `Ingredientes_idIngrediente` int(11) NOT NULL,
  PRIMARY KEY (`Pedidos_has_Pizzas_Pedidos_nroMesa`,`Pedidos_has_Pizzas_Pizzas_idPizza`,`Ingredientes_idIngrediente`),
  KEY `fk_Pedidos_has_Pizzas_has_Ingredientes_Ingredientes1_idx` (`Ingredientes_idIngrediente`),
  KEY `fk_Pedidos_has_Pizzas_has_Ingredientes_Pedidos_has_Pizzas1_idx` (`Pedidos_has_Pizzas_Pedidos_nroMesa`,`Pedidos_has_Pizzas_Pizzas_idPizza`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `IngredientesMenus`
--

CREATE TABLE IF NOT EXISTS `IngredientesMenus` (
  `Menus_idMenu` int(11) NOT NULL,
  `Ingredientes_idIngrediente` int(11) NOT NULL,
  PRIMARY KEY (`Menus_idMenu`,`Ingredientes_idIngrediente`),
  KEY `fk_Menus_has_Ingredientes_Ingredientes1_idx` (`Ingredientes_idIngrediente`),
  KEY `fk_Menus_has_Ingredientes_Menus1_idx` (`Menus_idMenu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `IngredientesMenus`
--

INSERT INTO `IngredientesMenus` (`Menus_idMenu`, `Ingredientes_idIngrediente`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 1),
(3, 2),
(3, 7),
(4, 3),
(4, 4),
(4, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `IngredientesPizzas`
--

CREATE TABLE IF NOT EXISTS `IngredientesPizzas` (
  `Pizzas_idPizza` int(11) NOT NULL,
  `Ingredientes_idIngrediente` int(11) NOT NULL,
  PRIMARY KEY (`Pizzas_idPizza`,`Ingredientes_idIngrediente`),
  KEY `fk_Pizzas_has_Ingredientes_Ingredientes1_idx` (`Ingredientes_idIngrediente`),
  KEY `fk_Pizzas_has_Ingredientes_Pizzas1_idx` (`Pizzas_idPizza`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `IngredientesPizzas`
--

INSERT INTO `IngredientesPizzas` (`Pizzas_idPizza`, `Ingredientes_idIngrediente`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Menus`
--

CREATE TABLE IF NOT EXISTS `Menus` (
  `idMenu` int(11) NOT NULL AUTO_INCREMENT,
  `nombreMenu` varchar(70) NOT NULL,
  `precio` float NOT NULL,
  `TiposMenus_idTipoMenu` int(11) NOT NULL,
  PRIMARY KEY (`idMenu`),
  KEY `fk_Menus_TiposMenus1_idx` (`TiposMenus_idTipoMenu`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `Menus`
--

INSERT INTO `Menus` (`idMenu`, `nombreMenu`, `precio`, `TiposMenus_idTipoMenu`) VALUES
(1, 'Prueba Salads 1', 20000, 1),
(2, 'Prueba Salads 2', 30000, 1),
(3, 'Prueba Appetizers 1', 15000, 2),
(4, 'Prueba Appetizers 2', 20000, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pedidos`
--

CREATE TABLE IF NOT EXISTS `Pedidos` (
  `nroMesa` int(11) NOT NULL,
  `monto` int(11) DEFAULT NULL,
  PRIMARY KEY (`nroMesa`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Pedidos`
--

INSERT INTO `Pedidos` (`nroMesa`, `monto`) VALUES
(1, 120000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PedidosBebidas`
--

CREATE TABLE IF NOT EXISTS `PedidosBebidas` (
  `Pedidos_nroMesa` int(11) NOT NULL,
  `Bebidas_idBebida` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  PRIMARY KEY (`Pedidos_nroMesa`,`Bebidas_idBebida`),
  KEY `fk_Pedidos_has_Bebidas_Bebidas1_idx` (`Bebidas_idBebida`),
  KEY `fk_Pedidos_has_Bebidas_Pedidos1_idx` (`Pedidos_nroMesa`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PedidosMenus`
--

CREATE TABLE IF NOT EXISTS `PedidosMenus` (
  `Pedidos_nroMesa` int(11) NOT NULL,
  `Menus_idMenu` int(11) NOT NULL,
  `cantidad` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Pedidos_nroMesa`,`Menus_idMenu`),
  KEY `fk_Pedidos_has_Menus_Menus1_idx` (`Menus_idMenu`),
  KEY `fk_Pedidos_has_Menus_Pedidos_idx` (`Pedidos_nroMesa`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `PedidosMenus`
--

INSERT INTO `PedidosMenus` (`Pedidos_nroMesa`, `Menus_idMenu`, `cantidad`) VALUES
(1, 1, NULL),
(1, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PedidosPizzas`
--

CREATE TABLE IF NOT EXISTS `PedidosPizzas` (
  `Pedidos_nroMesa` int(11) NOT NULL,
  `Pizzas_idPizza` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `idCombinado` int(11) DEFAULT NULL,
  PRIMARY KEY (`Pedidos_nroMesa`,`Pizzas_idPizza`),
  KEY `fk_Pedidos_has_Pizzas_Pizzas1_idx` (`Pizzas_idPizza`),
  KEY `fk_Pedidos_has_Pizzas_Pedidos1_idx` (`Pedidos_nroMesa`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `PedidosPizzas`
--

INSERT INTO `PedidosPizzas` (`Pedidos_nroMesa`, `Pizzas_idPizza`, `cantidad`, `idCombinado`) VALUES
(1, 2, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pizzas`
--

CREATE TABLE IF NOT EXISTS `Pizzas` (
  `idPizza` int(11) NOT NULL AUTO_INCREMENT,
  `nombrePizza` varchar(45) NOT NULL,
  `precio` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPizza`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `Pizzas`
--

INSERT INTO `Pizzas` (`idPizza`, `nombrePizza`, `precio`) VALUES
(1, 'Pizza de Prueba 1', '30000'),
(2, 'Pizza de Prueba 2', '70000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TiposMenus`
--

CREATE TABLE IF NOT EXISTS `TiposMenus` (
  `idTipoMenu` int(11) NOT NULL AUTO_INCREMENT,
  `tipoMenu` varchar(20) NOT NULL,
  PRIMARY KEY (`idTipoMenu`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `TiposMenus`
--

INSERT INTO `TiposMenus` (`idTipoMenu`, `tipoMenu`) VALUES
(1, 'Salads'),
(2, 'Appetizers');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
