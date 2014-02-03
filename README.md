## running the app
1. `npm i`
2. `bower i`
3.



--
-- Database: `leads`
--

-- --------------------------------------------------------

--
-- Table structure for table `campigns`
--

CREATE TABLE `campigns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `createdAtTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdAtDate` date NOT NULL,
  `startAt` date NOT NULL,
  `endAt` date NOT NULL,
  `media` text COLLATE utf8_bin NOT NULL,
  `adminUsers` varchar(128) COLLATE utf8_bin NOT NULL,
  `campignManager` varchar(32) COLLATE utf8_bin NOT NULL,
  `url` varchar(128) COLLATE utf8_bin NOT NULL,
  `company` varchar(32) COLLATE utf8_bin NOT NULL,
  `contactPhone` varchar(12) COLLATE utf8_bin NOT NULL,
  `contactEmail` varchar(32) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=22 ;

-- --------------------------------------------------------

--
-- Table structure for table `traffic`
--

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=12 ;

-- --------------------------------------------------------
--
-- Table structure for table `users`
--

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `phone` varchar(12) COLLATE utf8_bin NOT NULL,
  `email` varchar(80) COLLATE utf8_bin NOT NULL,
  `message` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;


