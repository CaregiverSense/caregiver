-- MySQL dump 10.13  Distrib 5.6.29, for Linux (x86_64)
--
-- Host: localhost    Database: memtag
-- ------------------------------------------------------
-- Server version	5.6.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `memtag`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `memtag` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `memtag`;

--
-- Table structure for table `allergies`
--

DROP TABLE IF EXISTS `allergies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allergies` (
  `allergyID` int(11) NOT NULL DEFAULT '0',
  `name` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`allergyID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergies`
--

LOCK TABLES `allergies` WRITE;
/*!40000 ALTER TABLE `allergies` DISABLE KEYS */;
INSERT INTO `allergies` VALUES (1,'Aspirin'),(2,'Codein'),(3,'Ibuprofen'),(4,'Iodine'),(5,'Tetracycline'),(6,'Sulfa drugs'),(7,'Metals'),(8,'Latex'),(9,'Penicillin'),(10,'Anesthetic'),(11,'Shell fish'),(12,'Sulfite'),(13,'Other');
/*!40000 ALTER TABLE `allergies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allergy`
--

DROP TABLE IF EXISTS `allergy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allergy` (
  `allergyId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`allergyId`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergy`
--

LOCK TABLES `allergy` WRITE;
/*!40000 ALTER TABLE `allergy` DISABLE KEYS */;
INSERT INTO `allergy` VALUES (10,'Anesthetic'),(1,'Aspirin'),(2,'Codein'),(3,'Ibuprofen'),(4,'Iodine'),(8,'Latex'),(7,'Metals'),(13,'Other'),(9,'Penicillin'),(11,'Shell fish'),(6,'Sulfa drugs'),(12,'Sulfite'),(5,'Tetracycline');
/*!40000 ALTER TABLE `allergy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contraindications`
--

DROP TABLE IF EXISTS `contraindications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contraindications` (
  `contrainID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`contrainID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contraindications`
--

LOCK TABLES `contraindications` WRITE;
/*!40000 ALTER TABLE `contraindications` DISABLE KEYS */;
/*!40000 ALTER TABLE `contraindications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dial`
--

DROP TABLE IF EXISTS `dial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dial` (
  `dialId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `label` varchar(80) NOT NULL,
  `rank` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dialId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dial`
--

LOCK TABLES `dial` WRITE;
/*!40000 ALTER TABLE `dial` DISABLE KEYS */;
INSERT INTO `dial` VALUES (6,48,'1-705-789-1277','Home',0),(7,48,'123-4567','Test',0),(8,48,'647-929-4949','Dave',0),(10,50,'747 747 7474','Test',0),(12,48,'7778889','Example',0);
/*!40000 ALTER TABLE `dial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mmse`
--

DROP TABLE IF EXISTS `mmse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mmse` (
  `mmseId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `orientation1` int(11) NOT NULL,
  `orientation2` int(11) NOT NULL,
  `registration` int(11) NOT NULL,
  `attention` int(11) NOT NULL,
  `recall` int(11) NOT NULL,
  `language1` int(11) NOT NULL,
  `language2` int(11) NOT NULL,
  `language3` int(11) NOT NULL,
  `language4` int(11) NOT NULL,
  `language5` int(11) NOT NULL,
  `language6` int(11) NOT NULL,
  PRIMARY KEY (`mmseId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mmse`
--

LOCK TABLES `mmse` WRITE;
/*!40000 ALTER TABLE `mmse` DISABLE KEYS */;
INSERT INTO `mmse` VALUES (1,10,1,2,1,1,1,1,1,1,1,1,0);
/*!40000 ALTER TABLE `mmse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moca`
--

DROP TABLE IF EXISTS `moca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `moca` (
  `mocaId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `executive` int(11) NOT NULL,
  `naming` int(11) NOT NULL,
  `memory` int(11) NOT NULL,
  `attention1` int(11) NOT NULL,
  `attention2` int(11) NOT NULL,
  `attention3` int(11) NOT NULL,
  `language1` int(11) NOT NULL,
  `language2` int(11) NOT NULL,
  `abstraction` int(11) NOT NULL,
  `delayedRecall` int(11) NOT NULL,
  `orientation` int(11) NOT NULL,
  `education` int(11) NOT NULL,
  PRIMARY KEY (`mocaId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moca`
--

LOCK TABLES `moca` WRITE;
/*!40000 ALTER TABLE `moca` DISABLE KEYS */;
INSERT INTO `moca` VALUES (3,10,1,1,0,1,1,1,1,1,1,1,1,1);
/*!40000 ALTER TABLE `moca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `noteId` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) DEFAULT NULL,
  `lastUpdated` datetime NOT NULL,
  `byUserId` int(11) NOT NULL,
  `forUserId` int(11) NOT NULL,
  `patientVisible` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`noteId`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (54,'Tatiana is having difficulty preparing dinner unless the radio is playing','2015-11-09 22:34:38',58,10,'0'),(55,'Tatiana enjoys cooking for events at the legion','2015-06-05 10:30:00',25,10,'0'),(56,'Be sure to separate the recycling, she can become quite upset','2015-09-03 10:30:00',25,10,'0'),(57,'I need some help with buying gardening tools','2015-11-09 22:52:01',58,58,'0'),(58,'Test','2015-11-13 13:43:18',58,58,'0'),(59,'aasdf','2015-12-31 22:26:09',58,48,'0'),(60,'test','2015-12-31 22:29:38',58,48,'0'),(61,'asdf','2015-12-31 22:35:09',58,50,'0'),(62,'asdf','2015-12-31 22:36:42',58,50,'0'),(63,'asdfasfd','2015-12-31 22:38:16',58,50,'0'),(64,'testtest','2015-12-31 22:38:33',58,50,'0'),(65,'asdfasfd','2015-12-31 22:38:35',58,50,'0'),(66,'one','2015-12-31 22:42:43',58,50,'0'),(67,'test','2015-12-31 22:44:04',58,45,'0'),(68,'hello','2015-12-31 22:44:36',58,45,'0'),(69,'This is an example note, it was shown that example notes have interesting content and are full of words like this one.','2015-12-31 22:56:44',58,50,'0'),(70,'test','2016-01-01 01:11:52',58,50,'0'),(71,'Happy New Year','2016-01-01 01:50:35',58,50,'0'),(72,'Test','2016-01-01 01:54:49',58,50,'0'),(73,'Test2','2016-01-01 01:55:23',58,50,'0'),(74,'a','2016-01-01 01:55:32',58,50,'0'),(75,'b','2016-01-01 01:55:38',58,50,'0'),(76,'c','2016-01-01 01:55:43',58,50,'0'),(77,'d','2016-01-01 01:55:47',58,50,'0'),(78,'e','2016-01-01 02:34:26',58,50,'0'),(79,'f','2016-01-01 02:34:30',58,50,'0'),(80,'This is an example note.  Notes are so much fun because they have words that people can read whenever they want if the note is there.','2016-01-02 03:09:02',58,48,'0'),(81,'Test','2016-01-13 01:41:50',58,50,'0'),(82,'Test','2016-01-25 15:47:30',58,48,'0');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `place`
--

DROP TABLE IF EXISTS `place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `place` (
  `placeId` int(11) NOT NULL AUTO_INCREMENT,
  `placeName` varchar(200) NOT NULL,
  `address` varchar(400) NOT NULL,
  `lat` decimal(15,12) NOT NULL,
  `lng` decimal(15,12) NOT NULL,
  PRIMARY KEY (`placeId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place`
--

LOCK TABLES `place` WRITE;
/*!40000 ALTER TABLE `place` DISABLE KEYS */;
INSERT INTO `place` VALUES (1,'Bay St','1235 Bay St, Toronto, ON M5R 3K4, Canada',43.670957200000,-79.389824500000),(2,'222 Queen','222 Queen St W, Toronto, ON M5V 1Z3, Canada',43.650442600000,-79.389548800000),(3,'123Y2','123 Yonge St, Toronto, ON M5C, Canada',43.650893000000,-79.378381000000),(4,'College','1234 College St, Toronto, ON M6H 3S3, Canada',43.651630800000,-79.437782800000),(5,'Down the road','1234 College St, Toronto, ON M6H 3S3, Canada',43.651630800000,-79.437782800000),(6,'343','343 King St W, Toronto, ON M5V 1J5, Canada',43.645994000000,-79.391596100000),(7,'434','434 Bloor St W, Toronto, ON M5S 1X5, Canada',43.665863900000,-79.408421600000),(8,'834 whereever','Whernside Terrace, Kanata, ON, Canada',45.349478600000,-75.946106900000),(9,'333 here','333 Front St W, Toronto, ON M5V 3A4, Canada',43.643584600000,-79.390346900000),(10,'7373 something','7373 Kennedy Rd, Markham, ON L3R 1H6, Canada',43.833793700000,-79.303126000000);
/*!40000 ALTER TABLE `place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registration` (
  `registrationId` varchar(100) NOT NULL,
  `registrationDate` datetime NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phoneNumber` varchar(100) NOT NULL,
  `wasEmailed` char(1) NOT NULL DEFAULT 'N',
  `hasRegistered` char(1) NOT NULL DEFAULT 'N',
  `registrationLink` varchar(200) NOT NULL,
  PRIMARY KEY (`registrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration`
--

LOCK TABLES `registration` WRITE;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
INSERT INTO `registration` VALUES ('09f043304abdd99d77175c9129d710f8','2015-11-19 04:01:28','Dave MacDonald','mindlapse@gmail.com','647-929-4949','N','Y','http://52.88.50.116:7000/register?id=09f043304abdd99d77175c9129d710f8'),('a39bc89c748b998e3abaeed737263981','2015-11-19 04:20:17','Tatiana','zhukovskaya.tatyana@gmail.com','647-280-4016','N','Y','http://52.88.50.116:7000/register?id=a39bc89c748b998e3abaeed737263981'),('bfc66bc63058c5f1d1f21beee8c6375a','2015-11-19 03:37:55','Dave MacDonald','mindlapse@gmail.com','647-929-4949','N','N','http://52.88.50.116:7000/register?id=bfc66bc63058c5f1d1f21beee8c6375a');
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule` (
  `schedId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) CHARACTER SET latin1 NOT NULL,
  `description` varchar(1000) CHARACTER SET latin1 NOT NULL,
  `toUserId` int(11) NOT NULL,
  `fromUserId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `date` datetime NOT NULL,
  `completed` int(11) NOT NULL DEFAULT '0',
  `directions` varchar(1000) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`schedId`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,'Buy some groceries','Milk, eggs, cereal',10,58,'1970-01-01 16:00:00','2015-11-09 05:00:00',1,'585 Queen St W, Toronto, ON M5V 2B7'),(2,'Visit Dr. Wesson','Your appointment is coming up!',10,58,'1970-01-01 16:00:00','2015-11-09 05:00:00',0,'585 Queen St W, Toronto, ON M5V 2B7'),(26,'Bring muffins to the bake sale','Have lots of fun!',10,58,'1970-01-01 22:00:00','2015-11-10 05:00:00',1,NULL),(27,'Test','Test',10,58,'1970-01-01 20:57:00','2015-11-09 05:00:00',0,'Test'),(28,'Test','Test',58,58,'1970-01-01 23:48:00','2015-11-09 05:00:00',0,'123 main st');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tagId` varchar(100) DEFAULT NULL,
  `redirectURL` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tagId` (`tagId`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (19,'MTE4MTUz','http://52.88.50.116:7000/?tagId=MTE4MTUz',NULL),(20,'MDhkY2Iy','http://52.88.50.116:7000/?tagId=MDhkY2Iy',NULL),(21,'MGM1ZjFl','http://52.88.50.116:7000/?tagId=MGM1ZjFl',NULL),(22,'Yzk1N2U0','http://52.88.50.116:7000/?tagId=Yzk1N2U0',NULL),(23,'ZTNiMTI2','http://52.88.50.116:7000/?tagId=ZTNiMTI2','laundry'),(24,'MjQ3ZDhk','http://52.88.50.116:7000/?tagId=MjQ3ZDhk',NULL),(25,'YTUxNjA1','http://52.88.50.116:7000/?tagId=YTUxNjA1',NULL),(26,'MDVmNDc1','http://52.88.50.116:7000/?tagId=MDVmNDc1',NULL),(27,'ODIxNjAw','http://52.88.50.116:7000/?tagId=ODIxNjAw',NULL),(28,'N2NjOWY3','http://52.88.50.116:7000/?tagId=N2NjOWY3',NULL),(29,'NWI0Yzlm','http://52.88.50.116:7000/?tagId=NWI0Yzlm',NULL),(30,'MDY3ZThj','http://52.88.50.116:7000/?tagId=MDY3ZThj',NULL),(31,'NTcxZGY0','http://52.88.50.116:7000/?tagId=NTcxZGY0',NULL),(32,'ZDk1OWZj','http://52.88.50.116:7000/?tagId=ZDk1OWZj',NULL),(33,'MmU4MmM3','http://52.88.50.116:7000/?tagId=MmU4MmM3',NULL),(34,'NzIxZjIw','http://52.88.50.116:7000/?tagId=NzIxZjIw',NULL),(35,'ZTNiNTVm','http://52.88.50.116:7000/?tagId=ZTNiNTVm',NULL),(36,'ZDg3MTdh','http://52.88.50.116:7000/?tagId=ZDg3MTdh',NULL),(37,'MDZkYjg1','http://52.88.50.116:7000/?tagId=MDZkYjg1',NULL),(38,'YjEwZTg1','http://52.88.50.116:7000/?tagId=YjEwZTg1','laundry'),(39,'YWMyOTNh','http://52.88.50.116:7000/?tagId=YWMyOTNh',NULL),(40,'Zjc5OGQw','http://52.88.50.116:7000/?tagId=Zjc5OGQw',NULL),(41,'YzQyM2Rm','http://52.88.50.116:7000/?tagId=YzQyM2Rm',NULL),(42,'MzEzYWYy','http://52.88.50.116:7000/?tagId=MzEzYWYy',NULL),(43,'ODdmYWRi','http://52.88.50.116:7000/?tagId=ODdmYWRi',NULL),(44,'MDBjOGZh','http://52.88.50.116:7000/?tagId=MDBjOGZh',NULL),(45,NULL,'http://52.88.50.116:7000/?tagId=undefined',NULL),(46,NULL,'http://52.88.50.116:7000/?tagId=undefined',NULL),(47,NULL,'http://52.88.50.116:7000/?tagId=undefined',NULL),(48,'NzgxMDA0','http://52.88.50.116:7000/?tagId=NzgxMDA0',NULL),(50,'ZTIxNDc2','http://52.88.50.116:7000/?tagId=ZTIxNDc2',NULL),(51,'NzM0NmRl','http://52.88.50.116:7000/?tagId=NzM0NmRl','laundry'),(53,'MTVkYmZh','http://52.88.50.116:7000/?tagId=MTVkYmZh',NULL);
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tap`
--

DROP TABLE IF EXISTS `tap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tap` (
  `tapId` int(11) NOT NULL AUTO_INCREMENT,
  `tappedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fromUser` int(11) DEFAULT NULL,
  `toUser` int(11) DEFAULT NULL,
  PRIMARY KEY (`tapId`)
) ENGINE=InnoDB AUTO_INCREMENT=556 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tap`
--

LOCK TABLES `tap` WRITE;
/*!40000 ALTER TABLE `tap` DISABLE KEYS */;
INSERT INTO `tap` VALUES (1,'2015-09-08 19:03:50',NULL,1),(2,'2015-09-08 19:10:21',NULL,3),(3,'2015-09-08 19:12:13',NULL,3),(4,'2015-09-08 19:12:21',NULL,3),(5,'2015-09-08 21:14:33',NULL,6),(6,'2015-09-08 21:16:29',NULL,6),(7,'2015-09-08 21:16:34',NULL,6),(8,'2015-09-08 21:18:29',NULL,6),(9,'2015-09-08 21:21:03',NULL,6),(10,'2015-09-08 21:21:07',NULL,6),(11,'2015-09-08 21:23:08',NULL,6),(12,'2015-09-08 21:33:20',NULL,6),(13,'2015-09-08 21:35:07',NULL,6),(14,'2015-09-08 21:36:34',NULL,6),(15,'2015-09-08 21:37:43',NULL,6),(16,'2015-09-08 21:40:16',6,6),(17,'2015-09-08 21:42:15',6,6),(18,'2015-09-08 21:46:09',6,6),(19,'2015-09-08 21:51:21',6,6),(20,'2015-09-08 21:51:33',6,6),(21,'2015-09-08 21:52:37',6,6),(22,'2015-09-08 21:53:31',5,5),(23,'2015-09-08 21:53:54',5,6),(24,'2015-09-08 22:18:39',5,6),(25,'2015-09-08 22:25:03',6,6),(26,'2015-09-08 22:28:23',6,6),(27,'2015-09-08 22:32:04',6,6),(28,'2015-09-08 22:32:20',6,6),(29,'2015-09-08 22:33:58',6,6),(30,'2015-09-08 22:34:06',6,6),(31,'2015-09-08 22:35:06',6,6),(32,'2015-09-08 22:35:40',6,5),(33,'2015-09-08 22:35:49',6,5),(34,'2015-09-08 22:47:38',6,6),(35,'2015-09-08 22:47:46',6,5),(36,'2015-09-08 22:48:18',6,5),(37,'2015-09-08 22:49:59',6,5),(38,'2015-09-08 22:50:50',6,5),(39,'2015-09-08 22:54:16',6,5),(40,'2015-09-08 22:54:42',6,5),(41,'2015-09-08 22:55:18',6,5),(42,'2015-09-08 22:56:36',6,5),(43,'2015-09-08 22:57:03',5,6),(44,'2015-09-09 00:26:37',8,8),(45,'2015-09-09 00:26:46',8,8),(46,'2015-09-09 00:30:06',9,9),(47,'2015-09-09 00:32:16',10,10),(48,'2015-09-09 00:32:38',10,10),(49,'2015-09-09 00:32:43',10,9),(50,'2015-09-09 00:34:17',10,10),(51,'2015-09-09 00:37:42',9,9),(52,'2015-09-09 01:39:01',9,9),(53,'2015-09-09 01:41:30',9,9),(54,'2015-09-09 03:15:46',10,10),(55,'2015-09-09 11:48:15',10,9),(56,'2015-09-09 13:50:00',10,9),(57,'2015-09-09 16:21:59',10,10),(58,'2015-09-09 22:56:26',9,9),(59,'2015-09-10 02:21:45',9,9),(60,'2015-09-10 02:34:31',9,9),(61,'2015-09-10 02:37:18',9,9),(62,'2015-09-21 11:33:55',9,9),(63,'2015-09-21 14:34:12',9,9),(64,'2015-09-21 14:34:20',9,9),(65,'2015-09-21 15:53:15',9,9),(66,'2015-09-26 22:10:13',15,15),(67,'2015-09-26 22:19:50',15,15),(68,'2015-09-27 01:26:19',15,15),(69,'2015-09-27 01:36:08',15,15),(70,'2015-09-27 01:50:26',15,15),(71,'2015-09-27 01:50:39',15,15),(72,'2015-09-27 01:51:17',15,15),(73,'2015-09-27 01:52:02',15,15),(74,'2015-09-27 01:54:52',15,15),(75,'2015-09-27 02:03:05',15,15),(76,'2015-09-27 03:24:37',15,15),(77,'2015-09-27 03:25:01',15,15),(78,'2015-09-27 04:37:30',15,15),(79,'2015-09-27 05:17:23',15,15),(80,'2015-09-27 05:17:38',15,15),(81,'2015-09-27 05:20:30',15,15),(82,'2015-09-27 06:32:08',15,15),(83,'2015-09-27 06:33:16',15,15),(84,'2015-09-27 06:33:44',15,15),(85,'2015-09-29 21:22:45',10,10),(86,'2015-09-29 21:33:12',10,10),(87,'2015-09-29 21:43:40',10,10),(88,'2015-09-29 21:50:22',10,10),(89,'2015-09-29 21:50:26',10,10),(90,'2015-09-30 02:48:38',15,16),(91,'2015-09-30 02:48:52',15,16),(92,'2015-09-30 02:49:55',15,15),(93,'2015-09-30 02:53:34',15,15),(94,'2015-09-30 03:03:04',15,15),(95,'2015-09-30 03:06:08',15,15),(96,'2015-09-30 03:09:36',15,15),(97,'2015-09-30 03:11:24',15,15),(98,'2015-09-30 03:11:53',15,15),(99,'2015-09-30 03:12:06',15,15),(100,'2015-09-30 04:56:41',10,10),(101,'2015-09-30 10:29:18',10,10),(102,'2015-09-30 10:29:38',10,10),(103,'2015-09-30 17:31:03',10,10),(104,'2015-09-30 17:31:32',10,10),(105,'2015-09-30 20:19:52',15,15),(106,'2015-10-01 00:09:06',15,15),(107,'2015-10-01 00:11:01',15,15),(108,'2015-10-01 00:30:12',15,16),(109,'2015-10-01 00:33:03',15,15),(110,'2015-10-01 00:48:24',10,15),(111,'2015-10-01 00:48:43',15,15),(112,'2015-10-01 00:48:44',10,15),(113,'2015-10-01 00:48:49',10,10),(114,'2015-10-01 00:49:52',15,15),(115,'2015-10-01 00:51:20',10,10),(116,'2015-10-01 01:06:04',15,10),(117,'2015-10-01 02:19:15',15,15),(118,'2015-10-01 02:19:25',15,15),(119,'2015-10-01 02:52:34',15,15),(120,'2015-10-02 03:13:07',16,16),(121,'2015-10-02 03:48:24',15,15),(122,'2015-10-02 03:50:44',15,15),(123,'2015-10-02 03:51:18',15,15),(124,'2015-10-02 03:58:26',15,15),(125,'2015-10-02 04:01:15',15,15),(126,'2015-10-02 04:01:30',15,15),(127,'2015-10-02 04:01:47',15,15),(128,'2015-10-02 04:02:48',15,15),(129,'2015-10-02 04:10:19',15,15),(130,'2015-10-02 04:17:24',15,15),(131,'2015-10-02 04:17:45',15,15),(132,'2015-10-02 04:18:28',15,15),(133,'2015-10-02 04:18:55',15,15),(134,'2015-10-02 04:19:08',15,15),(135,'2015-10-02 04:19:32',15,15),(136,'2015-10-02 04:20:01',15,15),(137,'2015-10-02 04:20:45',15,15),(138,'2015-10-02 04:22:17',15,15),(139,'2015-10-02 04:22:40',15,15),(140,'2015-10-02 12:05:47',10,15),(141,'2015-10-03 00:42:59',15,15),(142,'2015-10-03 00:51:36',15,15),(143,'2015-10-03 00:52:02',15,15),(144,'2015-10-03 00:52:19',15,15),(145,'2015-10-03 00:55:14',15,15),(146,'2015-10-03 00:55:26',15,15),(147,'2015-10-03 00:56:48',15,15),(148,'2015-10-03 01:12:09',15,15),(149,'2015-10-03 01:13:33',15,15),(150,'2015-10-03 01:45:12',15,15),(151,'2015-10-03 01:46:07',15,15),(152,'2015-10-03 01:46:24',15,15),(153,'2015-10-03 01:46:35',15,15),(154,'2015-10-03 02:47:12',15,15),(155,'2015-10-03 02:58:11',15,15),(156,'2015-10-05 01:24:06',15,15),(157,'2015-10-05 02:27:01',15,15),(158,'2015-10-05 02:37:45',15,15),(159,'2015-10-05 02:46:21',15,15),(160,'2015-10-05 02:48:09',15,15),(161,'2015-10-05 02:49:53',15,15),(162,'2015-10-05 02:53:43',15,15),(163,'2015-10-05 02:54:22',15,15),(164,'2015-10-05 02:56:57',15,15),(165,'2015-10-05 03:04:25',15,15),(166,'2015-10-05 03:06:32',15,15),(167,'2015-10-05 03:07:32',15,15),(168,'2015-10-05 03:09:43',15,15),(169,'2015-10-05 03:10:08',15,15),(170,'2015-10-05 03:10:18',15,15),(171,'2015-10-05 03:13:45',15,15),(172,'2015-10-05 03:14:24',15,15),(173,'2015-10-05 03:14:32',15,15),(174,'2015-10-05 03:15:13',15,15),(175,'2015-10-05 03:17:16',15,15),(176,'2015-10-05 03:17:27',15,15),(177,'2015-10-05 03:28:15',15,15),(178,'2015-10-05 03:29:04',15,15),(179,'2015-10-05 03:31:36',15,15),(180,'2015-10-05 03:32:10',15,15),(181,'2015-10-05 03:32:18',15,15),(182,'2015-10-05 03:33:23',15,15),(183,'2015-10-05 03:33:51',15,15),(184,'2015-10-05 03:35:16',15,15),(185,'2015-10-05 03:37:03',15,15),(186,'2015-10-05 03:37:32',15,15),(187,'2015-10-05 03:37:49',15,15),(188,'2015-10-05 03:38:07',15,15),(189,'2015-10-05 03:38:56',15,15),(190,'2015-10-05 03:39:37',15,15),(191,'2015-10-05 03:40:53',15,15),(192,'2015-10-05 03:57:14',15,15),(193,'2015-10-05 14:10:12',15,15),(194,'2015-10-05 14:10:30',15,15),(195,'2015-10-05 14:10:43',15,15),(196,'2015-10-05 14:11:05',15,15),(197,'2015-10-05 14:11:24',15,15),(198,'2015-10-07 00:33:21',15,15),(199,'2015-10-07 01:33:33',15,15),(200,'2015-10-07 01:33:54',15,15),(201,'2015-10-07 01:36:10',15,15),(202,'2015-10-07 01:38:09',15,15),(203,'2015-10-07 01:38:09',15,15),(204,'2015-10-07 01:39:00',15,15),(205,'2015-10-07 01:39:00',15,15),(206,'2015-10-07 01:39:11',15,15),(207,'2015-10-07 01:41:11',15,15),(208,'2015-10-07 01:42:11',15,15),(209,'2015-10-07 01:44:46',15,15),(210,'2015-10-07 01:45:46',15,15),(211,'2015-10-07 01:46:05',15,15),(212,'2015-10-07 01:47:35',15,15),(213,'2015-10-07 01:48:55',15,15),(214,'2015-10-07 01:49:31',15,15),(215,'2015-10-07 01:50:55',15,15),(216,'2015-10-07 01:52:15',15,15),(217,'2015-10-07 01:55:04',15,15),(218,'2015-10-07 01:56:57',15,15),(219,'2015-10-07 02:00:32',15,15),(220,'2015-10-07 02:01:18',15,15),(221,'2015-10-07 02:01:39',15,15),(222,'2015-10-08 01:44:32',15,15),(223,'2015-10-08 01:53:38',15,15),(224,'2015-10-08 01:56:19',15,15),(225,'2015-10-08 02:59:52',15,15),(226,'2015-10-08 03:01:04',15,15),(227,'2015-10-08 03:04:05',15,15),(228,'2015-10-08 03:05:59',15,15),(229,'2015-10-08 03:27:09',15,15),(230,'2015-10-08 03:27:41',15,15),(231,'2015-10-08 03:30:52',15,15),(232,'2015-10-08 03:31:50',15,15),(233,'2015-10-08 03:35:49',15,15),(234,'2015-10-10 02:24:41',15,15),(235,'2015-10-10 02:26:27',15,15),(236,'2015-10-10 23:17:35',16,16),(237,'2015-10-10 23:21:09',16,16),(238,'2015-10-10 23:59:55',15,15),(239,'2015-10-11 00:12:42',15,15),(240,'2015-10-11 00:19:35',15,15),(241,'2015-10-11 00:21:30',15,15),(242,'2015-10-11 00:25:50',15,15),(243,'2015-10-11 00:52:07',15,15),(244,'2015-10-11 00:52:41',15,15),(245,'2015-10-11 00:55:28',15,15),(246,'2015-10-11 01:04:12',15,15),(247,'2015-10-11 01:14:09',15,15),(248,'2015-10-11 01:16:55',15,15),(249,'2015-10-11 01:17:10',15,15),(250,'2015-10-11 01:17:52',15,15),(251,'2015-10-11 14:42:09',15,15),(252,'2015-10-11 14:47:27',15,15),(253,'2015-10-11 14:49:21',15,15),(254,'2015-10-11 14:50:10',15,15),(255,'2015-10-11 14:50:33',15,15),(256,'2015-10-11 14:52:05',15,15),(257,'2015-10-11 14:54:00',15,15),(258,'2015-10-11 15:01:13',15,15),(259,'2015-10-11 15:02:11',15,15),(260,'2015-10-11 15:03:44',15,15),(261,'2015-10-11 15:04:38',15,15),(262,'2015-10-11 15:08:30',15,15),(263,'2015-10-11 15:14:34',15,15),(264,'2015-10-11 15:19:24',15,15),(265,'2015-10-11 15:22:28',15,15),(266,'2015-10-11 15:24:29',15,15),(267,'2015-10-11 15:28:34',15,15),(268,'2015-10-11 15:29:28',15,15),(269,'2015-10-11 15:31:50',15,15),(270,'2015-10-11 15:33:49',15,15),(271,'2015-10-11 15:34:07',15,15),(272,'2015-10-11 15:36:20',15,15),(273,'2015-10-11 15:38:14',15,15),(274,'2015-10-11 15:50:38',15,15),(275,'2015-10-11 15:51:58',15,15),(276,'2015-10-11 15:53:36',15,15),(277,'2015-10-11 15:54:54',15,15),(278,'2015-10-11 15:55:20',15,15),(279,'2015-10-11 15:55:31',15,15),(280,'2015-10-11 15:59:39',15,15),(281,'2015-10-11 16:00:32',15,15),(282,'2015-10-11 16:01:49',15,15),(283,'2015-10-11 16:07:09',15,15),(284,'2015-10-11 16:08:13',15,15),(285,'2015-10-11 16:09:04',15,15),(286,'2015-10-11 16:13:23',15,15),(287,'2015-10-11 16:46:31',15,15),(288,'2015-10-11 16:51:23',15,15),(289,'2015-10-11 17:06:41',15,15),(290,'2015-10-11 17:15:39',16,16),(291,'2015-10-11 17:17:39',16,16),(292,'2015-10-11 23:00:31',15,15),(293,'2015-10-11 23:00:58',15,15),(294,'2015-10-11 23:01:22',15,15),(295,'2015-10-11 23:01:34',15,15),(296,'2015-10-11 23:01:53',15,15),(297,'2015-10-11 23:02:33',15,15),(298,'2015-10-11 23:03:25',15,15),(299,'2015-10-11 23:15:19',15,15),(300,'2015-10-11 23:15:38',15,15),(301,'2015-10-11 23:16:04',15,15),(302,'2015-10-11 23:16:35',15,15),(303,'2015-10-11 23:16:58',15,15),(304,'2015-10-11 23:34:34',15,15),(305,'2015-10-12 02:02:43',15,15),(306,'2015-10-12 02:06:37',15,15),(307,'2015-10-12 02:07:28',15,15),(308,'2015-10-12 02:07:45',15,15),(309,'2015-10-12 02:10:11',15,15),(310,'2015-10-12 02:12:32',15,15),(311,'2015-10-12 02:13:23',15,15),(312,'2015-10-12 03:28:10',15,15),(313,'2015-10-12 03:28:23',15,15),(314,'2015-10-12 13:37:02',15,15),(315,'2015-10-12 14:10:41',15,15),(316,'2015-10-12 14:21:28',15,15),(317,'2015-10-12 14:21:35',15,15),(318,'2015-10-12 14:24:59',15,15),(319,'2015-10-12 14:26:22',15,15),(320,'2015-10-12 14:27:07',15,15),(321,'2015-10-12 14:27:17',15,15),(322,'2015-10-12 14:29:11',15,15),(323,'2015-10-12 14:52:55',15,15),(324,'2015-10-12 14:54:31',15,15),(325,'2015-10-12 18:19:06',15,15),(326,'2015-10-12 18:31:32',15,15),(327,'2015-10-12 18:37:44',15,15),(328,'2015-10-12 19:20:56',15,15),(329,'2015-10-12 19:21:10',15,15),(330,'2015-10-12 19:24:13',15,15),(331,'2015-10-12 19:26:39',15,15),(332,'2015-10-12 19:27:24',15,15),(333,'2015-10-12 19:28:40',15,15),(334,'2015-10-12 19:29:01',15,15),(335,'2015-10-17 05:41:09',15,15),(336,'2015-10-17 05:42:56',15,15),(337,'2015-10-17 05:44:28',15,15),(338,'2015-10-17 05:44:39',15,15),(339,'2015-10-17 05:47:11',15,15),(340,'2015-10-17 20:49:37',15,15),(341,'2015-10-17 20:49:58',15,15),(342,'2015-10-17 20:50:31',15,15),(343,'2015-10-17 20:50:51',15,15),(344,'2015-10-17 20:51:00',15,15),(345,'2015-10-17 21:13:46',15,15),(346,'2015-10-17 21:20:59',15,15),(347,'2015-10-17 22:32:46',15,15),(348,'2015-10-17 23:13:40',15,15),(349,'2015-10-18 00:47:14',15,15),(350,'2015-10-18 01:49:14',15,15),(351,'2015-10-18 21:02:24',15,15),(352,'2015-10-18 21:05:05',15,15),(353,'2015-10-18 21:05:29',15,15),(354,'2015-10-18 21:06:07',15,15),(355,'2015-10-18 21:07:34',15,15),(356,'2015-10-18 21:08:47',15,15),(357,'2015-10-18 21:12:36',15,15),(358,'2015-10-18 21:18:05',15,15),(359,'2015-10-18 21:36:16',15,15),(360,'2015-10-18 21:39:06',15,15),(361,'2015-10-18 21:39:44',15,15),(362,'2015-10-18 21:40:00',15,15),(363,'2015-10-18 22:14:12',15,15),(364,'2015-10-18 22:14:44',15,15),(365,'2015-10-18 22:24:02',15,15),(366,'2015-10-18 22:30:44',15,15),(367,'2015-10-18 22:31:18',15,15),(368,'2015-10-18 22:33:45',15,15),(369,'2015-10-18 22:41:41',15,15),(370,'2015-10-18 23:11:24',15,15),(371,'2015-10-18 23:13:04',15,15),(372,'2015-10-18 23:19:35',15,15),(373,'2015-10-18 23:26:19',15,15),(374,'2015-10-18 23:28:52',15,15),(375,'2015-10-18 23:29:53',15,15),(376,'2015-10-18 23:30:16',15,15),(377,'2015-10-18 23:32:12',15,15),(378,'2015-10-18 23:43:24',15,15),(379,'2015-10-18 23:43:49',15,15),(380,'2015-10-18 23:44:13',15,15),(381,'2015-10-19 00:03:24',15,15),(382,'2015-10-19 00:24:02',15,15),(383,'2015-10-19 00:27:01',15,15),(384,'2015-10-19 00:28:44',15,15),(385,'2015-10-19 00:34:31',15,15),(386,'2015-10-19 00:36:51',15,15),(387,'2015-10-19 00:43:37',15,15),(388,'2015-10-19 00:44:38',15,15),(389,'2015-10-19 00:46:11',15,15),(390,'2015-10-19 00:49:03',15,15),(391,'2015-10-19 00:49:29',15,15),(392,'2015-10-19 00:50:06',15,15),(393,'2015-10-19 00:50:54',15,15),(394,'2015-10-19 00:52:53',15,15),(395,'2015-10-19 00:54:05',15,15),(396,'2015-10-19 00:54:39',15,15),(397,'2015-10-19 00:55:04',15,15),(398,'2015-10-19 01:01:27',15,15),(399,'2015-10-19 01:07:47',15,15),(400,'2015-10-19 01:08:43',15,15),(401,'2015-10-19 01:40:33',15,15),(402,'2015-10-19 02:50:33',15,15),(403,'2015-10-19 04:18:20',15,15),(404,'2015-10-19 04:28:05',15,15),(405,'2015-10-19 20:22:49',15,15),(406,'2015-10-24 19:56:07',15,15),(407,'2015-10-25 16:19:30',15,15),(408,'2015-10-25 16:31:32',15,15),(409,'2015-10-25 16:37:06',15,15),(410,'2015-10-25 16:38:10',15,15),(411,'2015-10-25 16:43:45',15,15),(412,'2015-10-25 16:46:40',15,15),(413,'2015-10-25 23:55:12',15,15),(414,'2015-10-26 01:06:37',15,15),(415,'2015-10-26 01:07:28',15,15),(416,'2015-10-26 01:08:08',15,15),(417,'2015-10-26 01:08:22',15,15),(418,'2015-10-26 01:12:08',15,15),(419,'2015-10-26 03:09:33',15,15),(420,'2015-10-26 03:53:45',15,15),(421,'2015-10-27 23:36:35',15,16),(422,'2015-10-27 23:46:53',15,16),(423,'2015-10-27 23:48:56',15,16),(424,'2015-10-27 23:50:50',15,16),(425,'2015-10-27 23:51:38',15,16),(426,'2015-10-27 23:57:28',15,16),(427,'2015-10-27 23:57:47',15,15),(428,'2015-10-28 00:00:31',15,16),(429,'2015-10-28 00:02:19',15,15),(430,'2015-10-28 00:39:41',15,15),(431,'2015-10-28 00:40:23',15,15),(432,'2015-10-28 00:43:11',15,15),(433,'2015-10-28 00:43:53',15,15),(434,'2015-10-28 00:45:43',15,15),(435,'2015-10-28 21:01:48',15,15),(436,'2015-10-28 21:41:23',15,16),(437,'2015-10-28 21:47:00',15,15),(438,'2015-10-28 21:51:41',15,10),(439,'2015-10-28 21:51:52',15,15),(440,'2015-10-28 21:52:55',15,16),(441,'2015-10-28 21:53:03',15,10),(442,'2015-10-28 21:53:33',15,15),(443,'2015-10-28 21:53:38',15,10),(444,'2015-10-28 21:53:46',15,16),(445,'2015-10-28 22:34:24',15,16),(446,'2015-10-28 22:34:40',15,10),(447,'2015-10-28 22:36:56',15,10),(448,'2015-10-28 22:45:38',15,15),(449,'2015-10-28 22:50:01',15,15),(450,'2015-10-28 22:50:45',15,15),(451,'2015-10-28 23:01:14',15,10),(452,'2015-10-29 00:03:29',15,16),(453,'2015-10-29 00:06:27',15,15),(454,'2015-10-29 00:17:07',15,15),(455,'2015-10-30 02:25:04',15,15),(456,'2015-10-30 02:39:34',15,15),(457,'2015-10-30 02:40:27',15,15),(458,'2015-10-30 02:41:21',15,15),(459,'2015-10-30 02:43:26',15,15),(460,'2015-10-30 02:43:41',15,15),(461,'2015-10-30 02:45:48',15,15),(462,'2015-10-30 02:47:06',15,15),(463,'2015-10-30 02:49:25',15,15),(464,'2015-10-30 02:53:36',15,15),(465,'2015-10-30 02:56:04',15,15),(466,'2015-10-30 03:12:03',15,15),(467,'2015-11-02 01:00:37',15,15),(468,'2015-11-02 01:34:59',15,15),(469,'2015-11-02 01:36:08',15,15),(470,'2015-11-02 01:37:06',15,15),(471,'2015-11-02 01:37:56',15,15),(472,'2015-11-02 01:38:35',15,15),(473,'2015-11-02 01:38:54',15,15),(474,'2015-11-02 01:44:57',15,15),(475,'2015-11-02 01:45:44',15,15),(476,'2015-11-02 01:46:03',15,15),(477,'2015-11-02 01:48:51',15,15),(478,'2015-11-02 01:49:39',15,15),(479,'2015-11-02 01:50:26',15,15),(480,'2015-11-02 01:50:57',15,15),(481,'2015-11-02 01:51:16',15,15),(482,'2015-11-02 01:51:31',15,15),(483,'2015-11-02 01:53:15',15,15),(484,'2015-11-02 01:54:40',15,15),(485,'2015-11-02 01:55:30',15,15),(486,'2015-11-02 01:55:54',15,15),(487,'2015-11-02 02:02:19',15,15),(488,'2015-11-02 02:02:43',15,15),(489,'2015-11-02 02:03:52',15,15),(490,'2015-11-02 02:06:46',15,15),(491,'2015-11-02 02:07:18',15,15),(492,'2015-11-02 02:09:15',15,15),(493,'2015-11-02 02:10:21',15,15),(494,'2015-11-02 02:11:47',15,15),(495,'2015-11-02 02:12:32',15,15),(496,'2015-11-02 02:14:04',15,15),(497,'2015-11-02 02:15:53',15,15),(498,'2015-11-02 02:16:51',15,15),(499,'2015-11-02 02:20:53',15,15),(500,'2015-11-02 02:24:18',15,15),(501,'2015-11-02 02:24:39',15,15),(502,'2015-11-02 02:26:08',15,15),(503,'2015-11-02 02:26:27',15,15),(504,'2015-11-02 02:27:28',15,15),(505,'2015-11-02 03:04:24',15,15),(506,'2015-11-02 03:06:58',15,15),(507,'2015-11-02 03:19:15',15,15),(508,'2015-11-02 03:20:54',15,15),(509,'2015-11-02 03:22:14',15,15),(510,'2015-11-02 03:23:24',15,15),(511,'2015-11-02 03:26:25',15,15),(512,'2015-11-02 03:27:11',15,15),(513,'2015-11-02 03:28:47',15,15),(514,'2015-11-02 03:30:26',15,15),(515,'2015-11-02 03:31:03',15,15),(516,'2015-11-02 03:33:40',15,15),(517,'2015-11-02 03:34:28',15,15),(518,'2015-11-02 03:35:29',15,15),(519,'2015-11-02 03:36:49',15,15),(520,'2015-11-02 03:38:39',15,15),(521,'2015-11-02 03:39:43',15,15),(522,'2015-11-02 03:40:44',15,15),(523,'2015-11-02 03:41:46',15,15),(524,'2015-11-02 03:42:02',15,15),(525,'2015-11-02 03:42:54',15,15),(526,'2015-11-02 03:43:26',15,15),(527,'2015-11-02 03:44:32',15,15),(528,'2015-11-02 03:45:02',15,15),(529,'2015-11-02 03:49:59',15,15),(530,'2015-11-02 03:52:12',15,15),(531,'2015-11-02 03:52:20',15,15),(532,'2015-11-02 03:53:34',15,15),(533,'2015-11-02 03:54:50',15,15),(534,'2015-11-02 03:56:39',15,15),(535,'2015-11-02 03:58:12',15,15),(536,'2015-11-02 03:59:35',15,15),(537,'2015-11-02 04:00:36',15,15),(538,'2015-11-02 04:02:07',15,15),(539,'2015-11-03 02:22:19',10,10),(540,'2015-11-03 02:24:22',10,10),(541,'2015-11-03 02:28:24',10,10),(542,'2015-11-03 02:37:32',10,10),(543,'2015-11-03 02:38:15',10,10),(544,'2015-11-03 02:39:24',10,10),(545,'2015-11-03 02:42:36',10,10),(546,'2015-11-03 02:44:31',10,10),(547,'2015-11-03 02:47:27',10,10),(548,'2015-11-03 02:57:09',15,15),(549,'2015-11-03 02:58:17',15,15),(550,'2015-11-03 03:15:30',15,15),(551,'2015-11-03 03:17:59',15,15),(552,'2015-11-03 03:18:30',15,15),(553,'2015-11-03 03:19:51',10,16),(554,'2015-11-03 03:29:38',10,10),(555,'2015-11-03 03:53:27',10,10);
/*!40000 ALTER TABLE `tap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `tagId` varchar(20) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `fbId` varchar(20) NOT NULL,
  `fbLink` varchar(128) DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `locale` varchar(20) DEFAULT NULL,
  `timezone` varchar(20) DEFAULT NULL,
  `patient` int(11) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `fbId` (`fbId`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (20,'MTE4MTUz','Alex Wilmer',NULL,'10154245576497565','https://www.facebook.com/app_scoped_user_id/10154245576497565/','patient',NULL,NULL,NULL,NULL,NULL),(45,'','Dorothy Ricewitz','dorothy_mmfauax_ricewitz@tfbnw.net','100010604295512',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(46,'','Nancy Sharpesen','nancy_kxqnxse_sharpesen@tfbnw.net','100010602135842',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(47,'','Harry Alisonman','harry_lxotghp_alisonman@tfbnw.net','100010594006520',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(48,'','Codi Allan','codi_dylfluy_allan@tfbnw.net','185226318497454',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(49,'','Mary Zuckerman','mary_tayjenl_zuckerman@tfbnw.net','100010207750652',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(50,'','John McDonaldsen','john_rtdhazz_mcdonaldsen@tfbnw.net','100010093093580',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(51,'','Harry Panditson','harry_uokkdhg_panditson@tfbnw.net','100010618214180',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(52,'','James Liangescu','james_encjwbs_liangescu@tfbnw.net','100009895249482',NULL,'patient',NULL,NULL,NULL,NULL,NULL),(58,'','Dave MacDonald','mindlapse@gmail.com','10153162607041397','https://www.facebook.com/app_scoped_user_id/10153162607041397/','admin','Dave','MacDonald','en_GB','-5',NULL),(59,'','Tatiana Zhukovskaya','zhukovskaya.tatyana@gmail.com','883264568417906','https://www.facebook.com/app_scoped_user_id/883264568417906/','admin','Tatiana','Zhukovskaya','ru_RU','-5',NULL),(60,'','Cynthia Nielsen','cynthia_aaivmhb_nielsen@tfbnw.net','100010652085474',NULL,'caregiver',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_allergy`
--

DROP TABLE IF EXISTS `user_allergy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_allergy` (
  `uaId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `allergyId` int(11) NOT NULL,
  PRIMARY KEY (`uaId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_allergy`
--

LOCK TABLES `user_allergy` WRITE;
/*!40000 ALTER TABLE `user_allergy` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_allergy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_patient`
--

DROP TABLE IF EXISTS `user_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_patient` (
  `upId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `patientId` int(11) NOT NULL,
  PRIMARY KEY (`upId`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_patient`
--

LOCK TABLES `user_patient` WRITE;
/*!40000 ALTER TABLE `user_patient` DISABLE KEYS */;
INSERT INTO `user_patient` VALUES (52,59,48),(53,59,50),(54,59,52),(55,59,47),(56,60,46),(57,60,48);
/*!40000 ALTER TABLE `user_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_place`
--

DROP TABLE IF EXISTS `user_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_place` (
  `upId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `placeId` int(11) NOT NULL,
  `label` varchar(80) NOT NULL,
  `rank` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`upId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_place`
--

LOCK TABLES `user_place` WRITE;
/*!40000 ALTER TABLE `user_place` DISABLE KEYS */;
INSERT INTO `user_place` VALUES (5,48,5,'Down the road',0),(8,48,9,'333 here',0),(9,48,10,'7373 something',0);
/*!40000 ALTER TABLE `user_place` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-21 17:30:02
