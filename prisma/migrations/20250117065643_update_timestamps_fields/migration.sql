/*
  Warnings:

  - Made the column `createdAt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;
