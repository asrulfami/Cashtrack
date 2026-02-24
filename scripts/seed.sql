-- Seed script SQL untuk CashTrack
-- Menambahkan user default dan kategori

-- Insert default user (akan di-skip jika sudah ada)
INSERT INTO "User" (id, email, name, "createdAt", "updatedAt")
SELECT 
  'default-user-id',
  'demo@cashtrack.local',
  'Demo User',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE email = 'demo@cashtrack.local');

-- Get the user ID
DO $$
DECLARE
  user_id TEXT;
BEGIN
  SELECT id INTO user_id FROM "User" WHERE email = 'demo@cashtrack.local';
  
  -- Insert income categories
  INSERT INTO "Category" (id, name, type, "userId") VALUES
    (gen_random_uuid()::TEXT, 'Gaji', 'income', user_id),
    (gen_random_uuid()::TEXT, 'Penjualan', 'income', user_id),
    (gen_random_uuid()::TEXT, 'Investasi', 'income', user_id),
    (gen_random_uuid()::TEXT, 'Freelance', 'income', user_id),
    (gen_random_uuid()::TEXT, 'Hadiah', 'income', user_id),
    (gen_random_uuid()::TEXT, 'Lain-lain', 'income', user_id)
  ON CONFLICT DO NOTHING;
  
  -- Insert expense categories
  INSERT INTO "Category" (id, name, type, "userId") VALUES
    (gen_random_uuid()::TEXT, 'Kebutuhan', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Tagihan', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Makanan', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Transportasi', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Hiburan', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Kesehatan', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Pendidikan', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Belanja', 'expense', user_id),
    (gen_random_uuid()::TEXT, 'Lainnya', 'expense', user_id)
  ON CONFLICT DO NOTHING;
END $$;
