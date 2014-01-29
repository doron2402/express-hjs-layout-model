## running the app
1. `npm i`
2. `bower i`
3.



## Database Schema


--
-- Database: `whosup2`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` int(11) NOT NULL COMMENT 'user admin id',
  `user_admins` varchar(128) NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(32) NOT NULL,
  `city` varchar(32) NOT NULL,
  `country` varchar(32) NOT NULL,
  `state` int(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `facebook` varchar(32) COLLATE utf8_bin NOT NULL,
  `google` varchar(32) COLLATE utf8_bin NOT NULL,
  `twitter` varchar(32) COLLATE utf8_bin NOT NULL,
  `email` varchar(50) COLLATE utf8_bin NOT NULL,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `password` varchar(32) COLLATE utf8_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

