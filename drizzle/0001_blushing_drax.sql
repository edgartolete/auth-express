CREATE TABLE `userRoles` (
	`userId` bigint unsigned NOT NULL,
	`roleId` int unsigned NOT NULL,
	CONSTRAINT `unique_resource_roles` UNIQUE(`userId`,`roleId`)
);
--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_resource_role_user` ON `userRoles` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_resource_role_resource` ON `userRoles` (`roleId`);