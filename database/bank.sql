- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cust_name` varchar(50) DEFAULT '',
  `account_no` varchar(15) NOT NULL,
  `username` varchar(160) DEFAULT NULL,
  `password` varchar(160) DEFAULT NULL,
  `account_balance` int unsigned DEFAULT '0',
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_no` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3

--
-- Dumping data for table `customers`
--

INSERT INTO `sal_users` (`first_name`, `last_name`, `username`, `email_address`, `msisdn`, `physical_address`, `id_number`, `gender`, `role_id`, `password`, `date_created`, `last_updated`, `is_login`, `status`) VALUES
('moraa', 'nicole', NULL, 'nmoraa@onfonmedia.com', '0718563621', 'Office road', '2323232', 'female', 1, '$2a$10$767TOiEsxguEdNZOwkoHgOm1q3TN1mOzgv9lPNM9opsPcl.Rm/C3S', '2019-10-16 15:10:18', '0', '1', '1');

-- --------------------------------------------------------


--table structure for table customer_trx_log
CREATE TABLE `customer_trx_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_no` varchar(12) NOT NULL,
  `trx_type` varchar(50) DEFAULT NULL,
  `depos` double(15,5) DEFAULT NULL,
  `withs` double(15,5) DEFAULT NULL,
  `prev_bal` double(15,2) DEFAULT NULL,
  `new_bal` double(15,2) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3
