const treatments = [
  {
    slug: "root-canal",
    title: "Root Canal Treatment",
    intro: "Root canal treatment removes infected tissue from inside a tooth and seals it to prevent reinfection.",
    procedure: "The dentist removes the infected pulp, cleans the canals, shapes them, and fills them before restoring the tooth.",
    benefits: [
      "Relieves pain",
      "Saves the natural tooth",
      "Prevents spread of infection",
    ],
    cost: "$300 - $600",
    faqs: [
      { q: "Is the procedure painful?", a: "Most patients feel minimal discomfort and are numb during the procedure." },
      { q: "How many visits?", a: "Usually 1 to 2 visits depending on complexity." },
    ],
  },

  // Example: add more treatments here; new entries auto-create pages via slug-based routing
];

export default treatments;
