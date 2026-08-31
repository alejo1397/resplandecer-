import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "imagenes";

async function main() {
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Listar buckets existentes
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error("Error listando buckets:", listErr.message);
    process.exit(1);
  }

  const existe = buckets?.some((b) => b.name === BUCKET);
  if (existe) {
    console.log(`El bucket "${BUCKET}" ya existe.`);
  } else {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
    });
    if (error) {
      console.error("Error creando bucket:", error.message);
      process.exit(1);
    }
    console.log(`Bucket "${BUCKET}" creado (publico).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
