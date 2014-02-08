
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table campigns
# ------------------------------------------------------------

DROP TABLE IF EXISTS `campigns`;

CREATE TABLE `campigns` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(32) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `url` varchar(128) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startAt` date DEFAULT NULL,
  `endAt` date DEFAULT NULL,
  `clientId` int(10) unsigned NOT NULL,
  `clientName` varchar(32) CHARACTER SET utf8 NOT NULL,
  `adminUser` int(10) unsigned DEFAULT NULL,
  `media` text CHARACTER SET utf8,
  `campignManagerName` varchar(32) CHARACTER SET utf8 DEFAULT '',
  `campignManagerEmail` varchar(80) CHARACTER SET utf8 DEFAULT NULL,
  `campignManagerPhone` varchar(12) CHARACTER SET utf8 DEFAULT NULL,
  `notes` text CHARACTER SET utf8,
  `emailReportLeads` text CHARACTER SET utf8,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOCK TABLES `campigns` WRITE;
/*!40000 ALTER TABLE `campigns` DISABLE KEYS */;

INSERT INTO `campigns` (`id`, `name`, `url`, `createdAt`, `startAt`, `endAt`, `clientId`, `clientName`, `adminUser`, `media`, `campignManagerName`, `campignManagerEmail`, `campignManagerPhone`, `notes`, `emailReportLeads`)
VALUES
  (123,'TestingCampign','','2014-02-04 10:59:14','0000-00-00','0000-00-00',0,'',0,'','',NULL,NULL,NULL,NULL),
  (1234,'just another camp','','2014-02-04 14:31:49','0000-00-00','0000-00-00',0,'',0,'facebook,ynet','',NULL,NULL,NULL,NULL),
  (660646745,'campign doron','http://segaldoron.com/campign/new.com','2014-02-08 00:07:30','0000-00-00','0000-00-00',112,'ca',2,'NULL','doron segal','doron@doron.com','123213123','just another note.','dasdf2asdf@adsf.com,asdf@adsf.com');

/*!40000 ALTER TABLE `campigns` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table cardential
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cardential`;

CREATE TABLE `cardential` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `campignId` int(11) NOT NULL,
  `cardential` tinyint(4) NOT NULL,
  `options` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '0',
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `cardential` WRITE;
/*!40000 ALTER TABLE `cardential` DISABLE KEYS */;

INSERT INTO `cardential` (`id`, `userId`, `campignId`, `cardential`, `options`, `lastUpdated`)
VALUES
  (1,2,123,1,X'30','2014-02-04 11:00:39'),
  (2,2,1234,1,X'30','2014-02-04 14:31:21');

/*!40000 ALTER TABLE `cardential` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table clients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `clientName` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientPhone` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientSite` varchar(128) COLLATE utf8_bin NOT NULL,
  `clientAddress` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientCity` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientState` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientCountry` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientFax` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientContactPhone` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientContactName` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientAccountManager` varchar(32) COLLATE utf8_bin NOT NULL,
  `clientCampigns` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;

INSERT INTO `clients` (`id`, `userId`, `clientName`, `clientPhone`, `clientSite`, `clientAddress`, `clientCity`, `clientState`, `clientCountry`, `clientFax`, `clientContactPhone`, `clientContactName`, `clientAccountManager`, `clientCampigns`)
VALUES
  (1,2,X'4163746976617465642067726F7570',X'313233313233313233',X'6163746976617465642E636F2E696C',X'5368656E696B696E203132',X'54656C2041766976',X'',X'49737261656C',X'',X'3434343434343434',X'4D696B65',X'426F617A',X'3132332C31323334'),
  (16,2,X'636C69656E74206E616D652068657265',X'313233313233313233',X'4E554C4C',X'70696361203333',X'486572747A',X'4341',X'49737261656C',X'3434343434343434343434',X'313233313233313233',X'4E554C4C',X'','');

/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table contacts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contacts`;

CREATE TABLE `contacts` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `phone` varchar(12) COLLATE utf8_bin NOT NULL,
  `email` varchar(80) COLLATE utf8_bin NOT NULL,
  `message` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;

INSERT INTO `contacts` (`Id`, `createdAt`, `name`, `phone`, `email`, `message`)
VALUES
  (1,'2014-02-02 16:39:03',X'446F726F6E20536567616C',X'313233313233313233',X'61666173646640617364662E636F6D',X'4E554C4C'),
  (2,'2014-02-02 17:29:32',X'656520656565',X'313233313233313233',X'6465654065652E636F6D',X'65656565'),
  (3,'2014-02-03 16:33:12',X'416D69722061647366',X'313233313233313233',X'616D697240616D69722E636F6D',X'6C6B6A6E7364666B6A6E647320666B766A686E626473666876627364');

/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table leads
# ------------------------------------------------------------

DROP TABLE IF EXISTS `leads`;

CREATE TABLE `leads` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `campignId` int(10) unsigned NOT NULL,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `email` varchar(60) COLLATE utf8_bin NOT NULL,
  `phone` varchar(16) COLLATE utf8_bin NOT NULL,
  `message` text COLLATE utf8_bin NOT NULL,
  `fields` text COLLATE utf8_bin NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dayOfWeek` int(2) NOT NULL,
  `media` varchar(32) COLLATE utf8_bin NOT NULL,
  `prod` varchar(32) COLLATE utf8_bin NOT NULL,
  `erate` varchar(32) COLLATE utf8_bin NOT NULL,
  `channel` varchar(32) COLLATE utf8_bin NOT NULL,
  `size` varchar(32) COLLATE utf8_bin NOT NULL,
  `reffer` varchar(32) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;

INSERT INTO `leads` (`id`, `campignId`, `name`, `email`, `phone`, `message`, `fields`, `createdAt`, `dayOfWeek`, `media`, `prod`, `erate`, `channel`, `size`, `reffer`)
VALUES
  (1,1,X'646F726F6E20736567616C',X'646F726F6E40646F726F6E2E636F6E',X'31323331323331323334',X'617364666D206173646E666B6A61736E64666B6A',X'616C64736E6B6A61736E64666B6E61737C7C206B6A6E616B736A68666E6A686173646266207C7C2061646661736466207C7C20','2014-01-30 16:58:40',2,X'66616365626F6F6B',X'',X'',X'',X'',X''),
  (2,1,X'646F726F6E20736567616C',X'646F726F6E40646F726F6E2E636F6E',X'31323331323331323334',X'617364666D206173646E666B6A61736E64666B6A',X'616C64736E6B6A61736E64666B6E61737C7C206B6A6E616B736A68666E6A686173646266207C7C2061646661736466207C7C20','2014-01-30 16:59:18',2,X'66616365626F6F6B',X'',X'',X'',X'',X''),
  (3,123,X'446F726F6E20536567616C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-30 22:50:02',4,X'426F617A2061746120686F6D6F',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C'),
  (4,123,X'446F726F6E20536567616C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-30 23:13:22',4,X'426F617A2061746120686F6D6F',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C'),
  (21,123,X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-31 15:31:44',5,X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C',X'4E554C4C');

/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table traffic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `traffic`;

CREATE TABLE `traffic` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campignId` int(11) NOT NULL,
  `prod` varchar(32) COLLATE utf8_bin NOT NULL,
  `channel` varchar(32) COLLATE utf8_bin NOT NULL,
  `media` varchar(32) COLLATE utf8_bin NOT NULL,
  `size` varchar(32) COLLATE utf8_bin NOT NULL,
  `reffer` varchar(32) COLLATE utf8_bin NOT NULL,
  `erate` varchar(32) COLLATE utf8_bin NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dayOfWeek` int(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `campignId` (`campignId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOCK TABLES `traffic` WRITE;
/*!40000 ALTER TABLE `traffic` DISABLE KEYS */;

INSERT INTO `traffic` (`id`, `campignId`, `prod`, `channel`, `media`, `size`, `reffer`, `erate`, `createdAt`, `dayOfWeek`)
VALUES
  (8,123,X'4E554C4C',X'4E554C4C',X'426F617A2061746120686F6D6F',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-30 22:52:02',4),
  (9,123,X'4E554C4C',X'4E554C4C',X'426F617A2061746120686F6D6F',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-30 22:52:31',4),
  (10,1234,X'4E554C4C',X'4E554C4C',X'426F617A2061746120686F6D6F',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-30 23:16:54',4),
  (11,1234,X'4E554C4C',X'4E554C4C',X'66616365626F6F6B',X'4E554C4C',X'4E554C4C',X'4E554C4C','2014-01-31 13:35:05',5);

/*!40000 ALTER TABLE `traffic` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `email` varchar(60) COLLATE utf8_bin NOT NULL,
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  `username` varchar(32) COLLATE utf8_bin NOT NULL,
  `type` int(4) NOT NULL,
  `phone` varchar(12) COLLATE utf8_bin NOT NULL,
  `copmany` varchar(32) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `username_2` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `username`, `type`, `phone`, `copmany`)
VALUES
  (1,X'446F726F6E20536567616C',X'646F726F6E3140646F726F6E2E636F6D',X'32656337633731646538303230653363653834626338626138333936376235343165366365356462',X'646F726F6E',0,X'313233313233313233',X''),
  (2,X'',X'646F726F6E3240646F726F6E2E636F6D',X'38393766663831616463353134653162373033303665343561346137376265313266353063393263',X'646F726F6E313233',0,X'',X''),
  (3,X'',X'626F617A40626F617A2E636F6D',X'64346438613630653439316432313262616135653130383766666339303137303761363937313732',X'626F617A313233',0,X'',X'');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
