CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`empresa` text NOT NULL,
	`email` text NOT NULL,
	`telefone` text NOT NULL,
	`created_at` integer NOT NULL,
	`consent_version` text NOT NULL
);
