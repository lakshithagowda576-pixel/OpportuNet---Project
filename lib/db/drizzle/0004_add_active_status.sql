CREATE TABLE IF NOT EXISTS "jobs_new" AS SELECT *, true as active FROM "jobs";
DROP TABLE "jobs";
ALTER TABLE "jobs_new" RENAME TO "jobs";

-- Add the active column constraint
ALTER TABLE "jobs" ALTER COLUMN "active" SET DEFAULT true;
ALTER TABLE "jobs" ALTER COLUMN "active" SET NOT NULL;
