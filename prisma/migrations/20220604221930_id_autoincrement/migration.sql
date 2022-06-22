-- CreateTable
CREATE TABLE `volunteer` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `emailAddress` TEXT NULL,
    `fullName` TEXT NULL,
    `orgEmail` TEXT NULL,
    `ranks` TEXT NULL,
    `department_division` TEXT NULL,
    `departments` TEXT NULL,
    `activityStatus` TEXT NULL,
    `contract` TEXT NULL,
    `breakDuration` TEXT NULL,
    `strikes` INTEGER NULL,
    `discordTag` TEXT NULL,
    `roleID` INTEGER NULL,

    INDEX `roleID`(`roleID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
