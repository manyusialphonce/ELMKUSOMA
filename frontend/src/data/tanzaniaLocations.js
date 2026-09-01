export const TANZANIA_REGIONS = [
'Arusha',
'Dar es Salaam',
'Dodoma',
'Geita',
'Iringa',
'Kagera',
'Katavi',
'Kigoma',
'Kilimanjaro',
'Lindi',
'Manyara',
'Mara',
'Mbeya',
'Morogoro',
'Mtwara',
'Mwanza',
'Njombe',
'Pemba North',
'Pemba South',
'Pwani',
'Rukwa',
'Ruvuma',
'Shinyanga',
'Simiyu',
'Singida',
'Songwe',
'Tabora',
'Tanga',
'Unguja North',
'Unguja South',
'Zanzibar West',
];

export const TANZANIA_LOCATIONS = {
Arusha: [
'Arusha City',
'Arusha District',
'Karatu',
'Longido',
'Meru',
'Monduli',
'Ngorongoro',
],

'Dar es Salaam': [
'Ilala',
'Kinondoni',
'Kigamboni',
'Temeke',
'Ubungo',
],

Dodoma: [
'Bahi',
'Chamwino',
'Chemba',
'Dodoma City',
'Kondoa',
'Kongwa',
'Mpwapwa',
],

Geita: [
'Bukombe',
'Chato',
'Geita',
'Mbogwe',
'Nyanghwale',
],

Iringa: [
'Iringa District',
'Iringa Urban',
'Kilolo',
'Mufindi',
],

Kagera: [
'Biharamulo',
'Bukoba District',
'Bukoba Urban',
'Karagwe',
'Kyerwa',
'Missenyi',
'Muleba',
'Ngara',
],

Katavi: [
'Mlele',
'Mpanda',
'Tanganyika',
],

Kigoma: [
'Buhigwe',
'Kakonko',
'Kasulu',
'Kibondo',
'Kigoma District',
'Kigoma Urban',
'Uvinza',
],

Kilimanjaro: [
'Hai',
'Moshi District',
'Moshi Urban',
'Mwanga',
'Rombo',
'Same',
'Siha',
],

Lindi: [
'Kilwa',
'Lindi District',
'Lindi Urban',
'Liwale',
'Nachingwea',
'Ruangwa',
],

Manyara: [
'Babati',
'Hanang',
'Kiteto',
'Mbulu',
'Simanjiro',
],

Mara: [
'Bunda',
'Butiama',
'Musoma District',
'Musoma Urban',
'Rorya',
'Serengeti',
'Tarime',
],

Mbeya: [
'Busokelo',
'Chunya',
'Kyela',
'Mbeya District',
'Mbeya Urban',
'Rungwe',
],

Morogoro: [
'Gairo',
'Ifakara',
'Kilombero',
'Kilosa',
'Malinyi',
'Morogoro District',
'Morogoro Urban',
'Mvomero',
'Ulanga',
],

Mtwara: [
'Masasi District',
'Masasi Urban',
'Mtwara District',
'Mtwara Urban',
'Nanyumbu',
'Newala',
'Tandahimba',
],

Mwanza: [
'Buchosa',
'Ilemela',
'Kwimba',
'Magu',
'Misungwi',
'Nyamagana',
'Sengerema',
'Ukerewe',
],

Njombe: [
'Ludewa',
'Makambako',
'Makete',
'Njombe District',
'Njombe Urban',
'Wangingombe',
],

'Pemba North': [
'Micheweni',
'Wete',
],

'Pemba South': [
'Chake Chake',
'Mkoani',
],

Pwani: [
'Bagamoyo',
'Kibaha District',
'Kibaha Town',
'Kisarawe',
'Mafia',
'Mkuranga',
'Rufiji',
],

Rukwa: [
'Kalambo',
'Nkasi',
'Sumbawanga District',
'Sumbawanga Urban',
],

Ruvuma: [
'Mbinga',
'Namtumbo',
'Nyasa',
'Songea District',
'Songea Urban',
'Tunduru',
],

Shinyanga: [
'Kahama',
'Kishapu',
'Msalala',
'Shinyanga District',
'Shinyanga Urban',
'Ushetu',
],

Simiyu: [
'Bariadi',
'Busega',
'Itilima',
'Maswa',
'Meatu',
],

Singida: [
'Ikungi',
'Iramba',
'Itigi',
'Manyoni',
'Mkalama',
'Singida District',
'Singida Urban',
],

Songwe: [
'Ileje',
'Mbozi',
'Momba',
'Songwe',
],

Tabora: [
'Igunga',
'Kaliua',
'Nzega',
'Sikonge',
'Tabora Urban',
'Urambo',
'Uyui',
],

Tanga: [
'Bumbuli',
'Handeni',
'Kilindi',
'Korogwe',
'Lushoto',
'Mkinga',
'Muheza',
'Pangani',
'Tanga City',
],

'Unguja North': [
'Kaskazini A',
'Kaskazini B',
],

'Unguja South': [
'Kati',
'Kusini',
],

'Zanzibar West': [
'Magharibi',
'Mjini',
],
};

export function getDistrictsByRegion(region) {
if (!region) {
return [];
}

return TANZANIA_LOCATIONS[region] || [];
}
