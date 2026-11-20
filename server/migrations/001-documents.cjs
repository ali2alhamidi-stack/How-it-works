'use strict';
// Additive, versioned SQLite migration runner. Legacy WOModel schemaVersion stays at 1.
// Do not modify existing tenant/account/session tables or JSON state.
const crypto=require('node:crypto');
const MIGRATIONS=[
 {id:'aw001_interactive_documents',sql:`
 CREATE TABLE IF NOT EXISTS aw_documents (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id TEXT NOT NULL, client_id TEXT NOT NULL, order_id TEXT, type TEXT NOT NULL
  CHECK(type IN ('quote','workshop','delivery','warranty')),
  status TEXT NOT NULL CHECK(status IN ('draft','published','accepted','expired','revoked','completed')),
  current_version_id TEXT, created_by TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  accepted_order_id TEXT, selected_tier TEXT, accepted_total_minor INTEGER,
  currency TEXT NOT NULL CHECK(length(currency)=3),
  UNIQUE(tenant_id,id)
 );
 CREATE INDEX IF NOT EXISTS aw_documents_tenant_branch ON aw_documents(tenant_id,branch_id,created_at);
 CREATE INDEX IF NOT EXISTS aw_documents_order ON aw_documents(tenant_id,order_id);
 CREATE TABLE IF NOT EXISTS aw_document_versions (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL,
  document_id TEXT NOT NULL, version_no INTEGER NOT NULL CHECK(version_no>=1),
  snapshot_json TEXT NOT NULL, sha256 TEXT NOT NULL CHECK(length(sha256)=64),
  created_at TEXT NOT NULL, published_at TEXT, superseded_at TEXT,
  UNIQUE(tenant_id,document_id,version_no),
  FOREIGN KEY(tenant_id,document_id) REFERENCES aw_documents(tenant_id,id) ON DELETE CASCADE
 );
 CREATE INDEX IF NOT EXISTS aw_versions_doc ON aw_document_versions(document_id,version_no DESC);
 CREATE TABLE IF NOT EXISTS aw_document_lines (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, version_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL, item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity>0), unit TEXT NOT NULL,
  width_mm REAL NOT NULL DEFAULT 0, height_mm REAL NOT NULL DEFAULT 0,
  spec_json TEXT NOT NULL, preview_asset_id TEXT,
  unit_amount_minor INTEGER NOT NULL CHECK(unit_amount_minor>=0),
  total_amount_minor INTEGER NOT NULL CHECK(total_amount_minor>=0),currency TEXT NOT NULL,
  FOREIGN KEY(version_id) REFERENCES aw_document_versions(id) ON DELETE CASCADE,
  UNIQUE(version_id,sort_order)
 );
 CREATE TABLE IF NOT EXISTS aw_quote_tiers (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL,version_id TEXT NOT NULL,
  tier_key TEXT NOT NULL,label TEXT NOT NULL,multiplier_bp INTEGER NOT NULL
  CHECK(multiplier_bp>=1000 AND multiplier_bp<=30000),
  FOREIGN KEY(version_id) REFERENCES aw_document_versions(id) ON DELETE CASCADE,
  UNIQUE(version_id,tier_key)
 );
 CREATE TABLE IF NOT EXISTS aw_job_lines (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,branch_id TEXT NOT NULL,
  order_id TEXT NOT NULL,quote_document_id TEXT NOT NULL,quote_line_id TEXT,
  line_specs_json TEXT NOT NULL,quantity INTEGER NOT NULL CHECK(quantity>0),
  production_state TEXT NOT NULL DEFAULT 'queued',created_at TEXT NOT NULL,
  UNIQUE(tenant_id,quote_document_id,quote_line_id),
  FOREIGN KEY(quote_document_id) REFERENCES aw_documents(id)
 );
 CREATE INDEX IF NOT EXISTS aw_job_lines_order ON aw_job_lines(tenant_id,order_id);
 CREATE TABLE IF NOT EXISTS aw_document_links (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,document_id TEXT NOT NULL,
  version_id TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK(purpose IN ('quote','workshop','delivery','warranty')),
  expires_at TEXT NOT NULL,revoked_at TEXT,max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(version_id) REFERENCES aw_document_versions(id),
  FOREIGN KEY(document_id) REFERENCES aw_documents(id)
 );
 CREATE INDEX IF NOT EXISTS aw_document_links_doc ON aw_document_links(tenant_id,document_id);
 CREATE TABLE IF NOT EXISTS aw_document_events (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,document_id TEXT NOT NULL,
  version_id TEXT,actor_kind TEXT NOT NULL,actor_id TEXT,
  event TEXT NOT NULL,event_json TEXT NOT NULL,occurred_at TEXT NOT NULL,
  request_id TEXT, UNIQUE(document_id,event,request_id),
  FOREIGN KEY(document_id) REFERENCES aw_documents(id)
 );
 CREATE INDEX IF NOT EXISTS aw_events_doc ON aw_document_events(document_id,occurred_at);
 CREATE TABLE IF NOT EXISTS aw_assets (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id TEXT,storage_key TEXT NOT NULL UNIQUE,mime TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK(byte_size>=0),sha256 TEXT NOT NULL,
  purpose TEXT NOT NULL,created_by TEXT,created_at TEXT NOT NULL,deleted_at TEXT
 );
 CREATE INDEX IF NOT EXISTS aw_assets_tenant ON aw_assets(tenant_id,created_at);
 CREATE TABLE IF NOT EXISTS aw_signatures (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,document_id TEXT NOT NULL,
  version_id TEXT NOT NULL,signer_name TEXT NOT NULL,
  consent_text_hash TEXT NOT NULL,signature_asset_id TEXT NOT NULL,
  document_hash TEXT NOT NULL,signed_at_utc TEXT NOT NULL,
  request_ip_encrypted TEXT,user_agent TEXT,
  verification_method TEXT NOT NULL,verification_state TEXT NOT NULL,
  FOREIGN KEY(signature_asset_id) REFERENCES aw_assets(id),
  FOREIGN KEY(document_id) REFERENCES aw_documents(id),
  FOREIGN KEY(version_id) REFERENCES aw_document_versions(id)
 );
 CREATE INDEX IF NOT EXISTS aw_signatures_doc ON aw_signatures(tenant_id,document_id);
 CREATE TABLE IF NOT EXISTS aw_delivery_checks (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,order_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,checklist_json TEXT NOT NULL,
  before_asset_id TEXT,after_asset_id TEXT,night_asset_id TEXT,
  requires_night INTEGER NOT NULL DEFAULT 0,recipient_signature_id TEXT,
  recipient_name TEXT,verified_by TEXT,verified_at TEXT,updated_at TEXT NOT NULL,
  UNIQUE(tenant_id,order_id),
  FOREIGN KEY(before_asset_id) REFERENCES aw_assets(id),
  FOREIGN KEY(after_asset_id) REFERENCES aw_assets(id),
  FOREIGN KEY(night_asset_id) REFERENCES aw_assets(id),
  FOREIGN KEY(recipient_signature_id) REFERENCES aw_assets(id)
 );
 CREATE TABLE IF NOT EXISTS aw_warranties (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,order_id TEXT NOT NULL UNIQUE,
  document_id TEXT NOT NULL,start_at TEXT NOT NULL,end_at TEXT NOT NULL,
  coverage_json TEXT NOT NULL,status TEXT NOT NULL,service_contact TEXT,
  source_delivery_id TEXT NOT NULL,created_at TEXT NOT NULL,
  FOREIGN KEY(document_id) REFERENCES aw_documents(id),
  FOREIGN KEY(source_delivery_id) REFERENCES aw_delivery_checks(id)
 );
 CREATE TABLE IF NOT EXISTS aw_tracking_events (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,order_id TEXT NOT NULL,
  public_stage TEXT NOT NULL,occurred_at TEXT NOT NULL,eta_at TEXT,
  display_text TEXT NOT NULL
 );
 CREATE INDEX IF NOT EXISTS aw_track_events_order ON aw_tracking_events(tenant_id,order_id,occurred_at);
 CREATE TABLE IF NOT EXISTS aw_tracking_links (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,order_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,revoked_at TEXT,
  scope TEXT NOT NULL DEFAULT 'status',created_at TEXT NOT NULL
 );
 CREATE INDEX IF NOT EXISTS aw_tracking_links_order ON aw_tracking_links(tenant_id,order_id);
 CREATE TABLE IF NOT EXISTS aw_payment_evidence (
  id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,order_id TEXT,
  quote_document_id TEXT NOT NULL,asset_id TEXT NOT NULL,
  claimed_amount_minor INTEGER NOT NULL CHECK(claimed_amount_minor>=0),
  currency TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'unverified'
  CHECK(status IN ('unverified','approved','rejected')),
  reviewed_by TEXT,reviewed_at TEXT,created_at TEXT NOT NULL,
  FOREIGN KEY(quote_document_id) REFERENCES aw_documents(id),
  FOREIGN KEY(asset_id) REFERENCES aw_assets(id)
 );
 CREATE INDEX IF NOT EXISTS aw_evidence_tenant ON aw_payment_evidence(tenant_id,status);
 `}
];
function applyMigrations(db){
 db.exec('CREATE TABLE IF NOT EXISTS aw_schema_migrations (id TEXT PRIMARY KEY,checksum TEXT NOT NULL,applied_at TEXT NOT NULL)');
 const health=db.prepare('PRAGMA integrity_check').get();
 if(Object.values(health)[0]!=='ok')throw Error('Database failed integrity_check; refusing AWAMER migration');
 for(const m of MIGRATIONS){
  const checksum=crypto.createHash('sha256').update(m.sql).digest('hex');
  const old=db.prepare('SELECT checksum FROM aw_schema_migrations WHERE id=?').get(m.id);
  if(old){if(old.checksum!==checksum)throw Error('AWAMER migration checksum mismatch: '+m.id);continue;}
  db.exec('BEGIN IMMEDIATE');
  try{
   db.exec(m.sql);
   db.prepare('INSERT INTO aw_schema_migrations(id,checksum,applied_at) VALUES(?,?,?)')
     .run(m.id,checksum,new Date().toISOString());
   db.exec('COMMIT');
  }catch(error){db.exec('ROLLBACK');throw error;}
 }
}
module.exports={applyMigrations,MIGRATIONS};
