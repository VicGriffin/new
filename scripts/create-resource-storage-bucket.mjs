import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = "resource_files";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const main = async () => {
  const { data: bucket, error: getBucketError } = await supabase.storage.getBucket(BUCKET_NAME);
  if (getBucketError && getBucketError.status !== 404) {
    throw getBucketError;
  }

  if (bucket) {
    console.log(`Bucket already exists: ${BUCKET_NAME}`);
    return;
  }

  const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, { public: false });
  if (error) throw error;
  console.log(`Created private storage bucket: ${BUCKET_NAME}`);
  console.log(data);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
