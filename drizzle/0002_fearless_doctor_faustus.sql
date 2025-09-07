DROP TABLE `userRoles`;--> statement-breakpoint
ALTER TABLE `users` ADD `roleId` int unsigned;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE set null ON UPDATE no action;