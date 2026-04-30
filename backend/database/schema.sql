-- =============================================================================
-- Smart Garment - Database Schema (SQLite)
-- =============================================================================
-- Generated from the current Laravel migrations in backend/database/migrations.
-- Target dialect: SQLite (matches DB_CONNECTION=sqlite used by the project).
--
-- Usage:
--   sqlite3 database.sqlite < schema.sql
-- =============================================================================

PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

-- -----------------------------------------------------------------------------
-- Laravel framework tables
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "migrations" (
    "id"        integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "migration" varchar NOT NULL,
    "batch"     integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
    "id"                integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name"              varchar NOT NULL,
    "email"             varchar NOT NULL,
    "email_verified_at" datetime,
    "password"          varchar NOT NULL,
    "remember_token"    varchar,
    "created_at"        datetime,
    "updated_at"        datetime
);
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "email"      varchar NOT NULL,
    "token"      varchar NOT NULL,
    "created_at" datetime,
    PRIMARY KEY ("email")
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "id"            varchar NOT NULL,
    "user_id"       integer,
    "ip_address"    varchar,
    "user_agent"    text,
    "payload"       text NOT NULL,
    "last_activity" integer NOT NULL,
    PRIMARY KEY ("id")
);
CREATE INDEX "sessions_user_id_index"       ON "sessions" ("user_id");
CREATE INDEX "sessions_last_activity_index" ON "sessions" ("last_activity");

CREATE TABLE IF NOT EXISTS "cache" (
    "key"        varchar NOT NULL,
    "value"      text NOT NULL,
    "expiration" integer NOT NULL,
    PRIMARY KEY ("key")
);
CREATE INDEX "cache_expiration_index" ON "cache" ("expiration");

CREATE TABLE IF NOT EXISTS "cache_locks" (
    "key"        varchar NOT NULL,
    "owner"      varchar NOT NULL,
    "expiration" integer NOT NULL,
    PRIMARY KEY ("key")
);
CREATE INDEX "cache_locks_expiration_index" ON "cache_locks" ("expiration");

CREATE TABLE IF NOT EXISTS "jobs" (
    "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "queue"        varchar NOT NULL,
    "payload"      text NOT NULL,
    "attempts"     integer NOT NULL,
    "reserved_at"  integer,
    "available_at" integer NOT NULL,
    "created_at"   integer NOT NULL
);
CREATE INDEX "jobs_queue_reserved_at_available_at_index" ON "jobs" ("queue", "reserved_at", "available_at");

CREATE TABLE IF NOT EXISTS "job_batches" (
    "id"            varchar NOT NULL,
    "name"          varchar NOT NULL,
    "total_jobs"    integer NOT NULL,
    "pending_jobs"  integer NOT NULL,
    "failed_jobs"   integer NOT NULL,
    "failed_job_ids" text NOT NULL,
    "options"       text,
    "cancelled_at"  integer,
    "created_at"    integer NOT NULL,
    "finished_at"   integer,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "failed_jobs" (
    "id"         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "uuid"       varchar NOT NULL,
    "connection" text NOT NULL,
    "queue"      text NOT NULL,
    "payload"    text NOT NULL,
    "exception"  text NOT NULL,
    "failed_at"  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "failed_jobs" ("uuid");

CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
    "id"             integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "tokenable_type" varchar NOT NULL,
    "tokenable_id"   integer NOT NULL,
    "name"           text NOT NULL,
    "token"          varchar NOT NULL,
    "abilities"      text,
    "last_used_at"   datetime,
    "expires_at"     datetime,
    "created_at"     datetime,
    "updated_at"     datetime
);
CREATE INDEX        "personal_access_tokens_tokenable_type_tokenable_id_index" ON "personal_access_tokens" ("tokenable_type", "tokenable_id");
CREATE UNIQUE INDEX "personal_access_tokens_token_unique"                     ON "personal_access_tokens" ("token");
CREATE INDEX        "personal_access_tokens_expires_at_index"                 ON "personal_access_tokens" ("expires_at");

-- -----------------------------------------------------------------------------
-- Domain tables
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "movements" (
    "id"         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name"       varchar NOT NULL,
    "order"      integer NOT NULL DEFAULT '0',
    "video_url"  varchar,
    "created_at" datetime,
    "updated_at" datetime
);

CREATE TABLE IF NOT EXISTS "body_zones" (
    "id"         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name"       varchar NOT NULL,
    "slug"       varchar NOT NULL,
    "side"       varchar NOT NULL,
    "created_at" datetime,
    "updated_at" datetime
);
CREATE UNIQUE INDEX "body_zones_slug_unique" ON "body_zones" ("slug");

CREATE TABLE IF NOT EXISTS "organisations" (
    "id"         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name"       varchar NOT NULL,
    "created_at" datetime,
    "updated_at" datetime
);
CREATE UNIQUE INDEX "organisations_name_unique" ON "organisations" ("name");

CREATE TABLE IF NOT EXISTS "subjects" (
    "id"              integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "subject_id"      varchar NOT NULL,
    "organisation"    varchar,
    "job_role"        varchar,
    "created_at"      datetime,
    "updated_at"      datetime,
    "organisation_id" integer,
    FOREIGN KEY ("organisation_id") REFERENCES "organisations" ("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX "subjects_subject_id_unique" ON "subjects" ("subject_id");

CREATE TABLE IF NOT EXISTS "garments" (
    "id"              integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name"            varchar NOT NULL,
    "created_at"      datetime,
    "updated_at"      datetime,
    "organisation_id" integer,
    FOREIGN KEY ("organisation_id") REFERENCES "organisations" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "sizes" (
    "id"         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "garment_id" integer NOT NULL,
    "name"       varchar NOT NULL,
    "created_at" datetime,
    "updated_at" datetime,
    FOREIGN KEY ("garment_id") REFERENCES "garments" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "assessment_sessions" (
    "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "subject_id"   integer NOT NULL,
    "garment_id"   integer NOT NULL,
    "size_id"      integer NOT NULL,
    "started_at"   datetime,
    "completed_at" datetime,
    "created_at"   datetime,
    "updated_at"   datetime,
    "feedback"     text,
    FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("garment_id") REFERENCES "garments" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("size_id")    REFERENCES "sizes"    ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "movement_responses" (
    "id"                    integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "assessment_session_id" integer NOT NULL,
    "movement_id"           integer NOT NULL,
    "no_issues"             tinyint(1) NOT NULL DEFAULT '0',
    "created_at"            datetime,
    "updated_at"            datetime,
    FOREIGN KEY ("assessment_session_id") REFERENCES "assessment_sessions" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("movement_id")           REFERENCES "movements"           ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "movement_responses_assessment_session_id_movement_id_unique"
    ON "movement_responses" ("assessment_session_id", "movement_id");

CREATE TABLE IF NOT EXISTS "movement_response_zones" (
    "id"                   integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "movement_response_id" integer NOT NULL,
    "body_zone_id"         integer NOT NULL,
    "created_at"           datetime,
    "updated_at"           datetime,
    "severity"             varchar,
    "restriction"          integer,
    "discomfort"           integer,
    "comments"             text,
    FOREIGN KEY ("movement_response_id") REFERENCES "movement_responses" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("body_zone_id")         REFERENCES "body_zones"         ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "movement_response_zones_movement_response_id_body_zone_id_unique"
    ON "movement_response_zones" ("movement_response_id", "body_zone_id");

-- -----------------------------------------------------------------------------
-- Reference seed data
--   Mirrors migration: 2026_03_20_130000_seed_reference_data_movements_and_body_zones
-- -----------------------------------------------------------------------------

INSERT INTO "movements" ("name", "order", "video_url", "created_at", "updated_at") VALUES
    ('Arms Raised',          1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Squat',                2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Toe Touch',            3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Step Up Ladder Reach', 4, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Seatbelt reach',       5, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "body_zones" ("name", "slug", "side", "created_at", "updated_at") VALUES
    ('Head/Face',              'front-head-face',          'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Right shoulder',         'front-right-shoulder',     'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Left shoulder',          'front-left-shoulder',      'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Right wrist',            'front-right-wrist',        'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lower torso and crotch', 'front-lower-torso-crotch', 'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Left wrist',             'front-left-wrist',         'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Thighs',                 'front-thighs',             'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Right shin and ankle',   'front-right-shin-ankle',   'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Left shin and ankle',    'front-left-shin-ankle',    'front', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Head/Face',              'back-head-face',           'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Left shoulder',          'back-left-shoulder',       'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Right shoulder',         'back-right-shoulder',      'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Left wrist',             'back-left-wrist',          'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lower torso and crotch', 'back-lower-torso-crotch',  'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Right wrist',            'back-right-wrist',         'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Thighs',                 'back-thighs',              'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Left shin and ankle',    'back-left-shin-ankle',     'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Right shin and ankle',   'back-right-shin-ankle',    'back',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Head',                   'side-head',                'side',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Shoulder and top arm',   'side-shoulder-top-arm',    'side',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hips and wrist',         'side-hips-wrist',          'side',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lower legs',             'side-lower-legs',          'side',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;

PRAGMA foreign_keys = ON;
