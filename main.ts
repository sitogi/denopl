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

  const url = `https://api-free.deepl.com/v2/translate`;

  const formData = new FormData();
  formData.set("auth_key", apiKey);
  formData.set("text", parsedArgs.m);
  formData.set("target_lang", parsedArgs.t ?? "EN");

  const res = await fetch(url, { method: "POST", body: formData });

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
