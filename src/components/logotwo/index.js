import { motion } from "framer-motion";
import "./styles.css";

function Logo(props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{duration: 1,type:"spring",damping:5,stiffness:150,delay:0.9 }}
      className="container-logo-two"
    >
      <h1 className="logo-two">
        {props.nameone}
        <span className="logo-two-text">{props.nametwo}</span>
      </h1>
    </motion.div>
  );
}

export default Logo;
