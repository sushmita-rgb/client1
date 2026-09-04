// Customer testimonials shown as sticky notes on the home page.
//
// To add one, append an object to this array — the section picks it up
// automatically. Nothing else to touch.
//
//   quote    (required) what they said. Keep it under ~140 characters so the
//                       note stays note-shaped; longer quotes still fit, the
//                       note just grows taller.
//                       Pasting a review that spans several lines? Wrap it in
//                       backticks (`like this`) instead of quotes — a plain
//                       '...' or "..." string cannot contain line breaks and
//                       will fail the build. Line breaks are rendered as-is.
//   name     (required) who said it, e.g. "Ananya S."
//   location (optional) city or handle, e.g. "Mumbai" or "@ananya"
//
// Paper colour, tilt and tape are assigned automatically from the position in
// this array, so the wall stays varied without anyone picking per-note styles.
// Reorder freely; nothing depends on the order.

export const TESTIMONIALS = [
  {
    quote:`Phone charm was really good.. 
Turned out to be just as I expected... Especially the logo of BtS
Thank you so much.... 🤗🤗❤️`,
    name: 'Ananya S.',
    location: 'Mumbai',
  },
  {
    quote: `It is really good 
Especially the color combinations
Thank you so much 🤗🤗`,
    name: 'Riya M.',
    location: 'Pune',
  },
  {
    quote:
      `Thank you for creating such a lovely keepsake😍 I am absolutely delighted with my customized keychain! The personalization is beautifully done, and the special charm makes it feel truly one of a kind💜Additional it looks more beautiful in person
Highly recommended!`,
    name: 'Kavya R.',
    location: 'Jalgaon',
  },
  {
    quote: `Thanks 😊 for this beautiful customised handmade bracelet. It's elegant, looks simple but beautiful and the name in that bracelet is just wow!!
Thank you for such beautiful bracelet .🩷`,
    name: 'Meher T.',
    location: 'Delhi',
  },
  {
    quote:
      `The colour combination is fantastic.The hardwork behind it is clearly seen & i really appreciate the efforts taken by you to make this keychain a best one.overall the keychain is very beautiful and fabulous.Bestest keychain ever got.
Thank you 🤍`,
    name: 'Sanya P.',
    location: 'Bengaluru',
  },

];
