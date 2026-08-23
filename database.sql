-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: Booking_car
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `car_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trip_date` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trip_time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `way_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'d├ídsdasd','0905622341','H├á Nß╗Öi','S├ón bay Nß╗Öi B├ái','5','2026-01-16','22:14','one-way',200000,'2026-01-16 15:11:41.108'),(2,'lß╗çadasd','0906728131','H├á Nß╗Öi','S├ón bay Nß╗Öi B├ái','5','2026-01-16','22:18','one-way',200000,'2026-01-16 15:14:49.738'),(3,'Test User','0123456789','Hanoi','Haiphong','4','2026-01-20','10:00','one-way',500000,'2026-01-16 15:17:05.686'),(4,'Test User','0123456789','Hanoi','Haiphong','4','2026-01-20','10:00','one-way',500000,'2026-01-16 15:26:40.598'),(5,'sdadasd','0977361212','H├á Nß╗Öi','S├ón bay Nß╗Öi B├ái','5','2026-01-16','22:30','one-way',200000,'2026-01-16 15:27:21.005'),(6,'Test User','0123456789','Hanoi','Haiphong','4','2026-01-20','10:00','one-way',500000,'2026-01-16 15:32:12.144'),(7,'l├¬ quang lu├ón','0898372908','H├á Nß╗Öi','S├ón bay Nß╗Öi B├ái','5','2026-01-16','22:36','one-way',200000,'2026-01-16 15:32:21.657'),(8,'Test User','0123456789','Hanoi','Haiphong','4','2026-01-20','10:00','one-way',500000,'2026-01-16 15:34:43.950'),(9,'Test User','0123456789','Hanoi','Haiphong','4','2026-01-20','10:00','one-way',500000,'2026-01-16 15:36:19.449');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-16 16:26:41
