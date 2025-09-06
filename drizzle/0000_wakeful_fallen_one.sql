CREATE TABLE `actions` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`appId` tinyint unsigned NOT NULL,
	`code` varchar(10) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `actions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_app_action_code` UNIQUE(`appId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `apps` (
	`id` tinyint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `apps_id` PRIMARY KEY(`id`),
	CONSTRAINT `apps_code_unique` UNIQUE(`code`),
	CONSTRAINT `apps_name_unique` UNIQUE(`name`),
	CONSTRAINT `unique_apps_code` UNIQUE((lower(`code`))),
	CONSTRAINT `unique_apps_name` UNIQUE((lower(`name`)))
);
--> statement-breakpoint
CREATE TABLE `groupRoles` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`roleId` int unsigned NOT NULL,
	`groupId` int unsigned NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `groupRoles_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_group_roles` UNIQUE(`userId`,`roleId`,`groupId`)
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`appId` tinyint unsigned NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_app_group_name` UNIQUE(`appId`,(lower(`name`)))
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`avatarUrl` varchar(255),
	`avatarKey` varchar(255),
	`firstName` varchar(255),
	`lastName` varchar(255),
	`birthday` date,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resourceRolePermissions` (
	`roleId` int unsigned NOT NULL,
	`actionId` int unsigned NOT NULL,
	`resourceId` int unsigned NOT NULL,
	CONSTRAINT `unique_resource_role_permissions` UNIQUE(`roleId`,`actionId`,`resourceId`)
);
--> statement-breakpoint
CREATE TABLE `resourceRoles` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`roleId` int unsigned NOT NULL,
	`resourceId` int unsigned NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resourceRoles_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_resource_roles` UNIQUE(`userId`,`resourceId`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`appId` tinyint unsigned NOT NULL,
	`groupId` int unsigned,
	`name` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_app_resource` UNIQUE(`appId`,`groupId`,(lower(`name`)))
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`appId` tinyint unsigned NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(50) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_app_role_code` UNIQUE(`appId`,(lower(`code`))),
	CONSTRAINT `unique_app_role_name` UNIQUE(`appId`,(lower(`name`)))
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`refreshToken` varchar(255) NOT NULL,
	`ipAddress` varchar(255) NOT NULL,
	`userAgent` varchar(1024) NOT NULL,
	`expiryDate` datetime NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_refreshToken_unique` UNIQUE(`refreshToken`),
	CONSTRAINT `unique_session_refresh_token` UNIQUE(`refreshToken`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`appId` tinyint unsigned NOT NULL,
	`username` varchar(50) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_app_username` UNIQUE(`appId`,(lower(`username`))),
	CONSTRAINT `unique_app_email` UNIQUE(`appId`,(lower(`email`)))
);
--> statement-breakpoint
ALTER TABLE `actions` ADD CONSTRAINT `actions_appId_apps_id_fk` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupRoles` ADD CONSTRAINT `groupRoles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupRoles` ADD CONSTRAINT `groupRoles_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupRoles` ADD CONSTRAINT `groupRoles_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groups` ADD CONSTRAINT `groups_appId_apps_id_fk` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourceRolePermissions` ADD CONSTRAINT `resourceRolePermissions_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourceRolePermissions` ADD CONSTRAINT `resourceRolePermissions_actionId_actions_id_fk` FOREIGN KEY (`actionId`) REFERENCES `actions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourceRolePermissions` ADD CONSTRAINT `resourceRolePermissions_resourceId_resources_id_fk` FOREIGN KEY (`resourceId`) REFERENCES `resources`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourceRoles` ADD CONSTRAINT `resourceRoles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourceRoles` ADD CONSTRAINT `resourceRoles_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourceRoles` ADD CONSTRAINT `resourceRoles_resourceId_resources_id_fk` FOREIGN KEY (`resourceId`) REFERENCES `resources`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resources` ADD CONSTRAINT `resources_appId_apps_id_fk` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resources` ADD CONSTRAINT `resources_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_appId_apps_id_fk` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_appId_apps_id_fk` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_action_code` ON `actions` (`code`);--> statement-breakpoint
CREATE INDEX `idx_app_code` ON `apps` (`code`);--> statement-breakpoint
CREATE INDEX `idx_group_roles_user_id` ON `groupRoles` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_group_roles_role_id` ON `groupRoles` (`roleId`);--> statement-breakpoint
CREATE INDEX `idx_group_roles_group_id` ON `groupRoles` (`groupId`);--> statement-breakpoint
CREATE INDEX `idx_profile_user_id` ON `profiles` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_resource_role_permissions_role` ON `resourceRolePermissions` (`roleId`);--> statement-breakpoint
CREATE INDEX `idx_resource_role_permissions_resource` ON `resourceRolePermissions` (`resourceId`);--> statement-breakpoint
CREATE INDEX `idx_resource_role_user` ON `resourceRoles` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_resource_role_resource` ON `resourceRoles` (`resourceId`);--> statement-breakpoint
CREATE INDEX `idx_resources_group` ON `resources` (`groupId`);--> statement-breakpoint
CREATE INDEX `idx_user_username` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `users` (`email`);