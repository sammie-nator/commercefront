// Edit these — they show up across the site.
export const SITE = {
  name: "Mumi Thrifts",
  town: "Embu",
  tagline: "Thrift finds from the heart of Embu",
  email: "hello@mumithrifts.com",
  whatsapp: "", // e.g. "254712345678" — leave empty to hide the WhatsApp buttons
};

export const waLink = (text = "Hi Mumi Thrifts, I'd like to ask about an item") =>
  SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
    : null;

export const SAYINGS = [
  "Haba na haba hujaza kibaba",
  "Mwenda pole hajikwai",
  "Kidogo kidogo, kinakuwa kikubwa",
  "Akiba haiozi",
];
