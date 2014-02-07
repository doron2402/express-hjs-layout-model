-- phpMyAdmin SQL Dump
-- version 3.5.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 07, 2014 at 05:10 AM
-- Server version: 5.5.29
-- PHP Version: 5.4.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `leads`
--

-- --------------------------------------------------------

--
-- Table structure for table `campigns`
--

CREATE TABLE `campigns` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `campigns`
--

INSERT INTO `campigns` (`id`, `name`, `createdAt`, `startAt`, `endAt`, `media`, `adminUsers`, `campignManager`, `url`, `company`, `contactPhone`, `contactEmail`) VALUES
(123, 'TestingCampign', '2014-02-04 18:59:14', '0000-00-00', '0000-00-00', '', '', '', '', '', '', ''),
(1234, 'just another camp', '2014-02-04 22:31:49', '0000-00-00', '0000-00-00', 0x66616365626f6f6b2c796e6574, '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `cardential`
--

CREATE TABLE `cardential` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `campignId` int(11) NOT NULL,
  `cardential` tinyint(4) NOT NULL,
  `options` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '0',
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `cardential`
--

INSERT INTO `cardential` (`id`, `userId`, `campignId`, `cardential`, `options`, `lastUpdated`) VALUES
(1, 2, 123, 1, '0', '2014-02-04 19:00:39'),
(2, 2, 1234, 1, '0', '2014-02-04 22:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=17 ;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `userId`, `clientName`, `clientPhone`, `clientSite`, `clientAddress`, `clientCity`, `clientState`, `clientCountry`, `clientFax`, `clientContactPhone`, `clientContactName`, `clientAccountManager`, `clientCampigns`) VALUES
(1, 2, 'Activated group', '123123123', 'activated.co.il', 'Shenikin 12', 'Tel Aviv', '', 'Israel', '', '44444444', 'Mike', 'Boaz', 0x3132332c31323334),
(15, 2, 'asdfasdfadsf', '123123123', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', '', ''),
(16, 2, 'client name here', '123123123', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', '123123123', 'NULL', '', '');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4 ;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`Id`, `createdAt`, `name`, `phone`, `email`, `message`) VALUES
(1, '2014-02-03 00:39:03', 'Doron Segal', '123123123', 'afasdf@asdf.com', 0x4e554c4c),
(2, '2014-02-03 01:29:32', 'ee eee', '123123123', 'dee@ee.com', 0x65656565),
(3, '2014-02-04 00:33:12', 'Amir adsf', '123123123', 'amir@amir.com', 0x6c6b6a6e7364666b6a6e647320666b766a686e626473666876627364);

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

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `campignId`, `name`, `email`, `phone`, `message`, `fields`, `createdAt`, `dayOfWeek`, `media`, `prod`, `erate`, `channel`, `size`, `reffer`) VALUES
(1, 1, 'doron segal', 'doron@doron.con', '1231231234', 0x617364666d206173646e666b6a61736e64666b6a, 0x616c64736e6b6a61736e64666b6e61737c7c206b6a6e616b736a68666e6a686173646266207c7c2061646661736466207c7c20, '2014-01-31 00:58:40', 2, 'facebook', '', '', '', '', ''),
(2, 1, 'doron segal', 'doron@doron.con', '1231231234', 0x617364666d206173646e666b6a61736e64666b6a, 0x616c64736e6b6a61736e64666b6e61737c7c206b6a6e616b736a68666e6a686173646266207c7c2061646661736466207c7c20, '2014-01-31 00:59:18', 2, 'facebook', '', '', '', '', ''),
(3, 123, 'Doron Segal', 'NULL', 'NULL', 0x4e554c4c, 0x4e554c4c, '2014-01-31 06:50:02', 4, 'Boaz ata homo', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL'),
(4, 123, 'Doron Segal', 'NULL', 'NULL', 0x4e554c4c, 0x4e554c4c, '2014-01-31 07:13:22', 4, 'Boaz ata homo', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL'),
(21, 123, 'NULL', 'NULL', 'NULL', 0x4e554c4c, 0x4e554c4c, '2014-01-31 23:31:44', 5, 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL');

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

--
-- Dumping data for table `traffic`
--

INSERT INTO `traffic` (`id`, `campignId`, `prod`, `channel`, `media`, `size`, `reffer`, `erate`, `createdAt`, `dayOfWeek`) VALUES
(8, 123, 'NULL', 'NULL', 'Boaz ata homo', 'NULL', 'NULL', 'NULL', '2014-01-31 06:52:02', 4),
(9, 123, 'NULL', 'NULL', 'Boaz ata homo', 'NULL', 'NULL', 'NULL', '2014-01-31 06:52:31', 4),
(10, 1234, 'NULL', 'NULL', 'Boaz ata homo', 'NULL', 'NULL', 'NULL', '2014-01-31 07:16:54', 4),
(11, 1234, 'NULL', 'NULL', 'facebook', 'NULL', 'NULL', 'NULL', '2014-01-31 21:35:05', 5);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `username`, `type`, `phone`, `copmany`) VALUES
(1, 'Doron Segal', 'doron1@doron.com', '2ec7c71de8020e3ce84bc8ba83967b541e6ce5db', 'doron', 0, '123123123', ''),
(2, '', 'doron2@doron.com', '897ff81adc514e1b70306e45a4a77be12f50c92c', 'doron123', 0, '', ''),
(3, '', 'boaz@boaz.com', 'd4d8a60e491d212baa5e1087ffc901707a697172', 'boaz123', 0, '', ''),
(4, '', 'doron1234@doron.com', '52f0cd161603999005f2a3d7ec783dfc96e5863d', 'doron1234', 0, '', '');
