import { motion } from "framer-motion";
import { logo } from "../assets";
import { footerLinks } from "../Context/data.jsx";

const Footer = () => {
  return (
    <motion.footer
      className="w-full  text-black py-8 px-4 md:px-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        
        {/* Logo + Name */}
        <div className="name flex justify-center items-center gap-4">
          <img src={logo} alt="logo" className='lg:w-14 sm:w-12 w-10 cursor-pointer rounded-full border-2 hover:border-blue-500' />
          <span className=' lg:text-2xl xl:3xl text-xl font-semibold cursor-pointer'>MR-<span className="text-blue-600">Blog</span></span>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 text-xl">
          {footerLinks.map(({ id, href, icon: Icon, name }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition duration-300 text-2xl"
              aria-label={name}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <p className="mt-6 text-center text-sm xl:text-base font-medium text-gray-700">
        © {new Date().getFullYear()} <span className="text-blue-800"> Moeez Rashid</span>. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
