import { parse } from "https://deno.land/std@0.106.0/flags/mod.ts";

try {
  const parsedArgs = parse(Deno.args);
  if (!parsedArgs.m) {
    throw new Error("-m is not specified!");
  }

  const apiKey = Deno.env.get("DEEPL_API_KEY");
  if (!apiKey) {
    throw new Error("environment variable DEEPL_API_KEY is not specified!");
  }

  const params = new URLSearchParams({
    auth_key: apiKey,
    text: parsedArgs.m,
    target_lang: parsedArgs.t ?? "EN",
  });

  // TODO: クエリパラメータ指定じゃなくてちゃんと Body でできないの？ 漏洩するけど
  const url = `https://api-free.deepl.com/v2/translate`;
  const res = await fetch(`${url}?${params}`);

  const json = await res.json();
  const translated = json.translations[0].text;

  const outputForAlfred = {
    items: [
      {
        arg: translated,
        title: translated,
        subtitle: translated,
      },
    ],
  };
  console.log(JSON.stringify(outputForAlfred));
} catch (e) {
  if (e instanceof Error) {
    const outputForAlfred = {
      items: [{ title: "Error", subtitle: String(e) }],
    };
    console.log(JSON.stringify(outputForAlfred));
  } else {
    const outputForAlfred = {
      items: [{ title: "Error", subtitle: "unexpected error" }],
    };
    console.log(JSON.stringify(outputForAlfred));
  }
  Deno.exit(1);
}
