export const site = {
  name: "Andrew's Garage",
  tagline: "Vehicle care, properly explained",
  description:
    "Independent MOT testing, servicing, diagnostics and mechanical repairs in Solihull.",
  phone: "0121 496 0782",
  phoneHref: "tel:+441214960782",
  email: "hello@andrewsgarage.co.uk",
  emailHref: "mailto:hello@andrewsgarage.co.uk",
  address: "42 Station Road, Solihull, B91 3RT",
  shortAddress: "Solihull, West Midlands",
  hours: "Monday–Friday 08:00–18:00 · Saturday 08:00–13:00",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=42+Station+Road%2C+Solihull%2C+B91+3RT",
  mapsEmbed:
    "https://www.google.com/maps?q=42+Station+Road%2C+Solihull%2C+B91+3RT&output=embed",
  url: "https://www.andrewsgarage.co.uk",
} as const;

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Why us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const services = [
  {
    title: "MOT testing",
    description:
      "Thorough MOT testing with clear guidance on anything that needs attention.",
    image: "/images/workshop-hero.png",
    imageAlt: "Vehicle raised on a ramp inside the MOT and service workshop",
  },
  {
    title: "Vehicle servicing",
    description:
      "Routine and scheduled servicing that keeps your vehicle dependable, efficient and ready for the road.",
    image: "/images/workshop-team.png",
    imageAlt: "Mechanics reviewing a vehicle during a workshop service",
  },
  {
    title: "Diagnostics",
    description:
      "Focused fault finding using modern diagnostic equipment, backed by practical mechanical checks.",
    image: "/images/vehicle-diagnostics.png",
    imageAlt: "Mechanic using diagnostic equipment beside a vehicle",
  },
  {
    title: "Brake repairs",
    description:
      "Inspection and repair of pads, discs, callipers and braking components, with no guesswork.",
    image: "/images/workshop-hero.png",
    imageAlt: "Vehicle undergoing careful inspection in the workshop",
  },
  {
    title: "Tyres",
    description:
      "Tyre checks, replacement and balancing to help maintain grip, comfort and even wear.",
    image: "/images/workshop-team.png",
    imageAlt: "Workshop team carrying out a vehicle condition check",
  },
  {
    title: "Suspension",
    description:
      "Diagnosis and repair for knocks, uneven handling, worn components and ride-quality concerns.",
    image: "/images/vehicle-diagnostics.png",
    imageAlt: "Technician investigating a vehicle fault in a modern service bay",
  },
  {
    title: "Exhausts",
    description:
      "Exhaust inspection and repair, from damaged sections and noisy systems to emissions-related faults.",
    image: "/images/workshop-hero.png",
    imageAlt: "Rear of a vehicle raised for inspection inside the garage",
  },
  {
    title: "Clutches",
    description:
      "Straightforward diagnosis and repair for slipping, juddering or difficult gear changes.",
    image: "/images/workshop-team.png",
    imageAlt: "Two mechanics discussing the next stage of a vehicle repair",
  },
  {
    title: "Air conditioning",
    description:
      "System checks and servicing to restore reliable cooling, demisting and cabin comfort.",
    image: "/images/vehicle-diagnostics.png",
    imageAlt: "Mechanic checking vehicle systems with a diagnostic tablet",
  },
  {
    title: "Engine repairs",
    description:
      "Careful investigation and mechanical repair for running issues, leaks, warning lights and unusual noises.",
    image: "/images/workshop-team.png",
    imageAlt: "Mechanics inspecting components beneath an open bonnet",
  },
] as const;

export const reasons = [
  {
    title: "Honest advice",
    description:
      "We explain what we have found, what needs doing now and what can sensibly wait.",
  },
  {
    title: "Clear estimates",
    description:
      "The scope and cost are agreed before work begins, with a call if anything changes.",
  },
  {
    title: "Modern diagnostics",
    description:
      "Up-to-date equipment helps us investigate faults accurately instead of simply swapping parts.",
  },
  {
    title: "Careful workmanship",
    description:
      "Every vehicle receives a methodical inspection and the same attention we would expect ourselves.",
  },
  {
    title: "Practical turnaround",
    description:
      "We plan each booking properly and keep you informed so there are fewer unwelcome surprises.",
  },
  {
    title: "Friendly local service",
    description:
      "Speak directly with the people looking after your vehicle, from first question to collection.",
  },
] as const;

export const faqs = [
  {
    question: "How do I book?",
    answer:
      "Call us, email us or use the enquiry form below. Tell us the vehicle registration, the work you need and the days that suit you, and we will confirm the next available appointment.",
  },
  {
    question: "Do I need an appointment?",
    answer:
      "Booking ahead is the best way to secure workshop time. If something is urgent, call us and we will let you know what is realistically possible.",
  },
  {
    question: "Which vehicles do you work on?",
    answer:
      "We look after most makes and models of cars and light commercial vehicles. For specialist, modified or unusual vehicles, contact us first so we can confirm the right equipment and workshop time.",
  },
  {
    question: "How long does servicing take?",
    answer:
      "Many routine services can be completed within the working day. Timing depends on the vehicle, service schedule and any additional work you approve, so we will confirm this when you book.",
  },
  {
    question: "Do you offer diagnostic checks?",
    answer:
      "Yes. We combine diagnostic equipment with hands-on testing to investigate warning lights, electrical issues, poor running and other faults.",
  },
  {
    question: "Can you provide a quote?",
    answer:
      "Yes. We can estimate known work in advance. Where a fault needs investigation first, we will explain the diagnostic charge and contact you before carrying out further repairs.",
  },
  {
    question: "What parts do you use?",
    answer:
      "We recommend suitable quality parts for the vehicle and the job. Where genuine, OEM or alternative options are available, we will explain the difference before ordering.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept major debit and credit cards, contactless payments and bank transfer. Payment is due when the vehicle is collected unless agreed otherwise.",
  },
] as const;

export const galleryImages = [
  {
    src: "/images/workshop-hero.png",
    alt: "Modern independent workshop with a vehicle raised on a service lift",
    title: "A workshop built for careful work",
  },
  {
    src: "/images/workshop-team.png",
    alt: "Two mechanics reviewing a vehicle inspection together",
    title: "Experience shared across the team",
  },
  {
    src: "/images/vehicle-diagnostics.png",
    alt: "Mechanic carrying out an electronic diagnostic check",
    title: "Fault finding with the right equipment",
  },
] as const;
