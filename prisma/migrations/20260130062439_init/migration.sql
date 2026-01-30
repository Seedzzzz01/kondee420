-- CreateTable
CREATE TABLE "warranty_models" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand" TEXT NOT NULL,
    "model_key" TEXT NOT NULL,
    "warranty_months" INTEGER,
    "warranty_start_rule_th" TEXT NOT NULL,
    "required_docs_th" TEXT NOT NULL,
    "claim_steps_th" TEXT NOT NULL,
    "coverage_summary_th" TEXT,
    "coverage_detail_th" TEXT,
    "exclude_th" TEXT,
    "notes_th" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "line_id" TEXT,
    "brand" TEXT NOT NULL,
    "model_key" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "purchase_date" DATETIME NOT NULL,
    "purchase_channel" TEXT,
    "order_no" TEXT,
    "issue_description" TEXT NOT NULL,
    "issue_start_date" DATETIME,
    "issue_usage_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "admin_note" TEXT,
    CONSTRAINT "claims_model_key_fkey" FOREIGN KEY ("model_key") REFERENCES "warranty_models" ("model_key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "claim_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claim_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT,
    "file_size" INTEGER,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "claim_attachments_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "claim_status_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claim_id" TEXT NOT NULL,
    "old_status" TEXT NOT NULL,
    "new_status" TEXT NOT NULL,
    "note" TEXT,
    "changed_by" TEXT,
    "changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "claim_status_history_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "warranty_models_model_key_key" ON "warranty_models"("model_key");
