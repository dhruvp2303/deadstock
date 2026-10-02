# DeadStock — Rebuild Baseline & Rollback Protocol

## 1. System State & Checkpoint Log

### Phase 1 Baseline Checkpoint
- **Baseline Git Commit:** `466fbf93eee89ad152dc11d14a1d9572e9f36999`
- **Rebuild Branch:** `rebuild/baseline-verified`
- **Timestamp:** 2026-10-02T13:36:00+05:30
- **Database Engine:** SQLite
- **Database File:** `backend/database/database.sqlite` (188,416 bytes)
- **Database Backup:** `backend/database/database.sqlite.backup.20261002-133600` (188,416 bytes, Verified)

### Phase 2 Cleanup Checkpoint
- **Git Commit:** `54ba8b28411f2f6f53f4c12bcf45f99ece0c4001` (`checkpoint: cleanup-complete`)
- **Actions:** Purged 25 legacy landing components and adapters; extracted domain custom hooks; verified `npm run build` and `php artisan test`.

### Phase 3 Database Enhancement Checkpoint
- **Pre-Phase 3 Backup:** `backend/database/database.sqlite.backup.pre-phase3.20261002-134400` (188,416 bytes, Verified)
- **New Tables Added:**
  1. `categories` (slug index, decay rate, description)
  2. `warehouses` (company-scoped foreign key, soft deletes)
  3. `buyer_requirements` (company and category foreign keys, budget, condition JSON)
- **Modified Tables:**
  1. `inventories` (added nullable `category_id`, `warehouse_id`, compound indexes, soft deletes)
  2. `companies` (added `softDeletes`)
- **Backfill Result:** 5/5 (100%) inventory items mapped to relational `Category` and company-scoped `Warehouse` entities with 0 unmapped records.
- **Migration Status:** 22 total migrations active across Batches 1–6.
- **Backend Tests:** 18 passed (96 assertions) in `php artisan test`.
- **Frontend Build:** `next build` passed in 1.9s.

---

## 2. Active Migrations Sequence (All Ran)
1. `0001_01_01_000000_create_users_table` (Batch 1)
2. `0001_01_01_000001_create_cache_table` (Batch 1)
3. `0001_01_01_000002_create_jobs_table` (Batch 1)
4. `2026_09_14_000001_create_companies_table` (Batch 3)
5. `2026_09_14_000002_add_company_id_to_users_table` (Batch 3)
6. `2026_09_14_000003_create_inventories_table` (Batch 3)
7. `2026_09_14_000004_create_inventory_movements_table` (Batch 3)
8. `2026_09_14_000005_create_buyer_matches_table` (Batch 3)
9. `2026_09_14_000006_create_marketplace_listings_table` (Batch 3)
10. `2026_09_14_000007_create_recovery_actions_table` (Batch 3)
11. `2026_09_14_000008_create_notifications_table` (Batch 3)
12. `2026_09_14_000009_create_demo_requests_table` (Batch 3)
13. `2026_09_14_000010_create_ai_interactions_table` (Batch 3)
14. `2026_09_14_000011_create_transactions_table` (Batch 4)
15. `2026_09_14_000012_create_offers_table` (Batch 4)
16. `2026_09_14_160749_create_personal_access_tokens_table` (Batch 2)
17. `2026_10_02_000001_create_categories_table` (Batch 5)
18. `2026_10_02_000002_create_warehouses_table` (Batch 5)
19. `2026_10_02_000003_create_buyer_requirements_table` (Batch 5)
20. `2026_10_02_000004_add_category_and_warehouse_ids_to_inventories_table` (Batch 5)
21. `2026_10_02_000005_backfill_categories_and_warehouses_data` (Batch 5)
22. `2026_10_02_000006_add_deleted_at_to_companies_table` (Batch 6)

---

## 3. Rollback Instructions

### Rollback to Pre-Phase 3 Database State:
```powershell
Copy-Item -Path "backend/database/database.sqlite.backup.pre-phase3.20261002-134400" -Destination "backend/database/database.sqlite" -Force
```

### Rollback Codebase:
```bash
git checkout rebuild/baseline-verified
git reset --hard 54ba8b28411f2f6f53f4c12bcf45f99ece0c4001
```
