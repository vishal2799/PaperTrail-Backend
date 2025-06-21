ALTER TABLE "users" ADD COLUMN "mobile" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_mobile_unique" UNIQUE("mobile");