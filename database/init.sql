CREATE TABLE `Repair` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requestId` varchar(191) NOT NULL,
  `status` enum('CREATED','REPAIRING','DONE','FAILED') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;