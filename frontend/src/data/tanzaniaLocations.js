// Tanzania Regions and Districts
// Used for Country → Region → District dropdowns

export const TANZANIA_LOCATIONS = {
  "Arusha": [
    "Arusha City",
    "Arusha District",
    "Karatu",
    "Longido",
    "Meru",
    "Monduli",
    "Ngorongoro"
  ],

  "Dar es Salaam": [
    "Ilala",
    "Kigamboni",
    "Kinondoni",
    "Temeke",
    "Ubungo"
  ],

  "Dodoma": [
    "Bahi",
    "Chamwino",
    "Chemba",
    "Dodoma City",
    "Kondoa",
    "Kongwa",
    "Mpwapwa"
  ],

  "Geita": [
    "Bukombe",
    "Chato",
    "Geita",
    "Mbogwe",
    "Nyang'hwale"
  ],

  "Iringa": [
    "Iringa City",
    "Iringa District",
    "Kilolo",
    "Mufindi"
  ],

  "Kagera": [
    "Biharamulo",
    "Bukoba",
    "Bukoba Municipal",
    "Karagwe",
    "Kyerwa",
    "Missenyi",
    "Muleba",
    "Ngara"
  ],

  "Katavi": [
    "Mlele",
    "Mpanda",
    "Nsimbo"
  ],

  "Kigoma": [
    "Buhigwe",
    "Kakonko",
    "Kasulu",
    "Kasulu Town",
    "Kibondo",
    "Kigoma",
    "Kigoma-Ujiji",
    "Uvinza"
  ],

  "Kilimanjaro": [
    "Hai",
    "Moshi",
    "Moshi Municipal",
    "Mwanga",
    "Rombo",
    "Same",
    "Siha"
  ],

  "Lindi": [
    "Kilwa",
    "Lindi",
    "Lindi Municipal",
    "Liwale",
    "Nachingwea",
    "Ruangwa"
  ],

  "Manyara": [
    "Babati",
    "Babati Town",
    "Hanang",
    "Kiteto",
    "Mbulu",
    "Mbulu Town",
    "Simanjiro"
  ],

  "Mara": [
    "Bunda",
    "Bunda Town",
    "Butiama",
    "Musoma",
    "Musoma Municipal",
    "Rorya",
    "Serengeti",
    "Tarime",
    "Tarime Town"
  ],

  "Mbeya": [
    "Busokelo",
    "Chunya",
    "Kyela",
    "Mbarali",
    "Mbeya",
    "Mbeya City",
    "Rungwe"
  ],

  "Morogoro": [
    "Gairo",
    "Kilombero",
    "Kilosa",
    "Malinyi",
    "Morogoro",
    "Morogoro Municipal",
    "Mvomero",
    "Ulanga"
  ],

  "Mtwara": [
    "Masasi",
    "Masasi Town",
    "Mtwara",
    "Mtwara-Mikindani",
    "Nanyumbu",
    "Newala",
    "Tandahimba"
  ],

  "Mwanza": [
    "Ilemela",
    "Kwimba",
    "Magu",
    "Misungwi",
    "Mwanza City",
    "Sengerema",
    "Ukerewe"
  ],

  "Njombe": [
    "Ludewa",
    "Makete",
    "Makambako Town",
    "Njombe",
    "Njombe Town",
    "Wanging'ombe"
  ],

  "Pwani": [
    "Bagamoyo",
    "Chalinze",
    "Kibaha",
    "Kibaha Town",
    "Kisarawe",
    "Mafia",
    "Mkuranga",
    "Rufiji"
  ],

  "Rukwa": [
    "Kalambo",
    "Nkasi",
    "Sumbawanga",
    "Sumbawanga Municipal"
  ],

  "Ruvuma": [
    "Madaba",
    "Mbinga",
    "Mbinga Town",
    "Namtumbo",
    "Nyasa",
    "Songea",
    "Songea Municipal",
    "Tunduru"
  ],

  "Shinyanga": [
    "Kahama",
    "Kahama Town",
    "Kishapu",
    "Msalala",
    "Shinyanga",
    "Shinyanga Municipal",
    "Ushetu"
  ],

  "Simiyu": [
    "Bariadi",
    "Bariadi Town",
    "Busega",
    "Itilima",
    "Maswa",
    "Meatu"
  ],

  "Singida": [
    "Ikungi",
    "Iramba",
    "Manyoni",
    "Mkalama",
    "Singida",
    "Singida Municipal"
  ],

  "Songwe": [
    "Ileje",
    "Mbozi",
    "Momba",
    "Songwe",
    "Tunduma Town"
  ],

  "Tabora": [
    "Igunga",
    "Kaliua",
    "Nzega",
    "Nzega Town",
    "Sikonge",
    "Tabora Municipal",
    "Urambo",
    "Uyui"
  ],

  "Tanga": [
    "Bumbuli",
    "Handeni",
    "Handeni Town",
    "Kilindi",
    "Korogwe",
    "Korogwe Town",
    "Lushoto",
    "Mkinga",
    "Muheza",
    "Pangani",
    "Tanga City"
  ],

  // Zanzibar

  "Kaskazini Unguja": [
    "Kaskazini A",
    "Kaskazini B"
  ],

  "Kusini Unguja": [
    "Kati",
    "Kusini"
  ],

  "Mjini Magharibi": [
    "Magharibi",
    "Mjini"
  ],

  "Kaskazini Pemba": [
    "Micheweni",
    "Wete"
  ],

  "Kusini Pemba": [
    "Chake Chake",
    "Mkoani"
  ]
};


// Get all regions
export const TANZANIA_REGIONS = Object.keys(
  TANZANIA_LOCATIONS
);


// Get districts for selected region
export const getDistrictsByRegion = (region) => {
  return TANZANIA_LOCATIONS[region] || [];
};