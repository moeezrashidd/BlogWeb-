import { bussiness ,food ,tech ,travling ,workout} from "../assets";

export const sliderData = [
{
    title :'💡 “Your Daily Dose of Tech Knowledge”' ,
    desc:'“Stay ahead with the latest trends, tutorials, and insights on AI, software development, gadgets, and everything tech.”',
    img: tech,
    category:"Technology"
},
{
    title :'🌍 “Business Trends That Shape the Future”' ,
    desc:'“Stay updated with the latest in finance, marketing, and global entrepreneurship.”',
    img: bussiness,
    category:"Business & Finance"
},
{
    title :'🍝 “Delicious Recipes Made Simple” ' ,
    desc:'“Cook mouth-watering meals at home with easy, step-by-step recipes for every occasion.”',
    img: food,
    category:"Food & Recipes"
},
{
    title :'🏔️ “Discover the World Beyond Borders”' ,
    desc:'“Explore breathtaking destinations, thrilling adventures, and travel tips for your next journey.”',
    img: travling,
    category:"Travel"
},
{
    title :'🏋️“Build Strength, Build Confidence”' ,
    desc:'“Discover effective workouts, tips, and routines to push past limits and achieve your fitness goals.”',
    img: workout,
    category:"Sports & Fitness"
},
]
export const categories = [
    "Technology",
    "Business & Finance",
    "Education & Learning",
    "Health & Wellness",
    "Lifestyle",
    "Food & Recipes",
    "Travel",
    "Entertainment",
    "Fashion & Beauty",
    "Creative Arts",
    "Science & Knowledge",
    "Sports & Fitness",
    "Environment & Social"
  ];
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";
import { SiFiverr, SiUpwork, SiTiktok } from "react-icons/si";
export const footerLinks = [
  {
    id: 1,
    name: "GitHub",
    href: "https://github.com/moeezrashid",
    icon: FaGithub,
  },
  {
    id: 2,
    name: "YouTube",
    href: "https://github.com/",
    icon: FaYoutube,
  },
  {
    id: 3,
    name: "Facebook",
    href: "https://github.com/", 
    icon: FaFacebook,
  },
  {
    id: 4,
    name: "Instagram",
    href: "https://www.instagram.com/moeezrashidd",
    icon: FaInstagram,
  },
  {
    id: 5,
    name: "LinkedIn",
    href: "https://linkedin.com/", 
    icon: FaLinkedin,
  },
  {
    id: 6,
    name: "Twitter",
    href: "https://twitter.com/", 
    icon: FaTwitter,
  },
  {
    id: 7,
    name: "Fiverr",
    href: "https://www.fiverr.com/moeezrashidd/",
    icon: SiFiverr,
  },
  {
    id: 8,
    name: "Upwork",
    href: "https://twitter.com/", 
    icon: SiUpwork,
  },
  {
    id: 9,
    name: "TikTok",
    href: "https://www.tiktok.com/@moeezzrashid",
    icon: SiTiktok,
  },
];