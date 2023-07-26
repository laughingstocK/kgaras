/*
  Warnings:

  - The values [SUCCESSED] on the enum `Repair_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Repair` MODIFY `status` ENUM('CREATED', 'REPAIRING', 'DONE', 'FAILED') NOT NULL;
