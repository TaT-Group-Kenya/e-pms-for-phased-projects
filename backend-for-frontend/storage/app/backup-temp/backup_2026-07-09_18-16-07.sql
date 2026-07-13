-- MySQL dump 10.13  Distrib 9.3.0, for macos14.7 (arm64)
--
-- Host: 127.0.0.1    Database: epms_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_groups`
--

DROP TABLE IF EXISTS `account_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_groups_name_unique` (`name`),
  UNIQUE KEY `ux_account_groups_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_groups`
--

LOCK TABLES `account_groups` WRITE;
/*!40000 ALTER TABLE `account_groups` DISABLE KEYS */;
INSERT INTO `account_groups` (`id`, `name`, `description`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'PETTY','Petty',NULL,NULL,NULL,NULL,0,NULL,NULL),(2,'CHECKING','Checking',NULL,NULL,NULL,NULL,0,NULL,NULL),(3,'SAVINGS','Savings',NULL,NULL,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `account_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_types`
--

DROP TABLE IF EXISTS `account_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_account_types_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_types`
--

LOCK TABLES `account_types` WRITE;
/*!40000 ALTER TABLE `account_types` DISABLE KEYS */;
INSERT INTO `account_types` (`id`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'CASH','Cash','2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(2,'MPESA','Mpesa','2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(3,'BANK','Bank','2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `account_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('cash','mpesa','bank') COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` enum('Petty','Checking','Savings') COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` decimal(15,2) NOT NULL,
  `overdraft_allowed` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `code`, `name`, `description`, `type`, `group`, `currency`, `balance`, `overdraft_allowed`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'INT-ACC-3381-3338','Main USD Account ledger','Main USD Account ledger','bank','Savings','USD',1120000.00,0,'2026-05-12 16:51:31','2026-05-25 18:52:44',1,2,0,NULL,NULL),(2,'INT-ACC-6488-1031','KES account at mpesa','KES account at mpesa','mpesa','Checking','KES',63640000.00,0,'2026-05-12 16:56:06','2026-06-12 04:51:43',1,2,0,NULL,NULL),(3,'INT-ACC-2188-7204','Test account that can be opening balance','Test account that can be opening balance','mpesa','Checking','USD',0.00,0,'2026-07-06 14:27:34','2026-07-06 14:39:04',1,1,1,'2026-07-06 14:39:15',1),(4,'INT-ACC-4110-0665','test again','test again','mpesa','Checking','EUR',1250.00,0,'2026-07-06 14:39:37',NULL,NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kra_pin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companies_email_unique` (`email`),
  UNIQUE KEY `companies_phone_unique` (`phone`),
  UNIQUE KEY `companies_kra_pin_unique` (`kra_pin`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` (`id`, `created_at`, `updated_at`, `name`, `description`, `email`, `phone`, `contact_person_name`, `logo`, `address`, `city`, `state`, `country`, `kra_pin`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'2026-05-26 05:13:46','2026-05-26 05:13:46','Tech Solutions Ltd','A leading technology solutions provider specializing in software development and IT consulting','info@techsolutions.com','+254700123456','John Doe','3310.png','123 Tech Park, Westlands','Nairobi','Nairobi County','Kenya','P051234567K',1,1,0,NULL,NULL),(2,'2026-05-26 05:13:46','2026-06-12 14:52:07','Global Enterprises Ltd','International business solutions and logistics company serving clients across East Africa','contact@globalenterprises.com','+254711987654','Jane Smith','3310.png','456 Business District, Upper Hill','Nairobi','Nairobi County','Kenya','P059876543K',1,1,1,'2026-06-12 14:52:07',1);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_banks`
--

DROP TABLE IF EXISTS `company_banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_banks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `company_id` bigint unsigned NOT NULL,
  `type` enum('Bank','MPESA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `swiftcode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_holder_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_banks_company_id_foreign` (`company_id`),
  CONSTRAINT `company_banks_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_banks`
--

LOCK TABLES `company_banks` WRITE;
/*!40000 ALTER TABLE `company_banks` DISABLE KEYS */;
INSERT INTO `company_banks` (`id`, `created_at`, `updated_at`, `company_id`, `type`, `account_no`, `swiftcode`, `branch`, `account_holder_name`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'2026-05-12 16:53:07','2026-05-12 16:53:27',1,'MPESA','247247','KEND56YTU','Mpesa','Tech Solutions Ltd',NULL,NULL,0,NULL,NULL),(2,'2026-06-12 04:17:01','2026-06-12 04:17:01',2,'MPESA','0705117984',NULL,'HQ','Global tech',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `company_banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_credit_note_items`
--

DROP TABLE IF EXISTS `company_credit_note_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_credit_note_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `credit_note_id` bigint unsigned NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci,
  `item_amount` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_taxable` tinyint(1) NOT NULL DEFAULT '0',
  `tax_id` bigint unsigned DEFAULT NULL,
  `tax_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` enum('fixed','percent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_value` decimal(15,2) DEFAULT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `custom_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_credit_note_items_credit_note_id_foreign` (`credit_note_id`),
  CONSTRAINT `company_credit_note_items_credit_note_id_foreign` FOREIGN KEY (`credit_note_id`) REFERENCES `company_credit_notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_credit_note_items`
--

LOCK TABLES `company_credit_note_items` WRITE;
/*!40000 ALTER TABLE `company_credit_note_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_credit_note_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_credit_notes`
--

DROP TABLE IF EXISTS `company_credit_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_credit_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `credit_note_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','raised','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `subtotal_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes_to_customer` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_credit_notes_credit_note_number_unique` (`credit_note_number`),
  KEY `company_credit_notes_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `company_credit_notes_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `company_invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_credit_notes`
--

LOCK TABLES `company_credit_notes` WRITE;
/*!40000 ALTER TABLE `company_credit_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_credit_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_invoice_documents`
--

DROP TABLE IF EXISTS `company_invoice_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_invoice_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_type` enum('proposal','terms','attachments') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'attachments',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_invoice_documents_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `company_invoice_documents_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `company_invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_invoice_documents`
--

LOCK TABLES `company_invoice_documents` WRITE;
/*!40000 ALTER TABLE `company_invoice_documents` DISABLE KEYS */;
INSERT INTO `company_invoice_documents` (`id`, `invoice_id`, `document_path`, `document_type`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (3,1,'company-invoice-documents/CMPINV-000001-macron.jpg','attachments',NULL,NULL,NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `company_invoice_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_invoice_items`
--

DROP TABLE IF EXISTS `company_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_invoice_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `project_phase_id` bigint unsigned NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci,
  `item_amount` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(15,2) DEFAULT NULL,
  `is_taxable` tinyint(1) NOT NULL,
  `tax_id` bigint unsigned DEFAULT NULL,
  `tax_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` enum('fixed','percent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_value` decimal(15,2) DEFAULT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_invoice_items_invoice_id_foreign` (`invoice_id`),
  KEY `company_invoice_items_project_phase_id_foreign` (`project_phase_id`),
  CONSTRAINT `company_invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `company_invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_invoice_items_project_phase_id_foreign` FOREIGN KEY (`project_phase_id`) REFERENCES `project_phases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_invoice_items`
--

LOCK TABLES `company_invoice_items` WRITE;
/*!40000 ALTER TABLE `company_invoice_items` DISABLE KEYS */;
INSERT INTO `company_invoice_items` (`id`, `invoice_id`, `project_phase_id`, `item_name`, `item_description`, `item_amount`, `quantity`, `total`, `is_taxable`, `tax_id`, `tax_item_name`, `item_type`, `item_value`, `tax_amount`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,'Phase 1','phase 1 payment',450000.00,1,450000.00,1,1,'Value Added Tax','percent',16.00,72000.00,'2026-05-12 16:54:37','2026-05-12 16:54:37',NULL,NULL,0,NULL,NULL),(2,2,2,'phase 2','done work of phase 2',2000.00,1,2000.00,1,1,'Value Added Tax','percent',16.00,320.00,'2026-06-12 04:17:48','2026-06-12 04:17:48',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `company_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_invoices`
--

DROP TABLE IF EXISTS `company_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `company_id` bigint unsigned NOT NULL,
  `project_phase_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','sent','paid','overdue','partially-paid','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `subtotal_amount` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_terms` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes_to_customer` text COLLATE utf8mb4_unicode_ci,
  `valid_until` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_invoices_project_id_foreign` (`project_id`),
  KEY `company_invoices_company_id_foreign` (`company_id`),
  KEY `company_invoices_project_phase_id_foreign` (`project_phase_id`),
  CONSTRAINT `company_invoices_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_invoices_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_invoices_project_phase_id_foreign` FOREIGN KEY (`project_phase_id`) REFERENCES `project_phases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_invoices`
--

LOCK TABLES `company_invoices` WRITE;
/*!40000 ALTER TABLE `company_invoices` DISABLE KEYS */;
INSERT INTO `company_invoices` (`id`, `invoice_number`, `project_id`, `company_id`, `project_phase_id`, `title`, `description`, `status`, `subtotal_amount`, `tax_amount`, `discount_percentage`, `discount_amount`, `total_amount`, `currency`, `payment_terms`, `notes_to_customer`, `valid_until`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'CMPINV-000001',1,1,1,'phase one of the project PRP-8533-2036','phase one of the project PRP-8533-2036','partially-paid',450000.00,72000.00,0.00,0.00,522000.00,'KES','2 days','','2026-06-11','2026-05-12 16:54:13','2026-05-25 18:07:59',1,2,0,NULL,NULL),(2,'CMPINV-000002',1,2,2,'my test invoice','dhdhdhdh','sent',2000.00,320.00,0.00,0.00,2320.00,'KES','djdjdjjd','djdjdjdjd','2026-07-12','2026-06-12 00:00:00','2026-06-12 15:14:17',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `company_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_payments`
--

DROP TABLE IF EXISTS `company_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint unsigned DEFAULT NULL,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint unsigned DEFAULT NULL,
  `amount_paid` decimal(15,2) NOT NULL DEFAULT '0.00',
  `direction` enum('incoming','outgoing') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'outgoing',
  `transaction_type` enum('receipt','refund') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'receipt',
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `net_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `payment_date` date DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('pending','complete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'complete',
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` decimal(15,6) DEFAULT NULL,
  `forex_rate` decimal(15,6) NOT NULL DEFAULT '1.000000',
  `project_currency_value` decimal(15,2) NOT NULL DEFAULT '0.00',
  `project_currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reconciled` tinyint(1) NOT NULL DEFAULT '0',
  `reconciliation_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_payments_transaction_number_unique` (`transaction_number`),
  KEY `company_payments_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `company_payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `company_invoices` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_payments`
--

LOCK TABLES `company_payments` WRITE;
/*!40000 ALTER TABLE `company_payments` DISABLE KEYS */;
INSERT INTO `company_payments` (`id`, `transaction_id`, `transaction_number`, `invoice_id`, `amount_paid`, `direction`, `transaction_type`, `tax_amount`, `net_amount`, `payment_date`, `payment_method`, `payment_status`, `currency`, `exchange_rate`, `forex_rate`, `project_currency_value`, `project_currency`, `bank_name`, `check_number`, `transaction_reference`, `receipt_number`, `reconciled`, `reconciliation_date`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,2,'CMPPAY-2087-2822',1,450000.00,'outgoing','receipt',62068.97,387931.03,'2026-05-12','mpesa','complete','KES',1.000000,128.250000,3508.77,'USD','Mpesa',NULL,'UF45GFUT','UF45GFUT',0,NULL,'2026-05-12 16:58:47','2026-05-12 16:58:47',2,2,0,NULL,NULL),(2,3,'CMPPAY-7111-0767',1,10000.00,'outgoing','receipt',1379.31,8620.69,'2026-05-25','check','complete','KES',1.000000,128.450000,77.85,'USD','abc','002','0002','0002',0,NULL,'2026-05-25 03:46:35','2026-05-25 03:46:35',1,1,0,NULL,NULL),(3,4,'CMPPAY-9370-8427',1,5000.00,'outgoing','receipt',689.66,4310.34,'2026-05-25','CHEQUE','complete','KES',1.000000,1.000000,5000.00,'USD','ABC bank','00005','chk-00005','CMPPAY-9370-8427',0,NULL,'2026-05-25 18:07:59','2026-05-25 18:07:59',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `company_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_projects`
--

DROP TABLE IF EXISTS `company_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned NOT NULL,
  `phase_id` bigint unsigned NOT NULL,
  `company_id` bigint unsigned NOT NULL,
  `is_complete` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_projects_project_id_phase_id_company_id_unique` (`project_id`,`phase_id`,`company_id`),
  UNIQUE KEY `company_projects_project_id_phase_id_unique` (`project_id`,`phase_id`),
  KEY `company_projects_phase_id_foreign` (`phase_id`),
  KEY `company_projects_company_id_foreign` (`company_id`),
  CONSTRAINT `company_projects_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_projects_phase_id_foreign` FOREIGN KEY (`phase_id`) REFERENCES `project_phases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_projects_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_projects`
--

LOCK TABLES `company_projects` WRITE;
/*!40000 ALTER TABLE `company_projects` DISABLE KEYS */;
INSERT INTO `company_projects` (`id`, `project_id`, `phase_id`, `company_id`, `is_complete`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,1,1,'2026-05-12 16:49:13','2026-06-12 04:15:38',1,2,0,NULL,NULL),(2,1,2,2,1,'2026-05-12 16:49:16','2026-06-12 04:15:38',1,2,0,NULL,NULL);
/*!40000 ALTER TABLE `company_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_transactions_ledger`
--

DROP TABLE IF EXISTS `company_transactions_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_transactions_ledger` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_payment_id` bigint unsigned DEFAULT NULL,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_type` enum('payment','receipt','refund','invoice') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_date` date NOT NULL,
  `posted_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` decimal(15,6) NOT NULL,
  `converted_amount` decimal(15,2) NOT NULL,
  `converted_tax_amount` decimal(15,2) DEFAULT NULL,
  `converted_net_amount` decimal(15,2) DEFAULT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `net_amount` decimal(15,2) NOT NULL,
  `company_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `source_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned DEFAULT NULL,
  `account_debit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_credit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('revenue','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_status` enum('pending','cleared','reconciled','void') COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_transaction_id` bigint unsigned DEFAULT NULL,
  `narration` text COLLATE utf8mb4_unicode_ci,
  `is_recurring` tinyint(1) NOT NULL,
  `fiscal_year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accounting_period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_adjusting_entry` tinyint(1) NOT NULL,
  `cost_center_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_transactions_ledger_transaction_number_unique` (`transaction_number`),
  KEY `company_transactions_ledger_company_payment_id_foreign` (`company_payment_id`),
  CONSTRAINT `company_transactions_ledger_company_payment_id_foreign` FOREIGN KEY (`company_payment_id`) REFERENCES `company_payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_transactions_ledger`
--

LOCK TABLES `company_transactions_ledger` WRITE;
/*!40000 ALTER TABLE `company_transactions_ledger` DISABLE KEYS */;
INSERT INTO `company_transactions_ledger` (`id`, `company_payment_id`, `transaction_number`, `transaction_type`, `transaction_date`, `posted_date`, `amount`, `transaction_currency`, `base_currency`, `exchange_rate`, `converted_amount`, `converted_tax_amount`, `converted_net_amount`, `tax_amount`, `net_amount`, `company_id`, `customer_id`, `source_type`, `source_id`, `account_debit`, `account_credit`, `category`, `payment_method`, `bank_account`, `check_number`, `transaction_status`, `related_transaction_id`, `narration`, `is_recurring`, `fiscal_year`, `accounting_period`, `is_adjusting_entry`, `cost_center_id`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,NULL,'CMPINV-000001','invoice','2026-05-12','2026-05-12',522000.00,'KES','KES',1.000000,0.00,0.00,0.00,72000.00,450000.00,1,NULL,'company_invoice',1,NULL,NULL,'expense',NULL,NULL,NULL,'cleared',NULL,'Company invoice CMPINV-000001 posted to ledger.',0,'2026','202605',0,NULL,'2026-05-12 16:54:58','2026-05-12 16:54:58',2,2,0,NULL,NULL),(2,1,'CMPPAY-2087-2822','payment','2026-05-12','2026-05-12',450000.00,'KES','KES',1.000000,450000.00,62068.97,387931.03,62068.97,387931.03,1,NULL,'company_invoice',1,'2',NULL,'expense','mpesa','Mpesa',NULL,'cleared',NULL,'Payment for company invoice CMPINV-000001',0,'2026','202605',0,NULL,'2026-05-12 16:58:47','2026-05-12 16:58:47',2,2,0,NULL,NULL),(3,2,'CMPPAY-7111-0767','payment','2026-05-25','2026-05-25',10000.00,'KES','KES',1.000000,10000.00,1379.31,8620.69,1379.31,8620.69,1,NULL,'company_invoice',1,'2',NULL,'expense','check','abc','002','cleared',NULL,'Payment for company invoice CMPINV-000001',0,'2026','202605',0,NULL,'2026-05-25 03:46:35','2026-05-25 03:46:35',1,1,0,NULL,NULL),(4,3,'CMPPAY-9370-8427','payment','2026-05-25','2026-05-25',5000.00,'KES','KES',1.000000,5000.00,689.66,4310.34,689.66,4310.34,1,NULL,'company_invoice',1,'2',NULL,'expense','CHEQUE','ABC bank','00005','cleared',NULL,'PDC cleared: PDC created from invoice payment (deferred).',0,'2026','202605',0,NULL,'2026-05-25 18:07:59','2026-05-25 18:07:59',1,1,0,NULL,NULL),(5,NULL,'CMPINV-000002','invoice','2026-06-12','2026-06-12',2320.00,'KES','KES',1.000000,0.00,0.00,0.00,320.00,2000.00,2,NULL,'company_invoice',2,NULL,NULL,'expense',NULL,NULL,NULL,'cleared',NULL,'Company invoice CMPINV-000002 posted to ledger.',0,'2026','202606',0,NULL,'2026-06-12 04:26:32','2026-06-12 04:26:32',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `company_transactions_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dial_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_countries_name` (`name`),
  UNIQUE KEY `ux_countries_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` (`id`, `code`, `dial_code`, `name`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'KE','+254','Kenya','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(2,'UG','+256','Uganda','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(3,'TZ','+255','Tanzania','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(4,'RW','+250','Rwanda','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(5,'SS','+211','South Sudan','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(6,'ET','+251','Ethiopia','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(7,'SO','+252','Somalia','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(8,'BI','+257','Burundi','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(9,'CD','+243','DR Congo','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(10,'CG','+242','Republic of the Congo','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(11,'CM','+237','Cameroon','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(12,'GA','+241','Gabon','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(13,'GQ','+240','Equatorial Guinea','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(14,'ST','+239','Sao Tome and Principe','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(15,'CV','+238','Cape Verde','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(16,'US','+1','United States','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(17,'GB','+44','United Kingdom','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(18,'FR','+33','France','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(19,'DE','+49','Germany','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(20,'IT','+39','Italy','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(21,'ES','+34','Spain','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(22,'CN','+86','China','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(23,'IN','+91','India','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(24,'JP','+81','Japan','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `current_forex_rate` decimal(18,6) NOT NULL DEFAULT '1.000000',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_currencies_name` (`name`),
  UNIQUE KEY `ux_currencies_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` (`id`, `code`, `name`, `description`, `current_forex_rate`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'KES','Kenyan Shilling','Kenyan Shilling',1.000000,'2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(2,'USD','US Dollar','US Dollar',128.450000,'2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(3,'EUR','Euro','Euro',151.200000,'2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(4,'GBP','British Pound','British Pound',176.350000,'2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_credit_note_items`
--

DROP TABLE IF EXISTS `cust_credit_note_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_credit_note_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `credit_note_id` bigint unsigned NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci,
  `item_amount` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_taxable` tinyint(1) NOT NULL DEFAULT '0',
  `tax_id` bigint unsigned DEFAULT NULL,
  `tax_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` enum('fixed','percent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_value` decimal(15,2) DEFAULT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `custom_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_credit_note_items_credit_note_id_foreign` (`credit_note_id`),
  CONSTRAINT `cust_credit_note_items_credit_note_id_foreign` FOREIGN KEY (`credit_note_id`) REFERENCES `cust_credit_notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_credit_note_items`
--

LOCK TABLES `cust_credit_note_items` WRITE;
/*!40000 ALTER TABLE `cust_credit_note_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cust_credit_note_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_credit_notes`
--

DROP TABLE IF EXISTS `cust_credit_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_credit_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `credit_note_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','raised','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `subtotal_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes_to_customer` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cust_credit_notes_credit_note_number_unique` (`credit_note_number`),
  KEY `cust_credit_notes_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `cust_credit_notes_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `cust_invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_credit_notes`
--

LOCK TABLES `cust_credit_notes` WRITE;
/*!40000 ALTER TABLE `cust_credit_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `cust_credit_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_invoice_documents`
--

DROP TABLE IF EXISTS `cust_invoice_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_invoice_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_type` enum('proposal','terms','attachments') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'attachments',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_invoice_documents_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `cust_invoice_documents_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `cust_invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_invoice_documents`
--

LOCK TABLES `cust_invoice_documents` WRITE;
/*!40000 ALTER TABLE `cust_invoice_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `cust_invoice_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_invoice_items`
--

DROP TABLE IF EXISTS `cust_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_invoice_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci,
  `item_amount` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_taxable` tinyint(1) NOT NULL,
  `tax_id` bigint unsigned DEFAULT NULL,
  `tax_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` enum('fixed','percent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_value` decimal(15,2) DEFAULT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `custom_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_invoice_items_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `cust_invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `cust_invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_invoice_items`
--

LOCK TABLES `cust_invoice_items` WRITE;
/*!40000 ALTER TABLE `cust_invoice_items` DISABLE KEYS */;
INSERT INTO `cust_invoice_items` (`id`, `invoice_id`, `item_name`, `item_description`, `item_amount`, `quantity`, `total`, `is_taxable`, `tax_id`, `tax_item_name`, `item_type`, `item_value`, `tax_amount`, `custom_note`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,'my quote','my quote',2000000.00,1,2000000.00,1,1,'Value Added Tax','percent',16.00,320000.00,NULL,'2026-05-12 16:46:21','2026-05-12 16:46:21',2,2,0,NULL,NULL),(2,2,'dddd','project',10000.00,1,10000.00,0,NULL,NULL,NULL,NULL,0.00,NULL,'2026-06-30 10:03:51','2026-06-30 10:03:51',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `cust_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_invoices`
--

DROP TABLE IF EXISTS `cust_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` bigint unsigned NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `job_reference_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','sent','paid','partial-paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `subtotal_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `discount_percentage` decimal(8,2) NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_receiving_method_id` bigint unsigned DEFAULT NULL,
  `payment_terms` text COLLATE utf8mb4_unicode_ci,
  `notes_to_customer` text COLLATE utf8mb4_unicode_ci,
  `valid_until` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_invoices_order_id_foreign` (`order_id`),
  KEY `cust_invoices_project_id_foreign` (`project_id`),
  KEY `cust_invoices_customer_id_foreign` (`customer_id`),
  KEY `cust_invoices_payment_receiving_method_id_foreign` (`payment_receiving_method_id`),
  CONSTRAINT `cust_invoices_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cust_invoices_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cust_invoices_payment_receiving_method_id_foreign` FOREIGN KEY (`payment_receiving_method_id`) REFERENCES `payment_receiving_methods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `cust_invoices_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_invoices`
--

LOCK TABLES `cust_invoices` WRITE;
/*!40000 ALTER TABLE `cust_invoices` DISABLE KEYS */;
INSERT INTO `cust_invoices` (`id`, `invoice_number`, `order_id`, `project_id`, `job_reference_id`, `customer_id`, `title`, `description`, `status`, `subtotal_amount`, `tax_amount`, `discount_percentage`, `discount_amount`, `total_amount`, `currency`, `payment_receiving_method_id`, `payment_terms`, `notes_to_customer`, `valid_until`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'CINV-000001',1,1,'JODEFHHH5HD',2,'my quote','my quote','partial-paid',2000000.00,320000.00,0.00,0.00,2320000.00,'USD',1,NULL,NULL,'2026-06-11','2026-05-12 00:00:00','2026-05-24 06:35:53',1,2,0,NULL,NULL),(2,'CINV-000002',2,2,'DW344343JDJ',3,'funny quote test','funny quote test ddd','sent',10000.00,0.00,0.00,0.00,10000.00,'KES',NULL,'terms','notes','2026-07-30','2026-06-30 10:03:42','2026-06-30 10:03:51',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `cust_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_payment_allocations`
--

DROP TABLE IF EXISTS `cust_payment_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_payment_allocations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned NOT NULL,
  `invoice_id` bigint unsigned NOT NULL,
  `allocated_amount` decimal(15,2) NOT NULL,
  `allocation_date` date NOT NULL,
  `balance_before_payment` decimal(15,2) NOT NULL,
  `balance_after_payment` decimal(15,2) NOT NULL,
  `installment_number` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_payment_allocations_payment_id_foreign` (`payment_id`),
  KEY `cust_payment_allocations_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `cust_payment_allocations_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `cust_invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cust_payment_allocations_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `cust_payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_payment_allocations`
--

LOCK TABLES `cust_payment_allocations` WRITE;
/*!40000 ALTER TABLE `cust_payment_allocations` DISABLE KEYS */;
INSERT INTO `cust_payment_allocations` (`id`, `payment_id`, `invoice_id`, `allocated_amount`, `allocation_date`, `balance_before_payment`, `balance_after_payment`, `installment_number`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,1500000.00,'2026-05-12',2320000.00,820000.00,1,NULL,NULL,2,2,0,NULL,NULL),(2,2,1,120000.00,'2026-05-25',820000.00,700000.00,2,NULL,NULL,1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `cust_payment_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cust_payments`
--

DROP TABLE IF EXISTS `cust_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cust_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount_paid` decimal(15,2) NOT NULL,
  `direction` enum('incoming','outgoing') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'incoming',
  `transaction_type` enum('receipt','refund') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'receipt',
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `net_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','mpesa','bank_transfer','check') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('pending','complete') COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_total_amount` decimal(15,2) NOT NULL,
  `exchange_rate` decimal(15,6) NOT NULL,
  `fee_or_charge` decimal(15,2) NOT NULL,
  `reconciled` tinyint(1) NOT NULL,
  `reconciliation_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cust_payments_transaction_number_unique` (`transaction_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cust_payments`
--

LOCK TABLES `cust_payments` WRITE;
/*!40000 ALTER TABLE `cust_payments` DISABLE KEYS */;
INSERT INTO `cust_payments` (`id`, `transaction_id`, `transaction_number`, `amount_paid`, `direction`, `transaction_type`, `tax_amount`, `net_amount`, `payment_date`, `payment_method`, `payment_status`, `currency`, `bank_name`, `check_number`, `transaction_reference`, `receipt_number`, `invoice_total_amount`, `exchange_rate`, `fee_or_charge`, `reconciled`, `reconciliation_date`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'2','CUSTPM-8319-7264',1500000.00,'incoming','receipt',206896.55,1293103.45,'2026-05-12','cash','complete','USD','Equity',NULL,'SGDGS4343fdfj4jj','SGDGS4343fdfj4jj',2320000.00,128.450000,0.00,0,NULL,'2026-05-12 16:52:14','2026-05-12 16:52:14',2,2,0,NULL,NULL),(2,'3','CUSTPM-9067-1434',120000.00,'incoming','receipt',16551.72,103448.28,'2026-05-25','check','complete','USD','ABC Bank','0003','chk-0003','CUSTPM-9067-1434',2320000.00,128.450000,0.00,0,NULL,'2026-05-25 18:52:44','2026-05-25 18:52:44',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `cust_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_transactions_ledger`
--

DROP TABLE IF EXISTS `customer_transactions_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_transactions_ledger` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cust_payment_id` bigint unsigned DEFAULT NULL,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_type` enum('payment','receipt','refund','invoice') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_date` date NOT NULL,
  `posted_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` decimal(15,6) NOT NULL,
  `converted_amount` decimal(15,2) NOT NULL,
  `converted_tax_amount` decimal(15,2) DEFAULT NULL,
  `converted_net_amount` decimal(15,2) DEFAULT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `net_amount` decimal(15,2) NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `source_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned DEFAULT NULL,
  `account_debit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_credit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('revenue','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_status` enum('pending','cleared','reconciled','void') COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_transaction_id` bigint unsigned DEFAULT NULL,
  `narration` text COLLATE utf8mb4_unicode_ci,
  `is_recurring` tinyint(1) NOT NULL,
  `fiscal_year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accounting_period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_adjusting_entry` tinyint(1) NOT NULL,
  `cost_center_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_transactions_ledger_transaction_number_unique` (`transaction_number`),
  KEY `customer_transactions_ledger_cust_payment_id_foreign` (`cust_payment_id`),
  CONSTRAINT `customer_transactions_ledger_cust_payment_id_foreign` FOREIGN KEY (`cust_payment_id`) REFERENCES `cust_payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_transactions_ledger`
--

LOCK TABLES `customer_transactions_ledger` WRITE;
/*!40000 ALTER TABLE `customer_transactions_ledger` DISABLE KEYS */;
INSERT INTO `customer_transactions_ledger` (`id`, `cust_payment_id`, `transaction_number`, `transaction_type`, `transaction_date`, `posted_date`, `amount`, `transaction_currency`, `base_currency`, `exchange_rate`, `converted_amount`, `converted_tax_amount`, `converted_net_amount`, `tax_amount`, `net_amount`, `customer_id`, `source_type`, `source_id`, `account_debit`, `account_credit`, `category`, `payment_method`, `bank_account`, `check_number`, `transaction_status`, `related_transaction_id`, `narration`, `is_recurring`, `fiscal_year`, `accounting_period`, `is_adjusting_entry`, `cost_center_id`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,NULL,'CINV-000001','invoice','2026-05-12','2026-05-12',2320000.00,'USD','KES',0.000000,0.00,0.00,0.00,320000.00,2000000.00,2,'cust_invoice',1,NULL,NULL,'revenue',NULL,NULL,NULL,'cleared',NULL,'Invoice CINV-000001 generated from order ORD-000001',0,'2026','202605',0,NULL,'2026-05-12 16:46:21','2026-05-12 16:46:21',2,2,0,NULL,NULL),(2,1,'CUSTPM-8319-7264','receipt','2026-05-12','2026-05-12',1500000.00,'USD','KES',128.450000,192675000.00,26575861.85,166099138.15,206896.55,1293103.45,2,'cust_invoice',1,NULL,'1','revenue','cash','Equity',NULL,'cleared',NULL,'Payment for invoice CINV-000001',0,'2026','202605',0,NULL,'2026-05-12 16:52:14','2026-05-12 16:52:14',2,2,0,NULL,NULL),(3,2,'CUSTPM-9067-1434','receipt','2026-05-25','2026-05-25',120000.00,'USD','KES',128.450000,15414000.00,2126068.43,13287931.57,16551.72,103448.28,2,'cust_invoice',1,NULL,'1','revenue','check','ABC Bank','0003','cleared',NULL,'PDC cleared: PDC created from invoice receipt (deferred).',0,'2026','202605',0,NULL,'2026-05-25 18:52:44','2026-05-25 18:52:44',1,1,0,NULL,NULL),(4,NULL,'CINV-000002','invoice','2026-06-30','2026-06-30',10000.00,'KES','KES',0.000000,0.00,0.00,0.00,0.00,10000.00,3,'cust_invoice',2,NULL,NULL,'revenue',NULL,NULL,NULL,'cleared',NULL,'Invoice CINV-000002 generated from order ORD-000002',0,'2026','202606',0,NULL,'2026-06-30 10:03:51','2026-06-30 10:03:51',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `customer_transactions_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kra_pin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_email_unique` (`email`),
  UNIQUE KEY `customers_phone_unique` (`phone`),
  UNIQUE KEY `customers_kra_pin_unique` (`kra_pin`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` (`id`, `name`, `description`, `email`, `phone`, `contact_person_name`, `logo`, `address`, `city`, `state`, `country`, `kra_pin`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'ABC Manufacturing Ltd','Leading manufacturer of industrial equipment and machinery in East Africa','info@abcmanufacturing.co.ke','+254722334455','Sifuna P. Sifuna','3311.png','789 Industrial Area, Lunga Lunga Road','Nairobi','Nairobi County','Kenya','P051112233K','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(2,'Highland Coffee Growers','Premium coffee growers and exporters based in the central highlands of Kenya','sales@highlandcoffee.co.ke','+254733445566','Mary Wanjala','3311.png','456 Coffee Estate, Kiambu Road','Kiambu','Kiambu County','Kenya','P052223344K','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(3,'Coast Logistics Services','Comprehensive shipping and logistics solutions serving the port city of Mombasa','info@coastlogistics.co.ke','+254711556677','Ahmed Hassan','1781804513.png','123 Port Road, Mombasa CBD','Mombasa','Mombasa County','Kenya','P053334455K','2026-05-26 05:13:46','2026-06-18 17:41:53',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` (`id`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (2,'Test department','shshshsh',NULL,NULL,1,1,0,NULL,NULL),(3,'new cost center','new cost center',NULL,NULL,NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `downloads`
--

DROP TABLE IF EXISTS `downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `downloads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `downloads`
--

LOCK TABLES `downloads` WRITE;
/*!40000 ALTER TABLE `downloads` DISABLE KEYS */;
INSERT INTO `downloads` (`id`, `name`, `path`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'CMPINV-000001','company-invoices/CMPINV-000001.pdf','2026-05-12 16:54:44','2026-05-12 16:54:44',2,2,0,NULL,NULL),(2,'ordersSummary-2026-05-12_report.pdf','reports/ordersSummary-2026-05-12_report.pdf','2026-05-12 16:59:09','2026-05-12 17:05:51',2,2,0,NULL,NULL),(3,'projectsSummary-2026-05-12_report.pdf','reports/projectsSummary-2026-05-12_report.pdf','2026-05-12 16:59:22','2026-05-12 16:59:22',2,2,0,NULL,NULL),(4,'customerHistory-2026-05-12_report.pdf','reports/customerHistory-2026-05-12_report.pdf','2026-05-12 16:59:32','2026-05-12 16:59:32',2,2,0,NULL,NULL),(5,'invoicePaymentsCustomer-2026-05-12_report.pdf','reports/invoicePaymentsCustomer-2026-05-12_report.pdf','2026-05-12 16:59:50','2026-05-12 16:59:50',2,2,0,NULL,NULL),(6,'invoicePaymentsCompany-2026-05-12_report.pdf','reports/invoicePaymentsCompany-2026-05-12_report.pdf','2026-05-12 17:00:00','2026-05-12 17:00:00',2,2,0,NULL,NULL),(7,'marginPerProject-2026-05-12_report.pdf','reports/marginPerProject-2026-05-12_report.pdf','2026-05-12 17:00:43','2026-05-12 17:00:43',2,2,0,NULL,NULL),(8,'invoicesReportCustomer-2026-05-12_report.pdf','reports/invoicesReportCustomer-2026-05-12_report.pdf','2026-05-12 17:00:56','2026-05-12 17:00:56',2,2,0,NULL,NULL),(9,'invoicesReportCompany-2026-05-12_report.pdf','reports/invoicesReportCompany-2026-05-12_report.pdf','2026-05-12 17:01:07','2026-05-12 17:01:07',2,2,0,NULL,NULL),(10,'revenueSnapshot-2026-05-12_report.pdf','reports/revenueSnapshot-2026-05-12_report.pdf','2026-05-12 17:01:19','2026-05-12 17:01:19',2,2,0,NULL,NULL),(11,'ordersSummary-2026-05-13_report.pdf','reports/ordersSummary-2026-05-13_report.pdf','2026-05-13 16:32:41','2026-05-13 16:35:49',2,2,0,NULL,NULL),(12,'projectsSummary-2026-05-13_report.pdf','reports/projectsSummary-2026-05-13_report.pdf','2026-05-13 16:40:03','2026-05-13 16:40:03',2,2,0,NULL,NULL),(13,'customerHistory-2026-05-13_report.pdf','reports/customerHistory-2026-05-13_report.pdf','2026-05-13 16:40:18','2026-05-13 16:41:09',2,2,0,NULL,NULL),(14,'projectsSummary-2026-05-25_report.pdf','reports/projectsSummary-2026-05-25_report.pdf','2026-05-25 12:14:50','2026-05-25 12:14:50',1,1,0,NULL,NULL),(15,'customerStatement-2026-05-25_report.pdf','reports/customerStatement-2026-05-25_report.pdf','2026-05-25 15:20:49','2026-05-25 18:53:29',1,1,0,NULL,NULL),(16,'companyStatement-2026-05-25_report.pdf','reports/companyStatement-2026-05-25_report.pdf','2026-05-25 16:19:47','2026-05-25 16:26:56',1,1,0,NULL,NULL),(17,'customerStatement-2026-05-26_report.pdf','reports/customerStatement-2026-05-26_report.pdf','2026-05-26 05:48:26','2026-05-26 05:50:25',1,1,0,NULL,NULL),(18,'marginPerProject-2026-05-26_report.pdf','reports/marginPerProject-2026-05-26_report.pdf','2026-05-26 05:52:02','2026-05-26 05:52:02',1,1,0,NULL,NULL),(19,'ordersSummary-2026-05-26_report.pdf','reports/ordersSummary-2026-05-26_report.pdf','2026-05-26 05:58:27','2026-05-26 06:06:44',1,1,0,NULL,NULL),(20,'projectsSummary-2026-05-26_report.pdf','reports/projectsSummary-2026-05-26_report.pdf','2026-05-26 06:33:12','2026-05-26 06:33:12',1,1,0,NULL,NULL),(21,'customerHistory-2026-05-26_report.pdf','reports/customerHistory-2026-05-26_report.pdf','2026-05-26 06:33:22','2026-05-26 06:33:22',1,1,0,NULL,NULL),(22,'invoicePaymentsCustomer-2026-05-26_report.pdf','reports/invoicePaymentsCustomer-2026-05-26_report.pdf','2026-05-26 06:34:06','2026-05-26 06:34:06',1,1,0,NULL,NULL),(23,'revenueSnapshot-2026-05-26_report.pdf','reports/revenueSnapshot-2026-05-26_report.pdf','2026-05-26 06:34:24','2026-05-26 06:38:21',1,1,0,NULL,NULL),(24,'QUO-000001','quotations/QUO-000001.pdf','2026-05-26 06:53:48','2026-05-26 06:53:48',1,1,0,NULL,NULL),(25,'ORD-000001','orders/ORD-000001.pdf','2026-05-26 06:54:03','2026-05-26 06:54:03',1,1,0,NULL,NULL),(26,'CINV-000001','cust-invoices/CINV-000001.pdf','2026-05-26 06:58:04','2026-05-26 06:58:04',1,1,0,NULL,NULL),(27,'CMPINV-000002','company-invoices/CMPINV-000002.pdf','2026-06-12 04:26:44','2026-06-12 04:26:44',1,1,0,NULL,NULL),(28,'expensePayments-2026-06-12_report.pdf','reports/expensePayments-2026-06-12_report.pdf','2026-06-12 08:42:31','2026-06-12 08:42:31',1,1,0,NULL,NULL),(29,'invoicesReportCompany-2026-07-06_report.pdf','reports/invoicesReportCompany-2026-07-06_report.pdf','2026-07-06 14:03:17','2026-07-06 14:19:45',1,1,0,NULL,NULL),(30,'invoicesReportCustomer-2026-07-06_report.pdf','reports/invoicesReportCustomer-2026-07-06_report.pdf','2026-07-06 14:16:26','2026-07-06 14:19:29',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `downloads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_roles`
--

DROP TABLE IF EXISTS `group_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_roles_group_id_foreign` (`group_id`),
  KEY `group_roles_role_id_foreign` (`role_id`),
  CONSTRAINT `group_roles_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `sys_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `group_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `sys_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=380 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_roles`
--

LOCK TABLES `group_roles` WRITE;
/*!40000 ALTER TABLE `group_roles` DISABLE KEYS */;
INSERT INTO `group_roles` (`id`, `group_id`, `role_id`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,NULL,NULL,NULL,NULL,0,NULL,NULL),(2,1,2,NULL,NULL,NULL,NULL,0,NULL,NULL),(3,1,3,NULL,NULL,NULL,NULL,0,NULL,NULL),(4,1,4,NULL,NULL,NULL,NULL,0,NULL,NULL),(5,1,5,NULL,NULL,NULL,NULL,0,NULL,NULL),(6,1,6,NULL,NULL,NULL,NULL,0,NULL,NULL),(7,1,7,NULL,NULL,NULL,NULL,0,NULL,NULL),(8,1,8,NULL,NULL,NULL,NULL,0,NULL,NULL),(9,1,9,NULL,NULL,NULL,NULL,0,NULL,NULL),(10,1,10,NULL,NULL,NULL,NULL,0,NULL,NULL),(11,1,11,NULL,NULL,NULL,NULL,0,NULL,NULL),(12,1,12,NULL,NULL,NULL,NULL,0,NULL,NULL),(13,1,13,NULL,NULL,NULL,NULL,0,NULL,NULL),(14,1,14,NULL,NULL,NULL,NULL,0,NULL,NULL),(15,1,15,NULL,NULL,NULL,NULL,0,NULL,NULL),(16,1,16,NULL,NULL,NULL,NULL,0,NULL,NULL),(17,1,17,NULL,NULL,NULL,NULL,0,NULL,NULL),(18,1,18,NULL,NULL,NULL,NULL,0,NULL,NULL),(19,1,19,NULL,NULL,NULL,NULL,0,NULL,NULL),(20,1,20,NULL,NULL,NULL,NULL,0,NULL,NULL),(21,1,21,NULL,NULL,NULL,NULL,0,NULL,NULL),(22,1,22,NULL,NULL,NULL,NULL,0,NULL,NULL),(23,1,23,NULL,NULL,NULL,NULL,0,NULL,NULL),(24,1,24,NULL,NULL,NULL,NULL,0,NULL,NULL),(25,1,25,NULL,NULL,NULL,NULL,0,NULL,NULL),(26,1,26,NULL,NULL,NULL,NULL,0,NULL,NULL),(27,1,27,NULL,NULL,NULL,NULL,0,NULL,NULL),(28,1,28,NULL,NULL,NULL,NULL,0,NULL,NULL),(29,1,29,NULL,NULL,NULL,NULL,0,NULL,NULL),(30,1,30,NULL,NULL,NULL,NULL,0,NULL,NULL),(31,1,31,NULL,NULL,NULL,NULL,0,NULL,NULL),(32,1,32,NULL,NULL,NULL,NULL,0,NULL,NULL),(33,1,33,NULL,NULL,NULL,NULL,0,NULL,NULL),(34,1,34,NULL,NULL,NULL,NULL,0,NULL,NULL),(35,1,35,NULL,NULL,NULL,NULL,0,NULL,NULL),(36,1,36,NULL,NULL,NULL,NULL,0,NULL,NULL),(37,1,37,NULL,NULL,NULL,NULL,0,NULL,NULL),(38,1,38,NULL,NULL,NULL,NULL,0,NULL,NULL),(39,1,39,NULL,NULL,NULL,NULL,0,NULL,NULL),(40,1,40,NULL,NULL,NULL,NULL,0,NULL,NULL),(41,1,41,NULL,NULL,NULL,NULL,0,NULL,NULL),(42,1,42,NULL,NULL,NULL,NULL,0,NULL,NULL),(43,1,43,NULL,NULL,NULL,NULL,0,NULL,NULL),(44,1,44,NULL,NULL,NULL,NULL,0,NULL,NULL),(45,1,45,NULL,NULL,NULL,NULL,0,NULL,NULL),(46,1,46,NULL,NULL,NULL,NULL,0,NULL,NULL),(47,1,47,NULL,NULL,NULL,NULL,0,NULL,NULL),(48,1,48,NULL,NULL,NULL,NULL,0,NULL,NULL),(49,1,49,NULL,NULL,NULL,NULL,0,NULL,NULL),(50,1,50,NULL,NULL,NULL,NULL,0,NULL,NULL),(51,1,51,NULL,NULL,NULL,NULL,0,NULL,NULL),(52,1,52,NULL,NULL,NULL,NULL,0,NULL,NULL),(53,1,53,NULL,NULL,NULL,NULL,0,NULL,NULL),(54,1,54,NULL,NULL,NULL,NULL,0,NULL,NULL),(55,1,55,NULL,NULL,NULL,NULL,0,NULL,NULL),(56,1,56,NULL,NULL,NULL,NULL,0,NULL,NULL),(57,1,57,NULL,NULL,NULL,NULL,0,NULL,NULL),(58,1,58,NULL,NULL,NULL,NULL,0,NULL,NULL),(59,1,59,NULL,NULL,NULL,NULL,0,NULL,NULL),(60,1,60,NULL,NULL,NULL,NULL,0,NULL,NULL),(61,1,61,NULL,NULL,NULL,NULL,0,NULL,NULL),(62,1,62,NULL,NULL,NULL,NULL,0,NULL,NULL),(63,1,63,NULL,NULL,NULL,NULL,0,NULL,NULL),(64,1,64,NULL,NULL,NULL,NULL,0,NULL,NULL),(65,1,65,NULL,NULL,NULL,NULL,0,NULL,NULL),(66,1,66,NULL,NULL,NULL,NULL,0,NULL,NULL),(67,1,67,NULL,NULL,NULL,NULL,0,NULL,NULL),(68,1,68,NULL,NULL,NULL,NULL,0,NULL,NULL),(69,1,69,NULL,NULL,NULL,NULL,0,NULL,NULL),(70,1,70,NULL,NULL,NULL,NULL,0,NULL,NULL),(71,1,71,NULL,NULL,NULL,NULL,0,NULL,NULL),(72,1,72,NULL,NULL,NULL,NULL,0,NULL,NULL),(73,1,73,NULL,NULL,NULL,NULL,0,NULL,NULL),(74,1,74,NULL,NULL,NULL,NULL,0,NULL,NULL),(75,1,75,NULL,NULL,NULL,NULL,0,NULL,NULL),(76,1,76,NULL,NULL,NULL,NULL,0,NULL,NULL),(77,1,77,NULL,NULL,NULL,NULL,0,NULL,NULL),(78,1,78,NULL,NULL,NULL,NULL,0,NULL,NULL),(79,1,79,NULL,NULL,NULL,NULL,0,NULL,NULL),(80,1,80,NULL,NULL,NULL,NULL,0,NULL,NULL),(81,1,81,NULL,NULL,NULL,NULL,0,NULL,NULL),(82,1,82,NULL,NULL,NULL,NULL,0,NULL,NULL),(83,1,83,NULL,NULL,NULL,NULL,0,NULL,NULL),(84,1,84,NULL,NULL,NULL,NULL,0,NULL,NULL),(85,1,85,NULL,NULL,NULL,NULL,0,NULL,NULL),(86,1,86,NULL,NULL,NULL,NULL,0,NULL,NULL),(87,1,87,NULL,NULL,NULL,NULL,0,NULL,NULL),(88,1,88,NULL,NULL,NULL,NULL,0,NULL,NULL),(89,1,89,NULL,NULL,NULL,NULL,0,NULL,NULL),(90,1,90,NULL,NULL,NULL,NULL,0,NULL,NULL),(91,1,91,NULL,NULL,NULL,NULL,0,NULL,NULL),(92,1,92,NULL,NULL,NULL,NULL,0,NULL,NULL),(93,1,93,NULL,NULL,NULL,NULL,0,NULL,NULL),(94,1,94,NULL,NULL,NULL,NULL,0,NULL,NULL),(95,1,95,NULL,NULL,NULL,NULL,0,NULL,NULL),(96,1,96,NULL,NULL,NULL,NULL,0,NULL,NULL),(97,1,97,NULL,NULL,NULL,NULL,0,NULL,NULL),(98,1,98,NULL,NULL,NULL,NULL,0,NULL,NULL),(99,1,99,NULL,NULL,NULL,NULL,0,NULL,NULL),(100,1,100,NULL,NULL,NULL,NULL,0,NULL,NULL),(101,1,101,NULL,NULL,NULL,NULL,0,NULL,NULL),(102,1,102,NULL,NULL,NULL,NULL,0,NULL,NULL),(103,1,103,NULL,NULL,NULL,NULL,0,NULL,NULL),(104,1,104,NULL,NULL,NULL,NULL,0,NULL,NULL),(105,1,105,NULL,NULL,NULL,NULL,0,NULL,NULL),(106,1,106,NULL,NULL,NULL,NULL,0,NULL,NULL),(107,1,107,NULL,NULL,NULL,NULL,0,NULL,NULL),(108,1,108,NULL,NULL,NULL,NULL,0,NULL,NULL),(109,1,109,NULL,NULL,NULL,NULL,0,NULL,NULL),(110,1,110,NULL,NULL,NULL,NULL,0,NULL,NULL),(111,1,111,NULL,NULL,NULL,NULL,0,NULL,NULL),(112,1,112,NULL,NULL,NULL,NULL,0,NULL,NULL),(113,1,113,NULL,NULL,NULL,NULL,0,NULL,NULL),(114,1,114,NULL,NULL,NULL,NULL,0,NULL,NULL),(115,1,115,NULL,NULL,NULL,NULL,0,NULL,NULL),(116,1,116,NULL,NULL,NULL,NULL,0,NULL,NULL),(117,1,117,NULL,NULL,NULL,NULL,0,NULL,NULL),(118,1,118,NULL,NULL,NULL,NULL,0,NULL,NULL),(119,1,119,NULL,NULL,NULL,NULL,0,NULL,NULL),(120,1,120,NULL,NULL,NULL,NULL,0,NULL,NULL),(121,1,121,NULL,NULL,NULL,NULL,0,NULL,NULL),(122,1,122,NULL,NULL,NULL,NULL,0,NULL,NULL),(123,1,123,NULL,NULL,NULL,NULL,0,NULL,NULL),(124,1,124,NULL,NULL,NULL,NULL,0,NULL,NULL),(125,1,125,NULL,NULL,NULL,NULL,0,NULL,NULL),(126,1,126,NULL,NULL,NULL,NULL,0,NULL,NULL),(127,1,127,NULL,NULL,NULL,NULL,0,NULL,NULL),(128,1,128,NULL,NULL,NULL,NULL,0,NULL,NULL),(129,1,129,NULL,NULL,NULL,NULL,0,NULL,NULL),(130,1,130,NULL,NULL,NULL,NULL,0,NULL,NULL),(131,1,131,NULL,NULL,NULL,NULL,0,NULL,NULL),(132,1,132,NULL,NULL,NULL,NULL,0,NULL,NULL),(133,1,133,NULL,NULL,NULL,NULL,0,NULL,NULL),(134,1,134,NULL,NULL,NULL,NULL,0,NULL,NULL),(135,1,135,NULL,NULL,NULL,NULL,0,NULL,NULL),(136,1,136,NULL,NULL,NULL,NULL,0,NULL,NULL),(137,1,137,NULL,NULL,NULL,NULL,0,NULL,NULL),(138,1,138,NULL,NULL,NULL,NULL,0,NULL,NULL),(139,1,139,NULL,NULL,NULL,NULL,0,NULL,NULL),(140,1,140,NULL,NULL,NULL,NULL,0,NULL,NULL),(141,1,141,NULL,NULL,NULL,NULL,0,NULL,NULL),(142,1,142,NULL,NULL,NULL,NULL,0,NULL,NULL),(143,1,143,NULL,NULL,NULL,NULL,0,NULL,NULL),(144,1,144,NULL,NULL,NULL,NULL,0,NULL,NULL),(145,1,145,NULL,NULL,NULL,NULL,0,NULL,NULL),(146,1,146,NULL,NULL,NULL,NULL,0,NULL,NULL),(147,1,147,NULL,'2026-06-12 09:22:37',NULL,NULL,1,'2026-06-12 09:22:37',1),(148,1,148,NULL,NULL,NULL,NULL,0,NULL,NULL),(149,1,149,NULL,NULL,NULL,NULL,0,NULL,NULL),(150,1,150,NULL,NULL,NULL,NULL,0,NULL,NULL),(151,1,151,NULL,NULL,NULL,NULL,0,NULL,NULL),(152,1,152,NULL,NULL,NULL,NULL,0,NULL,NULL),(153,1,153,NULL,NULL,NULL,NULL,0,NULL,NULL),(154,1,154,NULL,NULL,NULL,NULL,0,NULL,NULL),(155,1,155,NULL,NULL,NULL,NULL,0,NULL,NULL),(156,1,156,NULL,NULL,NULL,NULL,0,NULL,NULL),(157,1,157,NULL,NULL,NULL,NULL,0,NULL,NULL),(158,1,158,NULL,NULL,NULL,NULL,0,NULL,NULL),(159,1,159,NULL,NULL,NULL,NULL,0,NULL,NULL),(160,1,160,NULL,NULL,NULL,NULL,0,NULL,NULL),(161,1,161,NULL,NULL,NULL,NULL,0,NULL,NULL),(162,1,162,NULL,NULL,NULL,NULL,0,NULL,NULL),(163,1,163,NULL,NULL,NULL,NULL,0,NULL,NULL),(164,1,164,NULL,NULL,NULL,NULL,0,NULL,NULL),(165,1,165,NULL,NULL,NULL,NULL,0,NULL,NULL),(166,1,166,NULL,NULL,NULL,NULL,0,NULL,NULL),(167,1,167,NULL,NULL,NULL,NULL,0,NULL,NULL),(168,1,168,NULL,NULL,NULL,NULL,0,NULL,NULL),(169,1,169,NULL,NULL,NULL,NULL,0,NULL,NULL),(170,1,170,NULL,NULL,NULL,NULL,0,NULL,NULL),(171,1,171,NULL,NULL,NULL,NULL,0,NULL,NULL),(172,1,172,NULL,NULL,NULL,NULL,0,NULL,NULL),(173,1,173,NULL,NULL,NULL,NULL,0,NULL,NULL),(174,1,174,NULL,NULL,NULL,NULL,0,NULL,NULL),(175,1,175,NULL,NULL,NULL,NULL,0,NULL,NULL),(176,1,176,NULL,NULL,NULL,NULL,0,NULL,NULL),(177,1,177,NULL,NULL,NULL,NULL,0,NULL,NULL),(178,1,178,NULL,NULL,NULL,NULL,0,NULL,NULL),(179,1,179,NULL,NULL,NULL,NULL,0,NULL,NULL),(180,1,180,NULL,NULL,NULL,NULL,0,NULL,NULL),(181,1,181,NULL,NULL,NULL,NULL,0,NULL,NULL),(182,1,182,NULL,NULL,NULL,NULL,0,NULL,NULL),(183,1,183,NULL,NULL,NULL,NULL,0,NULL,NULL),(184,1,184,NULL,NULL,NULL,NULL,0,NULL,NULL),(185,1,185,NULL,NULL,NULL,NULL,0,NULL,NULL),(186,1,186,NULL,NULL,NULL,NULL,0,NULL,NULL),(187,1,187,NULL,NULL,NULL,NULL,0,NULL,NULL),(188,1,188,NULL,NULL,NULL,NULL,0,NULL,NULL),(189,1,189,NULL,NULL,NULL,NULL,0,NULL,NULL),(190,1,190,NULL,NULL,NULL,NULL,0,NULL,NULL),(191,1,191,NULL,NULL,NULL,NULL,0,NULL,NULL),(192,1,192,NULL,NULL,NULL,NULL,0,NULL,NULL),(193,1,193,NULL,NULL,NULL,NULL,0,NULL,NULL),(194,1,194,NULL,NULL,NULL,NULL,0,NULL,NULL),(195,1,195,NULL,NULL,NULL,NULL,0,NULL,NULL),(196,1,196,NULL,NULL,NULL,NULL,0,NULL,NULL),(197,1,197,NULL,NULL,NULL,NULL,0,NULL,NULL),(198,1,198,NULL,NULL,NULL,NULL,0,NULL,NULL),(199,1,199,NULL,NULL,NULL,NULL,0,NULL,NULL),(200,1,200,NULL,NULL,NULL,NULL,0,NULL,NULL),(201,1,201,NULL,NULL,NULL,NULL,0,NULL,NULL),(202,1,202,NULL,NULL,NULL,NULL,0,NULL,NULL),(203,1,203,NULL,NULL,NULL,NULL,0,NULL,NULL),(204,1,204,NULL,NULL,NULL,NULL,0,NULL,NULL),(205,1,205,NULL,NULL,NULL,NULL,0,NULL,NULL),(206,1,206,NULL,NULL,NULL,NULL,0,NULL,NULL),(207,1,207,NULL,NULL,NULL,NULL,0,NULL,NULL),(208,1,208,NULL,NULL,NULL,NULL,0,NULL,NULL),(209,1,209,NULL,NULL,NULL,NULL,0,NULL,NULL),(210,1,210,NULL,NULL,NULL,NULL,0,NULL,NULL),(211,1,211,NULL,NULL,NULL,NULL,0,NULL,NULL),(212,1,212,NULL,NULL,NULL,NULL,0,NULL,NULL),(213,1,213,NULL,NULL,NULL,NULL,0,NULL,NULL),(214,1,214,NULL,NULL,NULL,NULL,0,NULL,NULL),(215,1,215,NULL,NULL,NULL,NULL,0,NULL,NULL),(216,1,216,NULL,NULL,NULL,NULL,0,NULL,NULL),(217,1,217,NULL,NULL,NULL,NULL,0,NULL,NULL),(218,1,218,NULL,NULL,NULL,NULL,0,NULL,NULL),(219,1,219,NULL,NULL,NULL,NULL,0,NULL,NULL),(220,1,220,NULL,NULL,NULL,NULL,0,NULL,NULL),(221,2,1,NULL,NULL,NULL,NULL,0,NULL,NULL),(222,2,2,NULL,NULL,NULL,NULL,0,NULL,NULL),(223,2,3,NULL,NULL,NULL,NULL,0,NULL,NULL),(224,2,4,NULL,NULL,NULL,NULL,0,NULL,NULL),(225,2,5,NULL,NULL,NULL,NULL,0,NULL,NULL),(226,2,6,NULL,NULL,NULL,NULL,0,NULL,NULL),(227,2,7,NULL,NULL,NULL,NULL,0,NULL,NULL),(228,2,8,NULL,NULL,NULL,NULL,0,NULL,NULL),(229,2,17,NULL,NULL,NULL,NULL,0,NULL,NULL),(230,2,18,NULL,NULL,NULL,NULL,0,NULL,NULL),(231,2,19,NULL,NULL,NULL,NULL,0,NULL,NULL),(232,2,20,NULL,NULL,NULL,NULL,0,NULL,NULL),(233,2,21,NULL,NULL,NULL,NULL,0,NULL,NULL),(234,2,22,NULL,NULL,NULL,NULL,0,NULL,NULL),(235,2,23,NULL,NULL,NULL,NULL,0,NULL,NULL),(236,2,24,NULL,NULL,NULL,NULL,0,NULL,NULL),(237,2,25,NULL,NULL,NULL,NULL,0,NULL,NULL),(238,2,26,NULL,NULL,NULL,NULL,0,NULL,NULL),(239,2,27,NULL,NULL,NULL,NULL,0,NULL,NULL),(240,2,28,NULL,NULL,NULL,NULL,0,NULL,NULL),(241,2,29,NULL,NULL,NULL,NULL,0,NULL,NULL),(242,2,30,NULL,NULL,NULL,NULL,0,NULL,NULL),(243,2,31,NULL,NULL,NULL,NULL,0,NULL,NULL),(244,2,32,NULL,NULL,NULL,NULL,0,NULL,NULL),(245,2,41,NULL,NULL,NULL,NULL,0,NULL,NULL),(246,2,42,NULL,NULL,NULL,NULL,0,NULL,NULL),(247,2,43,NULL,NULL,NULL,NULL,0,NULL,NULL),(248,2,44,NULL,NULL,NULL,NULL,0,NULL,NULL),(249,2,45,NULL,NULL,NULL,NULL,0,NULL,NULL),(250,2,46,NULL,NULL,NULL,NULL,0,NULL,NULL),(251,2,47,NULL,NULL,NULL,NULL,0,NULL,NULL),(252,2,48,NULL,NULL,NULL,NULL,0,NULL,NULL),(253,2,49,NULL,NULL,NULL,NULL,0,NULL,NULL),(254,2,50,NULL,NULL,NULL,NULL,0,NULL,NULL),(255,2,51,NULL,NULL,NULL,NULL,0,NULL,NULL),(256,2,52,NULL,NULL,NULL,NULL,0,NULL,NULL),(257,2,53,NULL,NULL,NULL,NULL,0,NULL,NULL),(258,2,54,NULL,NULL,NULL,NULL,0,NULL,NULL),(259,2,55,NULL,NULL,NULL,NULL,0,NULL,NULL),(260,2,56,NULL,NULL,NULL,NULL,0,NULL,NULL),(261,2,57,NULL,NULL,NULL,NULL,0,NULL,NULL),(262,2,58,NULL,NULL,NULL,NULL,0,NULL,NULL),(263,2,59,NULL,NULL,NULL,NULL,0,NULL,NULL),(264,2,60,NULL,NULL,NULL,NULL,0,NULL,NULL),(265,2,61,NULL,NULL,NULL,NULL,0,NULL,NULL),(266,2,62,NULL,NULL,NULL,NULL,0,NULL,NULL),(267,2,63,NULL,NULL,NULL,NULL,0,NULL,NULL),(268,2,64,NULL,NULL,NULL,NULL,0,NULL,NULL),(269,2,65,NULL,NULL,NULL,NULL,0,NULL,NULL),(270,2,66,NULL,NULL,NULL,NULL,0,NULL,NULL),(271,2,67,NULL,NULL,NULL,NULL,0,NULL,NULL),(272,2,68,NULL,NULL,NULL,NULL,0,NULL,NULL),(273,2,69,NULL,NULL,NULL,NULL,0,NULL,NULL),(274,2,70,NULL,NULL,NULL,NULL,0,NULL,NULL),(275,2,71,NULL,NULL,NULL,NULL,0,NULL,NULL),(276,2,72,NULL,NULL,NULL,NULL,0,NULL,NULL),(277,2,85,NULL,NULL,NULL,NULL,0,NULL,NULL),(278,2,86,NULL,NULL,NULL,NULL,0,NULL,NULL),(279,2,87,NULL,NULL,NULL,NULL,0,NULL,NULL),(280,2,88,NULL,NULL,NULL,NULL,0,NULL,NULL),(281,2,89,NULL,NULL,NULL,NULL,0,NULL,NULL),(282,2,90,NULL,NULL,NULL,NULL,0,NULL,NULL),(283,2,91,NULL,NULL,NULL,NULL,0,NULL,NULL),(284,2,92,NULL,NULL,NULL,NULL,0,NULL,NULL),(285,2,93,NULL,NULL,NULL,NULL,0,NULL,NULL),(286,2,94,NULL,NULL,NULL,NULL,0,NULL,NULL),(287,2,95,NULL,NULL,NULL,NULL,0,NULL,NULL),(288,2,96,NULL,NULL,NULL,NULL,0,NULL,NULL),(289,2,97,NULL,NULL,NULL,NULL,0,NULL,NULL),(290,2,98,NULL,NULL,NULL,NULL,0,NULL,NULL),(291,2,99,NULL,NULL,NULL,NULL,0,NULL,NULL),(292,2,100,NULL,NULL,NULL,NULL,0,NULL,NULL),(293,2,101,NULL,NULL,NULL,NULL,0,NULL,NULL),(294,2,102,NULL,NULL,NULL,NULL,0,NULL,NULL),(295,2,103,NULL,NULL,NULL,NULL,0,NULL,NULL),(296,2,104,NULL,NULL,NULL,NULL,0,NULL,NULL),(297,2,105,NULL,NULL,NULL,NULL,0,NULL,NULL),(298,2,106,NULL,NULL,NULL,NULL,0,NULL,NULL),(299,2,107,NULL,NULL,NULL,NULL,0,NULL,NULL),(300,2,108,NULL,NULL,NULL,NULL,0,NULL,NULL),(301,2,109,NULL,NULL,NULL,NULL,0,NULL,NULL),(302,2,110,NULL,NULL,NULL,NULL,0,NULL,NULL),(303,2,111,NULL,NULL,NULL,NULL,0,NULL,NULL),(304,2,112,NULL,NULL,NULL,NULL,0,NULL,NULL),(305,2,113,NULL,NULL,NULL,NULL,0,NULL,NULL),(306,2,114,NULL,NULL,NULL,NULL,0,NULL,NULL),(307,2,115,NULL,NULL,NULL,NULL,0,NULL,NULL),(308,2,116,NULL,NULL,NULL,NULL,0,NULL,NULL),(309,2,137,NULL,NULL,NULL,NULL,0,NULL,NULL),(310,2,138,NULL,NULL,NULL,NULL,0,NULL,NULL),(311,2,139,NULL,NULL,NULL,NULL,0,NULL,NULL),(312,2,140,NULL,NULL,NULL,NULL,0,NULL,NULL),(313,2,141,NULL,NULL,NULL,NULL,0,NULL,NULL),(314,2,142,NULL,NULL,NULL,NULL,0,NULL,NULL),(315,2,143,NULL,NULL,NULL,NULL,0,NULL,NULL),(316,2,144,NULL,NULL,NULL,NULL,0,NULL,NULL),(317,2,145,NULL,NULL,NULL,NULL,0,NULL,NULL),(318,2,146,NULL,NULL,NULL,NULL,0,NULL,NULL),(319,2,147,NULL,NULL,NULL,NULL,0,NULL,NULL),(320,2,148,NULL,NULL,NULL,NULL,0,NULL,NULL),(321,2,149,NULL,NULL,NULL,NULL,0,NULL,NULL),(322,2,150,NULL,NULL,NULL,NULL,0,NULL,NULL),(323,2,151,NULL,NULL,NULL,NULL,0,NULL,NULL),(324,2,152,NULL,NULL,NULL,NULL,0,NULL,NULL),(325,2,153,NULL,NULL,NULL,NULL,0,NULL,NULL),(326,2,154,NULL,NULL,NULL,NULL,0,NULL,NULL),(327,2,155,NULL,NULL,NULL,NULL,0,NULL,NULL),(328,2,156,NULL,NULL,NULL,NULL,0,NULL,NULL),(329,2,201,NULL,NULL,NULL,NULL,0,NULL,NULL),(330,2,202,NULL,NULL,NULL,NULL,0,NULL,NULL),(331,2,203,NULL,NULL,NULL,NULL,0,NULL,NULL),(332,2,204,NULL,NULL,NULL,NULL,0,NULL,NULL),(333,2,197,NULL,NULL,NULL,NULL,0,NULL,NULL),(334,2,198,NULL,NULL,NULL,NULL,0,NULL,NULL),(335,2,199,NULL,NULL,NULL,NULL,0,NULL,NULL),(336,2,200,NULL,NULL,NULL,NULL,0,NULL,NULL),(337,2,84,NULL,NULL,NULL,NULL,0,NULL,NULL),(338,3,9,NULL,NULL,NULL,NULL,0,NULL,NULL),(339,3,10,NULL,NULL,NULL,NULL,0,NULL,NULL),(340,3,11,NULL,NULL,NULL,NULL,0,NULL,NULL),(341,3,12,NULL,NULL,NULL,NULL,0,NULL,NULL),(342,3,13,NULL,NULL,NULL,NULL,0,NULL,NULL),(343,3,14,NULL,NULL,NULL,NULL,0,NULL,NULL),(344,3,15,NULL,NULL,NULL,NULL,0,NULL,NULL),(345,3,16,NULL,NULL,NULL,NULL,0,NULL,NULL),(346,3,73,NULL,NULL,NULL,NULL,0,NULL,NULL),(347,3,74,NULL,NULL,NULL,NULL,0,NULL,NULL),(348,3,75,NULL,NULL,NULL,NULL,0,NULL,NULL),(349,3,76,NULL,NULL,NULL,NULL,0,NULL,NULL),(350,3,157,NULL,NULL,NULL,NULL,0,NULL,NULL),(351,3,158,NULL,NULL,NULL,NULL,0,NULL,NULL),(352,3,159,NULL,NULL,NULL,NULL,0,NULL,NULL),(353,3,160,NULL,NULL,NULL,NULL,0,NULL,NULL),(354,3,161,NULL,NULL,NULL,NULL,0,NULL,NULL),(355,3,162,NULL,NULL,NULL,NULL,0,NULL,NULL),(356,3,163,NULL,NULL,NULL,NULL,0,NULL,NULL),(357,3,164,NULL,NULL,NULL,NULL,0,NULL,NULL),(358,3,165,NULL,NULL,NULL,NULL,0,NULL,NULL),(359,3,166,NULL,NULL,NULL,NULL,0,NULL,NULL),(360,3,167,NULL,NULL,NULL,NULL,0,NULL,NULL),(361,3,168,NULL,NULL,NULL,NULL,0,NULL,NULL),(362,3,169,NULL,NULL,NULL,NULL,0,NULL,NULL),(363,3,170,NULL,NULL,NULL,NULL,0,NULL,NULL),(364,3,171,NULL,NULL,NULL,NULL,0,NULL,NULL),(365,3,172,NULL,NULL,NULL,NULL,0,NULL,NULL),(366,4,117,NULL,NULL,NULL,NULL,0,NULL,NULL),(367,4,118,NULL,NULL,NULL,NULL,0,NULL,NULL),(368,4,119,NULL,NULL,NULL,NULL,0,NULL,NULL),(369,4,120,NULL,NULL,NULL,NULL,0,NULL,NULL),(370,1,221,NULL,NULL,NULL,NULL,0,NULL,NULL),(371,1,222,NULL,NULL,NULL,NULL,0,NULL,NULL),(372,1,223,NULL,NULL,NULL,NULL,0,NULL,NULL),(373,1,224,NULL,NULL,NULL,NULL,0,NULL,NULL),(374,1,225,NULL,NULL,NULL,NULL,0,NULL,NULL),(375,1,226,NULL,NULL,NULL,NULL,0,NULL,NULL),(376,1,227,NULL,NULL,NULL,NULL,0,NULL,NULL),(377,1,228,NULL,NULL,NULL,NULL,0,NULL,NULL),(378,1,147,'2026-06-12 10:48:55','2026-06-12 10:49:26',NULL,1,1,'2026-06-12 10:49:26',1),(379,1,147,'2026-06-30 09:31:08','2026-06-30 09:31:08',NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `group_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_languages_name` (`name`),
  UNIQUE KEY `ux_languages_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` (`id`, `code`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'EN','English','English','2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(4,'English','EN','English','2026-05-24 06:20:14','2026-05-24 06:20:14',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'2026_02_12_042703_create_sessions_table',1),(2,'2026_02_13_065536_create_users_table',1),(3,'2026_02_13_065734_create_sys_groups_table',1),(4,'2026_02_13_065918_create_group_roles_table',1),(5,'2026_02_13_070115_create_user_groups_table',1),(6,'2026_02_13_070542_create_companies_table',1),(7,'2026_02_13_070715_create_company_banks_table',1),(8,'2026_02_13_070821_create_customers_table',1),(9,'2026_02_13_071610_create_projects_table',1),(10,'2026_02_13_071748_create_project_phases_table',1),(11,'2026_02_13_071854_create_project_categories_table',1),(12,'2026_02_13_074421_create_quotations_table',1),(13,'2026_02_13_074602_create_quote_lineitems_table',1),(14,'2026_02_13_074651_create_documents_table',1),(15,'2026_02_13_075618_create_orders_table',1),(16,'2026_02_13_075728_create_order_items_table',1),(17,'2026_02_13_075831_create_order_documents_table',1),(18,'2026_02_13_080150_create_order_tax_items_table',1),(19,'2026_02_13_081428_create_cust_invoices_table',1),(20,'2026_02_13_081611_create_cust_invoice_items_table',1),(21,'2026_02_13_081758_create_cust_invoice_documents_table',1),(22,'2026_02_13_081959_create_cust_invoice_tax_items_table',1),(23,'2026_02_13_082116_create_cust_credit_notes_table',1),(24,'2026_02_13_083107_create_cust_credit_note_items_table',1),(25,'2026_02_13_083241_create_cust_credit_note_tax_items_table',1),(26,'2026_02_13_083354_create_cust_payments_table',1),(27,'2026_02_13_083445_create_cust_payment_allocations_table',1),(28,'2026_02_13_083539_create_transactions_table',1),(29,'2026_02_13_084805_create_company_projects_table',1),(30,'2026_02_13_085006_create_projetc_progress_updates_table',1),(31,'2026_02_13_085119_create_company_invoices_table',1),(32,'2026_02_13_085210_create_company_invoice_items_table',1),(33,'2026_02_13_085254_create_company_invoice_documents_table',1),(34,'2026_02_13_085351_create_company_invoice_tax_items_table',1),(35,'2026_02_13_085443_create_company_credit_notes_table',1),(36,'2026_02_13_093916_create_company_credit_note_tax_items_table',1),(37,'2026_02_13_103914_create_departments_table',1),(38,'2026_02_13_104117_create_sys_configs_table',1),(39,'2026_02_13_104205_create_taxes_table',1),(40,'2026_02_13_104255_create_currencies_table',1),(41,'2026_02_13_104352_create_languages_table',1),(42,'2026_02_13_105538_create_account_types_table',1),(43,'2026_02_13_110002_create_accounts_table',1),(44,'2026_02_13_110110_create_payment_methods_table',1),(45,'2026_02_13_110201_create_downloads_table',1),(46,'2026_02_13_110239_create_countries_table',1),(47,'2026_02_18_000000_create_account_groups_table',1),(48,'2026_02_18_000002_add_unique_to_name_code_columns',1),(49,'2026_02_18_104197_create_company_payments_table',1),(50,'2026_02_18_104198_create_sys_roles_table',1),(51,'2026_02_18_104199_create_company_credit_note_items_table',1),(52,'2026_02_18_104200_add_foreign_keys_to_all_tables_table',1),(53,'2026_02_18_112623_create_cache_table',1),(54,'2026_02_18_135511_create_personal_access_tokens_table',1),(55,'2026_02_20_000000_create_password_resets_table',1),(56,'2026_02_20_000001_create_password_reset_tokens_table',1),(57,'2026_02_24_000000_change_status_column_to_enum_in_projects_table',1),(58,'2026_02_24_000000_make_columns_nullable_in_project_phases_table',1),(59,'2026_02_24_120000_add_unique_constraint_to_email_on_users_table',1),(60,'2026_02_25_000000_modify_project_progress_updates_table',1),(61,'2026_02_25_000001_add_unique_key_on_project_id_phase_id_to_company_projects_table',1),(62,'2026_02_25_000200_add_quantity_to_quote_line_items_table',1),(63,'2026_02_25_000201_add_total_to_quote_line_items_table',1),(64,'2026_02_25_000300_add_quantity_and_total_to_order_items_table',1),(65,'2026_02_25_000301_add_quantity_and_total_to_cust_invoice_items_table',1),(66,'2026_02_25_000400_add_unique_project_id_to_quotations_table',1),(67,'2026_02_25_create_quote_approvals_table',1),(68,'2026_02_26_000001_add_value_and_amount_to_tax_items_tables',1),(69,'2026_02_27_000001_add_tax_id_to_tax_items_tables',1),(70,'2026_02_27_000002_remove_tax_percentage_columns',1),(71,'2026_02_27_000003_remove_tax_percentage_from_quotations_table',1),(72,'2026_02_27_080300_create_quotation_tax_items_table',1),(73,'2026_02_28_100000_create_company_transactions_ledger_table',1),(74,'2026_02_28_100010_create_customer_transactions_ledger_table',1),(75,'2026_02_28_100020_add_soft_delete_fields_to_model_tables',1),(76,'2026_02_28_110000_add_transaction_number_to_payments',1),(77,'2026_02_28_110010_add_payment_foreign_keys_to_transactions_ledgers',1),(78,'2026_02_28_110020_drop_transaction_id_and_index_transaction_number_on_payments',1),(79,'2026_02_28_110030_drop_transaction_id_from_company_transactions_ledger',1),(80,'2026_02_28_120000_add_tax_and_net_amount_to_payments',1),(81,'2026_02_28_120000_change_transaction_type_enum_on_transactions_table',1),(82,'2026_02_28_130000_add_currency_and_forex_rate',1),(83,'2026_02_28_140000_seed_initial_forex_rates',1),(84,'2026_02_28_150000_switch_accounts_to_currency_code',1),(85,'2026_02_28_160000_add_transaction_currency_and_converted_tax_net_to_ledgers',1),(86,'2026_02_28_170100_add_transaction_currency_and_converted_tax_net_to_transactions_table',1),(87,'2026_03_01_101000_create_project_source_origin_table',1),(88,'2026_03_01_101100_create_project_location_table',1),(89,'2026_03_01_101200_add_source_origin_and_location_to_projects_table',1),(90,'2026_03_01_201000_rename_project_source_origin_and_location_tables_to_plural',1),(91,'2026_03_01_202500_add_roles_for_ledgers_and_project_meta',1),(92,'2026_03_01_203000_add_roles_for_cust_payment',1),(93,'2026_03_02_000001_add_item_amount_to_company_invoice_tax_items_table',1),(94,'2026_03_02_000002_make_tax_id_not_nullable_on_company_invoice_tax_items_table',1),(95,'2026_03_03_000000_drop_transaction_fk_from_company_payments_table',1),(96,'2026_03_03_074817_add_transaction_id_to_cust_payments_table',1),(97,'2026_03_04_100000_detach_quotations_from_projects',1),(98,'2026_03_04_100010_detach_quote_line_items_from_project_phases',1),(99,'2026_03_04_100020_detach_order_items_from_project_phases',1),(100,'2026_03_04_100030_remove_quote_item_id_from_project_phases',1),(101,'2026_03_04_100040_make_orders_project_id_nullable',1),(102,'2026_03_04_100050_make_project_category_id_nullable_in_projects_table',1),(103,'2026_03_04_110000_update_quote_line_items_for_inline_taxes',1),(104,'2026_03_04_110010_drop_quotation_tax_items_table',1),(105,'2026_03_04_110020_update_order_items_for_inline_taxes',1),(106,'2026_03_04_110030_drop_order_tax_items_table',1),(107,'2026_03_04_111600_add_columns_to_taxes_table',1),(108,'2026_03_04_120000_update_cust_invoice_items_for_inline_taxes',1),(109,'2026_03_04_120010_update_company_invoice_items_for_inline_taxes',1),(110,'2026_03_04_120020_drop_cust_invoice_tax_items_table',1),(111,'2026_03_04_120030_drop_company_invoice_tax_items_table',1),(112,'2026_03_04_120040_update_cust_credit_note_items_for_inline_taxes',1),(113,'2026_03_04_120050_update_company_credit_note_items_for_inline_taxes',1),(114,'2026_03_04_120060_drop_cust_credit_note_tax_items_table',1),(115,'2026_03_04_120070_drop_company_credit_note_tax_items_table',1),(116,'2026_03_04_130000_drop_project_phase_from_cust_invoice_items_table',1),(117,'2026_03_04_140000_add_order_id_to_projects_table',1),(118,'2026_03_06_000001_add_transaction_id_to_company_payments_table',1),(119,'2026_03_07_000000_make_swiftcode_nullable_on_company_banks_table',1),(120,'2026_03_09_120500_add_quantity_and_total_to_company_invoice_items',1),(121,'2026_03_09_130000_add_job_reference_id_to_quotations_and_orders',1),(122,'2026_03_09_131500_add_unique_index_to_job_reference_id_on_quotations_and_orders',1),(123,'2026_03_09_132000_update_job_reference_id_unique_indexes_to_respect_soft_deletes',1),(124,'2026_03_10_000001_add_credit_note_number_to_company_credit_notes_table',1),(125,'2026_03_10_000300_add_quantity_and_total_to_credit_note_items_table',1),(126,'2026_03_10_120000_add_direction_and_type_to_payments_and_ledgers',1),(127,'2026_03_11_120000_create_office_expenses_table',1),(128,'2026_03_11_121000_add_office_expense_roles',1),(129,'2026_03_11_122000_create_office_expense_categories_table',1),(130,'2026_03_11_123000_update_office_expenses_for_category_and_cost_center',1),(131,'2026_03_11_124000_add_office_expense_category_roles',1),(132,'2026_03_11_125000_add_soft_deletes_to_office_expenses',1),(133,'2026_03_11_125100_add_soft_deletes_to_office_expense_categories',1),(134,'2026_03_11_130000_create_office_expense_payments_table',1),(135,'2026_03_11_140000_add_status_to_office_expenses_table',1),(136,'2026_03_11_150000_add_office_expense_payment_roles',1),(137,'2026_03_11_170000_add_is_deleted_to_office_expense_tables',1),(138,'2026_03_12_000001_add_is_billed_to_project_phases_table',1),(139,'2026_03_12_000001_add_job_reference_id_to_cust_invoices_and_projects',1),(140,'2026_03_13_000001_create_payment_receiving_methods_table',1),(141,'2026_03_13_100000_add_payment_receiving_method_id_to_cust_invoices_table',1),(142,'2026_03_13_120000_add_payment_receiving_method_roles',1),(143,'2026_03_31_000000_add_unique_constraints_to_companies_and_customers_tables',1),(144,'2026_04_01_120000_add_invoice_to_transaction_type_on_ledgers',1),(145,'2026_04_01_120001_add_read_only_to_sys_configs',1),(146,'2026_04_01_120002_add_forex_and_project_currency_to_company_payments_table',1),(147,'2026_04_27_000001_add_credit_note_number_to_cust_credit_notes_table',1),(150,'2026_05_24_000001_create_pdc_received_customers_table',2),(151,'2026_05_24_000002_create_pdc_issued_companies_table',2),(152,'2026_05_25_000000_add_forex_rate_to_pdc_tables',3),(153,'2026_05_26_100000_add_is_file_to_sys_configs',4),(155,'2026_07_06_000001_create_office_expense_documents_table',5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office_expense_categories`
--

DROP TABLE IF EXISTS `office_expense_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_expense_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_expense_categories`
--

LOCK TABLES `office_expense_categories` WRITE;
/*!40000 ALTER TABLE `office_expense_categories` DISABLE KEYS */;
INSERT INTO `office_expense_categories` (`id`, `name`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `is_deleted`) VALUES (1,'General','general expenditure',1,NULL,'2026-06-12 04:50:01','2026-06-12 04:50:01',NULL,0),(2,'Sales','Sales expenditure',1,NULL,'2026-06-12 04:50:15','2026-06-12 04:50:15',NULL,0);
/*!40000 ALTER TABLE `office_expense_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office_expense_documents`
--

DROP TABLE IF EXISTS `office_expense_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_expense_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `expense_id` bigint unsigned NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_expense_documents`
--

LOCK TABLES `office_expense_documents` WRITE;
/*!40000 ALTER TABLE `office_expense_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `office_expense_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office_expense_payments`
--

DROP TABLE IF EXISTS `office_expense_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_expense_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `expense_id` bigint unsigned NOT NULL,
  `transaction_id` bigint unsigned DEFAULT NULL,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direction` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount_paid` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) DEFAULT NULL,
  `net_amount` decimal(15,2) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` decimal(15,6) DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reconciled` tinyint(1) NOT NULL DEFAULT '0',
  `reconciliation_date` date DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `office_expense_payments_expense_id_foreign` (`expense_id`),
  CONSTRAINT `office_expense_payments_expense_id_foreign` FOREIGN KEY (`expense_id`) REFERENCES `office_expenses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_expense_payments`
--

LOCK TABLES `office_expense_payments` WRITE;
/*!40000 ALTER TABLE `office_expense_payments` DISABLE KEYS */;
INSERT INTO `office_expense_payments` (`id`, `expense_id`, `transaction_id`, `transaction_number`, `direction`, `transaction_type`, `amount_paid`, `tax_amount`, `net_amount`, `payment_date`, `payment_method`, `payment_status`, `currency`, `exchange_rate`, `bank_name`, `check_number`, `transaction_reference`, `receipt_number`, `reconciled`, `reconciliation_date`, `updated_by`, `created_by`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,3,'EXPPAY-2643-3433','out','expense',20000.00,0.00,20000.00,'2026-06-12','internal_transfer','completed','KES',1.000000,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2026-06-12 04:51:43','2026-06-12 04:51:43',0,NULL,NULL);
/*!40000 ALTER TABLE `office_expense_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office_expenses`
--

DROP TABLE IF EXISTS `office_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `cost_center_id` bigint unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'KES',
  `date` date NOT NULL,
  `status` enum('pending','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_expenses`
--

LOCK TABLES `office_expenses` WRITE;
/*!40000 ALTER TABLE `office_expenses` DISABLE KEYS */;
INSERT INTO `office_expenses` (`id`, `category_id`, `cost_center_id`, `description`, `amount`, `currency`, `date`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `is_deleted`) VALUES (1,1,2,'Purchase of the reception tv',20000.00,'KES','2026-06-12','paid',1,1,'2026-06-12 04:50:36','2026-06-12 04:51:43',NULL,0),(2,1,3,'some new expense with changing cost center',100.00,'KES','2026-06-12','pending',1,1,'2026-06-12 05:10:43','2026-06-12 05:20:46',NULL,0);
/*!40000 ALTER TABLE `office_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_documents`
--

DROP TABLE IF EXISTS `order_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_type` enum('proposal','terms','attachments') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_documents_order_id_foreign` (`order_id`),
  CONSTRAINT `order_documents_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_documents`
--

LOCK TABLES `order_documents` WRITE;
/*!40000 ALTER TABLE `order_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci,
  `order_amount` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `custom_note` text COLLATE utf8mb4_unicode_ci,
  `is_taxable` tinyint(1) NOT NULL,
  `tax_id` bigint unsigned DEFAULT NULL,
  `tax_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` enum('fixed','percent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_value` decimal(15,2) DEFAULT NULL,
  `item_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `item_name`, `item_description`, `order_amount`, `quantity`, `total`, `custom_note`, `is_taxable`, `tax_id`, `tax_item_name`, `item_type`, `item_value`, `item_amount`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,'my quote','my quote',2000000.00,1,2000000.00,NULL,1,1,'Value Added Tax','percent',16.00,320000.00,'2026-05-12 16:46:17','2026-05-12 16:46:17',2,2,0,NULL,NULL),(2,2,'dddd','project',10000.00,1,10000.00,NULL,0,NULL,NULL,NULL,NULL,0.00,'2026-06-30 10:03:42','2026-06-30 10:03:42',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_reference_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quotation_id` bigint unsigned NOT NULL,
  `project_id` bigint unsigned DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','sent','approved','rejected','revised') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `subtotal_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `discount_percentage` decimal(8,2) NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_terms` text COLLATE utf8mb4_unicode_ci,
  `notes_to_customer` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_job_reference_id_deleted_at_unique` (`job_reference_id`,`deleted_at`),
  KEY `orders_quotation_id_foreign` (`quotation_id`),
  KEY `orders_project_id_foreign` (`project_id`),
  KEY `orders_customer_id_foreign` (`customer_id`),
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_quotation_id_foreign` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `order_number`, `job_reference_id`, `quotation_id`, `project_id`, `customer_id`, `title`, `description`, `status`, `subtotal_amount`, `tax_amount`, `discount_percentage`, `discount_amount`, `total_amount`, `currency`, `payment_terms`, `notes_to_customer`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'ORD-000001','JODEFHHH5HD',1,1,2,'my quote','my quote','approved',2000000.00,320000.00,0.00,0.00,2320000.00,'USD',NULL,NULL,'2026-05-12 16:46:17','2026-05-12 16:46:21',2,2,0,NULL,NULL),(2,'ORD-000002','DW344343JDJ',2,2,3,'funny quote test','funny quote test ddd','approved',10000.00,0.00,0.00,0.00,10000.00,'KES','terms','notes','2026-06-30 10:03:42','2026-06-30 10:03:51',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_reset_tokens_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES ('admin@example.com','$2y$12$dmq4q34i50x5lk2r6KjWBueOVfcMutGHqgPnJim9Nwv/zQvRHIojK','2026-06-04 13:13:34');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_payment_methods_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` (`id`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'CASH','Cash','2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(2,'MPESA','Mpesa','2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(3,'BANK_TRANSFER','Bank Transfer','2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(4,'CHECK','Check','2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_receiving_methods`
--

DROP TABLE IF EXISTS `payment_receiving_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_receiving_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('Bank','Mpesa','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instruction` text COLLATE utf8mb4_unicode_ci,
  `paybill` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_holder_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `swift_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_receiving_methods`
--

LOCK TABLES `payment_receiving_methods` WRITE;
/*!40000 ALTER TABLE `payment_receiving_methods` DISABLE KEYS */;
INSERT INTO `payment_receiving_methods` (`id`, `type`, `name`, `currency`, `instruction`, `paybill`, `account_holder_name`, `account_number`, `bank`, `branch`, `swift_code`, `iban`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'Bank','Main Dollar Account','USD','Pay to at the bank',NULL,'Infosol Kenya Ltd','400400400','Equity Bank','HQ','ABS0301',NULL,'active','2026-05-12 16:51:08','2026-05-12 16:51:08',2,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `payment_receiving_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdc_issued_companies`
--

DROP TABLE IF EXISTS `pdc_issued_companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdc_issued_companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_id` bigint unsigned DEFAULT NULL,
  `invoice_id` bigint unsigned DEFAULT NULL,
  `cheque_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cheque_date` date DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forex_rate` decimal(15,6) NOT NULL DEFAULT '1.000000',
  `bank` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_branch` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_id` bigint unsigned DEFAULT NULL,
  `status` enum('issued','pending','cleared','bounced','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'issued',
  `narration` text COLLATE utf8mb4_unicode_ci,
  `related_transaction_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdc_issued_companies`
--

LOCK TABLES `pdc_issued_companies` WRITE;
/*!40000 ALTER TABLE `pdc_issued_companies` DISABLE KEYS */;
INSERT INTO `pdc_issued_companies` (`id`, `transaction_number`, `company_id`, `invoice_id`, `cheque_number`, `cheque_date`, `issued_date`, `amount`, `currency`, `forex_rate`, `bank`, `bank_branch`, `bank_account_id`, `status`, `narration`, `related_transaction_id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'PDC-5687-2851',1,1,'0003','2026-05-30','2026-05-25',11000.00,'KES',1.000000,'abc',NULL,2,'issued','PDC created from invoice payment (deferred).',NULL,'2026-05-25 03:47:27','2026-05-28 10:13:14',1,1,0,NULL,NULL),(2,'PDC-3980-8648',1,1,'00005','2026-05-25','2026-05-25',5000.00,'KES',1.000000,'ABC bank',NULL,2,'cleared','PDC created from invoice payment (deferred).',4,'2026-05-25 04:42:37','2026-05-25 18:07:59',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `pdc_issued_companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdc_received_customers`
--

DROP TABLE IF EXISTS `pdc_received_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdc_received_customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `invoice_id` bigint unsigned DEFAULT NULL,
  `cheque_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cheque_date` date DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forex_rate` decimal(15,6) NOT NULL DEFAULT '1.000000',
  `bank` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_branch` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_id` bigint unsigned DEFAULT NULL,
  `status` enum('received','pending','cleared','bounced','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'received',
  `narration` text COLLATE utf8mb4_unicode_ci,
  `related_transaction_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdc_received_customers`
--

LOCK TABLES `pdc_received_customers` WRITE;
/*!40000 ALTER TABLE `pdc_received_customers` DISABLE KEYS */;
INSERT INTO `pdc_received_customers` (`id`, `transaction_number`, `customer_id`, `invoice_id`, `cheque_number`, `cheque_date`, `received_date`, `amount`, `currency`, `forex_rate`, `bank`, `bank_branch`, `bank_account_id`, `status`, `narration`, `related_transaction_id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'PDC-8758-6675',2,1,'0003','2026-05-25','2026-05-24',120000.00,'USD',1.000000,'ABC Bank','HQ',1,'cleared','PDC created from invoice receipt (deferred).',3,'2026-05-24 16:52:45','2026-05-25 18:52:44',1,1,0,NULL,NULL),(2,'PDC-2003-8456',2,1,'0045','2026-05-30','2026-05-28',30000.00,'USD',1.000000,'hsbc','hq',1,'cancelled','PDC created from invoice receipt (deferred).',NULL,'2026-05-28 07:42:16','2026-05-28 09:43:38',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `pdc_received_customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (1,'App\\Models\\User',1,'api-client','d92a6c1f27e86f4d5e07e667f1922d1768df6ec82a4c7d3498e8f15f9db88a19','[\"*\"]','2026-05-12 16:45:32',NULL,'2026-05-12 16:42:56','2026-05-12 16:45:32'),(2,'App\\Models\\User',2,'api-client','e5629cb12ee3b1859545ae77491c9c0f2a5211cb55ee5bef95a77f11d5ba195d','[\"*\"]','2026-05-12 17:05:51',NULL,'2026-05-12 16:45:58','2026-05-12 17:05:51'),(3,'App\\Models\\User',2,'api-client','8aae81d778ab87749f9ba15530bb470b0869af3688265a5d3b58369ee8cadce0','[\"*\"]','2026-05-12 18:02:07',NULL,'2026-05-12 18:02:06','2026-05-12 18:02:07'),(4,'App\\Models\\User',2,'api-client','ddf63771d3fe0610d28b6eb46c94da9361418be7525ffc3969b19f36289aa062','[\"*\"]','2026-05-13 16:41:09',NULL,'2026-05-13 16:32:06','2026-05-13 16:41:09'),(5,'App\\Models\\User',1,'api-client','efe43135c7a1b2852daca8d4a2eea8ae13fecbde26b393bf856cc03853e20ea5','[\"*\"]','2026-05-24 06:40:20',NULL,'2026-05-24 06:31:04','2026-05-24 06:40:20'),(6,'App\\Models\\User',1,'api-client','3cca77e16bc7422de2d30897cb0a8c330c873846ad7dff51a80b185eb36c8311','[\"*\"]','2026-05-24 07:01:26',NULL,'2026-05-24 06:51:57','2026-05-24 07:01:26'),(7,'App\\Models\\User',1,'api-client','13e58c4e1cbb35d79b88537932adad83e45e1b19716de4139f59b44170be617a','[\"*\"]','2026-05-24 07:07:43',NULL,'2026-05-24 07:07:40','2026-05-24 07:07:43'),(8,'App\\Models\\User',1,'api-client','b555a3c9888ff8eb5ce09115754db1c0a42e53be52e7d47bd0161b0fc26b948c','[\"*\"]','2026-05-24 07:21:12',NULL,'2026-05-24 07:13:49','2026-05-24 07:21:12'),(9,'App\\Models\\User',1,'api-client','485c95e3d8e3a5118876731e2e04cc65319d05bd66c6cd2c2b78096539a0c4a6','[\"*\"]','2026-05-24 17:41:58',NULL,'2026-05-24 16:50:08','2026-05-24 17:41:58'),(10,'App\\Models\\User',1,'api-client','1e517cf9ac08fc6b48f7530560de0cfb5e4eef74a665c47f357b169ae086d315','[\"*\"]','2026-05-25 03:59:31',NULL,'2026-05-25 03:45:01','2026-05-25 03:59:31'),(11,'App\\Models\\User',1,'api-client','728bdebd120283b63cc059d24de55d0eeee9c7f7b81501f820fbac7ba2e3cfd6','[\"*\"]','2026-05-25 04:50:44',NULL,'2026-05-25 04:21:09','2026-05-25 04:50:44'),(12,'App\\Models\\User',1,'api-client','9264186f5496f8d0571f1975e4b71cf81865d9ec2232c2c81b8c30e36ad9b1d5','[\"*\"]','2026-05-25 05:17:01',NULL,'2026-05-25 04:55:09','2026-05-25 05:17:01'),(13,'App\\Models\\User',1,'api-client','a1081700b46ee809e266c7dbaaa7d8e2aef8dbf82d745a508d19e3c4da5ce520','[\"*\"]','2026-05-25 05:56:55',NULL,'2026-05-25 05:36:38','2026-05-25 05:56:55'),(14,'App\\Models\\User',1,'api-client','cf0676b88b3130bd58d59fb089f935574e779d165d6b54163811eecc9a76754c','[\"*\"]','2026-05-25 06:40:00',NULL,'2026-05-25 06:27:34','2026-05-25 06:40:00'),(15,'App\\Models\\User',1,'api-client','cae82fc31b2cd347e6fd8b92f772a98ff042d87178b78bee323cf474d24fcd7e','[\"*\"]','2026-05-25 10:31:48',NULL,'2026-05-25 10:31:04','2026-05-25 10:31:48'),(16,'App\\Models\\User',1,'api-client','29923862d36c96bcd8d100d8df75e0a088705cdbcf287cbb9b00b65861dc3813','[\"*\"]','2026-05-25 11:14:42',NULL,'2026-05-25 10:53:23','2026-05-25 11:14:42'),(17,'App\\Models\\User',1,'api-client','7ed1d8d335fafe5e67170213caceca50259fa13353bb4661b1bbe4029d2df0df','[\"*\"]','2026-05-25 12:18:31',NULL,'2026-05-25 11:30:57','2026-05-25 12:18:31'),(18,'App\\Models\\User',1,'api-client','e68e428215f39f96dfd7be10fc74b8050626a075cc101dd84c594ae7d54a3e4f','[\"*\"]','2026-05-25 12:32:02',NULL,'2026-05-25 12:32:02','2026-05-25 12:32:02'),(19,'App\\Models\\User',1,'api-client','19d9a36ecbaaf76b76fd61cbaabfcdbbaa11454a1ed66ab604183f9979223076','[\"*\"]','2026-05-25 12:43:17',NULL,'2026-05-25 12:43:05','2026-05-25 12:43:17'),(20,'App\\Models\\User',1,'api-client','3bafc4fa5d674e6bc8dc54771bafc003ce5cd51a09f5e1a3019178b331cc6dd0','[\"*\"]','2026-05-25 15:28:42',NULL,'2026-05-25 15:08:15','2026-05-25 15:28:42'),(21,'App\\Models\\User',1,'api-client','a7a625975a3b19a24189078e68161fbd6c650284203c0a7cdfe784ec2279614b','[\"*\"]','2026-05-25 15:47:23',NULL,'2026-05-25 15:40:22','2026-05-25 15:47:23'),(22,'App\\Models\\User',1,'api-client','a593c102c6465506f27a5978e29b29280cc297dc54ad5cdd0b2adb1e87028d42','[\"*\"]','2026-05-25 16:02:17',NULL,'2026-05-25 16:01:55','2026-05-25 16:02:17'),(23,'App\\Models\\User',1,'api-client','501409c328aa3e17c02f6da1317478202cdf49ff55891be64fd3a73235a36abb','[\"*\"]','2026-05-25 17:09:36',NULL,'2026-05-25 16:02:22','2026-05-25 17:09:36'),(24,'App\\Models\\User',1,'api-client','1270ba30c9cb8334eea8777d669f93faebcbf21457d8c909a7bdf91283126730','[\"*\"]','2026-05-25 17:12:02',NULL,'2026-05-25 17:02:27','2026-05-25 17:12:02'),(25,'App\\Models\\User',1,'api-client','2f2572e557fbefd9471deea06c67174941e0a97cf37cf0b8a8c2ef81696c3709','[\"*\"]','2026-05-25 18:18:56',NULL,'2026-05-25 17:09:37','2026-05-25 18:18:56'),(26,'App\\Models\\User',1,'api-client','2406e043d0bfdded8d224b8b8359a0c0185b9c27dc646a516047676322cee03c','[\"*\"]','2026-05-25 18:53:29',NULL,'2026-05-25 18:18:53','2026-05-25 18:53:29'),(27,'App\\Models\\User',1,'api-client','7aeaf8fa73a4a328f239e7bf7ceb2951c4c38f056a0f389f24989ca168c1810f','[\"*\"]','2026-05-25 18:54:18',NULL,'2026-05-25 18:54:03','2026-05-25 18:54:18'),(28,'App\\Models\\User',1,'api-client','7dc6a5b35345da3ee7939096b558428ab40eb6ca93946738191bb21ebdf9d027','[\"*\"]','2026-05-26 05:45:11',NULL,'2026-05-26 04:47:30','2026-05-26 05:45:11'),(29,'App\\Models\\User',1,'api-client','8e588e0f27b74f14cfee83c95a2871e12482e7ac904e44092c50c2a6b7aca92d','[\"*\"]','2026-05-26 06:06:43',NULL,'2026-05-26 05:47:43','2026-05-26 06:06:43'),(30,'App\\Models\\User',1,'api-client','7bf2cddad2eeb3f09e5bf390d08b8d2569c0ab481f6f51eb7f37e2804385a560','[\"*\"]','2026-05-26 06:24:23',NULL,'2026-05-26 06:24:22','2026-05-26 06:24:23'),(31,'App\\Models\\User',1,'api-client','6ab3f31fba9070269b5c07460caf50070f39e4ea37234026284788ed5713055c','[\"*\"]','2026-05-26 06:40:06',NULL,'2026-05-26 06:32:39','2026-05-26 06:40:06'),(32,'App\\Models\\User',1,'api-client','cf8bce8c0d327aaa29e687b16f7f9a1a14de6f278e0c03c6e1ebbe99b8b1ba7d','[\"*\"]','2026-05-26 06:58:03',NULL,'2026-05-26 06:53:42','2026-05-26 06:58:03'),(33,'App\\Models\\User',1,'api-client','d7070d6977bf3104e9ca51faf3dfd36a9f3c8756b5505ab8521a89c0c090400a','[\"*\"]','2026-05-28 07:39:14',NULL,'2026-05-28 07:39:13','2026-05-28 07:39:14'),(34,'App\\Models\\User',1,'api-client','613905068821915191fff6fee380e77b9b7d1dae74b9b791ce75802cf5650a64','[\"*\"]','2026-05-28 07:42:35',NULL,'2026-05-28 07:39:14','2026-05-28 07:42:35'),(35,'App\\Models\\User',1,'api-client','bc3905f4187b05c800c2ab350021d6eea34daf059b8fc0c7c6ef827f26a07e75','[\"*\"]','2026-05-28 08:52:16',NULL,'2026-05-28 08:16:13','2026-05-28 08:52:16'),(36,'App\\Models\\User',1,'api-client','f5e30800482e34e343d9e81aa0afffb1f1b83794ddae2a5360d7a87875a10d31','[\"*\"]','2026-05-28 09:53:26',NULL,'2026-05-28 09:04:16','2026-05-28 09:53:26'),(37,'App\\Models\\User',1,'api-client','94b7dee8cc9dfbedd4e96c1bc40d11ebe5822edf29e2a47d109276eadcabb377','[\"*\"]','2026-05-28 10:18:09',NULL,'2026-05-28 10:10:38','2026-05-28 10:18:09'),(38,'App\\Models\\User',1,'api-client','fce92e790f68867e102014f3a6f1df1daf3480cb9d334dc93d9c4d4fc9178f20','[\"*\"]','2026-06-02 14:03:44',NULL,'2026-06-02 13:34:08','2026-06-02 14:03:44'),(39,'App\\Models\\User',1,'api-client','fcb8847efa38fc15733ebe7e13413e1f6a924d2f32aeb30d47ff99709182fc7e','[\"*\"]','2026-06-02 15:04:43',NULL,'2026-06-02 14:05:38','2026-06-02 15:04:43'),(40,'App\\Models\\User',1,'api-client','3abffee3f1560ed8b19ce60e1fc185fa45723c20884140937f8062b5b1b13b6d','[\"*\"]','2026-06-02 16:05:42',NULL,'2026-06-02 15:05:43','2026-06-02 16:05:42'),(41,'App\\Models\\User',1,'api-client','dd386b3a9ef9e26c0b9dea233ab971bdda77f11ee6dfa37e88dac8ece79468e6','[\"*\"]','2026-06-02 17:01:35',NULL,'2026-06-02 16:05:51','2026-06-02 17:01:35'),(42,'App\\Models\\User',1,'api-client','e452ec63de0df9239fe1a6ba13a2f76a9f844965ef4a96ba801f52a3cc4e1d3d','[\"*\"]','2026-06-02 17:55:01',NULL,'2026-06-02 17:10:37','2026-06-02 17:55:01'),(43,'App\\Models\\User',1,'api-client','86e1cbb7ba0213e5206e8e6d44972370f88a664ff22ff3cc30fc20ab3eb434ad','[\"*\"]','2026-06-02 18:27:14',NULL,'2026-06-02 18:22:44','2026-06-02 18:27:14'),(44,'App\\Models\\User',1,'api-client','b6b28e8c344ccdff939b67f57a1aa3e6c1912e634a68dc2cd1cc8e4561d7da0d','[\"*\"]','2026-06-04 12:59:05',NULL,'2026-06-04 12:50:54','2026-06-04 12:59:05'),(45,'App\\Models\\User',1,'api-client','9fe998967e42c2946ce7264c4b4f6a3f951d763ffb0b395e566c7ef057eeb78a','[\"*\"]','2026-06-12 04:25:38',NULL,'2026-06-12 04:13:53','2026-06-12 04:25:38'),(46,'App\\Models\\User',1,'api-client','b1068a381ce41f7e9e36c0735830c31cfcfbfb28735225cddb8c3ae79a3429ce','[\"*\"]','2026-06-12 04:26:43',NULL,'2026-06-12 04:16:23','2026-06-12 04:26:43'),(47,'App\\Models\\User',1,'api-client','6c5cb15a7ee711bd77bbab5a2f46089412c37ff8d5be298e4d2ddff6ee1df029','[\"*\"]','2026-06-12 05:21:31',NULL,'2026-06-12 04:27:10','2026-06-12 05:21:31'),(48,'App\\Models\\User',1,'api-client','c3f892d26a1a848819af44cc87722bcd042d685d85888bd5a3fd6ac34c62eed2','[\"*\"]','2026-06-12 05:36:54',NULL,'2026-06-12 05:36:42','2026-06-12 05:36:54'),(49,'App\\Models\\User',1,'api-client','46a6948ad7bb75387fe841c22875e03b5e0bb65e098ba3cad229a731a1c713a1','[\"*\"]','2026-06-12 08:29:25',NULL,'2026-06-12 07:42:53','2026-06-12 08:29:25'),(50,'App\\Models\\User',1,'api-client','384fb9866b1bda1b27e8c622715a9fad86faaedebaf35f7eb2729a78132f7222','[\"*\"]','2026-06-12 08:52:54',NULL,'2026-06-12 08:30:43','2026-06-12 08:52:54'),(51,'App\\Models\\User',1,'api-client','2f349e8281c15971432ace688bc52406787a0b5a0d5037ef4612458fc129af94','[\"*\"]','2026-06-12 09:23:12',NULL,'2026-06-12 09:20:52','2026-06-12 09:23:12'),(52,'App\\Models\\User',1,'api-client','88fd26b51217fc838a01aef908f6b9607ad5f7ce73c13017799c193ef669e9ee','[\"*\"]','2026-06-12 09:23:27',NULL,'2026-06-12 09:23:16','2026-06-12 09:23:27'),(53,'App\\Models\\User',1,'api-client','d7e4d0aa2a0da5e64e5b960ce2359c036ca27eabaedff9564c8cbfddee4e7dfe','[\"*\"]','2026-06-12 09:49:55',NULL,'2026-06-12 09:39:39','2026-06-12 09:49:55'),(54,'App\\Models\\User',1,'api-client','f9689416003c428a2b27367a2cc76cde3d7d1385e94faf85b3d3e58f2a130dd2','[\"*\"]','2026-06-12 10:17:38',NULL,'2026-06-12 09:49:58','2026-06-12 10:17:38'),(55,'App\\Models\\User',1,'api-client','5f15ce4fff10cd700336da2ac420c9472bcaf641f15aa954982c54da4e3fc872','[\"*\"]','2026-06-12 10:30:36',NULL,'2026-06-12 10:22:05','2026-06-12 10:30:36'),(56,'App\\Models\\User',1,'api-client','90664da66fd35a5a082aca1bd3e5c37ced4f42e4992d8c61e76fe8a90b4f5cc9','[\"*\"]',NULL,NULL,'2026-06-12 10:30:41','2026-06-12 10:30:41'),(57,'App\\Models\\User',1,'api-client','f473cff8389e9989e64d0f95882dac9934284c10b5a568fd8baaab4139811d4d','[\"*\"]',NULL,NULL,'2026-06-12 10:31:03','2026-06-12 10:31:03'),(58,'App\\Models\\User',1,'api-client','8d1ebb839c5ab0ca5421617beadfc51b4ea61bc0f6da739424273b6eae4a970e','[\"*\"]',NULL,NULL,'2026-06-12 10:32:58','2026-06-12 10:32:58'),(59,'App\\Models\\User',1,'api-client','b77d79162e091e767bf55c88a12f1ee7edb973ff08a41abdbb64a7f371ae19ad','[\"*\"]','2026-06-12 10:48:59',NULL,'2026-06-12 10:35:39','2026-06-12 10:48:59'),(60,'App\\Models\\User',1,'api-client','2144d12d72da2a4cbb3e9d1d07f34ecc64a983e3a6592f09271b09f1fd3eca6b','[\"*\"]','2026-06-12 11:02:13',NULL,'2026-06-12 10:49:07','2026-06-12 11:02:13'),(61,'App\\Models\\User',1,'api-client','d5959a72e2210fd2f0dbda08f131df88574e5e6dd30459a909891c0ac9dcc416','[\"*\"]','2026-06-12 15:15:03',NULL,'2026-06-12 14:52:00','2026-06-12 15:15:03'),(62,'App\\Models\\User',1,'api-client','aed51d62f540caffd93720eaaff209972cdab37b28c6db622774af8b6a6e9963','[\"*\"]','2026-06-18 09:35:07',NULL,'2026-06-18 09:34:51','2026-06-18 09:35:07'),(63,'App\\Models\\User',1,'api-client','bf154d58fe22ec8747ad5fd2a838c397967b1d1327912a76e4671211869eb760','[\"*\"]','2026-06-18 17:42:05',NULL,'2026-06-18 17:41:01','2026-06-18 17:42:05'),(64,'App\\Models\\User',1,'api-client','82aa5a2b887d805d8a874b93ed55f69ae82d3b5ec3e7b1f7e6373b6e764f12b5','[\"*\"]','2026-06-23 09:56:34',NULL,'2026-06-23 09:53:39','2026-06-23 09:56:34'),(65,'App\\Models\\User',1,'api-client','ec7ef5f6842acd38d555c4fa6145547839b8efe56f53c4d68f8f291954ed443b','[\"*\"]','2026-06-23 10:19:53',NULL,'2026-06-23 10:10:43','2026-06-23 10:19:53'),(66,'App\\Models\\User',1,'api-client','84a5120d98a7cf72e4f697b824ea879209db5906415459add3869f4fb31ab325','[\"*\"]','2026-06-23 10:39:29',NULL,'2026-06-23 10:37:44','2026-06-23 10:39:29'),(67,'App\\Models\\User',1,'api-client','bf4a174ccb7e510df4b2816c62ba36391b4ec9833bd9e728950cd91e250baaf0','[\"*\"]','2026-06-24 11:48:56',NULL,'2026-06-24 11:48:55','2026-06-24 11:48:56'),(68,'App\\Models\\User',1,'api-client','b1f41abd1f5faaf631e158003f989ba9d180377ac9b3c61db44bfab6519e99f1','[\"*\"]','2026-06-24 11:53:51',NULL,'2026-06-24 11:49:25','2026-06-24 11:53:51'),(69,'App\\Models\\User',1,'api-client','db70d3fb4bad8759fa36457bbeb9485ac77895e39115cb305a9809db6fb5bb21','[\"*\"]','2026-06-24 11:54:15',NULL,'2026-06-24 11:54:12','2026-06-24 11:54:15'),(70,'App\\Models\\User',6,'api-client','c20d4fb750f12c220dfdbf429a8397200ea588d323b6d73b2e9298cd3b0d5e46','[\"*\"]',NULL,NULL,'2026-06-24 11:54:41','2026-06-24 11:54:41'),(71,'App\\Models\\User',6,'api-client','495759573ff1af0a385b9313e2b107fcd1c2513698fb561610d956bff8561c09','[\"*\"]',NULL,NULL,'2026-06-24 11:54:52','2026-06-24 11:54:52'),(72,'App\\Models\\User',6,'api-client','dfa0af8f1ecf053ef19a20700bbae87276c83b617c5c54fa0fa015f143610e68','[\"*\"]',NULL,NULL,'2026-06-24 11:57:43','2026-06-24 11:57:43'),(73,'App\\Models\\User',6,'api-client','fd35ce3eb6f32dbf83d61cbfedf9b3ed6d5e402d9616bb218c179000275d5ee9','[\"*\"]',NULL,NULL,'2026-06-24 12:11:38','2026-06-24 12:11:38'),(74,'App\\Models\\User',6,'api-client','534cdb1b5aa96db84c255386120de4c8661e307c30161fafb307486be3ac2bb3','[\"*\"]','2026-06-24 12:14:30',NULL,'2026-06-24 12:14:30','2026-06-24 12:14:30'),(75,'App\\Models\\User',6,'api-client','377e550f586b24748e33e2eb12e163ada9b3c6635f17d9c116968428dc41056a','[\"*\"]','2026-06-24 12:35:06',NULL,'2026-06-24 12:33:27','2026-06-24 12:35:06'),(76,'App\\Models\\User',6,'api-client','a11b8663414994bf3d7652863b70d8361a4d178f0c7a1249dfbf769f916fe4e3','[\"*\"]','2026-06-24 12:36:06',NULL,'2026-06-24 12:36:02','2026-06-24 12:36:06'),(77,'App\\Models\\User',6,'api-client','5c7bfe5b75efcf449e9f7caab58706dc507b98a640d1c90fb4146d11e5b8b45c','[\"*\"]','2026-06-30 09:30:12',NULL,'2026-06-30 09:30:07','2026-06-30 09:30:12'),(78,'App\\Models\\User',1,'api-client','0f9a76ad7c26b009bfec6d447198a97afa4275da3102b4da0d3d0ef18b2bb961','[\"*\"]','2026-06-30 09:31:08',NULL,'2026-06-30 09:30:27','2026-06-30 09:31:08'),(79,'App\\Models\\User',6,'api-client','e5e1b9ee1785f0c07691bffadcfa05f9da2833ee60db5addb2ec4a3e70aea0fa','[\"*\"]','2026-06-30 10:03:15',NULL,'2026-06-30 09:31:21','2026-06-30 10:03:15'),(80,'App\\Models\\User',1,'api-client','4f9d196750f6e161a07f8b8376e91b7a767d02b8bb26fc7e7ba1e8b170fbb461','[\"*\"]','2026-06-30 10:04:09',NULL,'2026-06-30 10:03:24','2026-06-30 10:04:09'),(81,'App\\Models\\User',1,'api-client','807407a439888a8f7d11bdd649387c3cb6344622aa6a516f1d4de27331000143','[\"*\"]','2026-07-06 11:32:00',NULL,'2026-07-06 11:21:39','2026-07-06 11:32:00'),(82,'App\\Models\\User',1,'api-client','bebc0db04be3ec7b82d000a422f5dfcc3d05dc85b29600b445f721b4c638d7b1','[\"*\"]','2026-07-06 13:02:40',NULL,'2026-07-06 11:59:46','2026-07-06 13:02:40'),(83,'App\\Models\\User',1,'api-client','613eadb247acce8ae1537d549713c28d09b94038aebef5fa43af62308478a9cf','[\"*\"]','2026-07-06 13:25:30',NULL,'2026-07-06 13:02:43','2026-07-06 13:25:30'),(84,'App\\Models\\User',1,'api-client','cb89336cfb3f417cf8d03ba0b23bdabb0625dce886fb3ce4131e907049c57651','[\"*\"]','2026-07-06 14:37:36',NULL,'2026-07-06 13:38:26','2026-07-06 14:37:36'),(85,'App\\Models\\User',1,'api-client','b0e383af9b8ff014764bf2071fc0584b68dcef812bf2c4615dd1715d3e36979d','[\"*\"]','2026-07-06 15:28:53',NULL,'2026-07-06 14:38:55','2026-07-06 15:28:53'),(86,'App\\Models\\User',1,'api-client','99ab0be3a17c095cf98a4566ae5e850cbee404d19a7fc038a3fdf3f3fd1f29b5','[\"*\"]','2026-07-06 15:48:32',NULL,'2026-07-06 15:41:09','2026-07-06 15:48:32'),(87,'App\\Models\\User',1,'api-client','cc5972f0a9b02cbe57e487cf3a17ea41986a8b0e522ec61bd2117373fa06f276','[\"*\"]','2026-07-06 16:13:42',NULL,'2026-07-06 16:10:22','2026-07-06 16:13:42'),(88,'App\\Models\\User',1,'api-client','85417a82ad872673185dc21fbc997f827ac1091ee705758ebdfdc2c92c6ff73c','[\"*\"]','2026-07-06 16:45:00',NULL,'2026-07-06 16:45:00','2026-07-06 16:45:00'),(89,'App\\Models\\User',1,'api-client','611b15c720a1e45b94795a6569544fd8d6d1899c64cd08c115bc7035357df1ca','[\"*\"]','2026-07-06 17:37:17',NULL,'2026-07-06 17:06:18','2026-07-06 17:37:17');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_categories`
--

DROP TABLE IF EXISTS `project_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_categories`
--

LOCK TABLES `project_categories` WRITE;
/*!40000 ALTER TABLE `project_categories` DISABLE KEYS */;
INSERT INTO `project_categories` (`id`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'Software','software','2026-05-12 16:47:12','2026-05-12 16:47:12',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `project_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_locations`
--

DROP TABLE IF EXISTS `project_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_locations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_locations`
--

LOCK TABLES `project_locations` WRITE;
/*!40000 ALTER TABLE `project_locations` DISABLE KEYS */;
INSERT INTO `project_locations` (`id`, `code`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'LND-UK','London UK','uk','2026-05-12 16:47:44','2026-05-12 16:47:44',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `project_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_phases`
--

DROP TABLE IF EXISTS `project_phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_phases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_billed` tinyint(1) NOT NULL DEFAULT '0',
  `project_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phase_order` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress_percentage` decimal(5,2) NOT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_phases_project_id_foreign` (`project_id`),
  CONSTRAINT `project_phases_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_phases`
--

LOCK TABLES `project_phases` WRITE;
/*!40000 ALTER TABLE `project_phases` DISABLE KEYS */;
INSERT INTO `project_phases` (`id`, `created_at`, `updated_at`, `is_billed`, `project_id`, `name`, `description`, `start_date`, `end_date`, `status`, `code`, `phase_order`, `progress_percentage`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'2026-05-12 16:46:21','2026-05-12 16:52:46',0,1,'Phase 1','my quote','2026-05-12','2026-06-12','complete','PRP-8533-2036','1',100.00,2,2,0,NULL,NULL),(2,'2026-05-12 16:49:09','2026-06-12 04:15:38',0,1,'phase 2','phase two','2026-05-20','2026-08-28','complete','PRP-2441-7119','2',100.00,1,2,0,NULL,NULL),(3,'2026-06-30 10:03:51','2026-06-30 10:03:51',0,2,'Project for order ORD-000002','funny quote test ddd','2026-06-30','2026-07-30','draft','PRP-8914-6177','1',0.00,1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `project_phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_progress_updates`
--

DROP TABLE IF EXISTS `project_progress_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_progress_updates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned NOT NULL,
  `project_phase_id` bigint unsigned NOT NULL,
  `percentage_complete` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_progress_updates_project_id_foreign` (`project_id`),
  KEY `project_progress_updates_project_phase_id_foreign` (`project_phase_id`),
  CONSTRAINT `project_progress_updates_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_progress_updates_project_phase_id_foreign` FOREIGN KEY (`project_phase_id`) REFERENCES `project_phases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_progress_updates`
--

LOCK TABLES `project_progress_updates` WRITE;
/*!40000 ALTER TABLE `project_progress_updates` DISABLE KEYS */;
INSERT INTO `project_progress_updates` (`id`, `project_id`, `project_phase_id`, `percentage_complete`, `comment`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,100,'finished the work my friends.. pay time now','2026-05-12 16:52:46','2026-05-12 16:52:46',NULL,2,0,NULL,NULL),(2,1,2,100,'this was easy .. this is done','2026-06-12 04:15:38','2026-06-12 04:15:38',NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `project_progress_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_source_origins`
--

DROP TABLE IF EXISTS `project_source_origins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_source_origins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_source_origins`
--

LOCK TABLES `project_source_origins` WRITE;
/*!40000 ALTER TABLE `project_source_origins` DISABLE KEYS */;
INSERT INTO `project_source_origins` (`id`, `code`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'GOOGLE_ADDS','Google Ads','ads','2026-05-12 16:47:23','2026-05-12 16:47:23',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `project_source_origins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned DEFAULT NULL,
  `job_reference_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `company_id` bigint unsigned DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `project_category_id` bigint unsigned DEFAULT NULL,
  `project_source_origin_id` bigint unsigned DEFAULT NULL,
  `project_location_id` bigint unsigned DEFAULT NULL,
  `no_of_phases` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `budget_estimate` decimal(15,2) DEFAULT NULL,
  `status` enum('new','progress','draft','complete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `priority` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_customer_id_foreign` (`customer_id`),
  KEY `projects_project_category_id_foreign` (`project_category_id`),
  KEY `projects_project_source_origin_id_foreign` (`project_source_origin_id`),
  KEY `projects_project_location_id_foreign` (`project_location_id`),
  KEY `projects_order_id_foreign` (`order_id`),
  CONSTRAINT `projects_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_project_category_id_foreign` FOREIGN KEY (`project_category_id`) REFERENCES `project_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_project_location_id_foreign` FOREIGN KEY (`project_location_id`) REFERENCES `project_locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projects_project_source_origin_id_foreign` FOREIGN KEY (`project_source_origin_id`) REFERENCES `project_source_origins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` (`id`, `order_id`, `job_reference_id`, `created_at`, `updated_at`, `code`, `name`, `description`, `company_id`, `customer_id`, `project_category_id`, `project_source_origin_id`, `project_location_id`, `no_of_phases`, `budget_estimate`, `status`, `priority`, `progress`, `tags`, `currency`, `start_date`, `end_date`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,'JODEFHHH5HD','2026-05-12 16:46:17','2026-06-12 08:44:00','PRJ-7227-2961','development of an Gen-AI based agent','my quote',NULL,2,1,1,1,'2',2320000.00,'complete','High','100','tech,ai,gen ai','USD','2026-05-12','2026-06-12',1,2,0,'2026-06-12 08:44:00',NULL),(2,2,'DW344343JDJ','2026-06-30 10:03:42','2026-06-30 10:03:58','PRJ-7140-7960','Project for order ORD-000002','funny quote test ddd',NULL,3,NULL,NULL,NULL,'1',10000.00,'draft','medium','0',NULL,'KES','2026-06-30','2026-07-30',1,1,1,'2026-06-30 10:03:58',1);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quotation_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_reference_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','sent','approved','rejected','revised') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `valid_until_date` date NOT NULL,
  `subtotal_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `discount_percentage` decimal(8,2) NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_terms` text COLLATE utf8mb4_unicode_ci,
  `min_approval_count` int NOT NULL DEFAULT '1',
  `notes_to_customer` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quotations_job_reference_id_deleted_at_unique` (`job_reference_id`,`deleted_at`),
  KEY `quotations_customer_id_foreign` (`customer_id`),
  CONSTRAINT `quotations_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
INSERT INTO `quotations` (`id`, `quotation_number`, `job_reference_id`, `customer_id`, `title`, `description`, `status`, `valid_until_date`, `subtotal_amount`, `tax_amount`, `discount_percentage`, `discount_amount`, `total_amount`, `currency`, `payment_terms`, `min_approval_count`, `notes_to_customer`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'QUO-000001','JODEFHHH5HD',2,'my quote','my quote','approved','2026-05-26',2000000.00,320000.00,0.00,0.00,2320000.00,'USD',NULL,2,NULL,'2026-05-12 19:44:14','2026-05-12 16:46:09',2,1,0,NULL,NULL),(2,'QUO-000002','DW344343JDJ',3,'funny quote test','funny quote test ddd','approved','2026-06-30',10000.00,0.00,0.00,0.00,10000.00,'KES','terms',2,'notes','2026-06-02 16:38:08','2026-06-30 10:03:35',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_approvals`
--

DROP TABLE IF EXISTS `quote_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote_approvals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `quote_id` bigint unsigned NOT NULL,
  `action` enum('make','check') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'check',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quote_approvals_user_id_foreign` (`user_id`),
  KEY `quote_approvals_quote_id_user_id_index` (`quote_id`,`user_id`),
  CONSTRAINT `quote_approvals_quote_id_foreign` FOREIGN KEY (`quote_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quote_approvals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_approvals`
--

LOCK TABLES `quote_approvals` WRITE;
/*!40000 ALTER TABLE `quote_approvals` DISABLE KEYS */;
INSERT INTO `quote_approvals` (`id`, `user_id`, `quote_id`, `action`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,'make','2026-05-12 16:44:36','2026-05-12 16:44:36',1,1,0,NULL,NULL),(2,2,1,'check','2026-05-12 16:46:09','2026-05-12 16:46:09',2,NULL,0,NULL,NULL),(3,1,2,'make','2026-06-02 14:14:22','2026-06-02 14:27:10',1,1,1,'2026-06-02 14:27:10',1),(4,1,2,'make','2026-06-04 12:58:44','2026-06-04 12:58:53',1,1,1,'2026-06-04 12:58:53',1),(5,6,2,'make','2026-06-30 10:03:11','2026-06-30 10:03:15',6,6,1,'2026-06-30 10:03:15',6),(6,6,2,'make','2026-06-30 10:03:15','2026-06-30 10:03:15',6,6,0,NULL,NULL),(7,1,2,'check','2026-06-30 10:03:35','2026-06-30 10:03:35',1,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `quote_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_documents`
--

DROP TABLE IF EXISTS `quote_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quotation_id` bigint unsigned NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_type` enum('proposal','terms','attachments') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `attachments` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quote_documents_quotation_id_foreign` (`quotation_id`),
  CONSTRAINT `quote_documents_quotation_id_foreign` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_documents`
--

LOCK TABLES `quote_documents` WRITE;
/*!40000 ALTER TABLE `quote_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_line_items`
--

DROP TABLE IF EXISTS `quote_line_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote_line_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quotation_id` bigint unsigned NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `quoted_amount` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `estimated_hours` int DEFAULT NULL,
  `custom_note` text COLLATE utf8mb4_unicode_ci,
  `is_taxable` tinyint(1) NOT NULL,
  `tax_id` bigint unsigned DEFAULT NULL,
  `tax_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` enum('fixed','percent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_value` decimal(15,2) DEFAULT NULL,
  `item_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quote_line_items_quotation_id_foreign` (`quotation_id`),
  CONSTRAINT `quote_line_items_quotation_id_foreign` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_line_items`
--

LOCK TABLES `quote_line_items` WRITE;
/*!40000 ALTER TABLE `quote_line_items` DISABLE KEYS */;
INSERT INTO `quote_line_items` (`id`, `quotation_id`, `item_name`, `description`, `quoted_amount`, `quantity`, `total`, `estimated_hours`, `custom_note`, `is_taxable`, `tax_id`, `tax_item_name`, `item_type`, `item_value`, `item_amount`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,'my quote','my quote',2000000.00,1,2000000.00,NULL,NULL,1,1,'Value Added Tax','percent',16.00,320000.00,'2026-05-12 16:44:34','2026-05-12 16:44:34',NULL,1,0,NULL,NULL),(3,2,'dddd','project',10000.00,1,10000.00,NULL,NULL,0,NULL,NULL,NULL,NULL,0.00,'2026-06-30 10:03:11','2026-06-30 10:03:11',NULL,6,0,NULL,NULL);
/*!40000 ALTER TABLE `quote_line_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('oRZzmgZHhQ6cve8nqaBCqiewthdMHm41h7CSvOvx',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiU2tRVTZaOVJLbXlxY1YzOG9VVzQ0bHRJRFhOM1M4dVFvNzV4cDQyeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1778604161),('Qy5PdXDaTtaLL7sU37lpEDVsLXi9iAfuwBK59AI8',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiY05NcUdMcHQ0RXVNY2xhVlRzZlMydXN1eGRxZERuQ1k2MFR2Z09CTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1778689873);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_configs`
--

DROP TABLE IF EXISTS `sys_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_configs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `readonly` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_file` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_configs`
--

LOCK TABLES `sys_configs` WRITE;
/*!40000 ALTER TABLE `sys_configs` DISABLE KEYS */;
INSERT INTO `sys_configs` (`id`, `readonly`, `name`, `value`, `is_file`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,'CUST_INVOICE_PREFIX','CINV-',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(2,1,'CUST_INVOICE_INCREMENT','1',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(3,1,'CUST_INVOICE_NUMBER_LENGTH','6',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(4,1,'CUST_CREDIT_NOTE_PREFIX','CCN-',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(5,1,'CUST_CREDIT_NOTE_INCREMENT','1',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(6,1,'CUST_CREDIT_NOTE_NUMBER_LENGTH','6',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(7,1,'COMPANY_INVOICE_PREFIX','CMPINV-',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(8,1,'COMPANY_INVOICE_INCREMENT','1',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(9,1,'COMPANY_INVOICE_NUMBER_LENGTH','6',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(10,1,'COMPANY_CREDIT_NOTE_PREFIX','CMPCN-',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(11,1,'COMPANY_CREDIT_NOTE_INCREMENT','1',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(12,1,'COMPANY_CREDIT_NOTE_NUMBER_LENGTH','6',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(13,1,'ORDER_NUMBER_PREFIX','ORD-',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(14,1,'ORDER_NUMBER_INCREMENT','1',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(15,1,'ORDER_NUMBER_LENGTH','6',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(16,1,'QUOTATION_NUMBER_PREFIX','QUO-',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(17,1,'QUOTATION_NUMBER_INCREMENT','1',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(18,1,'QUOTATION_NUMBER_LENGTH','6',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(19,1,'NAME','Infosol Kenya Ltd',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(20,1,'EMAIL','info@infosolkenyaltd.com',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(21,1,'ADDRESS_LINE_1','1148 Valley Road Park',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(22,1,'CITY','Nairobi',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(23,1,'STATE','Nairobi',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(24,1,'COUNTRY','Kenya',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(25,1,'PHONE','254700000000',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(26,1,'WEBSITE','www.infosolkenya.com',0,'2026-05-26 05:13:46',NULL,NULL,1,0,NULL,NULL),(27,1,'SESSION_MAX_LIMIT_IN_MINUTES','10',0,'2026-05-26 05:13:46',NULL,1,1,0,NULL,NULL),(28,1,'INSTANCE_LOGO','/Users/juma/Gigs/e-pms-for-phased-projects/backend-for-frontend/public/sys_configs/sysconfig_6a33bbcba84d56.77306226.png',1,'2026-05-26 05:13:46',NULL,1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `sys_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_groups`
--

DROP TABLE IF EXISTS `sys_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_sys_groups_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_groups`
--

LOCK TABLES `sys_groups` WRITE;
/*!40000 ALTER TABLE `sys_groups` DISABLE KEYS */;
INSERT INTO `sys_groups` (`id`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'Administrators','System administrators','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(2,'Finance Admins','Finance administrators','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(3,'Project Admins','Project administrators','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL),(4,'Account Admins','Account administrators','2026-05-26 05:13:46','2026-05-26 05:13:46',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `sys_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_roles`
--

DROP TABLE IF EXISTS `sys_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_roles`
--

LOCK TABLES `sys_roles` WRITE;
/*!40000 ALTER TABLE `sys_roles` DISABLE KEYS */;
INSERT INTO `sys_roles` (`id`, `name`, `description`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'ROLE_ADD_COMPANY_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(2,'ROLE_EDIT_COMPANY_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(3,'ROLE_DELETE_COMPANY_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(4,'ROLE_VIEW_COMPANY_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(5,'ROLE_ADD_CUSTOMER_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(6,'ROLE_EDIT_CUSTOMER_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(7,'ROLE_DELETE_CUSTOMER_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(8,'ROLE_VIEW_CUSTOMER_TRANSACTIONS_LEDGER',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(9,'ROLE_ADD_PROJECT_LOCATION',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(10,'ROLE_EDIT_PROJECT_LOCATION',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(11,'ROLE_DELETE_PROJECT_LOCATION',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(12,'ROLE_VIEW_PROJECT_LOCATION',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(13,'ROLE_ADD_PROJECT_SOURCE_ORIGIN',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(14,'ROLE_EDIT_PROJECT_SOURCE_ORIGIN',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(15,'ROLE_DELETE_PROJECT_SOURCE_ORIGIN',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(16,'ROLE_VIEW_PROJECT_SOURCE_ORIGIN',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(17,'ROLE_ADD_CUST_PAYMENT',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(18,'ROLE_EDIT_CUST_PAYMENT',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(19,'ROLE_DELETE_CUST_PAYMENT',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(20,'ROLE_VIEW_CUST_PAYMENT',NULL,'2026-04-27 16:10:07','2026-04-27 16:10:07',1,1,0,NULL,NULL),(21,'ROLE_ADD_ACCOUNT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(22,'ROLE_EDIT_ACCOUNT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(23,'ROLE_DELETE_ACCOUNT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(24,'ROLE_VIEW_ACCOUNT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(25,'ROLE_ADD_ACCOUNT_TYPE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(26,'ROLE_EDIT_ACCOUNT_TYPE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(27,'ROLE_DELETE_ACCOUNT_TYPE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(28,'ROLE_VIEW_ACCOUNT_TYPE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(29,'ROLE_ADD_ACCOUNT_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(30,'ROLE_EDIT_ACCOUNT_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(31,'ROLE_DELETE_ACCOUNT_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(32,'ROLE_VIEW_ACCOUNT_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(33,'ROLE_ADD_COMPANY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(34,'ROLE_EDIT_COMPANY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(35,'ROLE_DELETE_COMPANY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(36,'ROLE_VIEW_COMPANY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(37,'ROLE_ADD_COMPANY_BANK',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(38,'ROLE_EDIT_COMPANY_BANK',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(39,'ROLE_DELETE_COMPANY_BANK',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(40,'ROLE_VIEW_COMPANY_BANK',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(41,'ROLE_ADD_COMPANY_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(42,'ROLE_EDIT_COMPANY_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(43,'ROLE_DELETE_COMPANY_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(44,'ROLE_VIEW_COMPANY_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(45,'ROLE_ADD_COMPANY_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(46,'ROLE_EDIT_COMPANY_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(47,'ROLE_DELETE_COMPANY_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(48,'ROLE_VIEW_COMPANY_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(49,'ROLE_ADD_COMPANY_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(50,'ROLE_EDIT_COMPANY_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(51,'ROLE_DELETE_COMPANY_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(52,'ROLE_VIEW_COMPANY_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(53,'ROLE_ADD_COMPANY_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(54,'ROLE_EDIT_COMPANY_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(55,'ROLE_DELETE_COMPANY_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(56,'ROLE_VIEW_COMPANY_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(57,'ROLE_ADD_COMPANY_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(58,'ROLE_EDIT_COMPANY_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(59,'ROLE_DELETE_COMPANY_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(60,'ROLE_VIEW_COMPANY_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(61,'ROLE_ADD_COMPANY_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(62,'ROLE_EDIT_COMPANY_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(63,'ROLE_DELETE_COMPANY_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(64,'ROLE_VIEW_COMPANY_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(65,'ROLE_ADD_COMPANY_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(66,'ROLE_EDIT_COMPANY_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(67,'ROLE_DELETE_COMPANY_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(68,'ROLE_VIEW_COMPANY_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(69,'ROLE_ADD_COMPANY_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(70,'ROLE_EDIT_COMPANY_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(71,'ROLE_DELETE_COMPANY_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(72,'ROLE_VIEW_COMPANY_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(73,'ROLE_ADD_COUNTRY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(74,'ROLE_EDIT_COUNTRY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(75,'ROLE_DELETE_COUNTRY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(76,'ROLE_VIEW_COUNTRY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(77,'ROLE_ADD_CURRENCY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(78,'ROLE_EDIT_CURRENCY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(79,'ROLE_DELETE_CURRENCY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(80,'ROLE_VIEW_CURRENCY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(81,'ROLE_ADD_CUST_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(82,'ROLE_EDIT_CUST_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(83,'ROLE_DELETE_CUST_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(84,'ROLE_VIEW_CUST_CREDIT_NOTE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(85,'ROLE_ADD_CUST_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(86,'ROLE_EDIT_CUST_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(87,'ROLE_DELETE_CUST_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(88,'ROLE_VIEW_CUST_CREDIT_NOTE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(89,'ROLE_ADD_CUST_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(90,'ROLE_EDIT_CUST_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(91,'ROLE_DELETE_CUST_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(92,'ROLE_VIEW_CUST_CREDIT_NOTE_TAX_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(93,'ROLE_ADD_CUST_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(94,'ROLE_EDIT_CUST_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(95,'ROLE_DELETE_CUST_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(96,'ROLE_VIEW_CUST_INVOICE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(97,'ROLE_ADD_CUST_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(98,'ROLE_EDIT_CUST_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(99,'ROLE_DELETE_CUST_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(100,'ROLE_VIEW_CUST_INVOICE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(101,'ROLE_ADD_CUST_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(102,'ROLE_EDIT_CUST_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(103,'ROLE_DELETE_CUST_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(104,'ROLE_VIEW_CUST_INVOICE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(105,'ROLE_ADD_CUST_PAYMENT_ALLOCATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(106,'ROLE_EDIT_CUST_PAYMENT_ALLOCATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(107,'ROLE_DELETE_CUST_PAYMENT_ALLOCATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(108,'ROLE_VIEW_CUST_PAYMENT_ALLOCATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(109,'ROLE_ADD_CUSTOMER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(110,'ROLE_EDIT_CUSTOMER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(111,'ROLE_DELETE_CUSTOMER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(112,'ROLE_VIEW_CUSTOMER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(113,'ROLE_ADD_DEPARTMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(114,'ROLE_EDIT_DEPARTMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(115,'ROLE_DELETE_DEPARTMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(116,'ROLE_VIEW_DEPARTMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(117,'ROLE_ADD_DOWNLOAD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(118,'ROLE_EDIT_DOWNLOAD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(119,'ROLE_DELETE_DOWNLOAD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(120,'ROLE_VIEW_DOWNLOAD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(121,'ROLE_ADD_GROUP_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(122,'ROLE_EDIT_GROUP_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(123,'ROLE_DELETE_GROUP_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(124,'ROLE_VIEW_GROUP_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(125,'ROLE_ADD_LANGUAGE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(126,'ROLE_EDIT_LANGUAGE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(127,'ROLE_DELETE_LANGUAGE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(128,'ROLE_VIEW_LANGUAGE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(129,'ROLE_ADD_ORDER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(130,'ROLE_EDIT_ORDER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(131,'ROLE_DELETE_ORDER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(132,'ROLE_VIEW_ORDER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(133,'ROLE_ADD_ORDER_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(134,'ROLE_EDIT_ORDER_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(135,'ROLE_DELETE_ORDER_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(136,'ROLE_VIEW_ORDER_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(137,'ROLE_ADD_ORDER_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(138,'ROLE_EDIT_ORDER_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(139,'ROLE_DELETE_ORDER_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(140,'ROLE_VIEW_ORDER_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(141,'ROLE_ADD_PAYMENT_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(142,'ROLE_EDIT_PAYMENT_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(143,'ROLE_DELETE_PAYMENT_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(144,'ROLE_VIEW_PAYMENT_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(145,'ROLE_ADD_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(146,'ROLE_EDIT_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(147,'ROLE_DELETE_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(148,'ROLE_VIEW_PROJECT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(149,'ROLE_ADD_PROJECT_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(150,'ROLE_EDIT_PROJECT_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(151,'ROLE_DELETE_PROJECT_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(152,'ROLE_VIEW_PROJECT_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(153,'ROLE_ADD_PROJECT_PHASE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(154,'ROLE_EDIT_PROJECT_PHASE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(155,'ROLE_DELETE_PROJECT_PHASE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(156,'ROLE_VIEW_PROJECT_PHASE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(157,'ROLE_ADD_PROJECT_PROGRESS_UPDATE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(158,'ROLE_EDIT_PROJECT_PROGRESS_UPDATE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(159,'ROLE_DELETE_PROJECT_PROGRESS_UPDATE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(160,'ROLE_VIEW_PROJECT_PROGRESS_UPDATE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(161,'ROLE_ADD_QUOTATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(162,'ROLE_EDIT_QUOTATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(163,'ROLE_DELETE_QUOTATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(164,'ROLE_VIEW_QUOTATION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(165,'ROLE_ADD_QUOTE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(166,'ROLE_EDIT_QUOTE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(167,'ROLE_DELETE_QUOTE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(168,'ROLE_VIEW_QUOTE_DOCUMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(169,'ROLE_ADD_QUOTE_LINE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(170,'ROLE_EDIT_QUOTE_LINE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(171,'ROLE_DELETE_QUOTE_LINE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(172,'ROLE_VIEW_QUOTE_LINE_ITEM',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(173,'ROLE_ADD_SYS_CONFIG',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(174,'ROLE_EDIT_SYS_CONFIG',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(175,'ROLE_DELETE_SYS_CONFIG',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(176,'ROLE_VIEW_SYS_CONFIG',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(177,'ROLE_ADD_SYS_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(178,'ROLE_EDIT_SYS_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(179,'ROLE_DELETE_SYS_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(180,'ROLE_VIEW_SYS_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(181,'ROLE_ADD_SYS_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(182,'ROLE_EDIT_SYS_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(183,'ROLE_DELETE_SYS_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(184,'ROLE_VIEW_SYS_ROLE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(185,'ROLE_ADD_TAX',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(186,'ROLE_EDIT_TAX',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(187,'ROLE_DELETE_TAX',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(188,'ROLE_VIEW_TAX',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(189,'ROLE_ADD_TRANSACTION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(190,'ROLE_EDIT_TRANSACTION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(191,'ROLE_DELETE_TRANSACTION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(192,'ROLE_VIEW_TRANSACTION',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(193,'ROLE_ADD_USER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(194,'ROLE_EDIT_USER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(195,'ROLE_DELETE_USER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(196,'ROLE_VIEW_USER',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(197,'ROLE_ADD_USER_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(198,'ROLE_EDIT_USER_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(199,'ROLE_DELETE_USER_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(200,'ROLE_VIEW_USER_GROUP',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(201,'ROLE_ADD_QUOTE_APPROVAL',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(202,'ROLE_EDIT_QUOTE_APPROVAL',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(203,'ROLE_VIEW_QUOTE_APPROVAL',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(204,'ROLE_DELETE_QUOTE_APPROVAL',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(205,'ROLE_ADD_OFFICE_EXPENSE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(206,'ROLE_EDIT_OFFICE_EXPENSE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(207,'ROLE_DELETE_OFFICE_EXPENSE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(208,'ROLE_VIEW_OFFICE_EXPENSE',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(209,'ROLE_ADD_OFFICE_EXPENSE_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(210,'ROLE_EDIT_OFFICE_EXPENSE_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(211,'ROLE_DELETE_OFFICE_EXPENSE_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(212,'ROLE_VIEW_OFFICE_EXPENSE_CATEGORY',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(213,'ROLE_ADD_OFFICE_EXPENSE_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(214,'ROLE_EDIT_OFFICE_EXPENSE_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(215,'ROLE_DELETE_OFFICE_EXPENSE_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(216,'ROLE_VIEW_OFFICE_EXPENSE_PAYMENT',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(217,'ROLE_ADD_PAYMENT_RECEIVING_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(218,'ROLE_EDIT_PAYMENT_RECEIVING_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(219,'ROLE_DELETE_PAYMENT_RECEIVING_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(220,'ROLE_VIEW_PAYMENT_RECEIVING_METHOD',NULL,'2026-04-27 16:10:14','2026-04-27 16:10:14',1,1,0,NULL,NULL),(221,'ROLE_ADD_PDC_RECEIVED_CUSTOMER',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(222,'ROLE_EDIT_PDC_RECEIVED_CUSTOMER',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(223,'ROLE_DELETE_PDC_RECEIVED_CUSTOMER',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(224,'ROLE_VIEW_PDC_RECEIVED_CUSTOMER',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(225,'ROLE_ADD_PDC_ISSUED_COMPANY',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(226,'ROLE_EDIT_PDC_ISSUED_COMPANY',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(227,'ROLE_DELETE_PDC_ISSUED_COMPANY',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL),(228,'ROLE_VIEW_PDC_ISSUED_COMPANY',NULL,'2026-05-24 06:14:09','2026-05-24 06:14:09',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `sys_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taxes`
--

DROP TABLE IF EXISTS `taxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `rate` decimal(8,2) NOT NULL DEFAULT '0.00',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_taxes_name` (`name`),
  UNIQUE KEY `ux_taxes_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taxes`
--

LOCK TABLES `taxes` WRITE;
/*!40000 ALTER TABLE `taxes` DISABLE KEYS */;
INSERT INTO `taxes` (`id`, `code`, `name`, `description`, `rate`, `is_default`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'VAT','Value Added Tax','Value Added Tax',16.00,1,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(2,'GST','Goods and Services Tax','Goods and Services Tax',0.00,0,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(3,'WHT','Withholding Tax','Withholding Tax',0.00,0,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(4,'CORPORATE_TAX','Corporate Tax','Corporate Tax',0.00,0,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(5,'SALES_TAX','Sales Tax','Sales Tax',0.00,0,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(6,'EXCISE_TAX','Excise Tax','Excise Tax',0.00,0,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL),(7,'DST','Digital Services Tax','Digital Services Tax',0.00,0,'2026-04-27 16:10:15','2026-04-27 16:10:15',1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `taxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_type` enum('topup','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_date` date NOT NULL,
  `posted_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_currency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` decimal(15,6) NOT NULL,
  `converted_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL,
  `converted_tax_amount` decimal(15,2) DEFAULT NULL,
  `net_amount` decimal(15,2) NOT NULL,
  `converted_net_amount` decimal(15,2) DEFAULT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `company_id` bigint unsigned DEFAULT NULL,
  `source_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned DEFAULT NULL,
  `account_debit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_credit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('revenue','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_status` enum('pending','cleared','reconciled','void') COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_transaction_id` bigint unsigned DEFAULT NULL,
  `narration` text COLLATE utf8mb4_unicode_ci,
  `is_recurring` tinyint(1) NOT NULL,
  `fiscal_year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accounting_period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_adjusting_entry` tinyint(1) NOT NULL,
  `cost_center_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_customer_id_foreign` (`customer_id`),
  KEY `transactions_company_id_foreign` (`company_id`),
  KEY `transactions_related_transaction_id_foreign` (`related_transaction_id`),
  KEY `transactions_cost_center_id_foreign` (`cost_center_id`),
  CONSTRAINT `transactions_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_cost_center_id_foreign` FOREIGN KEY (`cost_center_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_related_transaction_id_foreign` FOREIGN KEY (`related_transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` (`id`, `transaction_number`, `transaction_type`, `transaction_date`, `posted_date`, `amount`, `transaction_currency`, `base_currency`, `exchange_rate`, `converted_amount`, `tax_amount`, `converted_tax_amount`, `net_amount`, `converted_net_amount`, `customer_id`, `company_id`, `source_type`, `source_id`, `account_debit`, `account_credit`, `category`, `payment_method`, `bank_account`, `check_number`, `transaction_status`, `related_transaction_id`, `narration`, `is_recurring`, `fiscal_year`, `accounting_period`, `is_adjusting_entry`, `cost_center_id`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'TRX-5475-3760','expense','2026-05-12','2026-05-12',500000.00,'USD','KES',128.250000,64125000.00,0.00,0.00,500000.00,64125000.00,NULL,NULL,'account_topup',2,'1',NULL,'revenue','CASH',NULL,NULL,'cleared',NULL,'Account top-up',0,'2026','2026-05',0,NULL,'2026-05-12 16:56:45','2026-05-12 16:56:45',2,2,0,NULL,NULL),(2,'TRX-5329-1985','topup','2026-05-12','2026-05-12',64125000.00,'KES','USD',128.250000,500000.00,0.00,0.00,64125000.00,500000.00,NULL,NULL,'account_topup',2,NULL,'2','revenue','CASH',NULL,NULL,'cleared',NULL,'Account top-up',0,'2026','2026-05',0,NULL,'2026-05-12 16:56:45','2026-05-12 16:56:45',2,2,0,NULL,NULL),(3,'EXPPAY-2643-3433','expense','2026-06-12','2026-06-12',20000.00,'KES','KES',1.000000,20000.00,0.00,0.00,20000.00,20000.00,NULL,NULL,'office_expense',1,'2',NULL,'expense','internal_transfer',NULL,NULL,'cleared',NULL,'settlement of expense id 1',0,'2026','2026-06',0,2,'2026-06-12 04:51:43','2026-06-12 04:51:43',NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `sys_group_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_groups_user_id_foreign` (`user_id`),
  KEY `user_groups_sys_group_id_foreign` (`sys_group_id`),
  CONSTRAINT `user_groups_sys_group_id_foreign` FOREIGN KEY (`sys_group_id`) REFERENCES `sys_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_groups_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` (`id`, `user_id`, `sys_group_id`, `created_at`, `updated_at`, `updated_by`, `created_by`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,1,1,NULL,NULL,NULL,NULL,0,NULL,NULL),(2,2,4,'2026-05-12 16:45:27','2026-05-12 16:45:27',NULL,1,0,NULL,NULL),(3,2,3,'2026-05-12 16:45:27','2026-05-12 16:45:27',NULL,1,0,NULL,NULL),(4,2,2,'2026-05-12 16:45:27','2026-05-12 16:45:27',NULL,1,0,NULL,NULL),(5,2,1,'2026-05-12 16:45:27','2026-05-12 16:45:27',NULL,1,0,NULL,NULL),(6,6,1,'2026-06-24 11:53:51','2026-06-24 11:53:51',NULL,1,0,NULL,NULL);
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `remember_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_pic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('internal','company','customer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `company_id` bigint unsigned DEFAULT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `created_at`, `updated_at`, `email`, `first_name`, `middle_name`, `last_name`, `password`, `email_verified_at`, `updated_by`, `created_by`, `remember_token`, `avatar_pic`, `category`, `is_active`, `company_id`, `customer_id`, `is_deleted`, `deleted_at`, `deleted_by`) VALUES (1,'2026-04-27 16:10:15','2026-06-02 16:46:02','admin@example.com','wafula',NULL,'Admin','$2y$12$f8DCgJaiWOpeX6sGHIwgZ.C15KGCjGU7peWGQQM53E0Ind6J8vnnm','2026-04-27 16:10:15',1,1,'7SY7B8W4kn','https://cdn-icons-png.freepik.com/256/12225/12225881.png','internal',1,NULL,NULL,0,NULL,NULL),(2,'2026-05-12 16:45:15','2026-05-12 16:45:15','finance@epms.com','Amos','Doe','Wako','$2y$12$sDg9p2kM3gHzbAfsymjb0.W53.3wQVOzjPlCMldtntnfwt8XdyrLq','2026-05-12 16:45:15',1,1,'QFuJpSDOiWnMi7gDhLEseoyXCDbZ38iY1WUGUYGueKkuc3Ai9r052209wmEZgplV6uZvdtWcdYj2KN7WBTt1DeWWxmKPnbu6aTs1','https://cdn-icons-png.freepik.com/256/12225/12225881.png','internal',1,NULL,NULL,0,NULL,NULL),(3,'2026-06-02 15:28:22','2026-06-02 15:28:22','test.doe.james@mail.com','Test','doe','james','$2y$12$o6vpiFUxyzqs6FCUd7U2PeDfQJO6Qjp9/l0jzP46ebp/66Wq4uiPG','2026-06-02 15:28:22',1,1,'Dgjvr2fbF6ubbRACINWhgfxjbYH0uh89MYeBQLbP4a0QjMHC8L0nzdWUi90VBSbL4nrSi5PHJz6KOsGYUtKPIfMUx9t32V0xKorH','https://cdn-icons-png.freepik.com/256/12225/12225881.png','internal',1,NULL,NULL,0,NULL,NULL),(4,'2026-06-02 15:41:24','2026-06-12 15:14:51','tatu.h@hoddddtmail.com','Julius alex Yoo','Juma Doe','Jinn','$2y$12$1qlH5xNVyM2Y15iDQkZTqeLQi7oPdOjVIRV.e/9vjnwdz4T2HdwKG','2026-06-02 15:41:24',1,1,'IAeg1oUVf76FUNWifbyre29xT4rftGZAXG4bCrSEW6uuI2WA8o6F2v7YxBouX4lW7ET9bPbZKfQm9syKOwWfEPzGR2ycbDluqBs2','https://cdn-icons-png.freepik.com/256/12225/12225881.png','internal',1,NULL,NULL,0,NULL,NULL),(5,'2026-06-23 09:54:02','2026-06-23 10:39:24','idd.fmy@outlook.com','Test','Doe','Junma','$2y$12$9YAtTlQXBA7ws/4qll8fd..zIJenrepsJwguyUz9vJAZU0.nMRP1a','2026-06-23 09:54:02',1,1,'Lr0N1GvqkOgA8SSudlE6lyDGWMteJef4LCqO18BfaQ7oDDD7zI8wPmGEsuTeq4orxnpgx3cpth4LdYw5lAk2gooicnNf3jc4xb8d','https://cdn-icons-png.freepik.com/256/12225/12225881.png','company',1,1,NULL,0,NULL,NULL),(6,'2026-06-24 11:53:42','2026-06-24 11:53:42','test.add.user@gmail.com','Test','Add','User','$2y$12$9FATCxwGWTD498UTBTV/reZRHNUnC8DRJCMs0uXNxeUiIaT5/J/0O','2026-06-24 11:53:42',1,1,'N2ERlNZRLvvLck6yrjiZys3MvqLp7drQOBlQ63NhUR9sIexQIRmVIUFYPBQiy3og5yA1f85hhLfeP8gZyLS0tbTB7yOAmE7VzRsc','https://cdn-icons-png.freepik.com/256/12225/12225881.png','internal',1,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-09 21:16:08
