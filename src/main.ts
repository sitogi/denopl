import { parse } from "https://deno.land/std@0.106.0/flags/mod.ts";

const parsedArgs = parse(Deno.args);
if (!parsedArgs.m) {
  console.error("-m is not specified!");
  Deno.exit(1);
}

const apiKey = Deno.env.get("DEEPL_API_KEY");
if (!apiKey) {
  console.error("environment variable DEEPL_API_KEY is not specified!");
  Deno.exit(1);
}

const params = new URLSearchParams({
  auth_key: apiKey,
  text: parsedArgs.m,
  target_lang: parsedArgs.t ?? "EN",
});

// TODO: クエリパラメータ指定じゃなくてちゃんと Body でできないの？ 漏洩するけど
const url = `https://api-free.deepl.com/v2/translate`;
const res = await fetch(`${url}?${params}`);

const body = new Uint8Array(await res.arrayBuffer());

// TODO: 結果のパース
await Deno.stdout.write(body);
